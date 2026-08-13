/**
 * maze-data.js
 * Symmetrical, centered arcade maze architecture for GitHub Profile Banner (1280x640).
 * 
 * Central Subject: "GUNESH BARI" is placed in the exact center at (X=640, Y=320).
 * 
 * Grid Corridor Centerlines (Strictly Orthogonal):
 * - Horizontal Corridors:
 *   - Y1 (Top Outer): y = 80
 *   - Y2 (Top Inner): y = 155
 *   - Y3 (Above GUNESH BARI): y = 230
 *   - Y4 (Middle Tunnel Level): y = 320 (x=0..200 and x=1080..1280)
 *   - Y5 (Below GUNESH BARI): y = 410
 *   - Y6 (Lower Inner): y = 485
 *   - Y7 (Bottom Outer): y = 560
 * 
 * - Vertical Corridors:
 *   - X1 (Left Outer): x = 85
 *   - X2 (Left Mid): x = 200
 *   - X3 (Left Inner): x = 340
 *   - X4 (Center-Left Flank): x = 490
 *   - X5 (Center-Right Flank): x = 790
 *   - X6 (Right Inner): x = 940
 *   - X7 (Right Mid): x = 1080
 *   - X8 (Right Outer): x = 1195
 */

export const CANVAS = {
  width: 1280,
  height: 640
};

export const MAZE_WALLS = [
  // 1. Outer Perimeter Border (with Left & Right Tunnel openings at y=295..345)
  // Top Outer Wall
  { type: 'path', d: 'M 50,295 L 50,60 Q 50,50 60,50 L 1220,50 Q 1230,50 1230,60 L 1230,295' },
  // Bottom Outer Wall
  { type: 'path', d: 'M 50,345 L 50,580 Q 50,590 60,590 L 1220,590 Q 1230,590 1230,580 L 1230,345' },
  
  // Left Tunnel Flanges
  { type: 'path', d: 'M 0,295 L 50,295' },
  { type: 'path', d: 'M 0,345 L 50,345' },
  // Right Tunnel Flanges
  { type: 'path', d: 'M 1230,295 L 1280,295' },
  { type: 'path', d: 'M 1230,345 L 1280,345' },

  // Top Center T-Stem Divider
  { type: 'path', d: 'M 625,50 V 110 Q 625,116 631,116 H 649 Q 655,116 655,110 V 50 Z' },

  // Top Horizontal Blocks (between y=80 and y=155)
  { type: 'rect', x: 120, y: 105, w: 50, h: 25, rx: 6 },
  { type: 'rect', x: 235, y: 105, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 375, y: 105, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 525, y: 105, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 670, y: 105, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 820, y: 105, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 970, y: 105, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 1110, y: 105, w: 50, h: 25, rx: 6 },

  // Side Wall T-Wings (Left & Right)
  { type: 'rect', x: 120, y: 180, w: 50, h: 90, rx: 6 },
  { type: 'rect', x: 1110, y: 180, w: 50, h: 90, rx: 6 },

  // Upper Mid Separators (between y=155 and y=230)
  { type: 'rect', x: 235, y: 180, w: 225, h: 25, rx: 6 },
  { type: 'rect', x: 820, y: 180, w: 225, h: 25, rx: 6 },
  { type: 'rect', x: 525, y: 180, w: 230, h: 25, rx: 6 },

  // =========================================================================
  // GUNESH BARI Architectural Frame
  // EXACT CENTER at X=640, Y=320. Dimensions: 740 x 70 (y=285..355).
  // Corridors around it: Top Y=230, Bottom Y=410, Left X=200, Right X=1080.
  // =========================================================================
  { type: 'rect', x: 270, y: 285, w: 740, h: 70, rx: 12 },

  // Lower Side Wall T-Wings (Left & Right)
  { type: 'rect', x: 120, y: 370, w: 50, h: 90, rx: 6 },
  { type: 'rect', x: 1110, y: 370, w: 50, h: 90, rx: 6 },

  // Lower Mid Separators (between y=355 and y=410 / y=485)
  { type: 'rect', x: 235, y: 435, w: 225, h: 25, rx: 6 },
  { type: 'rect', x: 820, y: 435, w: 225, h: 25, rx: 6 },

  // Ghost House (Symmetrically in Lower-Center: X=525..755, Y=435..485)
  { type: 'path', d: 'M 525,435 H 585 V 440 H 530 Q 525,440 525,445 V 480 Q 525,485 530,485 H 750 Q 755,485 755,480 V 445 Q 755,440 750,440 H 695 V 435 H 755 Q 760,435 760,440 V 485 Q 760,490 755,490 H 525 Q 520,490 520,485 V 440 Q 520,435 525,435 Z' },
  // Ghost House Door (Pink glowing gate at Y=435, X=585..695)
  { type: 'door', x: 585, y: 435, w: 110, h: 4 },

  // Bottom Center T-Divider
  { type: 'path', d: 'M 625,510 V 580 Q 625,586 631,586 H 649 Q 655,586 655,580 V 510 Z' },

  // Bottom Horizontal Blocks (between y=485 and y=560)
  { type: 'rect', x: 120, y: 510, w: 50, h: 25, rx: 6 },
  { type: 'rect', x: 235, y: 510, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 375, y: 510, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 525, y: 510, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 670, y: 510, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 820, y: 510, w: 85, h: 25, rx: 6 },
  { type: 'rect', x: 970, y: 510, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 1110, y: 510, w: 50, h: 25, rx: 6 }
];

/**
 * 4 Power Pellets in the 4 Outer Corners
 */
export const POWER_PELLETS = [
  { id: 'pp-top-left', x: 85, y: 80 },
  { id: 'pp-top-right', x: 1195, y: 80 },
  { id: 'pp-bottom-left', x: 85, y: 560 },
  { id: 'pp-bottom-right', x: 1195, y: 560 }
];

/**
 * Generate standard pellets along all walkable corridor lines.
 */
export function generatePellets() {
  const pellets = [];
  let id = 0;

  function addHLine(y, xStart, xEnd, step = 30) {
    for (let x = xStart; x <= xEnd; x += step) {
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 24);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  function addVLine(x, yStart, yEnd, step = 30) {
    for (let y = yStart; y <= yEnd; y += step) {
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 24);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  // Horizontal Lines
  // Top Outer (Y = 80)
  addHLine(80, 115, 600, 30);
  addHLine(80, 680, 1165, 30);

  // Top Inner (Y = 155)
  addHLine(155, 85, 1195, 30);

  // Above GUNESH BARI (Y = 230)
  addHLine(230, 200, 1080, 28);

  // Middle Tunnel Level (Y = 320)
  addHLine(320, 85, 200, 28);
  addHLine(320, 1080, 1195, 28);

  // Below GUNESH BARI (Y = 410)
  addHLine(410, 200, 1080, 28);

  // Lower Inner (Y = 485)
  addHLine(485, 85, 490, 30);
  addHLine(485, 790, 1195, 30);

  // Bottom Outer (Y = 560)
  addHLine(560, 115, 600, 30);
  addHLine(560, 680, 1165, 30);

  // Vertical Lines
  // Outer Left & Right
  addVLine(85, 110, 290, 30);
  addVLine(85, 350, 530, 30);
  addVLine(1195, 110, 290, 30);
  addVLine(1195, 350, 530, 30);

  // Mid Columns (X = 200 & X = 1080)
  addVLine(200, 155, 485, 30);
  addVLine(1080, 155, 485, 30);

  // Center Flank Columns (X = 490 & X = 790)
  addVLine(490, 230, 485, 30);
  addVLine(790, 230, 485, 30);

  return pellets;
}

export const PELLETS = generatePellets();
