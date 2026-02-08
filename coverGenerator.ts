/**
 * Canvas-Based Cover Generator
 * Creates professional book covers without external API dependencies
 */

interface CoverOptions {
    title: string;
    author: string;
    genre: string;
    width?: number;
    height?: number;
    colorScheme?: 'vibrant' | 'dark' | 'minimal' | 'elegant';
}

export interface KDPWrapOptions extends CoverOptions {
    pageCount: number;
    paperType: 'white' | 'cream' | 'color'; // KDP paper thickness varies
    trimWidth: number; // e.g., 6
    trimHeight: number; // e.g., 9
    bleed?: number; // usually 0.125
    blurb?: string;
}

export class CoverGenerator {
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;

    constructor() {
        if (typeof document !== 'undefined') {
            this.canvas = document.createElement('canvas');
            const context = this.canvas.getContext('2d');
            if (!context) throw new Error('Canvas not supported');
            this.ctx = context;
        } else {
            // Fallback for SSR or non-browser environments if needed
            this.canvas = {} as any;
            this.ctx = {} as any;
        }
    }

    /**
     * Generate a professional front cover
     */
    async generateCover(options: CoverOptions): Promise<string> {
        const {
            title,
            author,
            genre,
            width = 1600,
            height = 2400,
            colorScheme = 'vibrant'
        } = options;

        this.canvas.width = width;
        this.canvas.height = height;

        const palette = this.getColorPalette(genre, colorScheme);

        // 1. Background
        this.drawBackground(palette);

        // 2. Front Cover Elements
        this.drawGenericFrontCover(width, height, options, palette);

        return this.canvas.toDataURL('image/png', 0.95);
    }

