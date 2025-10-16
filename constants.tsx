import React from 'react';
import type { ServiceGroup, Theme } from './types';

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
    Plus: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" /></svg>,
};

export const LOCAL_STORAGE_KEYS = {
    USER_NAME: 'userName',
    WEATHER_LOCATION: 'weatherLocation',
    USER_LINKS: 'userLinks',
    USER_FEEDS: 'userFeeds',
    DAILY_FOCUS: 'dailyFocus',
    FOCUS_PROMPT: 'focusPrompt',
    USER_TODOS: 'userTodos',
    USER_THEME: 'userTheme',
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

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "AI ENABLED",
    services: [
      { name: "Gemini", url: "https://gemini.google.com", icon: ICONS.Sparkles },
      { name: "AI Studio", url: "https://aistudio.google.com/", icon: ICONS.Sparkles },
      { name: "Jaaz Canva", url: "https://slash.pozi.plus/s/jaaz", icon: ICONS.Sparkles, inProduction: true },
      { name: "NotebookLM", url: "https://notebooklm.google.com/", icon: ICONS.Sparkles },
      { name: "Perplexity", url: "https://www.perplexity.ai/", icon: ICONS.Sparkles },
      { name: "Pozi AI", url: "https://ai.pozi.plus", icon: ICONS.Sparkles },
      { name: "Pozi Photos", url: "https://photos.stanz.app", icon: ICONS.Sparkles },
      { name: "Blink Creative", url: "https://blinko.pozi.plus", icon: ICONS.Sparkles },
      { name: "Digital Keeper", url: "https://keep.pozi.life", icon: ICONS.Sparkles },
      { name: "Affine Creative", url: "https://affine.pozi.agency", icon: ICONS.Sparkles },
    ],
  },
  {
    category: "WORK",
    services: [
      { name: "Next Cloud", url: "https://cloud.pozi.plus", icon: ICONS.Cloud },
      { name: "Cloud Casa", url: "https://cloud.pozi.me", icon: ICONS.Cloud },
      { name: "Colanode", url: "https://cola.pozi.work", icon: ICONS.Code },
      { name: "Vikunja ToDo", url: "https://vikunja.stanz.app", icon: ICONS.CheckSquare },
      { name: "Simple Links", url: "https://snap.pozi.agency/dashboard", icon: ICONS.Globe },
      { name: "Offline Research", url: "https://kiwi.stanz.app", icon: ICONS.Briefcase },
      { name: "Super PDF Tools", url: "https://pdf.stanz.app", icon: ICONS.Document },
      { name: "Huly Projects", url: "https://huly.pozi.agency/", icon: ICONS.Briefcase },
      { name: "Miles Music", url: "https://slash.pozi.plus/s/milesmusic", icon: ICONS.Globe, inProduction: true },
      { name: "PoziPedia", url: "https://slash.pozi.plus/s/pozipedia", icon: ICONS.Document, inProduction: true },
    ],
  },
  {
    category: "LIFE",
    services: [
      { name: "Gmail", url: "https://mail.google.com", icon: ICONS.User },
      { name: "Calendar", url: "https://calendar.google.com", icon: ICONS.User },
      { name: "Google Drive", url: "https://drive.google.com", icon: ICONS.Cloud },
      { name: "Spotify", url: "https://spotify.com", icon: ICONS.User },
      { name: "Reddit", url: "https://reddit.com", icon: ICONS.Globe },
      { name: "Glance Dash", url: "https://glance.pozi.plus", icon: ICONS.Globe, inProduction: true },
      { name: "Casa Dash", url: "https://dash.stanz.app", icon: ICONS.Globe },
      { name: "Pozi Paperless", url: "https://paperless.stanz.app", icon: ICONS.Document },
      { name: "Bitwarden Server", url: "https://vault.pozi.plus", icon: ICONS.Lock },
      { name: "WorkSpaces", url: "https://spaces.stanz.info/", icon: ICONS.Briefcase },
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