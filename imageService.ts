/**
 * IMAGE GENERATION SERVICE
 * Environment-aware routing for image generation.
 * 
 * LOCAL MODE: Uses Canvas-based generation (zero API costs)
 * PRODUCTION MODE: Uses Fal.ai Flux (industrial-grade quality)
 */

import { coverGenerator } from './coverGenerator';
import { isLocalMode, isProductionMode } from './environmentConfig';

export interface ImageGenerationOptions {
    prompt: string;
    width?: number;
    height?: number;
    model?: 'schnell' | 'dev' | 'pro'; // Fal.ai Flux variants
    numInferenceSteps?: number;
    guidanceScale?: number;
    module?: 'POD' | 'KDP' | 'MOCKUP' | 'KDP_INTERIOR' | 'KDP_COVER';
    title?: string;
    author?: string;
    genre?: string;
}

export class ImageService {
    /**
     * Generate an image with environment-aware routing
     */
    /**
     * Generate an image with environment-aware routing
     */
    async generateImage(options: ImageGenerationOptions): Promise<string> {
        // FORCE CANVAS FOR KDP_INTERIOR TO TEST ENHANCED DESIGNS
        if (options.module === 'KDP_INTERIOR') {
            console.log('🎨 [FORCE] Using Canvas for KDP_INTERIOR to test enhanced designs');
            return this.generateWithCanvas(options);
        }

        // FORCE CANVAS FOR KDP_COVER TO TEST ENHANCED DESIGNS
        if (options.module === 'KDP_COVER') {
            console.log('📚 [FORCE] Using Canvas for KDP_COVER to test enhanced designs');
            return this.generateWithCanvas(options);
        }

        if (isLocalMode()) {
            console.log('🏠 LOCAL MODE: Using Canvas generation (zero API costs)');
            return this.generateWithCanvas(options);
        }

        const apiKey = process.env.VITE_FAL_API_KEY;
        // If we have a valid key, try Fal first
        if (apiKey && !apiKey.includes('PLACEHOLDER')) {
            console.log('🚀 PRODUCTION MODE: Using Fal.ai Flux');
            return this.generateWithFal(options);
        }

        // If no key, default to Pollinations
        console.log('🚀 PRODUCTION MODE: No Fal Key found, using Pollinations AI (Free)');
        return this.generateWithPollinations(options);
    }

    /**
     * LOCAL MODE: Canvas-based generation
     */
    private async generateWithCanvas(options: ImageGenerationOptions): Promise<string> {
        const { prompt, width = 5400, height = 5000, module, title, genre } = options; // DEFAULT to minimum 5400×5000px

        try {
            // Specialized Canvas generation for book interiors
            if (module === 'KDP_INTERIOR') {
                console.log('📖 [ENHANCED] Generating creative chapter illustration...');
                console.log('🎨 [DEBUG] Module:', module, 'Title:', title, 'Genre:', genre);
                // Use our new enhanced chapter illustration method
                // Extract chapter number from prompt or title
                const chapterMatch = prompt.match(/chapter\s*(\d+)/i) || title?.match(/chapter\s*(\d+)/i);
                const chapterIndex = chapterMatch ? parseInt(chapterMatch[1]) - 1 : 0;
                const totalChapters = 10; // Default estimate
                const chapterTitle = title || 'Chapter ' + (chapterIndex + 1);
                
                console.log('🔢 [DEBUG] Chapter Index:', chapterIndex, 'Chapter Title:', chapterTitle);
                
                return await coverGenerator.generateChapterIllustration(
                    chapterTitle,
                    prompt, // Use prompt as content
                    genre || 'Fiction',
                    chapterIndex,
                    totalChapters
                );
            }

            // Specialized Canvas generation for book covers
            if (module === 'KDP_COVER') {
                console.log('📚 Generating creative cover design...');
                return await coverGenerator.generateCover({
                    title: title || 'Untitled Book',
                    author: 'Author Name',
                    genre: genre || 'Fiction',
                    width,
                    height
                });
            }

            // Use existing Canvas generator for generic placeholders
            const dataUrl = await coverGenerator.generateGenericPlaceholder(
                prompt,
                width,
                height
            );
            console.log('✅ Canvas generation successful');
            return dataUrl;
        } catch (error: any) {
            console.error('❌ Canvas generation failed:', error.message);
            throw new Error(`Canvas generation failed: ${error.message}`);
        }
    }


