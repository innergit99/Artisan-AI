/**
 * Word Search Generator Engine
 * Places words in a grid with collision detection.
 * Outputs SVGs for Puzzle and Solution.
 */

export class WordSearchGenerator {
    private size: number = 15;
    private grid: string[][] = [];
    private solutionGrid: string[][] = [];
    private words: string[] = [];

    constructor(size: number = 15) {
        this.size = size;
    }

    public generate(wordList: string[]): { puzzleSvg: string, solutionSvg: string, placedWords: string[] } {
        this.words = wordList.map(w => w.toUpperCase().replace(/[^A-Z]/g, ''));
        this.resetGrid();

        const placedWords: string[] = [];

        for (const word of this.words) {
            if (this.placeWord(word)) {
                placedWords.push(word);
            }
        }

        // Fill empty cells with random letters
        this.fillEmptyCells();

        // Create solution SVG (Highlight words from solutionGrid)
        const solutionSvg = this.renderSVG(this.grid, true);

        // Create puzzle SVG (Standard black)
        const puzzleSvg = this.renderSVG(this.grid, false);

        return { puzzleSvg, solutionSvg, placedWords };
    }

    private resetGrid() {
        this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(''));
        this.solutionGrid = Array.from({ length: this.size }, () => Array(this.size).fill(''));
    }

    private placeWord(word: string): boolean {
        const directions = [
            [0, 1],   // Horizontal
            [1, 0],   // Vertical
            [1, 1],   // Diagonal Down-Right
            [-1, 1]   // Diagonal Up-Right
        ];

        // Shuffle directions
        const shuffledDirs = directions.sort(() => Math.random() - 0.5);

        for (const [dr, dc] of shuffledDirs) {
            // Try 50 random start positions for this direction
            for (let attempt = 0; attempt < 50; attempt++) {
                const r = Math.floor(Math.random() * this.size);
                const c = Math.floor(Math.random() * this.size);

                if (this.canPlace(word, r, c, dr, dc)) {
                    this.writeWord(word, r, c, dr, dc);
                    return true;
                }
            }
        }
        return false;
    }

    private canPlace(word: string, r: number, c: number, dr: number, dc: number): boolean {
        if (r + dr * (word.length - 1) < 0 || r + dr * (word.length - 1) >= this.size) return false;
        if (c + dc * (word.length - 1) < 0 || c + dc * (word.length - 1) >= this.size) return false;

        for (let i = 0; i < word.length; i++) {
            const charAtPos = this.grid[r + dr * i][c + dc * i];
            if (charAtPos !== '' && charAtPos !== word[i]) {
                return false; // Collision
            }
        }
        return true;
    }

    private writeWord(word: string, r: number, c: number, dr: number, dc: number) {
        for (let i = 0; i < word.length; i++) {
            const row = r + dr * i;
            const col = c + dc * i;
            this.grid[row][col] = word[i];
            this.solutionGrid[row][col] = word[i]; // Track for solution highlight
        }
    }

    private fillEmptyCells() {
        const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                if (this.grid[r][c] === '') {
                    this.grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
                }
            }
        }
    }

    private renderSVG(grid: string[][], isSolution: boolean): string {
        const cellSize = 30;
        const boardSize = cellSize * this.size;

        let svg = `<svg width="${boardSize + 20}" height="${boardSize + 20}" viewBox="-10 -10 ${boardSize + 20} ${boardSize + 20}" xmlns="http://www.w3.org/2000/svg">`;

        // Background
        svg += `<rect x="0" y="0" width="${boardSize}" height="${boardSize}" fill="white" stroke="black" stroke-width="2"/>`;

        for (let r = 0; r < this.size; r++) {
            for (let c = 0; c < this.size; c++) {
                const char = grid[r][c];

                const isSolutionCell = this.solutionGrid[r][c] !== '';
                const fillColor = isSolution && isSolutionCell ? 'red' : 'black';
                const fontWeight = isSolution && isSolutionCell ? 'bold' : 'normal';

                if (char !== '') {
                    svg += `<text x="${c * cellSize + cellSize / 2}" y="${r * cellSize + cellSize / 2 + 8}" font-family="Courier New, monospace" font-size="20" font-weight="${fontWeight}" text-anchor="middle" fill="${fillColor}">${char}</text>`;

                    // Add circle for solution?
                    if (isSolution && isSolutionCell) {
                        svg += `<circle cx="${c * cellSize + cellSize / 2}" cy="${r * cellSize + cellSize / 2}" r="${cellSize / 2 - 2}" stroke="red" stroke-width="1" fill="none" opacity="0.3" />`;
                    }
                }
            }
        }

        svg += `</svg>`;
        return svg;
    }
}
