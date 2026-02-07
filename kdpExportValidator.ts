/**
 * KDP EXPORT VALIDATOR
 * This service BLOCKS exports if placeholder or AI-leak content is detected.
 * Created in response to critical KDP audit findings.
 */

import { KDPBlueprint } from './types';

// CRITICAL: These patterns will BLOCK export if found in any chapter content
const EXPORT_BLOCKERS = [
    // Placeholder/instruction leaks
    /placeholder content/i,
    /awaiting ai generation/i,
    /click(\s+the)?\s*["']?generate["']?/i,
    /gemini api key/i,
    /ollama/i,
    /localhost:\d+/i,
    /industrial expand/i,
    /generate all chapters/i,
    /api key is valid/i,
    /internet connection is active/i,
    /\[this is placeholder/i,
    /content will be generated when/i,

    // Engine terminology leaks
    /\bLogic engine\b/i,
    /\bCorruption Logic\b/i,
    /\bPersonal Stakes Logic\b/i,
    /\bexpand button\b/i,

    // Template/generator branding
    /INDUSTRIAL ASSET GEN/i,
    /Artisan AI Genesis/i,
    /\bArtisan author\b/i,
    /Gemini 1.5/i,
    /Gemini Pro/i,
    /Gemini Flash/i,
];

// Warning patterns - flag but don't block
const EXPORT_WARNINGS = [
    // Repetitive AI patterns (sample detection)
    /copper and mildew/gi,
    /like a damp shroud/gi,
    /web of deceit/gi,
    /other shoe to drop/gi,

    // Generic AI-smell metaphors
    /like a physical presence/gi,
    /hung in the air/gi,
    /weight of (the|\w+) silence/gi,
];

export interface ExportValidationResult {
    canExport: boolean;
    blockers: {
        chapter: number;
        pattern: string;
        matchedText: string;
    }[];
    warnings: {
        chapter: number;
        pattern: string;
        count: number;
    }[];
    authorMismatch: boolean;
    missingContent: number[];
}

export const kdpExportValidator = {
    /**
     * Validate a blueprint before export
     * Returns blockers that MUST be fixed and warnings that SHOULD be reviewed
     */
    validate(blueprint: KDPBlueprint): ExportValidationResult {
        const result: ExportValidationResult = {
            canExport: true,
            blockers: [],
            warnings: [],
            authorMismatch: false,
            missingContent: []
        };

        // Check author consistency
        const author = blueprint.PROJECT_META.suggestedAuthor;
        if (!author || author.toLowerCase() === 'anonymous' || author.toLowerCase() === 'artisan ai') {
            result.authorMismatch = true;
            result.canExport = false;
        }

        // Validate each chapter
        for (const chapter of blueprint.INTERIOR_CONTENT) {
            const content = chapter.content || '';

            // Check for missing content
            if (!content || content.trim().length < 100) {
                result.missingContent.push(chapter.chapter);
                result.canExport = false;
            }

            // Check for export blockers
            for (const pattern of EXPORT_BLOCKERS) {
                const match = content.match(pattern);
                if (match) {
                    result.blockers.push({
                        chapter: chapter.chapter,
                        pattern: pattern.toString(),
                        matchedText: match[0].substring(0, 50)
                    });
                    result.canExport = false;
                }
            }

            // Check for warnings (repetition detection)
            for (const pattern of EXPORT_WARNINGS) {
                const matches = content.match(pattern);
                if (matches && matches.length > 2) {
                    result.warnings.push({
                        chapter: chapter.chapter,
                        pattern: pattern.toString(),
                        count: matches.length
                    });
                }
            }
        }

        return result;
    },

    /**
     * Generate a human-readable report
     */
    generateReport(result: ExportValidationResult): string {
        if (result.canExport && result.warnings.length === 0) {
            return '✅ EXPORT VALIDATION PASSED - No issues detected.';
        }

        let report = '# KDP Export Validation Report\n\n';

        if (!result.canExport) {
            report += '## 🚨 EXPORT BLOCKED\n\nThe following issues MUST be fixed before export:\n\n';
        }

        if (result.authorMismatch) {
            report += '- **Author Name Missing**: Please set a real author name (not "Anonymous" or "Artisan AI")\n';
        }

        if (result.missingContent.length > 0) {
            report += `- **Missing Content**: Chapters ${result.missingContent.join(', ')} have no or insufficient content\n`;
        }

        if (result.blockers.length > 0) {
            report += '\n### Placeholder/Instruction Leaks Detected:\n\n';
            for (const blocker of result.blockers) {
                report += `- **Chapter ${blocker.chapter}**: Found "${blocker.matchedText}..."\n`;
            }
        }

        if (result.warnings.length > 0) {
            report += '\n## ⚠️ WARNINGS (Review Recommended)\n\n';
            for (const warning of result.warnings) {
                report += `- **Chapter ${warning.chapter}**: Phrase repeated ${warning.count}x - may signal AI-generated content\n`;
            }
        }

        return report;
    }
};
