/**
 * animations.js
 * Motion paths, durations, keyframes, and timing configurations
 * for Pac-Man, Blinky, Pinky, Inky, Clyde, and arcade visual effects.
 */

export const ANIMATION_CONFIG = {
  pacmanDuration: '12s',
  blinkyDuration: '14s',
  pinkyDuration: '17s',
  inkyDuration: '20s',
  clydeDuration: '22s',
  powerPelletPulse: '0.8s',
  pelletPulse: '1.4s',
  mazeGlowPulse: '3.5s',
  crtScanlineSpeed: '8s',
  scoreTickSpeed: '1.5s'
};

/**
 * Valid Orthogonal Motion Paths
 * Strictly mapped to corridor centerlines with 0 wall collisions.
 */

// Pac-Man Route (12s complete loop covering all 4 quadrants, all 4 power pellets, and nameplate perimeter)
export const PACMAN_PATH = `
  M 640,555 
  L 85,555 
  L 85,465 
  L 470,465 
  L 470,335 
  L 200,335 
  L 200,140 
  L 85,140 
  L 85,80 
  L 600,80 
  L 600,140 
  L 680,140 
  L 680,80 
  L 1195,80 
  L 1195,140 
  L 1080,140 
  L 1080,205 
  L 470,205 
  L 470,335 
  L 810,335 
  L 1080,335 
  L 1080,465 
  L 1195,465 
  L 1195,555 
  L 640,555 
  Z
`.replace(/\s+/g, ' ').trim();

// Blinky Route (14s direct chase route patrolling outer perimeter and top corridors)
export const BLINKY_PATH = `
  M 640,140 
  L 1195,140 
  L 1195,310 
  L 1080,310 
  L 1080,465 
  L 1195,465 
  L 1195,555 
  L 810,555 
  L 810,335 
  L 200,335 
  L 200,140 
  L 640,140 
  Z
`.replace(/\s+/g, ' ').trim();

// Pinky Route (17s interception route weaving through inner maze corridors)
export const PINKY_PATH = `
  M 200,205 
  L 1080,205 
  L 1080,140 
  L 85,140 
  L 85,310 
  L 200,310 
  L 200,465 
  L 85,465 
  L 85,555 
  L 470,555 
  L 470,335 
  L 200,335 
  L 200,205 
  Z
`.replace(/\s+/g, ' ').trim();

// Inky Route (20s lower and side flanking route through lower cross corridors)
export const INKY_PATH = `
  M 1080,465 
  L 810,465 
  L 810,555 
  L 85,555 
  L 85,310 
  L 200,310 
  L 200,205 
  L 810,205 
  L 810,335 
  L 1080,335 
  L 1080,465 
  Z
`.replace(/\s+/g, ' ').trim();

// Clyde Route (22s wandering route around ghost house and lower right quadrant)
export const CLYDE_PATH = `
  M 640,335 
  L 810,335 
  L 810,555 
  L 1195,555 
  L 1195,465 
  L 960,465 
  L 960,335 
  L 1080,335 
  L 1080,140 
  L 470,140 
  L 470,335 
  L 640,335 
  Z
`.replace(/\s+/g, ' ').trim();

/**
 * Parses SVG path into a sequence of line segments with cumulative lengths
 */
export function getPathSegments(pathString) {
  const points = [];
  const regex = /([MLZ])\s*([^MLZ]*)/g;
  let match;

  while ((match = regex.exec(pathString)) !== null) {
    const cmd = match[1];
    const coordsStr = match[2].trim();
    if (coordsStr) {
      const parts = coordsStr.split(/[\s,]+/).map(Number);
      for (let i = 0; i < parts.length; i += 2) {
        if (!isNaN(parts[i]) && !isNaN(parts[i+1])) {
          points.push({ x: parts[i], y: parts[i+1] });
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
    const p2 = points[i+1];
    const len = Math.hypot(p2.x - p1.x, p2.y - p1.y);
    segments.push({
      p1,
      p2,
      length: len,
      startDist: totalLength,
      endDist: totalLength + len
    });
    totalLength += len;
  }

  return { segments, totalLength };
}

/**
 * Calculates normalized time fraction [0, 1) when Pac-Man passes near a coordinate (x,y)
 */
export function getPacmanPassFraction(x, y, pathString) {
  const { segments, totalLength } = getPathSegments(pathString);
  let bestDist = Infinity;
  let bestFraction = null;

  for (const seg of segments) {
    const dx = seg.p2.x - seg.p1.x;
    const dy = seg.p2.y - seg.p1.y;
    const segLenSq = dx * dx + dy * dy;

    if (segLenSq === 0) continue;

    let t = ((x - seg.p1.x) * dx + (y - seg.p1.y) * dy) / segLenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = seg.p1.x + t * dx;
    const projY = seg.p1.y + t * dy;
    const distToSeg = Math.hypot(x - projX, y - projY);

    if (distToSeg < 22 && distToSeg < bestDist) {
      bestDist = distToSeg;
      const distAlongPath = seg.startDist + t * seg.length;
      bestFraction = distAlongPath / totalLength;
    }
  }

  return bestFraction;
}
