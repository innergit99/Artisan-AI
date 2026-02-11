/**
 * Gemini API Diagnostic Tool
 * Tests connection and provides troubleshooting guidance
 */

export async function testGeminiConnection(): Promise<{
    success: boolean;
    message: string;
    details?: any;
}> {
    const apiKey = process.env.GEMINI_API_KEY?.trim();

    // Check 1: API Key Present
    if (!apiKey || apiKey.includes('PLACEHOLDER')) {
        return {
            success: false,
            message: '❌ Gemini API Key not configured. Please add GEMINI_API_KEY to .env.local'
        };
    }

    // Check 2: Test API Call
    try {
        const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: 'Say "Hello" if you can hear me.' }] }]
                })
            }
        );

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: `❌ Gemini API Error: ${data.error?.message || 'Unknown error'}`,
                details: data
            };
        }

        if (data.candidates && data.candidates.length > 0) {
            return {
                success: true,
                message: '✅ Gemini API Connected Successfully!',
                details: {
                    model: 'gemini-1.5-flash',
                    response: data.candidates[0].content.parts[0].text
                }
            };
        }

        return {
            success: false,
            message: '⚠️ Gemini API responded but returned no content',
            details: data
        };

    } catch (error: any) {
        return {
            success: false,
            message: `❌ Network Error: ${error.message}`,
            details: error
        };
    }
}

// Test Ollama Connection
export async function testOllamaConnection(): Promise<{
    success: boolean;
    message: string;
}> {
    try {
        const response = await fetch('http://localhost:11434/api/tags', {
            method: 'GET'
        });

        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                message: `✅ Ollama is running with ${data.models?.length || 0} models`
            };
        }

        return {
            success: false,
            message: '❌ Ollama is not responding'
        };
    } catch (error) {
        return {
            success: false,
            message: '❌ Ollama is not running. Start it with: ollama serve'
        };
    }
}
