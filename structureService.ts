import { KDPGenrePreset, KDPProject } from './types';
import { KDPCalculator, PaperType as KDPPaperType, KDP_LIMITS } from './kdpCalculator';

// --- PART 1: GENRE INTELLIGENCE MATRIX (CIN) ---

export interface GenreLogic {
    id: string;
    name: string;
    wordCountPerChapter: { min: number; max: number };
    totalWordCount: { min: number; max: number };
    estimatedPageCount: { min: number; max: number }; // Paperback
    pacing: string;
    structureRules: string[];
    emotionalCore: string;
    sensoryAnchors: string[];
    paperType: 'Cream' | 'White' | 'Color';
    trimSize: string;
    readingDirection?: 'LTR' | 'RTL'; // New (CME)
    panelCount?: { min: number; max: number }; // New (CME)
    toneMode?: 'Color' | 'Grayscale'; // New (CME)
}

export const GENRE_MATRIX: Record<string, GenreLogic> = {
    'ROMANCE': {
        id: 'ROMANCE',
        name: 'Romance / Dark Romance',
        wordCountPerChapter: { min: 2000, max: 3500 },
        totalWordCount: { min: 50000, max: 90000 },
        estimatedPageCount: { min: 200, max: 350 },
        pacing: "Slow emotional burn. High dialogue proportion (≈40%).",
        structureRules: [
            "Maintain narrative arc continuity score ≥ 0.85",
            "Ensure emotional reference continuity (pronoun / tone tracking)",
            "Insert micro-cliffhanger at every 2 chapters",
            "Balance = 1 Dialogue Scene : 1 Internal Reflection Scene"
        ],
        emotionalCore: "Yearning and vulnerability. Reader must ACHE for the couple.",
        sensoryAnchors: ["Body heat", "Voice timbre", "Scent (cologne/perfume)", "Fabric texture"],
        paperType: 'Cream',
        trimSize: '5.5" x 8.5"'
    },
    'MYSTERY': {
        id: 'MYSTERY',
        name: 'Mystery / Thriller / Psychological',
        wordCountPerChapter: { min: 2500, max: 4000 },
        totalWordCount: { min: 70000, max: 110000 },
        estimatedPageCount: { min: 250, max: 400 },
        pacing: "Rising tension index. 'Reveal–Twist–Reversal' pattern.",
        structureRules: [
            "Clue_Thread_Count ≥ 3 per Act",
            "Reveal every 4–5 chapters, mini-twist every 3",
            "Micro-Tension: Every paragraph ends with unease"
        ],
        emotionalCore: "Paranoia and distrust. Reader must feel visceral unease.",
        sensoryAnchors: ["Smell (copper/mildew)", "Sound (creaking/breathing)", "Texture (rough/cold)", "Gut sensations"],
        paperType: 'Cream',
        trimSize: '5.25" x 8"'
    },
    'FANTASY': {
        id: 'FANTASY',
        name: 'Fantasy / Urban Fantasy',
        wordCountPerChapter: { min: 3000, max: 5000 },
        totalWordCount: { min: 90000, max: 150000 },
        estimatedPageCount: { min: 300, max: 600 },
        pacing: "Epic scale. World exposition alternates with emotional beats.",
        structureRules: [
            "Maintain Worldbuilding Density Index ≤ 0.25 (25% max exposition)",
            "Reinforce emotional callback every 2 chapters",
            "Anchor POV consistency via character memory markers"
        ],
        emotionalCore: "Wonder + earned sacrifice. Magic COSTS.",
        sensoryAnchors: ["Magic sensation (tingling/wrongness)", "Ancient stone/smoke", "Scale (massiveness)", "Pain of cost"],
        paperType: 'White', // Better for maps/details usually, though Cream is standard for fiction
        trimSize: '6" x 9"'
    },
    'SCIFI': {
        id: 'SCIFI',
        name: 'Sci-Fi / Space Opera',
        wordCountPerChapter: { min: 2800, max: 4500 },
        totalWordCount: { min: 80000, max: 130000 },
        estimatedPageCount: { min: 280, max: 500 },
        pacing: "Concept + Consequence. Ideas lead to dilemmas.",
        structureRules: [
            "Track Science_Concept_ID → Emotional_Pivot_ID link",
            "If not resolved within 3 chapters → auto-insert philosophical callback",
            "Hard Tech vs Soft Heart balance"
        ],
        emotionalCore: "Humanity under pressure. Technology reveals us.",
        sensoryAnchors: ["Sterile air", "Electromagnetic hum", "Weightlessness", "Synthetic tastes"],
        paperType: 'White',
        trimSize: '6" x 9"'
    },
    'HORROR': {
        id: 'HORROR',
        name: 'Horror',
        wordCountPerChapter: { min: 2000, max: 3500 },
        totalWordCount: { min: 60000, max: 100000 },
        estimatedPageCount: { min: 220, max: 380 },
        pacing: "Alternating dread curve: Calm → Anxiety → Horror → Recovery.",
        structureRules: [
            "Fear_Level: sin(x) curve pattern",
            "Ensure Emotional_Contrast: Calm Scene follows each Panic Scene",
            "One wrong detail per scene (Uncanny Valley)"
        ],
        emotionalCore: "Dread and wrongness. Familiar corrupted.",
        sensoryAnchors: ["Sound wrongness (off-rhythm)", "Visual violation", "Smell (rot/copper)", "Paralysis"],
        paperType: 'Cream',
        trimSize: '5.5" x 8.5"'
    },
    'NONFICTION': {
        id: 'NONFICTION',
        name: 'Self-Help / Business',
        wordCountPerChapter: { min: 1500, max: 2500 },
        totalWordCount: { min: 35000, max: 55000 },
        estimatedPageCount: { min: 120, max: 220 },
        pacing: "Anecdote → Framework → Action → Reflection.",
        structureRules: [
            "Include 4-section model per chapter (Story, Insight, Action, Reflection)",
            "Check Framework_Consistency",
            "Call-to-Action every chapter end"
        ],
        emotionalCore: "Empowerment and clarity. From confusion to competence.",
        sensoryAnchors: ["Clarity of thought", "Physical relief", "Visual frameworks", "Success visualization"],
        paperType: 'White',
        trimSize: '6" x 9"'
    },
    'CHILDREN': {
        id: 'CHILDREN',
        name: 'Children\'s Picture Book',
        wordCountPerChapter: { min: 50, max: 100 },
        totalWordCount: { min: 500, max: 1000 },
        estimatedPageCount: { min: 24, max: 40 },
        pacing: "Rhythmic. 1 emotion per story.",
        structureRules: [
            "Rhythm_Pattern: ABCB rhyme or 3-beat prose",
            "Illustration_Cue each page",
            "Text ≤ 60 words per spread"
        ],
        emotionalCore: "Wonder and agency. Respect young intelligence.",
        sensoryAnchors: ["Colors POP", "Sounds BOOM", "Textures delight", "Big emotions"],
        paperType: 'Color',
        trimSize: '8.5" x 8.5"',
        readingDirection: 'LTR',
        toneMode: 'Color'
    },
    'COZY': {
        id: 'COZY',
        name: 'Cozy Mystery',
        wordCountPerChapter: { min: 2000, max: 3000 },
        totalWordCount: { min: 60000, max: 75000 },
        estimatedPageCount: { min: 220, max: 280 },
        pacing: "Gentle suspense. Small community setting.",
        structureRules: [
            "Clue_Frequency ≤ 2 per chapter",
            "Comfort_Interaction (tea/pets) ≥ 1 per chapter",
            "Humor_Pulse_Every = 2 chapters"
        ],
        emotionalCore: "Comfort and curiosity. Safe danger.",
        sensoryAnchors: ["Warmth", "Baked goods smell", "Rain on window", "Soft textures"],
        paperType: 'Cream',
        trimSize: '5.25" x 8"'
    },
    'DARK_ROMANCE': {
        id: 'DARK_ROMANCE',
        name: 'Dark Romance',
        wordCountPerChapter: { min: 2500, max: 4000 },
        totalWordCount: { min: 70000, max: 100000 },
        estimatedPageCount: { min: 250, max: 350 },
        pacing: "Intense. Temptation → Descent → Redemption.",
        structureRules: [
            "Emotional Arc: Temptation → Descent → Redemption",
            "Descriptive Intensity Score = 0.8–0.9",
            "Ensure Emotional Consent Layers"
        ],
        emotionalCore: "Obsession and primal connection.",
        sensoryAnchors: ["Shadows", "Metallic tastes", "Cold vs Hot contrast", "Adrenaline"],
        paperType: 'Cream',
        trimSize: '5.5" x 8.5"'
    },
    'YA': {
        id: 'YA',
        name: 'Young Adult (YA)',
        wordCountPerChapter: { min: 2000, max: 3500 },
        totalWordCount: { min: 50000, max: 85000 },
        estimatedPageCount: { min: 200, max: 300 },
        pacing: "Fast. Identity crisis loop.",
        structureRules: [
            "Introspective_Segment_Freq = 3 chapters",
            "Dialogue / Description Ratio = 60/40",
            "Moral Introspection every 3 chapters"
        ],
        emotionalCore: "Identity and intensity. Everything feels like the first time.",
        sensoryAnchors: ["Heartbeat", "Social gaze", "School sounds", "Digital anxiety"],
        paperType: 'Cream',
        trimSize: '5.5" x 8.25"'
    },
    'HISTORICAL': {
        id: 'HISTORICAL',
        name: 'Historical Fiction',
        wordCountPerChapter: { min: 3000, max: 5000 },
        totalWordCount: { min: 90000, max: 130000 },
        estimatedPageCount: { min: 300, max: 500 },
        pacing: "Immersive. Era accuracy is paramount.",
        structureRules: [
            "Era_Accuracy_Check every 2 chapters",
            "Emotional_Object_Loop (symbol repetition)",
            "Cultural Dialogue Calibration"
        ],
        emotionalCore: "The weight of time. Personal lives against history.",
        sensoryAnchors: ["Period clothing texture", "Smoke/Coal smell", "Horse/Carriage sounds", "Silence"],
        paperType: 'Cream',
        trimSize: '6" x 9"'
    },
    'COLORING': {
        id: 'COLORING',
        name: 'Coloring Book',
        wordCountPerChapter: { min: 0, max: 50 }, // Minimal text
        totalWordCount: { min: 0, max: 500 },
        estimatedPageCount: { min: 24, max: 120 },
        pacing: "Visual flow. Complexity balance.",
        structureRules: [
            "Pattern Diversity Index ≥ 0.7",
            "No adjacent identical motifs",
            "Affirmation_Page every 10 pages"
        ],
        emotionalCore: "Relaxation and focus.",
        sensoryAnchors: ["Visual complexity", "Clean lines", "Negative space"],
        paperType: 'White',
        trimSize: '8.5" x 11"'
    },
    'COMIC': {
        id: 'COMIC',
        name: 'Western Comic Book',
        wordCountPerChapter: { min: 100, max: 300 }, // Script words per issue
        totalWordCount: { min: 1000, max: 5000 },
        estimatedPageCount: { min: 24, max: 60 },
        pacing: "Linear rising tension. 1 beat = 1 panel.",
        structureRules: [
            "Panels/Page: 4-6 average",
            "Force final panel cliffhanger each odd page",
            "Dialogue ratio: <25 words per balloon"
        ],
        emotionalCore: "Heroic struggle or high stakes. Visual rhythm.",
        sensoryAnchors: ["Visual Impact", "Motion lines", "Sound FX (POW/SNAP)", "Color Palette shifts"],
        paperType: 'White',
        trimSize: '7" x 10"',
        readingDirection: 'LTR',
        panelCount: { min: 4, max: 6 },
        toneMode: 'Color'
    },
    'MANGA': {
        id: 'MANGA',
        name: 'Manga (Japanese Style)',
        wordCountPerChapter: { min: 200, max: 500 },
        totalWordCount: { min: 5000, max: 20000 },
        estimatedPageCount: { min: 120, max: 250 },
        pacing: "Right-to-Left Flow. Wave pattern (quiet → burst).",
        structureRules: [
            "Reading Order: Right-to-Left (RTL)",
            "Tonal Flow: Alternation of 'koma' (silent) and 'dosa' (action)",
            "Halftone texture mandatory (no gradient)"
        ],
        emotionalCore: "Internal monologue vs Explosive action.",
        sensoryAnchors: ["Screen tones", "Speed lines", "Eye focus flow", "Sound FX (Japanese Katakana)"],
        paperType: 'White', // Often printed on cheaper newsprint, but KDP White is best for contrast
        trimSize: '5" x 7.5"',
        readingDirection: 'RTL',
        panelCount: { min: 5, max: 8 },
        toneMode: 'Grayscale'
    },
    'URBAN_FANTASY': {
        id: 'URBAN_FANTASY',
        name: 'Urban Fantasy',
        wordCountPerChapter: { min: 3000, max: 4500 },
        totalWordCount: { min: 75000, max: 100000 },
        estimatedPageCount: { min: 280, max: 400 },
        pacing: "Gritty noir meets magic. Fast-paced investigation.",
        structureRules: [
            "Masquerade Rule: Magic is hidden or integrated",
            "Magic System: Hard limits, costs stamina",
            "Setting: Modern city with a dark underbelly"
        ],
        emotionalCore: "Cynicism vs Wonder. Belonging in two worlds.",
        sensoryAnchors: ["Neon light on rain", "Subway rumble", "Leather/Ozone smell", "Cold iron"],
        paperType: 'Cream',
        trimSize: '6" x 9"'
    },
    'PSYCH_THRILLER': {
        id: 'PSYCH_THRILLER',
        name: 'Psychological Thriller',
        wordCountPerChapter: { min: 2000, max: 3500 },
        totalWordCount: { min: 65000, max: 95000 },
        estimatedPageCount: { min: 250, max: 380 },
        pacing: "Internal spiral. Unreliable narrator.",
        structureRules: [
            "Unreliable Narrator: Contradict facts every 5 chapters",
            "Flashbacks: Trauma loop integration",
            "The Twist: Re-contextualize the entire first act"
        ],
        emotionalCore: "Paranoia. Who am I? Who are they?",
        sensoryAnchors: ["Claustrophobia", "Distorted reflections", "Ticking clocks", "Fragmented memories"],
        paperType: 'Cream',
        trimSize: '6" x 9"'
    },
    'BIOGRAPHY': {
        id: 'BIOGRAPHY',
        name: 'Biography / Memoir',
        wordCountPerChapter: { min: 2500, max: 4000 },
        totalWordCount: { min: 60000, max: 120000 },
        estimatedPageCount: { min: 200, max: 400 },
        pacing: "Chronological or Thematic. Reflective.",
        structureRules: [
            "Voice: Authentic first-person or researched third-person",
            "Theme: Connect life events to universal truths",
            "Legacy: What remains?"
        ],
        emotionalCore: "Vulnerability and transformation.",
        sensoryAnchors: ["Nostalgia", "Period-specific details", "Tactile memories", "Voice"],
        paperType: 'White', // Photos often included
        trimSize: '6" x 9"'
    },
    'BUSINESS': {
        id: 'BUSINESS',
        name: 'Business & Money',
        wordCountPerChapter: { min: 2000, max: 3000 },
        totalWordCount: { min: 30000, max: 60000 },
        estimatedPageCount: { min: 150, max: 250 },
        pacing: "Problem → Solution. High density of value.",
        structureRules: [
            "Framework First: Define the model early",
            "Case Studies: Proof of concept",
            "Actionable Steps: End of every chapter"
        ],
        emotionalCore: "Ambition, Security, Competence.",
        sensoryAnchors: ["Clean charts", "Professional layout", "Forward momentum", "Clarity"],
        paperType: 'White',
        trimSize: '6" x 9"'
    },
    'SELF_HELP': {
        id: 'SELF_HELP',
        name: 'Self-Help / Transformation',
        wordCountPerChapter: { min: 1500, max: 2500 },
        totalWordCount: { min: 25000, max: 50000 },
        estimatedPageCount: { min: 100, max: 200 },
        pacing: "Conversational. 'You' focused.",
        structureRules: [
            "Empathy Bridge: 'I was where you are'",
            "The Pivot: The moment of change",
            "The Method: Step-by-step guidance"
        ],
        emotionalCore: "Hope and Agency. You can change.",
        sensoryAnchors: ["Lightness", "Breathing room", "Structure", "Gentle tone"],
        paperType: 'White',
        trimSize: '5.5" x 8.5"'
    },
    'COLORING_KIDS': {
        id: 'COLORING_KIDS',
        name: 'Kids Coloring Book',
        wordCountPerChapter: { min: 0, max: 20 },
        totalWordCount: { min: 0, max: 200 },
        estimatedPageCount: { min: 24, max: 80 },
        pacing: "Simple, bold fun.",
        structureRules: [
            "Line Weight: Thick (2-3pt) for crayons",
            "Subject: One central character per page",
            "Background: Minimal/Empty"
        ],
        emotionalCore: "Joy and Play.",
        sensoryAnchors: ["Bold lines", "Cute characters", "Open space"],
        paperType: 'White',
        trimSize: '8.5" x 11"'
    },
    'COLORING_KDP': {
        id: 'COLORING_KDP',
        name: 'KDP Coloring Page (Single)',
        wordCountPerChapter: { min: 0, max: 0 },
        totalWordCount: { min: 0, max: 0 },
        estimatedPageCount: { min: 1, max: 1 },
        pacing: "Standalone.",
        structureRules: [
            "Margins: Safe zone mandatory",
            "Resolution: Vector or 600dpi raster",
            "Theme: Highly commercial (mandala, quote)"
        ],
        emotionalCore: "Instant Gratification.",
        sensoryAnchors: ["Crisp black", "Pure white"],
        paperType: 'White',
        trimSize: '8.5" x 11"'
    },
    'JOURNAL': {
        id: 'JOURNAL',
        name: 'Daily Journal',
        wordCountPerChapter: { min: 0, max: 50 },
        totalWordCount: { min: 500, max: 2000 },
        estimatedPageCount: { min: 100, max: 200 },
        pacing: "Repetitive Daily Cycle.",
        structureRules: [
            "Prompt density: Low (allow writing space)",
            "Lines: Dotted or Ruled (7mm)",
            "Quote: Every 10 pages"
        ],
        emotionalCore: "Reflection and Memory.",
        sensoryAnchors: ["Paper texture", "Pen flow", "Quiet space"],
        paperType: 'White', // or Cream
        trimSize: '6" x 9"'
    },
    'PLANNER': {
        id: 'PLANNER',
        name: 'Productivity Planner',
        wordCountPerChapter: { min: 0, max: 100 },
        totalWordCount: { min: 1000, max: 3000 },
        estimatedPageCount: { min: 100, max: 300 },
        pacing: "Cyclical (Day/Week/Month).",
        structureRules: [
            "Grid Layout: Essential",
            "Dates: Undated (Perpetual) preferred for POD",
            "Focus Sections: Top 3 priorities"
        ],
        emotionalCore: "Control and Achievement.",
        sensoryAnchors: ["Structure", "Grid lines", "Checkboxes"],
        paperType: 'White',
        trimSize: '8.5" x 11"'
    }
};

