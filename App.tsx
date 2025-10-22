import { GoogleGenAI } from '@google/genai';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

// FIX: Added the full implementation for the main App component, which was missing.
// This resolves "not a module" errors and provides the central logic for the dashboard.
import AICompanionModal from './components/AICompanionModal';
import AICompanionWidget from './components/AICompanionWidget';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import Clock from './components/Clock';
import CollapseAllWidget from './components/CollapseAllWidget';
import CustomizeModal from './components/CustomizeModal';
import Favicon from './components/Favicon';
import FeedWidget from './components/FeedWidget';
import FocusSessionOverlay from './components/FocusSessionOverlay';
import GoogleBar from './components/GoogleBar';
import Greeting from './components/Greeting';
import OmniBar from './components/OmniBar';
import OnboardingModal from './components/OnboardingModal';
import PoziBar from './components/PoziBar';
import Quote from './components/Quote';
import ResearchModal from './components/ResearchModal';
import SearchWidget from './components/SearchWidget';
import ServiceGroups from './components/ServiceGroups';
import SettingsModal, { SettingsData } from './components/SettingsModal';
import SettingsWidget from './components/SettingsWidget';
import TodoWidget from './components/TodoWidget';
import Weather from './components/Weather';
import YouTubeWidget from './components/YouTubeWidget';
import {
  BACKGROUND_IMAGES,
  getIcon,
  GOOGLE_SERVICES,
  LOCAL_STORAGE_KEYS,
  POZI_SERVICES,
  SERVICE_GROUPS,
  THEMES,
} from './constants';
import { TimeProvider } from './contexts/TimeContext';
import useLocalStorage from './hooks/useLocalStorage';
import type {
  ChatMessage,
  FocusDuration,
  GroundingChunk,
  Link,
  ResearchBackend,
  SearchableItem,
  ServiceGroup,
  StoredService,
  StoredServiceGroup,
  UserFeed,
} from './types';

export interface OnboardingData {
  name: string;
  location: string;
  focusPrompt: string;
  apiKey: string;
}

const toStoredServiceGroups = (groups: ServiceGroup[]): StoredServiceGroup[] => {
  return groups.map((group) => ({
    category: group.category,
    services: group.services.map((service) => ({
      name: service.name,
      url: service.url,
      iconKey: service.iconKey,
      inProduction: service.inProduction,
    })),
  }));
};

const defaultServiceGroups: ServiceGroup[] = [
  { category: 'Google', services: GOOGLE_SERVICES },
  { category: 'POZI', services: POZI_SERVICES },
  ...SERVICE_GROUPS,
];

// A special identifier for the Links widget to be used in the collapsed state set.
const LINKS_WIDGET_CATEGORY_KEY = '__LINKS__';

