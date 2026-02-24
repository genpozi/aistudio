import React, { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { Link, UserFeed, ResearchBackend, FocusDuration } from '../types';
import { THEMES, ICONS } from '../constants';
import Favicon from './Favicon';

type Tab = 'general' | 'links' | 'feeds' | 'research' | 'theme' | 'services';

export interface SettingsData {
    name: string;
    location: string;
    links: Link[];
    feedUrls: UserFeed[];
    focusPrompt: string;
    focusDuration: FocusDuration;
    theme: string;
    researchBackend: ResearchBackend;
}

interface SettingsModalProps {
    initialTab: string;
    onClose: () => void;
    onSave: (data: SettingsData) => void;
    onOpenCustomizeModal: () => void;
    currentSettings: SettingsData;
}

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
    const {
        initialTab, onClose, onSave, onOpenCustomizeModal, currentSettings
    } = props;

    const [activeTab, setActiveTab] = useState<Tab>(initialTab as Tab || 'general');
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose, true);
    
    // Create temporary local state for all settings
    const [name, setName] = useState(currentSettings.name);
    const [location, setLocation] = useState(currentSettings.location);
    const [links, setLinks] = useState(currentSettings.links);
    const [feedUrls, setFeedUrls] = useState(currentSettings.feedUrls);
    const [focusPrompt, setFocusPrompt] = useState(currentSettings.focusPrompt);
    const [focusDuration, setFocusDuration] = useState(currentSettings.focusDuration);
    const [theme, setTheme] = useState(currentSettings.theme);
    const [researchBackend, setResearchBackend] = useState(currentSettings.researchBackend);

    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newFeedInput, setNewFeedInput] = useState('');
    const [newFeedType, setNewFeedType] = useState<'rss' | 'youtube'>('youtube');
    
    const handleSave = () => {
        onSave({
            name,
            location,
            links,
            feedUrls,
            focusPrompt,
            focusDuration,
            theme,
            researchBackend,
        });
    };

    const handleAddLink = (e: React.FormEvent) => {
        e.preventDefault();
        if (newLinkName.trim() && newLinkUrl.trim()) {
            const url = newLinkUrl.startsWith('http') ? newLinkUrl : `https://${newLinkUrl}`;
            const newLink: Link = {
                id: Date.now(),
                name: newLinkName.trim(),
                url: url,
                iconUrl: `https://www.google.com/s2/favicons?sz=64&domain_url=${url}`
            };
            setLinks([...links, newLink]);
            setNewLinkName('');
            setNewLinkUrl('');
        }
    };

    const handleDeleteLink = (id: number) => setLinks(links.filter(link => link.id !== id));

    const handleAddFeed = (e: React.FormEvent) => {
        e.preventDefault();
        const trimmedInput = newFeedInput.trim();
        if (!trimmedInput) return;

        let finalUrl = trimmedInput;

        if (newFeedType === 'youtube') {
            if (!trimmedInput.startsWith('UC')) {
                alert('Invalid YouTube Channel ID. It should start with "UC". Please find the correct ID and try again.');
                return;
            }
            finalUrl = `https://www.youtube.com/feeds/videos.xml?channel_id=${trimmedInput}`;
        }
        
        const newFeed: UserFeed = { id: Date.now(), url: finalUrl, type: newFeedType };
        setFeedUrls([...feedUrls, newFeed]);
        setNewFeedInput('');
    };

    const handleDeleteFeed = (id: number) => setFeedUrls(feedUrls.filter(feed => feed.id !== id));

    const TabButton: React.FC<{ tabName: Tab; label: string }> = ({ tabName, label }) => (
        <button
            onClick={() => setActiveTab(tabName)}
            className={`w-full text-left px-4 py-2 rounded transition-colors ${activeTab === tabName ? 'bg-white/20 text-white' : 'text-white/70 hover:bg-white/10'}`}
        >
            {label}
        </button>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">General Settings</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Name</label>
                                <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-white/10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Weather Location</label>
                                <input type="text" value={location} onChange={e => setLocation(e.target.value)} placeholder="Leave blank to auto-detect" className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Daily Focus Prompt</label>
                                <input type="text" value={focusPrompt} onChange={e => setFocusPrompt(e.target.value)} className="w-full bg-white/10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                            </div>
                             <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Focus Session Duration</label>
                                <select value={focusDuration} onChange={e => setFocusDuration(parseInt(e.target.value, 10) as FocusDuration)} className="w-full bg-white/10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]">
                                    <option value={25}>25 Minutes (Pomodoro)</option>
                                    <option value={45}>45 Minutes</option>
                                    <option value={60}>60 Minutes</option>
                                </select>
                            </div>
                        </div>
                    </div>
                );
            case 'links':
                return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Personal Links</h3>
                        <form onSubmit={handleAddLink} className="flex space-x-2 mb-4">
                            <input type="text" placeholder="Link Name" value={newLinkName} onChange={e => setNewLinkName(e.target.value)} className="w-1/3 bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]" />
                            <input type="text" placeholder="URL" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)} className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]" />
                            <button type="submit" className="bg-[var(--text-highlight)] px-4 rounded font-semibold">Add</button>
                        </form>
                        <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {(links || []).map(link => (
                                <li key={link.id} className="group flex items-center justify-between bg-white/5 p-2 rounded">
                                    <div className="flex items-center space-x-3 truncate">
                                        <Favicon link={link} className="w-5 h-5" />
                                        <span className="truncate">{link.name}</span>
                                    </div>
                                    <button onClick={() => handleDeleteLink(link.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                        <div className="w-5 h-5">{ICONS.Trash}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'feeds':
                 return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">RSS & YouTube Feeds</h3>
                        <form onSubmit={handleAddFeed} className="flex items-center space-x-2 mb-4">
                            <div className="flex-grow">
                                {newFeedType === 'rss' ? (
                                    <input 
                                        type="text" 
                                        placeholder="RSS Feed URL" 
                                        value={newFeedInput} 
                                        onChange={e => setNewFeedInput(e.target.value)} 
                                        className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                                    />
                                ) : (
                                    <div className="flex items-center">
                                        <span className="bg-black/20 text-white/70 text-sm p-2 rounded-l">https://www.youtube.com/feeds/videos.xml?channel_id=</span>
                                        <input 
                                            type="text" 
                                            placeholder="Paste Channel ID here (starts with UC...)" 
                                            value={newFeedInput} 
                                            onChange={e => setNewFeedInput(e.target.value)} 
                                            className="w-full bg-white/10 p-2 rounded-r-none placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]" 
                                        />
                                        <div className="relative group flex items-center bg-white/10 p-2 rounded-r h-full">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 z-10 mb-2 w-72 p-3 bg-black border border-white/20 rounded-lg shadow-lg text-sm text-left opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                                <h4 className="font-bold">How to find the Channel ID:</h4>
                                                <ol className="list-decimal list-inside mt-1 space-y-1">
                                                    <li>Go to the YouTube channel's main page.</li>
                                                    <li>Click the three-dots menu icon (⋮).</li>
                                                    <li>Select "Share", then "Copy channel ID".</li>
                                                </ol>
                                                <p className="mt-2 text-xs text-white/50">The ID is a long string of letters and numbers that usually starts with "UC".</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            <select 
                                value={newFeedType} 
                                onChange={e => {
                                    setNewFeedType(e.target.value as 'rss' | 'youtube');
                                    setNewFeedInput(''); // Clear input on type change
                                }} 
                                className="bg-white/10 p-2 rounded focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]"
                            >
                                <option value="youtube">YouTube</option>
                                <option value="rss">RSS</option>
                            </select>
                            <button type="submit" className="bg-[var(--text-highlight)] px-4 py-2 rounded font-semibold">Add</button>
                        </form>
                        <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {(feedUrls || []).map(feed => (
                                <li key={feed.id} className="group flex items-center justify-between bg-white/5 p-2 rounded">
                                    <div className="flex items-center space-x-3 truncate">
                                        <span className={`text-xs uppercase font-bold px-2 py-0.5 rounded-full ${feed.type === 'rss' ? 'bg-orange-500/50' : 'bg-red-500/50'}`}>{feed.type}</span>
                                        <span className="truncate text-sm">{feed.url}</span>
                                    </div>
                                    <button onClick={() => handleDeleteFeed(feed.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                        <div className="w-5 h-5">{ICONS.Trash}</div>
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case 'research':
                return (
                     <div>
                        <h3 className="text-xl font-bold mb-4">AI Research Settings</h3>
                        <div className="space-y-4">
                             <div>
                                <label className="block text-sm font-medium text-white/80 mb-1">Research Backend</label>
                                <select value={researchBackend} onChange={e => setResearchBackend(e.target.value as ResearchBackend)} className="w-full bg-white/10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]">
                                    <option value="gemini">Google Gemini</option>
                                    <option value="mcp">Local AI (MCP)</option>
                                </select>
                            </div>
                            <div>
                                <p className="text-sm text-white/70">
                                    The Gemini API key is now managed via an environment variable for enhanced security. The application will automatically use the key provided by the execution environment.
                                </p>
                            </div>
                        </div>
                    </div>
                );
            case 'theme':
                return (
                     <div>
                        <h3 className="text-xl font-bold mb-4">Theme</h3>
                        <div className="grid grid-cols-3 gap-4">
                            {THEMES.map(t => (
                                <button key={t.id} onClick={() => setTheme(t.id)} className={`p-4 rounded-lg border-2 transition-all ${theme === t.id ? 'border-white' : 'border-transparent hover:border-white/50'}`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="font-semibold">{t.name}</span>
                                        {theme === t.id && <div className="w-4 h-4 rounded-full bg-[var(--text-highlight)]"></div>}
                                    </div>
                                    <div className="flex space-x-2 h-8">
                                        <div className="w-1/2 rounded" style={{backgroundColor: t.colors.primary}}></div>
                                        <div className="w-1/2 rounded" style={{backgroundColor: t.colors.secondary}}></div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                );
            case 'services':
                 return (
                    <div>
                        <h3 className="text-xl font-bold mb-4">Service Links</h3>
                        <p className="text-white/80 mb-4">Customize the links and categories that appear on your dashboard.</p>
                        <button 
                            onClick={onOpenCustomizeModal}
                            className="w-full bg-[var(--text-highlight)] hover:opacity-90 text-white px-6 py-3 rounded font-semibold transition-opacity"
                        >
                            Open Links Customizer
                        </button>
                    </div>
                );
        }
    };

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="w-full max-w-4xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[80vh]">
                <header className="flex items-center justify-between border-b border-white/20 p-4 flex-shrink-0">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
                </header>
                <div className="flex flex-grow min-h-0">
                    <nav className="w-1/4 p-4 border-r border-white/10 flex-shrink-0 space-y-2">
                        <TabButton tabName="general" label="General" />
                        <TabButton tabName="links" label="Personal Links" />
                        <TabButton tabName="feeds" label="Feeds" />
                        <TabButton tabName="services" label="Service Links" />
                        <TabButton tabName="research" label="AI Research" />
                        <TabButton tabName="theme" label="Theme" />
                    </nav>
                    <main className="w-3/4 p-6 overflow-y-auto custom-scrollbar">
                        {renderContent()}
                    </main>
                </div>
                <footer className="p-4 border-t border-white/20 flex-shrink-0">
                    <div className="flex justify-end space-x-4">
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded font-semibold transition-colors">Cancel</button>
                        <button onClick={handleSave} className="bg-[var(--text-highlight)] hover:opacity-90 text-white px-6 py-2 rounded font-semibold transition-opacity">Save & Close</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;