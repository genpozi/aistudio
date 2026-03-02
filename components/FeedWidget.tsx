
import React, { useState, useEffect, useCallback, useMemo } from 'react';
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

const parseFeed = (xmlString: string): { feedTitle: string; items: Omit<FeedItem, 'source'>[] } => {
  const parser = new DOMParser();
  const doc = parser.parseFromString(xmlString, 'application/xml');
  const parserError = doc.querySelector('parsererror');
  if (parserError) throw new Error('Failed to parse XML feed.');

  const feedTitle = doc.querySelector('channel > title, feed > title')?.textContent ?? 'Untitled Feed';
  
  const entries = Array.from(doc.querySelectorAll('item, entry'));
  const items = entries.map(item => {
    let thumb = getAttribute(item, ['enclosure', 'media\\:content', 'media\\:thumbnail', 'thumbnail'], 'url');
    
    if (!thumb) {
        const atomLink = Array.from(item.querySelectorAll('link[rel="enclosure"]')).find(l => l.getAttribute('type')?.startsWith('image/'));
        if (atomLink) thumb = atomLink.getAttribute('href') || '';
    }

    return {
        title: getText(item, ['title']),
        link: item.querySelector('link')?.getAttribute('href') || getText(item, ['link']),
        pubDate: getText(item, ['pubDate', 'updated', 'published', 'dc\\:date']),
        author: getText(item, ['author > name', 'author', 'dc\\:creator']),
        thumbnailUrl: thumb || '',
    };
  });
  return { feedTitle, items };
};

const timeSince = (dateString: string): string => {
  try {
    const date = new Date(dateString.replace(/-/g, '/'));
    if (isNaN(date.getTime())) return 'recently';
    const seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);
    if (seconds < 60) return 'Just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return 'recently';
  }
};

// --- START: Generative Placeholder Logic ---
const PLACEHOLDER_STYLES = [
    { name: 'Ocean', classes: 'from-cyan-900 via-blue-900 to-teal-900', icon: ICONS.Globe },
    { name: 'Galaxy', classes: 'from-purple-900 via-indigo-950 to-blue-900', icon: ICONS.Brain },
    { name: 'Sunset', classes: 'from-rose-900 via-orange-900 to-amber-900', icon: ICONS.Sparkles },
    { name: 'Forest', classes: 'from-emerald-950 via-green-900 to-teal-950', icon: ICONS.Cloud },
    { name: 'Lava', classes: 'from-red-950 via-rose-900 to-orange-950', icon: ICONS.Code },
    { name: 'Monochrome', classes: 'from-slate-900 via-gray-800 to-zinc-950', icon: ICONS.Document },
    { name: 'Neon', classes: 'from-violet-950 via-fuchsia-900 to-purple-950', icon: ICONS.Plus },
];

const getPlaceholderForTitle = (title: string) => {
    // Simple hash to ensure same title always gets same style
    let hash = 0;
    for (let i = 0; i < title.length; i++) {
        hash = title.charCodeAt(i) + ((hash << 5) - hash);
    }
    const index = Math.abs(hash) % PLACEHOLDER_STYLES.length;
    return PLACEHOLDER_STYLES[index];
};

