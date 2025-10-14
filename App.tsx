import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { TimeProvider } from './contexts/TimeContext';

import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Weather from './components/Weather';
import Quote from './components/Quote';
import LinksWidget from './components/LinksWidget';
import TodoWidget from './components/TodoWidget';
import ServiceGroups from './components/ServiceGroups';
import FeedWidget from './components/FeedWidget';
import SearchWidget from './components/SearchWidget';
import SettingsWidget from './components/SettingsWidget';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import SettingsModal from './components/SettingsModal';

import { LOCAL_STORAGE_KEYS, BACKGROUND_IMAGES } from './constants';
import type { Link, UserFeed } from './types';

const defaultFeeds: UserFeed[] = [
    { id: 2, url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCH64kG4TyblRS0AxE-DpXbQ' },
    { id: 3, url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVy16RS5eEDh8anP8j94G2A' },
    { id: 4, url: 'https://www.youtube.com/feeds/videos.xml?channel_id=UCVTyTA7-g9nopHeHbeuvpRA' },
];

const App: React.FC = () => {
    const [name, setName] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_NAME, 'My Liege 🙇');
    const [location, setLocation] = useLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_LOCATION, '');
    const [links, setLinks] = useLocalStorage<Link[]>(LOCAL_STORAGE_KEYS.USER_LINKS, []);
    const [feedUrls, setFeedUrls] = useLocalStorage<UserFeed[]>(LOCAL_STORAGE_KEYS.USER_FEEDS, defaultFeeds);
    const [focusPrompt, setFocusPrompt] = useLocalStorage(LOCAL_STORAGE_KEYS.FOCUS_PROMPT, 'What is your goal for today?');
    const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_THEME, 'chroma');

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [initialSettingsTab, setInitialSettingsTab] = useState('general');
    const [bgImage, setBgImage] = useState('');

    const refreshBackground = useCallback(() => {
        const newBg = BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
        setBgImage(newBg);
    }, []);

    useEffect(() => {
        refreshBackground();
    }, [refreshBackground]);

    useEffect(() => {
        document.documentElement.className = `theme-${theme}`;
    }, [theme]);
    
    const openSettings = (tab: string = 'general') => {
        setInitialSettingsTab(tab);
        setIsSettingsOpen(true);
    };

    return (
        <TimeProvider>
            <div
                className="relative min-h-screen w-screen bg-cover bg-center bg-fixed text-white transition-background-image duration-1000"
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                
                <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8">
                    <header className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-2xl mx-auto">
                        <div className="md:col-span-1 justify-self-start">
                            <LinksWidget links={links} onOpenSettings={() => openSettings('links')} />
                        </div>
                        <div className="md:col-span-1" />
                        <div className="md:col-span-1 justify-self-end">
                            <Weather location={location} />
                        </div>
                    </header>

                    <main className="w-full flex-grow flex flex-col items-center justify-center text-center my-8">
                        <Clock />
                        <Greeting name={name} focusPrompt={focusPrompt} />
                        <div className="mt-8 w-full max-w-2xl">
                            <SearchWidget />
                        </div>
                    </main>

                    <section className="w-full max-w-screen-2xl mx-auto mb-8">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
                            <div className="lg:col-span-3">
                                <ServiceGroups />
                            </div>
                            <div className="lg:col-span-1">
                                <FeedWidget feedUrls={feedUrls} onOpenSettings={() => openSettings('feeds')} className="w-full" />
                            </div>
                        </div>
                    </section>
                    
                    <footer className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-2xl mx-auto items-end mt-auto">
                        <div className="md:col-span-1 justify-self-start">
                            <Quote />
                        </div>
                        <div className="md:col-span-1" />
                        <div className="md:col-span-1 justify-self-end">
                            <div className="flex items-center justify-end space-x-4">
                                <BackgroundSwitcher onRefresh={refreshBackground} />
                                <SettingsWidget onOpenSettings={() => openSettings('general')} />
                                <TodoWidget />
                            </div>
                        </div>
                    </footer>
                </div>

                {isSettingsOpen && (
                    <SettingsModal
                        initialTab={initialSettingsTab}
                        onClose={() => setIsSettingsOpen(false)}
                        name={name}
                        setName={setName}
                        location={location}
                        setLocation={setLocation}
                        links={links}
                        setLinks={setLinks}
                        feedUrls={feedUrls}
                        setFeedUrls={setFeedUrls}
                        focusPrompt={focusPrompt}
                        setFocusPrompt={setFocusPrompt}
                        theme={theme}
                        setTheme={setTheme}
                    />
                )}
            </div>
        </TimeProvider>
    );
};

export default App;