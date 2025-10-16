import React, { useState, useEffect, useCallback } from 'react';
import useLocalStorage from './hooks/useLocalStorage';
import { TimeProvider } from './contexts/TimeContext';
import { GoogleGenAI } from '@google/genai';

import Clock from './components/Clock';
import Greeting from './components/Greeting';
import Weather from './components/Weather';
import Quote from './components/Quote';
import TodoWidget from './components/TodoWidget';
import ServiceGroups from './components/ServiceGroups';
import FeedWidget from './components/FeedWidget';
import SearchWidget from './components/SearchWidget';
import SettingsWidget from './components/SettingsWidget';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import SettingsModal from './components/SettingsModal';
import ResearchModal from './components/ResearchModal';
import OnboardingModal from './components/OnboardingModal';
import CustomizeModal from './components/CustomizeModal';
import GoogleBar from './components/GoogleBar';

import { LOCAL_STORAGE_KEYS, BACKGROUND_IMAGES, SERVICE_GROUPS } from './constants';
import type { Link, UserFeed, ResearchBackend, GroundingChunk, ServiceGroup } from './types';

const defaultFeeds: UserFeed[] = [
    { id: 1, url: 'https://hnrss.org/frontpage' },
    { id: 2, url: 'https://www.smashingmagazine.com/feed/' },
    { id: 3, url: 'http://feeds.arstechnica.com/arstechnica/index' },
    { id: 4, url: 'https://www.omnycontent.com/d/playlist/885ace83-027a-47ad-ad67-aca7002f1df8/ab07fc49-2efc-4de6-92bf-b2e3011e17e9/f377cab3-e9e0-4dc2-8356-b2e3011e1800/podcast.rss' },
];

export interface OnboardingData {
    name: string;
    location: string;
    focusPrompt: string;
    apiKey: string;
}


