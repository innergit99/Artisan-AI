# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

Artisan AI is an AI-powered creative studio for Amazon KDP (Kindle Direct Publishing) and POD (Print-on-Demand) content creation. It provides tools for generating books, covers, coloring pages, logos, and market intelligence.

**Tech Stack:**
- Frontend: React 19 + Vite + TypeScript + TailwindCSS 4
- Backend: Python FastAPI (in `/backend/`)
- Cloud Deployment: HuggingFace Spaces with Gradio (in `/HF_FINAL_DEPLOYMENT/`)
- Auth & Storage: Supabase + IndexedDB (local cache)
- Payments: Paddle

## Build & Development Commands

```powershell
# Install dependencies
npm install

# Run development server (port 3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

**Local AI Requirements:**
- Ollama must be running on `localhost:11434` for local mode
- Model: `llama3.2:3b` (pull with `ollama pull llama3.2:3b`)

**Backend (FastAPI):**
```powershell
# Install Python dependencies (from project root)
pip install -r backend/requirements.txt

# Run backend server (port 7860)
python backend/app.py
```

## Architecture

### AI Provider Cascade
The app uses a multi-provider AI system with automatic fallback (`geminiService.ts:queryAI`):
1. **Local Mode (DEV):** Ollama only → Static fallback
2. **Production Mode:** Gemini Flash → Groq Llama 3.3-70B → HuggingFace → Static fallback

Environment detection is handled in `environmentConfig.ts`. Set `VITE_FORCE_LOCAL_MODE=true` or `VITE_FORCE_PRODUCTION_MODE=true` to override.

### Core Services (Root Directory)
- `geminiService.ts` - Main AI orchestration with genre-specific logic engines (GENRE_ENGINES, KDP_GENRE_SPECS)
- `hfBackendService.ts` - HuggingFace Spaces API client
- `storageService.ts` - Hybrid storage (IndexedDB + Supabase sync)
- `supabaseClient.ts` - Auth and database client
- `imageService.ts` / `visualService.ts` - Image generation routing
- `exportService.ts` - PDF/EPUB export via jsPDF
- `kdpValidator.ts` / `kdpExportValidator.ts` - KDP compliance checking

### UI Components (`/components/`)
- `Dashboard.tsx` - Main navigation hub
- `ToolView.tsx` - Dynamic tool renderer
- `ManuscriptDoctorPage.tsx` - Book writing interface
- `CoverFoundryPage.tsx` - Cover generation
- `TrendRadarPage.tsx` - Market intelligence (Niche Radar V2)

### Type System (`types.ts`)
Key types: `ToolType` (enum), `KDPBlueprint`, `KDPChapter`, `GeneratedImage`, `CharacterProfile`

### Backend Agents (`/backend/app.py`)
FastAPI endpoints with specialized AI agent roles:
- `/api/niche-analysis` - Market research
- `/api/amazon-seo` - KDP metadata optimization
- `/api/kdp-generate` - Book manuscript generation
- `/api/expand-chapter` - Chapter content expansion
- `/api/humanize` - AI content sanitization

## Environment Variables

Required keys are documented in `.env.example`. Key variables:
- `VITE_GEMINI_API_KEY` - Google Gemini (primary text AI)
- `VITE_GROQ_API_KEY` - Groq (fallback text AI)
- `VITE_FAL_API_KEY` - Fal.ai (production images)
- `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` - Database
- `VITE_PADDLE_*` - Payment processing

## Key Patterns

### Genre Logic Engines
Book generation uses structured genre-specific logic defined in `GENRE_ENGINES` (`geminiService.ts`):
- Each genre has a fixed `flow` (narrative arc), selectable `engines` (conflict drivers), and a creative `override`
- Visual genres (MANGA, COMIC) include `visuals` panel directives

### Author Persona System (APX)
Creative writing uses author personas from `authorPersonas.ts` that define voice, rhythm, and stylistic bias per genre.

### Chapter Expansion Strategy
Large chapters (>1200 words) use multi-pass generation:
- Local/Ollama: Segmented generation (1000 words per segment)
- Cloud: 3-segment strategy (Hook → Body → Climax)

### Proxy Configuration (`vite.config.ts`)
API requests are proxied:
- `/api/ollama/*` → `localhost:11434` (Ollama)
- `/api/pollinations/*` → `pollinations.ai` (fallback images)

## Important Notes

- App version logged on startup: `v2.1.6-stable`
- Beta gating requires authentication for most features
- HuggingFace deployment uses ZeroGPU with 60s text / 30s image limits
- KDP exports must pass compliance validation before generation
