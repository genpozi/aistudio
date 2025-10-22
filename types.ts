import React from 'react';
import { ICONS } from './constants';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
}

export interface Link {
  id: number;
  name: string;
  url: string;
  iconUrl?: string;
}

export interface UserFeed {
  id: number;
  url: string;
}

// Represents a single, normalized item from a parsed feed
export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  source: string; // Manually added from the feed's main title
  thumbnailUrl?: string;
}

export type IconKey = keyof typeof ICONS;
// FIX: Create a new type for icon keys that are not nested objects, to be used in the icon selector.
export type FlatIconKey = Exclude<IconKey, 'GOOGLE' | 'POZI'>;

// The data structure that is safe to store in localStorage.
// It uses a string `iconKey` instead of a ReactNode.
export interface StoredService {
  name: string;
  url:string;
  iconKey: string;
  inProduction?: boolean;
}

// The runtime data structure, with the 'icon' ReactNode rehydrated.
export interface Service extends StoredService {
  icon: React.ReactNode;
}

// The stored group structure.
export interface StoredServiceGroup {
    category: string;
    services: StoredService[];
}

// The runtime group structure.
export interface ServiceGroup {
  category: string;
  services: Service[];
}

// Unified type for all items searchable in the OmniBar
export interface SearchableItem {
  type: 'service' | 'link';
  name: string;
  url: string;
  icon: React.ReactNode;
  category?: string; // for services
}

export interface WeatherInfo {
  current_condition: {
    temp_C: string;
    weatherDesc: { value: string }[];
  }[];
  nearest_area: {
    areaName: { value: string }[];
  }[];
}

export interface Theme {
    id: string;
    name: string;
    className: string;
    colors: {
      primary: string;
      secondary: string;
    };
}

export type ResearchBackend = 'gemini' | 'mcp';

export interface GroundingChunk {
  web: {
    uri: string;
    title: string;
  };
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}