    /**
     * POLLINATIONS AI: Free, High-Quality Generation
     * Note: Rate limits apply - will fallback to Canvas if rate limited
     */
    private async generateWithPollinations(options: ImageGenerationOptions): Promise<string> {
        const { prompt, width = 1024, height = 1024 } = options;

        const encodedPrompt = encodeURIComponent(prompt);

        // Try multiple models on Pollinations (reduced list for faster fallback)
        const pollinationModels = ['flux', 'turbo'];
        let lastError: any = null;
        let isRateLimited = false;

        for (const pModel of pollinationModels) {
            try {
                console.log(`📡 Pollinations attempt: model=${pModel}...`);
                const seed = Math.floor(Math.random() * 1000000);
                const modelParam = `&model=${pModel}`;
                const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}${modelParam}`;

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout

                const response = await fetch(url, { 
                    mode: 'cors',
                    signal: controller.signal
                });
                clearTimeout(timeoutId);

                // Check for rate limiting
                if (response.status === 429 || response.status === 503) {
                    isRateLimited = true;
                    throw new Error(`Rate limited (${response.status})`);
                }

                if (!response.ok) {
                    throw new Error(`Model ${pModel} failed with status: ${response.status}`);
                }

                const blob = await response.blob();
                
                // Check for rate limit image (usually small placeholder)
                if (blob.size < 5000) {
                    isRateLimited = true;
                    throw new Error("Rate limit placeholder detected (small image)");
                }

                // Convert blob to data URL for consistency with other generators
                return await new Promise<string>((resolve, reject) => {
                    const reader = new FileReader();
                    reader.onloadend = () => resolve(reader.result as string);
                    reader.onerror = reject;
                    reader.readAsDataURL(blob);
                });
            } catch (e: any) {
                console.warn(`⚠️ Pollinations Model ${pModel} failed:`, e.message);
                lastError = e;
                
                // Check for specific error types
                if (e.message.includes('530') || e.message.includes('origin')) {
                    console.warn('🌐 Pollinations.ai appears to be down (HTTP 530)');
                    isRateLimited = false; // Don't treat as rate limiting
                } else if (e.message.includes('429') || e.message.includes('rate')) {
                    console.warn('⏱️ Pollinations rate limit reached');
                    isRateLimited = true;
                }
                continue;
            }
        }

        // FALLBACK: Use Canvas generation when Pollinations fails
        console.warn('🔄 Pollinations failed, falling back to Canvas generation...');
        try {
            return await this.generateWithCanvas({
                prompt,
                width,
                height
            });
        } catch (canvasError: any) {
            console.error('❌ Canvas fallback also failed:', canvasError.message);
            throw new Error(`Image generation failed: Pollinations (${lastError?.message}), Canvas (${canvasError.message})`);
        }
    }

    /**
     * PRODUCTION MODE: Fal.ai Flux generation
     */
    private async generateWithFal(options: ImageGenerationOptions): Promise<string> {
        const {
            prompt,
            width = 1024,
            height = 1024,
            model = 'schnell',
            numInferenceSteps = 4,
            guidanceScale = 3.5
        } = options;

        const apiKey = process.env.VITE_FAL_API_KEY;

        const modelMap = {
            'schnell': 'fal-ai/flux/schnell',
            'dev': 'fal-ai/flux/dev',
            'pro': 'fal-ai/flux-pro'
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

        try {
            const response = await fetch(`https://fal.run/${modelMap[model]}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Key ${apiKey}`
                },
                signal: controller.signal,
                body: JSON.stringify({
                    prompt,
                    image_size: {
                        width,
                        height
                    },
                    num_inference_steps: numInferenceSteps,
                    guidance_scale: guidanceScale,
                    num_images: 1,
                    enable_safety_checker: false
                })
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Fal.ai Error: ${response.status} - ${errorText}`);
            }

            const data = await response.json();
            const imageUrl = data.images?.[0]?.url;

            if (!imageUrl) {
                throw new Error('No image URL in Fal.ai response');
            }

            // Convert URL to data URL for consistency
            const imageDataUrl = await this.urlToDataUrl(imageUrl);
            console.log('✅ Fal.ai generation successful');
            return imageDataUrl;
        } catch (error: any) {
            clearTimeout(timeoutId);

            if (error.name === 'AbortError') {
                console.error('❌ Fal.ai request timeout');
                throw new Error('Image generation timeout (60s exceeded)');
            }

            console.error('❌ Fal.ai generation failed:', error.message);

            // Fallback strategy
            console.log('🔄 Attempting fallback to Pollinations...');
            return this.generateWithPollinations(options);
        }
    }

    /**
     * Convert image URL to data URL
     */
    private async urlToDataUrl(url: string): Promise<string> {
        try {
            const response = await fetch(url);
            const blob = await response.blob();

            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result as string);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
            });
        } catch (error) {
            console.error('Failed to convert URL to data URL:', error);
            throw error;
        }
    }

    /**
     * Generate a POD design with two-tier quality system
     * - Preview mode: Canvas (free, instant)
     * - Final mode: Pollinations (free) or Fal.ai (paid)
     */
    async generatePODDesign(options: {
        prompt: string;
        style: string;
        mode: 'preview' | 'final';
    }): Promise<string> {
        const fullPrompt = `${options.prompt}, ${options.style}`;

        if (options.mode === 'preview') {
            console.log('🎨 POD Preview Mode: Using Canvas (free)');
            // Always use Canvas for previews (unlimited, free)
            return this.generateWithCanvas({
                prompt: fullPrompt,
                width: 1024,
                height: 1024
            });
        }

        // FINAL MODE: Production-ready print design
        console.log('🖨️ POD Final Mode: Generating High-Res Asset...');

        if (isLocalMode()) {
            console.warn('⚠️ Local mode: Using Canvas for final');
            return this.generateWithCanvas({
                prompt: `${fullPrompt}, ultra high quality, 300 DPI`,
                width: 2048,
                height: 2048
            });
        }

        // Production: Use Default Engine (Smart Fallback handles Pollinations vs Fal)
        try {
            return await this.generateImage({
                prompt: `${fullPrompt}, ultra high quality, 300 DPI, print-ready, professional, isolated on white background`,
                width: 5400, // MINIMUM: 5400px for production downloads
                height: 5000, // MINIMUM: 5000px for production downloads
                model: 'dev', // Higher quality for print
                numInferenceSteps: 28, // More steps = better quality
                guidanceScale: 7.5 // Higher guidance for better prompt adherence
            });
        } catch (error: any) {
            console.error('❌ Production generation failed:', error.message);
            return this.generateWithCanvas({
                prompt: `${fullPrompt}, ultra high quality`,
                width: 5400, // MINIMUM: 5400px for production downloads
                height: 5000, // MINIMUM: 5000px for production downloads
            });
        }
    }

    /**
     * Generate a book cover (uses existing Canvas logic for now)
     */
    async generateCover(options: {
        title: string;
        author: string;
        genre: string;
        width?: number;
        height?: number;
        colorScheme?: 'vibrant' | 'dark' | 'minimal' | 'elegant';
    }): Promise<string> {
        // For now, always use Canvas for covers (it's already high-quality)
        // In Phase 3, we can integrate Fal.ai for cover backgrounds
        return coverGenerator.generateCover(options);
    }
}

export const imageService = new ImageService();
