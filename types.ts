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
  type: 'rss' | 'youtube';
}

export interface FeedItem {
  title: string;
  link: string;
  pubDate: string;
  author: string;
  source: string;
  thumbnailUrl?: string;
}

export type IconKey = keyof typeof ICONS;
export type FlatIconKey = Exclude<IconKey, 'GOOGLE' | 'POZI'>;

export interface StoredService {
  name: string;
  url:string;
  iconKey: string;
  inProduction?: boolean;
}

export interface Service extends StoredService {
  icon: React.ReactNode;
}

export interface StoredServiceGroup {
    category: string;
    services: StoredService[];
}

export interface ServiceGroup {
  category: string;
  services: Service[];
}

export interface SearchableItem {
  type: 'service' | 'link' | 'command' | 'action';
  name: string;
  url?: string;
  icon: React.ReactNode;
  category?: string;
  perform?: () => void;
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

export type FocusDuration = 25 | 45 | 60;

export interface DashboardNote {
    id: number;
    content: string;
    lastUpdated: number;
}
