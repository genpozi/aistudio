import React, { useState, useEffect, useCallback } from 'react';
import { ICONS, CORS_PROXY_URL } from '../constants';
import type { FeedItem, UserFeed } from '../types';

const getText = (element: Element, selectors: string[]): string => {
  for (const selector of selectors) {
    const content = element.querySelector(selector)?.textContent;
    if (content) return content.trim();
  }
  return '';
};

const getAttribute = (element: Element, selectors: string[], attribute: string): string => {
    for (const selector of selectors) {
        const selectedElement = element.querySelector(selector);
        if (selectedElement && selectedElement.hasAttribute(attribute)) {
            return selectedElement.getAttribute(attribute) || '';
        }
    }
    return '';
}

const parseYouTubeFeed = (xmlString: string): { feedTitle: string; items: Omit<FeedItem, 'source'>[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) {
    // Attempt to give a more helpful error if it looks like HTML
    if (xmlString.trim().toLowerCase().startsWith('<!doctype html')) {
      throw new Error('Failed to parse feed. The URL provided seems to be a web page, not an XML feed.');
    }
    throw new Error('Failed to parse YouTube Atom feed.');
  }
  
  const feedTitle = doc.querySelector('feed > title')?.textContent ?? 'Untitled YouTube Feed';
  const entries = Array.from(doc.querySelectorAll('entry'));
  const items = entries.map(entry => {
    const linkElement = entry.querySelector('link');
    const link = linkElement ? linkElement.getAttribute('href') : '';
    return {
      title: getText(entry, ['title']),
      link: link || window.location.href,
      pubDate: getText(entry, ['updated', 'published']),
      author: getText(entry, ['author > name']),
      thumbnailUrl: getAttribute(entry, ['media\\:thumbnail', 'thumbnail'], 'url'),
    };
  });
  return { feedTitle, items };
};

const timeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  } catch (e) {
    return 'a while ago';
  }
};

/**
 * Converts various YouTube channel URL formats into a valid RSS feed URL.
 * Handles /channel/, /user/, and /@handle formats.
 * @param userUrl The user-provided YouTube channel URL.
 * @returns A promise that resolves to the correct RSS feed URL.
 */
const getFinalFeedUrl = async (userUrl: string): Promise<string> => {
    if (userUrl.includes('/feeds/videos.xml')) {
        return userUrl;
    }

    try {
        const url = new URL(userUrl);
        const pathname = url.pathname;

        let match = pathname.match(/\/channel\/(UC[\w-]{22,})/);
        if (match) {
            const channelId = match[1];
            return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`;
        }

        match = pathname.match(/\/user\/([\w-]+)/);
        if (match) {
            const username = match[1];
            return `https://www.youtube.com/feeds/videos.xml?user=${username}`;
        }
        
        match = pathname.match(/^\/(@[\w.-]+)/);
        if (match) {
            const response = await fetch(`${CORS_PROXY_URL}${userUrl}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch channel page: ${response.status}`);
            }
            const html = await response.text();
            // This regex is more robust, looking for either JSON-LD or meta tags
            const channelIdMatch = html.match(/"channelId":"(UC[\w-]{22,})"/);
            if (channelIdMatch && channelIdMatch[1]) {
                return `https://www.youtube.com/feeds/videos.xml?channel_id=${channelIdMatch[1]}`;
            } else {
                throw new Error('Could not automatically find Channel ID from the handle page.');
            }
        }
        
        throw new Error('URL format not recognized. Use a /channel/, /user/, or /@handle URL.');
    } catch (e) {
        const errorMessage = e instanceof Error ? e.message : String(e);
        console.error(`Error resolving YouTube URL ${userUrl}:`, errorMessage);
        throw new Error(`Could not resolve '${userUrl}': ${errorMessage}`);
    }
};

interface YouTubeWidgetProps {
  className?: string;
  feedUrls: UserFeed[];
  onOpenSettings: () => void;
}

const YouTubeWidget: React.FC<YouTubeWidgetProps> = ({ className, feedUrls, onOpenSettings }) => {
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
    const allItems: FeedItem[] = [];
    const errors: string[] = [];

    for (const feed of feedUrls) {
        try {
            const finalUrl = await getFinalFeedUrl(feed.url);
            const response = await fetch(`${CORS_PROXY_URL}${finalUrl}`);
            if (!response.ok) {
                if (response.status === 429) {
                     throw new Error(`Rate limited. Please try again in a few moments.`);
                }
                throw new Error(`HTTP error ${response.status}`);
            }
            const text = await response.text();
            const { feedTitle, items } = parseYouTubeFeed(text);
            const itemsWithSource = items.map(item => ({ ...item, source: feedTitle }));
            allItems.push(...itemsWithSource);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : String(err);
            console.error(`Failed to process feed ${feed.url}:`, errorMessage);
            errors.push(`- ${new URL(feed.url).hostname}: ${errorMessage}`);
        }
        // Add a small delay between requests to avoid rate-limiting
        await new Promise(resolve => setTimeout(resolve, 300));
    }

    if (errors.length > 0) {
        setError(`Some YouTube feeds failed to load:\n${errors.join('\n')}`);
    }

    allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
    setItems(allItems.slice(0, 20));
    setIsLoading(false);
  }, [feedUrls]);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const renderContent = () => {
    if (isLoading) {
      return <div className="flex-grow flex items-center justify-center min-h-[200px]"><p className="text-white/70">Loading videos...</p></div>;
    }
    if (error && items.length === 0) {
        return <div className="flex-grow flex items-center justify-center text-center p-4 min-h-[200px]"><p className="text-red-400/80 whitespace-pre-wrap">{error}</p></div>
    }
    return (
        <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar -mr-4 pr-4">
            {items.map((item, index) => (
            <a 
                key={`${item.link}-${index}`}
                href={item.link} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="group block flex-shrink-0 w-72 bg-white/5 rounded-lg overflow-hidden border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_-5px_var(--color-glow)]"
            >
                <div className="relative">
                    <img src={item.thumbnailUrl} alt={item.title} className="w-full h-40 object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 flex items-center justify-center transition-colors">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white/70 group-hover:text-white group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    </div>
                </div>
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
        <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">YOUTUBE FEEDS</h3>
        <div className="flex items-center space-x-2">
            <button onClick={fetchFeeds} disabled={isLoading} className="text-white/60 hover:text-white disabled:opacity-50" aria-label="Refresh feeds">
                {ICONS.Refresh}
            </button>
        </div>
      </div>
      <div className="px-4 pb-0 pt-3 flex-grow flex flex-col min-h-0">
        {error && items.length > 0 && <p className="text-sm text-red-400/80 mb-2 whitespace-pre-wrap">{error}</p>}
        {renderContent()}
      </div>
    </div>
  );
};

export default YouTubeWidget;
