
export enum ToolType {
  DASHBOARD = 'DASHBOARD',
  TEXT_TO_IMAGE = 'TEXT_TO_IMAGE',
  POD_MERCH = 'POD_MERCH',
  LOGO_CREATOR = 'LOGO_CREATOR',
  COLORING_PAGES = 'COLORING_PAGES',
  MANUSCRIPT_DOCTOR = 'MANUSCRIPT_DOCTOR',
  OBJECT_ISOLATOR = 'OBJECT_ISOLATOR',
  HD_UPSCALER = 'HD_UPSCALER',
  PATTERN_MAKER = 'PATTERN_MAKER',
  TREND_INTELLIGENCE = 'TREND_INTELLIGENCE',
  BRAND_INTELLIGENCE = 'BRAND_INTELLIGENCE',
  NICHE_RADAR = 'NICHE_RADAR',
  VIRAL_HOOKS = 'VIRAL_HOOKS',
  AMAZON_SEO = 'AMAZON_SEO',
  PROFIT_ESTIMATOR = 'PROFIT_ESTIMATOR',
  CLICK_TESTER = 'CLICK_TESTER',
  BAN_SHIELD = 'BAN_SHIELD',
  STOREFRONT_BUILDER = 'STOREFRONT_BUILDER',
  SALES_PAGE_BUILDER = 'SALES_PAGE_BUILDER',
  HEALTH_MONITOR = 'HEALTH_MONITOR',
  MY_GALLERY = 'MY_GALLERY',
  CHARACTER_VAULT = 'CHARACTER_VAULT',
  SETTINGS = 'SETTINGS'
}

export enum UserIntent {
  IDLE = 'IDLE',
  DISCOVER = 'DISCOVER',
  VALIDATE = 'VALIDATE',
  CREATE = 'CREATE',
  OPTIMIZE = 'OPTIMIZE',
  PUBLISH = 'PUBLISH',
  PROTECT = 'PROTECT'
}

export enum DashboardUIState {
  DEFAULT = 'DEFAULT',
  GUIDED = 'GUIDED',
  FOCUSED = 'FOCUSED',
  WARNING = 'WARNING'
}

export interface ToolConfig {
  id: ToolType;
  name: string;
  description: string;
  icon: string;
  gradient: string;
  image: string;
  category: string;
}

export interface PODStyle {
  id: string;
  label: string;
  promptSuffix: string;
}

export type MockupType =
  | 'STANDARD_TEE' | 'LARGE_PRINT_TEE' | 'HAT' | 'STICKER' | 'PHONE_CASE'
  | 'DESK_MAT' | 'MOUSE_PAD' | 'PILLOW' | 'TOTE_BAG' | 'MUG'
  | 'POSTER' | 'CANVAS' | 'GREETING_CARD' | 'LAPTOP_SKIN' | 'POUCH'
  | 'DRESS' | 'SCARF' | 'DUVET' | 'SHOWER_CURTAIN' | 'JOURNAL'
  | 'SPIRAL_NOTEBOOK' | 'CLOCK' | 'ACRYLIC_BLOCK' | 'COASTER' | 'BLANKET'
  | 'TAPESTRY' | 'BATH_MAT' | 'BUTTON' | 'APRON' | 'PUZZLE'
  | 'SOCKS' | 'BACKPACK' | 'DUFFLE_BAG';

export interface SEOMetadata {
  title: string;
  description: string;
  story: string;
  tags: string[];
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  tool: ToolType;
  timestamp: number;
  seo?: SEOMetadata;
  mockupUrl?: string;
  kdpBlueprint?: any; // To store full KDP projects for re-editing
  productionDossier?: ProductionDossier;
}

export interface KDPAplusModule {
  id: string;
  type: 'HEADER' | 'IMAGE_TEXT' | 'INFO_HUB' | 'GRID';
  title?: string;
  body?: string;
  visualPrompt: string;
  generatedImageUrl?: string;
}

