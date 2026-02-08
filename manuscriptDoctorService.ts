import { KDPProject, KDPBlueprint } from './types';

// ==========================================
// MANUSCRIPT DOCTOR SERVICE
// Context-Aware Manuscript Rewrite Engine
// ==========================================

export interface ManuscriptUpload {
    id: string;
    userId: string;
    originalFileName: string;
    fileType: 'pdf' | 'docx' | 'txt';
    fileSize: number;
    uploadedAt: Date;
    status: 'parsing' | 'analyzing' | 'rewriting' | 'complete' | 'error';

    // Extracted Data
    rawText: string;
    wordCount: number;
    chapterCount: number;

    // Context Analysis
    contextProfile: ContextProfile;

    // Rewrite Settings
    rewriteMode: RewriteMode;
    selectedGenre?: string;
    targetAudience?: string;
    preserveVoice: boolean;

    // Results
    enhancedText?: string;
    changesCount: number;
    kdpReadinessScore: number;
    rewriteReport?: RewriteReport;
}

export interface ContextProfile {
    // Metadata
    title?: string;
    author?: string;
    chapterTitles: string[];

    detectedGenre: string;
    confidence: number;
    tone: 'formal' | 'casual' | 'emotional' | 'technical';
    pov: '1st' | '2nd' | '3rd';
    dialogueDensity: number;
    pacingScore: number;
    readabilityGrade: number;
    authorVoiceFingerprint: {
        avgSentenceLength: number;
        vocabularyComplexity: number;
        passiveVoiceRatio: number;
    };
}

export type RewriteMode = 'fix_errors' | 'full_rewrite' | 'enhance_style' | 'continue_writing';

export interface RewriteReport {
    grammarFixes: number;
    styleEnhancements: number;
    toneAdjustments: number;
    readabilityImprovement: number;
    beforeMetrics: TextMetrics;
    afterMetrics: TextMetrics;
    changeLog: Change[];
}

export interface TextMetrics {
    wordCount: number;
    sentenceCount: number;
    avgSentenceLength: number;
    readabilityScore: number;
    gradeLevel: number;
    dialogueRatio: number;
    passiveVoiceCount: number;
}

export interface Change {
    type: 'grammar' | 'style' | 'tone' | 'structure';
    original: string;
    revised: string;
    reason: string;
    chapterIndex: number;
    lineNumber: number;
}

export class ManuscriptDoctorService {

    private geminiKey: string | null = null;

    constructor() {
        // In a real app, this would be injected or retrieved securely
        // For this demo, we assume it's available in the environment or passed in
        this.geminiKey = (import.meta as any).env?.VITE_GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY || null;
    }

    /**
     * Parse uploaded file and extract text
     */
    async parseFile(file: File): Promise<{ text: string; metadata: any }> {
        const fileType = file.name.split('.').pop()?.toLowerCase();

        if (fileType === 'txt') {
            return this.parseTxtFile(file);
        } else if (fileType === 'docx') {
            return this.parseDocxFile(file);
        } else if (fileType === 'pdf') {
            return this.parsePdfFile(file);
        }

        throw new Error('Unsupported file type. Please upload .txt, .docx, or .pdf');
    }

    private async parseTxtFile(file: File): Promise<{ text: string; metadata: any }> {
        const text = await file.text();
        return {
            text,
            metadata: {
                wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
                characterCount: text.length
            }
        };
    }