const PlaceholderCard: React.FC<{ title: string }> = ({ title }) => {
    const style = useMemo(() => getPlaceholderForTitle(title), [title]);
    return (
        <div className={`w-full h-full bg-gradient-to-br ${style.classes} flex flex-col items-center justify-center relative overflow-hidden group-hover:scale-105 transition-transform duration-700`}>
            {/* Subtle Pattern Overlay */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
            
            {/* Centered Floating Icon */}
            <div className="w-12 h-12 text-white/20 relative z-10 drop-shadow-2xl transform group-hover:rotate-12 transition-transform duration-500">
                {style.icon}
            </div>
            
            {/* Visual Flare */}
            <div className="absolute top-0 left-0 w-full h-1 bg-white/10"></div>
        </div>
    );
};
// --- END: Generative Placeholder Logic ---

interface FeedWidgetProps {
  className?: string;
  feedUrls: UserFeed[];
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const FeedWidget: React.FC<FeedWidgetProps> = ({ className, feedUrls, onOpenSettings, isCollapsed, onToggle }) => {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchFeeds = useCallback(async (signal?: AbortSignal) => {
    if (!feedUrls || feedUrls.length === 0 || isCollapsed) {
      if (!isCollapsed) setItems([]);
      return;
    }
    setIsLoading(true);
    
    const fetchAndParse = async (feed: UserFeed): Promise<{ feedTitle: string; items: Omit<FeedItem, 'source'>[] }> => {
      try {
        const response = await fetch(`${CORS_PROXY_URL}${feed.url}`, { signal });
        if (!response.ok) throw new Error(`HTTP error ${response.status}`);
        const text = await response.text();
        return parseFeed(text);
      } catch (err) { 
        if (err instanceof Error && err.name === 'AbortError') throw err;
        console.warn(`Failed to fetch feed ${feed.url}`, err);
        return { feedTitle: 'Unknown', items: [] };
      }
    };

    try {
      const results = await Promise.allSettled(feedUrls.map(fetchAndParse));
      
      if (signal?.aborted) return;

      const newItems: FeedItem[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled') {
          const { feedTitle, items } = result.value;
          items.forEach(item => {
              if (item.title && item.link) {
                  newItems.push({ ...item, source: feedTitle });
              }
          });
        }
      });

      newItems.sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime());
      setItems(newItems.slice(0, 30));
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') return;
      console.error("Failed to fetch feeds:", err);
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
        className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center flex-shrink-0 border-b border-purple-500/10 cursor-pointer select-none group/header"
        onClick={onToggle}
      >
        <div className="flex items-center space-x-3">
             <h3 className="text-purple-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-purple-300 transition-colors">WORLD NEWS & TECH</h3>
             {isLoading && <span className="text-[10px] bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded animate-pulse font-bold tracking-tighter">SYNCING</span>}
        </div>
        <div className="flex items-center space-x-4" onClick={(e) => e.stopPropagation()}>
            <button onClick={onOpenSettings} className="text-white/40 hover:text-white transition-colors">
                <div className="w-5 h-5">{ICONS.Plus}</div>
            </button>
            <button onClick={() => fetchFeeds()} disabled={isLoading} className="text-white/60 hover:text-white transition-colors" title="Refresh Feeds">
                <div className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`}>{ICONS.Refresh}</div>
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
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isCollapsed ? 'max-h-0 opacity-0' : 'max-h-[1000px] opacity-100 p-4'}`}>
        {isLoading && items.length === 0 ? (
            <div className="flex items-center justify-center h-48 text-white/50 italic animate-pulse">Syncing Global Intelligence Network...</div>
        ) : (
            <div className="flex overflow-x-auto space-x-4 pb-4 custom-scrollbar snap-x">
                {items.map((item, index) => (
                <a 
                    key={`${item.link}-${index}`}
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="group relative flex-shrink-0 w-64 aspect-video bg-black/40 rounded-xl overflow-hidden border border-white/5 hover:border-purple-400/40 transition-all duration-300 shadow-xl snap-start"
                >
                    {/* Visual Content: Image or Generative Placeholder */}
                    <div className="w-full h-full">
                        {item.thumbnailUrl ? (
                            <img 
                                src={item.thumbnailUrl} 
                                alt="" 
                                loading="lazy"
                                referrerPolicy="no-referrer"
                                className="w-full h-full object-cover opacity-60 group-hover:opacity-100 group-hover:scale-110 transition-all duration-700" 
                            />
                        ) : (
                            <PlaceholderCard title={item.title} />
                        )}
                    </div>
                    
                    {/* Text Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/100 via-black/40 to-transparent p-4 flex flex-col justify-end">
                        <div className="overflow-hidden">
                            <p className="text-white text-xs font-bold line-clamp-2 drop-shadow-md group-hover:text-purple-300 transition-colors transform group-hover:translate-y-[-2px] duration-300">
                                {item.title}
                            </p>
                        </div>
                        <div className="flex justify-between items-center mt-2 text-[9px] text-white/50">
                            <span className="font-bold uppercase tracking-widest truncate max-w-[65%] bg-purple-500/10 px-1.5 py-0.5 rounded text-purple-200/80">{item.source}</span>
                            <span className="font-medium">{timeSince(item.pubDate)}</span>
                        </div>
                    </div>
                    
                    {/* Hover Glow Effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-500 bg-gradient-to-tr from-purple-500/10 to-transparent"></div>
                </a>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default FeedWidget;
