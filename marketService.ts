
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the shape of our Market Intelligence
export interface NicheOpportunity {
    title: string;
    description: string;
    demand: 'High' | 'Medium' | 'Low';
    competition: 'High' | 'Medium' | 'Low';
    estimatedRoyalty: string;
    tags: string[];
}

export interface NicheAnalysis {
    demandScore: number;      // 0-100
    saturationIndex: string;  // "Very Low", "Low", "Medium", "High", "Oversaturated"
    keywordVolume: string;    // "Critical Mass", "High", "Moderate", "Low"
    opportunity: string;      // "Gold Mine", "Viable", "Risky", "Dead"
    aiInsight: string;        // 1-2 sentence actionable advice
    relatedKeywords: string[];
    topOpportunities: NicheOpportunity[]; // The "At least 5" results
}

export class MarketService {
    private apiKey: string;
    private baseUrl = 'https://api.firecrawl.dev/v1';

    constructor() {
        this.apiKey = (import.meta as any).env?.VITE_FIRECRAWL_API_KEY || process.env.VITE_FIRECRAWL_API_KEY || '';
    }

    /**
     * PRIMARY ENGINE: Analyzes a niche by scraping live Google/Amazon signals via Firecrawl
     * and synthesizing the result with Gemini 1.5 Flash.
     */
    async analyzeNiche(rawKeyword: string, mode: 'KDP' | 'POD' = 'KDP'): Promise<NicheAnalysis> {
        if (!rawKeyword) throw new Error("Keyword required");

        // 1. If no key, return simulated "Demo Mode" data (strictly for non-devs)
        if (!this.apiKey || this.apiKey.includes('YOUR_KEY_HERE')) {
            console.warn("⚠️ MarketService: No Firecrawl Key found. Returning SIMULATED data.");
            return this.getSimulatedData(rawKeyword, mode);
        }

        try {
            // 2. REAL-TIME SCRAPING: Context-Aware Search
            let searchQuery = "";
            if (mode === 'KDP') {
                searchQuery = `"${rawKeyword}" amazon kindle best sellers books`;
            } else {
                searchQuery = `"${rawKeyword}" etsy redbubble amazon merch trends`;
            }

            const scrapeResult = await this.performSearch(searchQuery);

            // 3. INTELLIGENCE SYNTHESIS: Feed raw SERP data to Gemini
            const intelligence = await this.synthesizeMarketData(rawKeyword, scrapeResult, mode);

            return intelligence;

        } catch (error) {
            console.error("Market Radar Failed:", error);
            // Fallback to simulation on error to keep UI alive
            return this.getSimulatedData(rawKeyword, mode);
        }
    }

