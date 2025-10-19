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
}

export type IconKey = keyof typeof ICONS;
// FIX: Create a new type for icon keys that are not nested objects, to be used in the icon selector.
export type FlatIconKey = Exclude<IconKey, 'GOOGLE' | 'POZI'>;

export interface Service {
  name: string;
  url: string;
  icon: React.ReactNode;
  iconKey?: IconKey; // Store the key for editing purposes
  // FIX: Added 'inProduction' as an optional property to the Service interface to support marking services as in-production.
  inProduction?: boolean;
}

export interface ServiceGroup {
  category: string;
  services: Service[];
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
