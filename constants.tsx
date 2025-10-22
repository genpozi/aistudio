import React from 'react';
import type { Service, ServiceGroup, Theme } from './types';

export const SCHEMA_VERSION = 2;

export const ICONS = {
    Code: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Sparkles: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" /></svg>,
    User: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    Globe: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.293-.293a1 1 0 011.414 0l.293.293M10 21v-4m4 4v-4m-4-2.293l.293-.293a1 1 0 011.414 0l.293.293m-4 0l-.293.293a1 1 0 000 1.414l.293.293m0-1.414l.293-.293a1 1 0 011.414 0l.293.293" /></svg>,
    Cloud: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" /></svg>,
    Document: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" /></svg>,
    CheckSquare: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
    Lock: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" /></svg>,
    Briefcase: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.075c0 1.313-.964 2.4-2.175 2.4H5.925A2.175 2.175 0 013.75 18.225V14.15M16.5 6.75h-9v4.5h9v-4.5z" /><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 3a.75.75 0 00-.75.75v3h4.5v-3a.75.75 0 00-.75-.75h-3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 18.225V14.15m16.5 4.075V14.15" /></svg>,
    Trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    ExternalLink: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
    Refresh: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 19.5L20 20" /></svg>,
    Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
    Settings: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
    // FIX: Corrected a typo in the `strokeWidth` attribute for the 'Plus' icon SVG.
    Plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>,
    ChevronUp: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" /></svg>,
    Brain: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 13.5c0 1.657 2.015 3 4.5 3s4.5-1.343 4.5-3c0-1.657-2.015-3-4.5-3s-4.5 1.343-4.5 3z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 13.5V12c0-1.657-2.015-3-4.5-3S5 10.343 5 12v1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 13.5V15c0 1.657 2.015 3 4.5 3s4.5-1.343 4.5-3v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 13.5V12" /><path strokeLinecap="round" strokeLinejoin="round" d="M9.5 13.5V12" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 100-18 9 9 0 000 18z" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M21 12h-1.5" /><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12H3" /></svg>,
    ChatBubble: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.455.09-.934.09-1.425 0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /><path strokeLinecap="round" strokeLinejoin="round" d="M3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25" /></svg>,
    GOOGLE: {
        Logo: <svg viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>,
        Gemini: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 17.75l-5.17-8.95L12 0l5.17 8.8 5.17 8.95z M6.83 8.8L12 17.75 17.17 8.8 12 0z"/></svg>,
        Gmail: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M22 6c0-1.1-.9-2-2-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6zm-2 0l-8 5-8-5h16zm0 12H4V8l8 5 8-5v10z"/></svg>,
        Calendar: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zM9 14H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2zm-8 4H7v-2h2v2zm4 0h-2v-2h2v2zm4 0h-2v-2h2v2z"/></svg>,
        Drive: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M7.71 3.5L1.5 14h5.5l6-10.5zM9.83 15L12 11.5 15 17h-8.5zM16.29 3.5L10.5 14h12z"/></svg>,
        Keep: <svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 21c0 .55.45 1 1 1h4c.55 0 1-.45 1-1V20H9v1zm3-19C8.14 2 5 5.14 5 9c0 2.38 1.19 4.47 3 5.74V17c0 .55.45 1 1 1h6c.55 0 1-.45 1-1v-2.26c1.81-1.27 3-3.36 3-5.74 0-3.86-3.14-7-7-7z"/></svg>,
    },
    POZI: {
        Logo: (
            <svg viewBox="0 0 24 24" fill="currentColor">
                <defs>
                    <linearGradient id="poziGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" style={{ stopColor: '#58267e' }} />
                        <stop offset="20%" style={{ stopColor: '#0071bc' }} />
                        <stop offset="40%" style={{ stopColor: '#39b54a' }} />
                        <stop offset="60%" style={{ stopColor: '#fbb03b' }} />
                        <stop offset="80%" style={{ stopColor: '#d92121' }} />
                        <stop offset="100%" style={{ stopColor: '#c42069' }} />
                    </linearGradient>
                </defs>
                <path
                    fill="url(#poziGradient)"
                    d="M12.5,2C8.5,2,5,5.5,5,9.5v10h5V14h3.5c3,0,5.5-2.5,5.5-5.5S16,2,12.5,2z M12.5,6c1.9,0,3.5,1.6,3.5,3.5S14.4,13,12.5,13h-3V6H12.5z"
                />
            </svg>
        ),
    }
};

/**
 * Resolves an icon component from a string key (e.g., 'Globe', 'GOOGLE.Gemini').
 * This is crucial for rehydrating icons from localStorage.
 * @param iconKey The string identifier for the icon.
 * @returns A ReactNode representing the icon, or a fallback Globe icon.
 */
export const getIcon = (iconKey: string): React.ReactNode => {
    const parts = iconKey.split('.');
    let current: any = ICONS;
    for (const part of parts) {
        if (current?.[part] === undefined) return ICONS.Globe; // Fallback for invalid keys
        current = current[part];
    }
    return React.isValidElement(current) ? current : ICONS.Globe; // Final fallback if path is valid but not an element
};

