# DashyDash Development Guide

Welcome to the development guide for DashyDash! This document provides an overview of the project's architecture, conventions, and key concepts to help you understand and contribute to the codebase.

## Table of Contents
1.  [Tech Stack](#tech-stack)
2.  [Project Structure](#project-structure)
3.  [Core Concepts](#core-concepts)
    -   [State Management: `useLocalStorage`](#state-management-uselocalstorage)
    -   [Data Integrity: Migrations & Error Boundary](#data-integrity-migrations--error-boundary)
    -   [No Build Step](#no-build-step)
4.  [Architecture: The Widget System](#architecture-the-widget-system)
5.  [Key Components Breakdown](#key-components-breakdown)
6.  [Styling & Theming](#styling--theming)
7.  [How to Contribute](#how-to-contribute)
    -   [Adding a New Widget](#adding-a-new-widget)
    -   [Adding a New Setting](#adding-a-new-setting)
    -   [Adding a Default Service](#adding-a-default-service)
8.  [Troubleshooting](#troubleshooting)

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
├── App.tsx                   # Main app component, state management, and widget layout.
├── components/               # Reusable React components
│   ├── AICompanionModal.tsx  # Chat interface for the Gemini-powered assistant.
│   ├── CustomizeModal.tsx    # Modal for editing service link groups with D&D.
│   ├── FocusSessionOverlay.tsx # Fullscreen UI for focus mode.
│   ├── LinksWidget.tsx       # Widget for user-created personal links.
│   ├── OmniBar.tsx           # "Cmd+K" search interface.
│   ├── ServiceGroupCard.tsx  # The card component for a group of service links.
│   ├── SettingsModal.tsx     # Multi-tab modal for all user settings.
│   ├── TodoCardWidget.tsx    # To-do list widget.
│   ├── FeedWidget.tsx        # Widget for RSS feeds.
│   ├── YouTubeWidget.tsx     # Widget for YouTube channel feeds.
│   └── ...                   # Other UI components
├── constants.tsx             # Centralized static data: icons, default links, keys, themes.
├── contexts/                 # React Context providers
│   └── TimeContext.tsx       # Provides a global time state that updates every second.
├── hooks/                    # Custom React hooks
│   ├── useLocalStorage.ts    # Key hook for persisting state.
│   └── useOnClickOutside.ts  # Hook to detect clicks outside an element.
├── index.html                # The single HTML entry point. Contains importmap and theme styles.
├── index.tsx                 # React root renderer, ErrorBoundary, and data migration logic.
├── metadata.json             # App metadata for the hosting environment.
├── types.ts                  # Shared TypeScript type definitions.
└── DEVELOPMENT.md            # This documentation file.
```

---

## Core Concepts

### State Management: `useLocalStorage`

The application's state is almost entirely managed through a combination of React's `useState` and the custom `useLocalStorage` hook.

-   **Persistence:** `useLocalStorage` is a wrapper around `useState` that automatically syncs the component's state with the browser's `localStorage`. This ensures that all user customizations (name, links, feeds, theme, etc.) are preserved across sessions.
-   **Usage:** To add a new piece of persistent state, import `useLocalStorage` and `LOCAL_STORAGE_KEYS` from `constants.tsx`.
    ```tsx
    const [myValue, setMyValue] = useLocalStorage(LOCAL_STORAGE_KEYS.MY_NEW_KEY, 'defaultValue');
    ```
-   **Centralization:** All persistent state is initialized in the top-level `App.tsx` component and passed down to child components as props.

### Data Integrity: Migrations & Error Boundary

Because user data is stored long-term in `localStorage`, it's critical to handle data structure changes and potential corruption gracefully.

-   **Data Migrations:** The `runMigrations` function in `index.tsx` is executed on app startup. It checks a schema version number stored in `localStorage`. If the stored version is older than the application's current `SCHEMA_VERSION` (from `constants.tsx`), it runs migration scripts to update the user's stored data to the new format. This prevents crashes when, for example, a property is renamed or its data type changes.
-   **`ErrorBoundary`:** This component, also in `index.tsx`, wraps the entire `<App />`. Its primary purpose is to catch any runtime rendering errors. The most common cause of such errors is a mismatch between the data structure expected by the code and the data in `localStorage` that a migration might have missed.
-   **Recovery:** When the `ErrorBoundary` catches an error, it displays a friendly "Tune-Up" screen. This screen allows the user to clear their `localStorage` and reload the page, providing a simple and effective way to recover from a corrupted state.

### No Build Step

This project is designed to run directly in the browser without a compilation or bundling step.

-   **`importmap`:** `index.html` contains an `<script type="importmap">` block. This tells the browser how to resolve module specifiers. For example, when the code says `import React from 'react'`, the browser knows to fetch it from `https://esm.sh/react@18.2.0`.
-   **`esm.sh`:** A CDN that serves ES modules, allowing us to use NPM packages directly in the browser.

---

## Architecture: The Widget System

The main dashboard view below the central greeting is a collection of "widgets". The layout and state of these widgets are managed by `App.tsx`.

-   **Layout:** The layout is built using a responsive `grid` system in `App.tsx`. There are several rows of grids that stack widgets vertically on smaller screens and expand into multiple columns on larger screens. This provides a structured but flexible presentation.
-   **Widget Components:** Each card on the dashboard is a distinct React component (e.g., `LinksWidget`, `TodoCardWidget`, `ServiceGroupCard`). They are designed to be self-contained and receive all necessary data and functions as props from `App.tsx`.
-   **Centralized State:** State for all widgets, especially their collapsed/expanded status, is managed in `App.tsx`. The `collapsedCategories` state holds an array of keys for every widget that is currently collapsed. Passing a `toggle` function down to each widget allows them to report back to `App.tsx` when they should be collapsed or expanded, which then re-renders the UI with the correct state. Special constant keys (e.g., `LINKS_WIDGET_CATEGORY_KEY`) are used for singleton widgets to manage their state in the same system as the dynamic service groups.

---

## Key Components Breakdown

-   **`App.tsx`:** The orchestrator. It initializes all states from `localStorage`, manages modal visibility, handles API calls, and composes the main widget layout.
-   **`OnboardingModal.tsx`:** The first-run experience for new users, gathering basic information to personalize the dashboard.
-   **`SettingsModal.tsx`:** A complex, multi-tabbed modal for all user configurations. It uses its own temporary state; changes are only committed to `localStorage` (via `App.tsx`) when the user clicks "Save & Close".
-   **`CustomizeModal.tsx`:** A dedicated modal for editing the service link groups. It provides full CRUD (Create, Read, Update, Delete) functionality for both categories and individual links, including drag-and-drop reordering.
-   **`FeedWidget.tsx` & `YouTubeWidget.tsx`:** These widgets fetch and parse external feeds. `FeedWidget` handles standard RSS/Atom feeds, while `YouTubeWidget` is tailored for YouTube channel feeds. They both use a public CORS proxy (`CORS_PROXY_URL`) to bypass browser security restrictions.
-   **`TodoCardWidget.tsx`:** A simple but effective to-do list that allows users to add, toggle, and delete tasks, with all data persisted.
-   **`SearchWidget.tsx` & `ResearchModal.tsx`:** `SearchWidget` offers a dual-mode input for standard web search or AI research. Submitting a research query triggers a Gemini API call in `App.tsx` and displays the formatted result and sources in the `ResearchModal`.
-   **`OmniBar.tsx`:** A command-palette-style search bar, triggered by `Cmd/Ctrl + K`. It provides fast, fuzzy-search access to all service and personal links.
-   **`FocusSessionOverlay.tsx`:** A fullscreen overlay that helps the user focus on their daily goal. It features a circular progress timer and controls to pause or end the session.

---

## Styling & Theming

-   **Tailwind CSS:** Styling is primarily done with Tailwind CSS utility classes. The framework is loaded from a CDN in `index.html`.
-   **CSS Variables:** The theming system is built on CSS variables defined in a `<style>` block in `index.html`.
-   **How it Works:**
    1.  A theme class (e.g., `theme-cyberwave`) is applied to the `<html>` element based on the user's selection in settings.
    2.  This class defines a set of CSS variables (`--color-primary`, `--text-highlight`, etc.).
    3.  Components use these variables in their Tailwind classes: `bg-[var(--color-primary)]` or `border-[var(--color-border-hover)]`.
-   **Adding a Theme:** To add a new theme, you need to:
    1.  Add the theme definition to the `THEMES` array in `constants.tsx`.
    2.  Add a corresponding CSS class definition (e.g., `.theme-mynewtheme`) to the `<style>` block in `index.html`.

---

## How to Contribute

### Adding a New Widget

1.  **Create the Component:** Build your new widget component in the `components/` directory. It should accept props for any data it needs, as well as `isCollapsed` and `onToggle` props if it's collapsible.
2.  **Manage State in `App.tsx`:**
    -   If the widget needs persistent state, add it to `App.tsx` using `useLocalStorage`.
    -   If it's a "singleton" widget (only appears once), define a unique key for it in `App.tsx` (e.g., `const MY_WIDGET_KEY = '__MY_WIDGET__'`). Add this key to the `allCategoryKeys` array.
3.  **Add to Layout:** Place your new component inside one of the grid containers in the `App.tsx` return statement. Pass down all necessary props, including the collapsed state: `isCollapsed={collapsedCategories.has(MY_WIDGET_KEY)}` and the toggle handler: `onToggle={() => toggleCategoryCollapse(MY_WIDGET_KEY)}`.

### Adding a New Setting

1.  **Add Key:** Add a new key to the `LOCAL_STORAGE_KEYS` object in `constants.tsx`.
2.  **Add State:** In `App.tsx`, create a new state using `useLocalStorage` with your new key.
3.  **Update `SettingsModal.tsx`:**
    -   Update the `SettingsData` interface in `SettingsModal.tsx` to include your new setting.
    -   Update the `currentSettings` prop passed from `App.tsx`.
    -   Create a temporary state variable inside the modal for the setting (e.g., `const [tempMySetting, setTempMySetting] = useState(currentSettings.mySetting)`).
    -   Add the UI (input, checkbox, etc.) to the appropriate tab, linking it to your temporary state.
    -   Update the `handleSave` function to include your new setting in the object passed to `onSave`.
4.  **Update `App.tsx`:** Update the `handleSettingsSave` function to set the new state from the data object passed by the modal.

### Adding a Default Service

1.  **Open `constants.tsx`:** This file contains all default data.
2.  **Locate Service Arrays:** Find the appropriate array for your service.
    -   For general services, use `SERVICE_GROUPS`.
    -   For official Google, Pozi, or Ampersand services, use `GOOGLE_SERVICES`, `POZI_SERVICES`, or `AMPERSAND_SERVICES` respectively.
3.  **Add Service Object:** Add a new service object to the `services` array of the desired category. Ensure you provide a `name`, `url`, `icon`, and `iconKey`.
4.  **Add Icon (If Needed):** If the service requires a new icon, add the SVG JSX to the `ICONS` object and reference its key in your service definition.

---

## Troubleshooting

-   **"A Quick Tune-Up is Needed!" Screen:** This is the `ErrorBoundary` in action. It almost always means your `localStorage` data is in a format the new code doesn't understand, which can happen during development or after a significant app update. Click the button to clear your data and start fresh.
-   **Feeds not loading:** This can be due to an incorrect feed URL, the feed's server blocking requests, or the CORS proxy being temporarily down. Check the browser's developer console for specific network errors.
-   **Component Not Appearing:** Ensure you have correctly imported and placed the component in `App.tsx` and are passing all required props. Check the console for any rendering errors.