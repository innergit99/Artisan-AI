/**
 * PRINTFUL MOCKUP SERVICE
 * High-quality, standardized product mockups
 * 
 * Free tier: Unlimited mockups with Printful account
 * Professional product photography with consistent lighting/angles
 */

import { MockupType } from './types';

export interface PrintfulMockupOptions {
  designUrl: string;
  productType: MockupType;
  position?: {
    top: number;
    left: number;
    width: number;
    height: number;
  };
  color?: string;
}

export interface MockupResult {
  url: string;
  productType: MockupType;
  width: number;
  height: number;
}

// Product variant IDs for Printful API
const PRODUCT_VARIANTS: Record<MockupType, number[]> = {
  STANDARD_TEE: [4012, 4013, 4014, 4015, 4016], // Unisex Jersey Short Sleeve Tee
  LARGE_PRINT_TEE: [4012, 4013, 4014, 4015, 4016],
  HAT: [7728, 7729, 7730], // Snapback Hat
  STICKER: [10140, 10141, 10142], // Die-cut stickers
  PHONE_CASE: [8085, 8086, 8087], // iPhone cases
  DESK_MAT: [11047], // Desk mat
  MOUSE_PAD: [11047],
  PILLOW: [11045, 11046], // Throw pillow
  TOTE_BAG: [11048, 11049], // Tote bag
  MUG: [11050, 11051, 11052], // Coffee mug
  POSTER: [11053, 11054, 11055], // Posters
  CANVAS: [11056, 11057, 11058],
  GREETING_CARD: [11059, 11060],
  LAPTOP_SKIN: [11061, 11062],
  POUCH: [11063, 11064],
  DRESS: [11065, 11066],
  SCARF: [11067, 11068],
  DUVET: [11069, 11070],
  SHOWER_CURTAIN: [11071],
  JOURNAL: [11072, 11073],
  SPIRAL_NOTEBOOK: [11074, 11075],
  CLOCK: [11076, 11077],
  ACRYLIC_BLOCK: [11078, 11079],
  COASTER: [11080, 11081],
  BLANKET: [11082, 11083, 11084],
  TAPESTRY: [11085, 11086],
  BATH_MAT: [11087, 11088],
  BUTTON: [11089, 11090],
  APRON: [11091, 11092],
  PUZZLE: [11093, 11094, 11095],
  SOCKS: [11096, 11097, 11098],
  BACKPACK: [11099, 11100],
  DUFFLE_BAG: [11101, 11102]
};

// Mockup templates with positioning data
const MOCKUP_TEMPLATES: Record<MockupType, {
  variantId: number;
  placement: string;
  color: string;
}> = {
  STANDARD_TEE: { variantId: 4012, placement: 'front', color: 'white' },
  LARGE_PRINT_TEE: { variantId: 4012, placement: 'front', color: 'white' },
  HAT: { variantId: 7728, placement: 'front', color: 'black' },
  STICKER: { variantId: 10140, placement: 'default', color: 'white' },
  PHONE_CASE: { variantId: 8085, placement: 'default', color: 'black' },
  DESK_MAT: { variantId: 11047, placement: 'default', color: 'black' },
  MOUSE_PAD: { variantId: 11047, placement: 'default', color: 'black' },
  PILLOW: { variantId: 11045, placement: 'front', color: 'white' },
  TOTE_BAG: { variantId: 11048, placement: 'front', color: 'natural' },
  MUG: { variantId: 11050, placement: 'default', color: 'white' },
  POSTER: { variantId: 11053, placement: 'default', color: 'white' },
  CANVAS: { variantId: 11056, placement: 'default', color: 'white' },
  GREETING_CARD: { variantId: 11059, placement: 'front', color: 'white' },
  LAPTOP_SKIN: { variantId: 11061, placement: 'default', color: 'silver' },
  POUCH: { variantId: 11063, placement: 'front', color: 'black' },
  DRESS: { variantId: 11065, placement: 'front', color: 'black' },
  SCARF: { variantId: 11067, placement: 'default', color: 'white' },
  DUVET: { variantId: 11069, placement: 'top', color: 'white' },
  SHOWER_CURTAIN: { variantId: 11071, placement: 'default', color: 'white' },
  JOURNAL: { variantId: 11072, placement: 'front', color: 'black' },
  SPIRAL_NOTEBOOK: { variantId: 11074, placement: 'front', color: 'white' },
  CLOCK: { variantId: 11076, placement: 'front', color: 'white' },
  ACRYLIC_BLOCK: { variantId: 11078, placement: 'front', color: 'clear' },
  COASTER: { variantId: 11080, placement: 'front', color: 'white' },
  BLANKET: { variantId: 11082, placement: 'top', color: 'white' },
  TAPESTRY: { variantId: 11085, placement: 'default', color: 'white' },
  BATH_MAT: { variantId: 11087, placement: 'default', color: 'white' },
  BUTTON: { variantId: 11089, placement: 'front', color: 'white' },
  APRON: { variantId: 11091, placement: 'front', color: 'black' },
  PUZZLE: { variantId: 11093, placement: 'default', color: 'white' },
  SOCKS: { variantId: 11096, placement: 'default', color: 'white' },
  BACKPACK: { variantId: 11099, placement: 'front', color: 'black' },
  DUFFLE_BAG: { variantId: 11101, placement: 'front', color: 'black' }
};

