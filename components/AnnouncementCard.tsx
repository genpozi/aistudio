

import React from 'react';
import { ICONS } from '../constants';

interface AnnouncementCardProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const announcementText = `APPS: 
Bitwarden, Colanode, Obsidian

BROWSER EXTENSIONS: 
Karakeep, Bitwarden, Obsidian

STUDENTS:
Perplexity, Google, Microsoft, Adobe`;

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ isCollapsed, onToggle }) => {
    return (
        <div className="bg-black/20 backdrop-blur-md rounded-xl border border-white/10 shadow-lg overflow-hidden transition-all duration-500">
            <div className="bg-gradient-to-r from-black/40 to-black/10 px-6 py-4 flex justify-between items-center">
                <h3 className="text-[var(--text-highlight)] font-bold text-lg uppercase tracking-wider">ANNOUNCEMENT</h3>
                <button 
                    onClick={onToggle} 
                    className="text-white/60 hover:text-white transition-colors"
                    aria-expanded={!isCollapsed}
                    aria-label={isCollapsed ? `Expand Announcement section` : `Collapse Announcement section`}
                >
                    <div className={`transform transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}>
                        {ICONS.ChevronUp}
                    </div>
                </button>
            </div>
            <div className={`transition-[max-height] duration-500 ease-in-out ${isCollapsed ? 'max-h-0' : 'max-h-[1000px]'}`}>
                <div className="p-6 pt-4">
                    <pre className="text-white/90 whitespace-pre-wrap font-sans text-base break-words">{announcementText}</pre>
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;