const App: React.FC = () => {
    const [name, setName] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_NAME, 'My Liege 🙇');
    const [location, setLocation] = useLocalStorage(LOCAL_STORAGE_KEYS.WEATHER_LOCATION, '');
    const [links, setLinks] = useLocalStorage<Link[]>(LOCAL_STORAGE_KEYS.USER_LINKS, []);
    const [feedUrls, setFeedUrls] = useLocalStorage<UserFeed[]>(LOCAL_STORAGE_KEYS.USER_FEEDS, defaultFeeds);
    const [focusPrompt, setFocusPrompt] = useLocalStorage(LOCAL_STORAGE_KEYS.FOCUS_PROMPT, 'What is your goal for today?');
    const [theme, setTheme] = useLocalStorage(LOCAL_STORAGE_KEYS.USER_THEME, 'chroma');
    const [geminiApiKey, setGeminiApiKey] = useLocalStorage(LOCAL_STORAGE_KEYS.GEMINI_API_KEY, '');
    const [researchBackend, setResearchBackend] = useLocalStorage<ResearchBackend>(LOCAL_STORAGE_KEYS.RESEARCH_BACKEND, 'gemini');
    const [hasOnboarded, setHasOnboarded] = useLocalStorage(LOCAL_STORAGE_KEYS.HAS_ONBOARDED, false);
    const [serviceGroups, setServiceGroups] = useLocalStorage<ServiceGroup[]>(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, SERVICE_GROUPS);

    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
    const [initialSettingsTab, setInitialSettingsTab] = useState('general');
    const [bgImage, setBgImage] = useState('');
    const [isInFocusMode, setIsInFocusMode] = useState(false);
    
    // State for Research Modal
    const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
    const [researchResult, setResearchResult] = useState<string | null>(null);
    const [researchSources, setResearchSources] = useState<GroundingChunk[] | null>(null);
    const [researchError, setResearchError] = useState<string | null>(null);
    const [isResearching, setIsResearching] = useState(false);

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

    const handleOnboardingComplete = (data: OnboardingData) => {
        if (data.name) setName(data.name);
        if (data.location) setLocation(data.location);
        if (data.focusPrompt) setFocusPrompt(data.focusPrompt);
        if (data.apiKey) setGeminiApiKey(data.apiKey);
        setHasOnboarded(true);
    };

    const handleResearch = async (query: string) => {
        if (researchBackend === 'gemini') {
            if (!geminiApiKey) {
                alert('Google Gemini API key is not set. Please add it in the settings.');
                openSettings('research');
                return;
            }
    
            setIsResearching(true);
            setResearchResult(null);
            setResearchError(null);
            setResearchSources(null);
            setIsResearchModalOpen(true);
    
            try {
                const ai = new GoogleGenAI({ apiKey: geminiApiKey });
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: query,
                    config: {
                      tools: [{googleSearch: {}}],
                    },
                });

                const text = response.text;
                const sources = response.candidates?.[0]?.groundingMetadata?.groundingChunks as GroundingChunk[] | undefined;
                
                if (text) {
                    setResearchResult(text);
                    if (sources && sources.length > 0) {
                        setResearchSources(sources);
                    }
                } else {
                    throw new Error('No content received from the API.');
                }
    
            } catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
                console.error("Research failed:", errorMessage);
                setResearchError(`Failed to get research results. ${errorMessage}`);
            } finally {
                setIsResearching(false);
            }
    
        } else if (researchBackend === 'mcp') {
            const mcpUrl = `mcp://research?query=${encodeURIComponent(query)}`;
            window.location.href = mcpUrl;
        }
    };
    
    const closeResearchModal = () => {
        setIsResearchModalOpen(false);
        setResearchResult(null);
        setResearchError(null);
        setResearchSources(null);
    };

    return (
        <TimeProvider>
            {!hasOnboarded && <OnboardingModal onComplete={handleOnboardingComplete} />}
            <div
                className={`relative min-h-screen w-screen bg-cover bg-center bg-fixed text-white transition-all duration-1000 ${!hasOnboarded ? 'blur-sm' : 'blur-none'}`}
                style={{ backgroundImage: `url(${bgImage})` }}
            >
                <div className="absolute inset-0 bg-black/30" />
                
                <div className="relative z-10 flex flex-col min-h-screen p-6 md:p-8">
                    <header className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full max-w-screen-2xl mx-auto">
                        <div className="md:col-span-1 justify-self-start">
                            <GoogleBar />
                        </div>
                        <div className="md:col-span-1" />
                        <div className="md:col-span-1 justify-self-end flex flex-col items-end space-y-2">
                            <Weather location={location} />
                             <button 
                                onClick={() => setIsInFocusMode(prev => !prev)}
                                className="px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white/80 bg-black/20 rounded-full hover:bg-black/40 hover:text-white transition-colors border border-white/10"
                            >
                                {isInFocusMode ? 'Show All' : 'Focus Mode'}
                            </button>
                        </div>
                    </header>

                    <main className="w-full flex-grow flex flex-col items-center justify-center text-center my-8">
                        <Clock />
                        <Greeting name={name} focusPrompt={focusPrompt} />
                        <div className="mt-8 w-full max-w-2xl">
                            <SearchWidget 
                                researchBackend={researchBackend}
                                onOpenSettings={() => openSettings('research')}
                                onResearchSubmit={handleResearch}
                            />
                        </div>
                    </main>

                    <section className="w-full max-w-screen-2xl mx-auto mb-8">
                        <ServiceGroups 
                            links={links} 
                            onOpenSettings={() => openSettings('links')}
                            focusMode={isInFocusMode}
                            serviceGroups={serviceGroups}
                        >
                            <FeedWidget feedUrls={feedUrls} onOpenSettings={() => openSettings('feeds')} />
                        </ServiceGroups>
                    </section>
                    
                    <footer className="grid grid-cols-2 gap-4 w-full max-w-screen-2xl mx-auto items-end mt-auto">
                        <div className="justify-self-start">
                            <Quote />
                        </div>
                        <div className="justify-self-end">
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
                        onOpenCustomizeModal={() => {
                            setIsSettingsOpen(false);
                            setIsCustomizeModalOpen(true);
                        }}
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
                        geminiApiKey={geminiApiKey}
                        setGeminiApiKey={setGeminiApiKey}
                        researchBackend={researchBackend}
                        setResearchBackend={setResearchBackend}
                    />
                )}
                {isCustomizeModalOpen && (
                    <CustomizeModal
                        isOpen={isCustomizeModalOpen}
                        onClose={() => setIsCustomizeModalOpen(false)}
                        currentGroups={serviceGroups}
                        onSave={setServiceGroups}
                    />
                )}
                {isResearchModalOpen && (
                    <ResearchModal
                        isOpen={isResearchModalOpen}
                        isLoading={isResearching}
                        error={researchError}
                        result={researchResult}
                        sources={researchSources}
                        onClose={closeResearchModal}
                    />
                )}
            </div>
        </TimeProvider>
    );
};

export default App;