class PrintfulMockupService {
  private apiKey: string;
  private baseUrl = 'https://api.printful.com';

  constructor() {
    this.apiKey = import.meta.env.VITE_PRINTFUL_API_KEY || '';
  }

  /**
   * Generate professional product mockup
   */
  async generateMockup(options: PrintfulMockupOptions): Promise<MockupResult> {
    const { designUrl, productType } = options;
    
    // Debug: Log API key status (first 5 chars only for security)
    const keyStatus = this.apiKey ? `Present (${this.apiKey.substring(0, 5)}...)` : 'MISSING';
    console.log('🔍 Printful Service:', { keyStatus, productType, designUrlLength: designUrl?.length });
    
    if (!this.apiKey) {
      console.warn('⚠️ Printful API key missing, using fallback');
      return this.generateFallbackMockup(designUrl, productType);
    }

    const template = MOCKUP_TEMPLATES[productType];
    
    if (!template) {
      console.error('❌ No template found for product type:', productType);
      return this.generateFallbackMockup(designUrl, productType);
    }
    
    console.log('📋 Using template:', { variantId: template.variantId, placement: template.placement });
    
    try {
      // Create mockup generation task
      console.log('🚀 Calling Printful API...');
      const response = await fetch(`${this.baseUrl}/mockup-generator/create-task`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          variant_ids: [template.variantId],
          format: 'jpg',
          width: 1000,
          product_template_id: null,
          option_groups: {
            [template.placement]: {
              orientation: 'any',
              technique: 'dtg',
              placement: template.placement
            }
          },
          files: [{
            placement: template.placement,
            image_url: designUrl,
            position: {
              area_width: 1200,
              area_height: 1200,
              width: 1000,
              height: 1000,
              top: 100,
              left: 100
            }
          }]
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Printful API error:', response.status, errorText);
        throw new Error(`Printful API error: ${response.status}`);
      }

      const data = await response.json();
      console.log('✅ Printful task created:', data);
      const taskKey = data.result.task_key;

      // Poll for mockup completion
      console.log('⏳ Polling for mockup...');
      const mockupUrl = await this.pollForMockup(taskKey);
      console.log('🎉 Mockup ready:', mockupUrl);
      
      return {
        url: mockupUrl,
        productType,
        width: 1000,
        height: 1000
      };

    } catch (error: any) {
      console.error('❌ Printful mockup failed:', error.message);
      return this.generateFallbackMockup(designUrl, productType);
    }
  }

  /**
   * Poll for mockup generation completion
   */
  private async pollForMockup(taskKey: string, maxAttempts = 30): Promise<string> {
    for (let i = 0; i < maxAttempts; i++) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const response = await fetch(`${this.baseUrl}/mockup-generator/task?task_key=${taskKey}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) continue;

      const data = await response.json();
      
      if (data.result.status === 'completed') {
        return data.result.mockups[0].mockup_url;
      }
      
      if (data.result.status === 'failed') {
        throw new Error('Mockup generation failed');
      }
    }
    
    throw new Error('Mockup generation timeout');
  }

  /**
   * Generate multiple product mockups
   */
  async generateMockupSet(designUrl: string, productTypes: MockupType[]): Promise<MockupResult[]> {
    const promises = productTypes.map(type => 
      this.generateMockup({ designUrl, productType: type })
    );
    
    return Promise.all(promises);
  }

  /**
   * Fallback: Use base64 design as placeholder
   */
  private generateFallbackMockup(designUrl: string, productType: MockupType): MockupResult {
    // Return the original design with product label
    return {
      url: designUrl,
      productType,
      width: 1000,
      height: 1000
    };
  }

  /**
   * Get available products for a category
   */
  async getAvailableProducts(): Promise<Array<{ type: MockupType; name: string; category: string }>> {
    try {
      const response = await fetch(`${this.baseUrl}/products`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }

      const data = await response.json();
      
      return data.result.map((product: any) => ({
        type: product.id as MockupType,
        name: product.name,
        category: product.type
      }));
    } catch (error) {
      console.error('Failed to fetch Printful products:', error);
      return [];
    }
  }
}

export const printfulMockupService = new PrintfulMockupService();
