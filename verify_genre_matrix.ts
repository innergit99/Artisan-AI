// Mock import.meta.env for Node environment
(globalThis as any).import = { meta: { env: { VITE_GEMINI_API_KEY: 'test', VITE_FAL_API_KEY: 'test' } } };

import { resolveGenreSpec } from './geminiService';
import { KDP_GENRES } from './constants';

console.log('=== GENRE MATRIX VERIFICATION ===\n');

const results: any[] = [];

for (const genre of KDP_GENRES) {
    const { key, spec } = resolveGenreSpec(genre.id);
    const passed = spec !== undefined && spec.style !== 'Standard commercial fiction structure.' || genre.id === 'default';

    // Specific health checks
    const isMangaOk = genre.id === 'manga' ? spec.readingDir === 'rtl' : true;
    const isFixedOk = (genre.id.includes('coloring') || genre.id === 'planner') ? spec.layout === 'fixed' : true;

    const status = (passed && isMangaOk && isFixedOk) ? '✅ PASS' : '❌ FAIL';

    results.push({
        id: genre.id,
        label: genre.label,
        backendKey: key,
        layout: spec.layout,
        readingDir: spec.readingDir,
        status: status
    });
}

console.table(results);

const failures = results.filter(r => r.status.includes('FAIL'));
if (failures.length > 0) {
    console.error(`\n❌ Verification failed for ${failures.length} genres.`);
    process.exit(1);
} else {
    console.log('\n✨ All genres verified successfully!');
}
