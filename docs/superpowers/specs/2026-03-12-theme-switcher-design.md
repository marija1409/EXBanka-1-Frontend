# Theme Switcher Design

_Date: 2026-03-12_

## Overview

Add a theme toggle button to the bottom-left corner of the sidebar, next to the user email. Supports light and dark mode, persists the selection to `localStorage`, and applies the `.dark` class to `<html>`.

---

## Architecture

### New file: `src/contexts/ThemeContext.tsx`

A React Context that:
- Reads the initial theme from `localStorage` (key: `"theme"`, values: `"light"` | `"dark"`). Defaults to `"light"` if not set.
- Applies or removes the `.dark` class on `document.documentElement` (`<html>`) on mount and on every toggle.
- Writes the new value to `localStorage` on every toggle.
- Exports `ThemeContext`, a `ThemeProvider` component, and a `useTheme()` hook.

```ts
interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
}
```

### Modified: `src/main.tsx`

Wrap the app with `ThemeProvider` as the outermost provider (before Redux `Provider` and `BrowserRouter`).

### Modified: `src/components/layout/Sidebar.tsx`

- Import `useTheme` from `ThemeContext`.
- Restructure the bottom section: email and theme icon button on the same row (`flex justify-between items-center`), logout button below.
- Render a `Sun` icon (Lucide) when dark mode is active, `Moon` icon when light mode is active.
- Button uses ghost/icon styling (`variant="ghost" size="icon"`) with `text-sidebar-foreground/70`.

---

## UI Layout

```
┌─────────────────────────────┐
│ user@email.com          🌙  │  ← flex row: email left, icon right
│ [        Log Out        ]   │  ← full-width logout button
└─────────────────────────────┘
```

- Sun icon shown in dark mode (click to switch to light)
- Moon icon shown in light mode (click to switch to dark)
- No text label on the toggle button

---

## State Management

| Concern              | Tool            |
|----------------------|-----------------|
| Theme preference     | React Context   |
| Persistence          | localStorage    |
| DOM class toggle     | `document.documentElement.classList` |

This follows the CLAUDE.md guideline: "Simple shared UI state → React Context".

---

## Testing

### `src/contexts/ThemeContext.test.tsx` (new, TDD — tests first)

- Initialises to `light` when `localStorage` has no value
- Initialises to `dark` when `localStorage` contains `"dark"`
- `toggleTheme()` adds `.dark` class to `<html>` and writes `"dark"` to `localStorage`
- `toggleTheme()` removes `.dark` class from `<html>` and writes `"light"` to `localStorage`

### `src/components/layout/Sidebar.test.tsx` (extend existing)

- Renders a moon icon when theme is light (default)
- Renders a sun icon when theme is dark
- Clicking the toggle button calls `toggleTheme`

---

## Files Changed

| File | Action |
|------|--------|
| `src/contexts/ThemeContext.tsx` | Create |
| `src/contexts/ThemeContext.test.tsx` | Create |
| `src/main.tsx` | Modify — add `ThemeProvider` wrapper |
| `src/components/layout/Sidebar.tsx` | Modify — add toggle button, restructure bottom section |
| `src/components/layout/Sidebar.test.tsx` | Modify — add toggle button tests |