export interface KDPChapter {
  chapter: number;
  title: string;
  summary: string;
  content: string;
  visualPrompt: string;
  generatedImageUrl?: string;
  wordCount?: number;
  auditReport?: {
    originalWords: number;
    finalWords: number;
    removedWords: number;
    efficiency: number;
    readabilityGrade?: number;
    toneScore?: string;
    voiceFingerprint?: string;
  };
}

export type KDPFormat = 'STANDALONE' | 'EPISODE' | 'SERIES';
export type KDPTarget = 'PRINT' | 'EBOOK' | 'COVER' | 'COVER_EBOOK' | 'APLUS';



export interface CharacterProfile {
  id: string;
  name: string;
  role: 'PROTAGONIST' | 'ANTAGONIST' | 'SUPPORTING' | 'MENTOR';
  physicalDNA: {
    age?: string;
    build?: string;
    hair?: string;
    eyes?: string;
    clothingStyle?: string;
    distinguishingMarks?: string[];
  };
  personality: {
    traits: string[];
    motivation: string;
    flaw: string;
  };
  visualMasterPrompt: string; // The "Golden Prompt" for top-tier consistency
}

export interface KDPBlueprint {
  PROJECT_META: {
    title_working: string;
    suggestedAuthor: string;
    series_info: string;
    primary_genre: string;
    trim_size: string;
    publisher_imprint: string;
    copyright_year: string;
    interior_color: 'B&W' | 'Color';
    reading_direction?: 'LTR' | 'RTL';
  };
  BOOK_STRUCTURE: {
    front_matter: {
      dedication_text: string;
      copyright_page_text: string;
    };
    end_matter: {
      author_bio: string;
      additional_works?: string[];
    };
  };
  INTERIOR_CONTENT: KDPChapter[];
  COVER_SPEC: {
    front_prompt: string;
    back_prompt: string;
    spine_text: string;
    full_wrap_url?: string;
    ebook_url?: string;
    back_cover_url?: string;
  };
  BACK_COVER_SPEC: {
    blurb_text: string;
    hook_points: string[];
  };
  ISBN_SPEC: {
    source: 'KDP' | 'USER';
    user_barcode_url?: string;
  };
  KDP_METADATA: {
    keyword_phrases: string[];
    primary_category: string;
    long_description: string;
  };
  QA_CHECKLIST: string[];
  APLUS_CONTENT?: KDPAplusModule[];

  // Advanced Skills Data (Optional)
  SKILLS_DATA?: {
    characterProfiles?: CharacterProfile[];
    continuityIssues?: any[];
    marketingCopy?: any;
    seriesBible?: any;
    readerMagnets?: { type: string; content: string }[];
  };

  id: string;
  timestamp: number;
}

export interface KDPProject {
  title: string;
  author: string;
  publisher: string;
  category: string;
  genre: string;
  trimSize: string;
  interiorColor: 'B&W' | 'Color';
  audience: string;
  format: KDPFormat;
  chapterCount: number;
  isbnSource: 'KDP' | 'USER';
}

export interface KDPGenrePreset {
  id: string;
  label: string;
  category: string;
  defaultTrim: string;
  defaultInterior: string;
  promptBase: string;
  minWords?: number;
  maxWords?: number;
  minChapters?: number;
  maxChapters?: number;
  isFixedLayout?: boolean;
  requiresAgeRange?: boolean;
}

export interface TrendingNiche {
  keyword: string;
  volume: string;
  competition: string;
  growth: string;
  // Decision Signals
  demandScore?: 'Low' | 'Medium' | 'High';
  competitionLevel?: 'Low' | 'Medium' | 'High';
  avgPriceRange?: string;
  velocityStatus?: 'Rising' | 'Stable' | 'Peaking';
  suitability?: 'POD' | 'KDP' | 'Hybrid';
  recommended?: boolean;
  visualOverlay?: 'sticker' | 'tee' | 'book' | 'poster';
  // Legacy fields kept for compatibility if needed
  topic?: string;
  description?: string;
  tags?: string[];
  reason?: string;
  saturationScore?: number;
  potential?: string;
  actionPlan?: string[];
  sources?: { uri: string; title: string }[];
}
export interface BrandDNAReport {
  brandName?: string; // Optional as prompt might not return it
  archetype: string;
  palette: string[]; // Hex codes
  typography: string;
  voice: string;
  winningProducts: string[];

