/**
 * CANVAS MOCKUP SERVICE - PRO VECTOR ENGINE v2.0
 * Pure programmatic drawing for high-fidelity product mockups.
 * Mimics "Flat Lay" photography using advanced vector paths, gradients, and shading.
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

// Helper: Soft Shadow
const addDropShadow = (ctx: CanvasRenderingContext2D, y: number = 10, blur: number = 20) => {
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)';
  ctx.shadowBlur = blur;
  ctx.shadowOffsetY = y;
};

const resetShadow = (ctx: CanvasRenderingContext2D) => {
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;
  ctx.shadowOffsetY = 0;
};

// Helper: Fabric Wrinkles
const drawWrinkle = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, cpX: number, cpY: number, alpha: number = 0.05) => {
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cpX, cpY, x2, y2);
  ctx.strokeStyle = `rgba(0,0,0,${alpha})`;
  ctx.lineWidth = 2;
  ctx.stroke();
};

const PRODUCT_SHAPES: Record<string, any> = {
  // --- APPAREL ---
  'STANDARD_TEE': {
    width: 1000,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      // 1. Shadow for depth
      addDropShadow(ctx, 15, 30);

      // 2. Base Shape (Natural Fit)
      ctx.fillStyle = color;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;

      ctx.beginPath();
      // Neck
      ctx.moveTo(380, 150);
      ctx.quadraticCurveTo(500, 200, 620, 150); // Front collar curve
      // Shoulder R
      ctx.lineTo(750, 180);
      // Sleeve R
      ctx.quadraticCurveTo(800, 250, 820, 350); // Outer sleeve
      ctx.lineTo(720, 380); // Sleeve hem
      ctx.lineTo(700, 300); // Armpit R
      // Torso R
      ctx.quadraticCurveTo(710, 500, 710, 800); // Side seam
      // Bottom Hem
      ctx.quadraticCurveTo(500, 820, 290, 800);
      // Torso L
      ctx.quadraticCurveTo(290, 500, 300, 300); // Side seam
      // Sleeve L
      ctx.lineTo(280, 380); // Armpit L internal
      ctx.lineTo(180, 350); // Sleeve hem
      ctx.quadraticCurveTo(200, 250, 250, 180); // Outer sleeve
      // Shoulder L
      ctx.lineTo(380, 150);
      ctx.closePath();

      ctx.fill();
      resetShadow(ctx); // Reset shadow for internal details
      ctx.stroke();

      // 3. Collar Detail
      ctx.beginPath();
      ctx.moveTo(380, 150);
      ctx.quadraticCurveTo(500, 200, 620, 150);
      ctx.quadraticCurveTo(500, 230, 380, 150); // Inner collar ring
      ctx.fillStyle = shadeColor(color, -10); // Slightly darker inside
      ctx.fill();
      ctx.stroke();

      // 4. Wrinkles (Texture)
      drawWrinkle(ctx, 300, 300, 400, 400, 350, 350, 0.1); // Left armpit fold
      drawWrinkle(ctx, 700, 300, 600, 400, 650, 350, 0.1); // Right armpit fold
      drawWrinkle(ctx, 350, 700, 650, 700, 500, 750, 0.05); // Hem wave
    },
    designArea: { x: 350, y: 300, width: 300, height: 400 } // Chest placement
  },

  // --- HEADWEAR ---
  'HAT': { // Bucket Style
    width: 1000,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 15, 25);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;

      // Top Dome
      ctx.beginPath();
      ctx.ellipse(500, 350, 200, 150, 0, Math.PI, 0); // Top half
      ctx.lineTo(700, 500); // Side R
      ctx.quadraticCurveTo(500, 550, 300, 500); // Bottom curve of dome
      ctx.lineTo(300, 350); // Side L
      ctx.fill();
      ctx.stroke();

      // Wide Brim
      ctx.beginPath();
      ctx.moveTo(300, 500);
      ctx.quadraticCurveTo(150, 550, 200, 650); // Left brim flare
      ctx.quadraticCurveTo(500, 700, 800, 650); // Bottom brim curve
      ctx.quadraticCurveTo(850, 550, 700, 500); // Right brim flare
      ctx.quadraticCurveTo(500, 550, 300, 500); // Inner brim curve (connects to dome)
      ctx.fillStyle = shadeColor(color, -5); // Brim slightly darker
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Stitching Details
      ctx.setLineDash([5, 5]);
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.beginPath();
      ctx.moveTo(220, 630);
      ctx.quadraticCurveTo(500, 680, 780, 630); // Brim stitching line 1
      ctx.stroke();
      ctx.setLineDash([]);
    },
    designArea: { x: 420, y: 380, width: 160, height: 100 } // Front center of dome
  },

  // --- DRINKWARE ---
  'MUG': {
    width: 800,
    height: 700,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#111';
      ctx.lineWidth = 2;

      // Handle (Back layer)
      ctx.beginPath();
      ctx.arc(580, 350, 90, -Math.PI / 2, Math.PI / 2);
      ctx.lineWidth = 25;
      ctx.strokeStyle = color; // Handle color
      ctx.stroke();
      resetShadow(ctx); // Reset for outline
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#111';
      ctx.stroke(); // Outline handle

      // Main Cylinder
      ctx.beginPath();
      ctx.ellipse(400, 200, 180, 40, 0, 0, Math.PI * 2); // Top rim
      ctx.moveTo(220, 200);
      ctx.lineTo(230, 550); // Tapered side L
      ctx.quadraticCurveTo(400, 600, 570, 550); // Bottom curve
      ctx.lineTo(580, 200); // Tapered side R
      ctx.fill();
      ctx.stroke();

      // Top Opening (Inside)
      ctx.fillStyle = '#eee'; // Inside color
      ctx.beginPath();
      ctx.ellipse(400, 200, 180, 40, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Specular Highlight (The "glossy" look)
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.beginPath();
      ctx.rect(260, 250, 30, 300); // Vertical shine
      ctx.fill();
    },
    designArea: { x: 300, y: 250, width: 220, height: 250 } // Center wrap
  },

  // --- ACCESSORIES ---
  'TOTE_BAG': {
    width: 800,
    height: 900,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      ctx.fillStyle = color; // Canvas/Beige usually
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;

      // Bag Body
      ctx.beginPath();
      ctx.rect(200, 300, 400, 450);
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Straps
      ctx.fillStyle = '#111'; // Black straps common
      ctx.fillRect(250, 100, 30, 200); // L Strap top
      ctx.fillRect(520, 100, 30, 200); // R Strap top

      // Strap loops
      ctx.beginPath();
      ctx.arc(400, 100, 135, Math.PI, 0); // Handle arch
      ctx.lineWidth = 30;
      ctx.strokeStyle = '#111';
      ctx.stroke();

      // Fabric texture
      drawWrinkle(ctx, 220, 700, 300, 650, 250, 680, 0.1);
    },
    designArea: { x: 250, y: 350, width: 300, height: 350 }
  },

  'STICKER': {
    width: 600,
    height: 600,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 8, 15);

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#ccc'; // Light cut line
      ctx.lineWidth = 4;

      // Irregular organic shape (Die Cut)
      ctx.beginPath();
      ctx.moveTo(300, 100);
      ctx.quadraticCurveTo(500, 100, 500, 300);
      ctx.quadraticCurveTo(500, 500, 300, 500);
      ctx.quadraticCurveTo(100, 500, 100, 300);
      ctx.quadraticCurveTo(100, 100, 300, 100);
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();
    },
    designArea: { x: 150, y: 150, width: 300, height: 300 }
  },

  'PHONE_CASE': {
    width: 600,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 25);

      // Case Body
      ctx.fillStyle = color;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.roundRect(150, 100, 300, 600, 45); // Rounded phone shape
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Camera Module
      ctx.fillStyle = '#111';
      ctx.beginPath();
      ctx.roundRect(170, 120, 100, 100, 25);
      ctx.fill();

      // Lenses
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.arc(200, 150, 15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(240, 150, 15, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(220, 190, 15, 0, Math.PI * 2); ctx.fill();
    },
    designArea: { x: 160, y: 240, width: 280, height: 440 }
  },

  'PILLOW': {
    width: 800,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 15, 30);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#ccc'; // Soft edge
      ctx.lineWidth = 1;

      // Soft Square (Puffy)
      ctx.beginPath();
      ctx.moveTo(150, 150);
      ctx.quadraticCurveTo(400, 100, 650, 150); // Top curve
      ctx.quadraticCurveTo(700, 400, 650, 650); // Right curve
      ctx.quadraticCurveTo(400, 700, 150, 650); // Bottom curve
      ctx.quadraticCurveTo(100, 400, 150, 150); // Left curve
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Corner shading (Puffiness)
      const grad = ctx.createRadialGradient(400, 400, 100, 400, 400, 400);
      grad.addColorStop(0, 'rgba(255,255,255,0.2)'); // Highlight center
      grad.addColorStop(1, 'rgba(0,0,0,0.1)'); // Shadow edges
      ctx.fillStyle = grad;
      ctx.fill();
    },
    designArea: { x: 200, y: 200, width: 400, height: 400 }
  },

  'POSTER': {
    width: 800,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 20, 40); // Deep shadow for "floating off wall" look

      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#111'; // Frame
      ctx.lineWidth = 15;

      ctx.beginPath();
      ctx.rect(150, 100, 500, 700);
      ctx.stroke(); // Frame
      resetShadow(ctx);
      ctx.fillRect(158, 108, 484, 684); // Paper
    },
    designArea: { x: 160, y: 110, width: 480, height: 680 } // Full bleed inside frame
  },

  // --- NEW V3 SHAPES (Requested by User) ---

  'FLEECE_BLANKET': {
    width: 1000,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ccc'; // Soft edge
      ctx.lineWidth = 1;

      // Soft/Fuzzy folded square
      ctx.beginPath();
      // Top with slight wave
      ctx.moveTo(100, 100);
      ctx.quadraticCurveTo(300, 90, 500, 100);
      ctx.quadraticCurveTo(700, 110, 900, 100);
      // Right side drape
      ctx.quadraticCurveTo(910, 300, 900, 500);
      ctx.quadraticCurveTo(890, 700, 900, 900);
      // Bottom with wave
      ctx.quadraticCurveTo(700, 910, 500, 900);
      ctx.quadraticCurveTo(300, 890, 100, 900);
      // Left side drape
      ctx.quadraticCurveTo(90, 700, 100, 500);
      ctx.quadraticCurveTo(110, 300, 100, 100);

      ctx.fill();
      resetShadow(ctx);

      // Fuzzy Texture (Noise hint)
      ctx.globalAlpha = 0.1;
      for (let i = 0; i < 500; i++) {
        ctx.fillRect(100 + Math.random() * 800, 100 + Math.random() * 800, 2, 2);
      }
      ctx.globalAlpha = 1.0;

      // Fold line
      drawWrinkle(ctx, 100, 800, 900, 200, 500, 500, 0.05);
    },
    designArea: { x: 150, y: 150, width: 700, height: 700 }
  },

  'BATH_MAT': {
    width: 1000,
    height: 600,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 5, 10);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 1;

      // Plush Rectangle
      ctx.beginPath();
      ctx.roundRect(100, 100, 800, 400, 20);
      ctx.fill();
      resetShadow(ctx);

      // Plush Texture strokes
      ctx.strokeStyle = 'rgba(0,0,0,0.05)';
      ctx.beginPath();
      for (let i = 0; i < 100; i++) {
        const x = 120 + Math.random() * 760;
        const y = 120 + Math.random() * 360;
        ctx.moveTo(x, y);
        ctx.lineTo(x + 5, y + 5);
      }
      ctx.stroke();
    },
    designArea: { x: 120, y: 120, width: 760, height: 360 }
  },

  'BACKPACK': {
    width: 800,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 20, 30);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;

      // Main Bag Body (Dome top)
      ctx.beginPath();
      ctx.moveTo(200, 300);
      ctx.quadraticCurveTo(400, 100, 600, 300); // Top Dome
      ctx.lineTo(620, 800); // R Side
      ctx.quadraticCurveTo(400, 850, 180, 800); // Bottom
      ctx.lineTo(200, 300); // L Side
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Front Pocket
      ctx.fillStyle = shadeColor(color, -10);
      ctx.beginPath();
      ctx.roundRect(250, 500, 300, 250, 30);
      ctx.fill();
      ctx.stroke();

      // Top Handle
      ctx.beginPath();
      ctx.moveTo(350, 200);
      ctx.quadraticCurveTo(400, 150, 450, 200);
      ctx.lineWidth = 10;
      ctx.stroke();

      // Zipper Hint
      ctx.lineWidth = 2;
      ctx.strokeStyle = '#555';
      ctx.setLineDash([5, 5]);
      ctx.beginPath();
      ctx.moveTo(220, 320);
      ctx.quadraticCurveTo(400, 150, 580, 320);
      ctx.stroke();
      ctx.setLineDash([]);
    },
    designArea: { x: 250, y: 300, width: 300, height: 200 } // Upper pocket area
  },

  'DUFFLE_BAG': {
    width: 1000,
    height: 600,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 15, 25);
      ctx.fillStyle = color;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;

      // Cylinder Side
      ctx.beginPath();
      ctx.ellipse(200, 300, 80, 150, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();

      // Main Body
      ctx.beginPath();
      ctx.rect(200, 150, 600, 300);
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke(); // Top/Bottom lines

      // Straps
      ctx.fillStyle = '#111';
      ctx.fillRect(350, 150, 40, 300);
      ctx.fillRect(650, 150, 40, 300);

      // Handles
      ctx.beginPath();
      ctx.moveTo(370, 150);
      ctx.quadraticCurveTo(520, 0, 670, 150);
      ctx.lineWidth = 8;
      ctx.stroke();
      ctx.lineWidth = 2;
    },
    designArea: { x: 300, y: 180, width: 440, height: 240 }
  },

  'WALL_CLOCK': {
    width: 800,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 20, 40);

      // Rim
      ctx.fillStyle = '#111'; // Black Rim usually
      ctx.beginPath();
      ctx.arc(400, 400, 350, 0, Math.PI * 2);
      ctx.fill();
      resetShadow(ctx);

      // Face
      ctx.fillStyle = '#fff';
      ctx.beginPath();
      ctx.arc(400, 400, 320, 0, Math.PI * 2);
      ctx.fill();

      // Ticks
      ctx.fillStyle = '#000';
      for (let i = 0; i < 12; i++) {
        ctx.save();
        ctx.translate(400, 400);
        ctx.rotate(i * Math.PI / 6);
        ctx.fillRect(-5, -300, 10, 30);
        ctx.restore();
      }

      // Hands (10:10)
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 15;
      ctx.lineCap = 'round';
      // Hour Hand
      ctx.beginPath(); ctx.moveTo(400, 400); ctx.lineTo(300, 300); ctx.stroke();
      // Minute Hand
      ctx.lineWidth = 10;
      ctx.beginPath(); ctx.moveTo(400, 400); ctx.lineTo(550, 320); ctx.stroke();
      // Second Hand (Red)
      ctx.strokeStyle = 'red'; ctx.lineWidth = 4;
      ctx.beginPath(); ctx.moveTo(400, 400); ctx.lineTo(400, 150); ctx.stroke();

      // Center cap
      ctx.fillStyle = '#000';
      ctx.beginPath(); ctx.arc(400, 400, 15, 0, Math.PI * 2); ctx.fill();
    },
    designArea: { x: 200, y: 200, width: 400, height: 400 } // Center face
  },

  'SPIRAL_NOTEBOOK': {
    width: 800,
    height: 1000,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      // Back Cover (slightly visible)
      ctx.fillStyle = '#333';
      ctx.beginPath(); ctx.roundRect(100, 100, 600, 800, 10); ctx.fill();

      // Front Cover
      ctx.fillStyle = color;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 1;
      resetShadow(ctx); // Shadow already applied to back cover for depth

      ctx.beginPath(); ctx.roundRect(100, 100, 600, 800, 10);
      ctx.fill(); ctx.stroke();

      // Spiral Binding
      ctx.fillStyle = '#ddd'; // Silver coils
      ctx.strokeStyle = '#999';
      for (let y = 120; y < 880; y += 40) {
        // Coil hole
        ctx.fillStyle = '#000';
        ctx.beginPath(); ctx.arc(120, y, 6, 0, Math.PI * 2); ctx.fill();
        // Wire loop
        ctx.strokeStyle = '#888'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.arc(110, y, 15, 0, Math.PI * 2); ctx.stroke();
      }
    },
    designArea: { x: 150, y: 150, width: 500, height: 700 }
  },

  'HARDCOVER_JOURNAL': {
    width: 700,
    height: 900,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 15, 30);

      // Book Cover
      ctx.fillStyle = color;
      ctx.strokeStyle = '#222';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.roundRect(100, 100, 500, 700, 5); ctx.fill(); resetShadow(ctx); ctx.stroke();

      // Spine Indentation (Left)
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(115, 100, 5, 700); // Groove

      // Elastic Band (optional, usually on right)
      ctx.fillStyle = '#111';
      ctx.fillRect(550, 100, 15, 700);
    },
    designArea: { x: 130, y: 150, width: 400, height: 600 }
  },

  'SHOWER_CURTAIN': {
    width: 800,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;

      // Large rect
      ctx.beginPath(); ctx.rect(100, 100, 600, 600); ctx.fill(); resetShadow(ctx); ctx.stroke();

      // Grommets
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#999';
      ctx.lineWidth = 2;
      for (let x = 150; x <= 650; x += 100) {
        ctx.beginPath(); ctx.arc(x, 130, 10, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      }

      // Folds/Drape
      drawWrinkle(ctx, 150, 700, 150, 100, 170, 400, 0.1);
      drawWrinkle(ctx, 350, 700, 350, 100, 370, 400, 0.1);
      drawWrinkle(ctx, 550, 700, 550, 100, 570, 400, 0.1);
    },
    designArea: { x: 100, y: 150, width: 600, height: 500 }
  },

  'DUVET_COVER': {
    width: 1000,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#ccc';
      ctx.lineWidth = 1;

      // Bedding Shape
      ctx.beginPath();
      ctx.moveTo(100, 200);
      ctx.lineTo(900, 200); // Top edge
      ctx.lineTo(920, 700); // R Side
      ctx.quadraticCurveTo(500, 750, 80, 700); // Bottom drape
      ctx.lineTo(100, 200);
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Pillow Hints
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#ddd';
      // Pillow L
      ctx.beginPath(); ctx.roundRect(150, 100, 200, 150, 10); ctx.fill(); ctx.stroke();
      // Pillow R
      ctx.beginPath(); ctx.roundRect(650, 100, 200, 150, 10); ctx.fill(); ctx.stroke();
    },
    designArea: { x: 150, y: 250, width: 700, height: 400 }
  },

  'SILK_SCARF': {
    width: 800,
    height: 800,
    draw: (ctx: CanvasRenderingContext2D, color: string) => {
      addDropShadow(ctx, 10, 20);

      ctx.fillStyle = color;
      ctx.strokeStyle = '#ddd';
      ctx.lineWidth = 0.5;

      // Flowing Diamond shape
      ctx.beginPath();
      ctx.moveTo(400, 100); // Top
      ctx.quadraticCurveTo(600, 200, 700, 400); // R
      ctx.quadraticCurveTo(600, 600, 400, 700); // Bottom
      ctx.quadraticCurveTo(200, 600, 100, 400); // L
      ctx.quadraticCurveTo(200, 200, 400, 100);
      ctx.fill();
      resetShadow(ctx);
      ctx.stroke();

      // Silk sheen
      const grad = ctx.createLinearGradient(200, 200, 600, 600);
      grad.addColorStop(0, 'rgba(255,255,255,0)');
      grad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = grad;
      ctx.fill();
    },
    designArea: { x: 250, y: 250, width: 300, height: 300 }
  }
};

// --- FALLBACK SHAPES (Generic but styled) ---
const DEFAULT_RECTANGLE = {
  width: 1000, height: 1000,
  draw: (ctx: CanvasRenderingContext2D, color: string) => {
    addDropShadow(ctx, 10, 20);
    ctx.fillStyle = color;
    ctx.strokeStyle = '#222';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.roundRect(200, 200, 600, 600, 10); ctx.fill(); resetShadow(ctx); ctx.stroke();
  },
  designArea: { x: 220, y: 220, width: 560, height: 560 }
};

// --- MAPPING HELPERS ---
function getTemplate(type: string): any {
  if (PRODUCT_SHAPES[type]) return PRODUCT_SHAPES[type];
  const lower = type.toLowerCase();

  // Detailed mapping for 25+ SKUs
  if (lower.includes('tee') || lower.includes('dress')) return PRODUCT_SHAPES['STANDARD_TEE'];
  if (lower.includes('hat')) return PRODUCT_SHAPES['HAT'];
  if (lower.includes('mug')) return PRODUCT_SHAPES['MUG'];

  // Specific Bags
  if (lower.includes('backpack')) return PRODUCT_SHAPES['BACKPACK'];
  if (lower.includes('duffle')) return PRODUCT_SHAPES['DUFFLE_BAG'];
  if (lower.includes('tote') || lower.includes('bag')) return PRODUCT_SHAPES['TOTE_BAG'];

  // Specific Stationery
  if (lower.includes('notebook')) return PRODUCT_SHAPES['SPIRAL_NOTEBOOK'];
  if (lower.includes('journal')) return PRODUCT_SHAPES['HARDCOVER_JOURNAL'];

  // Specific Home
  if (lower.includes('clock')) return PRODUCT_SHAPES['WALL_CLOCK'];
  if (lower.includes('blanket')) return PRODUCT_SHAPES['FLEECE_BLANKET'];
  if (lower.includes('bath') || lower.includes('mat')) return PRODUCT_SHAPES['BATH_MAT'];
  if (lower.includes('shower') || lower.includes('curtain')) return PRODUCT_SHAPES['SHOWER_CURTAIN'];
  if (lower.includes('duvet') || lower.includes('cover')) return PRODUCT_SHAPES['DUVET_COVER'];
  if (lower.includes('scarf')) return PRODUCT_SHAPES['SILK_SCARF'];

  if (lower.includes('sticker') || lower.includes('magnet') || lower.includes('button')) return PRODUCT_SHAPES['STICKER'];
  if (lower.includes('case') || lower.includes('skin')) return PRODUCT_SHAPES['PHONE_CASE'];
  if (lower.includes('pillow')) return PRODUCT_SHAPES['PILLOW'];
  if (lower.includes('poster') || lower.includes('canvas') || lower.includes('print')) return PRODUCT_SHAPES['POSTER'];

  return DEFAULT_RECTANGLE;
}


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
    const { designUrl, productType, color = '#f2f2f2' } = options; // Default to light grey for realism
    const template = getTemplate(productType);

    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');

    this.canvas.width = template.width;
    this.canvas.height = template.height;

    // 1. Clear & Setup
    this.ctx.clearRect(0, 0, template.width, template.height);

    // 2. Draw Product Base (with drop shadow baked in)
    template.draw(this.ctx, color);

    // 3. Load Design
    let designImg;
    try {
      designImg = await this.loadImage(designUrl);
    } catch {
      return {
        url: this.canvas.toDataURL(),
        productType, width: template.width, height: template.height
      };
    }

    const area = template.designArea;

    this.ctx.save();

    // PRO TIP: Multiply blend mode makes the design look like it's printed ON the fabric
    this.ctx.globalCompositeOperation = 'multiply';
    this.ctx.globalAlpha = 0.9; // Slight transparency for texture bleed-through

    this.ctx.drawImage(designImg, area.x, area.y, area.width, area.height);
    this.ctx.restore();

    // 4. Texture Overlay (Noise) - Adds realism
    this.addNoiseOverlay(template);

    return {
      url: this.canvas.toDataURL('image/png'),
      productType,
      width: template.width,
      height: template.height
    };
  }

  async generateBaseProduct(productType: string, color: string = '#f2f2f2'): Promise<string> {
    const template = getTemplate(productType);
    if (!this.canvas || !this.ctx) throw new Error('Canvas unavailable');

    this.canvas.width = template.width;
    this.canvas.height = template.height;

    this.ctx.clearRect(0, 0, template.width, template.height);

    template.draw(this.ctx, color);
    // Base products don't get texture overlay to keep file size low for previews

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

  private addNoiseOverlay(template: any) {
    if (!this.ctx) return;

    // Add subtle brightness gradient (lighting source top-left)
    const grad = this.ctx.createLinearGradient(0, 0, template.width, template.height);
    grad.addColorStop(0, 'rgba(255,255,255,0.1)');
    grad.addColorStop(0.5, 'rgba(255,255,255,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.05)');

    this.ctx.globalCompositeOperation = 'overlay';
    this.ctx.fillStyle = grad;
    this.ctx.fillRect(0, 0, template.width, template.height);
    this.ctx.globalCompositeOperation = 'source-over';
  }
}

function shadeColor(color: string, percent: number): string {
  // Simple shader helper
  const f = parseInt(color.slice(1), 16), t = percent < 0 ? 0 : 255, p = percent < 0 ? percent * -1 : percent, R = f >> 16, G = f >> 8 & 0x00FF, B = f & 0x0000FF;
  return "#" + (0x1000000 + (Math.round((t - R) * p) + R) * 0x10000 + (Math.round((t - G) * p) + G) * 0x100 + (Math.round((t - B) * p) + B)).toString(16).slice(1);
}

export const canvasMockupService = new CanvasMockupService();
