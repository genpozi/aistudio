import React, { useState, useEffect, useCallback } from 'react';
import { ICONS } from '../constants';
import type { FeedItem, UserFeed, RssApiResponse } from '../types';

const API_ENDPOINT = 'https://api.rss2json.com/v1/api.json?rss_url=';

// Helper to calculate time since a date string
const timeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString.replace(/-/g, '/')); // Improve date parsing compatibility
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return `${Math.floor(seconds)}s ago`;
    const minutes = seconds / 60;
    if (minutes < 60) return `${Math.floor(minutes)}m ago`;
    const hours = minutes / 60;
    if (hours < 24) return `${Math.floor(hours)}h ago`;
    const days = hours / 24;
    return `${Math.floor(days)}d ago`;
  } catch (e) {
    return 'a while ago';
  }
};

const FeedWidget: React.FC<{ className?: string; feedUrls: UserFeed[]; onOpenSettings: () => void; }> = ({ className, feedUrls, onOpenSettings }) => {
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

    const promises = feedUrls.map(feed =>
      fetch(`${API_ENDPOINT}${encodeURIComponent(feed.url)}`).then(res => {
        if (!res.ok) throw new Error(`Failed to fetch ${feed.url}`);
        return res.json() as Promise<RssApiResponse>;
      })
    );

    const results = await Promise.allSettled(promises);
    
    const newItems: FeedItem[] = [];
    results.forEach(result => {
      if (result.status === 'fulfilled' && result.value.status === 'ok') {
        const sourceTitle = result.value.feed.title;
        result.value.items.forEach(item => {
          newItems.push({
            source: sourceTitle,
            title: item.title,
            link: item.link,
            author: item.author,
            pubDate: item.pubDate,
          });
        });
      } else if (result.status === 'rejected') {
        console.error("Feed fetch failed:", result.reason);
        setError("Some feeds could not be loaded.");
      }
    });

    // Sort all items by publication date, descending
    newItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());

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
        return <div className="flex-grow flex items-center justify-center"><p className="text-red-400/80">{error}</p></div>
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
    if (items.length === 0) {
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
                <p className="text-white font-semibold text-base leading-tight group-hover:text-blue-300 flex items-start justify-between">
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
    <div className={`bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg h-full max-h-[300px] flex flex-col ${className || ''}`}>
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-white font-bold text-lg uppercase tracking-wider">Feeds</h3>
        <button onClick={fetchFeeds} disabled={isLoading} className="text-white/60 hover:text-white disabled:opacity-50" aria-label="Refresh feeds">
            {ICONS.Refresh}
        </button>
      </div>
      {error && items.length > 0 && <p className="text-sm text-red-400/80 mb-2 -mt-1">{error}</p>}
      {renderContent()}
    </div>
  );
};

export default FeedWidget;