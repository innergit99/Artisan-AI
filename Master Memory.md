# ARTISAN AI - Master Memory

> **Last Update**: 2026-02-07 12:40
> **Current Status**: 🟢 LIVE (Public Beta - publishlab.ink)

## Project Overview
**ARTISAN AI** is an advanced KDP (Kindle Direct Publishing) automation suite designed to accelerate the creation of professional-grade book content, covers, and metadata.
**Tech Stack**:
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend/Tooling**: Node.js, Vite
- **AI Logic**: Hybrid Engine (OpenAI, HuggingFace [Free], Ollama [Local], Static Fallback)
- **Auth/DB**: Supabase (Auth + User Data)
- **Payments**: Paddle (Subscriptions)
- **Hosting**: Vercel (artisanai-tan.vercel.app → publishlab.ink)

## Current Objectives
1.  **Public Beta Live**: Users can sign up, get instant Novice plan access, and use the studio.
2.  **Lead Capture Active**: All signups captured in Supabase for marketing.
3.  **Genre Expansion**: Continue refining procedural engines for specific KDP niches.

## Project Documentation Ecosystem
-   **`Master Memory.md`** (Root): **The Living Journal**. Tracks *current state*, recent changes, and active blockers. (Dynamic)
-   **`.agent/rules/artisan.md`**: **The Constitution**. Defines static *Quality Gates*, Tech Stack rules (React/Tailwind), and "Humanity Pro" writing standards. (Static)
-   **`.agent/rules/project_context.md`**: **The Protocol**. A mandatory hook that forces the agent to read the Global `GEMINI.md` and Local `Master Memory.md` on startup. (System)

## Recent Changes (2026-02-06)

### 🔐 Authentication & Gating
12. **[AUTH] Beta Gating Fixed**: Added auth check to `onLaunchApp` callback in `App.tsx`. Users must now sign up/login before accessing the studio.
13. **[AUTH] Email Confirmation Disabled**: Toggled OFF "Confirm email" in Supabase → Users get instant access without email verification.
14. **[AUTH] Forgot Password Added**: Enhanced `AuthModal.tsx` with 3-mode UI (login/signup/forgot). Uses Supabase `resetPasswordForEmail` API.
15. **[AUTH] Auto-Grant Novice Plan**: All new users automatically receive FREE/Novice tier on signup (1 manuscript/mo, 5 images/mo).

### 📚 KDP Export Quality (Critical Fixes)
16. **[KDP] Placeholder Leak Blocker**: `geminiService.ts` now throws error instead of returning placeholder text that leaked into PDFs.
17. **[KDP] ISBN Placeholder Removed**: Removed "ISBN: Assign via KDP Dashboard" from `downloadService.ts`.
18. **[KDP] Publisher Branding Fixed**: Changed "Artisan AI Genesis ∞" to "Independently Published" as default.
19. **[KDP] Content Pending Removed**: Empty chapters now show blank instead of "Content pending..." text.
20. **[KDP] Export Validator Created**: New `kdpExportValidator.ts` with 25+ blocker patterns. Blocks export if placeholder content detected.
21. **[KDP] Gemini API Endpoint Fixed**: Updated `diagnostics.ts` from `v1beta` to `v1` endpoint.
22. **[KDP] Premium Textures**: Added 3-color gradients and film grain to `coverGenerator.ts`.
42. **[DEV] Gemini CLI Integration**: Configured local `gemini` CLI with dedicated API key (`GEMINI_CLI_KEY`) via `init_cli.ps1` for quota-isolated terminal usage.
43. **[RADAR] Real-Time Intelligence**: Activated `marketService.ts` with Firecrawl API. `TrendRadarPage.tsx` now performs live cross-platform niche analysis using Gemini 1.5 Flash.
44. **[DEPLOY] Market Radar v1**: Deployed to Vercel (Production) with Real-Time Engine (Requires `VITE_FIRECRAWL_API_KEY` in Vercel Env Vars).

### 📝 Previous Changes (2026-02-03)
1.  **[SYSTEM] Free Tier Switch (Critical)**: Disabled `GEMINI_API_KEY` to stop billing. Refactored `geminiService.ts` to strictly block Google API calls and enforce a fallback chain.
2.  **[OPS] API Drain Stopped**: Identified and terminated "zombie" Node.js processes.
3.  **[FEATURE] Procedural Title Engine**: Implemented `generateRandomizedTitles` in `geminiService.ts`.
4.  **[FEATURE] Structural Chapter Engine**: Upgraded `generateFallbackOutline` with narrative phases.
5.  **[UI/UX] Landing Page Fix**: Resolved non-functional buttons, implemented dynamic briefing panels.
6.  **[LEGAL] Fair Use Refactor**: Replaced brand references with functional descriptions.

## Critical Context
-   **Auth Redirection**: The Password Reset link is currently pending a URL update in the Supabase Dashboard (Site URL needs to be `https://www.publishlab.ink/`).
-   **AI Economy**: The system behaves DIFFERENTLY in "Free Mode". Generative text may be slower (HuggingFace) or static (Fallback).
-   **Gemini Service**: Despite the name `geminiService.ts`, this file is now the central "AI Orchestrator". It handles ALL providers.
-   **Genre Engines**: The `GENRE_ENGINES` constant in `geminiService.ts` is the "Brain" of the procedural generation.
-   **KDP Export Validator**: `kdpExportValidator.ts` MUST validate all exports. It blocks placeholder leaks.
-   **Supabase Project ID**: `mctmtdjbjynzlunfictm` - Auth settings at supabase.com/dashboard
-   **Global IDE**: User's global configuration is in `C:\Users\gauvi\.gemini\antigravity`.
-   **Context Rule**: Always check `.agent/rules/project_context.md` when starting.

## Key Files Modified Today
| File | Purpose |
|------|---------|
| `App.tsx` | Beta gating + Password Recovery listener |
| `AuthModal.tsx` | Login/Signup/Forgot Password UI, Added `update_password` mode (Set New Password) |
| `downloadService.ts` | Removed placeholders, added validation gate |
| `geminiService.ts` | Throws error instead of returning placeholder |
| `kdpExportValidator.ts` | NEW - Export blocker with 25+ patterns |
| `diagnostics.ts` | Fixed Gemini API endpoint |
| `coverGenerator.ts` | Premium grain texture |
| `marketService.ts` | NEW - Real-time market data (Firecrawl/Gemini) |
| `TrendRadarPage.tsx` | Dynamic UI for Niche Analysis |
| `init_cli.ps1` | CLI configuration script for isolated quota |
