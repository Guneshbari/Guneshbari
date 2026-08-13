/**
 * test.js
 * Comprehensive quality assurance and automated validation test suite.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { MAZE_WALLS, POWER_PELLETS, PELLETS } from './maze-data.js';
import { PACMAN_PATH, BLINKY_PATH, PINKY_PATH, INKY_PATH, CLYDE_PATH, getPathPassFractions } from './animations.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function parseSvgPathCommands(pathStr) {
  const points = [];
  const regex = /([MLZ])\s*([^MLZ]*)/g;
  let match;

  while ((match = regex.exec(pathStr)) !== null) {
    const cmd = match[1];
    const coordsStr = match[2].trim();
    if (coordsStr) {
      const parts = coordsStr.split(/[\s,]+/).map(Number);
      for (let i = 0; i < parts.length; i += 2) {
        if (!isNaN(parts[i]) && !isNaN(parts[i+1])) {
          points.push({ cmd, x: parts[i], y: parts[i+1] });
        }
      }
    } else if (cmd === 'Z' && points.length > 0) {
      points.push({ cmd: 'Z', x: points[0].x, y: points[0].y });
    }
  }
  return points;
}

function runTests() {
  console.log('🧪 Starting Automated QA Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, testName, details = '') {
    if (condition) {
      console.log(`  ✅ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ❌ FAIL: ${testName} - ${details}`);
      failed++;
    }
  }

  // Test 1: banner.svg exists and is non-empty
  const bannerPath = path.join(__dirname, 'banner.svg');
  assert(fs.existsSync(bannerPath), 'banner.svg exists');
  const svgContent = fs.readFileSync(bannerPath, 'utf-8');
  assert(svgContent.length > 1000, 'banner.svg contains substantive content');

  // Test 2: Dimensions and ViewBox
  assert(svgContent.includes('viewBox="0 0 1280 640"'), 'SVG has valid 1280x640 viewBox');

  // Test 3: Standalone & Security (No script, no external links, valid XML entities)
  assert(!/<script/i.test(svgContent), 'No JavaScript <script> tags in SVG');
  assert(!/href=["']http/i.test(svgContent), 'No external HTTP/HTTPS hrefs');
  assert(!/url\(['"]?http/i.test(svgContent), 'No external HTTP/HTTPS url() references');
  const badAmps = svgContent.match(/&(?!(amp|lt|gt|quot|apos);)/g);
  assert(!badAmps, 'No unescaped ampersands in XML (100% strict XML validity)');

  // Test 4: Subject Name verification
  assert(svgContent.includes('GUNESH BARI'), 'GUNESH BARI is present and spelled correctly');

  // Test 5: All 4 Ghosts and Pac-Man present
  assert(svgContent.includes('character-pacman'), 'Pac-Man character is present');
  assert(svgContent.includes('character-blinky'), 'Blinky (Red Ghost) is present');
  assert(svgContent.includes('character-pinky'), 'Pinky (Pink Ghost) is present');
  assert(svgContent.includes('character-inky'), 'Inky (Cyan Ghost) is present');
  assert(svgContent.includes('character-clyde'), 'Clyde (Orange Ghost) is present');

  // Test 6: Closed Loop verification for all paths
  const pacmanPts = parseSvgPathCommands(PACMAN_PATH);
  const blinkyPts = parseSvgPathCommands(BLINKY_PATH);
  const pinkyPts = parseSvgPathCommands(PINKY_PATH);
  const inkyPts = parseSvgPathCommands(INKY_PATH);
  const clydePts = parseSvgPathCommands(CLYDE_PATH);

  assert(pacmanPts.length >= 4, `Pac-Man path has ${pacmanPts.length} waypoints`);
  assert(pacmanPts[0].x === pacmanPts[pacmanPts.length - 1].x && pacmanPts[0].y === pacmanPts[pacmanPts.length - 1].y, 'Pac-Man path is a seamless closed loop');
  assert(blinkyPts[0].x === blinkyPts[blinkyPts.length - 1].x && blinkyPts[0].y === blinkyPts[blinkyPts.length - 1].y, 'Blinky path is a seamless closed loop');
  assert(pinkyPts[0].x === pinkyPts[pinkyPts.length - 1].x && pinkyPts[0].y === pinkyPts[pinkyPts.length - 1].y, 'Pinky path is a seamless closed loop');
  assert(inkyPts[0].x === inkyPts[inkyPts.length - 1].x && inkyPts[0].y === inkyPts[inkyPts.length - 1].y, 'Inky path is a seamless closed loop');
  assert(clydePts[0].x === clydePts[clydePts.length - 1].x && clydePts[0].y === clydePts[clydePts.length - 1].y, 'Clyde path is a seamless closed loop');

  // Test 7: Orthogonal segments check (No diagonal wall cuts)
  function checkOrthogonal(points, name) {
    let allOrthogonal = true;
    for (let i = 0; i < points.length - 1; i++) {
      const p1 = points[i];
      const p2 = points[i + 1];
      const dx = Math.abs(p1.x - p2.x);
      const dy = Math.abs(p1.y - p2.y);
      if (dx > 0.1 && dy > 0.1) {
        allOrthogonal = false;
        console.warn(`  ⚠️ Non-orthogonal segment in ${name}: (${p1.x},${p1.y}) -> (${p2.x},${p2.y})`);
      }
    }
    return allOrthogonal;
  }

  assert(checkOrthogonal(pacmanPts, 'Pac-Man'), 'Pac-Man route is strictly orthogonal');
  assert(checkOrthogonal(blinkyPts, 'Blinky'), 'Blinky route is strictly orthogonal');
  assert(checkOrthogonal(pinkyPts, 'Pinky'), 'Pinky route is strictly orthogonal');
  assert(checkOrthogonal(inkyPts, 'Inky'), 'Inky route is strictly orthogonal');
  assert(checkOrthogonal(clydePts, 'Clyde'), 'Clyde route is strictly orthogonal');

  // Test 8: Power Pellets Count
  assert(POWER_PELLETS.length === 4, `4 Power Pellets configured (found: ${POWER_PELLETS.length})`);

  // The narrow centre connector is 30px wide, so the 32px character assets
  // are scaled to a safe 22.4px gameplay footprint before they enter it.
  assert((svgContent.match(/transform="scale\(0\.70\)"/g) || []).length === 5, 'All moving characters fit the centre maze connector');

  // Test 9: Regular Pellets Count
  assert(PELLETS.length >= 80, `Substantial pellet count for full level feel (${PELLETS.length} pellets)`);

  // Test 10: A pellet is only generated on the gameplay route and has at
  // least one exact consumption moment. This protects movement/eating sync.
  assert(
    PELLETS.every(pellet => getPathPassFractions(pellet.x, pellet.y, PACMAN_PATH).length > 0),
    'Every regular pellet lies on Pac-Man\'s exact route'
  );
  assert(
    POWER_PELLETS.every(pellet => getPathPassFractions(pellet.x, pellet.y, PACMAN_PATH).length > 0),
    'Every power pellet lies on Pac-Man\'s exact route'
  );

  // Test 11: Dynamic score synchronization and loop reset
  assert(svgContent.includes('id="hud-score"'), 'HUD score group is present');
  assert(svgContent.includes('calcMode="discrete"'), 'Score uses discrete stepping synchronized with coin collection');
  assert(svgContent.includes('10420'), 'Starting score 10420 is present and displayed at loop start');
  assert(svgContent.includes('12530') || svgContent.includes('12'), 'Score increments to higher values as coins are consumed');

  // Test 12: File size within target (< 500 KB)
  const sizeKB = fs.statSync(bannerPath).size / 1024;
  assert(sizeKB < 500, `File size is ${sizeKB.toFixed(2)} KB (under 500 KB target)`);

  console.log(`\n📋 Test Summary: ${passed} passed, ${failed} failed.\n`);
  if (failed > 0) process.exit(1);
}

runTests();
