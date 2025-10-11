import React, { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { Link, UserFeed, Theme } from '../types';
import { ICONS, LOCAL_STORAGE_KEYS, THEMES } from '../constants';
import Favicon from './Favicon';

type Tab = 'general' | 'links' | 'feeds';

interface SettingsModalProps {
    initialTab?: string;
    onClose: () => void;
    name: string;
    setName: (name: string) => void;
    location: string;
    setLocation: (location: string) => void;
    links: Link[];
    setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
    feedUrls: UserFeed[];
    setFeedUrls: React.Dispatch<React.SetStateAction<UserFeed[]>>;
    focusPrompt: string;
    setFocusPrompt: (prompt: string) => void;
    theme: string;
    setTheme: (theme: string) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    initialTab = 'general',
    onClose,
    name,
    setName,
    location,
    setLocation,
    links,
    setLinks,
    feedUrls,
    setFeedUrls,
    focusPrompt,
    setFocusPrompt,
    theme,
    setTheme,
}) => {
    const [activeTab, setActiveTab] = useState<Tab>(initialTab as Tab);
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose, true);

    // Temporary state for all settings. Changes are only committed on save.
    const [tempName, setTempName] = useState(name);
    const [tempLocation, setTempLocation] = useState(location);
    const [tempFocusPrompt, setTempFocusPrompt] = useState(focusPrompt);
    const [tempTheme, setTempTheme] = useState(theme);
    const [tempLinks, setTempLinks] = useState(links);
    const [tempFeedUrls, setTempFeedUrls] = useState(feedUrls);

    // Form-specific states
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [linkError, setLinkError] = useState('');
    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [feedError, setFeedError] = useState('');

    const handleSave = () => {
        setName(tempName.trim() || 'My Liege 🙇');
        setLocation(tempLocation.trim());
        setFocusPrompt(tempFocusPrompt.trim() || 'What is your goal for today?');
        setTheme(tempTheme);
        setLinks(tempLinks);
        setFeedUrls(tempFeedUrls);
        onClose();
    };

    const addLink = (e: React.FormEvent) => {
        e.preventDefault();
        setLinkError('');
        const urlInput = newLinkUrl.trim();
        if (!urlInput) return;

        let urlObject: URL;
        try {
            urlObject = new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`);
        } catch (err) {
            setLinkError("Please enter a valid URL.");
            return;
        }

        const fullUrl = urlObject.href;
        if (tempLinks.some(link => link.url === fullUrl)) {
            setLinkError("This link has already been added.");
            return;
        }

        const hostname = urlObject.hostname;
        const iconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
        const name = hostname.replace(/^www\./, '').split('.')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        const newLink: Link = { id: Date.now(), name: capitalizedName, url: fullUrl, iconUrl };
        setTempLinks(prev => [...prev, newLink]);
        setNewLinkUrl('');
    };

    const deleteLink = (id: number) => {
        setTempLinks(tempLinks.filter(link => link.id !== id));
    };

    const addFeed = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedError('');
        if (tempFeedUrls.length >= 5) {
            setFeedError("You can add a maximum of 5 feeds.");
            return;
        }
        const urlInput = newFeedUrl.trim();
        if (!urlInput) return;

        try {
            new URL(urlInput); // Basic validation
        } catch(err) {
            setFeedError("Please enter a valid RSS feed URL.");
            return;
        }
        
        if (tempFeedUrls.some(feed => feed.url === urlInput)) {
            setFeedError("This feed URL has already been added.");
            return;
        }

        const newFeed: UserFeed = { id: Date.now(), url: urlInput };
        setTempFeedUrls(prev => [...prev, newFeed]);
        setNewFeedUrl('');
    };

    const deleteFeed = (id: number) => {
        setTempFeedUrls(tempFeedUrls.filter(feed => feed.id !== id));
    };

    const handleExportConfig = () => {
        try {
            const config: { [key: string]: any } = {};
            Object.values(LOCAL_STORAGE_KEYS).forEach(key => {
                const value = localStorage.getItem(key);
                if (value !== null) {
                    config[key] = JSON.parse(value);
                }
            });

            const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'pozi-dashboard-config.json';
            a.click();
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to export configuration:", error);
            alert("An error occurred while exporting your configuration.");
        }
    };

    const handleImportConfig = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text !== 'string') throw new Error("File could not be read.");
                const config = JSON.parse(text);

                const knownKeys = Object.values(LOCAL_STORAGE_KEYS);
                if (!Object.keys(config).some(key => knownKeys.includes(key))) {
                    throw new Error("File does not appear to be a valid configuration.");
                }

                Object.values(LOCAL_STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
                Object.keys(config).forEach(key => {
                    if (knownKeys.includes(key)) localStorage.setItem(key, JSON.stringify(config[key]));
                });

                alert("Configuration restored successfully! The page will now reload.");
                window.location.reload();
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Unknown error';
                alert(`Error: Could not import configuration. Details: ${errorMessage}`);
            }
        };
        reader.readAsText(file);
    };

    const TabButton: React.FC<{ tab: Tab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
        >
            {label}
        </button>
    );

    const ThemePicker: React.FC<{ selectedTheme: string, onChange: (themeId: string) => void }> = ({ selectedTheme, onChange }) => (
        <div>
            <label className="block text-sm font-medium text-white/80 mb-2">Theme</label>
            <div className="flex space-x-4">
                {THEMES.map((themeOption) => (
                    <button
                        key={themeOption.id}
                        type="button"
                        onClick={() => onChange(themeOption.id)}
                        className={`flex-1 p-3 rounded-lg border-2 transition-all ${selectedTheme === themeOption.id ? 'border-[var(--text-highlight)] scale-105' : 'border-white/20 hover:border-white/50'}`}
                    >
                        <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold">{themeOption.name}</span>
                            {selectedTheme === themeOption.id && (
                                <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--text-highlight)'}}>
                                    <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            )}
                        </div>
                        <div className="flex h-6 w-full rounded-md overflow-hidden">
                            <div className="w-1/2 h-full" style={{ backgroundColor: themeOption.colors.primary }}></div>
                            <div className="w-1/2 h-full" style={{ backgroundColor: themeOption.colors.secondary }}></div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div ref={modalRef} className="w-full max-w-2xl bg-black/50 backdrop-blur-xl border border-white/20 rounded-lg shadow-2xl text-white flex flex-col max-h-[80vh]">
                <header className="flex items-center justify-between border-b border-white/20 p-4">
                    <div className="flex items-baseline space-x-2">
                        <h2 className="text-2xl font-bold">Settings</h2>
                        <div className="flex">
                           <TabButton tab="general" label="General" />
                           <TabButton tab="links" label="Links" />
                           <TabButton tab="feeds" label="Feeds" />
                        </div>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white text-3xl leading-none">&times;</button>
                </header>

                <div className="p-6 overflow-y-auto custom-scrollbar flex-grow">
                    {activeTab === 'general' && (
                        <div className="space-y-6">
                            <ThemePicker selectedTheme={tempTheme} onChange={setTempTheme} />
                            <div>
                                <label htmlFor="name-input" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                                <input id="name-input" type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                                    className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                            </div>
                            <div>
                                <label htmlFor="location-input" className="block text-sm font-medium text-white/80 mb-1">Weather Location</label>
                                <p className="text-xs text-white/50 mb-2">Enter a city, zip code, etc.</p>
                                <input id="location-input" type="text" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}
                                    className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                            </div>
                            <div>
                                <label htmlFor="focus-prompt-input" className="block text-sm font-medium text-white/80 mb-1">Focus Prompt</label>
                                <p className="text-xs text-white/50 mb-2">The question for your daily goal.</p>
                                <div className="relative">
                                    <input id="focus-prompt-input" type="text" value={tempFocusPrompt} onChange={(e) => setTempFocusPrompt(e.target.value)} maxLength={50}
                                        className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)] pr-12" />
                                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-white/50">{tempFocusPrompt.length} / 50</span>
                                </div>
                            </div>
                             <div>
                                <h3 className="text-lg font-semibold mb-2">Backup & Restore</h3>
                                <p className="text-sm text-white/60 mb-4">Save your configuration to restore it later or on another device.</p>
                                <div className="flex space-x-4">
                                    <button type="button" onClick={handleExportConfig} className="flex-1 bg-white/20 hover:bg-white/30 p-3 rounded font-semibold transition-colors">Export</button>
                                    <label htmlFor="import-config-input" className="flex-1 text-center bg-white/20 hover:bg-white/30 p-3 rounded font-semibold transition-colors cursor-pointer">Import</label>
                                    <input id="import-config-input" type="file" accept=".json" className="hidden" onChange={handleImportConfig} />
                                </div>
                            </div>
                        </div>
                    )}
                    {activeTab === 'links' && (
                        <div>
                            <form onSubmit={addLink} className="mb-6">
                                <label htmlFor="link-url-input" className="block text-sm font-medium text-white/80 mb-1">New Link URL</label>
                                <div className="flex space-x-2">
                                    <input id="link-url-input" type="text" placeholder="e.g., google.com" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)}
                                        className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                                    <button type="submit" className="bg-white/20 hover:bg-white/30 p-2 px-4 rounded font-semibold">Add</button>
                                </div>
                                {linkError && <p className="text-red-400 text-xs mt-1">{linkError}</p>}
                            </form>
                            <h3 className="text-lg font-semibold mb-3">Saved Links</h3>
                            <ul className="space-y-2">
                                {tempLinks.map(link => (
                                    <li key={link.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <div className="flex items-center space-x-3 truncate">
                                            <Favicon link={link} />
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{link.name}</a>
                                            <span className="text-white/50 truncate text-sm">{link.url}</span>
                                        </div>
                                        <button onClick={() => deleteLink(link.id)} className="text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0">{ICONS.Trash}</button>
                                    </li>
                                ))}
                                {tempLinks.length === 0 && <p className="text-white/60 text-center py-4">No links yet. Add one above.</p>}
                            </ul>
                        </div>
                    )}
                    {activeTab === 'feeds' && (
                         <div>
                            <form onSubmit={addFeed} className="mb-6">
                                <label htmlFor="feed-url-input" className="block text-sm font-medium text-white/80 mb-1">New RSS Feed URL</label>
                                 <p className="text-xs text-white/50 mb-2">Add up to 5 RSS feed URLs.</p>
                                <div className="flex space-x-2">
                                    <input id="feed-url-input" type="url" placeholder="https://www.example.com/feed.xml" value={newFeedUrl} onChange={e => setNewFeedUrl(e.target.value)}
                                        className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                                    <button type="submit" className="bg-white/20 hover:bg-white/30 p-2 px-4 rounded font-semibold" disabled={tempFeedUrls.length >= 5}>Add</button>
                                </div>
                                {feedError && <p className="text-red-400 text-xs mt-1">{feedError}</p>}
                            </form>
                            <h3 className="text-lg font-semibold mb-3">Saved Feeds</h3>
                            <ul className="space-y-2">
                                {tempFeedUrls.map(feed => (
                                    <li key={feed.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <p className="truncate text-white/80">{feed.url}</p>
                                        <button onClick={() => deleteFeed(feed.id)} className="text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0">{ICONS.Trash}</button>
                                    </li>
                                ))}
                                {tempFeedUrls.length === 0 && <p className="text-white/60 text-center py-4">No feeds yet. Add one above.</p>}
                            </ul>
                        </div>
                    )}
                </div>
                
                <footer className="p-4 border-t border-white/20 mt-auto">
                    <div className="flex justify-end space-x-4">
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded font-semibold transition-colors">
                            Cancel
                        </button>
                        <button onClick={handleSave} className="bg-[var(--text-highlight)] hover:opacity-90 text-white px-6 py-2 rounded font-semibold transition-opacity">
                            Save & Close
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;