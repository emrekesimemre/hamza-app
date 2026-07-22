import type { SyllablesQuestion, QuestionOption } from '@/missions/modules/types'
import type { Difficulty } from '@/missions/types/mission.types'

interface WordEntry {
  word: string
  syllables: string[]
}

const WORD_POOL: WordEntry[] = [
  // 2 hece — seviye 1
  { word: 'ANNE', syllables: ['AN', 'NE'] },
  { word: 'BABA', syllables: ['BA', 'BA'] },
  { word: 'MASA', syllables: ['MA', 'SA'] },
  { word: 'KEDİ', syllables: ['KE', 'Dİ'] },
  { word: 'KAPI', syllables: ['KA', 'PI'] },
  { word: 'ELMA', syllables: ['EL', 'MA'] },
  { word: 'ARMUT', syllables: ['AR', 'MUT'] },
  { word: 'KALEM', syllables: ['KA', 'LEM'] },
  { word: 'KİTAP', syllables: ['Kİ', 'TAP'] },
  { word: 'BALIK', syllables: ['BA', 'LIK'] },
  { word: 'OKUL', syllables: ['O', 'KUL'] },
  { word: 'GÜNEŞ', syllables: ['GÜ', 'NEŞ'] },
  { word: 'YILDIZ', syllables: ['YIL', 'DIZ'] },
  { word: 'ÇİÇEK', syllables: ['Çİ', 'ÇEK'] },
  { word: 'KUZU', syllables: ['KU', 'ZU'] },
  { word: 'KÖPEK', syllables: ['KÖ', 'PEK'] },
  { word: 'DENİZ', syllables: ['DE', 'NİZ'] },
  { word: 'ORMAN', syllables: ['OR', 'MAN'] },
  { word: 'KARPUZ', syllables: ['KAR', 'PUZ'] },
  { word: 'BALON', syllables: ['BA', 'LON'] },
  { word: 'KARDEŞ', syllables: ['KAR', 'DEŞ'] },
  { word: 'TAVŞAN', syllables: ['TAV', 'ŞAN'] },
  { word: 'TAVUK', syllables: ['TA', 'VUK'] },
  { word: 'KAPLAN', syllables: ['KAP', 'LAN'] },
  { word: 'MÜZİK', syllables: ['MÜ', 'ZİK'] },
  { word: 'KAHVE', syllables: ['KAH', 'VE'] },
  { word: 'EKMEK', syllables: ['EK', 'MEK'] },
  { word: 'PEYNİR', syllables: ['PEY', 'NİR'] },
  { word: 'ZEBRA', syllables: ['ZEB', 'RA'] },
  { word: 'ASLAN', syllables: ['AS', 'LAN'] },
  { word: 'KOYUN', syllables: ['KO', 'YUN'] },
  { word: 'HAVUZ', syllables: ['HA', 'VUZ'] },
  { word: 'BULUT', syllables: ['BU', 'LUT'] },
  { word: 'YAĞMUR', syllables: ['YAĞ', 'MUR'] },
  { word: 'RÜZGAR', syllables: ['RÜZ', 'GAR'] },
  { word: 'BURUN', syllables: ['BU', 'RUN'] },
  { word: 'AYAK', syllables: ['A', 'YAK'] },
  { word: 'KİRAZ', syllables: ['Kİ', 'RAZ'] },
  { word: 'ÇİLEK', syllables: ['Çİ', 'LEK'] },
  { word: 'ÇOCUK', syllables: ['ÇO', 'CUK'] },
  { word: 'CÜZDAN', syllables: ['CÜZ', 'DAN'] },
  { word: 'KOLTUK', syllables: ['KOL', 'TUK'] },
  { word: 'DOLAP', syllables: ['DO', 'LAP'] },
  { word: 'AYRAN', syllables: ['AY', 'RAN'] },
  { word: 'DUMAN', syllables: ['DU', 'MAN'] },
  { word: 'BOYUN', syllables: ['BO', 'YUN'] },
  { word: 'TAVAN', syllables: ['TA', 'VAN'] },
  { word: 'ZAMAN', syllables: ['ZA', 'MAN'] },
  { word: 'KAVUN', syllables: ['KA', 'VUN'] },
  { word: 'LIMON', syllables: ['Lİ', 'MON'] },
  { word: 'MAYOZ', syllables: ['MA', 'YOZ'] },
  { word: 'BEBEK', syllables: ['BE', 'BEK'] },
  { word: 'GEMİ', syllables: ['GE', 'Mİ'] },
  { word: 'KEMAN', syllables: ['KE', 'MAN'] },
  { word: 'TÜNEL', syllables: ['TÜ', 'NEL'] },
  { word: 'YUMAK', syllables: ['YU', 'MAK'] },
  { word: 'ÇANTA', syllables: ['ÇAN', 'TA'] },
  { word: 'DEMIR', syllables: ['DE', 'MİR'] },

  // 3 hece — seviye 2
  { word: 'OTOBÜS', syllables: ['O', 'TO', 'BÜS'] },
  { word: 'PATATES', syllables: ['PA', 'TA', 'TES'] },
  { word: 'DOMATES', syllables: ['DO', 'MA', 'TES'] },
  { word: 'TELEFON', syllables: ['TE', 'LE', 'FON'] },
  { word: 'ARKADAŞ', syllables: ['AR', 'KA', 'DAŞ'] },
  { word: 'ÖĞRETMEN', syllables: ['ÖĞ', 'RET', 'MEN'] },
  { word: 'KAHVALTI', syllables: ['KAH', 'VAL', 'TI'] },
  { word: 'HEYECAN', syllables: ['HE', 'YE', 'CAN'] },
  { word: 'KARINCA', syllables: ['KA', 'RIN', 'CA'] },
  { word: 'KELEBEK', syllables: ['KE', 'LE', 'BEK'] },
  { word: 'PAPATYA', syllables: ['PA', 'PAT', 'YA'] },
  { word: 'PORTAKAL', syllables: ['POR', 'TA', 'KAL'] },
  { word: 'BİSİKLET', syllables: ['Bİ', 'SİK', 'LET'] },
  { word: 'KALEMLİK', syllables: ['KA', 'LEM', 'LİK'] },
  { word: 'SANDALYE', syllables: ['SAN', 'DAL', 'YE'] },
  { word: 'PENCERE', syllables: ['PEN', 'CE', 'RE'] },
  { word: 'KOMPUTER', syllables: ['KOM', 'PU', 'TER'] },
  { word: 'PENGUEN', syllables: ['PEN', 'GU', 'EN'] },
  { word: 'ANANAS', syllables: ['A', 'NA', 'NAS'] },
  { word: 'KAVŞAK', syllables: ['KAV', 'ŞAK'] },
  { word: 'YÜZMEK', syllables: ['YÜZ', 'MEK'] },
  { word: 'KOŞMAK', syllables: ['KOŞ', 'MAK'] },
  { word: 'GÖZLÜK', syllables: ['GÖZ', 'LÜK'] },
  { word: 'BOYAMA', syllables: ['BO', 'YA', 'MA'] },
  { word: 'HAVUÇ', syllables: ['HA', 'VUÇ'] },
  { word: 'MAYMUN', syllables: ['MAY', 'MUN'] },
  { word: 'KIRPIK', syllables: ['KIR', 'PIK'] },
  { word: 'ŞEKİL', syllables: ['ŞE', 'KİL'] },

  // 4 hece — seviye 3
  { word: 'BİLGİSAYAR', syllables: ['BİL', 'Gİ', 'SA', 'YAR'] },
  { word: 'KÜTÜPHANE', syllables: ['KÜ', 'TÜP', 'HA', 'NE'] },
  { word: 'KARANFİL', syllables: ['KA', 'RAN', 'FİL'] },
  { word: 'FUTBOLCU', syllables: ['FUT', 'BOL', 'CU'] },
  { word: 'MANDALİNA', syllables: ['MAN', 'DA', 'Lİ', 'NA'] },
  { word: 'HELİKOPTER', syllables: ['HE', 'Lİ', 'KOP', 'TER'] },
  { word: 'TELESKOP', syllables: ['TE', 'LES', 'KOP'] },
  { word: 'KARDEŞLİK', syllables: ['KAR', 'DEŞ', 'LİK'] },
  { word: 'UÇURTMA', syllables: ['U', 'ÇURT', 'MA'] },
  { word: 'ÇORAP', syllables: ['ÇO', 'RAP'] },
]

