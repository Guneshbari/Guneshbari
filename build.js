/**
 * build.js
 * Assembly pipeline for the animated Pac-Man GitHub profile banner.
 * Generates standalone, pure SVG adhering to the reference retro arcade design.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  CANVAS,
  MAZE_WALLS,
  POWER_PELLETS,
  PELLETS,
  PIXEL_FONT,
  getTextLayout
} from './maze-data.js';
import {
  ANIMATION_CONFIG,
  PACMAN_PATH,
  BLINKY_PATH,
  PINKY_PATH,
  INKY_PATH,
  CLYDE_PATH,
  getPathPassFractions
} from './animations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================
// 1. Asset Loader
// ============================================================
function extractDefs(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Asset file not found: ${filePath}`);
    return '';
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const defsMatch = content.match(/<defs>([\s\S]*?)<\/defs>/i);
  return defsMatch ? defsMatch[1].trim() : '';
}

// ============================================================
// 2. Pixel Text Renderer — Giant Arcade Matrix "GUNESH BARI"
// ============================================================
function renderPixelText(text) {
  const { startX, startY, pitch } = getTextLayout(text);
  const cellSize = 12;
  const letterGap = 6;
  const wordGap = 40;

  let svgCells = '';
  let cursorX = startX;

  for (let ci = 0; ci < text.length; ci++) {
    const ch = text[ci];
    if (ch === ' ') {
      cursorX += wordGap;
      continue;
    }
    const glyph = PIXEL_FONT[ch];
    if (!glyph) continue;

    for (let row = 0; row < glyph.length; row++) {
      for (let col = 0; col < glyph[row].length; col++) {
        if (glyph[row][col] === 'X') {
          const x = cursorX + col * pitch;
          const y = startY + row * pitch;
          svgCells += `        <rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="1.5" class="pixel-text-cell"/>\n`;
        }
      }
    }

    cursorX += glyph[0].length * pitch - 1 + letterGap;
  }

  return { svgCells, startX, startY };
}

// ============================================================
// 3. Wall Renderer
// ============================================================
function generateWallElements(walls) {
  let backGlow = '';
  let outerWalls = '';
  let innerWalls = '';
  let doors = '';

  for (const wall of walls) {
    if (wall.type === 'path' || wall.d) {
      const d = wall.d;
      backGlow += `      <path d="${d}" class="wall-back-glow"/>\n`;
      outerWalls += `      <path d="${d}" class="wall-outer"/>\n`;
      innerWalls += `      <path d="${d}" class="wall-inner"/>\n`;
    } else if (wall.type === 'door') {
      doors += `      <line x1="${wall.x}" y1="${wall.y}" x2="${wall.x + wall.w}" y2="${wall.y}" class="ghost-house-door"/>\n`;
    } else if (wall.x !== undefined && wall.y !== undefined) {
      const rx = wall.rx !== undefined ? wall.rx : 4;
      backGlow += `      <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${rx}" class="wall-back-glow"/>\n`;
      outerWalls += `      <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${rx}" class="wall-outer"/>\n`;
      innerWalls += `      <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${rx}" class="wall-inner"/>\n`;
    }
  }

  return { backGlow, outerWalls, innerWalls, doors };
}

// ============================================================
// 4. Pellet Renderer with Synchronized Eating
// ============================================================
function getConsumptionAnimation(passFractions) {
  if (!passFractions || !passFractions.length) return null;

  // Pac-Man eats the pellet on the first pass
  const firstPass = Math.min(...passFractions);
  const pass = Math.max(0.001, Math.min(0.995, firstPass));
  const transition = 0.002;

  // All coins are already deployed and visible at t=0 (level start).
  // Once eaten at t=pass, the coin disappears and stays gone for the
  // remainder of the board until the whole level loop finishes (t=1).
  const events = [
    { t: 0, value: 1 },
    { t: pass, value: 1 },
    { t: Math.min(0.998, pass + transition), value: 0 },
    { t: 0.999, value: 0 },
    { t: 1.0, value: 1 }
  ];

  events.sort((a, b) => a.t - b.t);

  const merged = [];
  for (const event of events) {
    if (merged.length && Math.abs(merged[merged.length - 1].t - event.t) < 0.0005) {
      merged[merged.length - 1] = event;
    } else {
      merged.push(event);
    }
  }

  merged[0].t = 0;
  merged[merged.length - 1].t = 1;

  const times = merged.map(event => event.t.toFixed(4)).join(';');
  const opacity = merged.map(event => event.value.toFixed(2)).join(';');
  const radius = merged.map(event => (event.value * 3.5).toFixed(2)).join(';');
  return { times, opacity, radius };
}

function generatePelletsSvg(pellets, powerPellets) {
  let output = '    <g id="pellet-group">\n';

  for (const p of pellets) {
    const passes = getPathPassFractions(p.x, p.y, PACMAN_PATH);

    if (passes.length) {
      const { times, opacity, radius } = getConsumptionAnimation(passes);

      output += `      <circle cx="${p.x}" cy="${p.y}" r="3.5" class="pellet-dot">\n`;
      output += `        <animate attributeName="opacity" values="${opacity}" keyTimes="${times}" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>\n`;
      output += `        <animate attributeName="r" values="${radius}" keyTimes="${times}" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>\n`;
      output += `      </circle>\n`;
    } else {
      output += `      <circle cx="${p.x}" cy="${p.y}" r="3.5" class="pellet-dot"/>\n`;
    }
  }
  output += '    </g>\n    <g id="power-pellets-group">\n';

  for (const pp of powerPellets) {
    const { times, opacity } = getConsumptionAnimation(getPathPassFractions(pp.x, pp.y, PACMAN_PATH));
    output += `      <g class="power-pellet" transform="translate(${pp.x} ${pp.y})">\n`;
    output += `        <use href="#pellet-power" xlink:href="#pellet-power" x="0" y="0"/>\n`;
    output += `        <animate attributeName="opacity" values="${opacity}" keyTimes="${times}" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>\n`;
    output += `      </g>\n`;
  }
  output += '    </g>';

  return output;
}

// ============================================================
// 5. Star Particles
// ============================================================
function generateStars() {
  const stars = [
    { x: 75, y: 35, r: 1.2, d: '0s' }, { x: 220, y: 25, r: 1.5, d: '1.2s' },
    { x: 380, y: 38, r: 1.0, d: '0.5s' }, { x: 620, y: 28, r: 1.4, d: '1.8s' },
    { x: 890, y: 34, r: 1.2, d: '0.8s' }, { x: 1080, y: 26, r: 1.6, d: '2.1s' },
    { x: 1210, y: 36, r: 1.1, d: '1.4s' }, { x: 60, y: 615, r: 1.3, d: '0.4s' },
    { x: 320, y: 620, r: 1.5, d: '1.6s' }, { x: 580, y: 610, r: 1.1, d: '0.9s' },
    { x: 920, y: 625, r: 1.4, d: '2.4s' }, { x: 1140, y: 615, r: 1.2, d: '1.1s' }
  ];
  return stars.map(s =>
    `      <circle cx="${s.x}" cy="${s.y}" r="${s.r}" class="star-particle" style="animation-delay: ${s.d};"/>`
  ).join('\n');
}

// ============================================================
// 6. Main Assembly
// ============================================================
function assembleBanner() {
  console.log('⚡ Building Retro Pac-Man GitHub Banner...');

  const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf-8');
  const pacmanDefs = extractDefs(path.join(__dirname, 'assets', 'pacman.svg'));
  const ghostsDefs = extractDefs(path.join(__dirname, 'assets', 'ghosts.svg'));
  const pelletsDefs = extractDefs(path.join(__dirname, 'assets', 'pellets.svg'));
  const fruitsDefs = extractDefs(path.join(__dirname, 'assets', 'fruits.svg'));

  const { backGlow, outerWalls, innerWalls, doors } = generateWallElements(MAZE_WALLS);
  const pelletsSvg = generatePelletsSvg(PELLETS, POWER_PELLETS);
  const starsSvg = generateStars();
  const { svgCells } = renderPixelText('GUNESH BARI');

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1280 640" width="100%" height="100%" aria-label="Gunesh Bari - Animated Pac-Man GitHub Banner" role="img">
  <title>Gunesh Bari - Animated Pac-Man GitHub Banner</title>
  <desc>An authentic retro neon Pac-Man arcade maze with giant pixel-art GUNESH BARI typography. Pac-Man collects pellets while four ghosts patrol the corridors.</desc>

  <defs>
    <style>
${cssContent}
    </style>

    <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-blur-subtle" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="glow-blur-wide" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="golden-glow" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="3" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>

    <pattern id="scanline-pattern" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#000000" stroke-width="1.8" opacity="0.6"/>
    </pattern>
    <radialGradient id="vignette-gradient" cx="50%" cy="50%" r="65%" fx="50%" fy="50%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>

    ${pacmanDefs}
    ${ghostsDefs}
    ${pelletsDefs}
    ${fruitsDefs}
  </defs>

  <!-- 1. Background -->
  <g id="layer-background">
    <rect width="1280" height="640" class="arcade-bg"/>
    <circle cx="640" cy="300" r="500" fill="#1E3A8A" opacity="0.10" filter="url(#glow-blur-wide)"/>
    <circle cx="640" cy="250" r="280" fill="#2563EB" opacity="0.08" filter="url(#glow-blur-wide)"/>
${starsSvg}
  </g>

  <!-- 2. HUD -->
  <g id="layer-hud">
    <!-- 1UP and Score -->
    <text x="75" y="32" class="hud-label-red hud-blink">1UP</text>
    <g id="hud-score">
      <text x="75" y="48" class="hud-value-white" opacity="1">
        <animate attributeName="opacity" values="1;1;0;0;0;0;0;0;0;1" keyTimes="0;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;1" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
        10420
      </text>
      <text x="75" y="48" class="hud-value-white" opacity="0">
        <animate attributeName="opacity" values="0;0;1;1;0;0;0;0;0;0" keyTimes="0;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;1" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
        10580
      </text>
      <text x="75" y="48" class="hud-value-white" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;1;1;0;0;0;0" keyTimes="0;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;1" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
        10760
      </text>
      <text x="75" y="48" class="hud-value-white" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;1;1;0;0" keyTimes="0;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;1" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
        10940
      </text>
      <text x="75" y="48" class="hud-value-white" opacity="0">
        <animate attributeName="opacity" values="0;0;0;0;0;0;0;0;1;1" keyTimes="0;0.18;0.20;0.38;0.40;0.58;0.60;0.78;0.80;1" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
        11120
      </text>
    </g>

    <!-- HIGH SCORE -->
    <text x="560" y="32" class="hud-label-red">HIGH SCORE</text>
    <text x="595" y="48" class="hud-value-white">016440</text>

    <!-- LEVEL and Lives -->
    <text x="1150" y="32" class="hud-label-cyan">LEVEL</text>
    <text x="1205" y="32" class="hud-value-yellow">1</text>
    <g id="hud-top-lives" transform="translate(1150, 48) scale(0.6)">
      <g><path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/></g>
      <g transform="translate(36,0)"><path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/></g>
      <g transform="translate(72,0)"><path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/></g>
    </g>

    <!-- Bottom HUD -->
    <text x="590" y="618" class="hud-value-yellow" style="font-size: 13px; letter-spacing: 3px;">CREDIT  1</text>
    <g id="hud-fruits" transform="translate(1160, 614) scale(0.7)">
      <use href="#fruit-cherry" xlink:href="#fruit-cherry" x="-35" y="0"/>
      <use href="#fruit-strawberry" xlink:href="#fruit-strawberry" x="0" y="0"/>
    </g>
  </g>

  <!-- 3. Pellets -->
  <g id="layer-pellets">
${pelletsSvg}
  </g>

  <!-- 4. Maze Walls -->
  <g id="layer-maze">
    <g id="maze-backglow">
${backGlow}
    </g>
    <g id="maze-outer-walls">
${outerWalls}
    </g>
    <g id="maze-inner-walls">
${innerWalls}
    </g>
    <g id="maze-doors">
${doors}
    </g>
  </g>

  <!-- 5. Teleport Tunnels (Neon Magenta Bars) -->
  <g id="layer-tunnels">
    <line x1="0" y1="244" x2="48" y2="244" class="teleport-tunnel"/>
    <line x1="0" y1="276" x2="48" y2="276" class="teleport-tunnel"/>
    <line x1="1232" y1="244" x2="1280" y2="244" class="teleport-tunnel"/>
    <line x1="1232" y1="276" x2="1280" y2="276" class="teleport-tunnel"/>
  </g>

  <!-- 6. GUNESH BARI Giant Pixel Text -->
  <g id="layer-pixel-text" filter="url(#golden-glow)">
${svgCells}
  </g>

  <!-- 7. In-Maze Fruits -->
  <g id="layer-fruits">
    <g transform="translate(500, 385) scale(0.85)">
      <use href="#fruit-cherry" xlink:href="#fruit-cherry" x="0" y="0"/>
    </g>
    <g transform="translate(640, 200) scale(0.9)">
      <use href="#fruit-strawberry" xlink:href="#fruit-strawberry" x="0" y="0"/>
      <animateTransform attributeName="transform" type="scale" values="0.85;1.0;0.85" dur="1.8s" repeatCount="indefinite"/>
    </g>
    <g transform="translate(970, 385) scale(0.85)">
      <use href="#fruit-cherry" xlink:href="#fruit-cherry" x="0" y="0"/>
    </g>
  </g>

  <!-- 8. Characters -->
  <g id="layer-characters">
    <g id="character-pacman">
      <!-- The centre lane between the two name islands is 32px wide. -->
      <use href="#pacman-character" xlink:href="#pacman-character" x="0" y="0" transform="scale(0.70)"/>
      <animateMotion path="${PACMAN_PATH}" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite" rotate="auto" calcMode="paced"/>
    </g>
    <g id="character-blinky">
      <use href="#ghost-blinky" xlink:href="#ghost-blinky" x="0" y="0" transform="scale(0.70)"/>
      <animateMotion path="${BLINKY_PATH}" dur="${ANIMATION_CONFIG.blinkyDuration}" repeatCount="indefinite" calcMode="linear"/>
    </g>
    <g id="character-pinky">
      <use href="#ghost-pinky" xlink:href="#ghost-pinky" x="0" y="0" transform="scale(0.70)"/>
      <animateMotion path="${PINKY_PATH}" dur="${ANIMATION_CONFIG.pinkyDuration}" repeatCount="indefinite" calcMode="linear"/>
    </g>
    <g id="character-inky">
      <use href="#ghost-inky" xlink:href="#ghost-inky" x="0" y="0" transform="scale(0.70)"/>
      <animateMotion path="${INKY_PATH}" dur="${ANIMATION_CONFIG.inkyDuration}" repeatCount="indefinite" calcMode="linear"/>
    </g>
    <g id="character-clyde">
      <use href="#ghost-clyde" xlink:href="#ghost-clyde" x="0" y="0" transform="scale(0.70)"/>
      <animateMotion path="${CLYDE_PATH}" dur="${ANIMATION_CONFIG.clydeDuration}" repeatCount="indefinite" calcMode="linear"/>
    </g>
  </g>

  <!-- 9. CRT Overlays -->
  <g id="layer-overlays">
    <rect width="1280" height="640" class="scanlines"/>
    <rect width="1280" height="640" class="arcade-vignette"/>
  </g>
</svg>`;

  // 10. Strict Validation
  console.log('🔍 Validating banner output...');
  if (/<script/i.test(svg)) throw new Error('Security violation: JavaScript script tags detected!');
  const badAmps = svg.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  if (badAmps) throw new Error(`XML violation: ${badAmps.length} unescaped ampersands found!`);
  if (!svg.includes('GUNESH BARI')) throw new Error('Integrity violation: Subject GUNESH BARI missing!');
  ['pacman', 'blinky', 'pinky', 'inky', 'clyde'].forEach(c => {
    if (!svg.includes(`character-${c}`)) throw new Error(`Missing character: ${c}`);
  });

  // Write outputs
  const outputPath = path.join(__dirname, 'banner.svg');
  const pacmanBannerPath = path.join(__dirname, 'pacman-banner.svg');
  fs.writeFileSync(outputPath, svg, 'utf-8');
  fs.writeFileSync(pacmanBannerPath, svg, 'utf-8');

  const sizeKB = (fs.statSync(outputPath).size / 1024).toFixed(2);
  console.log(`✅ banner.svg and pacman-banner.svg generated successfully!`);
  console.log(`📊 Size: ${sizeKB} KB | ViewBox: 1280x640 | XML 100% Strict | Standalone`);
}

assembleBanner();