    /**
     * Generate KDP Print-Ready Full Wrap
     * Layout: [Back][Spine][Front]
     */
    async generateFullWrap(options: KDPWrapOptions, frontImageUrl?: string, backImageUrl?: string): Promise<string> {
        const dpi = 300;
        const bleedPx = (options.bleed || 0.125) * dpi;
        const trimWidthPx = options.trimWidth * dpi;
        const trimHeightPx = options.trimHeight * dpi;

        const spineWidthPx = this.calculateSpineWidthPixels(options.pageCount, options.paperType, dpi);

        const totalWidth = (trimWidthPx * 2) + spineWidthPx + (bleedPx * 2);
        const totalHeight = trimHeightPx + (bleedPx * 2);

        this.canvas.width = totalWidth;
        this.canvas.height = totalHeight;

        const palette = this.getColorPalette(options.genre, options.colorScheme || 'vibrant');

        // Helper to load image
        const loadImage = (url: string) => new Promise<HTMLImageElement>((res, rej) => {
            const img = new Image();
            if (!url.startsWith('data:')) {
                img.crossOrigin = "anonymous";
            }
            img.onload = () => res(img);
            img.onerror = (e) => {
                console.error("Failed to load image for canvas:", url.substring(0, 50) + "...");
                rej(e);
            };
            img.src = url;
        });

        // 1. Draw Background (Base layer)
        this.ctx.fillStyle = palette.primary;
        this.ctx.fillRect(0, 0, totalWidth, totalHeight);

        // 2. BACK COVER (Left Panel)
        const backX = bleedPx;
        if (backImageUrl) {
            try {
                const backImg = await loadImage(backImageUrl);
                this.ctx.drawImage(backImg, backX, bleedPx, trimWidthPx, trimHeightPx);
            } catch (e) {
                console.warn("Back cover image failed to load, using default background.");
            }
        }

        // Draw Barcode Area (Safe zone)
        // Draw Barcode Area (Safe zone) - BOTTOM RIGHT
        const barcodeW = 2 * dpi;
        const barcodeH = 1.2 * dpi;
        // Position: Bottom Right of Back Cover, inside bleed
        const barcodeX = backX + trimWidthPx - barcodeW - (0.375 * dpi); // 0.375" margin
        const barcodeY = totalHeight - bleedPx - barcodeH - (0.375 * dpi);

        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.fillRect(barcodeX, barcodeY, barcodeW, barcodeH);

        // Draw Blurb
        if (options.blurb) {
            this.ctx.save();

            // Always draw a subtle backing for the blurb to ensure readability against any background
            this.ctx.fillStyle = 'rgba(0,0,0,0.6)';
            if (backImageUrl) {
                this.ctx.fillStyle = 'rgba(0,0,0,0.85)'; // Darker if over an image
            }
            this.ctx.fillRect(backX + 40, totalHeight * 0.15, trimWidthPx - 80, totalHeight * 0.55);

            this.ctx.fillStyle = '#FFFFFF';
            this.ctx.font = '48px "Georgia", serif'; // Larger font for print
            this.ctx.textAlign = 'left';
            this.ctx.textBaseline = 'top';

            const blurbX = backX + 80;
            const blurbY = totalHeight * 0.20;
            const blurbWidth = trimWidthPx - 160;
            const lineHeight = 60; // Slightly tighter leading

            // Handle paragraphs with overflow protection
            const paragraphs = options.blurb.substring(0, 1200).split('\n'); // Truncate to safe length
            let y = blurbY;

            paragraphs.forEach(para => {
                const words = para.split(' ');
                let line = '';

                for (const word of words) {
                    const testLine = line + word + ' ';
                    const metrics = this.ctx.measureText(testLine);
                    if (metrics.width > blurbWidth && line !== '') {
                        this.ctx.fillText(line, blurbX, y);
                        line = word + ' ';
                        y += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                this.ctx.fillText(line, blurbX, y);
                y += lineHeight * 1.5;
            });

            this.ctx.restore();
        }

        // 3. SPINE (Center Panel)
        const spineX = bleedPx + trimWidthPx;
        this.ctx.fillStyle = palette.secondary;
        // Darken spine color for better contrast/professional look
        // We simulate a darker shade by overlaying semi-transparent black
        this.ctx.fillRect(spineX, bleedPx, spineWidthPx, trimHeightPx);
        this.ctx.fillStyle = 'rgba(0,0,0,0.3)';
        this.ctx.fillRect(spineX, bleedPx, spineWidthPx, trimHeightPx);

        if (spineWidthPx > 40) {
            this.ctx.save();
            this.ctx.translate(spineX + spineWidthPx / 2, totalHeight / 2);
            this.ctx.rotate(Math.PI / 2);
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillStyle = '#FFFFFF';

            // Safety margin: KDP requires text to be 0.0625" away from fold. 
            // We use a safe max width of totalHeight - 1 inch (0.5" margin top/bottom)
            const maxSpineTextWidth = totalHeight - (dpi * 1.5);

            // Adaptive font size for spine
            let spineFontSize = 28;
            if (spineWidthPx < 60) spineFontSize = 22;
            if (spineWidthPx < 50) spineFontSize = 16; // Smaller for safety

            this.ctx.font = `bold ${spineFontSize}px Arial`;

            const spineText = `${options.title.toUpperCase()}  •  ${options.author.toUpperCase()}`;
            const metrics = this.ctx.measureText(spineText);
            if (metrics.width > maxSpineTextWidth) {
                const scale = maxSpineTextWidth / metrics.width;
                this.ctx.scale(scale, scale);
            }

            this.ctx.fillText(spineText, 0, 0);
            this.ctx.restore();
        }

        // 4. FRONT COVER (Right Panel)
        const frontX = spineX + spineWidthPx;
        if (frontImageUrl) {
            try {
                const frontImg = await loadImage(frontImageUrl);
                this.ctx.drawImage(frontImg, frontX, bleedPx, trimWidthPx, trimHeightPx);

                // Draw Title and Author as OVERLAY
                this.ctx.save();
                this.ctx.translate(frontX, bleedPx);
                this.drawWrappedTitle(options.title, trimWidthPx, trimHeightPx, palette);
                this.drawAuthor(options.author, trimWidthPx, trimHeightPx, palette);
                this.ctx.restore();
            } catch (e) {
                console.warn("Front cover image failed to load.");
            }
        } else {
            this.ctx.save();
            this.ctx.translate(frontX, bleedPx);
            this.drawGenericFrontCover(trimWidthPx, trimHeightPx, options, palette);
            this.ctx.restore();
        }

        return this.canvas.toDataURL('image/png', 0.95);
    }

    private calculateSpineWidthPixels(pageCount: number, paperType: 'white' | 'cream' | 'color', dpi: number = 300): number {
        const factors = {
            'white': 0.002252,
            'cream': 0.0025,
            'color': 0.002347
        };
        const inches = Math.max(pageCount * factors[paperType], 0.1);
        return Math.ceil(inches * dpi);
    }

    private getColorPalette(genre: string, scheme: string) {
        const palettes: Record<string, any> = {
            'FICTION': {
                vibrant: { primary: '#6366f1', secondary: '#8b5cf6', accent: '#ec4899', text: '#ffffff' },
                dark: { primary: '#1e1b4b', secondary: '#312e81', accent: '#4f46e5', text: '#e0e7ff' },
                minimal: { primary: '#f8fafc', secondary: '#e2e8f0', accent: '#334155', text: '#0f172a' },
                elegant: { primary: '#18181b', secondary: '#27272a', accent: '#d4af37', text: '#fafafa' }
            },
            'MYSTERY': {
                vibrant: { primary: '#dc2626', secondary: '#991b1b', accent: '#fbbf24', text: '#ffffff' },
                dark: { primary: '#0f172a', secondary: '#1e293b', accent: '#dc2626', text: '#f1f5f9' },
                minimal: { primary: '#374151', secondary: '#4b5563', accent: '#dc2626', text: '#f9fafb' },
                elegant: { primary: '#1c1917', secondary: '#292524', accent: '#b91c1c', text: '#fafaf9' }
            },
            'ROMANCE': {
                vibrant: { primary: '#ec4899', secondary: '#db2777', accent: '#f472b6', text: '#ffffff' },
                dark: { primary: '#831843', secondary: '#9f1239', accent: '#fb7185', text: '#fce7f3' },
                minimal: { primary: '#fdf2f8', secondary: '#fce7f3', accent: '#be123c', text: '#881337' },
                elegant: { primary: '#4c0519', secondary: '#701a3a', accent: '#fda4af', text: '#fff1f2' }
            },
            'SCI-FI': {
                vibrant: { primary: '#0ea5e9', secondary: '#0284c7', accent: '#22d3ee', text: '#ffffff' },
                dark: { primary: '#082f49', secondary: '#0c4a6e', accent: '#06b6d4', text: '#e0f2fe' },
                minimal: { primary: '#f0f9ff', secondary: '#e0f2fe', accent: '#0369a1', text: '#075985' },
                elegant: { primary: '#0c4a6e', secondary: '#164e63', accent: '#67e8f9', text: '#f0fdfa' }
            },
            'FANTASY': {
                vibrant: { primary: '#7c3aed', secondary: '#6d28d9', accent: '#a78bfa', text: '#ffffff' },
                dark: { primary: '#3b0764', secondary: '#581c87', accent: '#a855f7', text: '#faf5ff' },
                minimal: { primary: '#faf5ff', secondary: '#f3e8ff', accent: '#7c3aed', text: '#581c87' },
                elegant: { primary: '#2e1065', secondary: '#4c1d95', accent: '#c4b5fd', text: '#faf5ff' }
            },
            'CHILDREN': {
                vibrant: { primary: '#f59e0b', secondary: '#d97706', accent: '#fbbf24', text: '#ffffff' },
                dark: { primary: '#78350f', secondary: '#92400e', accent: '#fbbf24', text: '#fef3c7' },
                minimal: { primary: '#fffbeb', secondary: '#fef3c7', accent: '#d97706', text: '#78350f' },
                elegant: { primary: '#451a03', secondary: '#78350f', accent: '#fcd34d', text: '#fef9c3' }
            }
        };

        const genreKey = Object.keys(palettes).find(k => genre.toUpperCase().includes(k)) || 'FICTION';
        return palettes[genreKey][scheme] || palettes['FICTION']['vibrant'];
    }

    private drawBackground(palette: any) {
        const { width, height } = this.canvas;
        const gradient = this.ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, palette.primary);
        gradient.addColorStop(0.5, palette.secondary);
        gradient.addColorStop(1, palette.accent);

        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, width, height);

        // Add subtle film grain for premium texture
        this.addGrain(0.05);
    }

