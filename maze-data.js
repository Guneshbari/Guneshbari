/**
 * maze-data.js
 * Comprehensive arcade layout definition for Pac-Man GitHub Profile Banner.
 * Designed to match the reference retro-arcade visual specification (1280x640).
 */

export const CANVAS = { width: 1280, height: 640 };

// ── 7x9 Pixel Font Definition for "GUNESH BARI" ────────────────
export const PIXEL_FONT = {
  G: [
    '.XXXXX.',
    'XX...XX',
    'XX.....',
    'XX.....',
    'XX..XXX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    '.XXXXX.'
  ],
  U: [
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    '.XXXXX.'
  ],
  N: [
    'XX...XX',
    'XXX..XX',
    'XXX..XX',
    'XXXX.XX',
    'XX.XXXX',
    'XX..XXX',
    'XX..XXX',
    'XX...XX',
    'XX...XX'
  ],
  E: [
    'XXXXXXX',
    'XX.....',
    'XX.....',
    'XX.....',
    'XXXXX..',
    'XX.....',
    'XX.....',
    'XX.....',
    'XXXXXXX'
  ],
  S: [
    '.XXXXX.',
    'XX...XX',
    'XX.....',
    '.XXXX..',
    '...XXX.',
    '.....XX',
    'XX...XX',
    'XX...XX',
    '.XXXXX.'
  ],
  H: [
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XXXXXXX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX'
  ],
  B: [
    'XXXXXX.',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XXXXXX.',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XXXXXX.'
  ],
  A: [
    '..XXX..',
    '.XX.XX.',
    'XX...XX',
    'XX...XX',
    'XXXXXXX',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XX...XX'
  ],
  R: [
    'XXXXXX.',
    'XX...XX',
    'XX...XX',
    'XX...XX',
    'XXXXXX.',
    'XX.XX..',
    'XX..XX.',
    'XX...XX',
    'XX...XX'
  ],
  I: [
    'XXXXXXX',
    '..XXX..',
    '..XXX..',
    '..XXX..',
    '..XXX..',
    '..XXX..',
    '..XXX..',
    '..XXX..',
    'XXXXXXX'
  ]
};

// Text bounding constants
export const TEXT_CONFIG = {
  cellSize: 12,
  cellGap: 1,
  letterGap: 6,
  wordGap: 40,
  textCenterY: 300
};

export function getTextLayout(text = 'GUNESH BARI') {
  const pitch = TEXT_CONFIG.cellSize + TEXT_CONFIG.cellGap;
  let totalWidth = 0;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (ch === ' ') {
      totalWidth += TEXT_CONFIG.wordGap;
    } else if (PIXEL_FONT[ch]) {
      totalWidth += PIXEL_FONT[ch][0].length * pitch - TEXT_CONFIG.cellGap;
      if (i < text.length - 1 && text[i + 1] !== ' ') {
        totalWidth += TEXT_CONFIG.letterGap;
      }
    }
  }

  const startX = Math.round((CANVAS.width - totalWidth) / 2);
  const textHeight = 9 * pitch - TEXT_CONFIG.cellGap;
  const startY = Math.round(TEXT_CONFIG.textCenterY - textHeight / 2);

  return { startX, startY, totalWidth, textHeight, pitch };
}

