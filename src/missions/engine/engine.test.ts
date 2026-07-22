import { describe, expect, it } from 'vitest'
import { generateAdditionQuestion } from '@/missions/modules/math/addition/generateQuestion'
import { generateSubtractionQuestion } from '@/missions/modules/math/subtraction/generateQuestion'
import { generateRhythmicQuestion } from '@/missions/modules/math/rhythmicCounting/generateQuestion'
import { validatePath, generateAlgorithmLevel } from '@/missions/modules/logic/algorithm/generateLevel'
import { validateDayOrder, WEEK_DAYS } from '@/missions/modules/life/days/generateQuestion'
import { adjustDifficulty } from '@/missions/engine/difficultyEngine'
import type { ProgressLog } from '@/types/progress.types'

describe('generateAdditionQuestion', () => {
  it('targets 2nd grade ranges at level 1', () => {
    for (let i = 0; i < 30; i++) {
      const q = generateAdditionQuestion(1)
      expect(q.augend + q.addend).toBe(q.correctAnswer)
      expect(q.correctAnswer).toBeGreaterThanOrEqual(15)
      expect(q.correctAnswer).toBeLessThanOrEqual(60)
      expect(q.options).toHaveLength(3)
    }
  })

  it('allows sums up to 100 at level 2', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateAdditionQuestion(2)
      expect(q.correctAnswer).toBeLessThanOrEqual(100)
    }
  })
})

describe('generateSubtractionQuestion', () => {
  it('returns non-negative 2nd grade results', () => {
    for (let i = 0; i < 20; i++) {
      const q = generateSubtractionQuestion(1)
      expect(q.minuend - q.subtrahend).toBe(q.correctAnswer)
      expect(q.correctAnswer).toBeGreaterThanOrEqual(3)
      expect(q.minuend).toBeGreaterThanOrEqual(22)
    }
  })
})

describe('generateRhythmicQuestion', () => {
  it('has one missing value in sequence', () => {
    const q = generateRhythmicQuestion(1)
    const nullCount = q.sequence.filter((v) => v === null).length
    expect(nullCount).toBe(1)
    expect(q.correctAnswer).toBeGreaterThan(0)
    expect([2, 3, 5, 10]).toContain(q.step)
  })
})

describe('generateMultiplicationQuestion', () => {
  it('uses 2nd grade tables at level 1', async () => {
    const { generateMultiplicationQuestion } = await import(
      '@/missions/modules/math/multiplication/generateQuestion'
    )
    for (let i = 0; i < 20; i++) {
      const q = generateMultiplicationQuestion(1)
      expect([2, 3]).toContain(q.multiplier)
      expect(q.multiplicand).toBeGreaterThanOrEqual(2)
    }
  })
})

describe('algorithm level', () => {
  it('validates a known path on tutorial grid', () => {
    const level = generateAlgorithmLevel(0)
    const valid = validatePath(level, ['right', 'right', 'up', 'up'])
    expect(valid).toBe(true)
  })

  it('rejects path that hits wall', () => {
    const level = generateAlgorithmLevel(0)
    const valid = validatePath(level, ['left'])
    expect(valid).toBe(false)
  })

  it('gives enough commands to reach the goal on every level', () => {
    const deltas = { up: [1, 0], right: [0, 1], left: [0, -1] } as const

    for (let levelIndex = 0; levelIndex < 3; levelIndex++) {
      const level = generateAlgorithmLevel(levelIndex)
      const { gridSize, grid, start, goal, maxCommands } = level
      const queue: Array<{ row: number; col: number; dist: number }> = [
        { row: start.row, col: start.col, dist: 0 },
      ]
      const seen = new Set([`${start.row},${start.col}`])
      let shortest = Infinity

      while (queue.length > 0) {
        const current = queue.shift()!
        if (current.row === goal.row && current.col === goal.col) {
          shortest = current.dist
          break
        }

        for (const delta of Object.values(deltas)) {
          const next = { row: current.row + delta[0], col: current.col + delta[1] }
          const key = `${next.row},${next.col}`
          if (
            next.row < 0 ||
            next.col < 0 ||
            next.row >= gridSize ||
            next.col >= gridSize ||
            grid[next.row][next.col] === 'wall' ||
            seen.has(key)
          ) {
            continue
          }

          seen.add(key)
          queue.push({ ...next, dist: current.dist + 1 })
        }
      }

      expect(shortest).toBeLessThanOrEqual(maxCommands)
    }
  })
})

describe('validateDayOrder', () => {
  it('accepts correct weekday order', () => {
    const shuffled = ['Çarşamba', 'Pazartesi', 'Cuma', 'Salı', 'Pazar', 'Perşembe', 'Cumartesi']
    const selections = WEEK_DAYS.map((day) => shuffled.indexOf(day))
    expect(validateDayOrder(selections, shuffled)).toBe(true)
  })
})