const MULTI_SYLLABLE_WORDS = WORD_POOL.filter((w) => w.syllables.length >= 2)

const ALL_SYLLABLES = [...new Set(MULTI_SYLLABLE_WORDS.flatMap((w) => w.syllables))]

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function wordsForDifficulty(difficulty: Difficulty): WordEntry[] {
  if (difficulty >= 3) {
    return MULTI_SYLLABLE_WORDS.filter((w) => w.syllables.length >= 3)
  }
  if (difficulty >= 2) {
    return MULTI_SYLLABLE_WORDS.filter((w) => w.syllables.length >= 2)
  }
  return MULTI_SYLLABLE_WORDS.filter((w) => w.syllables.length === 2)
}

function pickDistractors(correctSyllable: string, entry: WordEntry): string[] {
  const fromSameWord = new Set(entry.syllables)
  const candidates = ALL_SYLLABLES.filter(
    (s) => s !== correctSyllable && !fromSameWord.has(s),
  )
  const fallback = ALL_SYLLABLES.filter((s) => s !== correctSyllable)
  const pool = candidates.length >= 2 ? candidates : fallback

  return shuffle(pool).slice(0, 2)
}

function buildQuestionFromEntry(entry: WordEntry): SyllablesQuestion {
  const hiddenIndex = Math.floor(Math.random() * entry.syllables.length)
  const correctSyllable = entry.syllables[hiddenIndex]

  const displayParts: (string | null)[] = entry.syllables.map((s, i) =>
    i === hiddenIndex ? null : s,
  )

  const distractors = pickDistractors(correctSyllable, entry)
  const labels = shuffle([correctSyllable, ...distractors])
  const correctIndex = labels.indexOf(correctSyllable)

  const options: QuestionOption[] = labels.map((label, index) => ({
    value: index,
    label,
  }))

  return {
    fullWord: entry.word,
    displayParts,
    correctAnswer: correctIndex,
    options,
  }
}

export function generateSyllablesQuestion(difficulty: Difficulty = 1): SyllablesQuestion {
  const pool = wordsForDifficulty(difficulty)
  const entry = pool[Math.floor(Math.random() * pool.length)]
  return buildQuestionFromEntry(entry)
}

export function generateSyllablesSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeWords: string[] = [],
): SyllablesQuestion[] {
  const pool = shuffle(wordsForDifficulty(difficulty).filter((w) => !excludeWords.includes(w.word)))
  const questions: SyllablesQuestion[] = []

  for (const entry of pool) {
    if (questions.length >= count) break
    questions.push(buildQuestionFromEntry(entry))
  }

  let attempts = 0
  const used = new Set([...excludeWords, ...questions.map((q) => q.fullWord)])
  while (questions.length < count && attempts < 30) {
    const q = generateSyllablesQuestion(difficulty)
    if (!used.has(q.fullWord)) {
      questions.push(q)
      used.add(q.fullWord)
    }
    attempts += 1
  }

  return questions
}

export { WORD_POOL, MULTI_SYLLABLE_WORDS }
