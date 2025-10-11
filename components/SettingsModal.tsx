import React, { useState, useRef } from 'react';
import useOnClickOutside from '../hooks/useOnClickOutside';
import type { Link, UserFeed } from '../types';
import { ICONS } from '../constants';
import Favicon from './Favicon';

type Tab = 'general' | 'links' | 'feeds';

interface SettingsModalProps {
    onClose: () => void;
    name: string;
    setName: (name: string) => void;
    location: string;
    setLocation: (location: string) => void;
    links: Link[];
    setLinks: React.Dispatch<React.SetStateAction<Link[]>>;
    feedUrls: UserFeed[];
    setFeedUrls: React.Dispatch<React.SetStateAction<UserFeed[]>>;
}

const SettingsModal: React.FC<SettingsModalProps> = ({
    onClose,
    name,
    setName,
    location,
    setLocation,
    links,
    setLinks,
    feedUrls,
    setFeedUrls
}) => {
    const [activeTab, setActiveTab] = useState<Tab>('general');
    const modalRef = useRef<HTMLDivElement>(null);
    useOnClickOutside(modalRef, onClose, true);

    // Temporary state for form inputs
    const [tempName, setTempName] = useState(name);
    const [tempLocation, setTempLocation] = useState(location);

    // Links Settings States
    const [newLinkUrl, setNewLinkUrl] = useState('');
    const [linkError, setLinkError] = useState('');

    // Feeds Settings States
    const [newFeedUrl, setNewFeedUrl] = useState('');
    const [feedError, setFeedError] = useState('');


    const handleGeneralSave = (e: React.FormEvent) => {
        e.preventDefault();
        setName(tempName.trim() || 'User');
        setLocation(tempLocation.trim());
        onClose();
    };

    const addLink = (e: React.FormEvent) => {
        e.preventDefault();
        setLinkError('');
        const urlInput = newLinkUrl.trim();
        if (!urlInput) return;

        let urlObject: URL;
        try {
            // Prepend protocol if missing for robust URL parsing
            urlObject = new URL(urlInput.startsWith('http') ? urlInput : `https://${urlInput}`);
        } catch (err) {
            setLinkError("Please enter a valid URL.");
            return;
        }

        const fullUrl = urlObject.href;
        if (links.some(link => link.url === fullUrl)) {
            setLinkError("This link has already been added.");
            return;
        }

        const hostname = urlObject.hostname;
        const iconUrl = `https://www.google.com/s2/favicons?domain=${hostname}&sz=32`;
        const name = hostname.replace(/^www\./, '').split('.')[0];
        const capitalizedName = name.charAt(0).toUpperCase() + name.slice(1);

        const newLink: Link = { id: Date.now(), name: capitalizedName, url: fullUrl, iconUrl };
        setLinks(prev => [...prev, newLink]);
        setNewLinkUrl('');
    };

    const deleteLink = (id: number) => {
        setLinks(links.filter(link => link.id !== id));
    };

    const addFeed = (e: React.FormEvent) => {
        e.preventDefault();
        setFeedError('');
        if (feedUrls.length >= 5) {
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
        
        if (feedUrls.some(feed => feed.url === urlInput)) {
            setFeedError("This feed URL has already been added.");
            return;
        }

        const newFeed: UserFeed = { id: Date.now(), url: urlInput };
        setFeedUrls(prev => [...prev, newFeed]);
        setNewFeedUrl('');
    };

    const deleteFeed = (id: number) => {
        setFeedUrls(feedUrls.filter(feed => feed.id !== id));
    };

    const TabButton: React.FC<{ tab: Tab, label: string }> = ({ tab, label }) => (
        <button
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-lg font-semibold rounded-t-lg transition-colors ${activeTab === tab ? 'bg-white/10 text-white' : 'text-white/60 hover:bg-white/5'}`}
        >
            {label}
        </button>
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

                <div className="p-6 overflow-y-auto custom-scrollbar">
                    {activeTab === 'general' && (
                        <form onSubmit={handleGeneralSave}>
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="name-input" className="block text-sm font-medium text-white/80 mb-1">Name</label>
                                    <input id="name-input" type="text" value={tempName} onChange={(e) => setTempName(e.target.value)}
                                        className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" />
                                </div>
                                <div>
                                    <label htmlFor="location-input" className="block text-sm font-medium text-white/80 mb-1">Weather Location</label>
                                    <p className="text-xs text-white/50 mb-2">Enter a city, zip code, or other location.</p>
                                    <input id="location-input" type="text" value={tempLocation} onChange={(e) => setTempLocation(e.target.value)}
                                        className="w-full bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" />
                                </div>
                            </div>
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <button type="submit" className="w-full bg-blue-600 hover:bg-blue-500 p-3 rounded font-semibold transition-colors">
                                    Save and Close
                                </button>
                            </div>
                        </form>
                    )}

                    {activeTab === 'links' && (
                        <div>
                            <form onSubmit={addLink} className="mb-6">
                                <label htmlFor="link-url-input" className="block text-sm font-medium text-white/80 mb-1">New Link URL</label>
                                <div className="flex space-x-2">
                                    <input id="link-url-input" type="text" placeholder="e.g., google.com" value={newLinkUrl} onChange={e => setNewLinkUrl(e.target.value)}
                                        className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" />
                                    <button type="submit" className="bg-white/20 hover:bg-white/30 p-2 px-4 rounded font-semibold">Add</button>
                                </div>
                                {linkError && <p className="text-red-400 text-xs mt-1">{linkError}</p>}
                            </form>
                            <h3 className="text-lg font-semibold mb-3">Saved Links</h3>
                            <ul className="space-y-2">
                                {links.map(link => (
                                    <li key={link.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <div className="flex items-center space-x-3 truncate">
                                            <Favicon link={link} />
                                            <a href={link.url} target="_blank" rel="noopener noreferrer" className="truncate hover:underline">{link.name}</a>
                                            <span className="text-white/50 truncate text-sm">{link.url}</span>
                                        </div>
                                        <button onClick={() => deleteLink(link.id)} className="text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0">
                                            {ICONS.Trash}
                                        </button>
                                    </li>
                                ))}
                                {links.length === 0 && <p className="text-white/60 text-center py-4">No links yet. Add one above.</p>}
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
                                        className="flex-grow bg-white/10 p-2 rounded placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-white/50" />
                                    <button type="submit" className="bg-white/20 hover:bg-white/30 p-2 px-4 rounded font-semibold" disabled={feedUrls.length >= 5}>Add</button>
                                </div>
                                {feedError && <p className="text-red-400 text-xs mt-1">{feedError}</p>}
                            </form>
                            <h3 className="text-lg font-semibold mb-3">Saved Feeds</h3>
                            <ul className="space-y-2">
                                {feedUrls.map(feed => (
                                    <li key={feed.id} className="flex justify-between items-center bg-white/5 p-2 rounded">
                                        <p className="truncate text-white/80">{feed.url}</p>
                                        <button onClick={() => deleteFeed(feed.id)} className="text-red-400 hover:text-red-300 transition-opacity ml-2 flex-shrink-0">
                                            {ICONS.Trash}
                                        </button>
                                    </li>
                                ))}
                                {feedUrls.length === 0 && <p className="text-white/60 text-center py-4">No feeds yet. Add one above.</p>}
                            </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SettingsModal;