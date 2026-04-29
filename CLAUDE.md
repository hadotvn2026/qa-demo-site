# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this project is

`demo-qa-site` (product alias: TVNAutomationLab / flakelab.dev) is a Next.js 15 App Router site that hosts ~20 self-contained "tricky element" pages (auth, table, dropdown, drag-drop, popup, lazy load, etc.) for QA engineers practicing Selenium and Playwright. Each page is a practice surface plus inline teaching aids that show example locator code in four runtimes side-by-side. There is no database; small API routes simulate file download / login. Full design rationale is in `DESIGN.md`.

## Commands

```bash
npm run dev      # next dev — by default on http://localhost:3000 (settings.local.json also has stale 3005 perms)
npm run build    # next build
npm run start    # next start (run after build)
npm run lint     # eslint (uses eslint-config-next core-web-vitals + typescript)
npx tsc --noEmit # type-check only — there is no dedicated script; tsconfig has noEmit:true so plain `tsc` works
```

There is no test runner wired up in this repo. The reference Playwright/Selenium suites described in `DESIGN.md` (`/tests/playwright`, `/tests/selenium`) have not been added yet — do not assume they exist.

## Important: this is Next.js 15 + React 19

`AGENTS.md` is short and load-bearing: APIs, conventions, and file structure may differ from training data. Read `node_modules/next/dist/docs/` before guessing at framework behavior, and heed deprecation notices. App Router only — no `pages/` directory.

## Architecture

### Shell + page composition

`src/app/layout.tsx` wraps every route in `ThemeProvider` (next-themes, default `dark`) and `Shell` (`src/components/layout/shell.tsx`). `Shell` renders three siblings:

- `Sidebar` (`src/components/layout/sidebar.tsx`) — fixed left nav, mobile-toggleable. The `navItems` array is the source of truth for the sidebar.
- `CommandMenu` (`src/components/layout/command-menu.tsx`) — global ⌘K palette using `cmdk`/shadcn `Command`. Has its own `menuItems` array.
- `Toaster` from `sonner`, themed dark.

When you add a new `/elements/<name>` route, you must also update **three** lists by hand: `Sidebar.navItems`, `CommandMenu.menuItems`, and the chip array in `src/app/page.tsx` (landing page). They are intentionally duplicated rather than centralized.

### Element pages (`src/app/elements/<name>/page.tsx`)

Every element page is a client component (`"use client"`) that combines the practice UI with two teaching widgets imported from `@/components/layout/`:

- **`<TipDrawer>`** — right-edge sliding panel (`src/components/layout/tip-drawer.tsx`). Required props: `playwright`, `pythonPlaywright`, `java`, `python` (each is a code snippet string for the four tabs: Playwright TS, Playwright Py, Selenium Java/TestNG, Selenium Py/pytest), `tip` (one short paragraph), and optional `selector` for the "Try selector on this page" button which runs `document.querySelectorAll`/XPath `document.evaluate` and adds a yellow outline class to matches.
- **`<LocatorBot>`** — selector playground (`src/components/layout/locator-bot.tsx`). Highlights matched elements with a blue outline. Used inline near the practice surface.

Both widgets auto-detect XPath vs CSS by checking if the selector starts with `/` or `(`. They inject their own `<style>` tags (`tip-drawer-highlight-style`, `locator-bot-highlight-style`) lazily on first use.

### `update-tips.js` (codemod, not runtime)

A one-shot Node script that walks `src/app/elements/**/page.tsx` and rewrites old `<TipDrawer selector=... tip=...>` call sites into the four-language form. It is **stale** — it emits `playwright/java/python` props but the current `TipDrawer` interface also requires `pythonPlaywright`. Do not run it blindly; if you need a new element page, copy an existing page's `<TipDrawer>` block instead.

### Cheatsheet (`/cheatsheet`)

`src/app/cheatsheet/data.ts` is a static `CHEATSHEET: LocatorRecipe[][]` array (categories → recipes, each with `xpath`/`css`/`dom`/`selenium` columns). `page.tsx` filters it by free-text query. To add recipes, edit `data.ts`.

### API routes

- `src/app/api/download/route.ts` — generates a CSV inline and returns it with `Content-Disposition: attachment` to drive the file-download practice page. The `?delay=` query param simulates slow downloads. There is no real auth route yet — the `/elements/auth` page only validates client-side via `react-hook-form` + `zod` and toasts success.

### UI library + paths

- `components.json` configures shadcn (style `new-york`, base color `zinc`, `rsc: true`). Generated primitives live in `src/components/ui/`.
- TypeScript path alias: `@/* → src/*` (`tsconfig.json`).
- Tailwind v3.4 with CSS variables (`hsl(var(--…))`) defined in `src/app/globals.css`. Animation plugin: `tailwindcss-animate`. Dark mode is class-based (`darkMode: ["class"]`).

### State helpers

`src/components/state/` holds four tiny presentational components (`EmptyState`, `ErrorState`, `ProgressBar`, `StateSkeleton`) used across element pages — prefer these over rolling new ones.

### Hooks

`src/hooks/use-toast.ts` is the legacy shadcn toast hook. New code uses `sonner` (`import { toast } from "sonner"`) — the `Toaster` in `Shell` is the sonner one. Keep new code on sonner unless touching files that already import the shadcn `useToast`.
