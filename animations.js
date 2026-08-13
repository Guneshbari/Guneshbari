/**
 * animations.js
 * Timing configurations, character motion paths, and pellet consumption synchronization.
 */

export const ANIMATION_CONFIG = {
  pacmanDuration: '26s',
  blinkyDuration: '28s',
  pinkyDuration: '32s',
  inkyDuration: '36s',
  clydeDuration: '40s',
  powerPelletPulse: '0.8s',
  pelletPulse: '1.4s',
  mazeGlowPulse: '3.5s',
  crtScanlineSpeed: '8s',
  scoreTickSpeed: '1.5s'
};

// ── 1. Strictly Orthogonal Seamless Character Paths ────────────
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

export const BLINKY_PATH = `
  M 735,85
  L 1205,85
  L 1205,200
  L 735,200
  L 735,400
  L 1205,400
  L 1205,555
  L 735,555
  L 735,85
  Z
`.replace(/\s+/g, ' ').trim();

export const PINKY_PATH = `
  M 75,85
  L 735,85
  L 735,200
  L 75,200
  L 75,400
  L 735,400
  L 735,555
  L 75,555
  L 75,85
  Z
`.replace(/\s+/g, ' ').trim();

export const INKY_PATH = `
  M 75,85
  L 1205,85
  L 1205,555
  L 75,555
  L 75,85
  Z
`.replace(/\s+/g, ' ').trim();

export const CLYDE_PATH = `
  M 735,400
  L 75,400
  L 75,555
  L 1205,555
  L 1205,400
  L 735,400
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

export function getPacmanPassFraction(x, y, pathStr) {
  const { segments, totalLength } = getPathSegments(pathStr);
  const threshold = 16;
  let closestDist = Infinity;
  let passDistance = 0;

  for (const seg of segments) {
    const { p1, p2, length, startDistance } = seg;
    if (length === 0) continue;

    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const t = Math.max(0, Math.min(1, ((x - p1.x) * dx + (y - p1.y) * dy) / (length * length)));
    const projX = p1.x + t * dx;
    const projY = p1.y + t * dy;
    const dist = Math.sqrt((x - projX) ** 2 + (y - projY) ** 2);

    if (dist < closestDist && dist <= threshold) {
      closestDist = dist;
      passDistance = startDistance + t * length;
    }
  }

  if (closestDist <= threshold && totalLength > 0) {
    return parseFloat((passDistance / totalLength).toFixed(4));
  }
  return null;
}
