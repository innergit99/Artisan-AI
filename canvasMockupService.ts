/**
 * Canvas Mockup Service - Free, unlimited mockup generation
 * Uses HTML5 Canvas to overlay designs onto base product templates
 * No API limits, no external dependencies, 100% free
 */

export interface MockupOptions {
  designUrl: string;
  productType: string;
  designPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    scale?: number;
    perspective?: boolean;
  };
}

export interface MockupResult {
  url: string;
  productType: string;
  width: number;
  height: number;
}

// Free base mockup templates (using high-quality placeholders)
const MOCKUP_TEMPLATES: Record<string, {
  baseImage: string;
  width: number;
  height: number;
  designArea: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation: number;
    perspective?: boolean;
  };
  shadows?: boolean;
}> = {
  'STANDARD_TEE': {
    baseImage: 'https://placehold.co/800x1000/ffffff/ffffff?text=TeeBase',
    width: 800,
    height: 1000,
    designArea: { x: 250, y: 300, width: 300, height: 400, rotation: 0 },
    shadows: true
  },
  'PREMIUM_TEE': {
    baseImage: 'https://placehold.co/800x1000/1a1a1a/1a1a1a?text=BlackTee',
    width: 800,
    height: 1000,
    designArea: { x: 250, y: 300, width: 300, height: 400, rotation: 0 },
    shadows: true
  },
  'V_NECK': {
    baseImage: 'https://placehold.co/800x1000/f5f5f5/f5f5f5?text=VNeck',
    width: 800,
    height: 1000,
    designArea: { x: 250, y: 320, width: 300, height: 380, rotation: 0 },
    shadows: true
  },
  'CREW_NECK': {
    baseImage: 'https://placehold.co/800x1000/e8e8e8/e8e8e8?text=CrewNeck',
    width: 800,
    height: 1000,
    designArea: { x: 250, y: 300, width: 300, height: 400, rotation: 0 },
    shadows: true
  },
  'TANK_TOP': {
    baseImage: 'https://placehold.co/700x900/f0f0f0/f0f0f0?text=Tank',
    width: 700,
    height: 900,
    designArea: { x: 200, y: 250, width: 300, height: 400, rotation: 0 },
    shadows: true
  },
  'LONG_SLEEVE': {
    baseImage: 'https://placehold.co/800x1000/f8f8f8/f8f8f8?text=LongSleeve',
    width: 800,
    height: 1000,
    designArea: { x: 220, y: 280, width: 360, height: 440, rotation: 0 },
    shadows: true
  },
  'HOODIE': {
    baseImage: 'https://placehold.co/900x1100/2a2a2a/2a2a2a?text=Hoodie',
    width: 900,
    height: 1100,
    designArea: { x: 280, y: 350, width: 340, height: 400, rotation: 0 },
    shadows: true
  },
  'SWEATSHIRT': {
    baseImage: 'https://placehold.co/900x1100/333333/333333?text=Sweatshirt',
    width: 900,
    height: 1100,
    designArea: { x: 280, y: 340, width: 340, height: 420, rotation: 0 },
    shadows: true
  },
  'BASEBALL_TEE': {
    baseImage: 'https://placehold.co/800x1000/ffffff/ffffff?text=Baseball',
    width: 800,
    height: 1000,
    designArea: { x: 250, y: 300, width: 300, height: 400, rotation: 0 },
    shadows: true
  },
  'KIDS_TEE': {
    baseImage: 'https://placehold.co/600x750/fff5f5/fff5f5?text=KidsTee',
    width: 600,
    height: 750,
    designArea: { x: 180, y: 220, width: 240, height: 310, rotation: 0 },
    shadows: true
  },
  'MUG': {
    baseImage: 'https://placehold.co/600x500/f5f5f5/f5f5f5?text=Mug',
    width: 600,
    height: 500,
    designArea: { x: 150, y: 100, width: 300, height: 300, rotation: 0, perspective: true },
    shadows: true
  },
  'TOTE_BAG': {
    baseImage: 'https://placehold.co/700x800/f0f0f0/f0f0f0?text=Tote',
    width: 700,
    height: 800,
    designArea: { x: 175, y: 200, width: 350, height: 400, rotation: 0 },
    shadows: true
  },
  'PHONE_CASE': {
    baseImage: 'https://placehold.co/400x800/1a1a1a/1a1a1a?text=Phone',
    width: 400,
    height: 800,
    designArea: { x: 50, y: 100, width: 300, height: 600, rotation: 0 },
    shadows: false
  },
  'PILLOW': {
    baseImage: 'https://placehold.co/800x800/fafafa/fafafa?text=Pillow',
    width: 800,
    height: 800,
    designArea: { x: 150, y: 150, width: 500, height: 500, rotation: 0 },
    shadows: true
  },
  'POSTER': {
    baseImage: 'https://placehold.co/600x800/ffffff/ffffff?text=Poster',
    width: 600,
    height: 800,
    designArea: { x: 50, y: 50, width: 500, height: 700, rotation: 0 },
    shadows: true
  },
  'CANVAS_PRINT': {
    baseImage: 'https://placehold.co/800x600/fff/fff?text=Canvas',
    width: 800,
    height: 600,
    designArea: { x: 100, y: 50, width: 600, height: 500, rotation: 0 },
    shadows: true
  },
  'STICKER': {
    baseImage: 'https://placehold.co/500x500/ffffff/ffffff?text=Sticker',
    width: 500,
    height: 500,
    designArea: { x: 100, y: 100, width: 300, height: 300, rotation: 0 },
    shadows: true
  }
};

