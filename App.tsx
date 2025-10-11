import React, { useState, useMemo, useCallback } from 'react';
import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Quote from './components/Quote';
import Weather from './components/Weather';
import LinksWidget from './components/LinksWidget';
import TodoWidget from './components/TodoWidget';
import ServiceGroups from './components/ServiceGroups';
import FeedWidget from './components/FeedWidget';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import SearchWidget from './components/SearchWidget';
import SettingsWidget from './components/SettingsWidget';
import SettingsModal from './components/SettingsModal';
import { BACKGROUND_IMAGES, LOCAL_STORAGE_KEYS } from './constants';
import { TimeProvider } from './contexts/TimeContext';
import useLocalStorage from './hooks/useLocalStorage';
import type { Link, UserFeed } from './types';


const App: React.FC = () => {
    const [currentBgIndex, setCurrentBgIndex] = useState(() => Math.floor(Math.random() * BACKGROUND_IMAGES.length));
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    // Centralized state management using constants
    const [name, setName] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_NAME, 'User');
    const [location, setLocation] = useLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_LOCATION, '');
    const [links, setLinks] = useLocalStorage<Link[]>(LOCAL_STORAGE_KEYS.USER_LINKS, []);
    const [feedUrls, setFeedUrls] = useLocalStorage<UserFeed[]>(LOCAL_STORAGE_KEYS.USER_FEEDS, [
        { id: 1, url: 'https://www.theverge.com/rss/index.xml' },
        { id: 2, url: 'https://techcrunch.com/feed/' },
    ]);

    const changeBackground = useCallback(() => {
        setCurrentBgIndex(prevIndex => (prevIndex + 1) % BACKGROUND_IMAGES.length);
    }, []);
    
    const backgroundImageUrl = useMemo(() => BACKGROUND_IMAGES[currentBgIndex], [currentBgIndex]);

    return (
        <main
            className="h-screen w-screen bg-cover bg-center text-white flex flex-col font-sans transition-background-image duration-1000 ease-in-out"
            style={{ backgroundImage: `url(${backgroundImageUrl})` }}
        >
            <div className="absolute inset-0 bg-black/30"></div>

            <TimeProvider>
                {/* Top Bar */}
                <header className="relative z-10 flex justify-between items-center p-4">
                    <div className="relative z-20 flex-1 flex justify-start">
                        <LinksWidget links={links} onOpenSettings={() => setIsSettingsOpen(true)} />
                    </div>
                    <div className="flex-1 flex justify-center px-4">
                        <SearchWidget />
                    </div>
                    <div className="flex-1 flex justify-end">
                        <Weather location={location} />
                    </div>
                </header>

                {/* Center Content */}
                <section className="relative z-10 flex-grow flex flex-col justify-center items-center text-center p-4">
                    <Clock />
                    <Greeting name={name} />
                </section>

                 {/* Bottom Widgets Area */}
                <section className="relative z-10 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="col-span-2 md:col-span-3">
                            <ServiceGroups />
                        </div>
                        <FeedWidget 
                            className="col-span-2 md:col-span-2" 
                            feedUrls={feedUrls} 
                            onOpenSettings={() => setIsSettingsOpen(true)} 
                        />
                    </div>
                </section>


                {/* Bottom Bar */}
                <footer className="relative z-10 flex justify-between items-end p-4">
                    <div className="flex items-center space-x-4">
                         <BackgroundSwitcher onRefresh={changeBackground} />
                         <SettingsWidget onOpenSettings={() => setIsSettingsOpen(true)} />
                    </div>
                    <div className="flex-grow flex justify-center">
                        <Quote />
                    </div>
                    <TodoWidget />
                </footer>

                {/* Render the modal and pass state and setters */}
                {isSettingsOpen && (
                    <SettingsModal
                        onClose={() => setIsSettingsOpen(false)}
                        name={name}
                        setName={setName}
                        location={location}
                        setLocation={setLocation}
                        links={links}
                        setLinks={setLinks}
                        feedUrls={feedUrls}
                        setFeedUrls={setFeedUrls}
                    />
                )}
            </TimeProvider>
        </main>
    );
};

export default App;