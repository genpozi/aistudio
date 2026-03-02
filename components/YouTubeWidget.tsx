
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
  if (parserError) throw new Error('Failed to parse YouTube Atom feed.');
  
  const feedTitle = doc.querySelector('feed > title')?.textContent ?? 'YouTube';
  const entries = Array.from(doc.querySelectorAll('entry'));
  const items = entries.map(entry => {
    const linkElement = entry.querySelector('link');
    return {
      title: getText(entry, ['title']),
      link: linkElement ? linkElement.getAttribute('href') : '',
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
    return `${Math.floor(hours / 24)}d ago`;
  } catch (e) { return 'a while ago'; }
};

interface YouTubeWidgetProps {
  className?: string;
  feedUrls: UserFeed[];
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const YouTubeWidget: React.FC<YouTubeWidgetProps> = ({ className, feedUrls, onOpenSettings, isCollapsed, onToggle }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeeds = useCallback(async (signal?: AbortSignal) => {
    if (!feedUrls.length || isCollapsed) { 
      if (!isCollapsed) setItems([]); 
      return; 
    }
    setIsLoading(true);
    const allItems: FeedItem[] = [];
    
    try {
        for (const feed of feedUrls) {
            if (signal?.aborted) break;
            try {
                const response = await fetch(`${CORS_PROXY_URL}${feed.url}`, { signal });
                if (!response.ok) continue;
                const text = await response.text();
                const { feedTitle, items } = parseYouTubeFeed(text);
                allItems.push(...items.map(item => ({ ...item, source: feedTitle })));
            } catch (err) { 
                if (err instanceof Error && err.name === 'AbortError') throw err;
                console.error("YouTube error:", err); 
            }
        }
        
        if (signal?.aborted) return;
        
        allItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
        setItems(allItems.slice(0, 15));
    } catch (err) {
        if (err instanceof Error && err.name === 'AbortError') return;
        console.error("Failed to fetch YouTube feeds:", err);
    } finally {
        if (!signal?.aborted) {
            setIsLoading(false);
        }
    }
  }, [feedUrls, isCollapsed]);

  useEffect(() => { 
    const controller = new AbortController();
    fetchFeeds(controller.signal); 
    return () => controller.abort();
  }, [fetchFeeds]);

  return (
    <div className={`bg-purple-900/10 backdrop-blur-xl rounded-xl border border-purple-500/20 shadow-lg flex flex-col transition-all duration-500 ${isCollapsed ? 'min-h-0' : ''} ${className || ''}`}>
      <div 
        className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center flex-shrink-0 cursor-pointer select-none group/header"
        onClick={onToggle}
      >
        <h3 className="text-purple-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-purple-300 transition-colors">YOUTUBE FEEDS</h3>
        <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={() => fetchFeeds()} disabled={isLoading} className="text-white/60 hover:text-white transition-colors">
                {ICONS.Refresh}
            </button>
            <button 
              onClick={onToggle} 
              className="text-white/60 hover:text-white transition-colors p-1"
              aria-expanded={!isCollapsed}
              title="Toggle collapse"
            >
              <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                {ICONS.ChevronUp}
              </div>
            </button>
        </div>
      </div>
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100 p-6 pt-3'}`}>
        {isLoading ? (
            <div className="flex items-center justify-center h-48 text-white/50 italic">Fetching latest videos...</div>
        ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar">
                {items.map((item, index) => (
                <a 
                    key={`${item.link}-${index}`}
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative flex-shrink-0 w-64 aspect-video bg-black/40 rounded-xl overflow-hidden border border-transparent hover:border-purple-400/40 transition-all duration-300"
                >
                    {item.thumbnailUrl && <img src={item.thumbnailUrl} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent p-4 flex flex-col justify-end">
                        <p className="text-white text-xs font-bold line-clamp-2 drop-shadow-md group-hover:text-purple-300 transition-colors">{item.title}</p>
                        <div className="flex justify-between items-center mt-2 text-[9px] text-white/60">
                            <span className="font-bold uppercase tracking-widest">{item.source}</span>
                            <span>{timeSince(item.pubDate)}</span>
                        </div>
                    </div>
                </a>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default YouTubeWidget;