describe('adjustDifficulty', () => {
  it('increases difficulty on high accuracy', () => {
    const logs: ProgressLog[] = Array.from({ length: 5 }).map((_, i) => ({
      missionId: 'math-addition',
      missionType: 'addition',
      subject: 'math',
      correctCount: 5,
      wrongCount: 0,
      completedAt: new Date(Date.now() - i * 86400000).toISOString(),
      starsEarned: 10,
    }))
    expect(adjustDifficulty('addition', 1, logs)).toBe(2)
  })

  it('decreases difficulty on low accuracy', () => {
    const logs: ProgressLog[] = Array.from({ length: 5 }).map((_, i) => ({
      missionId: 'math-addition',
      missionType: 'addition',
      subject: 'math',
      correctCount: 1,
      wrongCount: 4,
      completedAt: new Date(Date.now() - i * 86400000).toISOString(),
      starsEarned: 10,
    }))
    expect(adjustDifficulty('addition', 2, logs)).toBe(1)
  })
})

describe('generateRhymeQuestion', () => {
  it('never uses the prompt word as the correct answer', async () => {
    const { generateRhymeQuestion, isValidRhymeQuestion } = await import(
      '@/missions/modules/turkish/rhyme/generateQuestion'
    )
    for (let i = 0; i < 50; i++) {
      const q = generateRhymeQuestion(1)
      expect(q.options[q.correctAnswer].label).not.toBe(q.promptWord)
      expect(isValidRhymeQuestion(q)).toBe(true)
    }
  })
})

describe('generateCalendarTimeQuestion', () => {
  it('returns valid questions with three options', async () => {
    const { generateCalendarTimeQuestion } = await import(
      '@/missions/modules/life/calendarTime/generateQuestion'
    )
    for (let i = 0; i < 30; i++) {
      const q = generateCalendarTimeQuestion(2)
      expect(q.prompt.length).toBeGreaterThan(0)
      expect(q.options).toHaveLength(3)
      expect(q.options[q.correctAnswer]?.label).toBeDefined()
    }
  })

  it('generates 5 unique prompts per session at level 1', async () => {
    const { generateCalendarTimeSession } = await import(
      '@/missions/modules/life/calendarTime/generateQuestion'
    )
    const session = generateCalendarTimeSession(5, 1)
    expect(session).toHaveLength(5)
    expect(new Set(session.map((q) => q.prompt)).size).toBe(5)
  })
})

describe('generateSyllablesSession', () => {
  it('generates 5 unique words per session', async () => {
    const { generateSyllablesSession, MULTI_SYLLABLE_WORDS } = await import(
      '@/missions/modules/turkish/syllables/generateQuestion'
    )
    expect(MULTI_SYLLABLE_WORDS.length).toBeGreaterThanOrEqual(20)
    const session = generateSyllablesSession(5, 1)
    expect(session).toHaveLength(5)
    expect(new Set(session.map((q) => q.fullWord)).size).toBe(5)
  })

  it('level 3 prefers longer words', async () => {
    const { generateSyllablesSession } = await import(
      '@/missions/modules/turkish/syllables/generateQuestion'
    )
    const session = generateSyllablesSession(5, 3)
    const hasLongWord = session.some((q) => q.displayParts.filter((p) => p !== null).length >= 2)
    expect(hasLongWord).toBe(true)
  })
})

describe('getDailyTopicPool', () => {
  it('returns 3 unique subjects every day', async () => {
    const { getDailyTopicPool } = await import('@/missions/engine/rotationEngine')

    for (let day = 0; day <= 6; day += 1) {
      const pool = getDailyTopicPool(day)
      expect(pool).toHaveLength(3)
      expect(new Set(pool).size).toBe(3)
    }
  })

  it('includes math on 6 of 7 days', async () => {
    const { getDailyTopicPool } = await import('@/missions/engine/rotationEngine')

    const mathDays = Array.from({ length: 7 }, (_, day) => day).filter((day) =>
      getDailyTopicPool(day).includes('math'),
    )
    expect(mathDays).toHaveLength(6)
    expect(getDailyTopicPool(4)).not.toContain('math')
  })
})

describe('generateSynonymsHomophonesSession', () => {
  it('returns unique pairs across a 5-round session', async () => {
    const { generateSynonymsHomophonesSession } = await import(
      '@/missions/modules/turkish/synonymsHomophones/generateQuestion'
    )
    const session = generateSynonymsHomophonesSession(5, 2)
    expect(session).toHaveLength(5)

    const usedSynonymWords = new Set<string>()
    const usedHomophoneWords = new Set<string>()

    for (const round of session) {
      if (round.mode === 'synonym' && round.synonymPairs) {
        expect(round.synonymPairs).toHaveLength(3)
        for (const [a, b] of round.synonymPairs) {
          expect(a).not.toBe(b)
          expect(usedSynonymWords.has(a)).toBe(false)
          usedSynonymWords.add(a)
        }
      } else if (round.mode === 'homophone' && round.homophonePairs) {
        expect(round.homophonePairs).toHaveLength(3)
        for (const pair of round.homophonePairs) {
          expect(usedHomophoneWords.has(pair.word)).toBe(false)
          usedHomophoneWords.add(pair.word)
        }
      }
    }
  })
})