// ── Maze Walls Geometry (Neon Blue Double-Lines) ───────────────
export const MAZE_WALLS = [
  // 1. Outer Border with Left & Right Teleport Tunnel Insets
  // Top Outer
  { type: 'rect', x: 45, y: 60, w: 1190, h: 6, rx: 3 },
  // Bottom Outer
  { type: 'rect', x: 45, y: 580, w: 1190, h: 6, rx: 3 },
  // Left Upper (60 to 240)
  { type: 'rect', x: 45, y: 60, w: 6, h: 180, rx: 3 },
  // Left Lower (280 to 580)
  { type: 'rect', x: 45, y: 280, w: 6, h: 300, rx: 3 },
  // Right Upper (60 to 240)
  { type: 'rect', x: 1229, y: 60, w: 6, h: 180, rx: 3 },
  // Right Lower (280 to 580)
  { type: 'rect', x: 1229, y: 280, w: 6, h: 300, rx: 3 },

  // 2. Neon Enclosing Chamfered Islands around "GUNESH" and "BARI"
  // Island for GUNESH (x: 132 to 720, y: 226 to 374)
  {
    type: 'path',
    d: 'M 152,226 L 700,226 L 720,246 L 720,354 L 700,374 L 152,374 L 132,354 L 132,246 Z'
  },
  // Island for BARI (x: 750 to 1148, y: 226 to 374)
  {
    type: 'path',
    d: 'M 770,226 L 1128,226 L 1148,246 L 1148,354 L 1128,374 L 770,374 L 750,354 L 750,246 Z'
  },

  // 3. Top Section Maze Walls (between y=85 and y=200)
  // Left Corner Block
  { type: 'rect', x: 105, y: 110, w: 65, h: 60, rx: 6 },
  // Left-Mid T-Block
  { type: 'rect', x: 215, y: 110, w: 135, h: 22, rx: 6 },
  { type: 'rect', x: 270, y: 132, w: 25, h: 42, rx: 5 },
  // Left-Center Block
  { type: 'rect', x: 395, y: 110, w: 145, h: 22, rx: 6 },
  { type: 'rect', x: 455, y: 132, w: 25, h: 42, rx: 5 },

  // Ghost House (Top Center, exactly like Reference Image)
  // House walls: x: 585 to 695, y: 115 to 175
  { type: 'rect', x: 585, y: 115, w: 40, h: 5, rx: 2 },
  { type: 'rect', x: 655, y: 115, w: 40, h: 5, rx: 2 },
  { type: 'door', x: 625, y: 115, w: 30, h: 4 }, // Ghost door
  { type: 'rect', x: 585, y: 115, w: 5, h: 60, rx: 2 },
  { type: 'rect', x: 690, y: 115, w: 5, h: 60, rx: 2 },
  { type: 'rect', x: 585, y: 170, w: 110, h: 5, rx: 2 },

  // Right-Center Block
  { type: 'rect', x: 740, y: 110, w: 145, h: 22, rx: 6 },
  { type: 'rect', x: 800, y: 132, w: 25, h: 42, rx: 5 },
  // Right-Mid T-Block
  { type: 'rect', x: 930, y: 110, w: 135, h: 22, rx: 6 },
  { type: 'rect', x: 985, y: 132, w: 25, h: 42, rx: 5 },
  // Right Corner Block
  { type: 'rect', x: 1110, y: 110, w: 65, h: 60, rx: 6 },

  // 4. Side Corridor Guides in Text Zone (y: 226 to 374)
  { type: 'rect', x: 85, y: 226, w: 20, h: 65, rx: 4 },
  { type: 'rect', x: 85, y: 310, w: 20, h: 64, rx: 4 },
  { type: 'rect', x: 1175, y: 226, w: 20, h: 65, rx: 4 },
  { type: 'rect', x: 1175, y: 310, w: 20, h: 64, rx: 4 },

  // 5. Bottom Section Maze Walls (between y=400 and y=555)
  // Row 1 (y: 425 to 455)
  { type: 'rect', x: 105, y: 425, w: 65, h: 30, rx: 6 },
  { type: 'rect', x: 215, y: 425, w: 135, h: 30, rx: 6 },
  { type: 'rect', x: 395, y: 425, w: 145, h: 30, rx: 6 },
  { type: 'rect', x: 585, y: 425, w: 110, h: 30, rx: 6 }, // Center bottom block
  { type: 'rect', x: 740, y: 425, w: 145, h: 30, rx: 6 },
  { type: 'rect', x: 930, y: 425, w: 135, h: 30, rx: 6 },
  { type: 'rect', x: 1110, y: 425, w: 65, h: 30, rx: 6 },

  // Row 2 & Very Bottom (y: 485 to 545)
  { type: 'rect', x: 105, y: 485, w: 65, h: 60, rx: 6 },
  { type: 'rect', x: 215, y: 485, w: 25, h: 60, rx: 5 },
  { type: 'rect', x: 265, y: 510, w: 180, h: 35, rx: 6 },
  { type: 'rect', x: 485, y: 485, w: 55, h: 60, rx: 6 },

  // Center bottom T-anchor
  { type: 'rect', x: 585, y: 485, w: 110, h: 22, rx: 5 },
  { type: 'rect', x: 628, y: 507, w: 24, h: 38, rx: 5 },

  { type: 'rect', x: 740, y: 485, w: 55, h: 60, rx: 6 },
  { type: 'rect', x: 835, y: 510, w: 180, h: 35, rx: 6 },
  { type: 'rect', x: 1040, y: 485, w: 25, h: 60, rx: 5 },
  { type: 'rect', x: 1110, y: 485, w: 65, h: 60, rx: 6 }
];

