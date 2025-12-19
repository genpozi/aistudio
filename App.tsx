
import { GoogleGenAI } from '@google/genai';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import AICompanionModal from './components/AICompanionModal';
import AICompanionWidget from './components/AICompanionWidget';
import AmpersandBar from './components/AmpersandBar';
import BackgroundSwitcher from './components/BackgroundSwitcher';
import Clock from './components/Clock';
import CollapseAllWidget from './components/CollapseAllWidget';
import CustomizeModal from './components/CustomizeModal';
import Favicon from './components/Favicon';
import FeedWidget from './components/FeedWidget';
import FocusSessionOverlay from './components/FocusSessionOverlay';
import GoogleBar from './components/GoogleBar';
import Greeting from './components/Greeting';
import IconBar from '././components/IconBar';
import LinksWidget from './components/LinksWidget';
import OmniBar from './components/OmniBar';
import OnboardingModal from './components/OnboardingModal';
import PoziBar from './components/PoziBar';
import Quote from './components/Quote';
import ResearchModal from './components/ResearchModal';
import SearchWidget from './components/SearchWidget';
import { ServiceGroupCard } from './components/ServiceGroupCard';
import SettingsModal, { SettingsData } from './components/SettingsModal';
import SettingsWidget from './components/SettingsWidget';
import TodoCardWidget from './components/TodoCardWidget';
import Weather from './components/Weather';
import YouTubeWidget from './components/YouTubeWidget';
import {
  BACKGROUND_IMAGES,
  DEFAULT_FEEDS,
  getIcon,
  I_SERVICES,
  ICONS,
  LOCAL_STORAGE_KEYS,
  SERVICE_GROUPS,
  THEMES,
  Z_SERVICES,
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
  Todo,
  UserFeed,
} from './types';

export interface OnboardingData {
  name: string;
  location: string;
  focusPrompt: string;
}

const LINKS_WIDGET_CATEGORY_KEY = '__LINKS__';
const TODO_WIDGET_CATEGORY_KEY = '__TODO__';

// Logical row groupings for the 3-column layout
const WIDGET_ROWS = [
    [LINKS_WIDGET_CATEGORY_KEY, TODO_WIDGET_CATEGORY_KEY, 'WIDGETS'],
    ['TOOLBOX', 'COLLECTIVE', 'POZIVERSE']
];

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

const defaultServiceGroups: ServiceGroup[] = [...SERVICE_GROUPS];

