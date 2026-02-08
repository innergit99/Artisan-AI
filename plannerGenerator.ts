/**
 * Planner Generator Engine
 * Generates date-aware calendar grids and vector layouts for planners.
 * Outputs SVG for direct KDP PDF embedding.
 */

export class PlannerGenerator {

    /**
     * Generates a monthly view SVG.
     * @param year Year (e.g., 2025)
     * @param month Month (0-11, where 0 is January)
     */
    public generateMonthView(year: number, month: number): string {
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDay = new Date(year, month, 1).getDay(); // 0 = Sunday

        const monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"];

        const width = 800;
        const height = 1000;
        const margin = 50;
        const cellWidth = (width - 2 * margin) / 7;
        const cellHeight = (height - 2 * margin - 100) / 6; // 6 rows max

        let svg = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">`;

        // Background
        svg += `<rect x="0" y="0" width="${width}" height="${height}" fill="white" />`;

        // Title
        svg += `<text x="${width / 2}" y="${margin + 40}" font-family="Helvetica, Arial, sans-serif" font-size="48" font-weight="bold" text-anchor="middle" fill="#333">${monthNames[month]} ${year}</text>`;

        // Days Header
        const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        for (let i = 0; i < 7; i++) {
            svg += `<text x="${margin + i * cellWidth + cellWidth / 2}" y="${margin + 90}" font-family="Arial, sans-serif" font-size="18" text-anchor="middle" fill="#666">${days[i]}</text>`;
        }

        // Grid
        let currentDay = 1;
        let currentRow = 0;
        let startCol = firstDay;

        // Grid Top Line
        const gridTop = margin + 100;

        svg += `<g stroke="#333" stroke-width="1" fill="none">`;

        // Outer Rect
        svg += `<rect x="${margin}" y="${gridTop}" width="${width - 2 * margin}" height="${cellHeight * 6}" />`;

        // Vertical Lines
        for (let i = 1; i < 7; i++) {
            svg += `<line x1="${margin + i * cellWidth}" y1="${gridTop}" x2="${margin + i * cellWidth}" y2="${gridTop + cellHeight * 6}" />`;
        }

        // Horizontal Lines
        for (let i = 1; i < 6; i++) {
            svg += `<line x1="${margin}" y1="${gridTop + i * cellHeight}" x2="${width - margin}" y2="${gridTop + i * cellHeight}" />`;
        }

        svg += `</g>`;

        // Dates
        for (let row = 0; row < 6; row++) {
            for (let col = 0; col < 7; col++) {
                if (row === 0 && col < startCol) continue;
                if (currentDay > daysInMonth) break;

                const x = margin + col * cellWidth + 10;
                const y = gridTop + row * cellHeight + 25;

                svg += `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="20" fill="#333">${currentDay}</text>`;
                currentDay++;
            }
        }

        svg += `</svg>`;
        return svg;
    }

    public generateWeeklyView(year: number, month: number, startDay: number): string {
        // Placeholder for weekly layout
        return `<svg width="800" height="1000" xmlns="http://www.w3.org/2000/svg"><text x="50" y="50">Weekly View Not Implemented</text></svg>`;
    }
}
