import React from 'react';

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

// Represents the data structure from the rss2json API
export interface RssApiResponse {
  status: string;
  feed: {
    title: string;
    [key: string]: any;
  };
  items: {
    title: string;
    pubDate: string;
    link: string;
    author: string;
    [key: string]: any;
  }[];
}

export interface Service {
  name: string;
  url: string;
  // Fix: Replaced `JSX.Element` with `React.ReactNode` to resolve a "Cannot find namespace 'JSX'" error in a .ts file.
  icon: React.ReactNode;
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