// --- PART 2: PRINT LAYOUT INTELLIGENCE (PLIS) ---

export interface LayoutSpecs {
    trimSize: string;
    margins: { inner: number; outer: number; top: number; bottom: number };
    bleed: number;
    spineWidth: number;
    minPages: number;
    maxPages: number;
    readingDirection?: 'LTR' | 'RTL'; // New
    toneMode?: 'Color' | 'Grayscale'; // New
}

export class StructureService {

    /**
     * Get the full architectural rules for a specific genre
     */
    getGenreLogic(genreName: string): GenreLogic {
        // Normalize
        const key = Object.keys(GENRE_MATRIX).find(k => genreName.toUpperCase().includes(k));
        return key ? GENRE_MATRIX[key] : GENRE_MATRIX['ROMANCE']; // Default to Romance flow if unknown
    }

    /**
     * PLIS: Calculate exact physical layout specs based on content
     */
    calculateLayoutSpecs(pageCount: number, paperType: 'Cream' | 'White' | 'Color'): LayoutSpecs {
        // Map structure service paper type to calculator paper type
        const calculatorPaperType: KDPPaperType = paperType === 'Color' ? 'premium-color' : (paperType === 'Cream' ? 'cream' : 'white');

        const gutter = KDPCalculator.getGutter(pageCount);
        const spine = KDPCalculator.getSpineWidth(pageCount, calculatorPaperType);

        return {
            trimSize: 'Variable', // Context dependent
            margins: {
                inner: gutter,
                outer: KDP_LIMITS.SAFETY_MARGIN,
                top: KDP_LIMITS.SAFETY_MARGIN,
                bottom: KDP_LIMITS.SAFETY_MARGIN
            },
            bleed: KDP_LIMITS.BLEED_STANDARD,
            spineWidth: spine,
            minPages: KDP_LIMITS.MIN_PAGES,
            maxPages: KDP_LIMITS.MAX_PAGES_STANDARD // Standard KDP max
        };
    }

    /**
     * CIS: Generate the Continuity Context Lock prompt segment
     */
    generateContextLock(previousChapterText: string, genre: string): string {
        const logic = this.getGenreLogic(genre);
        return `
CONTINUITY INTELLIGENCE (CIS) ACTIVE:
- EMOTIONAL CORE: ${logic.emotionalCore}
- PACING RULE: ${logic.pacing}
- TONE LOCK: Maintain consistency with previous text (Voice, Rhythm, Vocabulary).
- NARRATIVE THREADS: Ensure characters recall events from the previous segment.
         `;
    }
}

export const structureService = new StructureService();
