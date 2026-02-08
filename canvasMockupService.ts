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

const PRODUCT_SHAPES: Record<string, any> = {
  'STANDARD_TEE': {
    width: 1000,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      ctx.beginPath();
      // Straight Front View
      ctx.moveTo(250, 200);
      ctx.lineTo(750, 200);
      ctx.lineTo(750, 850);
      ctx.lineTo(250, 850);
      ctx.closePath();
      ctx.fill();
      // Sleeves - Straight
      ctx.beginPath();
      ctx.moveTo(250, 200); ctx.lineTo(100, 200); ctx.lineTo(100, 400); ctx.lineTo(250, 400); ctx.closePath(); ctx.fill();
      ctx.beginPath();
      ctx.moveTo(750, 200); ctx.lineTo(900, 200); ctx.lineTo(900, 400); ctx.lineTo(750, 400); ctx.closePath(); ctx.fill();
      // Neck hole
      ctx.fillStyle = shadeColor(color, -10);
      ctx.beginPath(); ctx.arc(500, 200, 80, 0, Math.PI, false); ctx.fill();
    },
    designArea: { x: 350, y: 300, width: 300, height: 450 }
  },
  'HOODIE': {
    width: 1000,
    height: 1100,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      // Body - Straight
      ctx.beginPath(); ctx.roundRect(250, 250, 500, 700, 20); ctx.fill();
      // Sleeves
      ctx.beginPath(); ctx.moveTo(250, 250); ctx.lineTo(100, 250); ctx.lineTo(100, 900); ctx.lineTo(150, 900); ctx.lineTo(250, 350); ctx.fill();
      ctx.beginPath(); ctx.moveTo(750, 250); ctx.lineTo(900, 250); ctx.lineTo(900, 900); ctx.lineTo(850, 900); ctx.lineTo(750, 350); ctx.fill();
      // Hood
      ctx.beginPath(); ctx.roundRect(350, 100, 300, 150, 50); ctx.fill();
    },
    designArea: { x: 350, y: 400, width: 300, height: 350 }
  },
  'HAT': {
    width: 1000,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      // Cap Base
      ctx.beginPath(); ctx.arc(500, 400, 250, Math.PI, 0); ctx.fill();
      // Brim - Straight Front
      ctx.beginPath(); ctx.roundRect(250, 400, 500, 60, 10); ctx.fill();
    },
    designArea: { x: 400, y: 250, width: 200, height: 120 }
  },
  'MUG': {
    width: 800,
    height: 600,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = color;
      // Cylinder Body - Straight Front
      ctx.beginPath(); ctx.roundRect(250, 150, 300, 350, 20); ctx.fill();
      // Handle
      ctx.strokeStyle = color; ctx.lineWidth = 30;
      ctx.beginPath(); ctx.arc(550, 325, 70, -Math.PI / 2, Math.PI / 2); ctx.stroke();
    },
    designArea: { x: 275, y: 200, width: 250, height: 250 }
  },
  'STICKER': {
    width: 500,
    height: 500,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = '#fff';
      ctx.beginPath(); ctx.arc(250, 250, 220, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = '#eee'; ctx.lineWidth = 2; ctx.stroke();
    },
    designArea: { x: 80, y: 80, width: 340, height: 340 }
  },
  'PHONE_CASE': {
    width: 600,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      ctx.fillStyle = '#111'; ctx.beginPath(); ctx.roundRect(150, 100, 300, 600, 40); ctx.fill();
      ctx.fillStyle = color; ctx.beginPath(); ctx.roundRect(165, 115, 270, 570, 30); ctx.fill();
    },
    designArea: { x: 165, y: 115, width: 270, height: 570 }
  }
};

// Fill in other required types as defaults or generic rectangles
const DEFAULT_SHAPE = {
  width: 800,
  height: 800,
  draw: (ctx: CanvasRenderingContext2D, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath(); ctx.roundRect(100, 100, 600, 600, 20); ctx.fill();
    ctx.strokeStyle = '#ccc'; ctx.lineWidth = 2; ctx.stroke();
  },
  designArea: { x: 150, y: 150, width: 500, height: 500 }
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
    const template = PRODUCT_SHAPES[productType] || DEFAULT_SHAPE;

    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');

    this.canvas.width = template.width;
    this.canvas.height = template.height;

    // 1. Draw Background
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(0, 0, template.width, template.height);

    // 2. Draw Product Base
    template.draw(this.ctx, color);

    // 3. Load and Draw Design (STRAIGHT/NO ANGLE)
    const designImg = await this.loadImage(designUrl);
    const area = template.designArea;

    this.ctx.save();
    // User requested STRAIGHT designs
    this.ctx.drawImage(designImg, area.x, area.y, area.width, area.height);
    this.ctx.restore();

    // 4. Add subtle industrial shading
    this.addShading(template);

    return {
      url: this.canvas.toDataURL('image/jpeg', 0.95),
      productType,
      width: template.width,
      height: template.height
    };
  }

  async generateBaseProduct(productType: string, color: string = '#ffffff'): Promise<string> {
    const template = PRODUCT_SHAPES[productType] || DEFAULT_SHAPE;
    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');
    this.canvas.width = template.width;
    this.canvas.height = template.height;
    this.ctx.fillStyle = '#f8fafc';
    this.ctx.fillRect(0, 0, template.width, template.height);
    template.draw(this.ctx, color);
    this.addShading(template);
    return this.canvas.toDataURL('image/png');
  }

  private loadImage(src: string): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load design image'));
      img.src = src;
    });
  }

  private addShading(template: any) {
    if (!this.ctx) return;
    const grad = this.ctx.createLinearGradient(0, 0, 0, template.height);
    grad.addColorStop(0, 'rgba(0,0,0,0.02)');
    grad.addColorStop(1, 'rgba(0,0,0,0.05)');
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
