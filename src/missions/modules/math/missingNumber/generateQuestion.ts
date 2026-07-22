import type { Difficulty } from '@/missions/types/mission.types'
import type { MissingNumberQuestion } from '@/missions/modules/types'
import { buildNumericOptions, randomInt, shuffle } from '@/missions/modules/math/mathUtils'

type Op = 'add' | 'sub' | 'mul'

function buildQuestion(
  op: Op,
  difficulty: Difficulty,
): MissingNumberQuestion {
  if (op === 'mul') {
    const table = randomInt(2, difficulty >= 2 ? 3 : 3)
    const factor = randomInt(3, difficulty >= 3 ? 10 : difficulty >= 2 ? 8 : 6)
    const product = table * factor
    const hideLeft = Math.random() > 0.5
    return {
      prompt: hideLeft ? `? × ${factor} = ${product}` : `${table} × ? = ${product}`,
      correctAnswer: hideLeft ? table : factor,
      options: buildNumericOptions(hideLeft ? table : factor),
    }
  }

  if (op === 'sub') {
    const minuend = randomInt(difficulty >= 2 ? 35 : 20, difficulty >= 3 ? 99 : 80)
    const subtrahend = randomInt(5, Math.min(40, minuend - 8))
    const diff = minuend - subtrahend
    const hideMinuend = difficulty >= 2 && Math.random() > 0.55
    if (hideMinuend) {
      return {
        prompt: `? − ${subtrahend} = ${diff}`,
        correctAnswer: minuend,
        options: buildNumericOptions(minuend),
      }
    }
    return {
      prompt: `${minuend} − ? = ${diff}`,
      correctAnswer: subtrahend,
      options: buildNumericOptions(subtrahend),
    }
  }

  const augend = randomInt(difficulty >= 2 ? 15 : 10, difficulty >= 3 ? 65 : 45)
  const addend = randomInt(8, difficulty >= 3 ? 35 : 25)
  const sum = augend + addend
  const hideAugend = Math.random() > 0.45
  return {
    prompt: hideAugend ? `? + ${addend} = ${sum}` : `${augend} + ? = ${sum}`,
    correctAnswer: hideAugend ? augend : addend,
    options: buildNumericOptions(hideAugend ? augend : addend),
  }
}

export function generateMissingNumberQuestion(difficulty: Difficulty = 1): MissingNumberQuestion {
  const ops: Op[] =
    difficulty >= 3 ? ['add', 'sub', 'mul'] : difficulty >= 2 ? ['add', 'sub'] : ['add', 'add', 'sub']
  const op = ops[randomInt(0, ops.length - 1)]
  return buildQuestion(op, difficulty)
}

export function generateMissingNumberSession(
  count: number,
  difficulty: Difficulty = 1,
): MissingNumberQuestion[] {
  const questions: MissingNumberQuestion[] = []
  const used = new Set<string>()
  let attempts = 0
  while (questions.length < count && attempts < count * 40) {
    const q = generateMissingNumberQuestion(difficulty)
    if (!used.has(q.prompt)) {
      used.add(q.prompt)
      questions.push(q)
    }
    attempts += 1
  }
  return shuffle(questions)
}

export function getMissingNumberQuestionKey(q: MissingNumberQuestion): string {
  return q.prompt
}
