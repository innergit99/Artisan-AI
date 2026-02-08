/**
 * CANVAS MOCKUP SERVICE
 * Pure programmatic drawing for product mockups
 * Zero external dependencies - all products drawn via vector commands
 */

import { MockupType } from './types';

export interface MockupOptions {
  designUrl: string;
  productType: string;
  designPosition?: {
    x: number;
    y: number;
    width: number;
    height: number;
    rotation?: number;
    perspective?: boolean;
  };
  color?: string;
}

export interface MockupResult {
  url: string;
  productType: string;
  width: number;
  height: number;
}

const PRODUCT_SHAPES = {
  'STANDARD_TEE': {
    width: 800,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      // Torso
      ctx.moveTo(200, 200);
      ctx.lineTo(600, 200);
      ctx.lineTo(600, 850);
      ctx.quadraticCurveTo(400, 900, 200, 850);
      ctx.closePath();
      ctx.fill();

      // Sleeves
      ctx.beginPath();
      ctx.moveTo(200, 200);
      ctx.lineTo(50, 350);
      ctx.lineTo(150, 450);
      ctx.lineTo(200, 400);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(600, 200);
      ctx.lineTo(750, 350);
      ctx.lineTo(650, 450);
      ctx.lineTo(600, 400);
      ctx.closePath();
      ctx.fill();

      // Neck detail
      ctx.fillStyle = shadeColor(color, -10);
      ctx.beginPath();
      ctx.ellipse(400, 200, 100, 40, 0, 0, Math.PI, false);
      ctx.fill();
    },
    designArea: { x: 280, y: 320, width: 240, height: 350 }
  },
  'PREMIUM_TEE': {
    width: 800,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = '#1a1a1a'; // Dark tee
      ctx.beginPath();
      ctx.moveTo(200, 180);
      ctx.lineTo(600, 180);
      ctx.lineTo(610, 880);
      ctx.lineTo(190, 880);
      ctx.closePath();
      ctx.fill();
      // Sleeves
      ctx.beginPath();
      ctx.moveTo(200, 180); ctx.lineTo(80, 320); ctx.lineTo(160, 400); ctx.lineTo(200, 350); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(600, 180); ctx.lineTo(720, 320); ctx.lineTo(640, 400); ctx.lineTo(600, 350); ctx.closePath(); ctx.fill();
    },
    designArea: { x: 300, y: 300, width: 200, height: 300 }
  },
  'HOODIE': {
    width: 900,
    height: 1100,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      // Hood
      ctx.beginPath();
      ctx.moveTo(350, 100);
      ctx.quadraticCurveTo(450, 50, 550, 100);
      ctx.lineTo(600, 300);
      ctx.lineTo(300, 300);
      ctx.closePath();
      ctx.fill();
      // Body
      ctx.beginPath();
      ctx.roundRect(200, 300, 500, 700, 40);
      ctx.fill();
      // Pocket
      ctx.fillStyle = shadeColor(color, -5);
      ctx.beginPath();
      ctx.roundRect(350, 750, 200, 150, 20);
      ctx.fill();
    },
    designArea: { x: 300, y: 400, width: 300, height: 320 }
  },
  'MUG': {
    width: 600,
    height: 500,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      // Cylinder Body
      ctx.beginPath();
      ctx.ellipse(300, 150, 130, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillRect(170, 150, 260, 250);
      ctx.beginPath();
      ctx.ellipse(300, 400, 130, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      // Handle
      ctx.strokeStyle = color;
      ctx.lineWidth = 25;
      ctx.beginPath();
      ctx.arc(430, 275, 60, -Math.PI / 2, Math.PI / 2);
      ctx.stroke();
    },
    designArea: { x: 200, y: 180, width: 200, height: 180, perspective: true }
  },
  'PHONE_CASE': {
    width: 400,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.roundRect(50, 100, 300, 600, 30);
      ctx.fill();
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(60, 110, 280, 580, 25);
      ctx.fill();
    },
    designArea: { x: 60, y: 110, width: 280, height: 580 }
  },
  'TOTE_BAG': {
    width: 700,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = '#e8e2d4'; // Canvas color
      ctx.beginPath();
      ctx.moveTo(150, 300); ctx.lineTo(550, 300); ctx.lineTo(600, 750); ctx.lineTo(100, 750); ctx.closePath();
      ctx.fill();
      // Handles
      ctx.strokeStyle = '#c4b59d';
      ctx.lineWidth = 20;
      ctx.beginPath(); ctx.moveTo(250, 300); ctx.quadraticCurveTo(250, 150, 350, 150); ctx.quadraticCurveTo(450, 150, 450, 300); ctx.stroke();
    },
    designArea: { x: 200, y: 350, width: 300, height: 300 }
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

  async generateMockup(options: MockupOptions): Promise<MockupResult> {
    const { designUrl, productType, color = '#ffffff' } = options;
    const template = (PRODUCT_SHAPES as any)[productType] || PRODUCT_SHAPES.STANDARD_TEE;

    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');

    this.canvas.width = template.width;
    this.canvas.height = template.height;

    // 1. Draw Background
    this.ctx.fillStyle = '#f3f4f6';
    this.ctx.fillRect(0, 0, template.width, template.height);

    // 2. Draw Product Base
    template.draw(this.ctx, color);

    // 3. Load and Draw Design
    const designImg = await this.loadImage(designUrl);
    const area = template.designArea;

    this.ctx.save();
    if (area.perspective) {
      this.drawPerspective(designImg, area);
    } else {
      this.ctx.drawImage(designImg, area.x, area.y, area.width, area.height);
    }
    this.ctx.restore();

    // 4. Add Shading/Shadows for realism
    this.addShading(template);

    return {
      url: this.canvas.toDataURL('image/jpeg', 0.92),
      productType,
      width: template.width,
      height: template.height
    };
  }

  /**
   * Generates a base product drawing without any design
   */
  async generateBaseProduct(productType: string, color: string = '#ffffff'): Promise<string> {
    const template = (PRODUCT_SHAPES as any)[productType] || PRODUCT_SHAPES.STANDARD_TEE;

    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');

    this.canvas.width = template.width;
    this.canvas.height = template.height;

    // 1. Draw Background
    this.ctx.fillStyle = '#f3f4f6';
    this.ctx.fillRect(0, 0, template.width, template.height);

    // 2. Draw Product Base
    template.draw(this.ctx, color);

    // 3. Shading
    this.addShading(template);

    return this.canvas.toDataURL('image/png');
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = src;
    });
  }

  private drawPerspective(img: HTMLImageElement, designArea: any) {
    if (!this.ctx) return;
    const steps = 15;
    const sliceWidth = designArea.width / steps;
    for (let i = 0; i < steps; i++) {
      const x = designArea.x + i * sliceWidth;
      const curve = Math.sin((i / steps) * Math.PI) * 15;
      this.ctx.drawImage(img, (i / steps) * img.width, 0, img.width / steps, img.height, x, designArea.y + curve, sliceWidth, designArea.height);
    }
  }

  private addShading(template: any) {
    if (!this.ctx) return;
    const grad = this.ctx.createLinearGradient(0, 0, template.width, template.height);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.1)');
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, template.width, template.height);
  }
}

function shadeColor(color: string, percent: number): string {
  const num = parseInt(color.replace('#', ''), 16);
  const amt = Math.round(2.55 * percent);
  const R = (num >> 16) + amt;
  const G = (num >> 8 & 0x00FF) + amt;
  const B = (num & 0x0000FF) + amt;
  return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
    (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
    (B < 255 ? B < 1 ? 0 : B : 255))
    .toString(16).slice(1);
}

export const canvasMockupService = new CanvasMockupService();
