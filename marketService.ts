
import { google } from '@ai-sdk/google';
import { generateObject } from 'ai';
import { z } from 'zod';

// Define the shape of our Market Intelligence
export interface NicheAnalysis {
    demandScore: number;      // 0-100
    saturationIndex: string;  // "Very Low", "Low", "Medium", "High", "Oversaturated"
    keywordVolume: string;    // "Critical Mass", "High", "Moderate", "Low"
    opportunity: string;      // "Gold Mine", "Viable", "Risky", "Dead"
    aiInsight: string;        // 1-2 sentence actionable advice
    relatedKeywords: string[];
}

export class MarketService {
    private apiKey: string;
    private baseUrl = 'https://api.firecrawl.dev/v1';

    constructor() {
        this.apiKey = import.meta.env.VITE_FIRECRAWL_API_KEY || '';
    }

    /**
     * PRIMARY ENGINE: Analyzes a niche by scraping live Google/Amazon signals via Firecrawl
     * and synthesizing the result with Gemini 1.5 Flash.
     */
    async analyzeNiche(rawKeyword: string): Promise<NicheAnalysis> {
        if (!rawKeyword) throw new Error("Keyword required");

        // 1. If no key, return simulated "Demo Mode" data (strictly for non-devs)
        if (!this.apiKey || this.apiKey.includes('YOUR_KEY_HERE')) {
            console.warn("⚠️ MarketService: No Firecrawl Key found. Returning SIMULATED data.");
            return this.getSimulatedData(rawKeyword);
        }

        try {
            // 2. REAL-TIME SCRAPING: Check "Best Sellers" context
            // We search for the keyword + "Amazon Best Sellers" to see what comes up
            // This avoids scraping Amazon directly (anti-bot) but gets the SERP intelligence
            const scrapeResult = await this.performSearch(`"${rawKeyword}" amazon best sellers books`);

            // 3. INTELLIGENCE SYNTHESIS: Feed raw SERP data to Gemini
            const intelligence = await this.synthesizeMarketData(rawKeyword, scrapeResult);

            return intelligence;

        } catch (error) {
            console.error("Market Radar Failed:", error);
            // Fallback to simulation on error to keep UI alive
            return this.getSimulatedData(rawKeyword);
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
    private async synthesizeMarketData(keyword: string, serpData: string): Promise<NicheAnalysis> {
        // We use the 'ai' SDK pattern for structured output
        // Note: In a client-side Vite app, we might need to call our existing geminiService 
        // to avoid exposing the Google Key if we were using the SDK directly here.
        // BUT, since we already expose VITE_GEMINI_API_KEY, we can use a direct prompt pattern
        // that matches our existing service architecture.

        // For simplicity/speed in this prototype, let's assume we use the existing global Gemini integration
        // or a direct fetch to the endpoint if we want lightweight logic.

        // Let's use a robust fetch to Gemini API directly to ensure specific JSON formatting.
        const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
        if (!geminiKey) throw new Error("Gemini API Key missing");

        const prompt = `
        Act as a KDP Market Analyst. Analyze this niche based on search results.
        
        NICHE: "${keyword}"
        SEARCH CONTEXT:
        ${serpData}

        Output purely VALID JSON with this schema:
        {
            "demandScore": (number 0-100),
            "saturationIndex": ("Very Low"|"Low"|"Medium"|"High"|"Oversaturated"),
            "keywordVolume": ("Critical Mass"|"High"|"Moderate"|"Low"),
            "opportunity": ("Gold Mine"|"Viable"|"Risky"|"Dead"),
            "aiInsight": "1 short actionable sentence advice",
            "relatedKeywords": ["keyword1", "keyword2", "keyword3"]
        }
        `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { response_mime_type: "application/json" }
            })
        });

        const json = await response.json();
        const rawText = json.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!rawText) throw new Error("Gemini returned empty analysis");

        return JSON.parse(rawText) as NicheAnalysis;
    }

    private getSimulatedData(keyword: string): NicheAnalysis {
        // Deterministic has based on keyword length to make it feel consistent
        const hash = keyword.length;
        const score = 40 + (hash * 3) % 55; // Randomish score 40-95

        return {
            demandScore: score,
            saturationIndex: score > 80 ? 'Low' : (score > 60 ? 'Medium' : 'High'),
            keywordVolume: score > 75 ? 'Critical Mass' : 'Moderate',
            opportunity: score > 80 ? 'Gold Mine' : 'Viable',
            aiInsight: `Simulated analysis for '${keyword}': High potential in paperback formats based on keyword trends.`,
            relatedKeywords: [`${keyword} for beginners`, `${keyword} guide`, `best ${keyword} 2026`]
        };
    }
}

export const marketService = new MarketService();
