
# DashyDash: Architectural Specification & Integration Guide

DashyDash is a "Static-to-Stateful" dashboard ecosystem. It requires zero server-side processing, relying entirely on client-side state persistence and public APIs. This document serves as the technical source of truth for developers integrating or extending the system.

---

## 1. System Architecture

### 1.1 State Management (The Local-First Brain)
State is handled through a "Single Source of Truth" in `App.tsx`.
- **Persistence**: Managed via `useLocalStorage`.
- **Synchronization**: `App.tsx` hydrates data on mount. Child widgets are strictly controlled via props (One-way data flow).
- **Data Integrity**: `index.tsx` runs a migration engine (`runMigrations`) before React mounts. This ensures legacy `localStorage` keys are transformed to match the latest `SCHEMA_VERSION` in `constants.tsx`.

### 1.2 The "Independent Flow" UI Logic
The dashboard utilizes an independent card model for maximum flexibility:
- **Card States**: Each card (Links, Todo, Service Groups) has its own unique ID used as a key in the `collapsedCategories` set.
- **Independence**: Toggling a card only impacts its local `max-height` transition. This allows the layout to flow naturally within the 3-column grid without affecting siblings.
- **Global Control**: A "Collapse All / Expand All" utility provides bulk state management for rapid workspace clearing.

### 1.3 AI Intelligence Layer
- **Research Mode**: Uses `gemini-3-pro-preview` with `googleSearch` grounding for deep retrieval. 
- **AI Companion**: Uses a persistent `chat` session via `@google/genai` (powered by Gemini 3 Pro). 
- **Grounding**: The system extracts `groundingChunks` and maps them to interactive UI citations in `ResearchModal.tsx`.

---

## 2. Component Methodics

### 2.1 Widgets (Standardized Layouts)
All widgets must follow the **Glass-Frame Specification**:
- **Outer Wrapper**: `relative group/card h-full`.
- **Container**: `bg-[ThemeColor]/10 backdrop-blur-xl border border-[ThemeColor]/20`.
- **Header**: Gradient background `from-black/40 to-black/10`.

### 2.2 Branding Symbols
The "Pozi" brand utilizes specific SVG definitions in `constants.tsx`:
- **The O, Z, P, I**: Custom radial gradients with rainbow text overlays.
- **IconBar**: A custom staggered-animation shelf that handles hover-based expansion with exponential delays (`delay-75` to `delay-700`).

---

## 3. Integration & Extensibility

### 3.1 Adding Third-Party Services
To integrate internal tools (like a local Home Assistant or Portainer), modify `SERVICE_GROUPS` in `constants.tsx`.
```tsx
{
  category: "MY_SERVER",
  services: [
    { name: "PROXMOX", url: "https://192.168.1.50:8006", icon: ICONS.Lock, iconKey: "Lock" }
  ]
}
```

### 3.2 External API Integration
- **Weather**: Fetches from `wttr.in` (JSON format).
- **RSS/YT**: Routes through `CORS_PROXY_URL` to bypass browser security. If self-hosting a proxy, update this constant.

---

## 4. Visual Styles & Theming

Theming is implemented via CSS variables injected into the `:root` or specific `.theme-x` classes.
- **`--text-highlight`**: Used for primary calls to action and "Today" emphasis.
- **`--color-border-hover`**: Used for the "Halo" effect around interactive cards.

---

## 5. Improvements & Next Steps (Roadmap)

### Phase 1: Performance & PWA (Short Term)
- [ ] **PWA Manifest**: Add `manifest.json` and service workers for offline asset caching of background images.
- [ ] **Image Proxying**: Implement a small utility to cache RSS thumbnails locally to improve load speed.
- [ ] **Focus Mode Soundscape**: Add ambient white noise or Lo-Fi audio options to the `FocusSessionOverlay`.

### Phase 2: Advanced Connectivity (Mid Term)
- [ ] **Generic MCP Connector**: Support Model Context Protocol (MCP) for local AI backends (Ollama/LMStudio).
- [ ] **Calendar Bridge**: Implement a read-only Google/iCal view (requires OAuth registration).
- [ ] **System Stats Widget**: A new widget type that polls a `/stats` endpoint for CPU/RAM (useful for self-hosters).

### Phase 3: Ecosystem (Long Term)
- [ ] **Sync Bridge**: Optional WebDAV or Supabase sync for users who want the same dashboard on multiple devices without manual export.
- [ ] **Visual Builder**: Extend `CustomizeModal` to allow drag-and-drop between rows, not just within columns.
- [ ] **Gemini 3 Pro Vision**: Allow the AI Companion to "see" screenshots for help with coding or visual research.

---

## 6. Deployment Guide

1.  **Environment Variables**: Ensure `process.env.API_KEY` is set in your hosting environment (Vercel, Netlify, or local `.env`).
2.  **CORS Proxy**: The default `corsproxy.io` is for demo purposes. For high-traffic production, host your own proxy.
3.  **Static Assets**: All icons are inline SVGs. No external font files or icon packs are required, keeping the payload small.
