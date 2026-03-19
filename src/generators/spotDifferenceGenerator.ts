export interface SpotDiffScene {
  theme: string;
  elements: SceneElement[];
  differences: Difference[];
}

interface SceneElement {
  id: string;
  type: 'circle' | 'rect' | 'path' | 'ellipse' | 'polygon';
  props: Record<string, any>;
}

interface Difference {
  id: string;
  description: string;
  x: number;
  y: number;
}

const themeConfigs: Record<string, () => { elements: SceneElement[]; modifiable: string[] }> = {
  underwater: generateUnderwaterScene,
  farm: generateFarmScene,
  jungle: generateJungleScene,
  garden: generateGardenScene,
  beach: generateBeachScene,
};

function generateUnderwaterScene() {
  const elements: SceneElement[] = [
    // Background water
    { id: 'water', type: 'rect', props: { x: 0, y: 0, width: 380, height: 500, fill: '#e8f4f8', rx: 0 } },
    // Sand
    { id: 'sand', type: 'path', props: { d: 'M0 420 Q95 400 190 415 Q285 430 380 410 L380 500 L0 500 Z', fill: '#f5e6ca' } },
    // Sun rays from top
    { id: 'rays', type: 'path', props: { d: 'M190 0 L170 80 L190 60 L210 80 Z', fill: '#ffe08855' } },
    // Big coral left
    { id: 'coral1', type: 'path', props: { d: 'M60 420 Q50 370 65 340 Q80 310 70 280 Q60 310 55 340 Q40 370 50 420 Z', fill: '#ff6b6b' } },
    // Coral branch
    { id: 'coral2', type: 'path', props: { d: 'M300 430 Q310 380 325 350 Q340 320 330 290 Q320 320 315 350 Q290 380 295 430 Z', fill: '#ff8e8e' } },
    // Seaweed 1
    { id: 'seaweed1', type: 'path', props: { d: 'M130 420 Q120 380 135 350 Q150 320 140 280 Q130 250 140 220', fill: 'none', stroke: '#2ecc71', strokeWidth: 6, strokeLinecap: 'round' } },
    // Seaweed 2
    { id: 'seaweed2', type: 'path', props: { d: 'M240 425 Q250 390 235 360 Q220 330 230 300 Q240 270 235 240', fill: 'none', stroke: '#27ae60', strokeWidth: 5, strokeLinecap: 'round' } },
    // Fish 1
    { id: 'fish1', type: 'path', props: { d: 'M100 180 Q130 160 160 180 Q130 200 100 180 Z', fill: '#f39c12' } },
    { id: 'fish1tail', type: 'path', props: { d: 'M95 180 L75 165 L75 195 Z', fill: '#f39c12' } },
    { id: 'fish1eye', type: 'circle', props: { cx: 140, cy: 176, r: 4, fill: '#1a3a4a' } },
    // Fish 2
    { id: 'fish2', type: 'path', props: { d: 'M250 120 Q280 100 310 120 Q280 140 250 120 Z', fill: '#e74c3c' } },
    { id: 'fish2tail', type: 'path', props: { d: 'M245 120 L225 105 L225 135 Z', fill: '#e74c3c' } },
    { id: 'fish2eye', type: 'circle', props: { cx: 290, cy: 116, r: 4, fill: '#1a3a4a' } },
    // Turtle body
    { id: 'turtleshell', type: 'ellipse', props: { cx: 200, cy: 300, rx: 40, ry: 28, fill: '#2ecc71' } },
    { id: 'turtlehead', type: 'circle', props: { cx: 248, cy: 292, r: 14, fill: '#27ae60' } },
    { id: 'turtleeye', type: 'circle', props: { cx: 254, cy: 288, r: 3, fill: '#1a3a4a' } },
    // Turtle flippers
    { id: 'flipper1', type: 'ellipse', props: { cx: 180, cy: 318, rx: 14, ry: 6, fill: '#27ae60', transform: 'rotate(-20 180 318)' } },
    { id: 'flipper2', type: 'ellipse', props: { cx: 220, cy: 318, rx: 14, ry: 6, fill: '#27ae60', transform: 'rotate(20 220 318)' } },
    // Bubbles
    { id: 'bubble1', type: 'circle', props: { cx: 265, cy: 270, r: 5, fill: 'none', stroke: '#88ccdd', strokeWidth: 1.5 } },
    { id: 'bubble2', type: 'circle', props: { cx: 275, cy: 255, r: 3.5, fill: 'none', stroke: '#88ccdd', strokeWidth: 1.5 } },
    { id: 'bubble3', type: 'circle', props: { cx: 260, cy: 248, r: 4, fill: 'none', stroke: '#88ccdd', strokeWidth: 1.5 } },
    // Starfish
    { id: 'starfish', type: 'path', props: { d: 'M80 450 L84 438 L95 435 L87 427 L90 415 L80 422 L70 415 L73 427 L65 435 L76 438 Z', fill: '#f39c12' } },
    // Shell
    { id: 'shell', type: 'path', props: { d: 'M320 455 Q330 440 340 455 Q335 445 330 455 Z', fill: '#fdcfe8', stroke: '#e8a0c0', strokeWidth: 1 } },
    // Small rocks
    { id: 'rock1', type: 'ellipse', props: { cx: 170, cy: 445, rx: 12, ry: 7, fill: '#bbb' } },
    { id: 'rock2', type: 'ellipse', props: { cx: 280, cy: 450, rx: 9, ry: 5, fill: '#aaa' } },
  ];

  const modifiable = ['fish1', 'fish2', 'bubble3', 'starfish', 'coral2', 'shell', 'seaweed2', 'rock1', 'turtleshell'];
  return { elements, modifiable };
}

