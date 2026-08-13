/**
 * maze-data.js
 * Grid, walls, ghost house, tunnels, pellets, and navigation network
 * for the GitHub Pac-Man Profile Banner (1280x640).
 */

export const GRID_CONFIG = {
  canvasWidth: 1280,
  canvasHeight: 640,
  cols: 30,
  rows: 13,
  cellW: 40,
  cellH: 40,
  originX: 40,
  originY: 60
};

// Helper to convert grid coordinates (col, row) to canvas pixels (x, y)
export function gridToPixel(col, row) {
  return {
    x: GRID_CONFIG.originX + col * GRID_CONFIG.cellW + GRID_CONFIG.cellW / 2,
    y: GRID_CONFIG.originY + row * GRID_CONFIG.cellH + GRID_CONFIG.cellH / 2
  };
}

/**
 * Neon Arcade Double-Wall Architecture
 * Formatted with rounded corners for authentic classic arcade aesthetics.
 */
export const MAZE_WALLS = [
  // Outer Border Walls (with left and right tunnel gaps at row 6, y=300..340)
  // Top Outer Border
  { type: 'path', d: 'M 40,300 L 40,60 Q 40,50 50,50 L 1230,50 Q 1240,50 1240,60 L 1240,300' },
  // Bottom Outer Border
  { type: 'path', d: 'M 40,340 L 40,580 Q 40,590 50,590 L 1230,590 Q 1240,590 1240,580 L 1240,340' },
  
  // Left Tunnel Wings
  { type: 'path', d: 'M 0,290 L 90,290 Q 100,290 100,280 L 100,250 Q 100,240 90,240 L 40,240' },
  { type: 'path', d: 'M 0,350 L 90,350 Q 100,350 100,360 L 100,390 Q 100,400 90,400 L 40,400' },
  
  // Right Tunnel Wings
  { type: 'path', d: 'M 1280,290 L 1190,290 Q 1180,290 1180,280 L 1180,250 Q 1180,240 1190,240 L 1240,240' },
  { type: 'path', d: 'M 1280,350 L 1190,350 Q 1180,350 1180,360 L 1180,390 Q 1180,400 1190,400 L 1240,400' },

  // Top Left Quadrant Blocks
  { type: 'rect', x: 140, y: 90, w: 90, h: 50, rx: 8 },
  { type: 'rect', x: 270, y: 90, w: 120, h: 50, rx: 8 },
  { type: 'rect', x: 140, y: 175, w: 90, h: 30, rx: 8 },
  
  // Top Center-Left T-Block
  { type: 'path', d: 'M 430,90 H 560 Q 568,90 568,98 V 140 Q 568,148 560,148 H 515 V 190 Q 515,198 507,198 H 483 Q 475,198 475,190 V 148 H 430 Q 422,148 422,140 V 98 Q 422,90 430,90 Z' },

  // Top Center-Right T-Block
  { type: 'path', d: 'M 720,90 H 850 Q 858,90 858,98 V 140 Q 858,148 850,148 H 805 V 190 Q 805,198 797,198 H 773 Q 765,198 765,190 V 148 H 720 Q 712,148 712,140 V 98 Q 712,90 720,90 Z' },

  // Top Right Quadrant Blocks
  { type: 'rect', x: 890, y: 90, w: 120, h: 50, rx: 8 },
  { type: 'rect', x: 1050, y: 90, w: 90, h: 50, rx: 8 },
  { type: 'rect', x: 1050, y: 175, w: 90, h: 30, rx: 8 },

  // Central Top Divider Bar
  { type: 'rect', x: 610, y: 50, w: 60, h: 60, rx: 8 },

  // GUNESH BARI Enclosure Wall / Neon Arcade Frame
  // Surrounds the nameplate to integrate it architecturally into the maze
  { type: 'path', d: 'M 280,225 H 1000 Q 1012,225 1012,237 V 305 Q 1012,317 1000,317 H 280 Q 268,317 268,305 V 237 Q 268,225 280,225 Z' },

  // Ghost House (Central Area, Y=360..435)
  { type: 'path', d: 'M 520,360 H 580 V 366 H 520 Q 510,366 510,376 V 430 Q 510,440 520,440 H 760 Q 770,440 770,430 V 376 Q 770,366 760,366 H 700 V 360 H 760 Q 776,360 776,376 V 430 Q 776,446 760,446 H 520 Q 504,446 504,430 V 376 Q 504,360 520,360 Z' },

  // Ghost House Glowing Door (Pink neon entry)
  { type: 'door', x: 580, y: 360, w: 120, h: 6 },

  // Mid Left Wing L-Blocks
  { type: 'path', d: 'M 140,240 H 220 Q 228,240 228,248 V 340 Q 228,348 220,348 H 180 Q 172,348 172,340 V 280 H 140 Q 132,280 132,272 V 248 Q 132,240 140,240 Z' },
  // Mid Right Wing L-Blocks
  { type: 'path', d: 'M 1060,240 H 1140 Q 1148,240 1148,248 V 272 Q 1148,280 1140,280 H 1108 V 340 Q 1108,348 1100,348 H 1060 Q 1052,348 1052,340 V 248 Q 1052,240 1060,240 Z' },

  // Lower Left Quadrant Blocks
  { type: 'rect', x: 140, y: 435, w: 90, h: 35, rx: 8 },
  { type: 'path', d: 'M 270,360 H 330 Q 338,360 338,368 V 440 H 380 Q 388,440 388,448 V 470 Q 388,478 380,478 H 300 Q 292,478 292,470 V 398 H 270 Q 262,398 262,390 V 368 Q 262,360 270,360 Z' },
  { type: 'rect', x: 140, y: 505, w: 190, h: 40, rx: 8 },
  { type: 'rect', x: 370, y: 515, w: 80, h: 30, rx: 8 },

  // Lower Center Blocks
  { type: 'path', d: 'M 430,360 H 470 Q 478,360 478,368 V 470 Q 478,478 470,478 H 430 Q 422,478 422,470 V 368 Q 422,360 430,360 Z' },
  { type: 'path', d: 'M 540,480 H 740 Q 748,480 748,488 V 500 Q 748,508 740,508 H 655 V 545 Q 655,553 647,553 H 633 Q 625,553 625,545 V 508 H 540 Q 532,508 532,500 V 488 Q 532,480 540,480 Z' },
  { type: 'path', d: 'M 810,360 H 850 Q 858,360 858,368 V 470 Q 858,478 850,478 H 810 Q 802,478 802,470 V 368 Q 802,360 810,360 Z' },

  // Lower Right Quadrant Blocks
  { type: 'path', d: 'M 950,360 H 1010 Q 1018,360 1018,368 V 390 Q 1018,398 1010,398 H 988 V 470 Q 988,478 980,478 H 900 Q 892,478 892,470 V 448 Q 892,440 900,440 H 942 V 368 Q 942,360 950,360 Z' },
  { type: 'rect', x: 1050, y: 435, w: 90, h: 35, rx: 8 },
  { type: 'rect', x: 950, y: 505, w: 190, h: 40, rx: 8 },
  { type: 'rect', x: 830, y: 515, w: 80, h: 30, rx: 8 }
];

