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
    module?: 'POD' | 'KDP' | 'MOCKUP' | 'KDP_INTERIOR';
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
        if (isLocalMode()) {
            console.log('🏠 LOCAL MODE: Using Canvas generation (zero API costs)');
            return this.generateWithCanvas(options);
        }

        const apiKey = import.meta.env.VITE_FAL_API_KEY || process.env.FAL_API_KEY;
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
        const { prompt, width = 1024, height = 1024, module, title, genre } = options;

        try {
            // Specialized Canvas generation for book interiors
            if (module === 'KDP_INTERIOR') {
                console.log('📖 Generating industrial interior placeholder...');
                return await coverGenerator.generateInteriorImage(
                    prompt,
                    title || 'Untitled',
                    genre || 'Fiction'
                );
            }

            // Use the existing Canvas generator for generic placeholders
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
     */
    private async generateWithPollinations(options: ImageGenerationOptions): Promise<string> {
        const { prompt, width = 1024, height = 1024 } = options;

        const encodedPrompt = encodeURIComponent(prompt);
        const seed = Math.floor(Math.random() * 1000000);

        // Try multiple models on Pollinations
        const pollinationModels = ['flux', 'vibe', 'default'];
        let lastImgUrl = '';
        let lastError: any = null; // Declared before the loop

        for (const pModel of pollinationModels) {
            const modelParam = pModel === 'default' ? '' : `&model=${pModel}`;
            const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}${modelParam}`;
            lastImgUrl = url;

            try {
                console.log(`📡 Pollinations attempt: model=${pModel}...`);
                const seed = Math.floor(Math.random() * 1000000);
                const modelParam = pModel === 'default' ? '' : `&model=${pModel}`;
                const url = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=${width}&height=${height}&nologo=true&seed=${seed}${modelParam}`;
                lastImgUrl = url; // Keep track of the last URL tried

                const response = await fetch(url, { mode: 'cors' }); // Changed to 'cors' for better error handling
                if (!response.ok) {
                    throw new Error(`Model ${pModel} failed with status: ${response.status}`);
                }

                const blob = await response.blob();
                if (blob.size < 1000) { // Basic check for valid image data
                    throw new Error("Image too small or invalid from Pollinations");
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
                continue; // Try the next model
            }
        }

        // If all models fail, throw the last error or return the last tried URL
        if (lastError) {
            console.error('❌ All Pollinations models failed. Last error:', lastError.message);
            throw new Error(`Pollinations generation failed after multiple attempts: ${lastError.message}`);
        }

        // Fallback to returning the last constructed URL if no blob could be successfully converted
        return lastImgUrl || `https://image.pollinations.ai/prompt/${encodedPrompt}?nologo=true`;
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

        const apiKey = import.meta.env.VITE_FAL_API_KEY || process.env.FAL_API_KEY;

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
                width: 2048,
                height: 2048,
                model: 'dev', // Higher quality for print
                numInferenceSteps: 28, // More steps = better quality
                guidanceScale: 7.5 // Higher guidance for better prompt adherence
            });
        } catch (error: any) {
            console.error('❌ Production generation failed:', error.message);
            return this.generateWithCanvas({
                prompt: `${fullPrompt}, ultra high quality`,
                width: 2048,
                height: 2048
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