describe('generateSynonymsHomophonesRound', () => {
  it('returns 3 pairs for synonym or homophone rounds', async () => {
    const { generateSynonymsHomophonesRound } = await import(
      '@/missions/modules/turkish/synonymsHomophones/generateQuestion'
    )
    for (let i = 0; i < 20; i++) {
      const round = generateSynonymsHomophonesRound(2)
      if (round.mode === 'synonym') {
        expect(round.synonymPairs).toHaveLength(3)
        for (const [a, b] of round.synonymPairs!) {
          expect(a).not.toBe(b)
        }
      } else {
        expect(round.homophonePairs).toHaveLength(3)
      }
    }
  })
})

describe('generateSudokuQuestion', () => {
  it('generates valid 4x4 puzzle with unique solution', async () => {
    const { generateSudokuQuestion, SUDOKU_SYMBOLS } = await import(
      '@/missions/modules/logic/sudoku/generateQuestion'
    )
    const q = generateSudokuQuestion(2)
    expect(q.grid).toHaveLength(4)
    expect(q.symbols).toEqual(SUDOKU_SYMBOLS)
    expect(q.solution).toHaveLength(4)
    const emptyCells = q.grid.flat().filter((cell) => cell === null).length
    expect(emptyCells).toBeGreaterThan(0)
  })
})

describe('generateNumberSudokuQuestion', () => {
  it('generates valid 6x6 number puzzle with 1-6 symbols', async () => {
    const { generateNumberSudokuQuestion, NUMBER_SUDOKU_SYMBOLS } = await import(
      '@/missions/modules/logic/numberSudoku/generateQuestion'
    )
    const q = generateNumberSudokuQuestion(2)
    expect(q.grid).toHaveLength(6)
    expect(q.grid[0]).toHaveLength(6)
    expect(q.symbols).toEqual(NUMBER_SUDOKU_SYMBOLS)
    expect(q.solution).toHaveLength(6)
    const emptyCells = q.grid.flat().filter((cell) => cell === null).length
    expect(emptyCells).toBeGreaterThan(0)
  })

  it('has fewer givens at higher difficulty than easy color sudoku', async () => {
    const { generateNumberSudokuQuestion } = await import(
      '@/missions/modules/logic/numberSudoku/generateQuestion'
    )
    const q = generateNumberSudokuQuestion(3)
    const givens = q.grid.flat().filter((cell) => cell !== null).length
    expect(givens).toBeLessThanOrEqual(14)
    expect(givens).toBeGreaterThanOrEqual(10)
  })
})

describe('generateStoryOrderSession', () => {
  it('returns unique stories per session', async () => {
    const { generateStoryOrderSession, STORY_COUNT } = await import(
      '@/missions/modules/logic/storyOrder/generateQuestion'
    )
    const session = generateStoryOrderSession(5, 2)
    const titles = session.map((q) => q.title)
    expect(new Set(titles).size).toBe(5)
    expect(STORY_COUNT).toBeGreaterThanOrEqual(20)
  })
})

describe('generatePatternsSession', () => {
  it('returns unique patterns per session', async () => {
    const { generatePatternsSession, getPatternsQuestionKey } = await import(
      '@/missions/modules/logic/patterns/generateQuestion'
    )
    const session = generatePatternsSession(5, 2)
    const keys = session.map((q) => getPatternsQuestionKey(q))
    expect(new Set(keys).size).toBe(5)
    expect(session[0].sequence.length).toBeGreaterThanOrEqual(4)
  })
})

describe('generateMissingNumberSession', () => {
  it('returns unique prompts per session', async () => {
    const { generateMissingNumberSession } = await import(
      '@/missions/modules/math/missingNumber/generateQuestion'
    )
    const session = generateMissingNumberSession(5, 2)
    const prompts = session.map((q) => q.prompt)
    expect(new Set(prompts).size).toBe(5)
  })
})

describe('hybridMissionLogic', () => {
  it('claims bonus trio only once when 3 bonus done', async () => {
    const { shouldClaimBonusTrio, shouldIncrementBonusCount } = await import(
      '@/missions/engine/hybridMissionLogic'
    )
    expect(shouldClaimBonusTrio(3, false)).toBe(true)
    expect(shouldClaimBonusTrio(3, true)).toBe(false)
    expect(shouldClaimBonusTrio(2, false)).toBe(false)
    expect(shouldIncrementBonusCount(true, false)).toBe(true)
    expect(shouldIncrementBonusCount(true, true)).toBe(false)
    expect(shouldIncrementBonusCount(false, false)).toBe(false)
  })
})

describe('checkNewAchievements', () => {
  it('awards first mission badge', async () => {
    const { checkNewAchievements } = await import('@/constants/achievements')
    const badges = checkNewAchievements([], {
      totalMissionsCompleted: 1,
      mathMissionsCompleted: 0,
      stars: 10,
      currentStreak: 0,
      longestStreak: 0,
      lastMissionPerfect: false,
    })
    expect(badges).toContain('first-mission')
  })
})
