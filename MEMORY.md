# DashyDash Master Memory Map

This document serves as the master blueprint for the DashyDash ecosystem. It tracks the specific link assignments, visual styles, and functional roles of every card in the dashboard.

---

## 🏗️ ROW 1: PERSONAL PRODUCTIVITY
**Design Standard:** Amber Glow / Glassmorphism (`amber-500`)
**Role:** Immediate personal workflow and focus.

| Card Name | Role | Links / Source |
| :--- | :--- | :--- |
| **PERSONAL LINKS** | User Bookmarks | Managed via Settings -> Links (`LocalStorage`) |
| **TO-DO LIST** | Task Management | Interactive Widget (`LocalStorage`) |
| **SCRATCHPAD** | Persistent Notes | Unified Amber Theme (`LocalStorage`) |

---

## 🛠️ ROW 2: CORE INFRASTRUCTURE
**Design Standard:** Cyan Glow / Tech Glass (`cyan-400`)
**Role:** Self-hosted tools and system management.

| Card Name | Links | URIs |
| :--- | :--- | :--- |
| **WIDGETS** | Obsidian-Copilot, Dock-a-Doodle, Dashy-Dash | `obsidian-copilot-ashy.vercel.app`, `docker-doodle.vercel.app`, `dash.stan.camp` |
| **TOOLBOX** | COMING SOON | Placeholder Card |
| **REMEMBERY** | Karakeep, Paperless, Nextcloud, Vikunja, Pozi Workspaces, Vaultwarden | `keep.pozi.life`, `paperless.stanz.app`, `c.stanz.app`, `vikunja.stanz.app`, `spaces.stanz.info`, `vault.pozi.plus` |

---

## 🌌 ROW 3: ECOSYSTEM & COMMUNITY
**Design Standard:** Rainbow Glow / Vibrant Glass (`gradient-rainbow`)
**Role:** The 0Reliance / Poziverse ecosystem and professional hubs.

| Card Name | Links | Included Services |
| :--- | :--- | :--- |
| **POZIVERSE** | Ecosystem Hub | World, 0Relai, Professionals, Directory, Documentation, Maeple |
| **COLLECTIVE** | Agency Workspace | 0RELAI AI Studio, Immich, Karakeep, Blinko, Penpot, Affine, Vaultwarden |
| **0RELIANCE LAB**| Research Sandbox | Studio, Documentation, Maeple, Courses |

---

## 🛰️ NAVIGATION BARS (SHELVED ICON BARS)
- **POZI BAR**: Entry point for the Poziverse network.
- **AMPERSAND BAR**: Creative focus and AI Studio tools.
- **Z BAR**: Infrastructure Workspaces.
- **I BAR**: System Documentation and Knowledge Base.
- **GOOGLE BAR**: Suite access (Gemini, Gmail, Calendar, Drive, Keep).

---

## ⚙️ SYSTEM REVISION LOG
- **v19 (Current)**: Final Stabilization. Expanded POZIVERSE card with Documentation and Maeple duplicates. verified all URIs.
- **v18**: Realignment of Row 2. Moved Vaultwarden/Uptime Kuma from Toolbox. Expanded Remembery with Vikunja and Workspaces.
- **v17**: Overhauled COLLECTIVE category with a new 7-tool stack.
- **v16**: Cleaned and reordered 0RELIANCE LAB (Studio, Docs, Maeple, Courses).
- **v15**: Removed Huly, Paperless-AI, Nginx Proxy, and Portainer. Cleaned Row 2.
- **v14**: Updated 0RELIANCE LAB with Maeple, Docs, and Courses.
- **v13**: Locked 3x3 grid, Unified Row 1 theme, Added REMEMBERY and 0RELIANCE LAB.
- **Revision Lock**: Rows are restricted to max 3 cards. Column order is static.
- **Master Password**: `maplewood` (Assigned for protected/announcement cards).