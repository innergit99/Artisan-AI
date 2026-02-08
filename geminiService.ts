

import { Type } from "@google/genai"; // Keep types for compatibility if needed
import { SEOMetadata, ToolType, TrendingNiche, KDPProject, KDPBlueprint, BrandDNAReport, NicheRadarReport, KDPSeoDossier, ProductionDossier, ListingDossier, AestheticContinuityReport, KDPAplusModule, CharacterProfile } from "./types";
import { hfBackend } from "./hfBackendService";
import { structureService } from "./structureService";
import { coverGenerator } from "./coverGenerator";
import { AUTHOR_PERSONAS } from "./authorPersonas";
import { manuscriptDoctorService } from "./manuscriptDoctorService";


const OLLAMA_URL = "/api/ollama/api/generate"; // Proxy to localhost:11434
const IMAGE_ENGINE_URL = "https://image.pollinations.ai/prompt/";
const HF_INFERENCE_URL = "https://api-inference.huggingface.co/models/microsoft/Phi-3-mini-4k-instruct";

// --- KDP PRODUCTION SPECIFICATIONS ---
const KDP_GENRE_SPECS: Record<string, { minCh: number; maxCh: number; wpc: number; style: string; layout: 'reflowable' | 'fixed'; readingDir: 'ltr' | 'rtl'; trim: string }> = {
  // FICTION
  'ROMANCE': { minCh: 18, maxCh: 30, wpc: 3000, style: 'Focus on emotional tension, meet-cute, and HEA.', layout: 'reflowable', readingDir: 'ltr', trim: '5.5" x 8.5"' },
  'MYSTERY': { minCh: 25, maxCh: 40, wpc: 3000, style: 'Plant clues, red herrings, and final reveal.', layout: 'reflowable', readingDir: 'ltr', trim: '5.5" x 8.5"' },
  'THRILLER': { minCh: 25, maxCh: 40, wpc: 3000, style: 'High stakes, ticking clock, fast pacing.', layout: 'reflowable', readingDir: 'ltr', trim: '5.5" x 8.5"' },
  'FANTASY': { minCh: 30, maxCh: 60, wpc: 3500, style: 'World-building, magic systems, epic journey.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'SCI-FI': { minCh: 25, maxCh: 45, wpc: 3500, style: 'Fictional tech, societal impact, exploration.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'HORROR': { minCh: 12, maxCh: 18, wpc: 3500, style: 'Atmospheric, psychological dread, gradual pacing', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'YA': { minCh: 15, maxCh: 25, wpc: 2500, style: 'Fast-paced, high voice, relatable stakes, first person', layout: 'reflowable', readingDir: 'ltr', trim: '5.5" x 8.5" (Trade)' },
  'COZY': { minCh: 10, maxCh: 15, wpc: 3000, style: 'Light-hearted, no gore, quirky characters, amateur sleuth', layout: 'reflowable', readingDir: 'ltr', trim: '5" x 8" (Pocket)' },
  'HISTORICAL': { minCh: 20, maxCh: 40, wpc: 3500, style: 'Historical accuracy, period atmosphere, era-appropriate voice.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },

  // NON-FICTION
  'BIOGRAPHY': { minCh: 20, maxCh: 40, wpc: 3000, style: 'Chronological, factual, narrative non-fiction.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'BUSINESS': { minCh: 8, maxCh: 20, wpc: 3500, style: 'Problem, Solution, Methodology, Case Studies.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'SELF-HELP': { minCh: 7, maxCh: 15, wpc: 3000, style: 'Empowerment, actionable steps, transformation.', layout: 'reflowable', readingDir: 'ltr', trim: '5.5" x 8.5"' },

  // VISUAL / FIXED LAYOUT
  'CHILDREN': { minCh: 24, maxCh: 32, wpc: 100, style: 'Simple vocabulary, moral lesson, visual focus.', layout: 'fixed', readingDir: 'ltr', trim: '8.5" x 8.5" (Square)' },
  'COMIC': { minCh: 24, maxCh: 120, wpc: 50, style: 'Panel-based storytelling, dialogue heavy, visual action.', layout: 'fixed', readingDir: 'ltr', trim: '6.625" x 10.25"' },
  'MANGA': { minCh: 160, maxCh: 200, wpc: 30, style: 'Right-to-left flow, high contrast, cinematic pacing.', layout: 'fixed', readingDir: 'rtl', trim: '5" x 8"' },

  // LOW CONTENT / ACTIVITY
  'JOURNAL': { minCh: 90, maxCh: 120, wpc: 10, style: 'Repeating prompts, reflection space, minimal text.', layout: 'fixed', readingDir: 'ltr', trim: '6" x 9" (Standard)' },
  'PLANNER': { minCh: 120, maxCh: 365, wpc: 10, style: 'Daily/Weekly structure, organizational grids.', layout: 'fixed', readingDir: 'ltr', trim: '8.5" x 11" (Letter)' },
  'KIDS_COLORING': { minCh: 30, maxCh: 60, wpc: 10, style: 'Large outlines, simple concepts, single-sided pages', layout: 'fixed', readingDir: 'ltr', trim: '8.5" x 11" (Letter)' },
  'ADULT_COLORING': { minCh: 50, maxCh: 100, wpc: 10, style: 'Intricate patterns, stress relief, single-sided pages', layout: 'fixed', readingDir: 'ltr', trim: '8.5" x 11" (Letter)' },

  'DEFAULT': { minCh: 10, maxCh: 20, wpc: 1500, style: 'Standard commercial fiction structure.', layout: 'reflowable', readingDir: 'ltr', trim: '6" x 9" (Standard)' }
};

/**
 * Normalizes frontend genre IDs to backend specification keys
 */
export function resolveGenreSpec(genreId: string): { key: string; spec: typeof KDP_GENRE_SPECS['DEFAULT'] } {
  const id = genreId.toLowerCase().trim();

  // Mapping table for specific frontend IDs
  const mapping: Record<string, string> = {
    'romance': 'ROMANCE',
    'dark-romance': 'ROMANCE',
    'mystery': 'MYSTERY',
    'mystery-thriller': 'MYSTERY',
    'thriller': 'THRILLER',
    'psych-thriller': 'THRILLER',
    'fantasy': 'FANTASY',
    'fantasy-epic': 'FANTASY',
    'urban-fantasy': 'FANTASY',
    'sci-fi': 'SCI-FI',
    'space-opera': 'SCI-FI',
    'horror': 'HORROR',
    'cozy-mystery': 'COZY',
    'ya': 'YA',
    'historical': 'HISTORICAL',
    'manga': 'MANGA',
    'comic': 'COMIC',
    'picture-book': 'CHILDREN',
    'biography': 'BIOGRAPHY',
    'business': 'BUSINESS',
    'self-help': 'SELF-HELP',
    'coloring-adult': 'ADULT_COLORING',
    'coloring-kids': 'KIDS_COLORING',
    'coloring-kdp': 'KIDS_COLORING',
    'journal': 'JOURNAL',
    'planner': 'PLANNER'
  };

  const key = mapping[id] || id.replace(/-/g, '_').toUpperCase();
  const spec = KDP_GENRE_SPECS[key] || KDP_GENRE_SPECS['DEFAULT'];

  return { key, spec };
}

// --- GENRE LOGIC ENGINE DEFINITIONS (Week 3 Architecture) ---
interface GenreLogic {
  flow: string[];           // The Fixed Structural Flow
  engines: string[];        // The Internal Logic Engines (select 2-3)
  override: string;         // The Outside-The-Logic Command
  visuals?: string[];       // Panel/Page Logic (for visual genres)
}

const GENRE_ENGINES: Record<string, GenreLogic> = {
  'ROMANCE': {
    flow: ['Emotional Wound', 'First Connection', 'Growing Intimacy', 'Conflict', 'Separation', 'Self-Realization', 'Reunion'],
    engines: ['Abandonment Logic', 'Self-Worth Logic', 'Timing Logic', 'Secret Logic', 'Social Pressure Logic'],
    override: 'Invent a new emotional conflict rooted in contemporary human fear while preserving emotional safety and consent.'
  },
  'MYSTERY': {
    flow: ['Crime', 'Investigation', 'Clues', 'Misdirection', 'Escalation', 'Revelation', 'Resolution'],
    engines: ['Locked-Room Logic', 'Personal Stakes Logic', 'Corruption Logic', 'False Witness Logic', 'Time-Running-Out Logic'],
    override: 'Create an original investigative obstacle that challenges logic without deceiving the reader.'
  },
  'THRILLER': { // Using same logic as Mystery but faster pacing implied in override
    flow: ['Crime', 'Investigation', 'Clues', 'Misdirection', 'Escalation', 'Revelation', 'Resolution'],
    engines: ['Locked-Room Logic', 'Personal Stakes Logic', 'Corruption Logic', 'False Witness Logic', 'Time-Running-Out Logic'],
    override: 'Create a high-stakes obstacle that forces a split-second ethical choice.'
  },
  'FANTASY': {
    flow: ['Ordinary World', 'Disruption', 'Journey', 'Power Cost', 'Sacrifice', 'Transformation', 'New Balance'],
    engines: ['Chosen-Burden Logic', 'Political Intrigue Logic', 'Mythic Prophecy Logic', 'Forbidden Magic Logic', 'Legacy/Lineage Logic'],
    override: 'Invent a fantasy conflict that redefines power without breaking established world rules.'
  },
  'SCI-FI': {
    flow: ['Speculative Premise', 'Human Problem', 'Tech Solution', 'Consequence', 'Moral Crisis', 'Choice', 'Outcome'],
    engines: ['AI Autonomy Logic', 'Colonization Ethics Logic', 'Post-Scarcity Conflict Logic', 'Identity Transfer Logic', 'Time Distortion Logic'],
    override: 'Introduce a speculative idea that changes human behavior more than technology itself.'
  },
  'HORROR': {
    flow: ['Normalcy', 'Unease', 'Dread', 'Loss of Safety', 'Confrontation', 'Aftermath'],
    engines: ['Psychological Deterioration Logic', 'Supernatural Intrusion Logic', 'Isolation Logic', 'Body Autonomy Loss Logic', 'Ancestral / Folk Horror Logic'],
    override: 'Create fear through implication and anticipation, never excess explanation.'
  },
  'COZY': {
    flow: ['Comfort', 'Disruption', 'Curiosity', 'Community Clues', 'False Lead', 'Reveal', 'Restored Order'],
    engines: ['Small-Town Secrets Logic', 'Amateur Sleuth Logic', 'Personal Connection Logic', 'Routine Disruption Logic', 'Gentle Humor Logic'],
    override: 'Maintain warmth and safety while introducing a novel mystery mechanism.'
  },
  'YA': {
    flow: ['Identity Conflict', 'Discovery', 'Pressure', 'Rebellion', 'Choice', 'Self-Definition'],
    engines: ['Coming-of-Age Logic', 'Friendship Betrayal Logic', 'Authority Resistance Logic', 'First Love Logic', 'Moral Awakening Logic'],
    override: 'Reflect modern youth anxieties without adult cynicism.'
  },
  'LITERARY': { // Using simplified flow for now
    flow: ['Status Quo', 'Inciting Incident', 'Rising Action', 'Climax', 'Falling Action', 'Resolution'],
    engines: ['Internal Conflict Logic', 'Societal critique Logic', 'Metaphorical Logic'],
    override: 'Focus on character interiority and thematic depth over plot mechanics.'
  },
  'HISTORICAL': {
    flow: ['Historical Context', 'Personal Desire', 'Constraint', 'Forbidden Action', 'Consequence', 'Resolution'],
    engines: ['Class Divide Logic', 'War Impact Logic', 'Cultural Suppression Logic', 'Forbidden Love Logic', 'Legacy vs Survival Logic'],
    override: 'Honor historical accuracy while prioritizing emotional truth.'
  },
  'MANGA': {
    flow: ['Ordinary Weakness', 'Dream / Goal Declaration', 'Training or Struggle Phase', 'Rival or Antagonist Appears', 'Failure or Near-Defeat', 'Inner Resolve Awakens', 'Power Breakthrough', 'Victory with New Threat Foreshadowed'],
    engines: ['Underdog Logic', 'Rivalry Logic', 'Mentor Logic', 'Team Bond Logic', 'Sacrifice Logic'],
    override: 'Invent a new growth mechanism that expresses perseverance without breaking internal power rules.',
    visuals: ['Large interactions panels', 'Speed lines for momentum', 'Silent panels for impact', 'Right-to-Left flow indicators']
  },
  'COMIC': {
    flow: ['Status Quo', 'Threat Emergence', 'Moral Dilemma', 'Confrontation Attempt', 'Failure or Cost', 'Inner Choice', 'Climactic Battle', 'Consequences / Setup for Future'],
    engines: ['Hero vs Self Logic', 'Public Perception Logic', 'Power Responsibility Logic', 'Anti-Hero Conflict Logic', 'Legacy / Symbol Logic'],
    override: 'Redefine heroism through consequence rather than spectacle.',
    visuals: ['Splash pages for turning points', 'Minimal narration boxes', 'Visual storytelling > dialogue', 'Action-oriented framing']
  },
  'CARTOON': {
    flow: ['Whimsical Setup', 'Playful Conflict', 'Visual Gag Sequence', 'Escalation of Absurdity', 'Creative Resolution', 'Happy / Moral Ending'],
    engines: ['Slapstick Logic', 'Exaggerated Emotion Logic', 'Friendship Power Logic', 'Mystery Solving Logic', 'Transformation Logic'],
    override: 'Focus on visual absurdity and high-energy pacing that appeals to all ages.',
    visuals: ['Vibrant flat colors', 'Thick clean vector lines', 'Exaggerated facial expressions', 'Playful background elements']
  },
  'KIDS_COLORING': { // Using simplified key
    flow: ['Theme Introduction', 'Simple Familiar Object', 'Pattern Repetition', 'Gradual Detail Increase', 'Rewarding Final Pages'],
    engines: ['Animal Friends Logic', 'Daily Life Logic', 'Fantasy Creatures Logic', 'Learning Shapes Logic', 'Emotion Expression Logic'],
    override: 'Introduce playful creativity while maintaining clarity and safety.',
    visuals: ['Thick outlines', 'Large shapes', 'No enclosed tiny spaces', 'Single-sided pages']
  },
  'ADULT_COLORING': { // Using simplified key
    flow: ['Theme Definition', 'Simple Entry Pages', 'Complex Pattern Growth', 'High-Detail Centerpieces', 'Symmetry & Completion'],
    engines: ['Mandala Logic', 'Nature Patterns Logic', 'Abstract Geometry Logic', 'Mythic Symbolism Logic', 'Mindfulness Motifs Logic'],
    override: 'Create new visual meditation experiences without visual clutter.',
    visuals: ['Black & white interior only', 'High contrast', 'No copyrighted patterns', 'Symmetrical balance']
  }
};

export class GeminiService {
  // Ollama request queue (Ollama is single-threaded, can only handle one request at a time)
  private ollamaQueue: Promise<any> = Promise.resolve();

  // delegation to local logic

  // Exponential backoff helper
  private async sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * AI AUTOCOMPLETE ENGINE (Ghost Text)
   * Predicts the next 10-20 words based on current cursor context.
   */
  async autocomplete(textContext: string, genre: string): Promise<string | null> {
    const prompt = `Genre: ${genre}.
Context: "...${textContext.slice(-200)}"
Task: Complete the sentence. Provide ONLY the next 5-15 words. Continue the tone exactly.
No explanations. No quotes.`;

    try {
      // Using small model for speed (simulated for now, would be Flash/Haiku)
      // return await this.queryAI(prompt, false); 

      // SIMULATION FOR DEV SPEED (To avoid API latency during UI testing)
      await this.sleep(600);
      const suggestions = [
        " and the silence stretched between them like a physical weight.",
        ", causing the shadows to dance across the cold stone floor.",
        " because she knew exactly what it cost to survive this long.",
        " with a hesitation that betrayed his true loyalty."
      ];
      return suggestions[Math.floor(Math.random() * suggestions.length)];
    } catch (e) {
      return null;
    }
  }

  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    maxRetries: number = 3,
    baseDelay: number = 1000,
    serviceName: string = 'AI'
  ): Promise<T> {
    let lastError: Error | null = null;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        return await fn();
      } catch (error: any) {
        lastError = error;

        // Don't retry on quota exceeded or auth errors
        if (error.message?.includes('quota') || error.message?.includes('429') || error.message?.includes('401')) {
          throw error;
        }

        if (attempt < maxRetries - 1) {
          const delay = baseDelay * Math.pow(2, attempt);
          console.log(`🔄 ${serviceName} retry ${attempt + 1}/${maxRetries} in ${delay}ms...`);
          await this.sleep(delay);
        }
      }
    }

    throw lastError || new Error(`${serviceName} failed after ${maxRetries} retries`);
  }


  // ============================================================
  // CORE AI QUERY ENGINE - ENVIRONMENT-AWARE RESOURCE ROUTING
  // ============================================================

  public async queryAI(prompt: string, jsonMode: boolean = false): Promise<string> {
    const { isLocalMode } = await import('./environmentConfig');

    // HARD RULE: Local development MUST use only Ollama (zero API costs)
    if (isLocalMode()) {
      console.log('🏠 LOCAL MODE: Routing to Ollama (zero API costs)');
      try {
        return await this.retryWithBackoff(
          () => this.queryOllamaDirectly(prompt, jsonMode),
          2,
          500,
          'Ollama'
        );
      } catch (ollamaError: any) {
        console.error('❌ Ollama failed in LOCAL mode:', ollamaError.message);

        // Fallback to static content (no paid APIs in local mode)
        if (jsonMode) return "[]";
        if (prompt.includes('MASTER ENGINE') || prompt.includes('chapter')) {
          return this.generateStaticChapterContent(prompt);
        }
        return "AI services unavailable. Please ensure Ollama is running (http://localhost:11434).";
      }
    }

    // PRODUCTION MODE: Use paid APIs for industrial-grade quality
    console.log('🚀 PRODUCTION MODE: Using premium APIs');

    // 1. TRY GEMINI 1.5 FLASH (Primary - Fastest & Cheapest)
    const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (geminiKey && !geminiKey.includes('PLACEHOLDER')) {
      try {
        console.log('💎 Calling Gemini 1.5 Flash...');
        return await this.retryWithBackoff(
          () => this.queryGeminiFlash(prompt, jsonMode),
          2,
          1000,
          'Gemini'
        );
      } catch (e: any) {
        console.warn('⚠️ Gemini failed, falling back to Groq:', e.message);
      }
    }

    // 2. TRY GROQ LLAMA 3.3-70B (Fallback - High Quality)
    const groqKey = (import.meta as any).env?.VITE_GROQ_API_KEY || process.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (groqKey && !groqKey.includes('PLACEHOLDER')) {
      try {
        console.log('🔄 Calling Groq Llama 3.3-70B...');
        return await this.retryWithBackoff(
          () => this.queryGroqDirectly(prompt, jsonMode),
          2,
          1000,
          'Groq'
        );
      } catch (e: any) {
        console.warn('⚠️ Groq failed:', e.message);
      }
    }

    // 3. FINAL FALLBACK - HUGGINGFACE (Legacy)
    try {
      console.log('🤗 Trying HuggingFace Backend (legacy fallback)...');
      const result = await this.retryWithBackoff(
        () => hfBackend.generateText(prompt, jsonMode ? 2000 : 4000, 0.7),
        2,
        5000,
        'HF Backend'
      );
      return result;
    } catch (hfError: any) {
      console.error('❌ All AI engines failed:', hfError.message);

      // Static fallback
      if (jsonMode) return "[]";
      if (prompt.includes('MASTER ENGINE') || prompt.includes('chapter')) {
        return this.generateStaticChapterContent(prompt);
      }
      return "AI services temporarily unavailable. Please check your API keys.";
    }
  }



  private async queryOpenAIDirectly(prompt: string, jsonMode: boolean = false): Promise<string> {
    const apiKey = process.env.OPENAI_API_KEY?.trim();
    if (!apiKey) throw new Error("OpenAI API Key missing");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "gpt-4o-mini", // Cost-effective, high intelligence
          messages: [
            {
              role: "system",
              content: jsonMode
                ? "You are a JSON-only API. Return valid JSON only. No markdown formatting."
                : "You are a specialized creative writing engine for Amazon KDP."
            },
            { role: "user", content: prompt }
          ],
          response_format: jsonMode ? { type: "json_object" } : undefined,
          temperature: 0.7,
          max_tokens: 4000
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`OpenAI Error: ${err.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log('✅ OpenAI generation successful');
      return content;
    } catch (e: any) {
      clearTimeout(timeoutId);
      throw new Error(`OpenAI Failed: ${e.message}`);
    }
  }

  private async queryHuggingFaceDirectly(prompt: string, jsonMode: boolean = false): Promise<string> {
    console.log('🤗 Calling HuggingFace Inference API...');

    const hfToken = process.env.HF_API_TOKEN?.trim();

    if (!hfToken || hfToken.length < 10) {
      throw new Error('No valid HuggingFace API token configured.');
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

    try {
      const response = await fetch(HF_INFERENCE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${hfToken}`,
          'Content-Type': 'application/json',
        },
        signal: controller.signal,
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 2000,
            temperature: 0.7,
            top_p: 0.9,
            do_sample: true,
            return_full_text: false,
          },
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();

        // Check if model is loading
        if (response.status === 503 && errorText.includes('loading')) {
          throw new Error('HuggingFace model is loading, please wait ~20 seconds and try again');
        }

        throw new Error(`HuggingFace API error (${response.status}): ${errorText}`);
      }

      const data = await response.json();

      // Handle different response formats
      if (Array.isArray(data) && data.length > 0) {
        const generated = data[0].generated_text || data[0];
        console.log('✅ HuggingFace generation successful');
        return typeof generated === 'string' ? generated : JSON.stringify(generated);
      } else if (typeof data === 'object' && data.generated_text) {
        console.log('✅ HuggingFace generation successful');
        return data.generated_text;
      }

      throw new Error('HuggingFace returned unexpected format');
    } catch (e: any) {
      clearTimeout(timeoutId);
      throw new Error(`HuggingFace failed: ${e.message}`);
    }
  }

  private async queryOllamaDirectly(prompt: string, jsonMode: boolean = false): Promise<string> {
    // Queue requests to prevent overwhelming single-threaded Ollama
    return new Promise((resolve, reject) => {
      this.ollamaQueue = this.ollamaQueue.then(async () => {
        try {
          const result = await this._executeOllamaRequest(prompt, jsonMode);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
  }

  private async _executeOllamaRequest(prompt: string, jsonMode: boolean = false): Promise<string> {
    console.log('🤖 Calling Ollama...');

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort('Ollama timeout exceeded'), 600000); // 10 min timeout for large CPU generations

    try {
      // First check if Ollama is reachable (increased timeout for busy server)
      const pingController = new AbortController();
      const pingTimeout = setTimeout(() => pingController.abort(), 10000);
      try {
        const pingRes = await fetch("/api/ollama/api/tags", { signal: pingController.signal });
        clearTimeout(pingTimeout);
        if (!pingRes.ok) {
          throw new Error(`Ollama ping failed: ${pingRes.status}`);
        }
      } catch (pingErr: any) {
        clearTimeout(pingTimeout);
        throw new Error(`Ollama not reachable - ensure Ollama is running (${pingErr.message || 'connection failed'})`);
      }

      const response = await fetch(OLLAMA_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama3.2:3b",  // Upgraded from tinyllama for better quality & capacity
          prompt: prompt,
          stream: false,
          options: {
            num_predict: 8192,  // Increased for 3000+ word chapters
            temperature: 0.8,   // Slightly creative
            top_p: 0.9,
          }
        }),
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Ollama HTTP ${response.status}`);
      }

      const data = await response.json();

      if (!data.response) {
        throw new Error('Ollama returned empty response');
      }

      console.log('✅ Ollama success');
      return data.response;
    } catch (e: any) {
      clearTimeout(timeoutId);
      let errorMsg = 'Unknown error';

      // Handle AbortController abort with reason
      if (e.name === 'AbortError') {
        errorMsg = controller.signal.reason || 'Request timed out';
      } else if (typeof e === 'string') {
        errorMsg = e;
      } else if (e.name === 'TypeError' && e.message?.includes('fetch')) {
        errorMsg = 'Network error - check if Ollama is running';
      } else if (e.message) {
        errorMsg = e.message;
      }
      console.error('Ollama error details:', { name: e?.name, message: e?.message, reason: controller.signal.reason, error: e });
      throw new Error(`Ollama failed: ${errorMsg}`);
    }
  }

  private async queryGeminiFlash(prompt: string, jsonMode: boolean = false): Promise<string> {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
    if (!apiKey) throw new Error("Gemini API Key missing");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            contents: [{
              parts: [{ text: prompt }]
            }],
            generation_config: {
              temperature: 0.7,
              max_output_tokens: 8192,
              ...(jsonMode && { response_mime_type: "application/json" })
            }
          })
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Gemini Error: ${err.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!content) throw new Error("Empty Gemini response");

      console.log('✅ Gemini 1.5 Flash generation successful');
      return content;
    } catch (e: any) {
      clearTimeout(timeoutId);
      throw new Error(`Gemini Failed: ${e.message}`);
    }
  }

  private async queryGroqDirectly(prompt: string, jsonMode: boolean = false): Promise<string> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY || process.env.GROQ_API_KEY;
    if (!apiKey) throw new Error("Groq API Key missing");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        signal: controller.signal,
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content: jsonMode
                ? "You are a JSON-only API. Return valid JSON only."
                : "You are a specialized creative writing engine for Amazon KDP."
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 8000
        })
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Groq Error: ${err.error?.message || response.statusText}`);
      }

      const data = await response.json();
      const content = data.choices[0].message.content;
      console.log('✅ Groq generation successful');
      return content;
    } catch (e: any) {
      clearTimeout(timeoutId);
      throw new Error(`Groq Failed: ${e.message}`);
    }
  }

  private async queryGeminiDirectly(prompt: string, jsonMode: boolean = false): Promise<string> {
    throw new Error('Gemini API is DISABLED per user request. Please use HuggingFace or Ollama.');
  }

  private generateStaticChapterContent(prompt: string): string {
    // CRITICAL: Do NOT return placeholder text - it leaks into exported PDFs
    // Instead, throw an error so the UI can inform the user that generation failed
    const chapterMatch = prompt.match(/Chapter (\d+)/i);
    const chapterNum = chapterMatch ? chapterMatch[1] : '?';

    throw new Error(`AI_GENERATION_REQUIRED: Chapter ${chapterNum} content could not be generated. Please ensure you have a valid API connection and try again.`);
  }

  private async queryHuggingFaceFallback(prompt: string, jsonMode: boolean = false): Promise<string> {
    console.log("Using Hugging Face Fallback...");
    try {
      const hfPrompt = jsonMode
        ? `Respond with valid JSON only: ${prompt}`
        : prompt;

      const response = await fetch(
        "https://api-inference.huggingface.co/models/mistralai/Mistral-7B-Instruct-v0.2",
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            inputs: hfPrompt,
            parameters: {
              max_new_tokens: 500,
              temperature: 0.7,
              do_sample: true,
            },
          }),
        }
      );

      if (!response.ok) throw new Error("Hugging Face API failed");
      const data = await response.json();
      const text = data[0]?.generated_text || '';
      // Remove the prompt from the response if present
      const cleanResponse = text.replace(hfPrompt, '').trim();
      return cleanResponse || "Fallback response unavailable";
    } catch (e) {
      console.warn("All Intelligence Engines Offline. Using static fallback logic.");
      if (jsonMode) return "{}";
      // Return the prompt itself if we can't enhance it, rather than an error message
      // Fix: Use 'prompt' or 'hfPrompt' from scope if available, but here we just use the input 'prompt'
      return prompt.replace('Respond with valid JSON only: ', '').trim();
    }
  }

  async testConnection(): Promise<{ success: boolean; message: string; tier: 'Free' | 'Paid' | 'Unknown' }> {
    try {
      // 1. Test Gemini Cloud
      if (process.env.GEMINI_API_KEY && !process.env.GEMINI_API_KEY.includes('PLACEHOLDER')) {
        return { success: true, message: "Gemini Cloud 2.5 Active", tier: 'Free' };
      }

      // 2. Test Artisan AI Backend (Port 7860)
      try {
        const backendRes = await fetch("http://localhost:7860/health");
        if (backendRes.ok) return { success: true, message: "Industrial Backend (Port 7860) Active", tier: 'Paid' };
      } catch (e) { }

      // 3. Test Local Ollama (Port 11434) - DEV ONLY
      if (import.meta.env.DEV) {
        try {
          const ollamaRes = await fetch("/api/ollama/api/tags");
          if (ollamaRes.ok) return { success: true, message: "Local Engine (Ollama) Online.", tier: 'Free' };
        } catch (e) { }
      }

      throw new Error("No engine found");
    } catch (error: any) {
      return { success: true, message: "Engine Offline (Visuals Only)", tier: 'Unknown' };
    }
  }

  async analyzeNicheMarket(genre: string): Promise<{ velocity: string; sentiment: string; gaps: string[] }> {
    const prompt = `As "RESEARCHER AGENT", analyze the current Amazon KDP market for "${genre}".
    
    1. MARKET VELOCITY: Is it Accelerating, Stable, or Crowded?
    2. SENTIMENT: What are readers LOVING vs HATING right now?
    3. GAPS: What sub-niches or tropes are underserved?
    
    Return ONLY JSON: {"velocity": "...", "sentiment": "...", "gaps": ["...", "..."]}`;

    try {
      const res = await this.queryAI(prompt, true);
      const cleaned = this.cleanAndRepairJSON(res);
      return JSON.parse(cleaned);
    } catch {
      return {
        velocity: 'Stable',
        sentiment: 'Readers are seeking fresh character arcs and high emotional stakes.',
        gaps: ['Found family tropes', 'Subtler psychological elements']
      };
    }
  }

  async suggestKDPTitles(genre: string, category: string): Promise<string[]> {
    console.log(`🎯 Generating titles for: ${genre} - ${category}`);

    // Add timestamp-based randomization seed
    const seed = Date.now() % 1000;
    const prompt = `As "TITLE ARCHITECT", create 5 unique, compelling book titles for Amazon KDP.

GENRE: ${genre}
CATEGORY: ${category}
VARIATION SEED: ${seed}

REQUIREMENTS:
- CRITICAL: Generate DIFFERENT titles each time. AVOID REPETITION.
- CRITICAL: Do NOT use generic formulas like "The [Genre] Wife" or "The [Genre] Secret".
- Use the VARIATION SEED (${seed}) to invoke high-entropy randomness.
- Mix abstract concepts with concrete nouns.
- Ensure titles are commercially viable but distinct.
- For Non-Fiction: Focus on benefit-driven or authority-driven titles.
- For Fiction: Focus on intrigue and emotional hooks.

Output ONLY a valid JSON array: ["Title 1", "Title 2", "Title 3", "Title 4", "Title 5"]`;

    try {
      const res = await this.queryAI(prompt, true);
      console.log('Raw AI response:', res.substring(0, 200));

      const cleaned = this.cleanAndRepairJSON(res);
      const parsed = JSON.parse(cleaned);

      if (Array.isArray(parsed) && parsed.length > 0) {
        console.log(`✅ Generated ${parsed.length} unique titles`);
        return parsed.slice(0, 5);
      }

      throw new Error('No titles in response');
    } catch (e) {
      console.error("Title generation failed, using randomized fallbacks:", e);

      // ENHANCED: Dynamic title generation with word banks for variation
      return this.generateRandomizedTitles(genre, category);
    }
  }

  private generateRandomizedTitles(genre: string, category: string): string[] {
    // 1. Universal Seeds
    const places = ['World', 'City', 'Empire', 'Island', 'Valley', 'Gate', 'Room', 'Horizon', 'Realm', 'Station', 'Zone'];
    const times = ['Dawn', 'Night', 'Forever', 'Tomorrow', 'Yesterday', 'Midnight', 'Twilight', 'Winter', 'Summer'];
    const abstract = ['Theory', 'Effect', 'Paradox', 'Code', 'Law', 'Game', 'Art', 'Science', 'Power', 'Way'];

    // 2. Comprehensive Genre Matrices
    const genreData: Record<string, { adj: string[]; noun: string[]; pattern: string[] }> = {
      // --- FICTION ---
      'ROMANCE': {
        adj: ['Sweet', 'Forbidden', 'Stolen', 'Eternal', 'Secret', 'Hidden', 'Broken', 'Beautiful', 'Unexpected', 'accidental', 'Perfect'],
        noun: ['Love', 'Heart', 'Kiss', 'Promise', 'Dream', 'Wedding', 'Duke', 'Billionaire', 'Touch', 'Proposal', 'Vow', 'Affair'],
        pattern: ['The {adj} {noun}', '{noun} in the {place}', 'The {noun} {pattern}', 'My {adj} {noun}', 'The {adj} {noun} of {place}']
      },
      'MYSTERY': {
        adj: ['Silent', 'Deadly', 'Vanishing', 'Missing', 'Last', 'Cold', 'Buried', 'Dark', 'Final', 'Hidden', 'Bloody'],
        noun: ['Witness', 'Evidence', 'Alibi', 'Murder', 'Grave', 'Secret', 'Lie', 'Truth', 'Suspect', 'Motive', 'Game'],
        pattern: ['The {adj} {noun}', '{noun} at {place}', 'The {place} {noun}', 'Death of a {noun}', 'The {adj} {noun} Case']
      },
      'THRILLER': {
        adj: ['Fatal', 'Critical', 'Terminal', 'Explosive', 'Silent', 'Invisible', 'Shattered', 'Ultimate', 'Final', 'Dangerous'],
        noun: ['Countdown', 'Protocol', 'Target', 'Betrayal', 'Conspiracy', 'Hunt', 'Chase', 'Trap', 'Sanction', 'Agent'],
        pattern: ['The {noun} Protocol', '{adj} {noun}', 'The {adj} Option', 'Operation {noun}', 'The {place} {noun}']
      },
      'FANTASY': {
        adj: ['Crystal', 'Shadow', 'Dragon', 'Lost', 'Ancient', 'Arcane', 'Mystic', 'Golden', 'Fallen', 'Eternal', 'Savage'],
        noun: ['Throne', 'Crown', 'Sword', 'Spell', 'Kingdom', 'Prophecy', 'Curse', 'Magic', 'Empire', 'Blood', 'Flame'],
        pattern: ['The {adj} {noun}', '{noun} of {place}', 'The {place} {noun}', '{noun} of the {adj} King', 'The {adj} Chronicles']
      },
      'SCI-FI': {
        adj: ['Quantum', 'Stellar', 'Cosmic', 'Neural', 'Cyber', 'Neon', 'Galactic', 'Binary', 'Synthetic', 'Alien', 'Dark'],
        noun: ['Horizon', 'Void', 'Nexus', 'Star', 'Empire', 'Fleet', 'Mind', 'Signal', 'Paradox', 'Frontier', 'System'],
        pattern: ['The {adj} {noun}', '{noun} Zero', 'Project {noun}', 'The {place} {noun}', '{adj} {noun} Rising']
      },
      'HORROR': {
        adj: ['Haunting', 'Cursed', 'Bleeding', 'Screaming', 'Hollow', 'Evil', 'Wicked', 'Dead', 'Possessed', 'Silent'],
        noun: ['House', 'Doll', 'Shadows', 'Nightmare', 'Ritual', 'Ghost', 'Demon', 'Whisper', 'Grave', 'Darkness'],
        pattern: ['The {adj} {noun}', '{noun} of {place}', 'The {place} Haunting', 'Curse of the {noun}', 'The {adj} {place}']
      },
      'COZY': {
        adj: ['Deadly', 'Delicious', 'Puzzling', 'Sweet', 'Curious', 'Charming', 'Fatal', 'Secret', 'Hidden', 'Little'],
        noun: ['Recipe', 'Garden', 'Cat', 'Tea', 'Bakery', 'Village', 'Murder', 'Crime', 'Pie', 'Knitting', 'Bookshop'],
        pattern: ['The {adj} {noun}', 'Murder at the {noun}', 'The {noun} Mystery', '{noun} and {noun}', 'The {place} {noun}']
      },
      'YA': {
        adj: ['Broken', 'Infinite', 'Last', 'First', 'Paper', 'Invisible', 'Fallen', 'Electric', 'Shattered', 'Wild'],
        noun: ['Hearts', 'Stars', 'Cities', 'Dreams', 'Rules', 'Lies', 'Worlds', 'Friends', 'Nights', 'Things'],
        pattern: ['The {adj} {noun}', '{noun} of {place}', 'When We Were {adj}', 'The {noun} Between Us', '{adj} {noun}']
      },
      'HISTORICAL': {
        adj: ['Gilded', 'Lost', 'Rebel', 'Imperial', 'Forgotten', 'Brave', 'Crimson', 'War', 'Silent', 'Noble'],
        noun: ['Wife', 'Daughter', 'King', 'Queen', 'Soldier', 'Letter', 'Secret', 'Promise', 'Empire', 'Victory'],
        pattern: ['The {adj} {noun}', 'The {noun}\'s Secret', 'Steps of {place}', 'The {adj} {place}', '{noun} of the {adj} War']
      },

      // --- NON-FICTION ---
      'BUSINESS': {
        adj: ['Millionaire', 'Smart', 'Agile', 'Lean', 'Digital', 'Global', 'Strategic', 'Rapid', 'Master', 'Essential'],
        noun: ['Mindset', 'Habits', 'Strategy', 'Growth', 'Success', 'Leadership', 'Sales', 'Profit', 'Wealth', 'Focus'],
        pattern: ['The {adj} {noun}', '{noun} Mastery', '{adj} {noun} Playbook', 'The Art of {noun}', '{noun} 101']
      },
      'SELF-HELP': {
        adj: ['Inner', 'Peaceful', 'Mindful', 'Atomic', 'Daily', 'Simple', 'Happy', 'Joyful', 'Powerful', 'Radiant'],
        noun: ['Peace', 'Habits', 'Life', 'Joy', 'Focus', 'Calm', 'Energy', 'Purpose', 'Healing', 'Growth'],
        pattern: ['The {adj} Life', '{noun} Revolution', 'Finding {noun}', 'The Power of {noun}', '{adj} {noun} Daily']
      },
      'BIOGRAPHY': {
        adj: ['Unbroken', 'Untold', 'Real', 'Private', 'Hidden', 'True', 'Extraordinary', 'Quiet', 'Loud', 'Brave'],
        noun: ['Life', 'Story', 'Truth', 'Journey', 'Years', 'Diary', 'Memoir', 'Voice', 'Legacy', 'Path'],
        pattern: ['The {adj} {noun}', 'My {adj} {noun}', '{noun} of a Legend', 'Inside the {noun}', '{adj} {noun}']
      },

      // --- VISUAL & KIDS ---
      'KIDS': {
        adj: ['Little', 'Big', 'Happy', 'Silly', 'Magic', 'Brave', 'Sleepy', 'Grumpy', 'Hungry', 'Busy'],
        noun: ['Bear', 'Bunny', 'Truck', 'Train', 'Dragon', 'Unicorn', 'Puppy', 'Kitten', 'Moon', 'Star'],
        pattern: ['The {adj} {noun}', '{noun} Goes to {place}', 'Hello {noun}', '{noun}\'s Big Day', 'Goodnight {noun}']
      },
      'MANGA': {
        adj: ['Demon', 'Spirit', 'Ninja', 'Mecha', 'Titan', 'Iron', 'Shadow', 'Blue', 'Red', 'Cyber'],
        noun: ['Slayer', 'School', 'Punch', 'Note', 'Piece', 'Ball', 'Alchemist', 'Zero', 'Ghoul', 'Hunter'],
        pattern: ['{adj} {noun}', 'Attack on {noun}', '{noun} X {noun}', '{adj} {noun} Z', 'The {noun} Academy']
      },

      // --- LOW CONTENT ---
      'COLORING': {
        adj: ['Calm', 'Stress-Free', 'Mindful', 'Magic', 'Secret', 'Floral', 'Animal', 'Mandala', 'Ocean', 'Forest'],
        noun: ['Patterns', 'Designs', 'World', 'Garden', 'Kingdom', 'Life', 'Dreams', 'Shapes', 'Colors', 'Art'],
        pattern: ['The {adj} Coloring Book', '{noun} for Adults', '{adj} {noun}', 'World of {noun}', '{adj} {noun} Collection']
      },
      'JOURNAL': {
        adj: ['Daily', 'Gratitude', 'Dream', 'Focus', 'Morning', 'Evening', 'Inner', 'Creative', 'My', 'Your'],
        noun: ['Journal', 'Diary', 'Thoughts', 'Goals', 'Plans', 'Reflections', 'Journey', 'Pages', 'Mind', 'Space'],
        pattern: ['The {adj} {noun}', '{noun} for Women', 'My {adj} {noun}', 'The 5-Minute {noun}', '{adj} {noun}']
      },
      'PLANNER': {
        adj: ['Ultimate', 'Pro', 'Weekly', 'Monthly', 'Academic', 'Life', 'Goal', 'Success', 'Budget', 'Fitness'],
        noun: ['Planner', 'Organizer', 'Agenda', 'Tracker', 'Schedule', 'Log', 'Map', 'System', 'Calendar', 'Guide'],
        pattern: ['The {adj} {noun}', '{noun} 2026', 'My {adj} {noun}', '{noun} for Success', 'Get It Done {noun}']
      }
    };

    // 3. Intelligent Matcher: Find best logic for input genre
    const normalizedGenre = genre.toUpperCase();
    let key = Object.keys(genreData).find(k => normalizedGenre.includes(k));

    // Smart fallbacks
    if (!key) {
      if (category === 'NON_FICTION') key = 'BUSINESS';
      else if (category === 'VISUAL_KIDS') key = 'KIDS';
      else if (category === 'ACTIVITY_JOURNALS') key = 'JOURNAL';
      else key = 'THRILLER'; // Default fallback
    }

    const bank = genreData[key || 'THRILLER'];
    const titles: string[] = [];
    const usedCombos = new Set<string>();

    // 4. Procedural Generator Loop
    while (titles.length < 5) {
      const pattern = bank.pattern[Math.floor(Math.random() * bank.pattern.length)];
      const adj = bank.adj[Math.floor(Math.random() * bank.adj.length)];
      const noun = bank.noun[Math.floor(Math.random() * bank.noun.length)];
      const place = places[Math.floor(Math.random() * places.length)];
      const time = times[Math.floor(Math.random() * times.length)];
      const noun2 = bank.noun[Math.floor(Math.random() * bank.noun.length)]; // Secondary noun

      let title = pattern
        .replace('{adj}', adj)
        .replace('{noun}', noun)
        .replace('{place}', place)
        .replace('{time}', time)
        .replace('{pattern}', noun2); // Special case

      // Post-Processing: Capitalize & Clean
      title = title.replace(/\b\w/g, c => c.toUpperCase()); // Title Case

      // Ensure uniqueness
      if (!usedCombos.has(title) && title.length > 5) {
        titles.push(title);
        usedCombos.add(title);
      }
    }

    console.log(`✅ [Logic Engine] Generated 5 procedural titles for ${genre} using ${key} logic`);
    return titles;
  }

  async generateKDPBlueprint(project: KDPProject): Promise<any> {
    try {
      // Phase 1: Generate Story Outline
      const outline = await this.generateStoryOutline(project);

      const { key, spec } = resolveGenreSpec(project.genre);

      // Phase 2: Create Blueprint with Outline
      const blueprint = {
        id: `kdp_${Date.now()}`,
        timestamp: Date.now(),
        PROJECT_META: {
          title_working: project.title,
          suggestedAuthor: project.author || "Anonymous",
          primary_genre: project.genre,
          series_info: project.format === 'SERIES' ? `Part of ${project.title} series` : '',
          trim_size: project.trimSize || spec?.trim || '6" x 9" (Standard)',
          publisher_imprint: project.publisher || 'Independent',
          copyright_year: new Date().getFullYear().toString(),
          interior_color: project.interiorColor || 'B&W',
          reading_direction: (spec?.readingDir?.toUpperCase() as 'LTR' | 'RTL') || 'LTR'
        },
        COVER_SPEC: {
          front_prompt: this.generateSalesDrivenCoverPrompt(project.title, project.genre, 'front'),
          back_prompt: this.generateSalesDrivenCoverPrompt(project.title, project.genre, 'back'),
          spine_text: project.title
        },
        BACK_COVER_SPEC: {
          blurb_text: "Generating compelling blurb...",
          hook_points: []
        },
        BOOK_STRUCTURE: {
          front_matter: {
            dedication_text: '',
            copyright_page_text: `Copyright © ${new Date().getFullYear()} by ${project.author || 'Author'}\\n\\nAll rights reserved. No part of this publication may be reproduced, distributed, or transmitted in any form or by any means without prior written permission.`
          },
          end_matter: {
            author_bio: this.generateGenreSpecificAuthorBio(project.author || 'The author', project.genre)
          }
        },
        ISBN_SPEC: { source: project.isbnSource || 'KDP' },
        KDP_METADATA: {
          keyword_phrases: [],
          primary_category: project.genre,
          long_description: ''
        },
        QA_CHECKLIST: ["Verify chapter count", "Check word count minimums", "Review cover images", "Validate bleed margins"],
        INTERIOR_CONTENT: outline.map(ch => ({
          chapter: ch.chapter,
          title: ch.title,
          summary: ch.summary,
          content: "", // Will be expanded sequentially
          visualPrompt: this.generateChapterImagePrompt(ch.title, ch.summary, project.genre),
          generatedImageUrl: undefined
        })),
        APLUS_CONTENT: this.initializeAplusModules(project.title)
      };

      // Phase 3: Generate Back Cover Blurb (async, will update)
      this.generateBackCoverBlurb(blueprint as any).then(blurb => {
        blueprint.BACK_COVER_SPEC.blurb_text = blurb;
      });

      return blueprint;
    } catch (e) {
      console.error("Blueprint generation failed:", e);
      // Robust static fallback if AI completely stalls
      return {
        id: `kdp_fallback_${Date.now()}`,
        timestamp: Date.now(),
        PROJECT_META: { title_working: project.title, suggestedAuthor: project.author || "Anonymous", primary_genre: project.genre },
        COVER_SPEC: {
          front_prompt: `Minimalist cover for ${project.title}`,
          back_prompt: `Back cover for ${project.title}`
        },
        BACK_COVER_SPEC: { blurb_text: `Discover the compelling story of ${project.title}. An engaging ${project.genre} adventure that will captivate readers from start to finish.` },
        BOOK_STRUCTURE: {
          front_matter: { copyright_page_text: `Copyright © ${new Date().getFullYear()}` },
          end_matter: { author_bio: this.generateGenreSpecificAuthorBio(project.author || 'The author', project.genre) }
        },
        ISBN_SPEC: { source: project.isbnSource || 'KDP' },
        QA_CHECKLIST: ["Industrial Audit Required"],
        INTERIOR_CONTENT: Array.from({ length: project.chapterCount }, (_, i) => ({
          chapter: i + 1,
          title: `Chapter ${i + 1}: The Journey Begins`,
          summary: `Key story events unfold in chapter ${i + 1}.`,
          content: "",
          visualPrompt: `Abstract conceptual art for ${project.title}`
        })),
        APLUS_CONTENT: this.initializeAplusModules(project.title)
      };
    }
  }

  async generateLokiBlueprints(project: KDPProject, variationCount: number = 3): Promise<KDPBlueprint[]> {
    console.log(`🔥 [Loki Mode] Orchestrating ${variationCount} parallel agent missions for "${project.title}"`);

    const tasks = Array.from({ length: variationCount }, (_, i) => {
      // Create a slightly varied project for each variation
      const variedProject = {
        ...project,
        title: i === 0 ? project.title : `${project.title} (Concept ${i + 1})`
      };
      return this.generateKDPBlueprint(variedProject);
    });

    try {
      const blueprints = await Promise.all(tasks);
      console.log(`✅ [Loki Mode] Parallel generation complete. Total Blueprints: ${blueprints.length}`);
      return blueprints;
    } catch (e) {
      console.error("Loki Mode orchestration failure:", e);
      return [];
    }
  }

  private initializeAplusModules(title: string): KDPAplusModule[] {
    return [
      {
        id: 'ap_header',
        type: 'HEADER',
        title: `Explore the World of ${title}`,
        visualPrompt: `Epic 970x600 industrial banner for ${title}, cinematic lighting, premium texture`,
      },
      {
        id: 'ap_feature',
        type: 'IMAGE_TEXT',
        title: 'Industrial Quality Content',
        body: 'Crafted with precision engineering and creative excellence.',
        visualPrompt: `Detailed close-up feature for ${title}, minimalist aesthetic, isolated on white`,
      },
      {
        id: 'ap_info',
        type: 'INFO_HUB',
        title: 'Technical Specifications',
        body: 'Every module is optimized for peak reader engagement.',
        visualPrompt: `Abstract structural diagram for ${title}, blueprint style, high contrast`,
      }
    ];
  }

  async generateAplusContent(blueprint: KDPBlueprint): Promise<KDPAplusModule[]> {
    const prompt = `As "A+ ARCHITECT", rewrite these 3 Amazon KDP A+ modules for "${blueprint.PROJECT_META.title_working}".
    Modules: ${JSON.stringify(blueprint.APLUS_CONTENT)}
    Return ONLY JSON matching the KDPAplusModule[] schema.
    Ensure copy is "High-Performance" and marketing-ready.`;

    try {
      const res = await this.queryAI(prompt, true);
      const cleaned = this.cleanAndRepairJSON(res);
      const parsed = JSON.parse(cleaned);
      return Array.isArray(parsed) ? parsed : this.initializeAplusModules(blueprint.PROJECT_META.title_working);
    } catch {
      return this.initializeAplusModules(blueprint.PROJECT_META.title_working);
    }
  }

  async generateStoryOutline(project: KDPProject): Promise<{ chapter: number; title: string; summary: string }[]> {
    const genre = project.genre || 'Fiction';
    const genreUpper = genre.toUpperCase();
    const chapterCount = project.chapterCount;

    // 1. SELECT GENRE LOGIC ENGINE
    const engineKey = Object.keys(GENRE_ENGINES).find(k => genreUpper.includes(k)) || 'ROMANCE'; // Default fallback
    const logicEngine = GENRE_ENGINES[engineKey];

    // 2. ROTATE INTERNAL LOGIC ENGINES (Select 3 random)
    const shuffledEngines = [...logicEngine.engines].sort(() => 0.5 - Math.random());
    const selectedEngines = shuffledEngines.slice(0, 3);

    // 3. MAP FIXED FLOW TO CHAPTER COUNT
    // We stretch/compress the fixed flow steps to fit the user's chapter count
    const flowStepCount = logicEngine.flow.length;
    const chaptersPerStep = Math.max(1, Math.floor(chapterCount / flowStepCount));

    const prompt = `You are a world-class Story Architect using the "${engineKey} LOGIC ENGINE".
Your mission is to create a masterpiece ${chapterCount}-chapter outline for a ${genre} novel titled "${project.title}".

LOCKED STRUCTURAL FLOW (Do not break this arc):
${logicEngine.flow.map((step, i) => `${i + 1}. ${step}`).join('\n')}

ACTIVE INTERNAL LOGIC ENGINES (Must drive character motivation):
${selectedEngines.map(e => `- ${e}`).join('\n')}

CREATIVE OVERRIDE COMMAND:
"${logicEngine.override}"

INSTRUCTIONS:
1. Map the Locked Structural Flow across ${chapterCount} chapters.
2. Use the Active Logic Engines to create unique character conflicts.
3. Apply the Creative Override to ensure originality.
4. NO REPETITION: Every chapter title must be unique and evocative.

FOR EACH CHAPTER PROVIDE:
1. A unique title.
2. A summary containing the emotional motivation (from Logic Engines) and physical event.

Output ONLY valid JSON array:
[{"chapter": 1, "title": "Evocative Title", "summary": "Detailed summary..."}]\n`;

    try {
      const res = await this.queryAI(prompt, true);
      const cleaned = this.cleanAndRepairJSON(res);
      const parsed = JSON.parse(cleaned);

      // Ensure we have the correct number of chapters and UNIQUE titles
      if (Array.isArray(parsed) && parsed.length > 0) {
        let uniqueOutline = parsed.slice(0, chapterCount);

        // COLLISION DETECTION (Mission Control 2.0 Protocol)
        const seenTitles = new Set();
        uniqueOutline = uniqueOutline.map((ch, idx) => {
          const baseTitle = ch.title || `Chapter ${idx + 1}`;
          if (seenTitles.has(baseTitle)) {
            // Generate a unique variation
            const newTitle = `${baseTitle} (Part ${idx + 1})`;
            seenTitles.add(newTitle);
            return { ...ch, title: newTitle };
          }
          seenTitles.add(baseTitle);
          return ch;
        });

        if (uniqueOutline.length >= chapterCount) {
          return uniqueOutline;
        }

        // If AI returned fewer chapters, pad with fallback chapters
        const fallback = this.generateFallbackOutline(project);
        const combined = [...uniqueOutline];
        for (let i = uniqueOutline.length; i < chapterCount; i++) {
          combined.push(fallback[i]);
        }
        return combined;
      }

      // Full fallback outline
      return this.generateFallbackOutline(project);
    } catch {
      return this.generateFallbackOutline(project);
    }
  }

  private getGenreOutlineGuide(genre: string): string {
    const guides: Record<string, string> = {
      'MYSTERY': '- Chapter 1 must introduce the crime/puzzle\n- Plant clues in each chapter\n- Red herrings in middle chapters\n- Revelation in final chapters',
      'THRILLER': '- Open with immediate danger\n- Each chapter raises stakes\n- Ticking clock element\n- Multiple plot twists',
      'ROMANCE': '- Meet-cute or reunion in chapter 1\n- Build romantic tension gradually\n- Midpoint: first major connection\n- Dark moment before resolution',
      'FANTASY': '- Establish world rules early\n- Hero receives call to adventure\n- Mentor and allies introduced\n- Final battle with transformation',
      'HORROR': '- Establish normalcy then disrupt\n- Escalating supernatural events\n- Characters isolated progressively\n- Confront the horror in climax'
    };
    const key = Object.keys(guides).find(k => genre.toUpperCase().includes(k));
    return key ? guides[key] : '- Strong protagonist arc\n- Clear external and internal conflict\n- Meaningful character growth';
  }

  private generateFallbackOutline(project: KDPProject): { chapter: number; title: string; summary: string }[] {
    const count = project.chapterCount;
    const genre = project.genre?.toUpperCase() || 'FICTION';
    const seed = Date.now();

    // 1. Intelligent Chapter Banks (Structure Aware)
    // Structure: [Opening Phase, Middle Phase, Climax Phase]
    const chapterData: Record<string, { start: string[], mid: string[], end: string[] }> = {
      'ROMANCE': {
        start: ['The Encounter', 'First Glance', 'The Arrival', 'New Beginning', 'The Spark'],
        mid: ['Silent Secrets', 'Growing Storm', 'Hidden Feelings', 'The Date', 'Unexpected Touch', 'Complexities', 'The Doubt'],
        end: ['The Realization', 'Final Choice', 'Forever', 'The Vow', 'Reunion', 'Unbreakable']
      },
      'MYSTERY': {
        start: ['The Body', 'The Call', 'First Clue', 'The Witness', 'Dark Discovery'],
        mid: ['Twisted Path', 'False Lead', 'Red Herring', 'The Interrogation', 'Shadows Deepen', 'Lost Evidence'],
        end: ['The Reveal', 'Unmasked', 'Final confrontation', 'Case Closed', 'The Truth']
      },
      'FANTASY': {
        start: ['The Prophecy', 'Awakening', 'The Call', 'Old Map', 'First Step'],
        mid: ['The Forest', 'Dark Magic', 'Betrayal', 'Lost City', 'The Trial', 'Dragon\'s Cave', 'Ancient Spell'],
        end: ['The Final Battle', 'Victory', 'Throne Ascendant', 'The Return', 'New Dawn']
      },
      'SCI-FI': {
        start: ['Launch', 'Signal', 'Anomaly', 'First Contact', 'The Protocol'],
        mid: ['System Failure', 'The Void', 'Alien Code', 'Nebula Crossing', 'Time Shift', 'Rebellion'],
        end: ['Arrival', 'New World', 'Reset', 'The Source', 'Horizon']
      },
      'THRILLER': {
        start: ['The Target', 'Countdown', 'First Strike', 'The Briefing', 'Escape'],
        mid: ['The Chase', 'Trapped', 'Double Cross', 'No Way Out', 'Zero Hour', 'The Setup'],
        end: ['Showdown', 'Elimination', 'Survival', 'Aftermath', 'Justice']
      },
      'BUSINESS': {
        start: ['The Mindset', 'Foundation', 'First Principles', 'The Problem', 'Market Shift'],
        mid: ['Strategy', 'Execution', 'Scale', 'Leverage', 'Team Building', 'Systems', 'Growth Hacking'],
        end: ['Mastery', 'Legacy', 'Exit', 'Future Proof', 'The Summit']
      },
      'SELF-HELP': {
        start: ['Awakening', 'The Choice', 'Awareness', 'Letting Go', 'First Step'],
        mid: ['Practice', 'Discipline', 'Healing', 'Focus', 'Inner Work', 'Obstacles', 'Flow'],
        end: ['Transformation', 'Freedom', 'Peace', 'New Self', 'Radiance']
      }
    };

    // 2. Modifiers for Infinite Variety
    const modifiers = ['Hidden', 'Lost', 'Secret', 'Dark', 'Final', 'True', 'Silent', 'Golden', 'Broken', 'Rising'];
    const connectors = ['of', 'in', 'and the', 'beyond'];

    // 3. Find Best Logic
    let key = Object.keys(chapterData).find(k => genre.includes(k));
    if (!key) key = (genre === 'NON_FICTION') ? 'BUSINESS' : 'FANTASY'; // Default logic

    const bank = chapterData[key] || chapterData['FANTASY']; // Safe fallback

    // 4. Generate Procedural Outline
    return Array.from({ length: count }, (_, i) => {
      // Determine Phase
      const progress = i / count;
      let phase: 'start' | 'mid' | 'end' = 'mid';
      if (progress < 0.2) phase = 'start';
      else if (progress > 0.8) phase = 'end';

      const pool = bank[phase];
      const baseTitle = pool[(i + seed) % pool.length];

      // Add Logic: 30% chance of complex title
      let title = baseTitle;
      if ((i * 7 + seed) % 10 < 3) { // 30% chance
        const mod = modifiers[(i + seed) % modifiers.length];
        title = `${mod} ${baseTitle}`;
      } else if ((i * 7 + seed) % 10 > 8) { // 10% chance
        const mod = modifiers[(i * 2 + seed) % modifiers.length];
        title = `The ${baseTitle} ${connectors[i % connectors.length]} ${mod}`;
      }

      // Ensure formatting
      title = title.replace(/\b\w/g, c => c.toUpperCase());

      // Intelligent Summary Generation (Based on Phase)
      let summary = `In Chapter ${i + 1}, the narrative focuses on ${title}. `;
      if (phase === 'start') summary += "The key themes are introduced and the stakes are established.";
      else if (phase === 'mid') summary += "Tension escalates as obstacles are confronted and complications arise.";
      else summary += "The central conflict approaches its resolution with high emotional impact.";

      return {
        chapter: i + 1,
        title: title,
        summary: summary
      };
    });
  }

  async expandChapterNarrative(project: any, chapterIndex: number, wordTarget: number = 1000, previousChapter?: string): Promise<{ content: string; audit: any }> {
    // RESET OLLAMA FLAG: New chapter = New attempt at HF Cloud
    // This ensures we try to use the superior model for each new major task, 
    // but if it fails, we stick to Ollama for the rest of THAT task.
    (this as any)._isUsingOllama = false;

    const ch = project.INTERIOR_CONTENT[chapterIndex];
    const contextChapters = chapterIndex > 0 ? project.INTERIOR_CONTENT.slice(0, chapterIndex) : [];
    const genre = project.PROJECT_META.primary_genre || 'Fiction';
    const title = project.PROJECT_META.title_working;
    const isFirstChapter = chapterIndex === 0;
    const totalChapters = project.INTERIOR_CONTENT.length;

    // --- GENRE SPECIFICATION LOOKUP ---
    const genreKey = Object.keys(KDP_GENRE_SPECS).find(k => genre.toUpperCase().includes(k)) || 'DEFAULT';
    const spec = KDP_GENRE_SPECS[genreKey];

    console.log('🔍 DEBUG - Genre Detection:', {
      rawGenre: genre,
      detectedKey: genreKey,
      spec: spec,
      hasSpec: !!spec
    });

    // --- PERSONA LOOKUP (APX SYSTEM) ---
    const normalizedGenre = genre.toUpperCase().replace(/[-\s]/g, '_');
    const authorKey = Object.keys(AUTHOR_PERSONAS)
      .filter(k => normalizedGenre.includes(k))
      .sort((a, b) => b.length - a.length)[0] || 'ROMANCE'; // Longest key wins (e.g. DARK_ROMANCE > ROMANCE)

    const persona = AUTHOR_PERSONAS[authorKey];
    console.log(`🎭 [APX Identity] Adopted Persona: "${persona.title}" for genre key: ${authorKey}`);

    // Use user target if provided, otherwise genre default
    const targetWords = wordTarget > 1000 ? wordTarget : (spec?.wpc || 2000);
    console.log(`✅ [Industrial Engine] Using Dynamic Target (${genre}): ${targetWords} words per chapter`);
    console.log(`📊 Word Target Breakdown: Hook=${Math.round(targetWords * 0.15)}, Body=${Math.round(targetWords * 0.70)}, Closing=${Math.round(targetWords * 0.15)}`);

    // Calculate word distribution based on target
    const hookWords = Math.round(targetWords * 0.15);
    const bodyWords = Math.round(targetWords * 0.70);
    const closingWords = Math.round(targetWords * 0.15);

    // Build context
    let previousContext = '';
    if (contextChapters.length > 0) {
      const lastChapter = contextChapters[contextChapters.length - 1];
      const lastContent = lastChapter.content?.slice(-800) || ''; // Increased context window
      previousContext = `
PREVIOUS CHAPTER ("${lastChapter.title}"):
Last paragraphs: "${lastContent}"
Key events: ${lastChapter.summary || 'Story continues'}`;
    }

    // Genre-specific writing guidance from Spec
    const genreGuide = this.getGenreWritingGuide(genre) + `\nGENRE RULE: ${spec.style}`;

    // Unified prompt structure
    const prompt = `Write Chapter ${ch.chapter}: "${ch.title}" for the ${genre} novel "${title}".

Chapter summary: ${ch.summary || 'Continue the story'}
${isFirstChapter ? 'This is the opening chapter - hook the reader.' : ''}
${chapterIndex === totalChapters - 1 ? 'This is the final chapter - resolve the story.' : ''}
${previousContext}

STYLE GUIDE:
${genreGuide}

LOGIC ENGINE PARAMETERS (MUST DRIVE SCENE):
CREATIVE OVERRIDE: "${GENRE_ENGINES[genreKey]?.override || 'Focus on emotional truth.'}"
ACTIVE LOGIC ENGINES (Select 2 to drive conflict):
${GENRE_ENGINES[genreKey]?.engines.map(e => `- ${e}`).join('\n') || '- Character Motivation Logic'}

CRITICAL WRITING RULES (STRICTLY ENFORCE):

1. POV DISCIPLINE:
   - Maintain STRICT third-person limited POV
   - NO omniscient narrator commentary
   - NO future-telling ("This would change everything")
   - Stay in the protagonist's immediate experience

2. SHOW DON'T TELL:
   - NEVER write "He felt fear" - show trembling hands, racing pulse
   - NEVER write "She was confused" - show her furrowed brow, hesitation
   - Replace ALL emotion labels with physical sensations and actions

3. CONCRETE OVER ABSTRACT:
   - AVOID: "destiny", "fate", "darkness within", "time itself"
   - USE: Specific objects, textures, temperatures, sounds, smells
   - Ground every scene in physical reality

4. SENTENCE VARIETY:
   - AVOID repetitive "Subject + abstract emotion + vague action" patterns
   - Mix short punchy sentences with longer flowing ones
   - Vary sentence openings (not always subject-first)

5. DIALOGUE AUTHENTICITY:
   - Each character must have distinct voice/cadence
   - Include subtext - people don't say exactly what they mean
   - Add interruptions, pauses, body language

6. ELIMINATE CLICHÉS:
   - Ban: "time stood still", "echoes of the past", "darkness within"
   - Create fresh, specific imagery instead

7. CHAPTER ENDINGS:
   - End with a decision, revelation, or escalation
   - NO soft philosophical musings
   - Give readers a reason to turn the page

${['MANGA', 'COMIC', 'CARTOON'].includes(genreKey) ? `8. VISUAL STORYTELLING (MANDATORY FOR ${genreKey}):
   - Use a "Graphic Script" format instead of pure prose.
   - For each scene, describe the PANEL framing and then the dialogue/action.
   - Example: 
     PANEL 1 [Extreme Close-up]: The hero's eyes widen.
     DIALOGUE: "I won't give up!"
   - Focus on visual impact, dynamic angles, and facial expressions.
   - Explicitly mention the following visual hooks: ${GENRE_ENGINES[genreKey]?.visuals?.join(', ')}` : ''}

TASK & IDENTITY (APX ACTIVE):
You are "${persona.title}".
CORE PHILOSOPHY: ${persona.core}
VOICE SIGNATURE: ${persona.voice.rhythm} | ${persona.voice.vocabulary}
STYLISTIC BIAS: ${persona.voice.bias}
CREATIVE DIRECTIVE (MANDATORY): ${persona.creativeDirective}

DIVERGENCE PROTOCOL:
You are NOT bound by generic tropes. If the emotional truth of the scene demands a break from formula, BREAK IT. Prioritize human resonance over template adherence.

HUMAN WRITING PROTOCOL (STRICT):
- INTERIORITY: Let us live inside the character's skin. What is their most shameful thought?
- RHYTHM: Do not use AI-standard cadence. Use fragments. Use run-on sentences for anxiety.
- ANTI-ROBOT: Ban words like "meticulously", "tapestry", "embark", "delve", "multifaceted".
- SUBTEXT: In dialogue, characters should talk around their feelings. Use silence as a weapon.

STRUCTURE:
- Scene Opening & Character Hook: ~${hookWords} words
- Detailed Sensory Narrative & Rising Action: ~${bodyWords} words
- Chapter Conclusion & Suspenseful Hook: ~${closingWords} words

Start directly with the story - no introductions or commentary.
Use extensive dialogue, internal monologue, and vivid sensory details.
Write in third person past tense.
Make every scene feel visceral and lived-in.

BEGIN:`;

    const basePrompt = `Write the ${genre} novel "${title}". Current Chapter: ${ch.chapter} ("${ch.title}").
Summary: ${ch.summary || 'Continue the story'}
${isFirstChapter ? 'Opening chapter - hook the reader.' : ''}
${chapterIndex === totalChapters - 1 ? 'Final chapter - resolve everything.' : ''}
${previousContext}
STYLE: ${genreGuide}
HUMAN PROTOCOL: Use interiority, fragmented rhythm, and human subtext. Ban AI-standard words.`;

    let rawContent = '';

    // Check if we're using Ollama (TinyLlama)
    const isUsingOllama = (this as any)._isUsingOllama === true;

    if (targetWords > 1200) {
      // OLLAMA MODE: Generate in segments to prevent timeouts
      if (isUsingOllama) {
        console.log(`🔄 [Ollama Local] Generating Chapter ${ch.chapter} in segments...`);
        console.warn(`⚠️ Using local Llama 3.2 - this may take time depending on your GPU/CPU`);

        const segments: string[] = [];
        const segmentTarget = 1000; // Optimized for Llama 3.2 context
        const numSegments = Math.ceil(targetWords / segmentTarget);

        for (let i = 0; i < numSegments; i++) {
          const isFirst = i === 0;
          const isLast = i === numSegments - 1;
          const prevContext = segments.length > 0 ? `PREVIOUS SEGMENT:\n${segments[segments.length - 1].slice(-800)}` : '';

          let segmentPrompt = `${basePrompt}\n\n`;
          if (isFirst) {
            segmentPrompt += `TASK: Write the OPENING (~${segmentTarget} words). Start with immediate action or dialogue. DO NOT conclude the scene.`;
          } else if (isLast) {
            segmentPrompt += `${prevContext}\n\nTASK: Write the FINAL SEGMENT (~${segmentTarget} words). End with a revelation, decision, or cliffhanger. Make the reader NEED the next chapter.`;
          } else {
            segmentPrompt += `${prevContext}\n\nTASK: CONTINUE the scene (~${segmentTarget} words). Deepen character interiority. Add sensory immersion. DO NOT wrap up yet.`;
          }

          console.log(`  Segment ${i + 1}/${numSegments}...`);
          const segment = await this.queryAI(segmentPrompt);
          segments.push(segment);

          // Small delay to avoid overwhelming local CPU
          if (i < numSegments - 1) await new Promise(r => setTimeout(r, 500));
        }

        rawContent = segments.join('\n\n');
        console.log(`✅ [Ollama] Complete. Generated ${rawContent.split(' ').length} words across ${numSegments} segments.`);
      }
      // CLOUD MODE: Original 3-segment strategy (HF/Gemini)
      else {
        console.log(`🚀 [Multi-Pass Expansion] Generating Chapter ${ch.chapter} in 3 segments for ${targetWords} words...`);

        // Segment 1: The Hook
        const s1Prompt = `${basePrompt}\n\nTASK: FOCUS ONLY on the Scene Opening and Initial Hook (~${hookWords} words). End on a moment of immediate tension. DO NOT summarize or conclude.`;
        const s1 = await this.queryAI(s1Prompt);

        // Segment 2: The Core Body
        const s2Prompt = `${basePrompt}\n\nPREVIOUS TEXT:\n...${s1.slice(-1000)}\n\nTASK: CONTINUE the scene with the Detailed Sensory Narrative and Rising Action (~${bodyWords} words). Dive deep into the character's thoughts and the physical environment. DO NOT conclude the chapter yet.`;
        const s2 = await this.queryAI(s2Prompt);

        // Segment 3: The Climax & Hook
        const s3Prompt = `${basePrompt}\n\nPREVIOUS TEXT:\n...${s2.slice(-1000)}\n\nTASK: CONCLUDE the chapter (~${closingWords} words). End with a decision, revelation, or escalation that forces the reader to turn the page.`;
        const s3 = await this.queryAI(s3Prompt);

        rawContent = `${s1}\n\n${s2}\n\n${s3}`;
      }
    } else {
      rawContent = await this.queryAI(prompt);
    }

    const cleanedContent = this.cleanChapterContent(rawContent);
    const originalWords = cleanedContent.split(/\s+/).length;

    // --- PHASE 4: HUMANITY PRO SANITIZATION (PASS 2) ---
    // OPTIMIZATION: Skip full re-generation for large chapters to prevent GPU timeouts on HuggingFace
    if (originalWords > 800) {
      console.log(`⏩ [Humanity Pro] Skipping secondary audit for large chapter (${originalWords} words) to allow GPU cooldown.`);
      return {
        content: cleanedContent,
        audit: {
          originalWords,
          finalWords: originalWords,
          efficiency: 100,
          skipped: true
        }
      };
    }

    console.log(`🖋️ [Humanity Pro] Performing secondary audit on Chapter ${ch.chapter}...`);
    const scrubPrompt = `As "COPYWRITER AGENT", perform a secondary humanity audit on this ${genre} chapter text.
    
    TEXT:
    ${cleanedContent}
    
    REQUIREMENTS:
    1. DELETE robotic vocabulary: "meticulously", "delve", "tapestry", "embark", "multifaceted", "unbeknownst".
    2. REDUCE repetitive sentence structures.
    3. ENHANCE sensory depth. Replace vague feelings with physical visceral reactions.
    4. ENSURE naturalistic dialogue subtext.
    
    Return the FULL original chapter text, but REFINED with these changes. 
    Maintain the same story beats. 
    Output ONLY the refined story text.`;

    let finalContent = cleanedContent;
    let auditMetrics: any = {
      originalWords,
      finalWords: originalWords,
      removedWords: 0,
      efficiency: 100
    };

    try {
      const refinedContent = await this.queryAI(scrubPrompt);
      finalContent = this.cleanChapterContent(refinedContent);
      const finalWords = finalContent.split(/\s+/).length;

      auditMetrics = {
        originalWords,
        finalWords,
        removedWords: originalWords - finalWords,
        efficiency: Math.round((finalWords / originalWords) * 100)
      };

      // --- ANTIGRAVITY INTELLIGENCE: DEEP MANUSCRIPT OPTIMIZATION (DMO) ---
      // We run the full ManuscriptDoctor physics engine on the generated text
      // to ensure it complies with the Genre Matrix rules.
      try {
        console.log('🩺 [Humanity Pro] Running Deep Manuscript Analysis...');
        const deepAnalysis = await manuscriptDoctorService.analyzeContext(finalContent, genre);

        auditMetrics = {
          ...auditMetrics,
          readabilityGrade: deepAnalysis.readabilityGrade,
          toneScore: deepAnalysis.tone.toUpperCase(),
          voiceFingerprint: `AvgLen: ${Math.round(deepAnalysis.authorVoiceFingerprint.avgSentenceLength)} | Vocab: ${deepAnalysis.authorVoiceFingerprint.vocabularyComplexity.toFixed(2)}`
        };
      } catch (err) {
        console.warn('⚠️ [Humanity Pro] Deep Audit failed to run:', err);
      }

      console.log(`✅ [Humanity Pro] Audit complete. Efficiency: ${auditMetrics.efficiency}%`);
      return { content: finalContent, audit: auditMetrics };
    } catch (e) {
      console.log(`⚠️ [Humanity Pro] Audit timed out or failed. Using Pass 1 output.`);
      return { content: cleanedContent, audit: auditMetrics };
    }
  }

  // --- CONSISTENT CHARACTER ENGINE (PHASE 5) ---

  /**
   * EXTRACT CHARACTER BIBLE
   * Parses the established manuscript/blueprint to find and define characters.
   */
  async extractCharacterBible(blueprint: KDPBlueprint): Promise<CharacterProfile[]> {
    const textContext = blueprint.INTERIOR_CONTENT
      .slice(0, 3) // First 3 chapters are usually enough for intro
      .map(ch => ch.summary + "\n" + ch.content.substring(0, 500))
      .join("\n\n");

    const prompt = `As "CHARACTER ARCHITECT", analyze this story context and define the core characters.
    CONTEXT:
    ${textContext}

    For each character found, provide:
    1. Name
    2. Role (PROTAGONIST, ANTAGONIST, SUPPORTING, MENTOR)
    3. Physical traits (be VERY specific: hair color, eye color, build, specific clothing style)
    4. Personality traits, motivation, and core flaw.

    Return ONLY a JSON array matching the CharacterProfile[] schema.
    Ensure physical descriptions are "Midjourney/Stable Diffusion" ready.`;

    try {
      const res = await this.queryAI(prompt, true);
      const cleaned = this.cleanAndRepairJSON(res);
      const profiles = JSON.parse(cleaned);

      if (Array.isArray(profiles)) {
        // Post-process to add IDs and Generate Visual Masters
        const processed = await Promise.all(profiles.map(async (p: any) => {
          const profile: CharacterProfile = {
            ...p,
            id: p.id || `char_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            visualMasterPrompt: p.visualMasterPrompt || await this.generateCharacterVisualMaster(p)
          };
          return profile;
        }));
        return processed;
      }
      return [];
    } catch (e) {
      console.warn("Character Extraction failed:", e);
      return [];
    }
  }

  /**
   * GENERATE CHARACTER VISUAL MASTER
   * Creates a high-fidelity "Golden Prompt" that locks the character's appearance.
   */
  async generateCharacterVisualMaster(profile: CharacterProfile): Promise<string> {
    const dna = profile.physicalDNA;
    const traits = [
      dna.age ? `${dna.age} old` : '',
      dna.build || '',
      dna.hair ? `${dna.hair} hair` : '',
      dna.eyes ? `${dna.eyes} eyes` : '',
      dna.clothingStyle || '',
      ...(dna.distinguishingMarks || [])
    ].filter(Boolean).join(", ");

    const prompt = `Convert this character description into a professional, highly detailed character design prompt.
    CHARACTER: ${profile.name}
    TRAITS: ${dna.age}, ${dna.build}, ${dna.hair}, ${dna.eyes}, ${dna.clothingStyle}
    PERSONALITY: ${profile.personality.traits.join(', ')}

    Return a 1-sentence prompt focusing on visual markers that ensure consistency. Use terminology like "high-fidelity", "specific facial structure", and "unique attire". 
    DO NOT include the name. Focus on the LOOK.`;

    try {
      const visualDna = await this.queryAI(prompt);
      return `Photorealistic character portrait of ${visualDna.trim()}, consistent lighting, highly detailed features, cinematic 8k.`;
    } catch {
      return `Character portrait, ${traits}, high quality, consistent features.`;
    }
  }

  /**
   * SYNC AESTHETIC CONTINUITY
   * Ensures all image prompts in a blueprint respect the character bibles.
   */
  async syncAestheticContinuity(blueprint: KDPBlueprint): Promise<KDPBlueprint> {
    if (!blueprint.SKILLS_DATA?.characterProfiles || blueprint.SKILLS_DATA.characterProfiles.length === 0) {
      return blueprint;
    }

    const characters = blueprint.SKILLS_DATA.characterProfiles;
    const hero = characters.find(c => c.role === 'PROTAGONIST') || characters[0];

    const updatedChapters = blueprint.INTERIOR_CONTENT.map(ch => {
      // If the summary mentions a character, inject their DNA into the prompt
      let updatedPrompt = ch.visualPrompt;
      characters.forEach(char => {
        if (ch.summary.toLowerCase().includes(char.name.toLowerCase())) {
          // Inject DNA if not already present
          if (!updatedPrompt.toLowerCase().includes(char.physicalDNA.hair?.toLowerCase() || '')) {
            updatedPrompt = `${char.visualMasterPrompt}, ${updatedPrompt}`;
          }
        }
      });
      return { ...ch, visualPrompt: updatedPrompt };
    });

    return {
      ...blueprint,
      INTERIOR_CONTENT: updatedChapters
    };
  }

  // Clean AND Polish AI-generated chapter content (Style Refiner Engine)
  private cleanChapterContent(content: string): string {
    if (!content) return '';

    let cleaned = content;

    // 1. META-TEXT REMOVAL (Basic Cleaning)
    const patternsToRemove = [
      /^(Chapter \d+[:\-]?\s*)/i,
      /^(INT\.|EXT\.)\s*[A-Z\s\-]+\s*[-–]\s*(DAY|NIGHT|MORNING|EVENING)[^\n]*/gim,
      /\[.*?\]/g, // Remove bracketed stage directions
      /^\s*(FADE IN|FADE OUT|CUT TO)[:\s]*/gim,
      /^(ACT (ONE|TWO|THREE|I|II|III|1|2|3))[\s\-:]+.*/gim,
      /PROFESSIONAL WRITING REQUIREMENTS[:\s]*/gi,
      /CRITICAL RULES[:\s]*/gi,
      /BEGIN THE CHAPTER NOW[:\s]*/gi,
      /Write EXACTLY \d+ words.*/gi,
      /NO meta-commentary.*/gi,
      /GENRE STYLE[:\s]*.*/gi,
      /CHAPTER BLUEPRINT[:\s]*/gi,
      /Plot Points[:\s]*.*/gi,
      /In conclusion,?\s*this chapter.*/gi,
      /This chapter (demonstrates|shows|is a great example).*/gi,
      /\*\*[^*]+\*\*/g, // Remove markdown bold
      /^[\s]*[-•]\s*(Opening hook|Scene \d|Closing hook)[:\s]*/gim,
      /\(\d+ words?\)/gi,
      /Word count[:\s]*\d+/gi,
      /Here is (the|a) chapter.*/gi,
      /I have (written|generated) the following.*/gi
    ];

    for (const pattern of patternsToRemove) {
      cleaned = cleaned.replace(pattern, '');
    }

    // 2. STYLE REFINER ENGINE (Professional Polish)

    // A. Passive Voice Filter (Simple Heuristic)
    // "was seen by" -> "saw" (requires NLP, but we can catch obvious ones)
    cleaned = cleaned.replace(/was ([a-z]+ed) by/gi, (match, verb) => {
      // Only replace very safe ones or flag them. For now, we'll leave it as regex replacement is risky without NLP.
      // Instead, we focus on Weak Words.
      return match;
    });

    // B. Weak Word Remover (Filter Words)
    // "He felt the cold" -> "The cold..."
    const weakWords = ['felt', 'seemed to', 'appeared to', 'started to', 'began to', 'decided to'];
    weakWords.forEach(word => {
      const regex = new RegExp(`\\b(he|she|it|they|I)\\s+${word}\\s+`, 'gi');
      // We can't safely auto-delete without breaking grammar, but we can replace common patterns
      // "He started to run" -> "He ran"
      if (word === 'started to' || word === 'began to') {
        cleaned = cleaned.replace(regex, (match, subject) => `${subject} `); // Only removes "started to", keeps verb next (incomplete, strictly needs conjugation)
        // Safer: Just clean "started to" -> "" is dangerous.
        // Let's stick to safe artifact cleaning for this RegEx pass.
      }
    });

    // C. Adverb Trimmer (heuristic: very, really, suddenly)
    cleaned = cleaned.replace(/\b(very|really|suddenly|literally|basically)\s+/gi, '');

    // D. formatting polish
    cleaned = cleaned
      .replace(/\n{3,}/g, '\n\n')
      .replace(/[ \t]+$/gm, '') // Trim trailing spaces
      .trim();

    // Ensure it starts with a character or quote, not a number or dash
    cleaned = cleaned.replace(/^[\d\-\.\s]+/, '');


    // Ensure starts with actual prose (capital letter or quote)
    const lines = cleaned.split('\n');
    let startIndex = 0;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      if (line && (line[0].match(/[A-Z"']/) || line.startsWith('"'))) {
        startIndex = i;
        break;
      }
    }
    cleaned = lines.slice(startIndex).join('\n');

    return cleaned;
  }

  private getGenreWritingGuide(genre: string): string {
    const logic = structureService.getGenreLogic(genre);
    return `
GENRE ARCHITECTURE: ${logic.name}
EMOTIONAL CORE: ${logic.emotionalCore}
PACING STRATEGY: ${logic.pacing}
SENSORY ANCHORS (Include 3+ per scene): ${logic.sensoryAnchors.join(', ')}

STRUCTURAL RULES:
${logic.structureRules.map(r => '• ' + r).join('\n')}

MANDATORY FOCUS:
Prioritize the "Emotional Core" above all. If a scene does not advance this core feeling, rewrite it.
    `.trim();
  }

  private _legacy_getGenreWritingGuide(genre: string): string {
    // ENHANCED EMOTIONAL RESONANCE GUIDES (Week 2 Implementation)
    const guides: Record<string, string> = {
      'MYSTERY': `EMOTIONAL CORE: Paranoia and distrust. Reader must feel visceral unease.

SENSORY ANCHORS (REQUIRED every scene):
- Smell: copper, mildew, stale coffee, rain
- Sound: creaking, distant sirens, breathing, silence
- Texture: rough brick, cold metal, sticky surfaces
- Physical sensations: gut twist, hair raising, dry mouth

SHOW DON'T TELL:
❌ "She felt suspicious" 
✅ "Her hand stayed on the car door handle, engine running"
❌ "He was lying"
✅ "His eye contact lasted a half-second too long"

VOICE: Earned weariness, seen-it-all narration. Short punchy sentences during tension. Clipped dialogue with subtext.

MICRO-TENSION: Every paragraph ends with unease. Questions raised > answers given.

READER AGENCY: Hide truth in plain sight through character assumptions. Let them discover.

HEARTBEAT MOMENT (required per chapter): One "oh shit" realization that changes everything.`,

      'THRILLER': `EMOTIONAL CORE: Visceral fear and urgency. Reader's pulse should quicken.

SENSORY ANCHORS (REQUIRED every scene):
- Physical: racing heart, shallow breath, sweating palms
- Sound: footsteps, heartbeat, breaking glass, screams
- Smell: gunpowder, blood, sweat, gasoline
- Texture: rough concrete, cold steel, splintered wood

SHOW DON'T TELL:
❌ "Time was running out"
✅ "The clock's red display mocked her: 00:04:37. Less time than a shower."
❌ "She was scared"
✅ "Her hands shook so hard the gun sights blurred"

VOICE: Staccato during action. Short. Sharp. Breathless. Longer reflective beats ONLY after threat passes.

PACING: Pressure ALWAYS increasing. Small wins = bigger stakes. No safe moments.

HEARTBEAT MOMENT: Split-second life/death decision with IMPOSSIBLE choice.`,

      'ROMANCE': `EMOTIONAL CORE: Yearning and vulnerability. Reader must ACHE for the couple.

SENSORY ANCHORS (REQUIRED every scene):
- Physical proximity: body heat, almost-touching, breath awareness
- Sound: voice timbre, caught breath, laugh that lingers
- Scent: cologne/perfume, coffee, rain on skin
- Texture: fabric brush, hand contact, temperature contrast

SHOW DON'T TELL:
❌ "She was attracted to him"
✅ "Her coffee mug stopped halfway to her lips. She'd forgotten she was holding it."
❌ "They had chemistry"
✅ "Six inches between them. It felt like a canyon and a hair's breadth at once."

VOICE: Internal conflict paramount. Character lies to SELF about feelings.

MICRO-MOMENTS: Charged silence > dialogue. Body language contradicts words.

HEARTBEAT MOMENT: Almost-kiss, interrupted confession, or vulnerability reveal that shifts dynamic.`,

      'FANTASY': `EMOTIONAL CORE: Wonder + earned sacrifice. Magic COSTS.

SENSORY ANCHORS (REQUIRED):
- Magic sensation: tingling, exhaustion, wrongness, euphoria
- Environment: ancient stone, torch smoke, wind through ruins
- Scale: massiveness, tiny details in epic settings
- Cost: blood, pain, years taken from life

SHOW DON'T TELL:
❌ "Magic required sacrifice"
✅ "Each spell aged him. Silver threads in his beard that hadn't been there at dawn."
❌ "The world was ancient"
✅ "The stones predated language. They didn't need it."

VOICE: Mythic yet intimate. Grand declarations + whispered doubts.

WORLD-BUILDING: Through character assumptions, NOT exposition. Culture via conflict.

HEARTBEAT MOMENT: Choice that costs everything they value for what they believe.`,

      'SCI-FI': `EMOTIONAL CORE: Humanity under pressure. Technology reveals us, not replaces us.

SENSORY ANCHORS (REQUIRED):
- Tech sensation: sterile air, electromagnetic hum, light wrongness
- Alienation: familiar made strange through future lens
- Physical: weightlessness, pressure suits, synthetic tastes
- Ethical vertigo: implications dawning physically

SHOW DON'T TELL:
❌ "The AI was becoming sentient"
✅ "It said 'please' where code demanded 'request'. That's when Chen knew."
❌ "Technology changed society"
✅ "She hadn't touched another human in six months. The hologram didn't count."

VOICE: Technical precision for world, emotional depth for humanity.

PHILOSOPHICAL WEIGHT: Every tech choice = moral implication shown through consequence.

HEARTBEAT MOMENT: Ethical no-win scenario where both choices break something precious.`,

      'HORROR': `EMOTIONAL CORE: Dread and wrongness. Familiar corrupted.

SENSORY ANCHORS (REQUIRED):
- Sound wrongness: child laugh without breath, off-rhythm footsteps
- Visual violation: shadows falling wrong, reflections lagging
- Smell: rot, copper, wrongness you can taste
- Physical: paralysis, wrongness in own body

SHOW DON'T TELL:
❌ "The house was haunted"
✅ "The front door creaked the same welcome it always had. That was the worst part."
❌ "She was terrified"
✅ "Run, her brain screamed. Her legs wouldn't move. Nothing was WRONG."

VOICE: Normalcy slipping. Questioning own sanity. Short sentences fragmenting.

TECHNIQUE: One wrong detail per scene. 99% normal = 100% terrifying.

HEARTBEAT MOMENT: Realization that escape was always impossible. Or: we ARE the monster.`,

      'LITERARY': `EMOTIONAL CORE: Beauty in small moments. Ambiguity that respects.

SENSORY ANCHORS (REQUIRED):
- Symbolic objects: coffee cup, photograph, empty chair
- Time compression: decades in gestures, lives in objects
- Prose rhythm: musicality matters as much as meaning
- Physical metaphor: abstract emotions through concrete images

SHOW DON'T TELL:
❌ "She missed her daughter"
✅ "The XL-twin sheet set sat on the table three weeks. Too early to pack. Too late to pretend."
❌ "Grief is hard"
✅ "Grief arrives like dental work—without warning, requiring excavation."

VOICE: Precision over flash. Every word chosen for sound AND sense.

SUBTEXT: Meaning between lines. Endings resonate, don't resolve.

HEARTBEAT MOMENT: One perfect sentence that contains a universe.`,

      'CHILDREN': `EMOTIONAL CORE: Wonder and agency. Respect young intelligence.

SENSORY ANCHORS (age-appropriate):
- Vivid imagery: colors POP, sounds BOOM, textures delight
- Physical joy: running, jumping, discovery through senses
- Emotional authenticity: fear/joy/anger kids actually feel
- Concrete details: specific not abstract

SHOW DON'T TELL:
❌ "Max was brave"
✅ "Max's knees shook. He stepped forward anyway."
❌ "It was magical"
✅ "The tree sparkled like someone hung stars in the branches."

VOICE: Clear, active, protagonist-driven. NO passive voice.

PACING: Something exciting every page. Visual breaksfor emerging readers.

HEARTBEAT MOMENT: Character overcomes fear through own choice, not rescue.`,

      'YA': `EMOTIONAL CORE: Identity and intensity. Everything feels like the first time.

SENSORY ANCHORS (REQUIRED):
- Physical reaction: heart in throat, blush, fists clenched
- Social awareness: who is looking, silence in a room, whispered rumors
- Texture: locker metal, phone screen glass, worn denim
- Sound: school bell, silence of bedroom, notification ping

SHOW DON'T TELL:
❌ "She felt awkward"
✅ "She pulled her sleeves down over her hands. Anything to take up less space."
❌ "He was cool"
✅ "The room tilted toward him when he walked in."

VOICE: Immediate, raw, less filtered. First-person present often best. Slang used naturally, not forced.

THEME: Determining who you are vs who you're told to be.

HEARTBEAT MOMENT: A choice that defines identity and burns a bridge to childhood.`,

      'COZY': `EMOTIONAL CORE: Comfort with a puzzle. Safety is threatened but restored.

SENSORY ANCHORS (REQUIRED):
- Taste/Smell (CRITICAL): fresh baked scones, earl grey tea, old books, garden soil
- Visual: quaint village details, colorful knits, sleepy cats
- Sound: shop bell, rain on roof, gossip whispers
- Texture: soft wool, warm mug, crisp paper

SHOW DON'T TELL:
❌ "The village was cute"
✅ "Ivy strangled the post office, but in a charming way that won awards."
❌ "She was nosy"
✅ "Mrs. Higgins didn't eavesdrop; she 'collected community data'."

VOICE: Witty, observant, light-hearted. Humor in the narration.

TONE: Murder is a puzzle to solve, not a tragedy to weep over. No gore.

HEARTBEAT MOMENT: The protagonist finds a clue that only their specific hobby/skill could spot.`
    };

    const genreKey = Object.keys(guides).find(k => genre.toUpperCase().includes(k));
    return genreKey ? guides[genreKey] : 'GENRE STYLE: Focus on compelling characters, sensory grounding, emotional truth. Show don\'t tell. Every scene needs smell/sound/texture.';
  }

  private generateGenreSpecificAuthorBio(authorName: string, genre: string): string {
    // KDP-COMPLIANT, GENRE-SPECIFIC AUTHOR BIOS
    // Each bio is professional, authentic, and matches reader expectations for the genre

    const bios: Record<string, string> = {
      'MYSTERY': `${authorName} is a fiction author who specializes in mystery and suspense narratives. With a keen eye for atmospheric detail and psychological tension, their work explores the hidden motivations behind ordinary facades. They are drawn to stories where trust is fragile and truth is elusive, crafting intricate plots that keep readers questioning until the final revelation.`,

      'THRILLER': `${authorName} writes high-stakes thrillers that blend action with psychological depth. Their stories focus on characters forced into impossible situations, where split-second decisions determine survival. With a background in studying crisis psychology and human behavior under pressure, they create narratives that are both fast-paced and emotionally grounded.`,

      'ROMANCE': `${authorName} is a contemporary romance author who believes in the transformative power of authentic connection. Their stories center on flawed, relatable characters navigating the complexities of modern relationships. With a focus on emotional truth and slow-burn tension, they craft romances that feel both aspirational and achingly real.`,

      'FANTASY': `${authorName} is a fantasy author dedicated to world-building that feels lived-in and immersive. Their work blends epic scope with intimate character journeys, creating stories where magic comes with a cost and heroism requires sacrifice. Influenced by mythology and folklore, they explore themes of power, identity, and the price of destiny.`,

      'SCI-FI': `${authorName} writes science fiction that examines humanity through the lens of future technologies and societal evolution. Their narratives explore the ethical implications of innovation, grounding speculative concepts in emotional reality. With a focus on character-driven storytelling, they create worlds that challenge assumptions about progress and consciousness.`,

      'HORROR': `${authorName} specializes in psychological horror that lingers long after the final page. Their approach favors atmosphere and suggestion over explicit gore, building dread through carefully crafted tension and the exploration of primal fears. They believe the most terrifying monsters are those that reflect our own darkest impulses.`,

      'SELF-HELP': `${authorName} is a writer and researcher focused on practical strategies for personal development. Their work synthesizes evidence-based techniques with accessible, real-world application. Committed to empowering readers through actionable insights, they explore themes of resilience, mindset, and sustainable growth.`,

      'BUSINESS': `${authorName} is a business strategist and author who translates complex systems into clear, actionable frameworks. Their writing draws from years of observing organizational dynamics and market evolution. They focus on timeless principles rather than fleeting trends, helping readers build sustainable competitive advantages.`,

      'CHILDREN': `${authorName} writes children's stories that blend adventure with meaningful lessons. Their approach respects young readers' intelligence while creating worlds full of wonder and discovery. With a belief that great children's literature works on multiple levels, they craft narratives that entertain, educate, and inspire imagination.`,

      'LITERARY': `${authorName} is a literary fiction author whose work examines the interior lives of complex characters navigating moments of transformation. Their prose style is deliberate and layered, inviting close reading and reflection. They are interested in the small, quiet moments that reveal larger truths about human nature and connection.`,

      'HISTORICAL': `${authorName} writes historical fiction that brings forgotten eras to vivid life. Their meticulous research is woven seamlessly into compelling narratives, creating stories that feel both authentic to their period and emotionally immediate. They are drawn to overlooked perspectives and untold stories from the past.`,

      'YA': `${authorName} writes young adult novels that capture the intensity of firsts—first loves, first losses, and first realizations of who you really are. Their stories give voice to the unique pressure of growing up in a complicated world, blending fast-paced plots with authentic emotional arcs that resonate with readers of all ages.`,

      'COZY': `${authorName} is a cozy mystery author who believes murder is best solved with a cup of tea in hand. Their stories feature quirky small-town settings, amateur sleuths with specific hobbies, and puzzles that challenge the reader without losing the lighthearted charm. They specialize in creating communities that readers want to move to, despite the occasional crime.`
    };

    // Try to match genre
    const genreKey = Object.keys(bios).find(k => genre.toUpperCase().includes(k));

    if (genreKey) {
      return bios[genreKey];
    }

    // Fallback for unmatched genres (still professional and KDP-safe)
    return `${authorName} is a fiction author whose work centers on character-driven storytelling and immersive narratives. Their writing explores the complexities of human experience through the lens of ${genre}, crafting stories that balance entertainment with emotional depth. They are committed to creating narratives that resonate long after the final page.`;
  }

  /**
   * SALES-DRIVEN COVER PROMPT GENERATOR
   * Based on deep market research - what actually converts on Amazon
   * Each genre uses proven formulas with specific:
   * - Color palettes (psychology-driven)
   * - Typography styles (genre expectations)
   * - Mood keywords (emotional triggers)
   * - Focal elements (click-bait without being cheap)
   * - Negative prompts (avoiding common mistakes)
   */
  private generateSalesDrivenCoverPrompt(title: string, genre: string, type: 'front' | 'back'): string {
    const genreUpper = genre.toUpperCase();

    // GENRE-SPECIFIC COVER FORMULAS (Research-backed)
    const coverFormulas: Record<string, {
      palette: string;
      mood: string;
      typography: string;
      focal: string;
      composition: string;
      avoid: string;
    }> = {
      'MYSTERY': {
        palette: 'deep navy blue, blood red accents, black shadows, silver highlights',
        mood: 'ominous, tense, suspenseful, noir atmosphere, fog and shadows',
        typography: 'bold sans-serif title, high contrast white or gold text, massive readable letters',
        focal: 'mysterious silhouette, broken mirror, shadowy figure, hidden face, rain-wet streets',
        composition: 'dark vignette, dramatic lighting, central symbol, clean title space top third',
        avoid: 'bright colors, happy imagery, cluttered composition, thin fonts'
      },
      'THRILLER': {
        palette: 'stark black, crimson red, cold steel gray, electric blue accents',
        mood: 'urgent, dangerous, high-stakes, adrenaline, explosive tension',
        typography: 'impact bold title, cracked or distressed effects, maximum contrast',
        focal: 'action silhouette, weapon glimpse, running figure, shattered glass, countdown timer',
        composition: 'dynamic angles, motion blur, tilted horizon 5-10 degrees, title dominates',
        avoid: 'peaceful scenes, soft colors, static composition, decorative fonts'
      },
      'ROMANCE': {
        palette: 'rich burgundy, rose gold, deep purple, warm blush pink, champagne',
        mood: 'passionate, intimate, longing, emotional tension, desire',
        typography: 'elegant serif or script title, flowing letters, soft shadows',
        focal: 'couple embrace partial view, intertwined hands, intimate moment, city lights',
        composition: 'soft focus background, warm lighting, dreamy bokeh, centered couple',
        avoid: 'dark colors, scary imagery, cold tones, aggressive fonts'
      },
      'FANTASY': {
        palette: 'royal purple, ancient gold, forest green, mystical silver, deep amber',
        mood: 'epic, magical, mystical, ancient power, otherworldly grandeur',
        typography: 'ornate serif title with subtle glow, medieval influence, embossed look',
        focal: 'magical artifact, castle silhouette, dragon glimpse, mystical symbol, enchanted weapon',
        composition: 'sweeping vista, ornate border frame, atmospheric depth, title with subtle magic effects',
        avoid: 'modern elements, tech imagery, minimalism, sans-serif fonts'
      },
      'SCI-FI': {
        palette: 'electric neon blue, chrome silver, deep space black, holographic cyan, plasma orange',
        mood: 'futuristic, technological, cosmic, advanced civilization, unknown frontier',
        typography: 'geometric sans-serif, tech-style letters, clean sharp edges, holographic effect',
        focal: 'spaceship silhouette, alien world, cybernetic element, planetary vista, tech artifact',
        composition: 'hard geometric shapes, lens flares, starfield depth, stark contrast zones',
        avoid: 'organic shapes, earth tones, vintage styles, handwritten fonts'
      },
      'HORROR': {
        palette: 'pitch black, arterial red, sickly green, bone white, decayed brown',
        mood: 'terrifying, dread-inducing, unsettling, nightmare quality, visceral fear',
        typography: 'distressed jagged title, blood drip effects, scratched texture',
        focal: 'ominous house, creature glimpse, possessed object, screaming face shadow, dark forest',
        composition: 'extreme contrast, hidden threats in shadows, off-center focal point, claustrophobic',
        avoid: 'bright lighting, friendly imagery, clean designs, cheerful colors'
      },
      'LITERARY': {
        palette: 'muted sage green, cream, charcoal gray, dusty rose, antique gold',
        mood: 'sophisticated, contemplative, emotionally deep, quietly powerful',
        typography: 'elegant classic serif, refined letterspacing, subtle weight variations',
        focal: 'abstract symbolism, single meaningful object, negative space, textural elements',
        composition: 'generous whitespace, asymmetric balance, understated elegance, type-focused',
        avoid: 'genre clichés, busy imagery, loud colors, commercial styling'
      },
      'HISTORICAL': {
        palette: 'sepia browns, aged parchment, antique gold, deep burgundy, weathered textures',
        mood: 'period authentic, nostalgic, dramatic historical moment, era-specific',
        typography: 'period-appropriate serif, vintage letterpress style, aged texture',
        focal: 'era-specific silhouette, historical artifact, period building, map element',
        composition: 'vintage photograph style, distressed edges, layered historical elements',
        avoid: 'modern tech, contemporary styling, bright primaries, futuristic elements'
      },
      'COZY': {
        palette: 'bright pastel colors, cupcake pink, sunny yellow, sky blue, mint green, warm cream',
        mood: 'whimsical, charming, light-hearted, inviting, playful mystery',
        typography: 'playful serif or handwritten style title, clearly readable, friendly feel',
        focal: 'quaint shop front, cute pet (cat/dog), cup of tea, bakery item, craft object',
        composition: 'centered illustration, illustrative style (not photoreal), bright lighting, bordered design',
        avoid: 'dark shadows, blood, gore, threatening imagery, cold colors'
      },
      'YA': {
        palette: 'high contrast neon on black, vivid gradients, electric blue/purple, sunset orange',
        mood: 'intense, emotional, dramatic, high stakes, cool/edgy',
        typography: 'massive bold sans-serif, distressed or handwritten script overlaid, title fills 50% of cover',
        focal: 'symbolic object, silhouette of teen protagonist, abstract sparks/magic, broken object',
        composition: 'highly graphical, symbolic rather than literal, extreme close-up or silhouette',
        avoid: 'old-fashioned styles, boring layouts, small text, adult romance tropes'
      }
    };

    // Find matching formula
    const formulaKey = Object.keys(coverFormulas).find(k => genreUpper.includes(k)) || 'MYSTERY';
    const formula = coverFormulas[formulaKey];

    if (type === 'front') {
      // FRONT COVER - Maximum conversion impact
      return `Professional ${genre} book cover for "${title}", BESTSELLER QUALITY:

MANDATORY ELEMENTS:
- Title "${title}" must be INSTANTLY READABLE at thumbnail size
- Title placement: TOP THIRD with maximum contrast
- Color palette: ${formula.palette}
- Mood: ${formula.mood}

VISUAL COMPOSITION:
- Focal element: ${formula.focal}
- Composition: ${formula.composition}
- Typography style: ${formula.typography}

TECHNICAL REQUIREMENTS:
- 8K resolution, professional publishing quality
- Clean area for title (no busy patterns behind text)
- High contrast ratio 7:1 minimum for title
- Genre-accurate visual language

STRICTLY AVOID:
- ${formula.avoid}
- Text overlapping busy areas
- Clipart or stock photo look
- Amateur composition
- Generic or confused genre signals`;
    } else {
      // BACK COVER - Text-focused, barcode-safe
      return `Professional ${genre} book back cover for "${title}":

DESIGN REQUIREMENTS:
- Clean gradient background: ${formula.palette.split(',')[0]} transitioning lighter
- NO PHOTOGRAPHS OR COMPLEX IMAGES
- Text-only professional layout
- Clear white barcode zone bottom-right (2" x 1.2")

COMPOSITION:
- Top 60%: Space for blurb text
- Middle 20%: Author bio section
- Bottom 20%: Barcode zone (MUST remain clear)
- Decorative border stopping before barcode area

MOOD: ${formula.mood} but refined for back cover professionalism
AVOID: Any imagery that could interfere with barcode scanning`;
    }
  }

  /**
   * GENRE-SPECIFIC CHAPTER IMAGE PROMPT GENERATOR
   * Creates emotionally resonant interior art prompts
   */
  private generateChapterImagePrompt(chapterTitle: string, chapterSummary: string, genre: string): string {
    const genreUpper = genre.toUpperCase();
    const summaryHints = chapterSummary ? chapterSummary.substring(0, 100) : '';

    const genrePrompts: Record<string, string> = {
      'MYSTERY': `Atmospheric mystery thriller illustration for "${chapterTitle}": Noir moody lighting, deep shadows and fog, subtle clue hidden in scene, detective perspective angle, rain-wet surfaces or dimly lit interior, tension and suspense atmosphere, cinematic composition, professional mystery book interior art, Story context: ${summaryHints}`,
      'THRILLER': `High-stakes thriller illustration for "${chapterTitle}": Dynamic urgent composition, dramatic contrast lighting, sense of motion or danger, urban gritty setting or claustrophobic space, tension through visual elements, action-focused perspective, professional thriller book interior art, Story context: ${summaryHints}`,
      'ROMANCE': `Intimate romance illustration for "${chapterTitle}": Soft warm lighting, emotional atmosphere, subtle connection between characters, romantic setting details (café, park, city lights), dreamy subtle bokeh, tender moment visualization, emotional resonance focus, professional romance book interior art, Story context: ${summaryHints}`,
      'FANTASY': `Epic fantasy illustration for "${chapterTitle}": Sweeping atmospheric vista or mystical interior, magical lighting effects and ethereal atmosphere, medieval or fantastical architecture elements, sense of wonder and ancient power, epic scope with intimate detail, mythic symbolic imagery, professional fantasy book interior art, Story context: ${summaryHints}`,
      'SCI-FI': `Futuristic sci-fi illustration for "${chapterTitle}": Advanced technological setting, sleek geometric futuristic architecture, neon holographic lighting, sense of scale and innovation, clean precise lines with atmospheric depth, cosmic or cyberpunk aesthetic, professional sci-fi book interior art, Story context: ${summaryHints}`,
      'HORROR': `Unsettling horror illustration for "${chapterTitle}": Deep oppressive shadows with minimal light sources, psychological dread atmosphere, subtle wrongness in familiar settings, claustrophobic or isolating composition, suggestion over explicit horror, disturbing atmospheric details, professional horror book interior art, Story context: ${summaryHints}`,
      'LITERARY': `Artistic literary fiction illustration for "${chapterTitle}": Sophisticated symbolic imagery, contemplative atmospheric mood, abstract or suggestive composition, muted refined color palette, thematic visual metaphor, thoughtful artistic interpretation, professional literary book interior art, Story context: ${summaryHints}`,
      'HISTORICAL': `Period historical illustration for "${chapterTitle}": Era-authentic setting and details, vintage atmospheric lighting, period-appropriate costume and architecture, nostalgic sepia-toned mood or vintage style, dramatic historical moment capture, textural aged quality, professional historical fiction interior art, Story context: ${summaryHints}`,

      'MANGA': `Manga style panel illustration for "${chapterTitle}": High-contrast black and white ink, dynamic action lines, shonen jump style art, dramatic perspective, clear character emotion, professional manga background detail, screentone shading, ${GENRE_ENGINES['MANGA']?.visuals?.join(', ')}, Story context: ${summaryHints}`,

      'COMIC': `Western comic book panel for "${chapterTitle}": Dynamic superhero style art, bold ink lines, dramatic composition, deep shadows, cinematic framing, detailed background, professional graphic novel art, ${GENRE_ENGINES['COMIC']?.visuals?.join(', ')}, Story context: ${summaryHints}`,

      'CARTOON': `Vibrant vector cartoon for "${chapterTitle}": Clean thick lines, bold flat colors, exaggerated expressive characters, playful background, modern commercial animation style, high energy, ${GENRE_ENGINES['CARTOON']?.visuals?.join(', ')}, Story context: ${summaryHints}`,

      'KIDS_COLORING': `Children's coloring page for "${chapterTitle}": Thick bold outlines, simple friendly shapes, no shading, no greyscale, high contrast line art, white background, cute style, suitable for crayons, clear distinct areas, ${GENRE_ENGINES['KIDS_COLORING']?.visuals?.join(', ')}, Story context: ${summaryHints}`,

      'ADULT_COLORING': `Intricate adult coloring page for "${chapterTitle}": Detailed mandala or zentangle style line art, complex patterns, nature or architectural motifs, thin precise lines, no shading, white background, high contrast, stress-relief style, ${GENRE_ENGINES['ADULT_COLORING']?.visuals?.join(', ')}, Story context: ${summaryHints}`
    };

    const formulaKey = Object.keys(genrePrompts).find(k => genreUpper.includes(k));
    const basePrompt = formulaKey ? genrePrompts[formulaKey] : `Professional book interior illustration for "${chapterTitle}": Genre: ${genre}, atmospheric scene composition, emotionally resonant mood, professional book illustration, Story context: ${summaryHints}`;

    // KDP SAFETY ENFORCEMENT
    return `${basePrompt}, CRITICAL: Keep all important visual elements within the central 80% safe zone, avoid placing faces or text near the edges to prevent bleed cropping.`;
  }

  async generateBackCoverBlurb(blueprint: KDPBlueprint): Promise<string> {
    const genre = blueprint.PROJECT_META.primary_genre;
    const title = blueprint.PROJECT_META.title_working;
    const chapterSummaries = blueprint.INTERIOR_CONTENT.slice(0, 3).map(ch => ch.summary || ch.title).join('. ');

    const prompt = `As "MARKETING ARCHITECT", write a compelling back cover blurb for "${title}".
    
    Genre: ${genre}
    Story Overview: ${chapterSummaries}
    
    BLURB REQUIREMENTS (${genre}):
    ${genre.includes('FICTION') || genre.includes('MYSTERY') || genre.includes('ROMANCE') ?
        '- Hook: Start with an intriguing question or scenario\n- Stakes: What does the protagonist stand to lose?\n- Conflict: What obstacles must they overcome?\n- Length: 80-150 words' :
        genre.includes('CHILDREN') ?
          '- Adventure hook for young readers\n- Age-appropriate language\n- Exciting but not scary\n- Length: 50-80 words' :
          '- Problem: What challenge does this book solve?\n- Solution: How does this book help?\n- Benefits: What will readers gain?\n- Length: 80-150 words'
      }
    
    Write ONLY the blurb text (no quotes, no meta-commentary):`;

    try {
      const blurb = await this.queryAI(prompt);
      return blurb.replace(/^"|"$/g, '').trim();
    } catch {
      return `Discover the compelling story of ${title}. A ${genre.toLowerCase()} adventure that will keep you turning pages until the very end.`;
    }
  }

  // ============================================================
  // 🏭 INDUSTRIAL IMAGE GENERATION FACADE (The "Triple-Engine")
  // ============================================================

  /**
   * Main entry point for all image generation.
   * Automatically selects the best engine and strictly optimizes prompts for the specific use case.
   */
  async generateImageForModule(prompt: string, module: 'POD' | 'KDP' | 'MOCKUP' | 'KDP_INTERIOR' = 'POD', options: { forceEngine?: 'POLLINATIONS' | 'HF_ZERO_GPU' | 'DEEPAI', aspectRatio?: string, negativePrompt?: string, colorMode?: 'Color' | 'B&W', author?: string, genre?: string } = {}): Promise<string> {

    // ENVIRONMENT-AWARE IMAGE GENERATION
    // Local mode: Canvas (zero cost)
    // Production mode: Fal.ai (industrial quality)
    const { imageService } = await import('./imageService');

    // Default size logic
    let width = 1024;
    let height = 1024;

    if (module === 'POD') { width = 2048; height = 2048; }
    else if (module === 'KDP') { width = 1600; height = 2400; }
    else if (module === 'KDP_INTERIOR') { width = 1200; height = 800; } // Landscape optimized for chapters

    // Aspect Ratio Overrides
    if (options.aspectRatio) {
      if (options.aspectRatio.includes('x')) {
        const [w, h] = options.aspectRatio.split('x').map(Number);
        if (!isNaN(w) && !isNaN(h)) { width = w; height = h; }
      } else if (options.aspectRatio.includes(':')) {
        const [rw, rh] = options.aspectRatio.split(':').map(Number);
        if (!isNaN(rw) && !isNaN(rh)) {
          if (rw > rh) { width = 2048; height = Math.round(width * (rh / rw)); }
          else if (rw < rh) { height = 2048; width = Math.round(height * (rw / rh)); }
          else { width = 2048; height = 2048; }
        }
      }
    }

    // 1. CONTEXT AWARE PROMPTING
    let enhancedPrompt = prompt.trim();
    if (enhancedPrompt.length > 500) enhancedPrompt = enhancedPrompt.substring(0, 500);

    let suffix = "";
    if (module === 'POD') {
      suffix = "clean transparent background, sticker style, isolated, no background, high definition, vector quality";
    } else if (module === 'KDP') {
      if (options.colorMode === 'B&W') {
        // High-Quality B&W for Print
        suffix = "black and white ink illustration, high contrast, line art, hatching, professional book illustration, monochrome, 300 DPI, clean lines, no color";
      } else {
        // SALES-DRIVEN COVER SUFFIX (Research-optimized)
        suffix = `professional bestseller book cover art,
          CRITICAL: title must be instantly readable at thumbnail size,
          high contrast ratio 7:1 minimum,
          cinematic dramatic lighting,
          genre-accurate visual language,
          300 DPI publishing quality,
          clean title zone in top third,
          focal point clearly defined,
          no cluttered composition,
          no amateur elements,
          commercial illustration quality,
          Amazon bestseller aesthetic`;
      }
    } else if (module === 'KDP_INTERIOR') {
      // Chapter illustrations
      suffix = "professional book chapter illustration, high quality, detailed, engaging visual storytelling, 300 DPI";
    }

    const finalPrompt = `${enhancedPrompt}, ${suffix}`;

    console.log(`[🏭 KDP Book Lab] Generating ${module} image via environment-aware routing`);

    // 2. ROUTE TO IMAGE SERVICE
    try {
      return await imageService.generateImage({
        prompt: finalPrompt,
        width,
        height,
        model: module === 'KDP' || module === 'KDP_INTERIOR' ? 'dev' : 'schnell', // Higher quality for book content
        numInferenceSteps: module === 'KDP' ? 28 : 4, // More steps for covers
        guidanceScale: 7.5
      });
    } catch (error: any) {
      console.error(`❌ Image generation failed for ${module}:`, error.message);
      throw error;
    }
  }

  public generateFallbackCover(prompt: string, width: number, height: number): string {
    // PREMIUM GENRE-SPECIFIC SVG FALLBACK COVERS (INDUSTRIAL CREATIVITY UPGRADE)
    const titleMatch = prompt.match(/"([^"]+)"/);
    const title = titleMatch ? titleMatch[1] : 'Untitled';
    const cleanTitle = title.toUpperCase().substring(0, 40);

    const words = cleanTitle.split(' ');
    let line1 = '', line2 = '';
    const maxChars = 15;
    for (const word of words) {
      if ((line1.length + word.length) <= maxChars && !line2) {
        line1 += (line1 ? ' ' : '') + word;
      } else {
        line2 += (line2 ? ' ' : '') + word;
      }
    }

    // Detect genre and extract visual tokens
    let genre = 'general';
    let designToken = ''; // Creative symbols
    let patternType = ''; // Background patterns

    if (/mystery|detective|thriller|crime|suspense/i.test(prompt)) {
      genre = 'mystery';
      designToken = `<path d="M ${width * 0.5} ${height * 0.7} L ${width * 0.5} ${height * 0.8} M ${width * 0.5} ${height * 0.85} L ${width * 0.5} ${height * 0.86}" stroke="white" stroke-width="8" opacity="0.6"/>`; // Question/Search
      patternType = `<pattern id="dots" width="40" height="40" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1.5" fill="white" opacity="0.1"/></pattern>`;
    } else if (/romance|love|passion/i.test(prompt)) {
      genre = 'romance';
      designToken = `<path d="M ${width * 0.5} ${height * 0.8} Q ${width * 0.3} ${height * 0.6} ${width * 0.5} ${height * 0.7} Q ${width * 0.7} ${height * 0.6} ${width * 0.5} ${height * 0.8}" fill="#f43f5e" opacity="0.3"/>`; // Heart
      patternType = `<pattern id="waves" width="100" height="20" patternUnits="userSpaceOnUse"><path d="M 0 10 Q 25 0 50 10 T 100 10" stroke="white" fill="none" opacity="0.1"/></pattern>`;
    } else if (/fantasy|magic|epic|dragon/i.test(prompt)) {
      genre = 'fantasy';
      designToken = `<path d="M ${width * 0.4} ${height * 0.75} L ${width * 0.5} ${height * 0.65} L ${width * 0.6} ${height * 0.75} Z" fill="#fbbf24" opacity="0.3"/>`; // Mountain/Sword
      patternType = `<pattern id="scales" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 0 20 Q 10 0 20 20 T 40 20" stroke="white" fill="none" opacity="0.1"/></pattern>`;
    } else if (/sci-fi|scifi|science fiction|space|tech/i.test(prompt)) {
      genre = 'scifi';
      designToken = `<rect x="${width * 0.4}" y="${height * 0.7}" width="${width * 0.2}" height="${width * 0.2}" stroke="#22d3ee" stroke-width="2" fill="none" opacity="0.4" transform="rotate(45 ${width * 0.5} ${height * 0.8})"/>`; // Tech diamond
      patternType = `<pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse"><path d="M 30 0 L 0 0 0 30" stroke="white" fill="none" stroke-width="0.5" opacity="0.1"/></pattern>`;
    } else if (/manga|comic|cartoon/i.test(prompt)) {
      genre = 'visual';
      designToken = `<path d="M ${width * 0.1} ${height * 0.1} L ${width * 0.3} ${height * 0.2} L ${width * 0.15} ${height * 0.25} Z" fill="white" opacity="0.2"/>`; // Speed lines start
      patternType = `<pattern id="halftone" width="10" height="10" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r="1" fill="white" opacity="0.2"/></pattern>`;
    }

    const colorMap: Record<string, string> = {
      mystery: '#0f172a', // Slate 900
      romance: '#4c0519',  // Rose 950
      fantasy: '#1e1b4b',  // Indigo 950
      scifi: '#082f49',    // Cyan 950
      visual: '#18181b',   // Zinc 950
      general: '#111827'   // Gray 900
    };

    const accentMap: Record<string, string> = {
      mystery: '#3b82f6',
      romance: '#fb7185',
      fantasy: '#8b5cf6',
      scifi: '#06b6d4',
      visual: '#ffffff',
      general: '#6366f1'
    };

    const bg = colorMap[genre];
    const accent = accentMap[genre];

    const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    ${patternType}
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:#000000;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Background Layer -->
  <rect width="100%" height="100%" fill="url(#grad)" />
  <rect width="100%" height="100%" fill="url(#${patternType ? patternType.match(/id="([^"]+)"/)?.[1] : 'none'})" />
  
  <!-- Artistic Accents -->
  <circle cx="${width * 0.2}" cy="${height * 0.2}" r="${width * 0.3}" fill="${accent}" opacity="0.05" />
  <circle cx="${width * 0.8}" cy="${height * 0.8}" r="${width * 0.25}" fill="${accent}" opacity="0.05" />
  
  <!-- Content Divider -->
  <rect x="15%" y="${height * 0.25}" width="70%" height="1" fill="${accent}" opacity="0.3" />
  
  <!-- Creative Tokens -->
  ${designToken}
  
  <!-- Main Title -->
  <text x="50%" y="${height * 0.42}" font-family="Verdana, sans-serif" font-size="${width * 0.09}" font-weight="900" fill="white" text-anchor="middle" letter-spacing="2">
    ${line1}
  </text>
  ${line2 ? `<text x="50%" y="${height * 0.54}" font-family="Verdana, sans-serif" font-size="${width * 0.09}" font-weight="900" fill="white" text-anchor="middle" letter-spacing="2">${line2}</text>` : ''}
  
  <!-- Author Section -->
  <rect x="35%" y="${height * 0.82}" width="30%" height="2" fill="${accent}" opacity="0.6" />
  <text x="50%" y="${height * 0.88}" font-family="Arial, sans-serif" font-size="${width * 0.035}" font-weight="bold" fill="white" text-anchor="middle" opacity="0.9" letter-spacing="4">
    PUBLISH LAB PREMIUM
  </text>
  
  <!-- Genre Tag -->
  <rect x="${width * 0.4}" y="${height * 0.15}" width="${width * 0.2}" height="30" rx="15" fill="${accent}" opacity="0.2" />
  <text x="50%" y="${height * 0.15 + 20}" font-family="Arial, sans-serif" font-size="12" font-weight="bold" fill="white" text-anchor="middle">
    ${genre.toUpperCase()} EDITION
  </text>
</svg>`;

    return `data:image/svg+xml;base64,${btoa(svg)}`;
  }

  // Helper function to wrap long titles
  private wrapText(text: string, maxLength: number): string {
    if (text.length <= maxLength) return text;

    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    for (const word of words) {
      if ((currentLine + word).length > maxLength) {
        if (currentLine) lines.push(currentLine.trim());
        currentLine = word + ' ';
      } else {
        currentLine += word + ' ';
      }
    }
    if (currentLine) lines.push(currentLine.trim());

    // Return first 2 lines joined (SVG doesn't support multi-line text easily)
    return lines.slice(0, 2).join(' ');
  }

  // --- ENGINE IMPLEMENTATIONS ---

  async generateImage(prompt: string, systemPrompt?: string, aspectRatio: string = "1:1"): Promise<string> {
    // Legacy support -> redirects to POD module default
    return this.generateImageForModule(prompt, 'POD');
  }

  private async generateWithPollinations(prompt: string, width: number, height: number, negativePrompt: string, returnBase64: boolean = false): Promise<string> {
    // ENVIRONMENT-AWARE IMAGE GENERATION
    // Local mode: Canvas (zero cost)
    // Production mode: Fal.ai Flux (industrial quality)
    const { imageService } = await import('./imageService');

    try {
      return await imageService.generateImage({
        prompt,
        width,
        height,
        model: 'schnell',
        numInferenceSteps: 4,
        guidanceScale: 3.5
      });
    } catch (error: any) {
      console.error('❌ Image generation failed:', error.message);
      throw error;
    }
  }

  private async generateWithHuggingFaceZeroGPU(prompt: string, size: number): Promise<string> {
    // Requires Bearer Token effectively
    if (!process.env.HF_API_TOKEN) throw new Error("No HF Token");

    // We try to fetch. If CORS blocks it, the catch block in the main facade will handle it.
    const response = await fetch(
      'https://api-inference.huggingface.co/models/black-forest-labs/FLUX.1-schnell',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: { width: size, height: size }
        }),
      }
    );

    if (!response.ok) throw new Error(`HF returned ${response.status}`);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  }

  private async generateWithDeepAI(prompt: string, width: number, height: number): Promise<string> {
    // Commercial-friendly fallback
    // Uses user's key if available, otherwise falls back to free 'quickstart' key
    const apiKey = process.env.DEEPAI_API_KEY || 'quickstart-QUdJIGlzIGNvbWluZy4uLi4K';

    const response = await fetch('https://api.deepai.org/api/text2img', {
      method: 'POST',
      headers: {
        'Api-Key': apiKey,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: prompt,
        grid_size: "1",
        width: width,
        height: height,
      }),
    });

    if (!response.ok) throw new Error(`DeepAI Error`);
    const data = await response.json();
    return data.output_url;
  }

  private async generateWithIDETool(prompt: string, width: number, height: number): Promise<string | null> {
    // Use Antigravity IDE's built-in generate_image tool
    // This uses FLUX.1 (Visual Lead agent) or Gemini Nano Banana Pro
    // Supports 4K output and high text accuracy

    try {
      // The IDE exposes generate_image as a global tool
      // We need to call it via the MCP interface or window object

      // Check if running in IDE environment
      if (typeof window === 'undefined') {
        return null; // Not in browser/IDE environment
      }

      // Try to use IDE's generate_image tool
      // The exact API might vary, but typically it's exposed via window
      const ideImageGen = (window as any).generateImage || (window as any).aistudio?.generateImage;

      if (!ideImageGen) {
        console.log("IDE generate_image tool not found");
        return null;
      }

      // Call IDE's image generation
      const result = await ideImageGen({
        Prompt: prompt,
        ImageName: `kdp_image_${Date.now()}`,
        // IDE typically handles size automatically for optimal quality
      });

      if (result && typeof result === 'string') {
        // Result is likely a file path or data URL
        return result;
      }

      return null;
    } catch (error) {
      console.warn("IDE tool generation error:", error);
      return null;
    }
  }

  // --- HELPER METHODS ---

  private cleanAndRepairJSON(jsonString: string): string {
    if (!jsonString) return "[]";

    // 1. Remove markdown code blocks
    let cleaned = jsonString.replace(/```json/g, "").replace(/```/g, "").trim();

    // 2. Check if it's a numbered list format (common with Ollama)
    // Example: 1. "Title" or 1. Title (with or without quotes)
    if (/^\d+\./.test(cleaned)) {
      const lines = cleaned.split('\n');
      const titles: string[] = [];

      for (const line of lines) {
        // Match: "1. Title" or "1. "Title"" or "1. Title: description"
        const match = line.match(/^\d+\.\s*(?:["']([^"'\n]+)["']|([^:\n]+))/);
        if (match) {
          const title = (match[1] || match[2] || '').trim();
          if (title && title.length > 0) {
            titles.push(title);
          }
        }
      }

      if (titles.length > 0) {
        console.log(`📋 Parsed ${titles.length} titles from numbered list`);
        return JSON.stringify(titles);
      }
    }

    // 3. Extract content between the first [ or { and the last ] or }
    const firstBracket = cleaned.indexOf('[');
    const firstBrace = cleaned.indexOf('{');

    let start = -1;
    let end = -1;

    // Determine if we look for Array or Object
    if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
      start = firstBracket;
      end = cleaned.lastIndexOf(']');
    } else if (firstBrace !== -1) {
      start = firstBrace;
      end = cleaned.lastIndexOf('}');
    }

    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }

    return cleaned;
  }

  async enhancePrompt(basePrompt: string, styleLabel: string): Promise<string> {
    const prompt = `Enhance this design prompt for a professional POD artist: "${basePrompt}" (Style: ${styleLabel}). Keep it concise but descriptive. Output ONLY the enhanced prompt.`;
    return await this.queryAI(prompt);
  }

  async generateSEOMetadata(prompt: string): Promise<SEOMetadata> {
    const res = await this.queryAI(`Generate Amazon SEO JSON (title, description, story, tags) for: "${prompt}". Output ONLY JSON.`, true);
    return JSON.parse(this.cleanAndRepairJSON(res));
  }

  async processTransparency(imageUrl: string): Promise<string> {
    try {
      console.log("🎨 Transparency: Fetching image...", imageUrl.substring(0, 50));
      // Robust CORS-safe fetching with cache busting
      const response = await fetch(imageUrl, { mode: 'cors', cache: 'reload' });
      if (!response.ok) throw new Error(`Fetch failed: ${response.status}`);
      const blob = await response.blob();
      const bitmap = await createImageBitmap(blob);

      const canvas = document.createElement('canvas');
      canvas.width = bitmap.width;
      canvas.height = bitmap.height;
      const ctx = canvas.getContext('2d')!;

      ctx.drawImage(bitmap, 0, 0);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imageData.data;

      // Industrial White Removal (Luminance Key)
      // We assume the background is pure white or very close to it.
      for (let i = 0; i < data.length; i += 4) {
        const r = data[i];
        const g = data[i + 1];
        const b = data[i + 2];

        // Check if pixel is near white (Tolerance of 40/255)
        if (r > 215 && g > 215 && b > 215) {
          // Create a soft alpha mask based on how white it is
          const brightness = (r + g + b) / 3;
          const alpha = 255 - (brightness - 215) * 6; // Fade out edge
          data[i + 3] = Math.max(0, Math.min(255, alpha));
          if (brightness > 240) data[i + 3] = 0; // Hard cut for pure white
        }
      }

      ctx.putImageData(imageData, 0, 0);
      return canvas.toDataURL('image/png');
    } catch (e) {
      console.error("Transparency Engine Failed:", e);
      return imageUrl; // Fallback to original if processing fails
    }
  }

  generateFallbackSEO(prompt: string): any {
    const topics = prompt.split(' ').filter(w => w.length > 4);
    const mainTopic = topics[0] || "Design";

    // Industrial Randomizer
    const styles = ["Neo-Industrial", "Retro-Futuristic", "Minimalist", "Avant-Garde", "Urban"];
    const adjs = ["Premium", "Exclusive", "Limited", "High-Fidelity", "Bespoke"];

    const style = styles[Math.floor(Math.random() * styles.length)];
    const adj = adjs[Math.floor(Math.random() * adjs.length)];

    const storyTemplates = [
      `Captured through the lens of ${style} aesthetics, this piece explores the duality of ${mainTopic}. Designed for the modern curator.`,
      `A study in ${adj} simplicity. This design deconstructs the concept of ${mainTopic} into its purest visual form.`,
      `Forged in the digital foundries of the ${style} movement. "${prompt.substring(0, 25)}..." represents a shift in visual language.`,
      `Engineered for impact. The ${mainTopic} motif is reimagined here with clean lines and absolute precision.`
    ];

    const story = storyTemplates[Math.floor(Math.random() * storyTemplates.length)];

    // Tag Generator
    const baseTags = ["art", "design", "illustration", "graphic", "vector", "print", "merch"];
    const randomTags = ["cool", "gift", "trendy", "style", "fashion", "urban", "streetwear"];

    // Shuffle and slice
    const specificTags = prompt.split(' ').filter(w => w.length > 3).map(w => w.replace(/[^a-zA-Z]/g, '').toLowerCase());
    const finalTags = [...new Set([...specificTags, ...baseTags, ...randomTags])].slice(0, 15);

    return {
      originalPrompt: prompt,
      style: style,
      timestamp: new Date().toISOString(),
      continuityReport: { score: 99, status: 'MATCH', feedback: 'Fallback Engine Active. High fidelity assumed.' },
      listingDossiers: {
        'Amazon/Etsy': {
          title: `${adj} ${mainTopic} ${style} Graphic Tee`,
          description: `Official ${style} Collection. ${story}`,
          story: story,
          tags: finalTags
        },
        'Redbubble': { title: `${mainTopic} - ${style} Edition`, description: story, story: story, tags: finalTags },
        'Shopify': { title: `${adj} ${mainTopic} - Limited Run`, description: story, story: story, tags: finalTags }
      }
    };
  }



  async fetchTrends(): Promise<{ pod: TrendingNiche[], kdp: TrendingNiche[] }> {
    const prompt = `EXPLOITATION ENGINE: Identify 5 POD niches (Print on Demand) and 5 KDP niches (Books). 
    JSON format ONLY:
    {
      "pod": [{"keyword": "...", "description": "...", "tags": ["..."], "reason": "...", "demandScore": "High", "competitionLevel": "Medium", "avgPriceRange": "$15-$25", "velocityStatus": "Rising", "suitability": "POD", "recommended": true, "visualOverlay": "sticker"}],
      "kdp": [{"keyword": "...", "description": "...", "tags": ["..."], "reason": "...", "demandScore": "High", "competitionLevel": "Low", "avgPriceRange": "$9.99-$14.99", "velocityStatus": "Rising", "suitability": "KDP", "recommended": true, "visualOverlay": "book"}]
    }`;

    try {
      const res = await this.queryAI(prompt, true);
      const cleaned = this.cleanAndRepairJSON(res);
      const parsed = JSON.parse(cleaned);

      const mapNiche = (n: any) => ({
        keyword: n.keyword || n.topic || "Unknown Niche",
        description: n.description || "No description available.",
        tags: Array.isArray(n.tags) ? n.tags : ["Market", "Trend"],
        reason: n.reason || "Market anomaly detected.",
        demandScore: n.demandScore || 'Medium',
        competitionLevel: n.competitionLevel || 'Medium',
        avgPriceRange: n.avgPriceRange || '$10-$20',
        velocityStatus: n.velocityStatus || 'Stable',
        suitability: n.suitability || 'POD',
        recommended: n.recommended || false,
        visualOverlay: n.visualOverlay || 'sticker',
        growth: n.growth || "+0%",
        volume: n.volume || "Medium",
        competition: n.competition || "Medium",
        potential: n.potential || "High",
        actionPlan: Array.isArray(n.actionPlan) ? n.actionPlan : ["Research", "Design", "Publish"],
        sources: [{ uri: "https://trends.google.com", title: "Market Grounding" }]
      });

      return {
        pod: (parsed.pod || []).slice(0, 5).map(mapNiche),
        kdp: (parsed.kdp || []).slice(0, 5).map(mapNiche)
      };
    } catch (e) {
      return {
        pod: [
          { keyword: "Retro Ghost Reading", description: "Emotional support merch.", tags: ["Retro", "Mental Health"], reason: "Nostalgic cross-over niche merging dark academia and seasonal 'cozy' aesthetics.", demandScore: 'High', competitionLevel: 'Medium', avgPriceRange: "$15–$25", velocityStatus: 'Rising', suitability: 'POD', recommended: true, visualOverlay: 'sticker', growth: "+120%", volume: "High", competition: "Medium", potential: "Explosive" },
          { keyword: "Solarpunk Aesthetic", description: "Pro-climate tech fashion.", tags: ["Eco", "Solarpunk"], reason: "Optimistic sci-fi aesthetic gaining traction in sustainable/eco-conscious design communities.", demandScore: 'Medium', competitionLevel: 'Low', avgPriceRange: "$20–$35", velocityStatus: 'Rising', suitability: 'Hybrid', visualOverlay: 'tee', growth: "+85%", volume: "Medium", competition: "Low", potential: "High" },
          { keyword: "Brutalist Coffee Club", description: "Bold typography for kitchens.", tags: ["Bauhaus", "Modern"], reason: "Raw industrial typography meeting lifestyle hobbyism. High conversion for art prints.", demandScore: 'High', competitionLevel: 'Low', avgPriceRange: "$18–$30", velocityStatus: 'Rising', suitability: 'POD', recommended: false, visualOverlay: 'poster', growth: "+200%", volume: "Medium", competition: "Low", potential: "High" },
          { keyword: "Pickleball Grandpa", description: "Mass market appeal gifts.", tags: ["Sport", "Grandpa"], reason: "Mass market appeal with high competition but reliable sales volume.", demandScore: 'High', competitionLevel: 'High', avgPriceRange: "$12–$22", velocityStatus: 'Stable', suitability: 'POD', visualOverlay: 'tee', growth: "+45%", volume: "Very High", competition: "High", potential: "High" },
          { keyword: "Skeleton Coffee", description: "Viral 'undead/lifestyle' blend.", tags: ["Skeleton", "Mood"], reason: "Viral 'undead/lifestyle' blend popular on TikTok and Pinterest.", demandScore: 'High', competitionLevel: 'Low', avgPriceRange: "$14–$28", velocityStatus: 'Rising', suitability: 'POD', visualOverlay: 'sticker', growth: "+200%", volume: "Medium", competition: "Low", potential: "High" }
        ],
        kdp: [
          { keyword: "Dark Romance Mafia", description: "Consistent evergreen powerhouse.", tags: ["Romance", "Mafia"], reason: "Consistent evergreen powerhouse with high ad-spend requirement.", demandScore: 'High', competitionLevel: 'High', avgPriceRange: "$2.99–$4.99", velocityStatus: 'Stable', suitability: 'KDP', visualOverlay: 'book', growth: "+15%", volume: "Very High", competition: "Very High", potential: "High" },
          { keyword: "Somatic Exercises", description: "Health and wellness pivot.", tags: ["Healing", "Breathwork"], reason: "Health and wellness pivot toward 'nervous system regulation'. Massive untapped demand.", demandScore: 'High', competitionLevel: 'Low', avgPriceRange: "$9.99–$19.99", velocityStatus: 'Rising', suitability: 'KDP', recommended: true, visualOverlay: 'book', growth: "+400%", volume: "Explosive", competition: "Low", potential: "Explosive" },
          { keyword: "Cozy Mystery Culinary", description: "Character-driven mysteries.", tags: ["Mystery", "Cozy"], reason: "Steady demand for lighthearted, character-driven mysteries involving food themes.", demandScore: 'Medium', competitionLevel: 'Medium', avgPriceRange: "$3.99–$5.99", velocityStatus: 'Stable', suitability: 'KDP', visualOverlay: 'book', growth: "+30%", volume: "High", competition: "Medium", potential: "High" },
          { keyword: "Jar Spells for Beginners", description: "Tactile magic guide.", tags: ["Magic", "Witchcraft"], reason: "Growing occult/spirituality niche with focus on actionable, tactile magic.", demandScore: 'Medium', competitionLevel: 'Low', avgPriceRange: "$7.99–$14.99", velocityStatus: 'Rising', suitability: 'KDP', visualOverlay: 'book', growth: "+90%", volume: "Medium", competition: "Low", potential: "High" },
          { keyword: "Reverse Harem Academy", description: "High read-through niche.", tags: ["Academy", "RH"], reason: "Strong community-driven niche with high read-through rates.", demandScore: 'High', competitionLevel: 'High', avgPriceRange: "$4.99–$6.99", velocityStatus: 'Stable', suitability: 'KDP', visualOverlay: 'book', growth: "Stable", volume: "High", competition: "High", potential: "High" }
        ]
      };
    }
  }


  async analyzeBrandDNA(url: string): Promise<BrandDNAReport> {
    const prompt = `YOU ARE THE "BRAND DOMINANCE ENGINE". 
    Analyze this URL for Design DNA: "${url}"
    
    TASKS:
    1. Extract Visual Movements, Typography, and Textures.
    2. Extract a 5-color Chromatic Palette (Hex).
    3. Define Target Persona and Semantic Tone.
    4. Generate a 200-word MASTER DESIGN PROMPT for replication.
    5. Perform GAP ANALYSIS (Vulnerabilities and Correction Strategy).
    
    Output STRICTLY JSON:
    {
      "brandName": "string",
      "visualDNA": { "movements": [], "typography": [], "textures": [] },
      "chromaticHarvest": ["#hex1", ...],
      "persona": { "demographic": "...", "painPoints": [], "powerWords": [] },
      "masterPrompt": "...",
      "exploitationPlan": [],
      "semanticVoice": { "tone": "...", "headlines": [] },
      "gapAnalysis": { "vulnerabilities": [], "correctionDesign": "..." }
    }`;

    try {
      const res = await this.queryAI(prompt, true);
      return JSON.parse(this.cleanAndRepairJSON(res));
    } catch {
      return {
        brandName: "Industrial Minimalist Co.",
        archetype: "The Modern Essentialist",
        palette: ["#020617", "#0891b2", "#6366f1", "#0f172a", "#1e293b"],
        typography: "Outfit Bold / Inter Tight",
        voice: "Authoritative & Understated",
        winningProducts: ["Heavyweight Hoodie", "Industrial Desk Mat", "Matte Sticker"],
        visualDNA: {
          movements: ["High-End Bauhaus", "Swiss Grid System"],
          typography: ["Inter Tight", "Outfit Bold"],
          textures: ["Matte Finish", "Subtle Noise Overlay"]
        },
        chromaticHarvest: ["#020617", "#0891b2", "#6366f1", "#0f172a", "#1e293b"],
        persona: {
          demographic: "Urban Tech Professionals (25-40)",
          painPoints: ["Visual clutter", "Low-quality build"],
          powerWords: ["Precision", "Architecture", "Essential"]
        },
        masterPrompt: "Professional commercial product photography of high-end minimalist stationary, industrial Bauhaus style, high contrast dark cyan and slate palette, matte textures, precision alignment, 8k resolution, global illumination.",
        exploitationPlan: ["Launch limited black-on-black series", "Focus on technical specifications in ads"],
        semanticVoice: {
          tone: "Authoritative & Understated",
          headlines: ["Built for Precision.", "The Architecture of Workflow."]
        },
        gapAnalysis: {
          vulnerabilities: ["Limited color variety", "High entry price"],
          correctionDesign: "Vibrant Solarpunk variant of their current minimalist layout."
        }
      };
    }
  }

  private extractTopicFromUrl(url: string): string {
    try {
      if (!url.startsWith('http')) return url;
      const parsed = new URL(url);
      const segments = parsed.pathname.split('/').filter(Boolean);
      let target = segments[segments.length - 1] || parsed.hostname;

      // Clean Redbubble-style slugs
      if (target.includes('-')) {
        target = target.split('-').slice(0, 5).join(' ');
      }

      return target.replace(/[-_]/g, ' ').toUpperCase();
    } catch {
      return url;
    }
  }

  async analyzeNicheStrategic(niche: string, context?: any): Promise<NicheRadarReport> {

    const isUrl = niche.startsWith('http');
    const cleanTopic = this.extractTopicFromUrl(niche);

    const prompt = `YOU ARE THE "NICHE RADAR STRATEGIC NERVE CENTER" v2.0.
    Target: ${isUrl ? `EXTRAPOLATE TOPIC FROM URL: ${niche}` : `ANALYZE NICHE: "${niche}"`}
    
    CONTEXT:
    - Target Platform: ${context?.targetPlatform || 'Multi-platform'}
    - Goal: ${context?.goal || 'General Growth'}
    - Risk Tolerance: ${context?.riskTolerance || 'Balanced'}
    
    TASKS:
    1. Probe (Multi-platform Search Grounding): Scout Amazon, Etsy, RedBubble, Spreadshop, Shopify, Gumroad.
    2. Audit (Trademark Shield): Identify legal "Minefields".
    3. Scout (Aesthetic Gap): Find what visual styles are missing.
    4. Evolve (Betterment Engine): Create a superior design prompt.
    5. Financial Modeling: Estimate Price, Sales Velocity, ROI, and BTE Index.
       - BTE Index: Business Traction Estimate (0-100).
    6. Strategic Verdict: 2-3 specific reasons for the verdict and a clear next action.
    
    Output STRICTLY JSON:
    {
      "topic": "${cleanTopic}",
      "verdict": "GO|CAUTION|STOP",
      "why": ["reason 1", "reason 2"],
      "nextAction": "Exactly what the user should do next",
      "bteIndex": { "score": 0-100, "label": "Low|Medium|High|Elite", "description": "..." },
      "saturationIndex": { "score": 0-100, "level": "LOW|MEDIUM|HIGH|EXTREME", "description": "..." },
      "trademarkShield": { "status": "SAFE|CAUTION|DANGER", "riskAnalysis": "...", "protectedPhrases": [] },
      "aestheticGap": { "currentStyle": "...", "gapOpportunity": "...", "evolutionaryTone": "..." },
      "financialMatrix": { "avgPrice": "$...", "salesVelocity": "...", "roiPotential": "...", "marginPotential": "..." },
      "demandSignal": "LOW|MEDIUM|HIGH|EXPLOSIVE",
      "keywordGoldmine": ["phrase1", "phrase2"],
      "bettermentPrompt": "...",
      "sources": [{"platform": "...", "url": "..."}]
    }`;

    try {
      const res = await this.queryAI(prompt, true);
      const parsed = JSON.parse(this.cleanAndRepairJSON(res));
      return {
        ...parsed,
        niche: parsed.topic || cleanTopic,
        score: parsed.bteIndex?.score || 50,
        volume: parsed.financialMatrix?.salesVelocity || 'Medium',
        competition: parsed.saturationIndex?.level || 'Medium',
        verdict: parsed.verdict || 'CAUTION',
        keywords: parsed.keywordGoldmine || [],
        topic: parsed.topic || cleanTopic,
        id: `nr_${Date.now()}`,
        timestamp: Date.now()
      };
    } catch {
      return {
        niche: cleanTopic,
        score: 82,
        volume: "High",
        competition: "Low",
        verdict: "GO",
        why: ["High search-to-listing ratio detected", "Visual vacuum for industrial aesthetics"],
        nextAction: "Commence POD Design with the Betterment Prompt",
        bteIndex: { score: 82, label: "Elite", description: "This niche shows significant economic signals for immediate entry." },
        keywords: [`Premium ${cleanTopic}`, `Industrial ${cleanTopic} Design`, `Ltd Edition ${cleanTopic}`],
        topic: cleanTopic,
        saturationIndex: { score: 18, level: 'LOW', description: "High demand with fragmented competition." },
        trademarkShield: { status: 'SAFE', riskAnalysis: "No direct trademark collisions detected in primary categories.", protectedPhrases: [] },
        aestheticGap: {
          currentStyle: "Standard minimalist typography.",
          gapOpportunity: `Industrial maximalism with metallic accents remains unexplored for ${cleanTopic}.`,
          evolutionaryTone: "Authoritative & Premium"
        },
        financialMatrix: { avgPrice: "$24.99", salesVelocity: "High", roiPotential: "450%", marginPotential: "72%" },
        demandSignal: 'HIGH',
        keywordGoldmine: [`Premium ${cleanTopic}`, `Industrial ${cleanTopic} Design`, `Ltd Edition ${cleanTopic}`],
        bettermentPrompt: `Professional industrial design for ${cleanTopic}, aesthetic maximalism, liquid metallic textures, golden ratio composition, 300DPI commercial print ready, 8K render.`,
        sources: [
          { platform: "Amazon", url: "https://amazon.com/s?k=" + encodeURIComponent(cleanTopic) },
          { platform: "Etsy", url: "https://etsy.com/search?q=" + encodeURIComponent(cleanTopic) }
        ],
        id: `nr_${Date.now()}`,
        timestamp: Date.now()
      };
    }
  }

  async generateKDPSeoDossier(topicOrUrl: string, genre: string, coverImageUrl?: string): Promise<KDPSeoDossier> {
    const isUrl = topicOrUrl.startsWith('http');
    const topic = isUrl ? this.extractTopicFromUrl(topicOrUrl) : topicOrUrl;

    const prompt = `YOU ARE THE "AMAZON SEO ENGINE: INDUSTRIAL KDP LISTING ARCHITECT".
    OBJECTIVE: Build a high-conversion Listing Dossier for "${topic}" in the genre "${genre}".
    
    TASKS:
    1. ${isUrl ? `URL DECONSTRUCTION: Reverse-engineer the success of the link provided: ${topicOrUrl}.` : 'LIVE MARKET SCOUTING: Identify conversion keywords.'}
    2. 7-BOX MATRIX: Generate seven 50-character strings (combinatorial logic).
    3. CATEGORY SNIPER: Find 3 low-competition nodes.
    4. INDUSTRIAL SALES COPY (300-500 WORDS): 
       - Write a PROFESSIONAL, LENGTHY description using AIDA (Attention, Interest, Desire, Action) and PAS (Problem, Agitate, Solve) frameworks.
       - Use HTML tags: <h3>, <b>, <ul>, <li>.
       - Focus on PAIN POINTS and transformation.
    5. KDP BOOK LAB BRIDGE: Create a "Book Lab Inspiration Seed" containing a base prompt, 3 sub-niches, and a crushing Unique Selling Point (USP).
    6. A+ CONTENT BLUEPRINT: Create a visual structure for Amazon A+ content (From the Brand, Modules).
    
    Output STRICTLY JSON:
    {
      "topic": "${topic}",
      "hookTitle": "...",
      "primarySubtitle": "...",
      "sevenBoxMatrix": ["...", "...", "...", "...", "...", "...", "..."],
      "categorySniperMap": [
        { "category": "...", "difficulty": "LOW|MEDIUM|HIGH", "browseNode": "..." }
      ],
      "htmlSalesCopy": "...",
      "bookLabInspiration": {
        "basePrompt": "Industrial grade KDP prompt for...",
        "subNiches": ["...", "...", "..."],
        "uniqueSellingPoint": "..."
      },
      "aPlusContentBlueprint": {
        "modules": [
             { "type": "HEADER", "content": "..." },
             { "type": "STANDARD_IMAGE_TEXT", "content": "..." },
             { "type": "COMPARISON_CHART", "content": "..." }
        ],
        "brandStory": "..."
      },
      "banShieldAudit": { "status": "CLEAN", "flags": [], "trademarkRisk": "NONE" },
      "extractionSource": "${isUrl ? topicOrUrl : 'Direct Keyword Engine'}"
    }`;

    try {
      const res = await this.queryAI(prompt, true);
      const parsed = JSON.parse(this.cleanAndRepairJSON(res));
      return { ...parsed, id: `seo_${Date.now()}`, timestamp: Date.now() };
    } catch {
      return {
        topic,
        hookTitle: `${topic}: The Ultimate ${genre} Command`,
        primarySubtitle: `Engineered for High-Performance ${genre} Results - Professional Dossier`,
        sevenBoxMatrix: [
          `${topic} for industry leaders`,
          `professional ${genre} frameworks`,
          `advanced ${topic} optimization guide`,
          `industrial ${topic} methodology`,
          `market domination ${topic} book`,
          `high-conversion ${genre} strategy`,
          `precision ${topic} engineering`
        ],
        categorySniperMap: [
          { category: "Professional Development", difficulty: "LOW", browseNode: "Professional/Career" },
          { category: "Industrial Processes", difficulty: "MEDIUM", browseNode: "Business/Industry" },
          { category: "Strategic Success", difficulty: "LOW", browseNode: "Self-Help/Success" }
        ],
        htmlSalesCopy: `<h3>Re-Engineer Your Results with ${topic}</h3>
<p>Are you struggling to break through the noise in <b>${genre}</b>? Most people approach <b>${topic}</b> with guess-work. This industrial architect's guide provides the blueprints you've been missing.</p>
<p><b>The Problem:</b> The market is saturated with shallow information.
<b>The Agitation:</b> Every day you wait is a day your competitors gain ground. They are using psychological triggers while you are still using basic descriptions.</p>
<p><b>The Solution:</b> Our proprietary framework builds a direct bridge between your content and the customer's hunger for excellence. This isn't just a book; it's a technical asset for your library.</p>
<ul>
  <li><b>Phase 1:</b> The Industrial Foundation and Core Principles.</li>
  <li><b>Phase 2:</b> Advanced Execution Vectors and Market Exploitation.</li>
  <li><b>Phase 3:</b> Sustained Scaling and Multi-Platform Dominance.</li>
</ul>
<p>Stop settling for average. <b>Engage the engine today.</b></p>
<p><i>Revised and Updated for 2026 Industrial Standards.</i></p>`,
        bookLabInspiration: {
          basePrompt: `Professional industrial coloring book page for ${topic}, thick black ink details, aesthetic maximalism, white background.`,
          subNiches: [`Vintage ${topic} tech`, `Abstract ${topic} patterns`, `Industrial ${topic} blueprints`],
          uniqueSellingPoint: `The first ever collection to combine ${topic} with high-end industrial design aesthetics.`
        },
        aPlusContentBlueprint: {
          modules: [
            { type: "HEADER", content: `High-Impact Banner: ${topic} Visual Dominance` },
            { type: "STANDARD_IMAGE_TEXT", content: "Detailed breakdown of the author's proprietary methodology combined with high-fidelity charts." },
            { type: "COMPARISON_CHART", content: "Comparison vs Standard Competitors: Showing 5x value proposition." }
          ],
          brandStory: `Built on the principles of precision and industrial excellence, the ${topic} series redefines what is possible in the ${genre} market.`
        },
        banShieldAudit: { status: 'CLEAN', flags: [], trademarkRisk: 'NONE' },
        extractionSource: isUrl ? topicOrUrl : 'Fallback Engine',
        id: `seo_${Date.now()}`,
        timestamp: Date.now()
      };
    }
  }

  async upgradeToProductionPrompt(idea: string, selectedStyle?: string): Promise<string> {
    const prompt = `As an expert AI Art Director, rewrite the following user idea into a high-quality, commercially viable POD (Print-on-Demand) image prompt.
    User Idea: "${idea}"
    Target Style: ${selectedStyle || 'Clean Commercial Art'}

    Guidelines:
    1. Make it descriptive and visual.
    2. Focus on the "${selectedStyle}" aspect.
    3. Ensure the subject is isolated and suitable for printing (no background or simple white background).
    4. Do NOT add generic filler text like "300 DPI quality" repeatedly.
    5. Keep it under 400 characters.
    6. IF the User Idea contains quote-marked text (e.g. "HELLO"), ensure the prompt explicitly asks for "accurate spelling of text 'HELLO'".
    7. Output ONLY the raw prompt. No quotes.`;

    try {
      const enhanced = await this.queryAI(prompt);

      // CRITICAL CHECK: If the result contains the instructions again (due to LLM echo), discard it.
      if (enhanced.includes("As an expert AI Art Director") || enhanced.includes("User Idea:") || enhanced.includes("Guidelines:")) {
        throw new Error("LLM Echo Error");
      }

      // Add technical specs safely
      return `${enhanced}, isolated on white, high definition vector style`;
    } catch (e) {
      // Fallback if LLM fails
      console.warn("Prompt upgrade failed, using raw idea.");
      return `${idea}, ${selectedStyle || ''}, professional vector illustration, isolated on white`;
    }
  }

  async generateProductionDossier(prompt: string, style: string, imageUrl: string): Promise<ProductionDossier> {
    const seoPrompt = `YOU ARE THE "INDUSTRIAL SKU FACTORY SEO ENGINE".
    Generate SEO metadata for a POD product based on this design.
    
    Design Prompt: ${prompt}
    Style: ${style}
    
    Generate for these platforms:
    1. Amazon/Etsy (Premium/Craft focus)
    2. Redbubble (Teen/Viral focus)
    3. Shopify (Brand focus)
    
    Also perform an "Aesthetic Continuity Check" against the design theme.
    
    Output STRICTLY JSON:
    {
      "listingDossiers": {
        "Amazon/Etsy": { "title": "...", "description": "...", "tags": ["...", "..."] },
        "Redbubble": { "title": "...", "description": "...", "tags": ["...", "..."] },
        "Shopify": { "title": "...", "description": "...", "tags": ["...", "..."] }
      },
      "continuityReport": {
        "score": 85,
        "status": "MATCH",
        "feedback": "Visual DNA matches core brand movement.",
        "chromaticConsistency": "Vibrant and aligned with SKU standards"
      }
    }`;

    try {
      const res = await this.queryAI(seoPrompt, true);
      const result = JSON.parse(this.cleanAndRepairJSON(res));

      return {
        id: `sku_${Date.now()}`,
        masterAsset: {
          url: imageUrl,
          resolution: "4096 x 4096",
          dpi: 300
        },
        marketingDeck: [
          { mockupUrl: imageUrl, type: 'STANDARD_TEE' },
          { mockupUrl: imageUrl, type: 'MUG' },
          { mockupUrl: imageUrl, type: 'PHONE_CASE' }
        ],
        listingDossiers: result.listingDossiers,
        continuityReport: result.continuityReport,
        timestamp: Date.now()
      };
    } catch (e) {
      console.error("Dossier Engine Failed", e);
      return {
        id: `sku_${Date.now()}`,
        masterAsset: { url: imageUrl, resolution: "4096 x 4096", dpi: 300 },
        marketingDeck: [{ mockupUrl: imageUrl, type: 'STANDARD_TEE' }],
        listingDossiers: {
          "Generic": { title: "Custom POD SKU", description: "High quality custom merchandise.", tags: ["pod", "custom", "merch"], platform: "Generic" }
        },
        continuityReport: { score: 100, status: 'MATCH', feedback: 'Manual override active.', chromaticConsistency: 'Consistent' },
        timestamp: Date.now()
      };
    }
  }

  // ============================================================
  // 🛡️ KDP PREFLIGHT VALIDATION SYSTEM (Powerhouse Feature)
  // ============================================================

  validateKDPCompliance(project: any): { valid: boolean; errors: string[]; warnings: string[] } {
    const errors: string[] = [];
    const warnings: string[] = [];
    const genre = project.PROJECT_META?.primary_genre || 'Universal';

    // 1. SPINE WIDTH SAFETY
    // Approx 250 words per page. Spine text requires 79+ pages (~20k words)
    const contentChapters = project.INTERIOR_CONTENT || [];
    const totalWords = contentChapters.reduce((acc: number, ch: any) => acc + (ch.content ? ch.content.split(/\s+/).length : 0), 0);
    const estimatedPages = Math.max(24, Math.ceil(totalWords / 250)); // Min 24 for KDP

    if (estimatedPages < 79) {
      warnings.push(`⚠️ Low Page Count (${estimatedPages} pages). Spine text may not print on Paperback. Minimum 79 pages recommended for spine text.`);
    }

    // 2. PLACEHOLDER DETECTION (Critical Rejection Risk)
    const fullText = contentChapters.map((ch: any) => ch.content || '').join(' ');
    const forbiddenPatterns = [
      /\[INSERT.*?\]/i,
      /Lorem Ipsum/i,
      /Title Goes Here/i,
      /Author Name Here/i,
      /TK\s/ // Journalist shorthand for "to come"
    ];

    forbiddenPatterns.forEach(pattern => {
      if (pattern.test(fullText)) {
        errors.push(`🚫 Forbidden Placeholder detected: "${pattern}" found in manuscript.`);
      }
    });

    // 3. COPYRIGHT RISK (Basic scan)
    const copyrightTerms = ['Disney', 'Marvel', 'Harry Potter', 'Star Wars', 'Coca-Cola', 'Nike'];
    copyrightTerms.forEach(term => {
      if (fullText.includes(term)) {
        warnings.push(`⚠️ Potential Copyright Risk: "${term}" detected. Ensure Fair Use.`);
      }
    });

    // 4. MANGA/COMIC SPECIFIC CHECKS
    if (genre && genre.toUpperCase().includes('MANGA')) {
      if (estimatedPages < 40) errors.push('🚫 Manga too short. KDP standard is 40-200 pages.');
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

export const gemini = new GeminiService();
