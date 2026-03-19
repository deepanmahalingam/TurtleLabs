export interface DotPoint {
  x: number;
  y: number;
  number: number;
}

export interface DotToDotData {
  dots: DotPoint[];
  subject: string;
  maxNumber: number;
}

// Predefined shapes for dot-to-dot
const shapes: Record<string, (count: number) => { x: number; y: number }[]> = {
  turtle: (count: number) => generateTurtleShape(count),
  dog: (count: number) => generateDogShape(count),
  cat: (count: number) => generateCatShape(count),
  fish: (count: number) => generateFishShape(count),
  star: (count: number) => generateStarShape(count),
  house: (count: number) => generateHouseShape(count),
  heart: (count: number) => generateHeartShape(count),
  butterfly: (count: number) => generateButterflyShape(count),
};

function interpolatePoints(basePoints: { x: number; y: number }[], count: number): { x: number; y: number }[] {
  const result: { x: number; y: number }[] = [];
  const totalSegments = basePoints.length - 1;
  const pointsPerSegment = Math.ceil(count / totalSegments);

  for (let seg = 0; seg < totalSegments && result.length < count; seg++) {
    const start = basePoints[seg];
    const end = basePoints[seg + 1];
    const segPoints = seg === totalSegments - 1 ? count - result.length : pointsPerSegment;

    for (let i = 0; i < segPoints && result.length < count; i++) {
      const t = i / segPoints;
      result.push({
        x: start.x + (end.x - start.x) * t,
        y: start.y + (end.y - start.y) * t,
      });
    }
  }

  // Ensure we close the shape
  if (result.length < count) {
    result.push(basePoints[basePoints.length - 1]);
  }

  return result.slice(0, count);
}

function generateTurtleShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 350, y: 250 }, { x: 380, y: 200 }, { x: 420, y: 170 },
    { x: 460, y: 160 }, { x: 500, y: 170 }, { x: 530, y: 200 },
    { x: 540, y: 240 }, { x: 530, y: 280 }, { x: 500, y: 310 },
    { x: 460, y: 320 }, { x: 420, y: 310 }, { x: 380, y: 280 },
    { x: 360, y: 260 },
    // Head
    { x: 330, y: 230 }, { x: 310, y: 210 }, { x: 300, y: 190 },
    { x: 310, y: 170 }, { x: 330, y: 160 }, { x: 350, y: 170 },
    // Back to body + legs
    { x: 370, y: 200 }, { x: 390, y: 340 }, { x: 400, y: 370 },
    { x: 420, y: 340 }, { x: 480, y: 340 }, { x: 500, y: 370 },
    { x: 510, y: 340 },
    // Tail
    { x: 540, y: 280 }, { x: 560, y: 290 }, { x: 570, y: 280 },
    { x: 560, y: 270 }, { x: 540, y: 260 },
    { x: 350, y: 250 },
  ];
  return interpolatePoints(base, count);
}

function generateDogShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 300, y: 200 }, { x: 280, y: 160 }, { x: 260, y: 130 },
    { x: 280, y: 120 }, { x: 310, y: 140 }, { x: 320, y: 170 },
    { x: 350, y: 150 }, { x: 380, y: 140 }, { x: 410, y: 150 },
    { x: 420, y: 170 }, { x: 440, y: 140 }, { x: 460, y: 120 },
    { x: 470, y: 130 }, { x: 460, y: 160 }, { x: 440, y: 200 },
    { x: 450, y: 230 }, { x: 460, y: 270 }, { x: 470, y: 310 },
    { x: 480, y: 350 }, { x: 470, y: 370 }, { x: 450, y: 360 },
    { x: 440, y: 320 }, { x: 420, y: 300 }, { x: 380, y: 310 },
    { x: 360, y: 350 }, { x: 350, y: 370 }, { x: 330, y: 360 },
    { x: 330, y: 330 }, { x: 320, y: 300 }, { x: 300, y: 280 },
    { x: 290, y: 240 }, { x: 300, y: 200 },
  ];
  return interpolatePoints(base, count);
}

function generateCatShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 350, y: 250 }, { x: 320, y: 200 }, { x: 300, y: 150 },
    { x: 310, y: 120 }, { x: 340, y: 140 }, { x: 360, y: 160 },
    { x: 400, y: 150 }, { x: 430, y: 140 }, { x: 450, y: 120 },
    { x: 460, y: 150 }, { x: 440, y: 200 }, { x: 420, y: 250 },
    { x: 440, y: 280 }, { x: 460, y: 320 }, { x: 470, y: 360 },
    { x: 450, y: 370 }, { x: 430, y: 340 }, { x: 400, y: 310 },
    { x: 370, y: 310 }, { x: 340, y: 340 }, { x: 320, y: 370 },
    { x: 300, y: 360 }, { x: 310, y: 320 }, { x: 330, y: 280 },
    { x: 350, y: 250 },
  ];
  return interpolatePoints(base, count);
}

function generateFishShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 280, y: 250 }, { x: 320, y: 200 }, { x: 380, y: 170 },
    { x: 440, y: 180 }, { x: 480, y: 210 }, { x: 500, y: 250 },
    { x: 480, y: 290 }, { x: 440, y: 320 }, { x: 380, y: 330 },
    { x: 320, y: 300 }, { x: 280, y: 250 },
    // Tail
    { x: 240, y: 250 }, { x: 200, y: 200 }, { x: 190, y: 180 },
    { x: 210, y: 200 }, { x: 230, y: 240 }, { x: 230, y: 260 },
    { x: 210, y: 300 }, { x: 190, y: 320 }, { x: 200, y: 300 },
    { x: 240, y: 250 }, { x: 280, y: 250 },
  ];
  return interpolatePoints(base, count);
}

function generateStarShape(count: number): { x: number; y: number }[] {
  const base: { x: number; y: number }[] = [];
  const cx = 400, cy = 260;
  for (let i = 0; i < 10; i++) {
    const angle = (i * 36 - 90) * Math.PI / 180;
    const r = i % 2 === 0 ? 120 : 50;
    base.push({ x: cx + Math.cos(angle) * r, y: cy + Math.sin(angle) * r });
  }
  base.push(base[0]);
  return interpolatePoints(base, count);
}

function generateHouseShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 300, y: 350 }, { x: 300, y: 220 }, { x: 250, y: 220 },
    { x: 400, y: 130 }, { x: 550, y: 220 }, { x: 500, y: 220 },
    { x: 500, y: 350 }, { x: 430, y: 350 }, { x: 430, y: 280 },
    { x: 370, y: 280 }, { x: 370, y: 350 }, { x: 300, y: 350 },
  ];
  return interpolatePoints(base, count);
}

function generateHeartShape(count: number): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= 30; i++) {
    const t = (i / 30) * 2 * Math.PI;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
    points.push({ x: 400 + x * 7, y: 250 + y * 7 });
  }
  return interpolatePoints(points, count);
}

function generateButterflyShape(count: number): { x: number; y: number }[] {
  const base = [
    { x: 400, y: 350 }, { x: 400, y: 300 }, { x: 380, y: 260 },
    { x: 340, y: 220 }, { x: 300, y: 180 }, { x: 300, y: 150 },
    { x: 330, y: 140 }, { x: 370, y: 160 }, { x: 390, y: 190 },
    { x: 400, y: 220 },
    { x: 410, y: 190 }, { x: 430, y: 160 }, { x: 470, y: 140 },
    { x: 500, y: 150 }, { x: 500, y: 180 }, { x: 460, y: 220 },
    { x: 420, y: 260 }, { x: 400, y: 300 },
    // Lower wings
    { x: 380, y: 310 }, { x: 340, y: 330 }, { x: 320, y: 360 },
    { x: 340, y: 370 }, { x: 380, y: 350 }, { x: 400, y: 330 },
    { x: 420, y: 350 }, { x: 460, y: 370 }, { x: 480, y: 360 },
    { x: 460, y: 330 }, { x: 420, y: 310 }, { x: 400, y: 350 },
  ];
  return interpolatePoints(base, count);
}

export function generateDotToDot(subject: string, maxNumber: number): DotToDotData {
  const shapeKey = Object.keys(shapes).find(k => subject.toLowerCase().includes(k)) || 'turtle';
  const shapeGen = shapes[shapeKey];
  const points = shapeGen(maxNumber);

  const dots: DotPoint[] = points.map((p, i) => ({
    x: p.x,
    y: p.y,
    number: i + 1,
  }));

  return { dots, subject: shapeKey, maxNumber };
}
