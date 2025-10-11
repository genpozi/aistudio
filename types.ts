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

export interface FeedItem {
  id: number;
  source: string;
  title: string;
  link: string;
  timestamp: string;
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