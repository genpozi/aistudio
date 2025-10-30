import React from 'react';
import type { Link } from '../types';
import Favicon from './Favicon';
import { ICONS } from '../constants';

interface LinksWidgetProps {
  links: Link[];
  onOpenSettings: () => void;
  isCollapsed: boolean;
  onToggle: () => void;
}

const LinksWidget: React.FC<LinksWidgetProps> = ({ links, onOpenSettings, isCollapsed, onToggle }) => {
  const hasLinks = links.length > 0;

  return (
    <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-500">
      <div className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center">
        <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">PERSONAL LINKS</h3>
        <div className="flex items-center space-x-2">
            <button
                onClick={onOpenSettings}
                className="text-white/80 group-hover:text-white transition-colors flex items-center space-x-1.5 p-1 rounded-md hover:bg-white/10"
                aria-label="Add new personal link"
            >
                <div className="w-4 h-4">{ICONS.Plus}</div>
                <span className="text-sm font-semibold">Add</span> 
            </button>
            <button 
                onClick={onToggle} 
                className="text-white/60 hover:text-white transition-colors"
                aria-expanded={!isCollapsed}
                aria-label={isCollapsed ? `Expand Personal Links section` : `Collapse Personal Links section`}
            >
                <div className={`w-5 h-5 transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                    {ICONS.ChevronUp}
                </div>
            </button>
        </div>
      </div>
      <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
        <div className="p-6 pt-4">
          {hasLinks ? (
            <div className="flex flex-col space-y-3">
              {links.map((link, index) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`group flex items-center space-x-4 p-3 rounded-xl border border-transparent hover:border-[var(--color-border-hover)] transition-all duration-300 transform active:scale-95 shadow-md hover:shadow-[0_0_20px_-5px_var(--color-glow)] ${index % 2 === 0 ? 'bg-gradient-to-br from-[var(--color-backdrop-start)] to-[var(--color-backdrop-end)]' : 'bg-black/10'}`}
                  style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                >
                  <div
                    className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 shadow-inner bg-black/20"
                  >
                    <div className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200">
                      <Favicon link={link} className="w-full h-full object-contain" />
                    </div>
                  </div>
                  <span className="text-white text-base font-semibold leading-tight transition-colors group-hover:text-[var(--text-highlight)]">{link.name}</span>
                </a>
              ))}
            </div>
          ) : (
            <div className="text-center py-4 text-white/70">
              No links here yet. Click "Add" to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LinksWidget;