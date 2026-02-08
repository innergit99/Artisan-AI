/// <reference types="vite/client" />
/// <reference types="vite/client" />
/**
 * HuggingFace Backend Service
 * Connects Artisan AI to the deployed HF Space backend using Gradio Client
 */
import { Client } from "@gradio/client";

const HF_SPACE_ID = "Bishal99/artisan-ai-backend";

export class HFBackendService {
    private client: any = null;

    /**
     * Connect to the Gradio Space with authentication
     */
    private async getClient() {
        if (!this.client) {
            console.log('🔌 Connecting to HuggingFace Space...');

            // Try to get token from Vite env or process env
            const hfToken = (import.meta as any).env?.VITE_HF_API_TOKEN || process.env.VITE_HF_API_TOKEN;

            if (hfToken) {
                console.log(`🔐 Authenticating with HF Token: ${hfToken.substring(0, 5)}...`);
            } else {
                console.warn("⚠️ No VITE_HF_API_TOKEN found - connecting anonymously");
            }

            // Connect to the space with explicit headers
            // @ts-ignore
            this.client = await Client.connect(HF_SPACE_ID, {
                headers: hfToken ? { "Authorization": `Bearer ${hfToken}` } : undefined
            });
        }
        return this.client;
    }

    /**
     * Generate text using Llama 3.1-8B on HuggingFace ZeroGPU
     */
    async generateText(prompt: string, maxTokens: number = 2000, temperature: number = 0.7): Promise<string> {
        console.log('🤗 Calling HuggingFace Backend (Llama 3.1-8B)...');

        try {
            const app = await this.getClient();

            // Call the generate_text function
            // Note: Without api_name explicitly set in python, we try the function name
            const result = await app.predict("/generate_text", [
                prompt,
                maxTokens,
                temperature
            ]);

            console.log('HF Backend raw response:', JSON.stringify(result)?.substring(0, 200));

            // Gradio client returns { data: [...] }
            if (result.data && result.data.length > 0) {
                const responseData = result.data[0];

                let textResult = '';

                // Check structure
                if (responseData && responseData.success) {
                    console.log('✅ Llama 3.1 generated text successfully');
                    textResult = responseData.text;
                } else if (typeof responseData === 'string') {
                    textResult = responseData;
                }

                if (textResult) {
                    // CLEANUP: Remove the prompt if it was echoed back
                    // Llama 3 often echoes "user\n\nPrompt..."
                    const promptIndex = textResult.lastIndexOf('assistant');
                    if (promptIndex !== -1) {
                        // +9 is length of 'assistant' plus some buffer for spaces/newlines
                        // We look for where the actual content starts after 'assistant'
                        const afterAssistant = textResult.substring(promptIndex + 9);
                        textResult = afterAssistant.trim();
                    }
                    // Also remove any "user" echo if 'assistant' tag wasn't explicitly found
                    else if (textResult.startsWith('user')) {
                        const jsonStart = textResult.indexOf('[');
                        if (jsonStart !== -1) {
                            textResult = textResult.substring(jsonStart);
                        } else {
                            // If no JSON array found, maybe it's just text
                            // Try to find double newlines which might separate prompt headers
                            const parts = textResult.split('\n\n');
                            if (parts.length > 1) {
                                // Return the last part usually
                                textResult = parts[parts.length - 1];
                            }
                        }
                    }

                    return textResult;
                }
            }

            throw new Error("Unexpected response format from HF Backend");

        } catch (error: any) {
            console.error('HF Backend text generation failed:', error.message);
            // Force reconnect next time on error
            this.client = null;
            throw error;
        }
    }

    /**
     * Generate image using Stable Diffusion XL on HuggingFace ZeroGPU
     */
    async generateImage(
        prompt: string,
        negativePrompt: string = "",
        width: number = 1024,
        height: number = 1024,
        steps: number = 25
    ): Promise<string> {
        console.log('🎨 Calling HuggingFace Backend (SDXL)...');

        try {
            const app = await this.getClient();

            const result = await app.predict("/generate_image", [
                prompt,
                negativePrompt,
                width,
                height,
                steps
            ]);

            if (result.data && result.data[0]) {
                const responseData = result.data[0];

                if (responseData && responseData.success) {
                    console.log('✅ SDXL generated image successfully');
                    return responseData.image;
                }
            }

            throw new Error("Unexpected response format from HF Backend");

        } catch (error: any) {
            console.error('HF Backend image generation failed:', error.message);
            this.client = null;
            throw error;
        }
    }

    /**
     * Test connection to HuggingFace backend
     */
    async testConnection(): Promise<boolean> {
        try {
            await this.getClient();
            return true;
        } catch (e) {
            console.error("HF Connection test failed", e);
            return false;
        }
    }
}

// Export singleton instance
export const hfBackend = new HFBackendService();