/**
 * 4 Power Pellets in Strategic Corners
 */
export const POWER_PELLETS = [
  { id: 'pp-top-left', x: 90, y: 120 },
  { id: 'pp-top-right', x: 1190, y: 120 },
  { id: 'pp-bottom-left', x: 90, y: 535 },
  { id: 'pp-bottom-right', x: 1190, y: 535 }
];

/**
 * Generate regular pellet dots along navigable corridors.
 * Evenly distributed along walkable lines without overlapping walls or power pellets.
 */
export function generatePellets() {
  const pellets = [];
  let id = 0;

  // Helper to add a horizontal line of pellets
  function addHLine(y, xStart, xEnd, step = 35) {
    for (let x = xStart; x <= xEnd; x += step) {
      // Don't place on power pellet coordinates
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 25);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  // Helper to add a vertical line of pellets
  function addVLine(x, yStart, yEnd, step = 35) {
    for (let y = yStart; y <= yEnd; y += step) {
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 25);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  // Top Outer Hallway (Y = 70)
  addHLine(70, 100, 580, 32);
  addHLine(70, 700, 1180, 32);

  // Top Inner Hallway (Y = 160)
  addHLine(160, 100, 400, 32);
  addHLine(160, 530, 750, 32);
  addHLine(160, 880, 1180, 32);

  // Nameplate Top Corridor (Y = 210)
  addHLine(210, 250, 1030, 30);

  // Mid Cross Hallway (Y = 335)
  addHLine(335, 100, 240, 30);
  addHLine(335, 1040, 1180, 30);

  // Lower Inner Hallway (Y = 410)
  addHLine(410, 100, 240, 32);
  addHLine(410, 1040, 1180, 32);

  // Lower Main Corridor (Y = 490)
  addHLine(490, 100, 500, 32);
  addHLine(490, 780, 1180, 32);

  // Bottom Outer Hallway (Y = 565)
  addHLine(565, 100, 600, 32);
  addHLine(565, 680, 1180, 32);

  // Vertical Outer Left & Right Corridors
  addVLine(90, 150, 220, 35);
  addVLine(90, 420, 510, 35);
  addVLine(1190, 150, 220, 35);
  addVLine(1190, 420, 510, 35);

  // Inner Vertical Connecting Corridors
  addVLine(250, 80, 200, 30);
  addVLine(250, 340, 480, 30);
  addVLine(410, 80, 200, 30);
  addVLine(410, 340, 480, 30);

  addVLine(870, 80, 200, 30);
  addVLine(870, 340, 480, 30);
  addVLine(1030, 80, 200, 30);
  addVLine(1030, 340, 480, 30);

  // Central Vertical Connectors (beside Ghost House)
  addVLine(490, 220, 350, 32);
  addVLine(790, 220, 350, 32);

  return pellets;
}

export const PELLETS = generatePellets();
