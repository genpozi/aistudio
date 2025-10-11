
import React from 'react';
import type { ServiceGroup, FeedItem } from './types';

export const ICONS = {
    Code: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" /></svg>,
    Sparkles: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM16.898 20.553L16.5 21.75l-.398-1.197a3.375 3.375 0 00-2.456-2.456L12.75 18l1.197-.398a3.375 3.375 0 002.456-2.456L16.5 14.25l.398 1.197a3.375 3.375 0 002.456 2.456L20.25 18l-1.197.398a3.375 3.375 0 00-2.456 2.456z" /></svg>,
    Briefcase: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
    User: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" /></svg>,
    Globe: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2h10a2 2 0 002-2v-1a2 2 0 012-2h1.945M7.707 4.293l.293-.293a1 1 0 011.414 0l.293.293M10 21v-4m4 4v-4m-4-2.293l.293-.293a1 1 0 011.414 0l.293.293m-4 0l-.293.293a1 1 0 000 1.414l.293.293m0-1.414l.293-.293a1 1 0 011.414 0l.293.293" /></svg>,
    Trash: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>,
    ExternalLink: <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>,
    Refresh: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h5M20 20v-5h-5M4 4l1.5 1.5A9 9 0 0120.5 19.5L20 20" /></svg>,
    Search: <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>,
};

export const SERVICE_GROUPS: ServiceGroup[] = [
  {
    category: "AI",
    services: [
      { name: "Gemini", url: "https://gemini.google.com", icon: ICONS.Sparkles },
      { name: "AI Studio", url: "https://aistudio.google.com/", icon: ICONS.Sparkles },
      { name: "NotebookLM", url: "https://notebooklm.google.com/", icon: ICONS.Sparkles },
      { name: "Perplexity", url: "https://www.perplexity.ai/", icon: ICONS.Sparkles },
      { name: "Pozi AI", url: "https://ai.pozi.plus", icon: ICONS.Sparkles },
    ],
  },
  {
    category: "WORK",
    services: [
      { name: "GitHub", url: "https://github.com", icon: ICONS.Code },
      { name: "Jira", url: "https://jira.atlassian.com", icon: ICONS.Briefcase },
      { name: "Figma", url: "https://figma.com", icon: ICONS.Briefcase },
    ],
  },
  {
    category: "LIFE",
    services: [
      { name: "Gmail", url: "https://mail.google.com", icon: ICONS.User },
      { name: "Calendar", url: "https://calendar.google.com", icon: ICONS.User },
      { name: "Google Drive", url: "https://drive.google.com", icon: ICONS.Briefcase },
      { name: "Spotify", url: "https://spotify.com", icon: ICONS.User },
      { name: "Wikipedia", url: "https://wikipedia.org", icon: ICONS.Globe },
      { name: "Reddit", url: "https://reddit.com", icon: ICONS.Globe },
      { name: "Amazon", url: "https://amazon.com", icon: ICONS.Globe },
    ],
  },
];

export const FEED_ITEMS: FeedItem[] = [
  { id: 1, source: "TechCrunch", title: "Apple unveils new M4 chip with major performance gains", link: "#", timestamp: "2h ago" },
  { id: 2, source: "The Verge", title: "Google's next-gen AI assistant is coming to all Android devices", link: "#", timestamp: "4h ago" },
  { id: 3, source: "YouTube: MKBHD", title: "The Perfect Laptop? Maybe Not.", link: "#", timestamp: "1d ago" },
  { id: 4, source: "Hacker News", title: "Show HN: I built a self-hosted dashboard with React and Tailwind", link: "#", timestamp: "1d ago" },
  { id: 5, source: "YouTube: Fireship", title: "React in 100 Seconds", link: "#", timestamp: "2d ago" },
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
];

export const BACKGROUND_IMAGES = [
    'https://images.unsplash.com/photo-1470770841072-f978cf4d019e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1501854140801-50d01698950b?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=1920&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1433086966358-54859d0ed716?q=80&w=1920&auto=format&fit=crop',
];