const App: React.FC = () => {
  // Local storage backed state
  const [name, setName] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.USER_NAME,
    'User',
  );
  const [location, setLocation] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.WEATHER_LOCATION,
    '',
  );
  const [links, setLinks] = useLocalStorage<Link[]>(
    LOCAL_STORAGE_KEYS.USER_LINKS,
    [],
  );
  const [feedUrls, setFeedUrls] = useLocalStorage<UserFeed[]>(
    LOCAL_STORAGE_KEYS.USER_FEEDS,
    [],
  );
  const [focus, setFocus] = useLocalStorage(LOCAL_STORAGE_KEYS.DAILY_FOCUS, '');
  const [focusPrompt, setFocusPrompt] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.FOCUS_PROMPT,
    'What is your main goal for today?',
  );
   const [focusDuration, setFocusDuration] = useLocalStorage<FocusDuration>(
    LOCAL_STORAGE_KEYS.FOCUS_SESSION_DURATION,
    25
  );
  const [theme, setTheme] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.USER_THEME,
    'cyberwave',
  );
  const [geminiApiKey, setGeminiApiKey] = useLocalStorage<string>(
    LOCAL_STORAGE_KEYS.GEMINI_API_KEY,
    '',
  );
  const [researchBackend, setResearchBackend] =
    useLocalStorage<ResearchBackend>(
      LOCAL_STORAGE_KEYS.RESEARCH_BACKEND,
      'gemini',
    );
  const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>(
    LOCAL_STORAGE_KEYS.HAS_ONBOARDED,
    false,
  );
  const [storedServiceGroups, setStoredServiceGroups] = useLocalStorage<
    StoredServiceGroup[]
  >(
    LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS,
    toStoredServiceGroups(defaultServiceGroups),
  );
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(
    LOCAL_STORAGE_KEYS.CHAT_HISTORY,
    [],
  );
  
  // State for widget collapse, lifted up from ServiceGroups
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  // Modal visibility state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('general');
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isOmniBarOpen, setIsOmniBarOpen] = useState(false);

  // Research state
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [researchSources, setResearchSources] = useState<
    GroundingChunk[] | null
  >(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);

  // AI Companion State
  const [isResponding, setIsResponding] = useState(false);

  // Focus Session state
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  const [focusSessionEndTime, setFocusSessionEndTime] = useState<number | null>(null);


  // Migrate and filter feeds
  const { rssFeeds, youtubeFeeds } = useMemo(() => {
    const migratedFeeds = feedUrls.map(feed => {
        // This check provides a seamless, one-time migration for users with old data
        if (!feed.type) {
            return {
                ...feed,
                type: feed.url.includes('youtube.com') ? 'youtube' : 'rss'
            };
        }
        return feed;
    });

    return {
        rssFeeds: migratedFeeds.filter(f => f.type === 'rss'),
        youtubeFeeds: migratedFeeds.filter(f => f.type === 'youtube'),
    };
  }, [feedUrls]);


  const ai = useMemo(() => {
    try {
      // Per instructions, API key must come from environment.
      if (process.env.API_KEY) {
        return new GoogleGenAI({ apiKey: process.env.API_KEY });
      }
      return null;
    } catch (e) {
      console.error('Failed to initialize GoogleGenAI', e);
      return null;
    }
  }, []);

  // Hydrate service groups with icon components
  const hydratedServiceGroups = useMemo<ServiceGroup[]>(() => {
    return storedServiceGroups.map((group: StoredServiceGroup) => ({
      ...group,
      services: group.services.map((service: StoredService) => ({
        ...service,
        icon: getIcon(service.iconKey),
      })),
    }));
  }, [storedServiceGroups]);

  // Create a unified list of all searchable items for the OmniBar
  const searchableItems = useMemo<SearchableItem[]>(() => {
    const serviceItems: SearchableItem[] = hydratedServiceGroups.flatMap(
      (group) =>
        group.services.map((service) => ({
          type: 'service',
          name: service.name,
          url: service.url,
          icon: service.icon,
          category: group.category,
        })),
    );
    const linkItems: SearchableItem[] = links.map((link) => ({
      type: 'link',
      name: link.name,
      url: link.url,
      icon: <Favicon link={link} />,
      category: 'Personal Links',
    }));
    return [...serviceItems, ...linkItems];
  }, [hydratedServiceGroups, links]);

  // Background image logic
  const [backgroundImage, setBackgroundImage] = useState('');
  const refreshBackgroundImage = useCallback(() => {
    const randomImage =
      BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    setBackgroundImage(randomImage);
  }, []);

  useEffect(() => {
    refreshBackgroundImage();
  }, [refreshBackgroundImage]);

  // Theme logic
  useEffect(() => {
    const currentTheme = THEMES.find((t) => t.id === theme) || THEMES[0];
    document.documentElement.className = currentTheme.className;
  }, [theme]);

  // Global keyboard listener for OmniBar
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        setIsOmniBarOpen((open) => !open);
      } else if (event.key === 'Escape') {
        setIsOmniBarOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const openSettings = (tab = 'general') => {
    setSettingsInitialTab(tab);
    setIsSettingsOpen(true);
  };

  const handleStartFocus = () => {
    setFocusSessionEndTime(Date.now() + focusDuration * 60 * 1000);
    setIsFocusSessionActive(true);
  };
  
  const handleEndFocus = () => {
    setIsFocusSessionActive(false);
    setFocusSessionEndTime(null);
  };
  
  // --- Collapse All Logic ---
  const allCategoryKeys = useMemo(() => 
    [LINKS_WIDGET_CATEGORY_KEY, ...hydratedServiceGroups.map(g => g.category)],
    [hydratedServiceGroups]
  );

  const areAllCollapsed = collapsedCategories.size >= allCategoryKeys.length;
  
  const handleCollapseAll = () => setCollapsedCategories(new Set(allCategoryKeys));
  const handleExpandAll = () => setCollapsedCategories(new Set());

  const toggleCategoryCollapse = (category: string) => {
    setCollapsedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  const handleResearchSubmit = async (query: string) => {
    if (researchBackend === 'mcp') {
      alert('Local AI (MCP) is not yet implemented.');
      return;
    }
    if (!ai) {
      setResearchError(
        'Gemini API is not available. Ensure API_KEY is configured in your environment.',
      );
      setIsResearchModalOpen(true);
      return;
    }
    setIsResearchModalOpen(true);
    setIsResearchLoading(true);
    setResearchResult(null);
    setResearchSources(null);
    setResearchError(null);

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: query,
        config: {
          tools: [{ googleSearch: {} }],
        },
      });

      setResearchResult(response.text);
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) {
        setResearchSources(
          response.candidates[0].groundingMetadata
            .groundingChunks as GroundingChunk[],
        );
      }
    } catch (e) {
      console.error('Research error:', e);
      if (e instanceof Error) {
        setResearchError(e.message);
      } else {
        setResearchError('An unknown error occurred during research.');
      }
    } finally {
      setIsResearchLoading(false);
    }
  };

  const handleSendMessage = async (message: string) => {
    if (!ai) {
      alert(
        'Gemini API is not available. Ensure API_KEY is configured in your environment.',
      );
      return;
    }
    const newHistory: ChatMessage[] = [
      ...chatHistory,
      { role: 'user', text: message },
    ];
    setChatHistory(newHistory);
    setIsResponding(true);

    try {
      const chat = ai.chats.create({ model: 'gemini-2.5-flash' });
      const response = await chat.sendMessage({ message });

      setChatHistory([...newHistory, { role: 'model', text: response.text }]);
    } catch (e) {
      console.error('AI Companion error:', e);
      const errorText =
        e instanceof Error ? e.message : 'An unknown error occurred.';
      setChatHistory([
        ...newHistory,
        { role: 'model', text: `Sorry, I encountered an error: ${errorText}` },
      ]);
    } finally {
      setIsResponding(false);
    }
  };

  const handleClearHistory = () => {
    if (
      window.confirm('Are you sure you want to clear the conversation history?')
    ) {
      setChatHistory([]);
    }
  };

  const handleOnboardingComplete = (data: OnboardingData) => {
    setName(data.name || 'User');
    setLocation(data.location);
    setFocusPrompt(data.focusPrompt || 'What is your main goal for today?');
    setGeminiApiKey(data.apiKey);
    setHasOnboarded(true);
  };

  const handleSaveCustomization = (newGroups: ServiceGroup[]) => {
    const stored: StoredServiceGroup[] = newGroups.map((group) => ({
      category: group.category,
      services: group.services.map((service) => ({
        name: service.name,
        url: service.url,
        iconKey: service.iconKey,
        inProduction: service.inProduction,
      })),
    }));
    setStoredServiceGroups(stored);
  };
  
  const handleSettingsSave = (data: SettingsData) => {
    setName(data.name);
    setLocation(data.location);
    setLinks(data.links);
    setFeedUrls(data.feedUrls);
    setFocusPrompt(data.focusPrompt);
    setFocusDuration(data.focusDuration);
    setTheme(data.theme);
    setGeminiApiKey(data.geminiApiKey);
    setResearchBackend(data.researchBackend);
    setIsSettingsOpen(false);
  };

  if (!hasOnboarded) {
    return <OnboardingModal onComplete={handleOnboardingComplete} />;
  }

  const mainContentClass = `h-full w-full bg-black/40 backdrop-blur-sm flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar transition-opacity duration-500 ${isFocusSessionActive ? 'opacity-0' : 'opacity-100'}`;

  return (
    <TimeProvider>
      <div
        className="h-screen w-screen bg-cover bg-center bg-no-repeat text-white transition-all duration-1000"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className={mainContentClass}>
          <header className="flex justify-between items-start">
            <div className="flex items-center space-x-2">
              <GoogleBar />
              <PoziBar />
            </div>
            <div className="flex items-center space-x-2">
                <Weather location={location} />
                <CollapseAllWidget
                    areAllCollapsed={areAllCollapsed}
                    onCollapseAll={handleCollapseAll}
                    onExpandAll={handleExpandAll}
                />
            </div>
          </header>

          <main className="flex-grow flex flex-col justify-center items-center text-center">
            <Clock />
            <Greeting name={name} focusPrompt={focusPrompt} onStartFocus={handleStartFocus} />
            <div className="w-full max-w-4xl mx-auto mt-12">
              <SearchWidget
                researchBackend={researchBackend}
                onOpenSettings={() => openSettings('research')}
                onResearchSubmit={handleResearchSubmit}
              />
            </div>
          </main>

          <div className="w-full max-w-7xl mx-auto mt-8">
            <ServiceGroups
              links={links}
              onOpenSettings={() => openSettings('links')}
              serviceGroups={hydratedServiceGroups}
              collapsedCategories={collapsedCategories}
              onToggleCategory={toggleCategoryCollapse}
            />
          </div>
          
          <div className="w-full max-w-7xl mx-auto mt-8">
            <FeedWidget
                feedUrls={rssFeeds}
                onOpenSettings={() => openSettings('feeds')}
            />
          </div>
          
          {youtubeFeeds.length > 0 && (
             <div className="w-full max-w-7xl mx-auto mt-8">
                <YouTubeWidget
                    feedUrls={youtubeFeeds}
                    onOpenSettings={() => openSettings('feeds')}
                />
            </div>
          )}


          <footer className="w-full flex justify-between items-end mt-8">
            <div className="flex-1 text-left">
              <Quote />
            </div>
            <div className="flex items-center space-x-2">
              <div
                onClick={() => setIsOmniBarOpen(true)}
                className="hidden md:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-black/20 border border-white/10 cursor-pointer hover:border-white/20 transition-colors"
              >
                <kbd className="font-sans text-sm font-semibold text-white/70">
                  {navigator.userAgent.includes('Mac') ? '⌘' : 'Ctrl'}
                </kbd>
                <kbd className="font-sans text-sm font-semibold text-white/70">
                  K
                </kbd>
              </div>
              <BackgroundSwitcher onRefresh={refreshBackgroundImage} />
              <TodoWidget />
              <AICompanionWidget onClick={() => setIsCompanionOpen(true)} />
              <SettingsWidget onOpenSettings={() => openSettings('general')} />
            </div>
          </footer>
        </div>
      </div>
      
      {isFocusSessionActive && focusSessionEndTime && (
        <FocusSessionOverlay
          goal={focus}
          endTime={focusSessionEndTime}
          duration={focusDuration}
          onEnd={handleEndFocus}
        />
      )}

      <OmniBar
        isOpen={isOmniBarOpen}
        onClose={() => setIsOmniBarOpen(false)}
        items={searchableItems}
      />

      {isSettingsOpen && (
        <SettingsModal
          initialTab={settingsInitialTab}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          onOpenCustomizeModal={() => {
            setIsSettingsOpen(false);
            setIsCustomizeModalOpen(true);
          }}
          currentSettings={{
              name,
              location,
              links,
              feedUrls,
              focusPrompt,
              focusDuration,
              theme,
              geminiApiKey,
              researchBackend
          }}
        />
      )}
      <ResearchModal
        isOpen={isResearchModalOpen}
        onClose={() => setIsResearchModalOpen(false)}
        isLoading={isResearchLoading}
        error={researchError}
        result={researchResult}
        sources={researchSources}
      />
      <CustomizeModal
        isOpen={isCustomizeModalOpen}
        onClose={() => setIsCustomizeModalOpen(false)}
        currentGroups={hydratedServiceGroups}
        onSave={handleSaveCustomization}
      />
      <AICompanionModal
        isOpen={isCompanionOpen}
        onClose={() => setIsCompanionOpen(false)}
        history={chatHistory}
        onSendMessage={handleSendMessage}
        isResponding={isResponding}
        onClearHistory={handleClearHistory}
      />
    </TimeProvider>
  );
};

export default App;