export class CanvasMockupService {
  private canvas: HTMLCanvasElement | null = null;
  private ctx: CanvasRenderingContext2D | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.canvas = document.createElement('canvas');
      this.ctx = this.canvas.getContext('2d', { willReadFrequently: true });
    }
  }

  /**
   * Generate mockup by overlaying design onto product template
   */
  async generateMockup(options: MockupOptions): Promise<MockupResult> {
    const { designUrl, productType, designPosition } = options;

    console.log('🎨 Canvas Mockup:', { productType, designUrlLength: designUrl?.length });

    const template = MOCKUP_TEMPLATES[productType];
    
    if (!template) {
      console.warn('⚠️ No template for', productType, '- using STANDARD_TEE');
      return this.generateMockup({ ...options, productType: 'STANDARD_TEE' });
    }

    if (!this.canvas || !this.ctx) {
      throw new Error('Canvas not available');
    }

    // Set canvas size
    this.canvas.width = template.width;
    this.canvas.height = template.height;

    // Clear canvas
    this.ctx.clearRect(0, 0, template.width, template.height);

    // Load images
    const [baseImage, designImage] = await Promise.all([
      this.loadImage(template.baseImage),
      this.loadImage(designUrl)
    ]);

    // Draw base product
    this.ctx.drawImage(baseImage, 0, 0, template.width, template.height);

    // Calculate design position
    const pos = designPosition || template.designArea;

    // Apply shadow if enabled
    if (template.shadows) {
      this.ctx.save();
      this.ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
      this.ctx.shadowBlur = 20;
      this.ctx.shadowOffsetX = 5;
      this.ctx.shadowOffsetY = 5;
    }

    // Apply rotation and draw design
    this.ctx.save();
    
    if (pos.rotation) {
      const centerX = pos.x + pos.width / 2;
      const centerY = pos.y + pos.height / 2;
      this.ctx.translate(centerX, centerY);
      this.ctx.rotate((pos.rotation * Math.PI) / 180);
      this.ctx.translate(-centerX, -centerY);
    }

    // Apply subtle perspective transform if needed
    if (pos.perspective) {
      this.applyPerspective(pos, designImage);
    } else {
      // Draw design with proper scaling
      this.ctx.drawImage(
        designImage,
        pos.x,
        pos.y,
        pos.width,
        pos.height
      );
    }

    this.ctx.restore();

    // Add lighting effects
    this.addLightingEffects(template);

    // Convert to data URL
    const mockupUrl = this.canvas.toDataURL('image/jpeg', 0.92);

    console.log('✅ Canvas mockup generated:', { width: template.width, height: template.height });

    return {
      url: mockupUrl,
      productType,
      width: template.width,
      height: template.height
    };
  }

  /**
   * Load image from URL
   */
  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src.substring(0, 50)}...`));
      img.src = src;
    });
  }

  /**
   * Apply perspective transformation for 3D effects (mugs, etc)
   */
  private applyPerspective(pos: any, img: HTMLImageElement): void {
    if (!this.ctx) return;

    // Simple perspective - draw with slight curve simulation
    const steps = 10;
    const sliceHeight = pos.height / steps;
    const curve = 0.05; // curve amount

    for (let i = 0; i < steps; i++) {
      const y = pos.y + i * sliceHeight;
      const offset = Math.sin((i / steps) * Math.PI) * pos.width * curve;
      
      const sourceY = (i / steps) * img.height;
      const sourceHeight = img.height / steps;

      this.ctx.drawImage(
        img,
        0, sourceY, img.width, sourceHeight,
        pos.x + offset, y, pos.width - offset * 2, sliceHeight + 1
      );
    }
  }

  /**
   * Add lighting and material effects
   */
  private addLightingEffects(template: any): void {
    if (!this.ctx) return;

    // Add subtle vignette
    const gradient = this.ctx.createRadialGradient(
      template.width / 2, template.height / 2, template.width * 0.3,
      template.width / 2, template.height / 2, template.width * 0.8
    );
    gradient.addColorStop(0, 'rgba(0,0,0,0)');
    gradient.addColorStop(1, 'rgba(0,0,0,0.05)');

    this.ctx.fillStyle = gradient;
    this.ctx.fillRect(0, 0, template.width, template.height);

    // Add fabric texture overlay (subtle)
    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.fillStyle = 'rgba(128, 128, 128, 0.03)';
    this.ctx.fillRect(0, 0, template.width, template.height);
    this.ctx.globalCompositeOperation = 'source-over';
  }

  /**
   * Batch generate mockups for multiple products
   */
  async generateMultipleMockups(
    designUrl: string,
    productTypes: string[]
  ): Promise<MockupResult[]> {
    const results: MockupResult[] = [];
    
    for (const productType of productTypes) {
      try {
        const mockup = await this.generateMockup({ designUrl, productType });
        results.push(mockup);
      } catch (error) {
        console.warn(`Failed to generate ${productType}:`, error);
      }
    }

    return results;
  }

  /**
   * Generate all available mockups for a design
   */
  async generateAllMockups(designUrl: string): Promise<Record<string, MockupResult>> {
    const results: Record<string, MockupResult> = {};
    const types = Object.keys(MOCKUP_TEMPLATES);

    for (const productType of types) {
      try {
        const mockup = await this.generateMockup({ designUrl, productType });
        results[productType] = mockup;
      } catch (error) {
        console.warn(`Failed to generate ${productType}:`, error);
      }
    }

    return results;
  }
}

// Export singleton instance
export const canvasMockupService = new CanvasMockupService();
