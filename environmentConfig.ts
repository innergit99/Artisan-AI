/**
 * ENVIRONMENT CONFIGURATION
 * Centralized environment detection and resource routing logic.
 * 
 * CRITICAL RULE: Local development MUST use only free resources (Ollama + Canvas).
 * Production uses paid APIs (Gemini, Fal.ai) for industrial-grade quality.
 */

export const ENV_CONFIG = {
    // Environment Detection
    isDev: import.meta.env.DEV,
    isProd: import.meta.env.PROD,
    isVercel: typeof window !== 'undefined' && window.location.hostname.includes('vercel.app'),
    isCustomDomain: typeof window !== 'undefined' && window.location.hostname === 'publishlab.ink',

    // Force Flags (for testing)
    forceLocalMode: import.meta.env.VITE_FORCE_LOCAL_MODE === 'true',
    forceProductionMode: import.meta.env.VITE_FORCE_PRODUCTION_MODE === 'true',
} as const;

/**
 * Determines if we should use LOCAL resources (Ollama + Canvas)
 */
export function isLocalMode(): boolean {
    // Explicit force flag takes precedence
    if (ENV_CONFIG.forceLocalMode) return true;
    if (ENV_CONFIG.forceProductionMode) return false;

    // Default: Use local mode in DEV, production mode in PROD
    return ENV_CONFIG.isDev;
}

/**
 * Determines if we should use PRODUCTION resources (Gemini + Fal.ai)
 */
export function isProductionMode(): boolean {
    return !isLocalMode();
}

/**
 * Resource routing configuration
 */
export const RESOURCE_CONFIG = {
    text: {
        local: 'ollama',      // Llama 3.2:3b via localhost:11434
        production: 'gemini'   // Gemini 1.5 Flash via Google AI
    },
    images: {
        local: 'canvas',       // Client-side Canvas API
        production: 'fal',     // Fal.ai Flux Schnell/Dev
        fallback: 'pollinations' // Pollinations.ai (Free)
    },
    marketData: {
        local: 'simulated',    // Static cached data
        production: 'scraper'  // ScraperAPI (Phase 2)
    },
    export: {
        local: 'client',       // jsPDF client-side
        production: 'modal'    // Modal.com serverless
    }
} as const;

/**
 * Get the active resource provider for a given service
 */
export function getResourceProvider(service: keyof typeof RESOURCE_CONFIG): string {
    const mode = isLocalMode() ? 'local' : 'production';

    // Special Logic for Images: Check for Fal Key
    if (service === 'images' && mode === 'production') {
        const hasFalKey = (import.meta.env.VITE_FAL_API_KEY || process.env.FAL_API_KEY)?.length > 10;
        if (!hasFalKey) return 'pollinations'; // Auto-fallback if no key
    }

    return RESOURCE_CONFIG[service][mode];
}

/**
 * Console logging helper for environment debugging
 */
export function logEnvironmentInfo() {
    console.log('🔧 Environment Configuration:');
    console.log(`   Mode: ${isLocalMode() ? '🏠 LOCAL (Free Resources)' : '🚀 PRODUCTION (Paid APIs)'}`);
    console.log(`   Text: ${getResourceProvider('text')}`);
    console.log(`   Images: ${getResourceProvider('images')}`);
    console.log(`   Market Data: ${getResourceProvider('marketData')}`);
    console.log(`   Export: ${getResourceProvider('export')}`);
}
