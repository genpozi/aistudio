import React, { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { Link, UserFeed, ResearchBackend } from '../types';
import { THEMES, ICONS } from '../constants';
import Favicon from './Favicon';

type Tab = 'general' | 'links' | 'feeds' | 'research' | 'theme' | 'services';

interface SettingsModalProps {
    initialTab: string;
    onClose: () => void;
    onOpenCustomizeModal: () => void;
    name: string;
    setName: React.Dispatch<React.SetStateAction<string>>;
    location: string;
    setLocation: React.Dispatch<React.SetStateAction<string>>;
    links: Link[];
    setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
    feedUrls: UserFeed[];
    setFeedUrls: React.Dispatch<React.SetStateAction<UserFeed[]>>;
    focusPrompt: string;
    setFocusPrompt: React.Dispatch<React.SetStateAction<string>>;
    theme: string;
    setTheme: React.Dispatch<React.SetStateAction<string>>;
    geminiApiKey: string;
    setGeminiApiKey: React.Dispatch<React.SetStateAction<string>>;
    researchBackend: ResearchBackend;
    setResearchBackend: React.Dispatch<React.SetStateAction<ResearchBackend>>;
}

const SettingsModal: React.FC<SettingsModalProps> = (props) => {
    const {
        initialTab, onClose, onOpenCustomizeModal, name, setName, location, setLocation, links, setLinks, feedUrls, setFeedUrls,
        focusPrompt, setFocusPrompt, theme, setTheme, geminiApiKey, setGeminiApiKey, researchBackend, setResearchBackend
    } = props;

    const [activeTab, setActiveTab] = useState<Tab>(initialTab as Tab || 'general');
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose, true);

    const [newLinkName, setNewLinkName] = useState('');
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [newFeedUrl, setNewFeedUrl] = useState('');

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
        if (newFeedUrl.trim()) {
            const newFeed: UserFeed = { id: Date.now(), url: newFeedUrl.trim() };
            setFeedUrls([...feedUrls, newFeed]);
            setNewFeedUrl('');
        }
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
                            {links.map(link => (
                                <li key={link.id} className="group flex items-center justify-between bg-white/5 p-2 rounded">
                                    <div className="flex items-center space-x-3 truncate">
                                        <Favicon link={link} className="w-5 h-5" />
                                        <span className="truncate">{link.name}</span>
                                    </div>
                                    <button onClick={() => handleDeleteLink(link.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                        {ICONS.Trash}
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
                        <form onSubmit={handleAddFeed} className="flex space-x-2 mb-4">
                            <input type="text" placeholder="Feed URL" value={newFeedUrl} onChange={e => setNewFeedUrl(e.target.value)} className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-[var(--color-border-hover)]" />
                            <button type="submit" className="bg-[var(--text-highlight)] px-4 rounded font-semibold">Add</button>
                        </form>
                        <ul className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar pr-2">
                            {feedUrls.map(feed => (
                                <li key={feed.id} className="group flex items-center justify-between bg-white/5 p-2 rounded">
                                    <span className="truncate text-sm">{feed.url}</span>
                                    <button onClick={() => handleDeleteFeed(feed.id)} className="opacity-0 group-hover:opacity-100 text-red-400 hover:text-red-300 transition-opacity">
                                        {ICONS.Trash}
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
                                <label className="block text-sm font-medium text-white/80 mb-1">Google Gemini API Key</label>
                                <input type="password" value={geminiApiKey} onChange={e => setGeminiApiKey(e.target.value)} className="w-full bg-white/10 p-2 rounded focus:outline-none focus:ring-2 focus:ring-[var(--color-border-hover)]" />
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noopener noreferrer" className="text-sm text-[var(--text-highlight)] hover:underline mt-2 inline-block">
                                    Get your Gemini API Key here &rarr;
                                </a>
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
                    <div className="flex justify-end">
                        <button onClick={onClose} className="bg-white/10 hover:bg-white/20 px-6 py-2 rounded font-semibold transition-colors">Close</button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default SettingsModal;
