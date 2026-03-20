export interface MazeCell {
  x: number;
  y: number;
  walls: { top: boolean; right: boolean; bottom: boolean; left: boolean };
  visited: boolean;
}

export interface MazeTheme {
  startEmoji: string;
  endEmoji: string;
  startLabel: string;
  endLabel: string;
  title: string;
  subtitle: string;
}

const mazeThemes: Record<string, MazeTheme> = {
  turtle: { startEmoji: '🐢', endEmoji: '🌊', startLabel: 'turtle', endLabel: 'ocean', title: 'Find the Way!', subtitle: 'Help the baby turtle reach the ocean!' },
  dog: { startEmoji: '🐕', endEmoji: '🦴', startLabel: 'dog', endLabel: 'bone', title: 'Find the Bone!', subtitle: 'Help the puppy find its yummy bone!' },
  cat: { startEmoji: '🐱', endEmoji: '🐟', startLabel: 'cat', endLabel: 'fish', title: 'Catch the Fish!', subtitle: 'Help the kitty reach the fish!' },
  rabbit: { startEmoji: '🐰', endEmoji: '🥕', startLabel: 'rabbit', endLabel: 'carrot', title: 'Find the Carrot!', subtitle: 'Help the bunny hop to the carrot!' },
  bunny: { startEmoji: '🐰', endEmoji: '🥕', startLabel: 'bunny', endLabel: 'carrot', title: 'Find the Carrot!', subtitle: 'Help the bunny hop to the carrot!' },
  mouse: { startEmoji: '🐭', endEmoji: '🧀', startLabel: 'mouse', endLabel: 'cheese', title: 'Find the Cheese!', subtitle: 'Help the little mouse find the cheese!' },
  bee: { startEmoji: '🐝', endEmoji: '🌸', startLabel: 'bee', endLabel: 'flower', title: 'Find the Flower!', subtitle: 'Help the busy bee reach the flower!' },
  pirate: { startEmoji: '🏴‍☠️', endEmoji: '💰', startLabel: 'pirate', endLabel: 'treasure', title: 'Find the Treasure!', subtitle: 'Help the pirate find the hidden treasure!' },
  astronaut: { startEmoji: '🧑‍🚀', endEmoji: '🚀', startLabel: 'astronaut', endLabel: 'rocket', title: 'Reach the Rocket!', subtitle: 'Help the astronaut get to the rocket!' },
  princess: { startEmoji: '👸', endEmoji: '🏰', startLabel: 'princess', endLabel: 'castle', title: 'Find the Castle!', subtitle: 'Help the princess reach her castle!' },
  knight: { startEmoji: '🗡️', endEmoji: '🐉', startLabel: 'knight', endLabel: 'dragon', title: 'Find the Dragon!', subtitle: 'Help the brave knight reach the dragon!' },
  monkey: { startEmoji: '🐒', endEmoji: '🍌', startLabel: 'monkey', endLabel: 'banana', title: 'Find the Banana!', subtitle: 'Help the monkey swing to the banana!' },
  bear: { startEmoji: '🐻', endEmoji: '🍯', startLabel: 'bear', endLabel: 'honey', title: 'Find the Honey!', subtitle: 'Help the bear find the honey pot!' },
  fish: { startEmoji: '🐟', endEmoji: '🌊', startLabel: 'fish', endLabel: 'ocean', title: 'Swim to the Ocean!', subtitle: 'Help the fish swim to the open ocean!' },
  bird: { startEmoji: '🐦', endEmoji: '🪺', startLabel: 'bird', endLabel: 'nest', title: 'Find the Nest!', subtitle: 'Help the little bird fly back to its nest!' },
  car: { startEmoji: '🚗', endEmoji: '🏠', startLabel: 'car', endLabel: 'home', title: 'Drive Home!', subtitle: 'Help the car find the way home!' },
  dinosaur: { startEmoji: '🦕', endEmoji: '🥚', startLabel: 'dinosaur', endLabel: 'egg', title: 'Find the Egg!', subtitle: 'Help the dinosaur find its egg!' },
  unicorn: { startEmoji: '🦄', endEmoji: '🌈', startLabel: 'unicorn', endLabel: 'rainbow', title: 'Find the Rainbow!', subtitle: 'Help the unicorn reach the rainbow!' },
  frog: { startEmoji: '🐸', endEmoji: '🪷', startLabel: 'frog', endLabel: 'lily pad', title: 'Hop to the Lily Pad!', subtitle: 'Help the frog hop to the lily pad!' },
  penguin: { startEmoji: '🐧', endEmoji: '🧊', startLabel: 'penguin', endLabel: 'igloo', title: 'Find the Igloo!', subtitle: 'Help the penguin waddle to the igloo!' },
};

