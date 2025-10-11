
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
import { BACKGROUND_IMAGES } from './constants';
import { TimeProvider } from './contexts/TimeContext';


const App: React.FC = () => {
    const [currentBgIndex, setCurrentBgIndex] = useState(() => Math.floor(Math.random() * BACKGROUND_IMAGES.length));

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
                    <div className="flex-1 flex justify-start">
                        <LinksWidget />
                    </div>
                    <div className="flex-1 flex justify-center px-4">
                        <SearchWidget />
                    </div>
                    <div className="flex-1 flex justify-end">
                        <Weather />
                    </div>
                </header>

                {/* Center Content */}
                <section className="relative z-10 flex-grow flex flex-col justify-center items-center text-center p-4">
                    <Clock />
                    <Greeting />
                </section>

                 {/* Bottom Widgets Area */}
                <section className="relative z-10 p-4 lg:p-8">
                    <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-5 gap-4">
                        <div className="col-span-2 md:col-span-4">
                            <ServiceGroups />
                        </div>
                        <FeedWidget />
                    </div>
                </section>


                {/* Bottom Bar */}
                <footer className="relative z-10 flex justify-between items-end p-4">
                    <div className="text-left">
                         <BackgroundSwitcher onRefresh={changeBackground} />
                    </div>
                    <div className="flex-grow flex justify-center">
                        <Quote />
                    </div>
                    <TodoWidget />
                </footer>
            </TimeProvider>
        </main>
    );
};

export default App;