    private addGrain(intensity: number) {
        const { width, height } = this.canvas;
        const imageData = this.ctx.getImageData(0, 0, width, height);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
            const noise = (Math.random() - 0.5) * intensity * 255;
            data[i] = Math.min(255, Math.max(0, data[i] + noise));
            data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
            data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
        }
        this.ctx.putImageData(imageData, 0, 0);
    }

    private drawGenericFrontCover(width: number, height: number, options: CoverOptions, palette: any) {
        this.drawProceduralPattern(options.genre, width, height, palette);
        this.drawGenreSymbol(options.genre, width, height, palette);
        this.drawWrappedTitle(options.title, width, height, palette);
        this.drawAuthor(options.author, width, height, palette);
    }

    private drawProceduralPattern(genre: string, width: number, height: number, palette: any) {
        this.ctx.save();
        const g = genre.toUpperCase();

        if (g.includes('MYSTERY') || g.includes('THRILLER') || g.includes('HORROR')) {
            // MYSTERY/THRILLER: Spotlight / Shadows / Fog
            // Radial spotlight off-center
            const spotX = width * 0.7;
            const spotY = height * 0.3;
            const rad = this.ctx.createRadialGradient(spotX, spotY, 0, spotX, spotY, width * 1.2);
            rad.addColorStop(0, 'rgba(255,255,255,0.05)');
            rad.addColorStop(1, 'rgba(0,0,0,0.8)');
            this.ctx.fillStyle = rad;
            this.ctx.fillRect(0, 0, width, height);

            // Sharp angular chaos lines for Thriller
            this.ctx.strokeStyle = 'rgba(255,255,255,0.03)';
            this.ctx.lineWidth = 2;
            for (let i = 0; i < 40; i++) {
                this.ctx.beginPath();
                this.ctx.moveTo(Math.random() * width, Math.random() * height);
                this.ctx.lineTo(Math.random() * width, Math.random() * height);
                this.ctx.stroke();
            }
        }
        else if (g.includes('ROMANCE')) {
            // ROMANCE: Soft Bokeh / Curves
            this.ctx.fillStyle = palette.accent;
            this.ctx.globalAlpha = 0.1;
            for (let i = 0; i < 15; i++) {
                this.ctx.beginPath();
                this.ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 300, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        else if (g.includes('FANTASY')) {
            // FANTASY: Magic particles / Ethereal glow
            const grad = this.ctx.createLinearGradient(0, height, width, 0);
            grad.addColorStop(0, 'rgba(0,0,0,0)');
            grad.addColorStop(0.5, palette.secondary);
            grad.addColorStop(1, palette.accent);
            this.ctx.globalAlpha = 0.2;
            this.ctx.fillStyle = grad;
            this.ctx.fillRect(0, 0, width, height);

            this.ctx.fillStyle = '#FFF';
            for (let i = 0; i < 100; i++) {
                this.ctx.globalAlpha = Math.random() * 0.5;
                this.ctx.beginPath();
                this.ctx.arc(Math.random() * width, Math.random() * height, Math.random() * 3, 0, Math.PI * 2);
                this.ctx.fill();
            }
        }
        else {
            // DEFAULT: Elegant Geometric Flow
            this.ctx.strokeStyle = palette.accent;
            this.ctx.globalAlpha = 0.1;
            this.ctx.lineWidth = 1;
            for (let i = 0; i < 50; i++) {
                this.ctx.beginPath();
                const x = Math.random() * width;
                const y = Math.random() * height;
                const size = Math.random() * 300;
                this.ctx.rect(x, y, size, size);
                this.ctx.stroke();
            }
        }
        this.ctx.restore();
    }

    private drawWrappedTitle(title: string, width: number, height: number, palette: any) {
        // KDP SAFE ZONE: Title must be 0.25" inside trim
        // We implement a massive safety margin
        const marginX = width * 0.15;
        const maxLineWidth = width - (marginX * 2);

        this.ctx.save();
        this.ctx.fillStyle = '#FFFFFF';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'top';
        this.ctx.shadowColor = 'rgba(0,0,0,0.8)';
        this.ctx.shadowBlur = 30;
        this.ctx.shadowOffsetY = 6;

        const words = title.toUpperCase().split(' ');
        let lines: string[] = [];
        let curLine = words[0];

        // Dynamic font sizing (Iterative approach to find max fit)
        let fontSize = width * 0.15; // Start huge
        if (title.length > 20) fontSize = width * 0.12;
        if (title.length > 40) fontSize = width * 0.08;

        this.ctx.font = `bold ${fontSize}px "Georgia", serif`;

        // Wrap Text Logic
        for (let i = 1; i < words.length; i++) {
            const w = words[i];
            const widthStart = this.ctx.measureText(curLine + " " + w).width;
            if (widthStart < maxLineWidth) {
                curLine += " " + w;
            } else {
                lines.push(curLine);
                curLine = w;
            }
        }
        lines.push(curLine);

        // Vertical Centering (Top 1/3 visual weight)
        const totalHeight = lines.length * (fontSize * 1.1);
        const startY = (height * 0.3) - (totalHeight / 2);

        lines.forEach((l, i) => {
            this.ctx.fillText(l, width / 2, startY + (i * fontSize * 1.1));
        });

        this.ctx.restore();
    }

    private drawAuthor(author: string, width: number, height: number, palette: any) {
        if (!author || author.includes("UNKNOWN")) return;

        // SAFETY CHECK: Ensure Author Name fits
        this.ctx.save();
        let fontSize = width * 0.06;
        this.ctx.font = `bold ${fontSize}px Arial`;

        const metrics = this.ctx.measureText(author.toUpperCase());
        if (metrics.width > width * 0.8) {
            // Shrink to fit
            const scale = (width * 0.8) / metrics.width;
            fontSize = fontSize * scale;
            this.ctx.font = `bold ${fontSize}px Arial`;
        }

        this.ctx.fillStyle = '#E0E0E0';
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'bottom';
        this.ctx.shadowColor = 'rgba(0,0,0,0.9)';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetY = 2;

        // Position: Bottom 10% line
        this.ctx.fillText(author.toUpperCase(), width / 2, height * 0.9);
        this.ctx.restore();
    }

    private drawGenreSymbol(genre: string, width: number, height: number, palette: any) {
        this.ctx.save();
        this.ctx.globalAlpha = 0.15; // Increased visibility
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';
        this.ctx.fillStyle = '#FFF';

        let symbol = "📖";
        let color = "#FFF";

        if (genre.includes('MYSTERY')) { symbol = "🔍"; color = "#60a5fa"; }
        if (genre.includes('THRILLER')) { symbol = "⚡"; color = "#fbbf24"; }
        if (genre.includes('ROMANCE')) { symbol = "♥"; color = "#f43f5e"; }
        if (genre.includes('FANTASY')) { symbol = "⚔"; color = "#8b5cf6"; }
        if (genre.includes('SCI-FI')) { symbol = "🚀"; color = "#22d3ee"; }
        if (genre.includes('HORROR')) { symbol = "👁"; color = "#ef4444"; }
        if (genre.includes('CHILDREN')) { symbol = "🎨"; color = "#facc15"; }

        this.ctx.font = `bold ${width / 2}px Arial`;
        this.ctx.fillStyle = color;
        this.ctx.fillText(symbol, width / 2, height / 2);

        // Add a secondary offset glow
        this.ctx.globalAlpha = 0.05;
        this.ctx.fillText(symbol, width / 2 + 10, height / 2 + 10);

        this.ctx.restore();
    }

    /**
     * Generate a simple interior illustration (Grayscale/Line art style)
     * Used as fallback for Chapter headers
     */
    async generateInteriorImage(prompt: string, title: string, genre: string): Promise<string> {
        const width = 1200; // High res
        const height = 900;
        this.canvas.width = width;
        this.canvas.height = height;

        const g = genre.toUpperCase();

        // Background - Soft off-white for paper feel
        this.ctx.fillStyle = '#fdfdfd';
        this.ctx.fillRect(0, 0, width, height);

        // Ornate Border
        this.ctx.strokeStyle = '#333';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(40, 40, width - 80, height - 80);
        this.ctx.lineWidth = 1;
        this.ctx.strokeRect(50, 50, width - 100, height - 100);

        // Genre Specific Centerpiece
        this.ctx.save();
        this.ctx.textAlign = 'center';
        this.ctx.textBaseline = 'middle';

        let symbol = "📜";
        let color = "#444";

        if (g.includes('MYSTERY')) { symbol = "🕵️"; color = "#1e293b"; }
        if (g.includes('ROMANCE')) { symbol = "🌹"; color = "#9f1239"; }
        if (g.includes('SCI-FI')) { symbol = "🛸"; color = "#0e7490"; }
        if (g.includes('FANTASY')) { symbol = "🐉"; color = "#4c1d95"; }
        if (g.includes('HORROR')) { symbol = "💀"; color = "#450a0a"; }
        if (g.includes('CHILDREN')) { symbol = "🧸"; color = "#b45309"; }

        // Draw shadow/glow
        this.ctx.font = `200px serif`;
        this.ctx.globalAlpha = 0.1;
        this.ctx.fillText(symbol, width / 2 + 5, height / 2 + 5);

        // Draw main symbol
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = color;
        this.ctx.fillText(symbol, width / 2, height / 2);

        // Add decorative corner elements
        const cornerSize = 100;
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = 2;
        this.ctx.globalAlpha = 0.4;

        // Top-Left corner adornment
        this.ctx.beginPath();
        this.ctx.moveTo(60, 60 + cornerSize);
        this.ctx.lineTo(60, 60);
        this.ctx.lineTo(60 + cornerSize, 60);
        this.ctx.stroke();

        // Bottom-Right corner
        this.ctx.beginPath();
        this.ctx.moveTo(width - 60, height - 60 - cornerSize);
        this.ctx.lineTo(width - 60, height - 60);
        this.ctx.lineTo(width - 60 - cornerSize, height - 60);
        this.ctx.stroke();

        this.ctx.restore();

        // Subtle background texture
        this.addGrain(0.02);

        return this.canvas.toDataURL('image/jpeg', 0.9);
    }

    /**
     * Generate a generic industrial placeholder for any module (POD, KDP, etc.)
     */
    async generateGenericPlaceholder(prompt: string, width: number, height: number): Promise<string> {
        this.canvas.width = width;
        this.canvas.height = height;

        const palette = this.getColorPalette('ADVENTURE', 'vibrant');
        this.drawBackground(palette);

        // CREATE STYLIZED ILLUSTRATION
        this.ctx.save();
        this.ctx.translate(width / 2, height / 2);

        // Circular Badge
        this.ctx.beginPath();
        this.ctx.arc(0, 0, width * 0.35, 0, Math.PI * 2);
        this.ctx.fillStyle = 'white';
        this.ctx.fill();
        this.ctx.lineWidth = 15;
        this.ctx.strokeStyle = palette[0];
        this.ctx.stroke();

        // Stylized symbol based on prompt
        this.ctx.fillStyle = palette[1];
        const size = width * 0.2;
        if (prompt.toLowerCase().includes('mountain') || prompt.toLowerCase().includes('adventure')) {
            this.ctx.beginPath();
            this.ctx.moveTo(-size, size); this.ctx.lineTo(0, -size); this.ctx.lineTo(size, size);
            this.ctx.closePath(); this.ctx.fill();
        } else if (prompt.toLowerCase().includes('space') || prompt.toLowerCase().includes('star')) {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, size, 0, Math.PI * 2);
            this.ctx.fill();
            this.ctx.fillStyle = 'white';
            this.ctx.beginPath();
            this.ctx.arc(size / 2, -size / 2, size / 3, 0, Math.PI * 2);
            this.ctx.fill();
        } else {
            // Default Abstract Emblem
            for (let i = 0; i < 4; i++) {
                this.ctx.rotate(Math.PI / 2);
                this.ctx.fillRect(-size / 2, -size / 2, size, size / 2);
            }
        }
        this.ctx.restore();

        // Industrial Frame
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 4;
        this.ctx.strokeRect(20, 20, width - 40, height - 40);

        return this.canvas.toDataURL('image/png');
    }
}

export const coverGenerator = new CoverGenerator();
