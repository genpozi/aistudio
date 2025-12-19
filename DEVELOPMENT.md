# DashyDash: Technical Standards

## 1. Grid Logic
DashyDash uses a "Locked 3x3" grid strategy. 
- **Large Screens**: 3 columns (`grid-cols-3`).
- **Logic**: Cards are grouped by row in `App.tsx` to ensure visual consistency.
- **Flow**: Categories must expand vertically within their column without shifting the columns of other rows.

## 2. Row Theming (Conformity)
Conformity is maintained via specific CSS class mappings in `ServiceGroupCard.tsx` and individual widget components:

- **Row 1 (Productivity)**: Uses `amber-500` glow and `amber-900/10` backgrounds.
- **Row 2 (Infrastructure)**: Uses `cyan-400` glow and `cyan-900/10` backgrounds.
- **Row 3 (Ecosystem)**: Uses an animated rainbow border (`animate-rainbow-slow`) and deep blue backgrounds.

## 3. Data Schema & Migrations
- **Current Schema**: v13.
- **Forced Sync**: v13 migration in `index.tsx` ensures that all users receive the "Locked 3x3" categories automatically without losing their existing `userLinks` or `userTodos`.
- **Constants**: `SERVICE_GROUPS` in `constants.tsx` acts as the source of truth for all default link populations.

## 4. UI/UX Rules
- No row should ever have more than 3 cards on desktop.
- On mobile, cards stack vertically.
- Avoid "blocking" links: Ensure cards have adequate vertical height or scrollable overflow when populated with more than 5 items.
