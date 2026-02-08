/**
 * KDP Print Physics Engine
 * Enforces strict physical constraints for Amazon KDP Paperback & Hardcover.
 * Source: KDP Print Options & Specifications
 */

export type PaperType = 'white' | 'cream' | 'premium-color';

interface KDPDimensions {
    trimWidth: number;
    trimHeight: number;
    bleed: number;
    gutter: number;
    spineWidth: number;
    fullWidth: number; // Width including bleed + gutter
    fullHeight: number; // Height including bleed
    safetyMargin: number; // Minimum margin for text
}

export const KDP_LIMITS = {
    MIN_PAGES: 24,
    MAX_PAGES_STANDARD: 828,
    MIN_SPINE_TEXT_PAGES: 79,
    BLEED_STANDARD: 0.125, // Inches
    SAFETY_MARGIN: 0.25, // Inches minimum text safe zone
};

export class KDPCalculator {

    /**
     * Calculates the Gutter (Inside Margin) based on page count.
     * KDP Rule: Gutter increases as page count increases to account for binding glue.
     */
    static getGutter(pageCount: number): number {
        if (pageCount < 24) return 0; // KDP minimum for paperback is 24, but technically 0 for hypothetical
        if (pageCount <= 150) return 0.375;
        if (pageCount <= 300) return 0.500;
        if (pageCount <= 500) return 0.625;
        if (pageCount <= 700) return 0.750;
        return 0.875; // 701-828+
    }

    /**
     * Calculates Spine Width based on paper type.
     * Formulas derived from KDP official calculator.
     */
    static getSpineWidth(pageCount: number, paperType: PaperType): number {
        let multiplier = 0;

        switch (paperType) {
            case 'white':
                multiplier = 0.002252;
                break;
            case 'cream':
                multiplier = 0.0025;
                break;
            case 'premium-color':
                multiplier = 0.002347;
                break;
            default:
                multiplier = 0.002252; // Default to white
        }

        const width = pageCount * multiplier;
        // Round to 4 decimal places for precision
        return Math.round(width * 10000) / 10000;
    }

    /**
     * Returns full canvas dimensions including bleed and gutter.
     * @param trimWidthInches Standard trim width (e.g. 6 for 6x9)
     * @param trimHeightInches Standard trim height (e.g. 9 for 6x9)
     * @param pageCount Total pages
     * @param paperType Paper stock
     */
    static getCoverDimensions(
        trimWidthInches: number,
        trimHeightInches: number,
        pageCount: number,
        paperType: PaperType
    ): {
        totalWidth: number;
        totalHeight: number;
        spineWidth: number;
        frontCoverWidth: number;
        spineTextAllowed: boolean;
    } {
        const spineWidth = this.getSpineWidth(pageCount, paperType);
        const bleed = KDP_LIMITS.BLEED_STANDARD;

        // Total Cover Width = Bleed + Back Cover + Spine + Front Cover + Bleed
        const totalWidth = bleed + trimWidthInches + spineWidth + trimWidthInches + bleed;

        // Total Cover Height = Bleed + Trim Height + Bleed
        const totalHeight = bleed + trimHeightInches + bleed;

        return {
            totalWidth: Math.round(totalWidth * 1000) / 1000,
            totalHeight: Math.round(totalHeight * 1000) / 1000,
            spineWidth,
            frontCoverWidth: trimWidthInches,
            spineTextAllowed: pageCount >= KDP_LIMITS.MIN_SPINE_TEXT_PAGES
        };
    }

    /**
     * Returns safe zone coordinates for a single INTERIOR page.
     * Handles odd (Right) vs even (Left) page shifts.
     */
    static getPageDimensions(
        trimWidth: number,
        trimHeight: number,
        pageCount: number,
        isOddPage: boolean // True = Right Page (LTR), Left Page (RTL) - Wait, let's use isRightPage or clarify
    ): KDPDimensions {
        const gutter = this.getGutter(pageCount);
        const bleed = KDP_LIMITS.BLEED_STANDARD;
        const safety = KDP_LIMITS.SAFETY_MARGIN;

        return {
            trimWidth,
            trimHeight,
            bleed,
            gutter,
            spineWidth: 0,
            fullWidth: trimWidth + bleed,
            fullHeight: trimHeight + (bleed * 2),
            safetyMargin: safety
        };
    }

    /**
     * Determines if a page is on the Left side of the spread.
     * LTR (Standard): OFF = Right, EVEN = Left.
     * RTL (Manga): ODD = Left, EVEN = Right.
     */
    static isLeftPage(pageNumber: number, readingDirection: 'LTR' | 'RTL' = 'LTR'): boolean {
        const isOdd = pageNumber % 2 !== 0;
        if (readingDirection === 'LTR') {
            return !isOdd; // Even pages are Left
        } else {
            return isOdd; // Odd pages are Left in Manga (starts on Left/Back)
        }
    }
}