export const CORS_PROXY_URL = 'https://corsproxy.io/?';

export const LOCAL_STORAGE_KEYS = {
    USER_NAME: 'userName',
    WEATHER_LOCATION: 'weatherLocation',
    USER_LINKS: 'userLinks',
    USER_FEEDS: 'userFeeds',
    DAILY_FOCUS: 'dailyFocus',
    FOCUS_PROMPT: 'focusPrompt',
    USER_TODOS: 'userTodos',
    USER_THEME: 'userTheme',
    GEMINI_API_KEY: 'geminiApiKey',
    RESEARCH_BACKEND: 'researchBackend',
    HAS_ONBOARDED: 'hasOnboarded',
    USER_SERVICE_GROUPS: 'userServiceGroups',
    DATA_SCHEMA_VERSION: 'dataSchemaVersion',
    CHAT_HISTORY: 'chatHistory',
};

export const THEMES: Theme[] = [
    {
        id: 'chroma',
        name: 'Chroma',
        className: 'theme-chroma',
        colors: { primary: '#16a3af', secondary: '#ffffff' },
    },
    {
        id: 'cyberwave',
        name: 'Cyberwave',
        className: 'theme-cyberwave',
        colors: { primary: '#c084fc', secondary: '#6366f1' },
    },
    {
        id: 'solstice',
        name: 'Solstice',
        className: 'theme-solstice',
        colors: { primary: '#fb923c', secondary: '#eab308' },
    },
];

export const GOOGLE_SERVICES: Service[] = [
    { name: "Gemini", url: "https://gemini.google.com", icon: ICONS.GOOGLE.Gemini, iconKey: "GOOGLE.Gemini" },
    { name: "Google AI Studio", url: "https://aistudio.google.com/", icon: ICONS.Sparkles, iconKey: "Sparkles" },
    { name: "NotebookLM", url: "https://notebooklm.google.com/", icon: ICONS.Document, iconKey: "Document" },
    { name: "Gmail", url: "https://mail.google.com", icon: ICONS.GOOGLE.Gmail, iconKey: "GOOGLE.Gmail" },
    { name: "Calendar", url: "https://calendar.google.com", icon: ICONS.GOOGLE.Calendar, iconKey: "GOOGLE.Calendar" },
    { name: "Google Drive", url: "https://drive.google.com", icon: ICONS.GOOGLE.Drive, iconKey: "GOOGLE.Drive" },
    { name: "Keep", url: "https://keep.google.com", icon: ICONS.GOOGLE.Keep, iconKey: "GOOGLE.Keep" },
];