const App: React.FC = () => {
  const [name, setName] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.USER_NAME, 'My Leige 🙇');
  const [location, setLocation] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.WEATHER_LOCATION, '');
  const [links, setLinks] = useLocalStorage<Link[]>(LOCAL_STORAGE_KEYS.USER_LINKS, []);
  const [feedUrls, setFeedUrls] = useLocalStorage<UserFeed[]>(LOCAL_STORAGE_KEYS.USER_FEEDS, DEFAULT_FEEDS);
  const [focus, setFocus] = useLocalStorage(LOCAL_STORAGE_KEYS.DAILY_FOCUS, '');
  const [focusPrompt, setFocusPrompt] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.FOCUS_PROMPT, 'What is your main goal for today?');
  const [focusDuration, setFocusDuration] = useLocalStorage<FocusDuration>(LOCAL_STORAGE_KEYS.FOCUS_SESSION_DURATION, 25);
  const [theme, setTheme] = useLocalStorage<string>(LOCAL_STORAGE_KEYS.USER_THEME, 'cyberwave');
  const [researchBackend, setResearchBackend] = useLocalStorage<ResearchBackend>(LOCAL_STORAGE_KEYS.RESEARCH_BACKEND, 'gemini');
  const [hasOnboarded, setHasOnboarded] = useLocalStorage<boolean>(LOCAL_STORAGE_KEYS.HAS_ONBOARDED, false);
  const [storedServiceGroups, setStoredServiceGroups] = useLocalStorage<StoredServiceGroup[]>(LOCAL_STORAGE_KEYS.USER_SERVICE_GROUPS, toStoredServiceGroups(defaultServiceGroups));
  const [chatHistory, setChatHistory] = useLocalStorage<ChatMessage[]>(LOCAL_STORAGE_KEYS.CHAT_HISTORY, []);
  const [todos, setTodos] = useLocalStorage<Todo[]>(LOCAL_STORAGE_KEYS.USER_TODOS, []);
  const [collapsedKeys, setCollapsedKeys] = useLocalStorage<string[]>(LOCAL_STORAGE_KEYS.COLLAPSED_CATEGORIES, [LINKS_WIDGET_CATEGORY_KEY, TODO_WIDGET_CATEGORY_KEY, 'WIDGETS', 'TOOLBOX', 'COLLECTIVE', 'POZIVERSE']);

  const collapsedCategories = useMemo(() => new Set(collapsedKeys), [collapsedKeys]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsInitialTab, setSettingsInitialTab] = useState('general');
  const [isResearchModalOpen, setIsResearchModalOpen] = useState(false);
  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);
  const [isCompanionOpen, setIsCompanionOpen] = useState(false);
  const [isOmniBarOpen, setIsOmniBarOpen] = useState(false);
  const [researchResult, setResearchResult] = useState<string | null>(null);
  const [researchSources, setResearchSources] = useState<GroundingChunk[] | null>(null);
  const [isResearchLoading, setIsResearchLoading] = useState(false);
  const [researchError, setResearchError] = useState<string | null>(null);
  const [isResponding, setIsResponding] = useState(false);
  const [isFocusSessionActive, setIsFocusSessionActive] = useState(false);
  const [focusSessionEndTime, setFocusSessionEndTime] = useState<number | null>(null);

  const { rssFeeds, youtubeFeeds } = useMemo(() => {
    const migrated = feedUrls.map(f => ({ ...f, type: f.type || (f.url.includes('youtube.com') ? 'youtube' : 'rss') }));
    return { rssFeeds: migrated.filter(f => f.type === 'rss'), youtubeFeeds: migrated.filter(f => f.type === 'youtube') };
  }, [feedUrls]);

  const hydratedServiceGroups = useMemo<ServiceGroup[]>(() => {
    return storedServiceGroups.map(group => ({
      ...group,
      services: group.services.map(s => ({ ...s, icon: getIcon(s.iconKey) })),
    }));
  }, [storedServiceGroups]);
  
  const serviceGroupsMap = useMemo(() => {
    const map = new Map<string, ServiceGroup>();
    hydratedServiceGroups.forEach(g => map.set(g.category, g));
    return map;
  }, [hydratedServiceGroups]);

  const searchableItems = useMemo<SearchableItem[]>(() => {
    const services: SearchableItem[] = hydratedServiceGroups.flatMap(g => g.services.map(s => ({ type: 'service' as const, name: s.name, url: s.url, icon: s.icon, category: g.category })));
    const userLinks: SearchableItem[] = links.map(l => ({ type: 'link' as const, name: l.name, url: l.url, icon: <Favicon link={l} />, category: 'Personal Links' }));
    return [...services, ...userLinks];
  }, [hydratedServiceGroups, links]);

  const [backgroundImage, setBackgroundImage] = useState('');
  const refreshBackgroundImage = useCallback(() => {
    setBackgroundImage(BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)]);
  }, []);

  useEffect(() => { refreshBackgroundImage(); }, [refreshBackgroundImage]);
  useEffect(() => { document.documentElement.className = THEMES.find(t => t.id === theme)?.className || THEMES[0].className; }, [theme]);

  const openSettings = (tab = 'general') => { setSettingsInitialTab(tab); setIsSettingsOpen(true); };
  const allCategoryKeys = useMemo(() => [LINKS_WIDGET_CATEGORY_KEY, TODO_WIDGET_CATEGORY_KEY, ...hydratedServiceGroups.map(g => g.category)], [hydratedServiceGroups]);
  
  // LOGIC CHECK: sound logic for omni-collapse is "if any are expanded, collapse them all. if all are collapsed, expand them all."
  const areAllCollapsed = collapsedCategories.size >= allCategoryKeys.length;
  const handleCollapseAll = () => setCollapsedKeys(allCategoryKeys);
  const handleExpandAll = () => setCollapsedKeys([]);

  // Individual toggle function
  const toggleCategoryCollapse = (category: string) => {
    const newSet = new Set(collapsedCategories);
    newSet.has(category) ? newSet.delete(category) : newSet.add(category);
    setCollapsedKeys(Array.from(newSet));
  };

  // Row synchronization function
  const toggleRowCollapse = (key: string) => {
    const row = WIDGET_ROWS.find(r => r.includes(key));
    if (!row) {
        toggleCategoryCollapse(key);
        return;
    }
    
    // If ANY item in the row is currently expanded, we collapse the whole row.
    // Otherwise, we expand the whole row.
    const isAnyExpandedInRow = row.some(k => !collapsedCategories.has(k));
    const newSet = new Set(collapsedKeys);
    
    if (isAnyExpandedInRow) {
        row.forEach(k => newSet.add(k));
    } else {
        row.forEach(k => newSet.delete(k));
    }
    setCollapsedKeys(Array.from(newSet));
  };

  const handleResearchSubmit = async (query: string) => {
    // FIX: Optimized for research complexity by using gemini-3-pro-preview.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    setIsResearchModalOpen(true); setIsResearchLoading(true); setResearchResult(null); setResearchSources(null); setResearchError(null);
    try {
      const response = await ai.models.generateContent({ model: 'gemini-3-pro-preview', contents: query, config: { tools: [{ googleSearch: {} }] } });
      setResearchResult(response.text);
      if (response.candidates?.[0]?.groundingMetadata?.groundingChunks) setResearchSources(response.candidates[0].groundingMetadata.groundingChunks as GroundingChunk[]);
    } catch (e) { setResearchError(e instanceof Error ? e.message : 'Unknown research error'); } finally { setIsResearchLoading(false); }
  };

  const handleSendMessage = async (message: string) => {
    // FIX: Upgraded to gemini-3-pro-preview for advanced conversational capabilities in the AI Companion.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const newHistory: ChatMessage[] = [...chatHistory, { role: 'user', text: message }];
    setChatHistory(newHistory); setIsResponding(true);
    try {
      const chat = ai.chats.create({ model: 'gemini-3-pro-preview' });
      const response = await chat.sendMessage({ message });
      setChatHistory([...newHistory, { role: 'model', text: response.text }]);
    } catch (e) { setChatHistory([...newHistory, { role: 'model', text: `Error: ${e instanceof Error ? e.message : 'Unknown'}` }]); } finally { setIsResponding(false); }
  };

  if (!hasOnboarded) return <OnboardingModal onComplete={d => { setName(d.name); setLocation(d.location); setFocusPrompt(d.focusPrompt); setHasOnboarded(true); }} />;

  return (
    <TimeProvider>
      <div className="h-screen w-screen bg-cover bg-center bg-no-repeat text-white transition-all duration-1000" style={{ backgroundImage: `url(${backgroundImage})` }}>
        <div className={`h-full w-full bg-black/40 backdrop-blur-sm flex flex-col p-4 md:p-8 overflow-y-auto custom-scrollbar transition-opacity duration-500 ${isFocusSessionActive ? 'opacity-0' : 'opacity-100'}`}>
          <header className="flex flex-col md:flex-row justify-between items-start w-full gap-8 mb-12">
            <div className="flex flex-col items-start space-y-4 flex-shrink-0">
              <PoziBar />
              <AmpersandBar />
              <IconBar triggerIcon={ICONS.Z_LOGO} services={Z_SERVICES} />
              <IconBar triggerIcon={ICONS.I_LOGO} services={I_SERVICES} />
            </div>
            <div className="flex flex-col items-center text-center flex-grow pt-2">
              <Clock />
              <Greeting name={name} focusPrompt={focusPrompt} onStartFocus={() => { setFocusSessionEndTime(Date.now() + focusDuration * 60 * 1000); setIsFocusSessionActive(true); }} />
              <div className="w-full max-w-2xl mx-auto mt-8">
                <SearchWidget researchBackend={researchBackend} onOpenSettings={() => openSettings('research')} onResearchSubmit={handleResearchSubmit} />
              </div>
            </div>
            <div className="flex flex-col items-end space-y-4 flex-shrink-0 pt-2">
                <Weather location={location} />
                <CollapseAllWidget areAllCollapsed={areAllCollapsed} onCollapseAll={handleCollapseAll} onExpandAll={handleExpandAll} />
                <GoogleBar direction="down" />
            </div>
          </header>

          <main className="flex-grow">
            <div className="w-full max-w-7xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
                  <LinksWidget 
                    links={links} 
                    onOpenSettings={() => openSettings('links')} 
                    isCollapsed={collapsedCategories.has(LINKS_WIDGET_CATEGORY_KEY)} 
                    onToggleIndividual={() => toggleCategoryCollapse(LINKS_WIDGET_CATEGORY_KEY)}
                    onToggleRow={() => toggleRowCollapse(LINKS_WIDGET_CATEGORY_KEY)}
                  />
                  <TodoCardWidget 
                    todos={todos} 
                    setTodos={setTodos} 
                    isCollapsed={collapsedCategories.has(TODO_WIDGET_CATEGORY_KEY)} 
                    onToggleIndividual={() => toggleCategoryCollapse(TODO_WIDGET_CATEGORY_KEY)}
                    onToggleRow={() => toggleRowCollapse(TODO_WIDGET_CATEGORY_KEY)}
                  />
                  {['WIDGETS', 'TOOLBOX', 'COLLECTIVE', 'POZIVERSE'].map(cat => serviceGroupsMap.has(cat) && (
                      <ServiceGroupCard 
                        key={cat} 
                        group={serviceGroupsMap.get(cat)!} 
                        isCollapsed={collapsedCategories.has(cat)} 
                        onToggleIndividual={() => toggleCategoryCollapse(cat)}
                        onToggleRow={() => toggleRowCollapse(cat)}
                      />
                  ))}
              </div>
            </div>
            <div className="w-full max-w-7xl mx-auto mt-6 space-y-6">
              <FeedWidget feedUrls={rssFeeds} onOpenSettings={() => openSettings('feeds')} />
              <YouTubeWidget feedUrls={youtubeFeeds} onOpenSettings={() => openSettings('feeds')} />
            </div>
          </main>

          <footer className="w-full flex justify-between items-end mt-8">
            <Quote />
            <div className="flex items-center space-x-2">
              <BackgroundSwitcher onRefresh={refreshBackgroundImage} />
              <AICompanionWidget onClick={() => setIsCompanionOpen(true)} />
              <SettingsWidget onOpenSettings={() => openSettings('general')} />
            </div>
          </footer>
        </div>
      </div>
      {isFocusSessionActive && focusSessionEndTime && <FocusSessionOverlay goal={focus} endTime={focusSessionEndTime} duration={focusDuration} onEnd={() => setIsFocusSessionActive(false)} />}
      <OmniBar isOpen={isOmniBarOpen} onClose={() => setIsOmniBarOpen(false)} items={searchableItems} />
      {isSettingsOpen && <SettingsModal initialTab={settingsInitialTab} onClose={() => setIsSettingsOpen(false)} onOpenCustomizeModal={() => { setIsSettingsOpen(false); setIsCustomizeModalOpen(true); }} currentSettings={{ name, location, links, feedUrls, focusPrompt, focusDuration, theme, researchBackend }} onSave={d => { setName(d.name); setLocation(d.location); setLinks(d.links); setFeedUrls(d.feedUrls); setFocusPrompt(d.focusPrompt); setFocusDuration(d.focusDuration); setTheme(d.theme); setResearchBackend(d.researchBackend); setIsSettingsOpen(false); }} />}
      <ResearchModal isOpen={isResearchModalOpen} onClose={() => setIsResearchModalOpen(false)} isLoading={isResearchLoading} error={researchError} result={researchResult} sources={researchSources} />
      <CustomizeModal isOpen={isCustomizeModalOpen} onClose={() => setIsCustomizeModalOpen(false)} currentGroups={hydratedServiceGroups} onSave={groups => setStoredServiceGroups(groups.map(g => ({ category: g.category, services: g.services.map(s => ({ name: s.name, url: s.url, iconKey: s.iconKey, inProduction: s.inProduction })) })))} />
      <AICompanionModal isOpen={isCompanionOpen} onClose={() => setIsCompanionOpen(false)} history={chatHistory} onSendMessage={handleSendMessage} isResponding={isResponding} onClearHistory={() => setChatHistory([])} />
    </TimeProvider>
  );
};

export default App;