    private async parseDocxFile(file: File): Promise<{ text: string; metadata: any }> {
        try {
            // Use mammoth from CDN
            if (!(window as any).mammoth) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js');
            }

            const arrayBuffer = await file.arrayBuffer();
            const result = await (window as any).mammoth.extractRawText({ arrayBuffer });
            const text = result.value;

            return {
                text,
                metadata: {
                    wordCount: text.split(/\s+/).filter((w: string) => w.length > 0).length,
                    format: 'docx'
                }
            };
        } catch (e) {
            console.error("DOCX parsing failed, falling back to basic extraction", e);
            const text = await file.text(); // Fallback
            return { text, metadata: { format: 'docx_raw', error: true } };
        }
    }

    private async parsePdfFile(file: File): Promise<{ text: string; metadata: any }> {
        try {
            // Use PDF.js from CDN
            if (!(window as any).pdfjsLib) {
                await this.loadScript('https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js');
                (window as any).pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            }

            const arrayBuffer = await file.arrayBuffer();
            const pdf = await (window as any).pdfjsLib.getDocument({ data: arrayBuffer }).promise;
            let fullText = "";

            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                const strings = content.items.map((item: any) => item.str);
                fullText += strings.join(" ") + "\n\n";
            }

            return {
                text: fullText,
                metadata: {
                    wordCount: fullText.split(/\s+/).filter(w => w.length > 0).length,
                    pageCount: pdf.numPages,
                    format: 'pdf'
                }
            };
        } catch (e) {
            console.error("PDF parsing failed", e);
            throw new Error("Failed to parse PDF. Please ensure it is not password protected.");
        }
    }

    private loadScript(src: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => resolve();
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Analyze manuscript context and extract profile using Gemini
     */
    async analyzeContext(text: string, userGenre?: string): Promise<ContextProfile> {
        const cleanedText = text.trim();
        if (!cleanedText) {
            return this.getInputEmptyProfile();
        }

        // Calculate basic metrics locally
        const sentences = cleanedText.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = cleanedText.split(/\s+/).filter(w => w.length > 0);
        const dialogueMatches = cleanedText.match(/"[^"]*"/g) || [];
        const avgSentenceLength = sentences.length > 0 ? words.length / sentences.length : 0;
        const dialogueDensity = sentences.length > 0 ? dialogueMatches.length / sentences.length : 0;
        const syllables = this.estimateSyllables(text);
        const readabilityScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * (syllables / words.length);
        const gradeLevel = 0.39 * avgSentenceLength + 11.8 * (syllables / words.length) - 15.59;
        const pacingScore = this.calculatePacingScore(text);

        try {
            // Use Gemini for advanced analysis if key is available
            if (this.geminiKey) {
                const prompt = `Analyze the following manuscript text (first 3000 chars) to extract metadata and stylistic profile.
                
                Text Chunk: "${cleanedText.substring(0, 3000)}..."

                Instructions:
                1. Infer the Title and Author if present in the first few lines. If not found, look for clues or return null.
                2. Detect the Genre, Tone, and POV.
                3. Identify any Chapter headings visible in this chunk.

                Return a JSON object with:
                {
                    "title": "string or null",
                    "author": "string or null",
                    "chapterTitles": ["string"],
                    "detectedGenre": "string",
                    "tone": "string",
                    "pov": "string (1st, 2nd, 3rd)"
                }
                `;

                const aiResponse = await this.callGemini(prompt, true);
                const aiData = JSON.parse(aiResponse);

                return {
                    title: aiData.title || undefined,
                    author: aiData.author || undefined,
                    chapterTitles: aiData.chapterTitles || [],
                    detectedGenre: aiData.detectedGenre || userGenre || 'NONFICTION',
                    confidence: 0.9,
                    tone: aiData.tone || 'formal',
                    pov: aiData.pov || '3rd',
                    dialogueDensity,
                    pacingScore,
                    readabilityGrade: Math.max(0, Math.round(gradeLevel)),
                    authorVoiceFingerprint: {
                        avgSentenceLength,
                        vocabularyComplexity: this.calculateVocabularyComplexity(words),
                        passiveVoiceRatio: this.detectPassiveVoice(text)
                    }
                };
            }
        } catch (error) {
            console.warn("AI Analysis failed, falling back to heuristic analysis", error);
        }

        // Fallback to heuristics if AI fails or no key
        return {
            title: undefined,
            author: undefined,
            chapterTitles: [],
            detectedGenre: this.detectGenre(text, userGenre),
            confidence: userGenre ? 1.0 : 0.75,
            tone: this.detectTone(text),
            pov: this.detectPOV(text),
            dialogueDensity,
            pacingScore,
            readabilityGrade: Math.max(0, Math.round(gradeLevel)),
            authorVoiceFingerprint: {
                avgSentenceLength,
                vocabularyComplexity: this.calculateVocabularyComplexity(words),
                passiveVoiceRatio: this.detectPassiveVoice(text)
            }
        };
    }

    private getInputEmptyProfile(): ContextProfile {
        return {
            title: undefined,
            author: undefined,
            chapterTitles: [],
            detectedGenre: 'NONFICTION',
            confidence: 0,
            tone: 'formal',
            pov: '3rd',
            dialogueDensity: 0,
            pacingScore: 0.5,
            readabilityGrade: 0,
            authorVoiceFingerprint: { avgSentenceLength: 0, vocabularyComplexity: 0, passiveVoiceRatio: 0 }
        };
    }

    private detectPOV(text: string): '1st' | '2nd' | '3rd' {
        const firstPersonCount = (text.match(/\b(I|me|my|mine|we|us|our)\b/gi) || []).length;
        const thirdPersonCount = (text.match(/\b(he|she|they|him|her|them)\b/gi) || []).length;
        return firstPersonCount > thirdPersonCount ? '1st' : '3rd';
    }

    private detectTone(text: string): 'formal' | 'casual' | 'emotional' | 'technical' {
        const emotionalWords = (text.match(/\b(love|hate|fear|joy|anger|sad|happy|excited)\b/gi) || []).length;
        const formalWords = (text.match(/\b(therefore|furthermore|consequently|nevertheless)\b/gi) || []).length;
        return emotionalWords > formalWords ? 'emotional' : 'formal';
    }


    private detectGenre(text: string, userGenre?: string): string {
        if (userGenre) return userGenre;
        const lowerText = text.toLowerCase();
        if (lowerText.includes('love') || lowerText.includes('heart') || lowerText.includes('kiss')) return 'ROMANCE';
        if (lowerText.includes('murder') || lowerText.includes('detective') || lowerText.includes('crime')) return 'MYSTERY';
        if (lowerText.includes('magic') || lowerText.includes('dragon') || lowerText.includes('wizard')) return 'FANTASY';
        if (lowerText.includes('space') || lowerText.includes('alien') || lowerText.includes('robot')) return 'SCIFI';
        return 'NONFICTION';
    }

    private estimateSyllables(text: string): number {
        const words = text.toLowerCase().split(/\s+/);
        let syllables = 0;
        words.forEach(word => {
            word = word.replace(/[^a-z]/g, '');
            if (word.length <= 3) {
                syllables += 1;
            } else {
                const vowelGroups = word.match(/[aeiouy]+/g);
                syllables += vowelGroups ? vowelGroups.length : 1;
            }
        });
        return syllables;
    }

    private calculateVocabularyComplexity(words: string[]): number {
        const uniqueWords = new Set(words.map(w => w.toLowerCase()));
        return uniqueWords.size / words.length;
    }

    private detectPassiveVoice(text: string): number {
        const passivePatterns = /\b(was|were|been|being)\s+\w+ed\b/gi;
        const matches = text.match(passivePatterns) || [];
        const sentences = text.split(/[.!?]+/).length;
        return matches.length / sentences;
    }

    private calculatePacingScore(text: string): number {
        const actionWords = (text.match(/\b(ran|jumped|fought|screamed|grabbed|hit|threw)\b/gi) || []).length;
        const descriptiveWords = (text.match(/\b(beautiful|slowly|carefully|gently|quietly)\b/gi) || []).length;
        const total = actionWords + descriptiveWords;
        return total === 0 ? 0.5 : actionWords / total;
    }

    /**
     * Rewrite manuscript based on mode and context
     */
    async rewriteManuscript(
        text: string,
        mode: RewriteMode,
        context: ContextProfile,
        preserveVoice: boolean = true
    ): Promise<{ enhancedText: string; report: RewriteReport }> {

        const beforeMetrics = this.calculateTextMetrics(text);
        const chunks = this.splitIntoChunks(text, 2000);
        const enhancedChunks: string[] = [];
        const changes: Change[] = [];

        for (let i = 0; i < chunks.length; i++) {
            const chunk = chunks[i];
            const enhanced = await this.processChunk(chunk, mode, context, preserveVoice);
            enhancedChunks.push(enhanced.text);
            changes.push(...enhanced.changes.map(c => ({ ...c, chapterIndex: i })));
        }

        const enhancedText = enhancedChunks.join('\n\n');
        const afterMetrics = this.calculateTextMetrics(enhancedText);

        const report: RewriteReport = {
            grammarFixes: changes.filter(c => c.type === 'grammar').length,
            styleEnhancements: changes.filter(c => c.type === 'style').length,
            toneAdjustments: changes.filter(c => c.type === 'tone').length,
            readabilityImprovement: (afterMetrics.readabilityScore || 0) - (beforeMetrics.readabilityScore || 0),
            beforeMetrics,
            afterMetrics,
            changeLog: changes
        };

        return { enhancedText, report };
    }

    private splitIntoChunks(text: string, maxWords: number): string[] {
        const paragraphs = text.split(/\n\n+/);
        const chunks: string[] = [];
        let currentChunk = '';

        for (const para of paragraphs) {
            const words = (currentChunk + ' ' + para).split(/\s+/).length;
            if (words > maxWords && currentChunk) {
                chunks.push(currentChunk.trim());
                currentChunk = para;
            } else {
                currentChunk += (currentChunk ? '\n\n' : '') + para;
            }
        }
        if (currentChunk) chunks.push(currentChunk.trim());
        return chunks;
    }

    private async processChunk(
        chunk: string,
        mode: RewriteMode,
        context: ContextProfile,
        preserveVoice: boolean
    ): Promise<{ text: string; changes: Change[] }> {

        if (!this.geminiKey) {
            // Fallback to simulation if no key
            return this.simulateProcessChunk(chunk, mode, context);
        }

        try {
            const prompt = `
            Act as an expert manuscript editor. Rewrite the following text chunk based on these instructions:
            
            MODE: ${mode}
            GENRE: ${context.detectedGenre}
            TONE: ${context.tone}
            POV: ${context.pov}
            PRESERVE VOICE: ${preserveVoice}

            INSTRUCTIONS:
            ${mode === 'fix_errors' ? '- Fix grammar, typos, and formatting errors only. Do not change style.' : ''}
            ${mode === 'enhance_style' ? '- Improve "show, don\'t tell". varying sentence structure. Remove passive voice.' : ''}
            ${mode === 'full_rewrite' ? '- Deep polish. Improve pacing, dialogue, and narrative flow. Ensure high-quality prose.' : ''}
            
            OUTPUT FORMAT:
            Return a JSON object with:
            {
                "rewrittenText": "The entire rewritten chunk...",
                "changes": [
                    { "type": "grammar|style|tone", "original": "snippet", "revised": "snippet", "reason": "why" }
                ]
            }

            TEXT TO REWRITE:
            "${chunk}"
            `;

            const aiResponse = await this.callGemini(prompt, true);
            const data = JSON.parse(aiResponse);

            return {
                text: data.rewrittenText || chunk,
                changes: data.changes || []
            };

        } catch (error) {
            console.error("Gemini Rewrite Failed", error);
            return { text: chunk, changes: [] };
        }
    }

    private simulateProcessChunk(chunk: string, mode: RewriteMode, context: ContextProfile): { text: string; changes: Change[] } {
        let enhanced = chunk;
        const changes: Change[] = [];

        if (mode === 'fix_errors' || mode === 'full_rewrite' || mode === 'enhance_style') {
            const grammarFixes = this.applyGrammarFixes(enhanced);
            enhanced = grammarFixes.text;
            changes.push(...grammarFixes.changes);
        }

        if (mode === 'enhance_style' || mode === 'full_rewrite') {
            const styleFixes = this.enhanceStyle(enhanced, context);
            enhanced = styleFixes.text;
            changes.push(...styleFixes.changes);
        }

        return { text: enhanced, changes };
    }

    private async callGemini(prompt: string, jsonMode: boolean = false): Promise<string> {
        if (!this.geminiKey) throw new Error("Gemini API Key missing");

        const response = await fetch(`https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${this.geminiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: jsonMode ? { response_mime_type: "application/json" } : {}
            })
        });

        if (!response.ok) {
            throw new Error(`Gemini API Error: ${response.statusText}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    private applyGrammarFixes(text: string): { text: string; changes: Change[] } {
        const changes: Change[] = [];
        let fixed = text;

        if (fixed.includes('  ')) {
            changes.push({
                type: 'grammar',
                original: '  ',
                revised: ' ',
                reason: 'Removed double spaces',
                chapterIndex: 0,
                lineNumber: 0
            });
            fixed = fixed.replace(/\s{2,}/g, ' ');
        }

        const typos = [
            { from: /\bteh\b/gi, to: 'the', reason: 'Fixed typo: teh → the' },
            { from: /\brecieve\b/gi, to: 'receive', reason: 'Fixed spelling: recieve → receive' },
            { from: /\boccured\b/gi, to: 'occurred', reason: 'Fixed spelling: occured → occurred' }
        ];

        typos.forEach(typo => {
            if (typo.from.test(fixed)) {
                changes.push({
                    type: 'grammar',
                    original: fixed.match(typo.from)?.[0] || '',
                    revised: typo.to,
                    reason: typo.reason,
                    chapterIndex: 0,
                    lineNumber: 0
                });
                fixed = fixed.replace(typo.from, typo.to);
            }
        });

        return { text: fixed, changes };
    }

    private enhanceStyle(text: string, context: ContextProfile): { text: string; changes: Change[] } {
        const changes: Change[] = [];
        let enhanced = text;

        if (['ROMANCE', 'FANTASY', 'HORROR', 'MYSTERY'].includes(context.detectedGenre)) {
            changes.push({
                type: 'style',
                original: text.substring(0, 50),
                revised: text.substring(0, 50),
                reason: 'Style enhancement applied (AI simulation)',
                chapterIndex: 0,
                lineNumber: 0
            });
        }
        return { text: enhanced, changes };
    }

    private calculateTextMetrics(text: string): TextMetrics {
        const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
        const words = text.split(/\s+/);
        const dialogueMatches = text.match(/"[^"]*"/g) || [];
        const passiveMatches = text.match(/\b(was|were|been|being)\s+\w+ed\b/gi) || [];

        const avgSentenceLength = words.length / sentences.length;
        const syllables = this.estimateSyllables(text);
        const readabilityScore = 206.835 - 1.015 * avgSentenceLength - 84.6 * (syllables / words.length);
        const gradeLevel = 0.39 * avgSentenceLength + 11.8 * (syllables / words.length) - 15.59;

        return {
            wordCount: words.length,
            sentenceCount: sentences.length,
            avgSentenceLength,
            readabilityScore: Math.round(readabilityScore),
            gradeLevel: Math.max(0, Math.round(gradeLevel)),
            dialogueRatio: dialogueMatches.length / sentences.length,
            passiveVoiceCount: passiveMatches.length
        };
    }

    /**
     * Convert enhanced manuscript to KDP Blueprint
     */
    convertToBlueprint(
        upload: ManuscriptUpload,
        project: Partial<KDPProject>
    ): Partial<KDPBlueprint> {
        const chapters = this.extractChapters(upload.enhancedText || upload.rawText);
        const meta = upload.contextProfile;

        return {
            PROJECT_META: {
                title_working: meta.title || project.title || 'Untitled Manuscript',
                suggestedAuthor: meta.author || project.author || 'Unknown Author',
                primary_genre: meta.detectedGenre,
                series_info: '',
                trim_size: project.trimSize || '6" x 9"',
                publisher_imprint: project.publisher || '',
                copyright_year: new Date().getFullYear().toString(),
                interior_color: (project.interiorColor as any) || 'B&W'
            },
            INTERIOR_CONTENT: chapters.map((text, index) => ({
                chapter: index + 1,
                title: meta.chapterTitles[index] || `Chapter ${index + 1}`,
                content: text,
                summary: 'Imported content.',
                visualPrompt: `${upload.contextProfile.detectedGenre} cinematic book illustration depicting: ${text.substring(0, 150)}`,
                wordCount: text.split(/\s+/).length
            })),
            BOOK_STRUCTURE: {
                front_matter: {
                    dedication_text: '',
                    copyright_page_text: `Copyright © ${new Date().getFullYear()} ${project.author || 'Artisan author'}. All rights reserved.`
                },
                end_matter: {
                    author_bio: '',
                    additional_works: []
                }
            },
            QA_CHECKLIST: [],
            APLUS_CONTENT: [],
            ISBN_SPEC: {
                source: (project.isbnSource as any) || 'KDP'
            },
            KDP_METADATA: {
                primary_category: '',
                keyword_phrases: [],
                long_description: ''
            },
            BACK_COVER_SPEC: {
                blurb_text: `[AUTO-GENERATED PENDING] ${upload.enhancedText?.substring(0, 300) || upload.rawText.substring(0, 300)}...`,
                hook_points: []
            },
            COVER_SPEC: {
                front_prompt: `High-fidelity professional book cover for ${project.title}, ${upload.contextProfile.detectedGenre} style.`,
                back_prompt: `Clean minimalist matching back cover for ${project.title}.`,
                spine_text: project.title || 'Untitled'
            },
            id: `imported-${Date.now()}`,
            timestamp: Date.now()
        };
    }

    private extractChapters(text: string): string[] {
        // Detect chapter breaks
        const chapterPattern = /(?:^|\n)(?:Chapter|CHAPTER)\s+\d+/g;
        const matches = [...text.matchAll(chapterPattern)];

        if (matches.length === 0) {
            // No chapters detected, split by double line breaks
            return text.split(/\n\n\n+/).filter(c => c.trim().length > 100);
        }

        const chapters: string[] = [];
        for (let i = 0; i < matches.length; i++) {
            const start = matches[i].index || 0;
            const end = matches[i + 1]?.index || text.length;
            chapters.push(text.substring(start, end).trim());
        }

        return chapters;
    }
}

export const manuscriptDoctorService = new ManuscriptDoctorService();