function generateFarmScene() {
  const elements: SceneElement[] = [
    { id: 'sky', type: 'rect', props: { x: 0, y: 0, width: 380, height: 280, fill: '#e3f2fd' } },
    { id: 'grass', type: 'rect', props: { x: 0, y: 280, width: 380, height: 220, fill: '#81c784' } },
    { id: 'sun', type: 'circle', props: { cx: 320, cy: 60, r: 35, fill: '#ffd54f' } },
    { id: 'cloud1', type: 'ellipse', props: { cx: 100, cy: 50, rx: 40, ry: 20, fill: 'white' } },
    { id: 'cloud2', type: 'ellipse', props: { cx: 200, cy: 80, rx: 35, ry: 18, fill: 'white' } },
    { id: 'barn', type: 'rect', props: { x: 30, y: 200, width: 100, height: 100, fill: '#e53935' } },
    { id: 'barnroof', type: 'path', props: { d: 'M20 200 L80 150 L140 200 Z', fill: '#c62828' } },
    { id: 'barndoor', type: 'rect', props: { x: 60, y: 250, width: 40, height: 50, fill: '#5d4037', rx: 20 } },
    { id: 'fence1', type: 'rect', props: { x: 150, y: 290, width: 200, height: 4, fill: '#8d6e63' } },
    { id: 'fence2', type: 'rect', props: { x: 150, y: 310, width: 200, height: 4, fill: '#8d6e63' } },
    { id: 'post1', type: 'rect', props: { x: 150, y: 280, width: 5, height: 40, fill: '#6d4c41' } },
    { id: 'post2', type: 'rect', props: { x: 250, y: 280, width: 5, height: 40, fill: '#6d4c41' } },
    { id: 'post3', type: 'rect', props: { x: 350, y: 280, width: 5, height: 40, fill: '#6d4c41' } },
    // Cow body
    { id: 'cow', type: 'ellipse', props: { cx: 220, cy: 370, rx: 35, ry: 22, fill: 'white' } },
    { id: 'cowhead', type: 'circle', props: { cx: 260, cy: 358, r: 14, fill: 'white' } },
    { id: 'coweye', type: 'circle', props: { cx: 265, cy: 354, r: 3, fill: '#1a3a4a' } },
    { id: 'cowspot', type: 'circle', props: { cx: 210, cy: 365, r: 10, fill: '#555' } },
    // Chicken
    { id: 'chicken', type: 'circle', props: { cx: 300, cy: 395, r: 12, fill: '#fff9c4' } },
    { id: 'chickenhead', type: 'circle', props: { cx: 310, cy: 385, r: 7, fill: '#fff9c4' } },
    { id: 'chickenbeak', type: 'path', props: { d: 'M316 385 L324 385 L316 389 Z', fill: '#ff8f00' } },
    { id: 'chickeneye', type: 'circle', props: { cx: 313, cy: 383, r: 2, fill: '#1a3a4a' } },
    // Tree
    { id: 'trunk', type: 'rect', props: { x: 330, y: 220, width: 14, height: 60, fill: '#6d4c41' } },
    { id: 'leaves', type: 'circle', props: { cx: 337, cy: 200, r: 35, fill: '#388e3c' } },
    // Flowers
    { id: 'flower1', type: 'circle', props: { cx: 170, cy: 430, r: 8, fill: '#f44336' } },
    { id: 'flower2', type: 'circle', props: { cx: 290, cy: 440, r: 7, fill: '#e91e63' } },
    { id: 'flower3', type: 'circle', props: { cx: 130, cy: 450, r: 6, fill: '#ff9800' } },
  ];
  const modifiable = ['sun', 'cloud2', 'cowspot', 'chicken', 'flower1', 'flower2', 'flower3', 'leaves', 'chickenbeak'];
  return { elements, modifiable };
}

function generateJungleScene() { return generateUnderwaterScene(); }
function generateGardenScene() { return generateFarmScene(); }
function generateBeachScene() { return generateUnderwaterScene(); }

export function generateSpotDifference(theme: string): SpotDiffScene {
  const generator = themeConfigs[theme] || themeConfigs.underwater;
  const { elements, modifiable } = generator();

  // Pick 6 random differences
  const shuffled = [...modifiable].sort(() => Math.random() - 0.5);
  const diffTargets = shuffled.slice(0, 6);

  const differences: Difference[] = diffTargets.map((id, index) => {
    const elem = elements.find(e => e.id === id);
    const cx = elem?.props.cx || elem?.props.x || 200;
    const cy = elem?.props.cy || elem?.props.y || 250;
    return {
      id,
      description: `Difference ${index + 1}: ${id} is changed`,
      x: cx,
      y: cy,
    };
  });

  return { theme, elements, differences };
}
