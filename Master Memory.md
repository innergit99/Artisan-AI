# ARTISAN AI - Master Memory

> **Last Update**: 2026-02-10 18:30
> **Current Status**: 🟢 LIVE / PRODUCTION DEPLOYED (publishlab.ink)
> **Backend**: 🤗 HuggingFace Spaces Integrated (Llama 3.1-8B + FLUX.1)

## Project Overview
**ARTISAN AI** is an advanced KDP (Kindle Direct Publishing) automation suite designed to accelerate the creation of professional-grade book content, covers, and metadata.
**Tech Stack**:
- **Frontend**: React, TypeScript, Tailwind CSS, Framer Motion
- **Backend/Tooling**: Node.js, Vite, FastAPI (Python), Gradio
- **AI Logic**: Hybrid Engine (HuggingFace Spaces [Primary], OpenAI, Ollama [Local], Static Fallback)
- **AI Models**: Llama 3.1-8B (Text), FLUX.1-schnell (Images), Gemini 1.5 Flash
- **Auth/DB**: Supabase (Auth + User Data)
- **Payments**: Paddle (Subscriptions)
- **Hosting**: Vercel (Frontend) + HuggingFace Spaces (Backend)

## Current Objectives
1.  **Production Backend Live**: HuggingFace Spaces deployment with Llama 3.1-8B + FLUX.1 integration complete.
2.  **Public Beta Active**: Users can sign up, get instant Novice plan access, and use production-grade AI.
3.  **Visual Excellence**: POD Designer redesigned with 3D effects, particle animations, and V3 Mockup Shapes (10+ new products).
4.  **Live Payments**: Paddle Billing v2 integrated and active for Solo, Artisan, and Master tiers.
5.  **AI Intelligence**: Pollinations AI fallback implemented for cost-efficient image generation.

## Project Documentation Ecosystem
-   **`Master Memory.md`** (Root): **The Living Journal**. Tracks *current state*, recent changes, and active blockers. (Dynamic)
-   **`.agent/rules/artisan.md`**: **The Constitution**. Defines static *Quality Gates*, Tech Stack rules (React/Tailwind), and "Humanity Pro" writing standards. (Static)
-   **`.agent/rules/project_context.md`**: **The Protocol**. A mandatory hook that forces the agent to read the Global `GEMINI.md` and Local `Master Memory.md` on startup. (System)

## Recent Changes (2026-02-08)

### 💳 Live Billing & Industrialization (2026-02-10)
50. **[BILLING] Live Paddle Integration**: Switched from Sandbox to Production node.
    - **Seller ID**: 281327 (Bishal Gautam)
    - **Product Mapping**: Real Price IDs mapped for all 3 tiers (Solo, Artisan, Master).
    - **Environment**: `VITE_PADDLE_ENVIRONMENT=production` set in `.env`.
51. **[AI] Pollinations Integration**: Free high-quality image fallback implemented.
52. **[MOCKUP] Vector Shapes V3**: Detailed geometry for 10 new products (Backpack, Duffle, Journal, etc.).

### 🎨 Canvas Mockup System (2026-02-08)
48. **[MOCKUP] Self-Contained Canvas System**: Complete elimination of third-party mockup dependencies
   - **canvasMockupService.ts**: HTML5 Canvas-based mockup generation (371 lines)
   - **holographicMockupService.ts**: Pure vector product generation with 3D effects (414 lines)
   - **PRODUCT_SHAPES Library**: Programmatic product definitions (T-shirts, hoodies, mugs, phone cases)
   - **Zero Dependencies**: No external APIs, unlimited generation, works offline
   - **3D Hologram Effects**: Canvas transforms for depth, lighting/shadows mathematically
   - **Design Integration**: Overlay user designs with proper perspective and fabric effects
49. **[ARCHITECTURE] Mockup Independence**: Eliminated all external mockup service dependencies
   - **Instant Generation**: No API limits, no queue times
   - **Customizable Styles**: Realistic, minimal, and 3D rendering options
   - **Professional Quality**: Vector-based product shapes with realistic contours
   - **Cost Efficiency**: Zero ongoing API costs for mockup generation

### 🎨 POD Designer Redesign (2026-02-08)
23. **[UI/UX] POD Designer Card Transformed**: Complete visual overhaul from calculator-like appearance to stunning showcase.
   - **3D Tilt Effect**: Mouse-tracking perspective rotation
   - **Animated Gradient Mesh**: Pink/purple gradient orbs with hover expansion
   - **Floating Particles**: 6 animated drifting particles
   - **Dynamic Product Showcase**: Glassmorphic panel cycling through 6 product types (T-Shirts, Mugs, Posters, Phone Cases, Tote Bags, Hoodies)
   - **Animated Progress Bars**: Visual product type indicators
   - **Glowing Icon Effect**: Pink-to-rose gradient with hover glow
   - **Style Chips**: Floating design style indicators (3D Text, Neon, Retro, Graffiti)
   - **Live Preview Badge**: Pulsing emerald indicator
   - **Corner Arrow**: Rotating hover animation
24. **[ARCH] New Components**: Created `PODDesignerCard.tsx` and `styles/pod-designer-animations.css`
25. **[DEPLOY] Vercel Auto-Deploy**: Git push triggered automatic deployment to publishlab.ink

### 🔐 Authentication & Gating (2026-02-06)
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
-   **Canvas Mockup System**: Self-contained mockup generation using HTML5 Canvas (no external dependencies)
-   **Holographic Products**: Vector-based product generation with 3D effects via `holographicMockupService.ts`
-   **PRODUCT_SHAPES Library**: Programmatic product definitions for instant, unlimited mockup creation
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
| `canvasMockupService.ts` | NEW - HTML5 Canvas mockup generation (371 lines, zero external dependencies) |
| `holographicMockupService.ts` | NEW - Vector-based 3D product generation (414 lines, pure Canvas) |
| `PODDesignerCard.tsx` | NEW - Enhanced POD Designer card with 3D tilt, animations, product carousel |
| `styles/pod-designer-animations.css` | NEW - CSS animations for floating particles and glow effects |
| `Dashboard.tsx` | Updated to use custom POD Designer card component |
| `index.css` | Added POD Designer animation keyframes |
| `App.tsx` | Beta gating + Password Recovery listener |
| `AuthModal.tsx` | Login/Signup/Forgot Password UI, Added `update_password` mode (Set New Password) |
| `downloadService.ts` | Removed placeholders, added validation gate |
| `geminiService.ts` | Throws error instead of returning placeholder; Added `resolveGenreSpec` mapping |
| `kdpExportValidator.ts` | NEW - Export blocker with 25+ patterns |
| `verify_genre_matrix.ts` | NEW - Automated genre specification auditor |
| `GENRE_VERIFICATION_REPORT.md` | NEW - Final pass/fail results for 21 genres |
| `walkthrough.md` | Updated with full Genre Engine deployment results |