export const POZI_SERVICES: Service[] = [
    { name: "POZI.ME", url: "https://www.pozi.me", icon: ICONS.Globe, iconKey: "Globe" },
    { name: "POZI.SERVICES", url: "https://www.pozi.services", icon: ICONS.Document, iconKey: "Document" },
    { name: "WORKSPACES", url: "https://spaces.stanz.info", icon: ICONS.Briefcase, iconKey: "Briefcase" },
    { name: "POZICLOUD", url: "https://c.stanz.app/apps/dashboard/", icon: ICONS.Cloud, iconKey: "Cloud" },
    { name: "POZICASA", url: "https://dash.stanz.info/#/", icon: ICONS.Lock, iconKey: "Lock" },
    { name: "HOARDER", url: "https://keep.pozi.life/signin", icon: ICONS.Briefcase, iconKey: "Briefcase" },
    { name: "POZIVERSE JUMP", url: "https://link.pozi.agency/", icon: ICONS.Globe, iconKey: "Globe" },
    { name: "POZI OPENWEB AI", url: "https://ai.pozi.plus/", icon: ICONS.Sparkles, iconKey: "Sparkles" },
    { name: "VAULTWARDEN", url: "https://vault.pozi.plus/", icon: ICONS.Lock, iconKey: "Lock" },
];

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "AI TOOLS",
    services: [
      { name: "PERPLEXITY RESEARCH", url: "https://www.perplexity.ai/", icon: ICONS.Sparkles, iconKey: "Sparkles" },
      { name: "BLINK CREATIVE PROJECTS", url: "https://blinko.pozi.plus", icon: ICONS.Sparkles, iconKey: "Sparkles" },
      { name: "AFFINE CREATIVE PROJECTS", url: "https://affine.pozi.agency", icon: ICONS.Sparkles, iconKey: "Sparkles" },
      { name: "POZI AI STUDIO AI-OPEN", url: "https://ai.pozi.plus", icon: ICONS.Sparkles, iconKey: "Sparkles" },
    ],
  },
  {
    category: "SOCIAL & TOOLS",
    services: [
      { name: "SIMPLE LINKS TOOL", url: "https://snap.pozi.agency/dashboard", icon: ICONS.Globe, iconKey: "Globe" },
      { name: "SPOTIFY MUSIC", url: "https://spotify.com", icon: ICONS.User, iconKey: "User" },
      { name: "REDDIT INFO", url: "https://reddit.com", icon: ICONS.Globe, iconKey: "Globe" },
      { name: "KIWIX SERVER INFO", url: "https://kiwi.stanz.app", icon: ICONS.Briefcase, iconKey: "Briefcase" },
      { name: "PDF TOOLS", url: "https://pdf.stanz.app", icon: ICONS.Document, iconKey: "Document" },
    ],
  },
  {
    category: "IN PROGRESS",
    services: [
      { name: "JAAZ CANVA AI", url: "https://8000--0199e4d7-fc95-7a8c-9647-8c615d5797aa.us-east-1-01.gitpod.dev/", icon: ICONS.Sparkles, iconKey: "Sparkles", inProduction: true },
      { name: "MILES MUSIC TABS", url: "https://47777--0199e32c-3ad7-7553-997b-2393edb8f772.us-east-1-01.gitpod.dev/", icon: ICONS.Globe, iconKey: "Globe", inProduction: true },
      { name: "POZIPLEXITY ANSWERS", url: "https://slash.pozi.plus/s/pozipedia", icon: ICONS.Document, iconKey: "Document", inProduction: true },
      { name: "POZIPEDIA RESEARCH", url: "https://8501--0199d6f6-7bbe-7c39-ae2d-664f1939da23.us-east-1-01.gitpod.dev/", icon: ICONS.Sparkles, iconKey: "Sparkles", inProduction: true },
      { name: "PAPERLESS DOCUMENT AI", url: "https://paperless.stanz.app", icon: ICONS.Document, iconKey: "Document" },
    ],
  },
  {
    category: "WORK",
    services: [
      { name: "NEXTCLOUD OPEN", url: "https://cloud.pozi.plus", icon: ICONS.Cloud, iconKey: "Cloud" },
      { name: "CLOUDCASA PRIVATE", url: "https://cloud.pozi.me", icon: ICONS.Cloud, iconKey: "Cloud" },
      { name: "COLANODE SERVER", url: "https://cola.pozi.work", icon: ICONS.Code, iconKey: "Code" },
      { name: "VIKUNJA TODO", url: "https://vikunja.stanz.app", icon: ICONS.CheckSquare, iconKey: "CheckSquare" },
      { name: "HULY PROJECTS", url: "https://huly.pozi.agency/", icon: ICONS.Briefcase, iconKey: "Briefcase" },
      { name: "POZ-IMMICH PHOTOS", url: "https://photos.stanz.app", icon: ICONS.Cloud, iconKey: "Cloud" },
    ],
  },
  {
    category: "LIFE",
    services: [
      { name: "GLANCE DASH", url: "https://glance.pozi.plus", icon: ICONS.Globe, iconKey: "Globe", inProduction: true },
      { name: "HEIMDELL DASH*", url: "https://dash.stanz.app", icon: ICONS.Globe, iconKey: "Globe" },
      { name: "VAULTWARDEN PASSWORDS", url: "https://vault.pozi.plus", icon: ICONS.Lock, iconKey: "Lock" },
      { name: "WORKSPACES KASM", url: "https://spaces.stanz.info/", icon: ICONS.Briefcase, iconKey: "Briefcase" },
      { name: "KARAKEEP HOARDER", url: "https://keep.pozi.life", icon: ICONS.Briefcase, iconKey: "Briefcase" },
    ],
  },
];

export const QUOTES = [
    { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
    { text: "Your time is limited, so don’t waste it living someone else’s life.", author: "Steve Jobs" },
    { text: "Strive not to be a success, but rather to be of value.", author: "Albert Einstein" },
    { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { text: "Nature heals.", author: "Anonymous" },
    { text: "Live what you love.", author: "Anonymous" },
    { text: "Better to do something imperfectly than to do nothing flawlessly.", author: "Robert H. Schuller" },
    { text: "Give whatever you are doing and whoever you are with the gift of your attention.", author: "Jim Rohn" },
    { text: "Hard work never killed anybody, but why take a chance?", author: "Edgar Bergen" },
    { text: "The brain is a wonderful organ; it starts working the moment you get up in the morning and does not stop until you get into the office.", author: "Robert Frost" },
    { text: "I like work; it fascinates me. I can sit and look at it for hours.", author: "Jerome K. Jerome" },
    { text: "I love deadlines. I like the whooshing sound they make as they fly by.", author: "Douglas Adams" },
    { text: "Aim low, reach your goals, and avoid disappointment.", author: "Scott Adams" },
    { text: "A meeting is an event where minutes are taken and hours are wasted.", author: "James T. Kirk" },
    { text: "Meetings are indispensable when you don't want to do anything.", author: "John Kenneth Galbraith" },
    { text: "A committee is a group of people who individually can do nothing but together can decide that nothing can be done.", author: "Fred Allen" },
];

export const BACKGROUND_IMAGES = [
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1920&auto=format&fit=crop',
];