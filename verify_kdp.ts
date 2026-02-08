
import { KDPCalculator } from './kdpCalculator.ts';
import { SudokuGenerator } from './sudokuGenerator.ts';
import { WordSearchGenerator } from './wordSearchGenerator.ts';
import { PlannerGenerator } from './plannerGenerator.ts';

async function runVerification() {
    console.log("=== KDP IMPLEMENTATION VERIFICATION ===\n");

    // 1. KDP Calculator Tests
    console.log("--- 1. Math Engine (Spine & Gutter) ---");

    // Spine
    const pages = 100;
    const spineWhite = KDPCalculator.getSpineWidth(pages, 'white');
    console.log(`Spine (100p White): ${spineWhite} in (Expected ~0.2252)`);
    if (Math.abs(spineWhite - 0.2252) < 0.0001) console.log("✅ Spine White PASS");
    else console.error("❌ Spine White FAIL");

    const spineCream = KDPCalculator.getSpineWidth(pages, 'cream');
    console.log(`Spine (100p Cream): ${spineCream} in (Expected ~0.2500)`);
    if (Math.abs(spineCream - 0.2500) < 0.0001) console.log("✅ Spine Cream PASS");
    else console.error("❌ Spine Cream FAIL");

    // Gutter
    const gutterSmall = KDPCalculator.getGutter(100);
    console.log(`Gutter (100p): ${gutterSmall} in (Expected 0.375)`);
    if (gutterSmall === 0.375) console.log("✅ Gutter Small PASS");
    else console.error("❌ Gutter Small FAIL");

    const gutterLarge = KDPCalculator.getGutter(600);
    console.log(`Gutter (600p): ${gutterLarge} in (Expected 0.750)`);
    if (gutterLarge === 0.750) console.log("✅ Gutter Large PASS");
    else console.error("❌ Gutter Large FAIL");

    // RTL Logic
    console.log("\n--- 2. Visual Layout (RTL Logic) ---");
    const oddPage = 3;
    const ltrResult = KDPCalculator.isLeftPage(oddPage, 'LTR');
    console.log(`Page 3 LTR is Left? ${ltrResult} (Expected: false [Right])`);
    if (ltrResult === false) console.log("✅ LTR Odd PASS");

    const rtlResult = KDPCalculator.isLeftPage(oddPage, 'RTL');
    console.log(`Page 3 RTL is Left? ${rtlResult} (Expected: true [Left])`);
    if (rtlResult === true) console.log("✅ RTL Odd PASS");

    // 2. Generators
    console.log("\n--- 3. Activity Generators ---");

    const sudoku = new SudokuGenerator();
    const sResult = sudoku.generate('EASY');
    console.log(`Sudoku Generated: Puzzle Size ${sResult.puzzle.length}x${sResult.puzzle[0].length}`);
    if (sResult.svg.includes("<svg") && sResult.puzzle[0].length === 9) console.log("✅ Sudoku SVG PASS");
    else console.error("❌ Sudoku FAIL");

    const wordSearch = new WordSearchGenerator();
    const wsResult = wordSearch.generate(["APPLE", "BANANA", "CHERRY"]);
    console.log(`Word Search Generated: ${wsResult.placedWords.length}/3 words placed`);
    if (wsResult.puzzleSvg.includes("<svg") && wsResult.solutionSvg.includes("red")) console.log("✅ Word Search SVG PASS");
    else console.error("❌ Word Search FAIL");

    const planner = new PlannerGenerator();
    const pResult = planner.generateMonthView(2025, 0); // Jan 2025
    console.log(`Planner Generated: Month View length ${pResult.length}`);
    if (pResult.includes("January 2025") && pResult.includes("<svg")) console.log("✅ Planner SVG PASS");
    else console.error("❌ Planner FAIL");

    console.log("\n=== VERIFICATION COMPLETE ===");
}

runVerification().catch(console.error);
