
# DashyDash Development Guide

Welcome to the development guide for DashyDash! This document provides an overview of the project's architecture, conventions, and key concepts to help you understand and contribute to the codebase.

## Table of Contents
1.  [Tech Stack](#tech-stack)
2.  [Project Structure](#project-structure)
3.  [Core Concepts](#core-concepts)
    -   [State Management: `useLocalStorage`](#state-management-uselocalstorage)
    -   [No Build Step](#no-build-step)
    -   [Error Handling](#error-handling)
4.  [Key Components Breakdown](#key-components-breakdown)
5.  [Styling & Theming](#styling--theming)
6.  [How to Contribute](#how-to-contribute)
    -   [Adding a New Component](#adding-a-new-component)
    -   [Adding a New Setting](#adding-a-new-setting)
    -   [Adding a Default Service](#adding-a-default-service)
7.  [Troubleshooting](#troubleshooting)


## Tech Stack

DashyDash is a modern, client-side application built with:

-   **React 18:** For building the user interface.
-   **TypeScript:** For static typing and improved code quality.
-   **Tailwind CSS:** A utility-first CSS framework for styling, loaded via CDN.
-   **@google/genai:** The official SDK for interacting with the Google Gemini API for the Research feature.
-   **ES Modules (`esm.sh`):** All dependencies are loaded directly in the browser using an `importmap` in `index.html`. There is no traditional build step (like Webpack or Vite).

---

## Project Structure

The project follows a standard React component-based structure.

```
.
├── App.tsx                   # Main application component, state management, and layout.
├── components/               # Reusable React components
│   ├── Clock.tsx
│   ├── Greeting.tsx
│   ├── ServiceGroups.tsx     # Masonry layout for service links.
│   ├── SettingsModal.tsx     # Modal for all user settings.
│   ├── ResearchModal.tsx     # Modal to display Gemini API results.
│   └── ...                   # Other UI components
├── constants.tsx             # Centralized static data: icons, default links, themes, etc.
├── contexts/                 # React Context providers
│   └── TimeContext.tsx       # Provides a global time state that updates every second.
├── hooks/                    # Custom React hooks
│   ├── useLocalStorage.ts    # Key hook for persisting state.
│   └── useOnClickOutside.ts  # Hook to detect clicks outside an element.
├── index.html                # The single HTML entry point. Contains importmap and theme styles.
├── index.tsx                 # React root renderer and ErrorBoundary implementation.
├── metadata.json             # App metadata for the hosting environment.
├── types.ts                  # Shared TypeScript type definitions.
└── DEVELOPMENT.md            # This documentation file.
```

---

## Core Concepts

### State Management: `useLocalStorage`

The application's state is almost entirely managed through a combination of React's `useState` and the custom `useLocalStorage` hook.

-   **Persistence:** `useLocalStorage` is a wrapper around `useState` that automatically syncs the component's state with the browser's `localStorage`. This ensures that all user customizations (name, links, feeds, theme, API keys, etc.) are preserved across sessions.
-   **Usage:** To add a new piece of persistent state, import `useLocalStorage` and `LOCAL_STORAGE_KEYS` from `constants.tsx`.
    ```tsx
    const [myValue, setMyValue] = useLocalStorage(LOCAL_STORAGE_KEYS.MY_NEW_KEY, 'defaultValue');
    ```
-   **Centralization:** All persistent state is initialized in the top-level `App.tsx` component and passed down to child components as props.

### No Build Step

This project is designed to run directly in the browser without a compilation or bundling step.

-   **`importmap`:** `index.html` contains an `<script type="importmap">` block. This tells the browser how to resolve module specifiers. For example, when the code says `import React from 'react'`, the browser knows to fetch it from `https://esm.sh/react@18.2.0`.
-   **`esm.sh`:** A CDN that serves ES modules, allowing us to use NPM packages directly in the browser.

### Error Handling

-   **`ErrorBoundary.tsx`:** This is a critical component that wraps the entire `<App />`. Its primary purpose is to catch runtime rendering errors.
-   **Data Corruption:** The most common source of errors is a mismatch between the data structure expected by the code and the data stored in `localStorage`. This often happens after an update that changes a data type (e.g., changing a string to an object).
-   **Recovery:** When the `ErrorBoundary` catches an error, it displays a friendly "Tune-Up" screen that allows the user to clear their `localStorage` and reload the page, resolving the issue.

---

## Key Components Breakdown

-   **`App.tsx`:** The orchestrator. It initializes all states from `localStorage`, manages the visibility of modals, and composes the main layout.
-   **`SettingsModal.tsx`:** A complex, multi-tabbed modal for all user configurations. It uses its own temporary state for each setting. Changes are only committed to `localStorage` (by calling the `set...` functions passed from `App.tsx`) when the user clicks "Save & Close".
-   **`CustomizeModal.tsx`:** A dedicated modal for editing the service link groups. It provides full CRUD (Create, Read, Update, Delete) functionality for both categories and the links within them.
-   **`FeedWidget.tsx`:** Fetches and parses RSS/Atom feeds. It uses a public CORS proxy (defined in `constants.tsx`) to bypass browser security restrictions when fetching feeds from different domains.
-   **`SearchWidget.tsx` & `ResearchModal.tsx`:** These components work together. `SearchWidget` provides a dual-mode input for standard web search or AI research. When research is submitted, it calls the `handleResearch` function in `App.tsx`, which triggers the Gemini API call and displays the results in `ResearchModal`.

---

## Styling & Theming

-   **Tailwind CSS:** Styling is primarily done with Tailwind CSS utility classes. The framework is loaded from a CDN in `index.html`.
-   **CSS Variables:** The theming system is built on CSS variables defined in a `<style>` block in `index.html`.
-   **How it Works:**
    1.  A theme class (e.g., `theme-cyberwave`) is applied to the `<html>` element.
    2.  This class defines a set of CSS variables (`--color-primary`, `--text-highlight`, etc.).
    3.  Components use these variables in their Tailwind classes or style attributes: `bg-[var(--color-primary)]` or `color: 'var(--text-highlight)'`.
-   **Adding a Theme:** To add a new theme, you need to:
    1.  Add the theme definition to the `THEMES` array in `constants.tsx`.
    2.  Add a corresponding CSS class definition (e.g., `.theme-mynewtheme`) to the `<style>` block in `index.html`.

---

## How to Contribute

### Adding a New Component
1.  Create your component file in the `components/` directory.
2.  Import and use it within a parent component (likely `App.tsx` or one of its children).
3.  If the component requires state that needs to persist, add it to `App.tsx` using `useLocalStorage` and pass the value and setter down as props.
4.  Add any new TypeScript types to `types.ts`.

### Adding a New Setting
1.  Add a new key to the `LOCAL_STORAGE_KEYS` object in `constants.tsx`.
2.  In `App.tsx`, create a new state using `useLocalStorage` with your new key.
3.  In `SettingsModal.tsx`:
    -   Add props to receive the new state value and its setter function.
    -   Create a temporary state variable for the setting (e.g., `const [tempMySetting, setTempMySetting] = useState(props.mySetting)`).
    -   Add the UI (input, checkbox, etc.) to the appropriate tab, linking it to your temporary state.
    -   Update the `handleSave` function to call the setter from props (`props.setMySetting(tempMySetting)`).

### Adding a Default Service
1.  Open `constants.tsx`.
2.  Locate the `SERVICE_GROUPS` array.
3.  Add your new service object to the desired category's `services` array.
4.  If the service requires a unique icon, add the SVG JSX to the `ICONS` object and reference it. If it's a Google service, add it to `GOOGLE_SERVICES` and `ICONS.GOOGLE`.

---

## Troubleshooting

-   **"A Quick Tune-Up is Needed!" Screen:** This is the `ErrorBoundary` in action. It almost always means your `localStorage` data is in a format the new code doesn't understand. Click the button to clear your data and start fresh. This is expected behavior for users after certain app updates.
-   **Feeds not loading:** This can be due to the feed URL being incorrect, the feed's server blocking requests, or the CORS proxy being temporarily down. Check the browser's developer console for specific network errors.

