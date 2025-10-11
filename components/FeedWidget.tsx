
import React from 'react';
import { FEED_ITEMS, ICONS } from '../constants';
import type { FeedItem } from '../types';

const FeedWidget: React.FC = () => {
  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl p-4 border border-white/10 shadow-lg col-span-2 md:col-span-1 h-full max-h-[300px] flex flex-col">
      <h3 className="text-white font-bold text-lg mb-3 uppercase tracking-wider">Feeds</h3>
      <ul className="space-y-3 overflow-y-auto flex-grow pr-2">
        {FEED_ITEMS.map((item: FeedItem) => (
          <li key={item.id}>
            <a 
              href={item.link} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="group block p-2 rounded-lg hover:bg-white/10 transition-colors"
            >
              <div className="flex justify-between items-center text-sm text-white/60 mb-1">
                <span>{item.source}</span>
                <span>{item.timestamp}</span>
              </div>
              <p className="text-white font-medium leading-tight group-hover:text-blue-300 flex items-center">
                {item.title}
                <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  {ICONS.ExternalLink}
                </span>
              </p>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeedWidget;