export function getMazeTheme(themeKey: string): MazeTheme {
  return mazeThemes[themeKey] || mazeThemes.turtle;
}

export interface MazeData {
  grid: MazeCell[][];
  width: number;
  height: number;
  start: { x: number; y: number };
  end: { x: number; y: number };
  solution: { x: number; y: number }[];
  difficulty: string;
  theme: MazeTheme;
}

export function generateMaze(difficulty: 'easy' | 'medium' | 'hard', themeKey?: string): MazeData {
  const sizes = { easy: { w: 8, h: 8 }, medium: { w: 12, h: 12 }, hard: { w: 16, h: 16 } };
  const { w, h } = sizes[difficulty];
  const theme = getMazeTheme(themeKey || 'turtle');

  // Initialize grid
  const grid: MazeCell[][] = [];
  for (let y = 0; y < h; y++) {
    grid[y] = [];
    for (let x = 0; x < w; x++) {
      grid[y][x] = {
        x, y,
        walls: { top: true, right: true, bottom: true, left: true },
        visited: false,
      };
    }
  }

  // DFS maze generation
  const stack: MazeCell[] = [];
  const start = grid[0][0];
  start.visited = true;
  stack.push(start);

  while (stack.length > 0) {
    const current = stack[stack.length - 1];
    const neighbors = getUnvisitedNeighbors(current, grid, w, h);

    if (neighbors.length === 0) {
      stack.pop();
    } else {
      const next = neighbors[Math.floor(Math.random() * neighbors.length)];
      removeWall(current, next);
      next.visited = true;
      stack.push(next);
    }
  }

  const startPos = { x: 0, y: 0 };
  const endPos = { x: w - 1, y: h - 1 };

  // Solve maze for answer key
  const solution = solveMaze(grid, startPos, endPos, w, h);

  return { grid, width: w, height: h, start: startPos, end: endPos, solution, difficulty, theme };
}

function getUnvisitedNeighbors(cell: MazeCell, grid: MazeCell[][], w: number, h: number): MazeCell[] {
  const { x, y } = cell;
  const neighbors: MazeCell[] = [];
  if (y > 0 && !grid[y - 1][x].visited) neighbors.push(grid[y - 1][x]);
  if (x < w - 1 && !grid[y][x + 1].visited) neighbors.push(grid[y][x + 1]);
  if (y < h - 1 && !grid[y + 1][x].visited) neighbors.push(grid[y + 1][x]);
  if (x > 0 && !grid[y][x - 1].visited) neighbors.push(grid[y][x - 1]);
  return neighbors;
}

function removeWall(a: MazeCell, b: MazeCell) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  if (dx === 1) { a.walls.left = false; b.walls.right = false; }
  if (dx === -1) { a.walls.right = false; b.walls.left = false; }
  if (dy === 1) { a.walls.top = false; b.walls.bottom = false; }
  if (dy === -1) { a.walls.bottom = false; b.walls.top = false; }
}

function solveMaze(grid: MazeCell[][], start: { x: number; y: number }, end: { x: number; y: number }, w: number, h: number): { x: number; y: number }[] {
  const visited = new Set<string>();
  const path: { x: number; y: number }[] = [];

  function dfs(x: number, y: number): boolean {
    if (x === end.x && y === end.y) {
      path.push({ x, y });
      return true;
    }

    const key = `${x},${y}`;
    if (visited.has(key)) return false;
    visited.add(key);
    path.push({ x, y });

    const cell = grid[y][x];
    const directions = [
      { dx: 0, dy: -1, wall: 'top' as const },
      { dx: 1, dy: 0, wall: 'right' as const },
      { dx: 0, dy: 1, wall: 'bottom' as const },
      { dx: -1, dy: 0, wall: 'left' as const },
    ];

    for (const dir of directions) {
      const nx = x + dir.dx;
      const ny = y + dir.dy;
      if (nx >= 0 && nx < w && ny >= 0 && ny < h && !cell.walls[dir.wall]) {
        if (dfs(nx, ny)) return true;
      }
    }

    path.pop();
    return false;
  }

  dfs(start.x, start.y);
  return path;
}
