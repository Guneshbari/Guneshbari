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
 * All segments strictly follow maze corridors.
 */

// Pac-Man Route (12s complete loop visiting all 4 quadrants and the GUNESH BARI corridor)
export const PACMAN_PATH = `
  M 640,565 
  L 90,565 
  L 90,490 
  L 410,490 
  L 410,335 
  L 90,335 
  L 90,210 
  L 250,210 
  L 250,70 
  L 580,70 
  L 580,160 
  L 700,160 
  L 700,70 
  L 1030,70 
  L 1030,210 
  L 1190,210 
  L 1190,335 
  L 1030,335 
  L 1030,490 
  L 870,490 
  L 870,565 
  Z
`.replace(/\s+/g, ' ').trim();

// Blinky Route (14s direct chase route patrolling outer perimeter and upper corridors)
export const BLINKY_PATH = `
  M 640,70 
  L 1190,70 
  L 1190,335 
  L 1030,335 
  L 1030,490 
  L 1190,490 
  L 1190,565 
  L 680,565 
  L 680,490 
  L 490,490 
  L 490,210 
  L 250,210 
  L 250,70 
  Z
`.replace(/\s+/g, ' ').trim();

// Pinky Route (17s interception route weaving through center and GUNESH BARI perimeter)
export const PINKY_PATH = `
  M 250,210 
  L 1030,210 
  L 1030,70 
  L 870,70 
  L 870,160 
  L 530,160 
  L 530,70 
  L 90,70 
  L 90,335 
  L 250,335 
  L 250,490 
  L 90,490 
  L 90,565 
  L 410,565 
  L 410,335 
  L 250,335 
  Z
`.replace(/\s+/g, ' ').trim();

// Inky Route (20s lower & side flanking route through lower cross corridors)
export const INKY_PATH = `
  M 1030,490 
  L 1030,335 
  L 1190,335 
  L 1190,565 
  L 640,565 
  L 640,490 
  L 410,490 
  L 410,565 
  L 90,565 
  L 90,410 
  L 250,410 
  L 250,210 
  L 490,210 
  L 490,335 
  L 790,335 
  L 790,210 
  L 1030,210 
  Z
`.replace(/\s+/g, ' ').trim();

// Clyde Route (22s wandering route around ghost house and lower right quadrant)
export const CLYDE_PATH = `
  M 640,360 
  L 790,360 
  L 790,490 
  L 1190,490 
  L 1190,565 
  L 870,565 
  L 870,410 
  L 1030,410 
  L 1030,210 
  L 870,210 
  L 870,70 
  L 700,70 
  L 700,160 
  L 490,160 
  L 490,360 
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
    // Project (x,y) onto segment (p1 -> p2)
    const dx = seg.p2.x - seg.p1.x;
    const dy = seg.p2.y - seg.p1.y;
    const segLenSq = dx * dx + dy * dy;

    if (segLenSq === 0) continue;

    let t = ((x - seg.p1.x) * dx + (y - seg.p1.y) * dy) / segLenSq;
    t = Math.max(0, Math.min(1, t));

    const projX = seg.p1.x + t * dx;
    const projY = seg.p1.y + t * dy;
    const distToSeg = Math.hypot(x - projX, y - projY);

    // If within 18px of path, it's consumed!
    if (distToSeg < 18 && distToSeg < bestDist) {
      bestDist = distToSeg;
      const distAlongPath = seg.startDist + t * seg.length;
      bestFraction = distAlongPath / totalLength;
    }
  }

  return bestFraction;
}
