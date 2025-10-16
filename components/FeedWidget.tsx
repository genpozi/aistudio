
import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../constants';
import type { FeedItem, UserFeed } from '../types';

const CORS_PROXY_URL = 'https://corsproxy.io/?';

// A simple utility to get text content from a DOM element, trying multiple selectors.
const getText = (element: Element, selectors: string[]): string => {
  for (const selector of selectors) {
    const content = element.querySelector(selector)?.textContent;
    if (content) return content.trim();
  }
  return '';
};

// Parses an XML string into a structured feed object.
const parseFeed = (xmlString: string): { feedTitle: string; items: Omit<FeedItem, 'source'>[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    throw new Error('Failed to parse XML feed.');
  }

  const isAtom = doc.querySelector('feed') !== null;
  
  if (isAtom) {
    // Atom Feed Parsing
    const feedTitle = doc.querySelector('feed > title')?.textContent ?? 'Untitled Feed';
    const entries = Array.from(doc.querySelectorAll('entry'));
    const items = entries.map(entry => {
      const linkElement = entry.querySelector('link');
      const link = linkElement ? linkElement.getAttribute('href') : '';
      return {
        title: getText(entry, ['title']),
        link: link || window.location.href, // Fallback link
        pubDate: getText(entry, ['updated', 'published']),
        author: getText(entry, ['author > name']),
      };
    });
    return { feedTitle, items };
  } else {
    // RSS Feed Parsing (and other similar formats)
    const feedTitle = doc.querySelector('channel > title')?.textContent ?? 'Untitled Feed';
    const entries = Array.from(doc.querySelectorAll('item'));
    const items = entries.map(item => ({
      title: getText(item, ['title']),
      link: getText(item, ['link']),
      pubDate: getText(item, ['pubDate', 'dc\\:date']),
      author: getText(item, ['author', 'dc\\:creator']),
    }));
    return { feedTitle, items };
  }
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

const FeedWidget: React.FC<{ className?: string; feedUrls: UserFeed[]; onOpenSettings: () => void; }> = ({ className, feedUrls, onOpenSettings }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);

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

    // Sort all items by publication date, descending
    newItems.sort((a, b) => {
        try {
            return new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime();
        } catch (e) {
            return 0;
        }
    });

    setItems(newItems.slice(0, 20)); // Limit to latest 20 items
    setIsLoading(false);
  }, [feedUrls]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex-grow flex items-center justify-center"><p className="text-white/70">Loading feeds...</p></div>;
    }
    if (error && items.length === 0) {
        return <div className="flex-grow flex items-center justify-center text-center p-4"><p className="text-red-400/80">{error}</p></div>
    }
    if (feedUrls.length === 0) {
        return (
            <div className="flex-grow flex flex-col items-center justify-center text-center">
                <p className="text-white/70 mb-4">No feeds configured.</p>
                <button onClick={onOpenSettings} className="bg-white/10 hover:bg-white/20 text-white font-semibold py-2 px-4 rounded-lg">
                    Configure Feeds
                </button>
            </div>
        );
    }
    if (items.length === 0 && !error) {
        return <div className="flex-grow flex items-center justify-center"><p className="text-white/70">No feed items found.</p></div>
    }
    return (
        <ul className="overflow-y-auto flex-grow custom-scrollbar -mr-2 pr-2">
            {items.map((item: FeedItem, index: number) => (
            <li key={`${item.link}-${index}`} className="border-b border-white/10 last:border-b-0">
                <a 
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block p-3 transition-colors rounded-lg hover:bg-white/10"
                >
                <div className="flex justify-between items-center text-xs text-white/70 mb-2">
                    <span className="bg-white/10 px-2 py-1 rounded-full font-semibold truncate max-w-[60%]">{item.source}</span>
                    <span>{timeSince(item.pubDate)}</span>
                </div>
                <p className="text-white font-semibold text-base leading-tight group-hover:text-[var(--text-highlight)] transition-colors flex items-start justify-between">
                    <span className="pr-2">{item.title}</span>
                    <span className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 pt-1">
                    {ICONS.ExternalLink}
                    </span>
                </p>
                </a>
            </li>
            ))}
        </ul>
    );
  };

  return (
    <div className={`bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg flex flex-col overflow-hidden transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-14' : 'max-h-[36rem]'} ${className || ''}`}>
      <div className="bg-gradient-to-r from-black/40 to-black/10 px-4 py-3 flex justify-between items-center flex-shrink-0">
        <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">RSS &amp; YOUTUBE FEEDS</h3>
        <div className="flex items-center space-x-2">
            <button onClick={fetchFeeds} disabled={isLoading} className="text-white/60 hover:text-white disabled:opacity-50" aria-label="Refresh feeds">
                {ICONS.Refresh}
            </button>
            <button 
                onClick={() => setIsCollapsed(prev => !prev)} 
                className="text-white/60 hover:text-white transition-colors"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? "Expand feed widget" : "Collapse feed widget"}
            >
                <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                    {ICONS.ChevronUp}
                </div>
            </button>
        </div>
      </div>
      <div className="px-4 pb-4 pt-3 flex-grow flex flex-col min-h-0">
        {error && items.length > 0 && <p className="text-sm text-red-400/80 mb-2">{error}</p>}
        {renderContent()}
      </div>
    </div>
  );
};

export default FeedWidget;