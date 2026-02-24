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
  const safeLinks = links || [];
  const hasLinks = safeLinks.length > 0;

  return (
    <div className="relative group/card">
      <div className="absolute -inset-[1px] rounded-xl bg-amber-500/20 opacity-0 group-hover/card:opacity-100 blur-[1px] transition-opacity duration-500"></div>
      
      <div className="relative bg-amber-900/10 backdrop-blur-xl rounded-xl border border-amber-500/20 shadow-[0_0_15px_-5px_rgba(245,158,11,0.2)] overflow-hidden transition-all duration-500">
        <div 
            className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center cursor-pointer select-none group/header"
            onClick={onToggle}
            title="Toggle card"
        >
          <h3 className="text-amber-400 font-black text-lg uppercase tracking-wider drop-shadow-sm group-hover/header:text-amber-200 transition-colors">PERSONAL LINKS</h3>
          <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
              <button
                  onClick={onOpenSettings}
                  className="text-amber-400/80 hover:text-amber-300 transition-colors flex items-center space-x-1.5 p-1 rounded-md hover:bg-amber-400/10"
                  aria-label="Add new personal link"
              >
                  <div className="w-4 h-4">{ICONS.Plus}</div>
                  <span className="text-sm font-semibold text-amber-400/90 group-hover:text-amber-300">Add</span> 
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
        <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
          <div className="p-6 pt-4">
            {hasLinks ? (
              <div className="flex flex-col space-y-3">
                {safeLinks.map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center space-x-4 p-3 rounded-xl border border-transparent bg-amber-400/5 hover:bg-amber-400/15 hover:border-amber-400/30 transition-all duration-300 transform active:scale-95 shadow-md"
                    style={{ textShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
                  >
                    <div className="w-10 h-10 flex items-center justify-center rounded-lg flex-shrink-0 shadow-inner bg-black/40">
                      <div className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-200">
                        <Favicon link={link} className="w-full h-full object-contain" />
                      </div>
                    </div>
                    <span className="text-white text-base font-semibold leading-tight group-hover:text-amber-200 transition-colors">{link.name}</span>
                  </a>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-white/70 italic">
                No links here yet. Click "Add" to get started!
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinksWidget;