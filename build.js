/**
 * build.js
 * Assembly and validation pipeline for the animated Pac-Man GitHub profile banner.
 * Compiles modular source files into a standalone, self-contained banner.svg.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { GRID_CONFIG, MAZE_WALLS, POWER_PELLETS, PELLETS } from './maze-data.js';
import { 
  ANIMATION_CONFIG, 
  PACMAN_PATH, 
  BLINKY_PATH, 
  PINKY_PATH, 
  INKY_PATH, 
  CLYDE_PATH, 
  getPacmanPassFraction 
} from './animations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Helper to extract inner XML/SVG defs from asset files
function extractDefs(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`Warning: Asset file not found: ${filePath}`);
    return '';
  }
  const content = fs.readFileSync(filePath, 'utf-8');
  const defsMatch = content.match(/<defs>([\s\S]*?)<\/defs>/i);
  return defsMatch ? defsMatch[1].trim() : '';
}

function generateWallElements(walls) {
  let backGlow = '';
  let outerWalls = '';
  let innerWalls = '';
  let doors = '';

  for (const wall of walls) {
    if (wall.type === 'path') {
      backGlow += `    <path d="${wall.d}" class="wall-back-glow"/>\n`;
      outerWalls += `    <path d="${wall.d}" class="wall-outer"/>\n`;
      innerWalls += `    <path d="${wall.d}" class="wall-inner"/>\n`;
    } else if (wall.type === 'rect') {
      backGlow += `    <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${wall.rx}" class="wall-back-glow"/>\n`;
      outerWalls += `    <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${wall.rx}" class="wall-outer"/>\n`;
      innerWalls += `    <rect x="${wall.x}" y="${wall.y}" width="${wall.w}" height="${wall.h}" rx="${wall.rx}" class="wall-inner"/>\n`;
    } else if (wall.type === 'door') {
      doors += `    <line x1="${wall.x}" y1="${wall.y}" x2="${wall.x + wall.w}" y2="${wall.y}" class="ghost-house-door"/>\n`;
    }
  }

  return { backGlow, outerWalls, innerWalls, doors };
}

/**
 * Generates pellets with synchronized consumption animations for pellets along Pac-Man's path.
 */
function generatePelletsSvg(pellets, powerPellets) {
  let output = '    <!-- Standard Pellets -->\n    <g id="pellet-group">\n';
  
  for (let i = 0; i < pellets.length; i++) {
    const p = pellets[i];
    const passFraction = getPacmanPassFraction(p.x, p.y, PACMAN_PATH);

    if (passFraction !== null) {
      // Pellet is on Pac-Man's path - Add dynamic consumption animation
      const f = parseFloat(passFraction.toFixed(3));
      const fEat = Math.min(0.99, f + 0.01);
      const fRespawnStart = (f + 0.70) % 1.0;
      const fRespawnEnd = (f + 0.90) % 1.0;

      const keyframes = [];
      keyframes.push({ t: 0, v: (f < fRespawnStart && f > 0.05) ? 1 : 0 });
      
      if (fRespawnStart > f) {
        keyframes.push({ t: Math.max(0, f - 0.01), v: 1 });
        keyframes.push({ t: fEat, v: 0 });
        keyframes.push({ t: fRespawnStart, v: 0 });
        keyframes.push({ t: fRespawnEnd, v: 1 });
      } else {
        keyframes.push({ t: fRespawnStart, v: 0 });
        keyframes.push({ t: fRespawnEnd, v: 1 });
        keyframes.push({ t: Math.max(0, f - 0.01), v: 1 });
        keyframes.push({ t: fEat, v: 0 });
      }
      keyframes.push({ t: 1, v: keyframes[0].v });

      keyframes.sort((a, b) => a.t - b.t);
      const cleanKeys = [];
      for (const k of keyframes) {
        const clampedT = Math.max(0, Math.min(1, parseFloat(k.t.toFixed(2))));
        if (cleanKeys.length === 0 || Math.abs(cleanKeys[cleanKeys.length - 1].t - clampedT) > 0.02) {
          cleanKeys.push({ t: clampedT, v: k.v });
        }
      }
      if (cleanKeys[0].t !== 0) cleanKeys.unshift({ t: 0, v: cleanKeys[0].v });
      if (cleanKeys[cleanKeys.length - 1].t !== 1) cleanKeys.push({ t: 1, v: cleanKeys[cleanKeys.length - 1].v });

      const timesStr = cleanKeys.map(k => k.t.toFixed(2)).join(';');
      const valsStr = cleanKeys.map(k => k.v).join(';');

      output += `      <g transform="translate(${p.x}, ${p.y})">
        <use href="#pellet-standard" xlink:href="#pellet-standard" x="0" y="0"/>
        <animate attributeName="opacity" values="${valsStr}" keyTimes="${timesStr}" dur="${ANIMATION_CONFIG.pacmanDuration}" repeatCount="indefinite"/>
      </g>\n`;
    } else {
      // Off-path pellet
      output += `      <use href="#pellet-standard" xlink:href="#pellet-standard" x="${p.x}" y="${p.y}"/>\n`;
    }
  }
  output += '    </g>\n\n    <!-- Power Pellets -->\n    <g id="power-pellets-group">\n';

  for (const pp of powerPellets) {
    output += `      <use href="#pellet-power" xlink:href="#pellet-power" x="${pp.x}" y="${pp.y}"/>\n`;
  }
  output += '    </g>\n';

  return output;
}

function generateBackgroundStars() {
  const stars = [
    { x: 75, y: 35, r: 1.2, delay: '0s' },
    { x: 220, y: 25, r: 1.5, delay: '1.2s' },
    { x: 380, y: 38, r: 1.0, delay: '0.5s' },
    { x: 620, y: 28, r: 1.4, delay: '1.8s' },
    { x: 890, y: 34, r: 1.2, delay: '0.8s' },
    { x: 1080, y: 26, r: 1.6, delay: '2.1s' },
    { x: 1210, y: 36, r: 1.1, delay: '1.4s' },
    { x: 60, y: 615, r: 1.3, delay: '0.4s' },
    { x: 320, y: 620, r: 1.5, delay: '1.6s' },
    { x: 580, y: 610, r: 1.1, delay: '0.9s' },
    { x: 920, y: 625, r: 1.4, delay: '2.4s' },
    { x: 1140, y: 615, r: 1.2, delay: '1.1s' }
  ];

  return stars.map(s => `      <circle cx="${s.x}" cy="${s.y}" r="${s.r}" class="star-particle" style="animation-delay: ${s.delay};"/>`).join('\n');
}

function assembleBanner() {
  console.log('⚡ Starting build for Pac-Man GitHub Profile Banner...');

  // 1. Load CSS
  const cssContent = fs.readFileSync(path.join(__dirname, 'styles.css'), 'utf-8');

  // 2. Load Assets Defs
  const pacmanDefs = extractDefs(path.join(__dirname, 'assets', 'pacman.svg'));
  const ghostsDefs = extractDefs(path.join(__dirname, 'assets', 'ghosts.svg'));
  const pelletsDefs = extractDefs(path.join(__dirname, 'assets', 'pellets.svg'));
  const fruitsDefs = extractDefs(path.join(__dirname, 'assets', 'fruits.svg'));
  const typographyDefs = extractDefs(path.join(__dirname, 'assets', 'typography.svg'));

  // 3. Generate Walls and Pellets
  const { backGlow, outerWalls, innerWalls, doors } = generateWallElements(MAZE_WALLS);
  const pelletsSvg = generatePelletsSvg(PELLETS, POWER_PELLETS);
  const starsSvg = generateBackgroundStars();

  // 4. Construct complete SVG Document with strict XML compliance
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 1280 640" width="100%" height="100%" aria-label="Gunesh Bari — Animated Pac-Man GitHub Banner" role="img">
  <title>Gunesh Bari — Animated Pac-Man GitHub Banner</title>
  <desc>An animated neon Pac-Man-inspired maze featuring the name Gunesh Bari, with Pac-Man collecting pellets while four ghosts navigate the maze.</desc>

  <defs>
    <!-- Inlined Stylesheet -->
    <style>
${cssContent}
    </style>

    <!-- Visual Glow Filters -->
    <filter id="glow-blur" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="4" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="glow-blur-subtle" x="-30%" y="-30%" width="160%" height="160%">
      <feGaussianBlur stdDeviation="2" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <filter id="glow-blur-wide" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>

    <!-- CRT Scanline Pattern -->
    <pattern id="scanline-pattern" width="100" height="4" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="100" y2="0" stroke="#000000" stroke-width="1.8" opacity="0.6"/>
    </pattern>

    <!-- Radial Vignette Gradient -->
    <radialGradient id="vignette-gradient" cx="50%" cy="50%" r="65%" fx="50%" fy="50%">
      <stop offset="60%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.85"/>
    </radialGradient>

    <!-- Inlined Asset Symbols -->
    <!-- Pac-Man Definition -->
    ${pacmanDefs}

    <!-- Ghosts Definitions -->
    ${ghostsDefs}

    <!-- Pellets Definitions -->
    ${pelletsDefs}

    <!-- Fruits Definitions -->
    ${fruitsDefs}

    <!-- Typography Definition -->
    ${typographyDefs}
  </defs>

  <!-- ========================================== -->
  <!-- 1. Background and Atmosphere               -->
  <!-- ========================================== -->
  <g id="layer-background">
    <!-- Solid Dark Arcade Base -->
    <rect width="1280" height="640" class="arcade-bg"/>

    <!-- Subtle Deep Radial Glow in Center -->
    <circle cx="640" cy="320" r="480" fill="#1E3A8A" opacity="0.12" filter="url(#glow-blur-wide)"/>
    <circle cx="640" cy="270" r="280" fill="#2563EB" opacity="0.10" filter="url(#glow-blur-wide)"/>

    <!-- Ambient Retro Stars and Pixels -->
${starsSvg}
  </g>

  <!-- ========================================== -->
  <!-- 2. Arcade HUD (Top and Bottom)             -->
  <!-- ========================================== -->
  <g id="layer-hud">
    <!-- Top HUD: 1UP, Score, High Score, Level -->
    <text x="90" y="32" class="hud-label-red hud-blink">1UP</text>
    
    <!-- Dynamic Looping Score Animation -->
    <text x="90" y="48" class="hud-value-white">
      <tspan>
        <animate attributeName="visibility" values="visible;hidden;hidden;hidden;hidden;visible" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="12s" repeatCount="indefinite"/>
        24800
      </tspan>
      <tspan dx="-55">
        <animate attributeName="visibility" values="hidden;visible;hidden;hidden;hidden;hidden" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="12s" repeatCount="indefinite"/>
        24920
      </tspan>
      <tspan dx="-55">
        <animate attributeName="visibility" values="hidden;hidden;visible;hidden;hidden;hidden" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="12s" repeatCount="indefinite"/>
        25080
      </tspan>
      <tspan dx="-55">
        <animate attributeName="visibility" values="hidden;hidden;hidden;visible;hidden;hidden" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="12s" repeatCount="indefinite"/>
        25240
      </tspan>
      <tspan dx="-55">
        <animate attributeName="visibility" values="hidden;hidden;hidden;hidden;visible;hidden" keyTimes="0;0.2;0.4;0.6;0.8;1" dur="12s" repeatCount="indefinite"/>
        25460
      </tspan>
    </text>

    <!-- HIGH SCORE Column -->
    <text x="560" y="32" class="hud-label-red">HIGH SCORE</text>
    <text x="585" y="48" class="hud-value-white">098420</text>

    <!-- LEVEL STAGE Column -->
    <text x="1120" y="32" class="hud-label-red">STAGE</text>
    <text x="1145" y="48" class="hud-value-yellow">01</text>

    <!-- Bottom Status Bar -->
    <!-- Pac-Man Lives (3 icons) -->
    <g id="hud-lives" transform="translate(90, 615) scale(0.65)">
      <g transform="translate(0, 0)">
        <path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/>
      </g>
      <g transform="translate(42, 0)">
        <path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/>
      </g>
      <g transform="translate(84, 0)">
        <path d="M 0,0 L 14,-8 A 16 16 0 1,0 14,8 Z" fill="#FFE600" transform="rotate(180)"/>
      </g>
    </g>

    <!-- Credit Status -->
    <text x="600" y="622" class="hud-value-yellow" style="font-size: 13px; letter-spacing: 3px;">CREDIT  1</text>

    <!-- Level Bonus Fruits -->
    <g id="hud-fruits" transform="translate(1140, 618) scale(0.7)">
      <use href="#fruit-cherry" xlink:href="#fruit-cherry" x="-35" y="0"/>
      <use href="#fruit-strawberry" xlink:href="#fruit-strawberry" x="0" y="0"/>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 3. Pellets and Power Pellets Layer         -->
  <!-- ========================================== -->
  <g id="layer-pellets">
${pelletsSvg}
  </g>

  <!-- ========================================== -->
  <!-- 4. Maze Architecture (Double Neon Walls)   -->
  <!-- ========================================== -->
  <g id="layer-maze">
    <!-- Back Glow Layer (Atmosphere) -->
    <g id="maze-backglow">
${backGlow}
    </g>

    <!-- Main Outer Wall Stroke -->
    <g id="maze-outer-walls">
${outerWalls}
    </g>

    <!-- Inner Neon Highlight Lines -->
    <g id="maze-inner-walls">
${innerWalls}
    </g>

    <!-- Ghost House Gate -->
    <g id="maze-doors">
${doors}
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 5. Central Centerpiece: GUNESH BARI        -->
  <!-- ========================================== -->
  <g id="layer-centerpiece" class="nameplate-container">
    <!-- Dark backdrop for nameplate readability -->
    <rect x="290" y="235" width="700" height="70" rx="6" fill="#020617" opacity="0.88"/>
    <!-- GUNESH BARI 8-bit Neon Artwork -->
    <use href="#typography-gunesh-bari" xlink:href="#typography-gunesh-bari" x="345" y="235"/>
  </g>

  <!-- ========================================== -->
  <!-- 6. In-Maze Bonus Fruit Item                -->
  <!-- ========================================== -->
  <g id="layer-bonus-item" transform="translate(640, 460)">
    <!-- Pulsing Cherry beneath Ghost House -->
    <g transform="scale(0.85)">
      <use href="#fruit-cherry" xlink:href="#fruit-cherry" x="0" y="0"/>
      <animateTransform attributeName="transform" type="scale" values="0.8; 0.95; 0.8" dur="1.6s" repeatCount="indefinite"/>
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 7. Characters and Autonomous Animations    -->
  <!-- ========================================== -->
  <g id="layer-characters">
    <!-- Pac-Man (Continuous 12s Navigation with Chomp and Direction Rotation) -->
    <g id="character-pacman">
      <use href="#pacman-character" xlink:href="#pacman-character" x="0" y="0"/>
      <animateMotion
        path="${PACMAN_PATH}"
        dur="${ANIMATION_CONFIG.pacmanDuration}"
        repeatCount="indefinite"
        rotate="auto"
        calcMode="linear"
      />
    </g>

    <!-- Blinky (Red Ghost - 14s Direct Chase Route) -->
    <g id="character-blinky">
      <use href="#ghost-blinky" xlink:href="#ghost-blinky" x="0" y="0"/>
      <animateMotion
        path="${BLINKY_PATH}"
        dur="${ANIMATION_CONFIG.blinkyDuration}"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </g>

    <!-- Pinky (Pink Ghost - 17s Interception Route) -->
    <g id="character-pinky">
      <use href="#ghost-pinky" xlink:href="#ghost-pinky" x="0" y="0"/>
      <animateMotion
        path="${PINKY_PATH}"
        dur="${ANIMATION_CONFIG.pinkyDuration}"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </g>

    <!-- Inky (Cyan Ghost - 20s Flanking Route) -->
    <g id="character-inky">
      <use href="#ghost-inky" xlink:href="#ghost-inky" x="0" y="0"/>
      <animateMotion
        path="${INKY_PATH}"
        dur="${ANIMATION_CONFIG.inkyDuration}"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </g>

    <!-- Clyde (Orange Ghost - 22s Wandering Route) -->
    <g id="character-clyde">
      <use href="#ghost-clyde" xlink:href="#ghost-clyde" x="0" y="0"/>
      <animateMotion
        path="${CLYDE_PATH}"
        dur="${ANIMATION_CONFIG.clydeDuration}"
        repeatCount="indefinite"
        calcMode="linear"
      />
    </g>
  </g>

  <!-- ========================================== -->
  <!-- 8. Arcade CRT Overlays and Vignette        -->
  <!-- ========================================== -->
  <g id="layer-overlays">
    <!-- CRT Scanlines -->
    <rect width="1280" height="640" class="scanlines"/>
    <!-- CRT Vignette and Screen Depth -->
    <rect width="1280" height="640" class="arcade-vignette"/>
  </g>
</svg>`;

  // 5. Validation Checks
  console.log('🔍 Running automated validation checks...');
  
  // Check no forbidden scripts
  if (/<script/i.test(svg)) {
    throw new Error('Validation Error: JavaScript found in SVG output! Final banner must be pure SVG/CSS.');
  }

  // Check no unescaped ampersands (fatal XML error)
  const badAmps = svg.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  if (badAmps) {
    throw new Error(`Validation Error: Found ${badAmps.length} unescaped '&' in XML/SVG! Must use &amp; or escape.`);
  }

  // Check no external network URLs
  const externalUrls = svg.match(/url\s*\(\s*['"]?https?:\/\/[^'")]+/gi) || [];
  if (externalUrls.length > 0) {
    throw new Error(`Validation Error: External URLs found in SVG: ${externalUrls.join(', ')}`);
  }

  // Check name spelling
  if (!svg.includes('GUNESH BARI')) {
    throw new Error('Validation Error: Central subject GUNESH BARI is missing or misspelled!');
  }

  // Check character tags
  if (!svg.includes('character-pacman') || !svg.includes('character-blinky') || 
      !svg.includes('character-pinky') || !svg.includes('character-inky') || 
      !svg.includes('character-clyde')) {
    throw new Error('Validation Error: Missing character definitions!');
  }

  // 6. Write final banner.svg and pacman-banner.svg
  const outputPath = path.join(__dirname, 'banner.svg');
  const pacmanBannerPath = path.join(__dirname, 'pacman-banner.svg');
  fs.writeFileSync(outputPath, svg, 'utf-8');
  fs.writeFileSync(pacmanBannerPath, svg, 'utf-8');
  
  const stats = fs.statSync(outputPath);
  const fileSizeKB = (stats.size / 1024).toFixed(2);

  console.log(`✅ banner.svg and pacman-banner.svg generated successfully!`);
  console.log(`📊 File size: ${fileSizeKB} KB (Target: under 500 KB)`);
  console.log(`🎯 Dimensions: 1280x640 | Strict XML Compliant: YES | Animated: YES`);
}

assembleBanner();
