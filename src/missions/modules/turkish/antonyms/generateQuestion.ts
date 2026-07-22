import type { AntonymsQuestion, QuestionOption } from '@/missions/modules/types'
import type { Difficulty } from '@/missions/types/mission.types'

interface AntonymEntry {
  pair: [string, string]
  minDifficulty: Difficulty
}

const ANTONYM_ENTRIES: AntonymEntry[] = [
  // Difficulty 1 — somut, günlük hayat
  { pair: ['Büyük', 'Küçük'], minDifficulty: 1 },
  { pair: ['Hızlı', 'Yavaş'], minDifficulty: 1 },
  { pair: ['Sıcak', 'Soğuk'], minDifficulty: 1 },
  { pair: ['Gece', 'Gündüz'], minDifficulty: 1 },
  { pair: ['Açık', 'Kapalı'], minDifficulty: 1 },
  { pair: ['Uzun', 'Kısa'], minDifficulty: 1 },
  { pair: ['Kalın', 'İnce'], minDifficulty: 1 },
  { pair: ['Ağır', 'Hafif'], minDifficulty: 1 },
  { pair: ['Yeni', 'Eski'], minDifficulty: 1 },
  { pair: ['Temiz', 'Kirli'], minDifficulty: 1 },
  { pair: ['Mutlu', 'Üzgün'], minDifficulty: 1 },
  { pair: ['Kolay', 'Zor'], minDifficulty: 1 },
  { pair: ['Dolu', 'Boş'], minDifficulty: 1 },
  { pair: ['İyi', 'Kötü'], minDifficulty: 1 },
  { pair: ['Güçlü', 'Zayıf'], minDifficulty: 1 },
  { pair: ['Tatlı', 'Acı'], minDifficulty: 1 },
  { pair: ['Aydınlık', 'Karanlık'], minDifficulty: 1 },
  { pair: ['Yukarı', 'Aşağı'], minDifficulty: 1 },
  { pair: ['Sağ', 'Sol'], minDifficulty: 1 },
  { pair: ['İçeri', 'Dışarı'], minDifficulty: 1 },
  { pair: ['Sert', 'Yumuşak'], minDifficulty: 1 },
  // Difficulty 2 — biraz daha soyut veya az bilinen
  { pair: ['Erken', 'Geç'], minDifficulty: 2 },
  { pair: ['Genç', 'Yaşlı'], minDifficulty: 2 },
  { pair: ['Gürültülü', 'Sessiz'], minDifficulty: 2 },
  { pair: ['İleri', 'Geri'], minDifficulty: 2 },
  { pair: ['Önce', 'Sonra'], minDifficulty: 2 },
  { pair: ['Doğru', 'Yanlış'], minDifficulty: 2 },
  { pair: ['Almak', 'Vermek'], minDifficulty: 2 },
  { pair: ['Başlamak', 'Bitirmek'], minDifficulty: 2 },
  { pair: ['Çalışkan', 'Tembel'], minDifficulty: 2 },
  { pair: ['Zengin', 'Fakir'], minDifficulty: 2 },
  { pair: ['Yaz', 'Kış'], minDifficulty: 2 },
  { pair: ['Uyumak', 'Uyanmak'], minDifficulty: 2 },
  { pair: ['Girmek', 'Çıkmak'], minDifficulty: 2 },
  // Difficulty 3 — daha soyut veya özel kavramlar
  { pair: ['Doğal', 'Yapay'], minDifficulty: 3 },
  { pair: ['Güvenli', 'Tehlikeli'], minDifficulty: 3 },
  { pair: ['Parlak', 'Sönük'], minDifficulty: 3 },
  { pair: ['Yerli', 'Yabancı'], minDifficulty: 3 },
  { pair: ['Düzgün', 'Dağınık'], minDifficulty: 3 },
  { pair: ['Sabırlı', 'Sabırsız'], minDifficulty: 3 },
  { pair: ['Gerçek', 'Sahte'], minDifficulty: 3 },
]

const ANTONYM_PAIRS: [string, string][] = ANTONYM_ENTRIES.map((e) => e.pair)

function pairsForDifficulty(difficulty: Difficulty): [string, string][] {
  return ANTONYM_ENTRIES.filter((e) => e.minDifficulty <= difficulty).map((e) => e.pair)
}

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function pickDistractors(correctWord: string, promptWord: string): string[] {
  const pool = ANTONYM_PAIRS.flatMap(([a, b]) => [a, b]).filter(
    (word) => word !== correctWord && word !== promptWord,
  )
  return shuffle(pool).slice(0, 2)
}

export function generateAntonymsQuestion(difficulty: Difficulty = 1): AntonymsQuestion {
  const pool = pairsForDifficulty(difficulty)
  const pairIndex = Math.floor(Math.random() * pool.length)
  const [wordA, wordB] = pool[pairIndex]
  const askFirst = Math.random() > 0.5

  const promptWord = askFirst ? wordA : wordB
  const correctWord = askFirst ? wordB : wordA
  const distractors = pickDistractors(correctWord, promptWord)
  const labels = shuffle([correctWord, ...distractors])
  const correctIndex = labels.indexOf(correctWord)

  const options: QuestionOption[] = labels.map((label, index) => ({
    value: index,
    label,
  }))

  return {
    promptWord,
    correctWord,
    correctAnswer: correctIndex,
    options,
  }
}

export function generateAntonymsMatchRound(difficulty: Difficulty = 1): {
  pairs: [string, string][]
} {
  const pool = pairsForDifficulty(difficulty)
  const shuffled = shuffle(pool)
  return { pairs: shuffled.slice(0, 3) as [string, string][] }
}

export function generateAntonymsMatchSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): { pairs: [string, string][] }[] {
  const rounds: { pairs: [string, string][] }[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (rounds.length < count && attempts < count * 50) {
    const round = generateAntonymsMatchRound(difficulty)
    const key = getAntonymsMatchRoundKey(round)
    if (!used.has(key)) {
      used.add(key)
      rounds.push(round)
    }
    attempts += 1
  }

  while (rounds.length < count) {
    rounds.push(generateAntonymsMatchRound(difficulty))
  }

  return shuffle(rounds)
}

export function getAntonymsMatchRoundKey(round: { pairs: [string, string][] }): string {
  return round.pairs.map(([a, b]) => `${a}-${b}`).join('|')
}
