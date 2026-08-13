/**
 * animations.js
 * Timing configurations, character motion paths, and pellet consumption synchronization.
 */

export const ANIMATION_CONFIG = {
  pacmanDuration: '26s',
  blinkyDuration: '20s',
  pinkyDuration: '22s',
  inkyDuration: '24s',
  clydeDuration: '26s',
  powerPelletPulse: '0.8s',
  pelletPulse: '1.4s',
  mazeGlowPulse: '3.5s',
  crtScanlineSpeed: '8s',
  scoreTickSpeed: '1.5s'
};

// ── 1. Character Motion Paths ──────────────────────────────────
// Pac-Man: Main level circuit sweeping all dots and fruits
export const PACMAN_PATH = `
  M 735,85
  L 75,85
  L 75,200
  L 735,200
  L 735,400
  L 75,400
  L 75,555
  L 1205,555
  L 1205,400
  L 735,400
  L 735,200
  L 1205,200
  L 1205,85
  L 735,85
  Z
`.replace(/\s+/g, ' ').trim();

// Blinky (Red Ghost): Top-Left quadrant patrol (disjoint from Pac-Man)
export const BLINKY_PATH = `
  M 190,145
  L 560,145
  L 560,175
  L 190,175
  L 190,145
  Z
`.replace(/\s+/g, ' ').trim();

// Pinky (Pink Ghost): Top-Right quadrant patrol (disjoint from Pac-Man)
export const PINKY_PATH = `
  M 910,145
  L 1090,145
  L 1090,175
  L 910,175
  L 910,145
  Z
`.replace(/\s+/g, ' ').trim();

// Inky (Cyan Ghost): Bottom-Left quadrant patrol (disjoint from Pac-Man)
export const INKY_PATH = `
  M 190,475
  L 560,475
  L 560,510
  L 190,510
  L 190,475
  Z
`.replace(/\s+/g, ' ').trim();

// Clyde (Orange Ghost): Bottom-Right quadrant patrol (disjoint from Pac-Man)
export const CLYDE_PATH = `
  M 910,475
  L 1090,475
  L 1090,510
  L 910,510
  L 910,475
  Z
`.replace(/\s+/g, ' ').trim();

// ── 2. SVG Path Geometry Helpers ───────────────────────────────
export function getPathSegments(pathStr) {
  const points = [];
  const regex = /([MLZ])\s*([^MLZ]*)/g;
  let match;

  while ((match = regex.exec(pathStr)) !== null) {
    const cmd = match[1];
    const coordsStr = match[2].trim();
    if (coordsStr) {
      const parts = coordsStr.split(/[\s,]+/).map(Number);
      for (let i = 0; i < parts.length; i += 2) {
        if (!isNaN(parts[i]) && !isNaN(parts[i + 1])) {
          points.push({ x: parts[i], y: parts[i + 1] });
        }
      }
    } else if (cmd === 'Z' && points.length > 0) {
      points.push({ x: points[0].x, y: points[0].y });
    }
  }

  const segments = [];
  let totalLength = 0;

  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    segments.push({ p1, p2, length, startDistance: totalLength });
    totalLength += length;
  }

  return { segments, totalLength };
}

export function getPathPassFractions(x, y, pathStr) {
  const { segments, totalLength } = getPathSegments(pathStr);
  const threshold = 16;
  const fractions = [];

  for (const seg of segments) {
    const { p1, p2, length, startDistance } = seg;
    if (length === 0) continue;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const t = Math.max(0, Math.min(1, ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length)));
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);

    if (dist <= threshold && totalLength > 0) {
      const passDist = startDistance + t * length;
      fractions.push(parseFloat((passDist / totalLength).toFixed(6)));
    }
  }

  return fractions.sort((a, b) => a - b);
}

export function getPacmanPassFraction(x, y, pathStr) {
  const passes = getPathPassFractions(x, y, pathStr);
  return passes.length ? passes[0] : null;
}
