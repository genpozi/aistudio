

import React, { useState } from 'react';
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
Perplexity, Google, Microsoft, Adobe

TEST KEY:
AIzaSyCGKONMP4MosKFMoA6nX7mtebfI27BwP1I`;

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({ isCollapsed, onToggle }) => {
    const [isUnlocked, setIsUnlocked] = useState(false);
    const [password, setPassword] = useState('');

    const handleUnlock = (e: React.FormEvent) => {
        e.preventDefault();
        // A simple, hardcoded password.
        if (password === 'maplewood') {
            setIsUnlocked(true);
        } else {
            alert('Incorrect password.');
            setPassword('');
        }
    };

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
                <div className="p-6 pt-4 relative">
                    <div className={`transition-all duration-300 ${isUnlocked ? 'blur-none opacity-100' : 'blur-md opacity-20'}`}>
                        <pre className="text-white/90 whitespace-pre-wrap font-sans text-base break-words">{announcementText}</pre>
                    </div>
                    {!isUnlocked && (
                         <div className="absolute inset-0 flex items-center justify-center">
                            <form onSubmit={handleUnlock} className="flex items-center space-x-2 p-4 bg-black/50 rounded-lg">
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Password..."
                                    className="bg-white/10 p-2 rounded w-32 placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                    autoFocus
                                />
                                <button type="submit" className="bg-[var(--text-highlight)] px-3 py-2 rounded font-semibold text-sm">Unlock</button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AnnouncementCard;