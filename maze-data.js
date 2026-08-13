/**
 * maze-data.js
 * High-precision mathematical grid, walls, ghost house, tunnels, pellets,
 * and navigation network for the GitHub Pac-Man Profile Banner (1280x640).
 * 
 * Grid Architecture:
 * - Canvas: 1280 x 640 (viewBox 0 0 1280 640)
 * - Safe margin: Outer border from x=50..1230, y=50..585
 * 
 * Walkable Corridor Centerlines (Strictly Orthogonal):
 * - Horizontal Corridors:
 *   - H1 (Top Outer): y = 80
 *   - H2 (Top Inner): y = 165
 *   - H3 (Above Nameplate): y = 215
 *   - H4 (Middle / Tunnels): y = 310
 *   - H5 (Below Nameplate / Above Ghost House): y = 365
 *   - H6 (Lower Inner): y = 470
 *   - H7 (Bottom Outer): y = 555
 * 
 * - Vertical Corridors:
 *   - V1 (Left Outer): x = 85
 *   - V2 (Left Mid): x = 200
 *   - V3 (Left Inner): x = 320
 *   - V4 (Ghost House Left): x = 470
 *   - V5 (Ghost House Right): x = 810
 *   - V6 (Right Inner): x = 960
 *   - V7 (Right Mid): x = 1080
 *   - V8 (Right Outer): x = 1195
 */

export const CANVAS = {
  width: 1280,
  height: 640
};

/**
 * Neon Maze Wall Boundaries
 * Every wall block is designed with 48px+ corridor clearances so Pac-Man (r=16)
 * and ghosts (r=16) never touch or overlap any wall stroke.
 */
export const MAZE_WALLS = [
  // 1. Outer Perimeter Border (with Left & Right Tunnel openings at y=285..335)
  // Top-Left Outer Wall
  { type: 'path', d: 'M 50,285 L 50,60 Q 50,50 60,50 L 1220,50 Q 1230,50 1230,60 L 1230,285' },
  // Bottom Outer Wall
  { type: 'path', d: 'M 50,335 L 50,575 Q 50,585 60,585 L 1220,585 Q 1230,585 1230,575 L 1230,335' },
  
  // Left Tunnel Flanges
  { type: 'path', d: 'M 0,285 L 50,285' },
  { type: 'path', d: 'M 0,335 L 50,335' },
  // Right Tunnel Flanges
  { type: 'path', d: 'M 1230,285 L 1280,285' },
  { type: 'path', d: 'M 1230,335 L 1280,335' },

  // Top Center T-Stem Divider
  { type: 'path', d: 'M 625,50 V 120 Q 625,126 631,126 H 649 Q 655,126 655,120 V 50 Z' },

  // Top-Left Quadrant Blocks
  { type: 'rect', x: 120, y: 110, w: 50, h: 25, rx: 6 },
  { type: 'rect', x: 235, y: 110, w: 55, h: 25, rx: 6 },
  { type: 'rect', x: 355, y: 110, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 470, y: 110, w: 115, h: 25, rx: 6 },

  // Top-Right Quadrant Blocks
  { type: 'rect', x: 695, y: 110, w: 115, h: 25, rx: 6 },
  { type: 'rect', x: 850, y: 110, w: 75, h: 25, rx: 6 },
  { type: 'rect', x: 990, y: 110, w: 55, h: 25, rx: 6 },
  { type: 'rect', x: 1110, y: 110, w: 50, h: 25, rx: 6 },

  // Side Wall T-Blocks (Left & Right)
  { type: 'rect', x: 120, y: 165, w: 50, h: 80, rx: 6 },
  { type: 'rect', x: 1110, y: 165, w: 50, h: 80, rx: 6 },

  // Upper Mid Separators (Above Nameplate)
  { type: 'rect', x: 235, y: 165, w: 195, h: 20, rx: 6 },
  { type: 'rect', x: 850, y: 165, w: 195, h: 20, rx: 6 },
  { type: 'rect', x: 500, y: 165, w: 280, h: 20, rx: 6 },

  // =========================================================================
  // GUNESH BARI Centerpiece Architectural Frame
  // Centered at X=640, Y=265. Dimensions: 740 x 70.
  // Corridor around it: Top Y=215, Bottom Y=315, Left X=230, Right X=1050
  // =========================================================================
  { type: 'rect', x: 270, y: 230, w: 740, h: 70, rx: 12 },

  // Ghost House (Central Bunker: X=520..760, Y=395..440)
  // Ghost House Walls
  { type: 'path', d: 'M 520,395 H 585 V 400 H 525 Q 520,400 520,405 V 435 Q 520,440 525,440 H 755 Q 760,440 760,435 V 405 Q 760,400 755,400 H 695 V 395 H 760 Q 765,395 765,400 V 440 Q 765,445 760,445 H 520 Q 515,445 515,440 V 400 Q 515,395 520,395 Z' },
  // Ghost House Door (Pink glowing gate at Y=395, X=585..695)
  { type: 'door', x: 585, y: 395, w: 110, h: 4 },

  // Lower Flanking L-Blocks (Left & Right)
  { type: 'path', d: 'M 120,365 H 170 Q 175,365 175,370 V 430 H 210 Q 215,430 215,435 V 455 Q 215,460 210,460 H 145 Q 140,460 140,455 V 390 H 120 Q 115,390 115,385 V 370 Q 115,365 120,365 Z' },
  { type: 'path', d: 'M 1160,365 H 1110 Q 1105,365 1105,370 V 390 H 1085 Q 1080,390 1080,395 V 455 Q 1080,460 1075,460 H 1010 Q 1005,460 1005,455 V 435 Q 1005,430 1010,430 H 1045 V 370 Q 1045,365 1050,365 H 1160 Z' },

  // Lower Left Mid T-Blocks
  { type: 'rect', x: 245, y: 365, w: 50, h: 70, rx: 6 },
  { type: 'rect', x: 335, y: 365, w: 95, h: 70, rx: 6 },

  // Lower Right Mid T-Blocks
  { type: 'rect', x: 850, y: 365, w: 95, h: 70, rx: 6 },
  { type: 'rect', x: 985, y: 365, w: 50, h: 70, rx: 6 },

  // Bottom Center T-Divider
  { type: 'path', d: 'M 490,470 H 790 Q 795,470 795,475 V 490 Q 795,495 790,495 H 650 V 545 Q 650,550 645,550 H 635 Q 630,550 630,545 V 495 H 490 Q 485,495 485,490 V 475 Q 485,470 490,470 Z' },

  // Bottom Outer Horizontal Blocks (Left & Right)
  { type: 'rect', x: 120, y: 495, w: 175, h: 25, rx: 6 },
  { type: 'rect', x: 335, y: 495, w: 115, h: 25, rx: 6 },
  { type: 'rect', x: 830, y: 495, w: 115, h: 25, rx: 6 },
  { type: 'rect', x: 985, y: 495, w: 175, h: 25, rx: 6 }
];