    /**
     * Uses Firecrawl /search endpoint to get clear text signals
     */
    private async performSearch(query: string): Promise<string> {
        if (!this.apiKey) {
            console.warn("Firecrawl API Key is missing in performSearch");
            return "";
        }

        console.warn(`🔥 Firecrawl: Searching for '${query}'...`);

        try {
            const response = await fetch(`${this.baseUrl}/search`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    query: query,
                    limit: 5 // Top 5 results are enough for a pulse check
                })
            });

            if (!response.ok) {
                const errorBody = await response.text();
                console.error(`Firecrawl API Error: ${response.status}`, errorBody);
                throw new Error(`Firecrawl API Error: ${response.status} - ${errorBody}`);
            }

            const data = await response.json();

            if (!data.success || !data.data) {
                console.warn("Firecrawl returned no success or data", data);
                return "";
            }

            console.warn(`🔥 Firecrawl: Found ${data.data.length} results.`);

            // Combine snippets into a context blob
            return data.data.map((item: any) => `[${item.title}]: ${item.description}`).join('\n\n');
        } catch (error) {
            console.error("Firecrawl Fetch Failed:", error);
            throw error;
        }
    }

    /**
     * Uses Gemini to analyze the SERP data and output structured JSON
     */
    private async synthesizeMarketData(keyword: string, serpData: string, mode: 'KDP' | 'POD'): Promise<NicheAnalysis> {
        const geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || process.env.GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Gemini API Key missing (VITE_GEMINI_API_KEY)");

        const contextInstruction = mode === 'KDP'
            ? "Focus on Book Titles, Subtitles, and Series ideas."
            : "Focus on T-Shirt Slogans, Sticker Designs, and Merch Aesthetics.";

        const prompt = `
        Act as a Strategic Market Analyst for ${mode} (Print on Demand). 
        Analyze this niche based on real-time search results.
        
        NICHE: "${keyword}"
        MODE: ${mode}
        SEARCH CONTEXT:
        ${serpData}

        ${contextInstruction}

        Output purely VALID JSON with this schema:
        {
            "demandScore": (number 0-100),
            "saturationIndex": ("Very Low"|"Low"|"Medium"|"High"|"Oversaturated"),
            "keywordVolume": ("Critical Mass"|"High"|"Moderate"|"Low"),
            "opportunity": ("Gold Mine"|"Viable"|"Risky"|"Dead"),
            "aiInsight": "1 short actionable sentence advice",
            "relatedKeywords": ["keyword1", "keyword2", "keyword3"],
            "topOpportunities": [
                {
                    "title": "Specific Title or Slogan Idea",
                    "description": "Brief design/content strategy",
                    "demand": "High"|"Medium"|"Low",
                    "competition": "High"|"Medium"|"Low",
                    "estimatedRoyalty": "$X.XX / sale",
                    "tags": ["tag1", "tag2"]
                }
            ] (Provide exactly 5 distinct opportunities)
        }
        `;

        // List of models to try in order of preference
        const models = [
            'gemini-1.5-flash-latest',
            'gemini-1.5-flash',
            'gemini-1.5-flash-001',
            'gemini-1.5-pro-latest',
            'gemini-pro',
            'gemini-1.0-pro'
        ];

        let lastError: any;
        const jsonMode = true; // Assuming we always want JSON mode if available

        for (const model of models) {
            for (const version of ['v1beta', 'v1']) {
                try {
                    const response = await fetch(`https://generativelanguage.googleapis.com/${version}/models/${model}:generateContent?key=${geminiKey}`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            contents: [{ parts: [{ text: prompt }] }],
                            generationConfig: {
                                temperature: 0.7,
                                responseMimeType: (jsonMode && version === 'v1beta') ? "application/json" : undefined
                            }
                        })
                    });

                    if (!response.ok) {
                        const err = await response.json().catch(() => ({ error: { message: response.statusText } }));
                        throw new Error(`(${response.status}) ${err.error?.message || response.statusText}`);
                    }

                    const json = await response.json();
                    const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

                    if (!rawText) throw new Error("Gemini returned empty analysis");

                    return JSON.parse(rawText) as NicheAnalysis;

                } catch (e: any) {
                    lastError = e;
                }
            }
        }

        throw new Error(`Market Radar Synth Failed (All Gemini Models): ${lastError?.message}`);
    }

    private getSimulatedData(keyword: string, mode: 'KDP' | 'POD'): NicheAnalysis {
        // Deterministic hash
        const hash = keyword.length;
        const score = 40 + (hash * 3) % 55;

        const opportunities: NicheOpportunity[] = mode === 'KDP' ? [
            {
                title: `${keyword} Logbook for Beginners`,
                description: "Simple low-content book with tracking pages.",
                demand: "High", competition: "Low", estimatedRoyalty: "$2.15 / sale", tags: ["logbook", "tracker"]
            },
            {
                title: `The Ultimate ${keyword} Guide`,
                description: "Comprehensive non-fiction guide.",
                demand: "Medium", competition: "Medium", estimatedRoyalty: "$4.50 / sale", tags: ["guide", "howto"]
            },
            {
                title: `${keyword} Coloring Book`,
                description: "Relaxing patterns related to the niche.",
                demand: "High", competition: "Medium", estimatedRoyalty: "$2.50 / sale", tags: ["coloring", "relax"]
            },
            {
                title: `${keyword} for Kids`,
                description: "Simplified educational content.",
                demand: "Medium", competition: "Low", estimatedRoyalty: "$3.20 / sale", tags: ["kids", "education"]
            },
            {
                title: `Funny ${keyword} Journal`,
                description: "Lined notebook with witty cover.",
                demand: "Low", competition: "High", estimatedRoyalty: "$1.90 / sale", tags: ["journal", "gift"]
            }
        ] : [
            {
                title: "Vintage Retro " + keyword,
                description: "Distressed 70s sunset style.",
                demand: "High", competition: "High", estimatedRoyalty: "$4.00 / sale", tags: ["retro", "vintage"]
            },
            {
                title: "Minimalist " + keyword + " Icon",
                description: "Clean simple line art.",
                demand: "Medium", competition: "Low", estimatedRoyalty: "$3.50 / sale", tags: ["minimal", "icon"]
            },
            {
                title: "Funny Quote about " + keyword,
                description: "Bold typography slogan.",
                demand: "High", competition: "Medium", estimatedRoyalty: "$3.80 / sale", tags: ["funny", "text"]
            },
            {
                title: "Neon Cyberpunk " + keyword,
                description: "Glowing futuristic aesthetic.",
                demand: "Medium", competition: "Low", estimatedRoyalty: "$4.20 / sale", tags: ["neon", "cyberpunk"]
            },
            {
                title: "Cute Kawaii " + keyword,
                description: "Adorable character design.",
                demand: "High", competition: "High", estimatedRoyalty: "$3.50 / sale", tags: ["cute", "kawaii"]
            }
        ];

        return {
            demandScore: score,
            saturationIndex: score > 80 ? 'Low' : (score > 60 ? 'Medium' : 'High'),
            keywordVolume: score > 75 ? 'Critical Mass' : 'Moderate',
            opportunity: score > 80 ? 'Gold Mine' : 'Viable',
            aiInsight: `Simulated ${mode} analysis for '${keyword}': Promising signals detected in sub-niche categories.`,
            relatedKeywords: [`${keyword} ideas`, `best ${keyword}`, `${keyword} gift`],
            topOpportunities: opportunities
        };
    }
}

export const marketService = new MarketService();
