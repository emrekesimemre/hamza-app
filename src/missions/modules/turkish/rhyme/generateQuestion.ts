import type { Difficulty } from '@/missions/types/mission.types'
import type { RhymeQuestion, QuestionOption } from '@/missions/modules/types'
import { shuffle } from '@/missions/modules/math/mathUtils'

interface RhymeGroup {
  words: string[]
  maxSyllables: number
}

const RHYME_GROUPS: RhymeGroup[] = [
  // 1 heceli — Difficulty 1
  { words: ['bal', 'dal', 'sal'], maxSyllables: 1 },
  { words: ['baş', 'taş', 'kaş'], maxSyllables: 1 },
  { words: ['ev', 'dev', 'sev'], maxSyllables: 1 },
  { words: ['göz', 'söz', 'boz'], maxSyllables: 1 },
  { words: ['nar', 'var', 'kar'], maxSyllables: 1 },
  { words: ['ben', 'sen', 'ten'], maxSyllables: 1 },
  { words: ['el', 'gel', 'sel'], maxSyllables: 1 },
  { words: ['at', 'sat', 'bat'], maxSyllables: 1 },
  { words: ['yol', 'kol', 'sol'], maxSyllables: 1 },
  { words: ['kuş', 'tuş', 'duş'], maxSyllables: 1 },
  { words: ['gül', 'kül', 'tül'], maxSyllables: 1 },
  { words: ['aç', 'saç', 'kaç'], maxSyllables: 1 },
  { words: ['ok', 'tok', 'çok'], maxSyllables: 1 },
  { words: ['ip', 'dip', 'tip'], maxSyllables: 1 },
  { words: ['bağ', 'dağ', 'sağ'], maxSyllables: 1 },
  { words: ['gür', 'tür', 'sür'], maxSyllables: 1 },
  { words: ['tay', 'hay', 'ray'], maxSyllables: 1 },
  { words: ['don', 'son', 'ton'], maxSyllables: 1 },
  // 2 heceli — Difficulty 2
  { words: ['kedi', 'dedi', 'hadi'], maxSyllables: 2 },
  { words: ['masa', 'kasa', 'yasa'], maxSyllables: 2 },
  { words: ['anne', 'dene', 'gene'], maxSyllables: 2 },
  { words: ['baba', 'kaba', 'aba'], maxSyllables: 2 },
  { words: ['arı', 'sarı', 'darı'], maxSyllables: 2 },
  { words: ['kaya', 'maya', 'daya'], maxSyllables: 2 },
  { words: ['çiçek', 'böcek', 'dilek'], maxSyllables: 2 },
  { words: ['köpek', 'ipek', 'yürek'], maxSyllables: 2 },
  { words: ['okul', 'bul', 'pul'], maxSyllables: 2 },
  { words: ['yılan', 'alan', 'kalan'], maxSyllables: 2 },
  { words: ['elma', 'dalma', 'salma'], maxSyllables: 2 },
  { words: ['kalem', 'badem', 'alem'], maxSyllables: 2 },
]

function groupsForDifficulty(difficulty: Difficulty): RhymeGroup[] {
  if (difficulty >= 2) return RHYME_GROUPS
  return RHYME_GROUPS.filter((g) => g.maxSyllables === 1)
}

export function generateRhymeQuestion(difficulty: Difficulty = 1): RhymeQuestion {
  const pool = groupsForDifficulty(difficulty)
  const group = pool[Math.floor(Math.random() * pool.length)]

  const promptIndex = Math.floor(Math.random() * group.words.length)
  const promptWord = group.words[promptIndex]

  const rhymeCandidates = group.words.filter((_, i) => i !== promptIndex)
  const correctWord = rhymeCandidates[Math.floor(Math.random() * rhymeCandidates.length)]

  const otherWords = RHYME_GROUPS.flatMap((g) => g.words).filter(
    (w) => !group.words.includes(w),
  )
  const distractors = shuffle(otherWords)
    .filter((word) => word !== promptWord && word !== correctWord)
    .slice(0, 2)

  const choices = shuffle([correctWord, ...distractors])
  const correctAnswer = choices.indexOf(correctWord)

  const options: QuestionOption[] = choices.map((word, i) => ({
    value: i,
    label: word,
  }))

  return {
    promptWord,
    correctAnswer,
    options,
  }
}

export function generateRhymeSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): RhymeQuestion[] {
  const questions: RhymeQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (questions.length < count && attempts < count * 50) {
    const q = generateRhymeQuestion(difficulty)
    const key = getRhymeQuestionKey(q)
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generateRhymeQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getRhymeQuestionKey(q: RhymeQuestion): string {
  const answer = q.options[q.correctAnswer]?.label ?? ''
  return `${q.promptWord}:${answer}`
}

export function isValidRhymeQuestion(question: RhymeQuestion): boolean {
  const correctLabel = question.options[question.correctAnswer]?.label
  return (
    correctLabel !== undefined &&
    correctLabel !== question.promptWord &&
    !question.options.some(
      (opt, i) => i !== question.correctAnswer && opt.label === question.promptWord,
    )
  )
}
