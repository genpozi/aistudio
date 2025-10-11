// Fix: The `JSX.Element` type requires the React namespace. Import React to make it available.
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
}

export interface Service {
  name: string;
  url: string;
  icon: JSX.Element;
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