// ── Power Pellets (4 Strategic Corners) ─────────────────────────
export const POWER_PELLETS = [
  { x: 75, y: 85 },
  { x: 1205, y: 85 },
  { x: 75, y: 555 },
  { x: 1205, y: 555 }
];

// ── Regular Pellets Generator ──────────────────────────────────
function generatePellets() {
  const pellets = [];
  const spacing = 26;

  // Primary horizontal corridor centerlines
  const hCorridors = [
    { y: 85, xMin: 65, xMax: 1215 },
    { y: 200, xMin: 65, xMax: 1215 },
    { y: 400, xMin: 65, xMax: 1215 },
    { y: 470, xMin: 65, xMax: 1215 },
    { y: 555, xMin: 65, xMax: 1215 }
  ];

  // Primary vertical corridor centerlines
  const vCorridors = [
    { x: 75, yMin: 70, yMax: 565 },
    { x: 190, yMin: 70, yMax: 210 },
    { x: 190, yMin: 390, yMax: 565 },
    { x: 370, yMin: 70, yMax: 210 },
    { x: 370, yMin: 390, yMax: 565 },
    { x: 735, yMin: 70, yMax: 565 }, // Full height vertical through word gap
    { x: 910, yMin: 70, yMax: 210 },
    { x: 910, yMin: 390, yMax: 565 },
    { x: 1090, yMin: 70, yMax: 210 },
    { x: 1090, yMin: 390, yMax: 565 },
    { x: 1205, yMin: 70, yMax: 565 }
  ];

  function isBlocked(px, py) {
    // 1. Power pellets proximity
    for (const pp of POWER_PELLETS) {
      if (Math.abs(px - pp.x) < 22 && Math.abs(py - pp.y) < 22) return true;
    }

    // 2. Ghost house area (x: 580 to 700, y: 110 to 180)
    if (px >= 580 && px <= 700 && py >= 110 && py <= 180) return true;

    // 3. GUNESH island interior (x: 130 to 722, y: 224 to 376)
    if (px >= 130 && px <= 722 && py >= 224 && py <= 376) return true;

    // 4. BARI island interior (x: 748 to 1150, y: 224 to 376)
    if (px >= 748 && px <= 1150 && py >= 224 && py <= 376) return true;

    // 5. Maze wall collisions
    for (const w of MAZE_WALLS) {
      if (w.type === 'rect') {
        const pad = 8;
        if (
          px >= w.x - pad &&
          px <= w.x + w.w + pad &&
          py >= w.y - pad &&
          py <= w.y + w.h + pad
        ) {
          return true;
        }
      }
    }

    return false;
  }

  const placed = new Set();

  function tryPlace(px, py) {
    const rx = Math.round(px);
    const ry = Math.round(py);
    const key = `${rx},${ry}`;
    if (placed.has(key)) return;
    if (isBlocked(rx, ry)) return;
    placed.add(key);
    pellets.push({ x: rx, y: ry });
  }

  // Generate along horizontal corridors
  for (const hc of hCorridors) {
    for (let x = hc.xMin; x <= hc.xMax; x += spacing) {
      tryPlace(x, hc.y);
    }
  }

  // Generate along vertical corridors
  for (const vc of vCorridors) {
    for (let y = vc.yMin; y <= vc.yMax; y += spacing) {
      tryPlace(vc.x, y);
    }
  }

  return pellets;
}

export const PELLETS = generatePellets();