/**
 * 4 Strategic Power Pellets in the 4 Outer Corners
 */
export const POWER_PELLETS = [
  { id: 'pp-top-left', x: 85, y: 80 },
  { id: 'pp-top-right', x: 1195, y: 80 },
  { id: 'pp-bottom-left', x: 85, y: 555 },
  { id: 'pp-bottom-right', x: 1195, y: 555 }
];

/**
 * Generate standard pellets along all walkable corridor lines.
 */
export function generatePellets() {
  const pellets = [];
  let id = 0;

  function addHLine(y, xStart, xEnd, step = 32) {
    for (let x = xStart; x <= xEnd; x += step) {
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 24);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  function addVLine(x, yStart, yEnd, step = 32) {
    for (let y = yStart; y <= yEnd; y += step) {
      const nearPower = POWER_PELLETS.some(p => Math.hypot(p.x - x, p.y - y) < 24);
      if (!nearPower) {
        pellets.push({ id: `pellet-${id++}`, x: Math.round(x), y: Math.round(y) });
      }
    }
  }

  // Top Outer (Y = 80)
  addHLine(80, 115, 600, 30);
  addHLine(80, 680, 1165, 30);

  // Top Inner (Y = 140)
  addHLine(140, 85, 1195, 30);

  // Nameplate Top Corridor (Y = 205)
  addHLine(205, 200, 1080, 28);

  // Middle Tunnel Hallway (Y = 310)
  addHLine(310, 85, 240, 28);
  addHLine(310, 1040, 1195, 28);

  // Below Nameplate Corridor (Y = 335)
  addHLine(335, 200, 1080, 28);

  // Lower Main Hallway (Y = 465)
  addHLine(465, 85, 460, 30);
  addHLine(465, 820, 1195, 30);

  // Bottom Outer Corridor (Y = 555)
  addHLine(555, 115, 600, 30);
  addHLine(555, 680, 1165, 30);

  // Vertical Outer Connectors
  addVLine(85, 110, 280, 30);
  addVLine(85, 340, 525, 30);
  addVLine(1195, 110, 280, 30);
  addVLine(1195, 340, 525, 30);

  // Mid Vertical Connectors
  addVLine(200, 140, 335, 30);
  addVLine(1080, 140, 335, 30);
  addVLine(320, 335, 465, 30);
  addVLine(960, 335, 465, 30);

  // Center Flank Connectors (Beside Ghost House)
  addVLine(470, 335, 555, 30);
  addVLine(810, 335, 555, 30);

  return pellets;
}

export const PELLETS = generatePellets();
