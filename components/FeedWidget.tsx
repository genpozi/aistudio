import React, { useState, useEffect, useCallback } from 'react';
import { ICONS, CORS_PROXY_URL } from '../constants';
import type { FeedItem, UserFeed } from '../types';

// A simple utility to get text content from a DOM element, trying multiple selectors.
const getText = (element: Element, selectors: string[]): string => {
  for (const selector of selectors) {
    const content = element.querySelector(selector)?.textContent;
    if (content) return content.trim();
  }
  return '';
};

// Gets an attribute from an element, trying multiple selectors.
const getAttribute = (element: Element, selectors: string[], attribute: string): string => {
    for (const selector of selectors) {
        const selectedElement = element.querySelector(selector);
        if (selectedElement && selectedElement.hasAttribute(attribute)) {
            return selectedElement.getAttribute(attribute) || '';
        }
    }
    return '';
}

// Parses an XML string into a structured feed object.
const parseFeed = (xmlString: string): { feedTitle: string; items: Omit<FeedItem, 'source'>[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Failed to parse XML feed.');
  }

  // RSS Feed Parsing
  const feedTitle = doc.querySelector('channel > title')?.textContent ?? 'Untitled Feed';
  const entries = Array.from(doc.querySelectorAll('item'));
  const items = entries.map(item => ({
    title: getText(item, ['title']),
    link: getText(item, ['link']),
    pubDate: getText(item, ['pubDate', 'dc\\:date']),
    author: getText(item, ['author', 'dc\\:creator']),
    thumbnailUrl: getAttribute(item, ['enclosure', 'media\\:content', 'media\\:thumbnail'], 'url'),
  }));
  return { feedTitle, items };
};


// Helper to calculate time since a date string
const timeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString.replace(/-/g, '/')); // Improve date parsing compatibility
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

    if (seconds < 60) {
      return 'Just now';
    }

    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) {
      return `${minutes}m ago`;
    }

    const hours = Math.floor(minutes / 60);
    if (hours < 24) {
      return `${hours}h ago`;
    }

    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch (e) {
    return 'a while ago';
  }
};

interface FeedWidgetProps {
  className?: string;
  feedUrls: UserFeed[];
  onOpenSettings: () => void;
}

const FeedWidget: React.FC<FeedWidgetProps> = ({ className, feedUrls, onOpenSettings }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFeeds = useCallback(async () => {
    if (!feedUrls || feedUrls.length === 0) {
      setItems([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    const fetchAndParse = async (feed: UserFeed): Promise<{ feedTitle: string; items: Omit<FeedItem, 'source'>[] }> => {
      try {
        const response = await fetch(`${CORS_PROXY_URL}${feed.url}`);
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status} for feed: ${feed.url}`);
        }
        const text = await response.text();
        return parseFeed(text);
      } catch (err) {
        throw new Error(`Failed to fetch or parse feed ${feed.url}: ${err instanceof Error ? err.message : String(err)}`);
      }
    };

    const promises = feedUrls.map(fetchAndParse);
    const results = await Promise.allSettled(promises);
    
    const newItems: FeedItem[] = [];
    let hasErrors = false;
    results.forEach(result => {
      if (result.status === 'fulfilled') {
        const { feedTitle, items } = result.value;
        items.forEach(item => {
          newItems.push({
            ...item,
            source: feedTitle,
          });
        });
      } else { // result.status === 'rejected'
        console.error("Feed fetch failed:", result.reason?.message || result.reason);
        hasErrors = true;
      }
    });

    if (hasErrors) {
        setError("Some feeds could not be loaded. Please check the URLs and your network connection.");
    }

    // Sort all items by publication date, descending, safely handling invalid dates.
    newItems.sort((a, b) => {
        const dateA = new Date(a.pubDate);
        const dateB = new Date(b.pubDate);
        // Treat invalid dates as older than any valid date
        const timeA = !isNaN(dateA.getTime()) ? dateA.getTime() : 0;
        const timeB = !isNaN(dateB.getTime()) ? dateB.getTime() : 0;
        return timeB - timeA;
    });

    setItems(newItems.slice(0, 20)); // Limit to latest 20 items
    setIsLoading(false);
  }, [feedUrls]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex-grow flex items-center justify-center min-h-[200px]"><p className="text-white/70">Loading news...</p></div>;
    }
    if (error && items.length === 0) {
        return <div className="flex-grow flex items-center justify-center text-center p-4 min-h-[200px]"><p className="text-red-400/80">{error}</p></div>
    }
    if (feedUrls.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center min-h-[200px]">
                <p className="text-white/70 mb-4">No RSS feeds configured.</p>
                <button onClick={onOpenSettings} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg">
                    Configure Feeds
                </button>
            </div>
        );
    }
    if (items.length === 0 && !error) {
        return <div className="flex-grow flex items-center justify-center min-h-[200px]"><p className="text-white/70">No news items found.</p></div>
    }
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-4 custom-scrollbar -mr-4 pr-4">
            {items.map((item, index) => (
            <a 
                key={`${item.link}-${index}`}
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block flex-shrink-0 bg-white/5 rounded-lg overflow-hidden border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_-5px_var(--color-glow)]"
            >
                {item.thumbnailUrl && (
                    <div className="relative">
                        <img src={item.thumbnailUrl} alt={item.title} className="w-full h-40 object-cover" />
                    </div>
                )}
                <div className="p-4 flex flex-col h-36 justify-between">
                    <div>
                      <p className="text-white font-semibold text-base leading-tight group-hover:text-[var(--text-highlight)] transition-colors three-line-clamp">
                          {item.title}
                      </p>
                    </div>
                    <div className="flex justify-between items-center text-xs text-white/70 mt-2">
                        <span className="bg-white/10 px-2 py-1 rounded-full font-semibold truncate max-w-[60%]">{item.source}</span>
                        <span>{timeSince(item.pubDate)}</span>
                    </div>
                </div>
            </a>
            ))}
        </div>
    );
  };

  return (
    <div className={`bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col ${className || ''}`}>
      <div className="bg-gradient-to-r from-black/40 to-black/10 px-4 py-3 flex justify-between items-center flex-shrink-0">
        <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">NEWS & ARTICLES (RSS)</h3>
        <div className="flex items-center space-x-2">
            <button onClick={fetchFeeds} disabled={isLoading} className="text-white/60 hover:text-white disabled:opacity-50" aria-label="Refresh feeds">
                {ICONS.Refresh}
            </button>
        </div>
      </div>
      <div className="px-4 pb-0 pt-3 flex-grow flex flex-col min-h-0">
        {error && items.length > 0 && <p className="text-sm text-red-400/80 mb-2">{error}</p>}
        {renderContent()}
      </div>
    </div>
  );
};

export default FeedWidget;