  // Advanced fields (Legacy support)
  visualDNA?: {
    movements: string[];
    typography: string[];
    textures: string[];
  };
  chromaticHarvest?: string[];
  persona?: {
    demographic: string;
    painPoints: string[];
    powerWords: string[];
  };
  masterPrompt?: string;
  exploitationPlan?: string[];
  semanticVoice?: {
    tone: string;
    headlines: string[];
  };
  gapAnalysis?: {
    vulnerabilities: string[];
    correctionDesign: string;
  };
}
export interface NicheRadarReport {
  niche: string;
  score: number;
  volume: string;
  competition: string;
  verdict: 'GO' | 'CAUTION' | 'STOP';
  keywords: string[];

  // v2.0 Intelligence Fields
  why?: string[];
  nextAction?: string;
  bteIndex?: {
    score: number;
    label: string;
    description: string;
  };
  demandSignal?: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXPLOSIVE';

  // Advanced Matrix Fields
  topic?: string;
  saturationIndex?: {
    score: number;
    level: 'LOW' | 'MEDIUM' | 'HIGH' | 'EXTREME';
    description: string;
  };
  trademarkShield?: {
    status: 'SAFE' | 'CAUTION' | 'DANGER';
    riskAnalysis: string;
    protectedPhrases: string[];
  };
  aestheticGap?: {
    currentStyle: string;
    gapOpportunity: string;
    evolutionaryTone: string;
  };
  financialMatrix?: {
    avgPrice: string;
    salesVelocity: string;
    roiPotential: string;
    marginPotential?: string;
  };
  keywordGoldmine?: string[];
  bettermentPrompt?: string;
  sources: { platform: string; url: string }[];
  id: string;
  timestamp: number;
}

export interface KDPSeoDossier {
  topic: string;
  hookTitle: string;
  primarySubtitle: string;
  sevenBoxMatrix: string[];
  categorySniperMap: {
    category: string;
    difficulty: 'LOW' | 'MEDIUM' | 'HIGH';
    browseNode: string;
  }[];
  htmlSalesCopy: string; // PAS framework
  aPlusContentBlueprint: {
    modules: {
      type: string;
      content: string;
    }[];
    brandStory: string;
  };
  banShieldAudit: {
    status: 'CLEAN' | 'FLAGGED';
    flags: string[];
    trademarkRisk: 'NONE' | 'LOW' | 'MEDIUM' | 'HIGH';
  };
  visualAudit?: {
    vibeMatch: boolean;
    recommendation: string;
  };
  bookLabInspiration: {
    basePrompt: string;
    subNiches: string[];
    uniqueSellingPoint: string;
  };
  extractionSource?: string;
  id: string;
  timestamp: number;
}

export interface ListingDossier {
  title: string;
  description: string;
  tags: string[];
  platform: string;
}

export interface AestheticContinuityReport {
  score: number;
  status: 'MATCH' | 'DIVERGENT' | 'CRITICAL_MISMATCH';
  feedback: string;
  chromaticConsistency: string;
}

export interface ProductionDossier {
  id: string;
  masterAsset: {
    url: string; // The transparent PNG
    resolution: string; // e.g., "4096 x 4096"
    dpi: number;
  };
  marketingDeck: {
    mockupUrl: string;
    type: MockupType;
  }[];
  listingDossiers: Record<string, ListingDossier>; // Platform as key
  continuityReport: AestheticContinuityReport;
  timestamp: number;
}
