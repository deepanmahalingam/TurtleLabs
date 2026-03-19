import { WorksheetType } from '../context/AppContext';

interface ParsedPrompt {
  type: WorksheetType;
  operations?: string[];
  digits?: number;
  questionCount?: number;
  subject?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  maxNumber?: number;
  theme?: string;
}

export function parsePrompt(prompt: string): ParsedPrompt {
  const lower = prompt.toLowerCase().trim();

  // Detect worksheet type
  if (isMath(lower)) return parseMathPrompt(lower);
  if (isDotToDot(lower)) return parseDotPrompt(lower);
  if (isSpotDifference(lower)) return parseSpotPrompt(lower);
  if (isMaze(lower)) return parseMazePrompt(lower);
  if (isColoring(lower)) return parseColoringPrompt(lower);

  // Default to math if unclear
  return parseMathPrompt(lower);
}

function isMath(p: string): boolean {
  return /\b(math|addition|subtraction|subtract|add|plus|minus|multiply|multiplication|divide|division|worksheet|digit|questions?)\b/.test(p);
}

function isDotToDot(p: string): boolean {
  return /\b(dot[- ]?to[- ]?dot|join[- ]?the[- ]?dots?|joining[- ]?dots?|connect[- ]?the[- ]?dots?)\b/.test(p);
}

function isSpotDifference(p: string): boolean {
  return /\b(spot[- ]?the[- ]?differ|find[- ]?the[- ]?differ|difference)\b/.test(p);
}

function isMaze(p: string): boolean {
  return /\b(maze|find[- ]?a[- ]?way|labyrinth)\b/.test(p);
}

function isColoring(p: string): boolean {
  return /\b(color|colour|coloring|colouring)\b/.test(p);
}

function parseMathPrompt(p: string): ParsedPrompt {
  const operations: string[] = [];
  if (/\b(add|addition|plus)\b/.test(p)) operations.push('addition');
  if (/\b(subtract|subtraction|minus)\b/.test(p)) operations.push('subtraction');
  if (/\b(multiply|multiplication|times)\b/.test(p)) operations.push('multiplication');
  if (/\b(divide|division)\b/.test(p)) operations.push('division');
  if (/\bmixed\b/.test(p)) operations.push('addition', 'subtraction');
  if (operations.length === 0) operations.push('addition');

  const digitMatch = p.match(/(\d)[- ]?digit/);
  const digits = digitMatch ? parseInt(digitMatch[1]) : 1;

  const countMatch = p.match(/(\d+)\s*questions?/);
  const questionCount = countMatch ? Math.min(parseInt(countMatch[1]), 15) : 15;

  return { type: 'math', operations, digits: Math.min(digits, 3), questionCount };
}

function parseDotPrompt(p: string): ParsedPrompt {
  const numberMatch = p.match(/(?:up to|max|maximum|numbers?\s+(?:up\s+)?to)\s*(\d+)/);
  const maxNumber = numberMatch ? parseInt(numberMatch[1]) : 30;

  const subjectMatch = p.match(/(?:of|image of)\s+(?:a\s+)?(\w+)/);
  const subject = subjectMatch ? subjectMatch[1] : 'turtle';

  return { type: 'dot-to-dot', maxNumber: Math.min(maxNumber, 100), subject };
}

function parseSpotPrompt(p: string): ParsedPrompt {
  const themes = ['farm', 'underwater', 'jungle', 'space', 'garden', 'beach', 'ocean', 'turtle'];
  const theme = themes.find(t => p.includes(t)) || 'underwater';
  return { type: 'spot-difference', theme };
}

function parseMazePrompt(p: string): ParsedPrompt {
  let difficulty: 'easy' | 'medium' | 'hard' = 'easy';
  if (/\b(medium|moderate)\b/.test(p)) difficulty = 'medium';
  if (/\b(hard|difficult|challenging)\b/.test(p)) difficulty = 'hard';
  if (/\b(2nd grade|grade 2)\b/.test(p)) difficulty = 'medium';

  return { type: 'maze', difficulty };
}

function parseColoringPrompt(p: string): ParsedPrompt {
  const words = p.replace(/\b(color|colour|coloring|colouring|sheet|page|print|generate|create|a|an|the|of|for|with|grade|worksheet)\b/g, '').trim();
  const subject = words || 'turtle under the sea';
  return { type: 'coloring', subject };
}

export type { ParsedPrompt };
