export interface MathQuestion {
  num1: number;
  num2: number;
  operation: string;
  operationSymbol: string;
  answer: number;
}

export interface MathWorksheet {
  title: string;
  questions: MathQuestion[];
}

function randomNumber(digits: number): number {
  const min = digits === 1 ? 1 : Math.pow(10, digits - 1);
  const max = Math.pow(10, digits) - 1;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMathWorksheet(
  operations: string[],
  digits: number,
  questionCount: number
): MathWorksheet {
  const questions: MathQuestion[] = [];

  const opMap: Record<string, { symbol: string; fn: (a: number, b: number) => [number, number, number] }> = {
    addition: {
      symbol: '+',
      fn: (a, b) => [a, b, a + b],
    },
    subtraction: {
      symbol: '−',
      fn: (a, b) => {
        const big = Math.max(a, b);
        const small = Math.min(a, b);
        return [big, small, big - small];
      },
    },
    multiplication: {
      symbol: '×',
      fn: (a, b) => {
        const a2 = digits > 1 ? randomNumber(Math.max(1, digits - 1)) : a;
        return [a2, b > 12 ? Math.min(b, 12) : b, a2 * (b > 12 ? Math.min(b, 12) : b)];
      },
    },
    division: {
      symbol: '÷',
      fn: (a, b) => {
        const divisor = Math.max(2, Math.min(b, 12));
        const answer = randomNumber(Math.max(1, digits - 1));
        return [answer * divisor, divisor, answer];
      },
    },
  };

  for (let i = 0; i < questionCount; i++) {
    const op = operations[i % operations.length];
    const config = opMap[op] || opMap.addition;
    let num1 = randomNumber(digits);
    let num2 = randomNumber(digits);
    const [finalNum1, finalNum2, answer] = config.fn(num1, num2);

    questions.push({
      num1: finalNum1,
      num2: finalNum2,
      operation: op,
      operationSymbol: config.symbol,
      answer,
    });
  }

  const opNames = Array.from(new Set(operations)).join(' & ');
  const title = `${opNames.charAt(0).toUpperCase() + opNames.slice(1)} Worksheet (${digits}-digit)`;

  return { title, questions };
}
