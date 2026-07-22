import type { Difficulty } from '@/missions/types/mission.types'

export type WordPairMode = 'synonym' | 'homophone'

export interface SynonymPair {
  word: string
  match: string
}

/** Aynı sesli kelimenin iki farklı anlamı — çocuklar tam cümleyle eşleştirir. */
export interface HomophonePair {
  /** Ortak ses (eşleştirme anahtarı) */
  word: string
  sentenceA: string
  sentenceB: string
  emojiA: string
  emojiB: string
  /** Kısa anlam etiketi (UI ipucu) */
  meaningA: string
  meaningB: string
}

export interface WordPairRound {
  mode: WordPairMode
  synonymPairs?: [string, string][]
  homophonePairs?: HomophonePair[]
}

/** 1. sınıf için net, günlük eş anlamlı çiftler */
const SYNONYM_PAIRS: [string, string][] = [
  ['Mutlu', 'Sevinçli'],
  ['Hızlı', 'Çabuk'],
  ['Güzel', 'Hoş'],
  ['Büyük', 'Kocaman'],
  ['Küçük', 'Minik'],
  ['Akıllı', 'Zeki'],
  ['Cesur', 'Yiğit'],
  ['Bitirmek', 'Tamamlamak'],
  ['Söylemek', 'Anlatmak'],
  ['Yardım', 'Destek'],
  ['Ev', 'Yuva'],
  ['Yeni', 'Taze'],
  ['Sevmek', 'Beğenmek'],
  ['Kolay', 'Basit'],
  ['Sevinmek', 'Neşelenmek'],
  ['Yorgun', 'Bitkin'],
  ['Temiz', 'Pak'],
  ['Sessiz', 'Sakin'],
  ['Kötü', 'Fena'],
  ['Tok', 'Doymuş'],
  ['Arkadaş', 'Dost'],
  ['Anne', 'Ana'],
  ['Öğretmen', 'Hoca'],
  ['Gülümsemek', 'Sevinmek'],
  ['Konuşmak', 'Söylemek'],
  ['Bakmak', 'Seyretmek'],
  ['Çalışmak', 'Uğraşmak'],
  ['Sevinç', 'Neşe'],
  ['Karışık', 'Dağınık'],
  ['Haber', 'Bilgi'],
  ['Korku', 'Ürküntü'],
  ['Yalan', 'Uydurma'],
  ['Güzel', 'Şahane'],
  ['İstirahat', 'Dinlenme'],
  ['Hediye', 'Armağan'],
]

/**
 * Gerçek eş sesliler — her çiftte kelime aynı duyulur, anlam cümleden anlaşılır.
 */
const HOMOPHONE_PAIRS: HomophonePair[] = [
  {
    word: 'yüz',
    sentenceA: 'Yüz lira biriktirdim',
    sentenceB: 'Yüzünü yıkadın mı?',
    emojiA: '🔢',
    emojiB: '😊',
    meaningA: 'sayı (100)',
    meaningB: 'yüz (organ)',
  },
  {
    word: 'ay',
    sentenceA: 'Mart ayı başladı',
    sentenceB: 'Gece ay parlıyor',
    emojiA: '📅',
    emojiB: '🌙',
    meaningA: 'takvim ayı',
    meaningB: 'gökteki ay',
  },
  {
    word: 'yaz',
    sentenceA: 'Yaz mevsimi sıcak',
    sentenceB: 'Deftere adını yaz',
    emojiA: '☀️',
    emojiB: '✏️',
    meaningA: 'mevsim',
    meaningB: 'yazmak',
  },
  {
    word: 'gül',
    sentenceA: 'Bahçede kırmızı gül var',
    sentenceB: 'Arkadaşına güldü',
    emojiA: '🌹',
    emojiB: '😄',
    meaningA: 'çiçek',
    meaningB: 'gülmek',
  },
  {
    word: 'aç',
    sentenceA: 'Kapıyı aç lütfen',
    sentenceB: 'Karnım çok aç',
    emojiA: '🚪',
    emojiB: '🍽️',
    meaningA: 'açmak',
    meaningB: 'açlık',
  },
  {
    word: 'dolu',
    sentenceA: 'Bardak suyla dolu',
    sentenceB: 'Dışarı dolu yağıyor',
    emojiA: '🥛',
    emojiB: '🌧️',
    meaningA: 'içi dolu',
    meaningB: 'dolu (yağış)',
  },
  {
    word: 'in',
    sentenceA: 'Merdivenden aşağı in',
    sentenceB: 'Mağaraya inelim',
    emojiA: '⬇️',
    emojiB: '🕳️',
    meaningA: 'aşağı inmek',
    meaningB: 'içeri girmek',
  },
  {
    word: 'dal',
    sentenceA: 'Ağacın dalı kırıldı',
    sentenceB: 'Denize dalıverdi',
    emojiA: '🌳',
    emojiB: '🏊',
    meaningA: 'ağaç dalı',
    meaningB: 'dalış yapmak',
  },
  {
    word: 'bin',
    sentenceA: 'Otobüse bindik',
    sentenceB: 'Bin tane yıldız',
    emojiA: '🚌',
    emojiB: '⭐',
    meaningA: 'binmek',
    meaningB: 'sayı (1000)',
  },
  {
    word: 'kar',
    sentenceA: 'Dışarı kar yağıyor',
    sentenceB: 'Bu iş kar etti',
    emojiA: '❄️',
    emojiB: '💰',
    meaningA: 'kar (yağış)',
    meaningB: 'kar (kazanç)',
  },
  {
    word: 'kır',
    sentenceA: 'Bardak kırıldı',
    sentenceB: 'Kırda piknik yaptık',
    emojiA: '💥',
    emojiB: '🌾',
    meaningA: 'kırmak',
    meaningB: 'kır (köy)',
  },
  {
    word: 'kaz',
    sentenceA: 'Gölde kaz yüzüyor',
    sentenceB: 'Bahçeyi kazdı',
    emojiA: '🦆',
    emojiB: '⛏️',
    meaningA: 'kaz (kuş)',
    meaningB: 'kazmak',
  },
  {
    word: 'saç',
    sentenceA: 'Saçlarını taradı',
    sentenceB: 'Tohumları tarlaya saçtı',
    emojiA: '💇',
    emojiB: '🌱',
    meaningA: 'saç (kıl)',
    meaningB: 'saçmak',
  },
  {
    word: 'al',
    sentenceA: 'Marketten elma al',
    sentenceB: 'Al renkli balon',
    emojiA: '🛒',
    emojiB: '🔴',
    meaningA: 'almak',
    meaningB: 'al (renk)',
  },
  {
    word: 'ocak',
    sentenceA: 'Ocak ayı soğuk',
    sentenceB: 'Annem ocakta yemek yapıyor',
    emojiA: '📅',
    emojiB: '🍳',
    meaningA: 'ocak (ay)',
    meaningB: 'ocak (soba)',
  },
  {
    word: 'çay',
    sentenceA: 'Çay içelim mi?',
    sentenceB: 'Çayda balık tutuyoruz',
    emojiA: '🍵',
    emojiB: '🌊',
    meaningA: 'çay (içecek)',
    meaningB: 'çay (dere)',
  },
  {
    word: 'ton',
    sentenceA: 'Sesin tonu çok güzel',
    sentenceB: 'Kamyon üç ton taşıdı',
    emojiA: '🎵',
    emojiB: '⚖️',
    meaningA: 'ton (ses)',
    meaningB: 'ton (ağırlık)',
  },
  {
    word: 'bol',
    sentenceA: 'Bu pantolon çok bol',
    sentenceB: 'Markette bol elma var',
    emojiA: '👖',
    emojiB: '🍎',
    meaningA: 'bol (geniş)',
    meaningB: 'bol (çok)',
  },
  {
    word: 'kap',
    sentenceA: 'Topu kap!',
    sentenceB: 'Kaba su doldur',
    emojiA: '⚾',
    emojiB: '🫙',
    meaningA: 'kapmak (tutmak)',
    meaningB: 'kap (kase)',
  },
  {
    word: 'pas',
    sentenceA: 'Demir paslandı',
    sentenceB: 'Topu bana pas ver',
    emojiA: '🔴',
    emojiB: '⚽',
    meaningA: 'pas (kir)',
    meaningB: 'pas (top verme)',
  },
]

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function formatHomophoneLabel(pair: HomophonePair, side: 'A' | 'B'): string {
  if (side === 'A') {
    return `${pair.emojiA} ${pair.sentenceA}`
  }
  return `${pair.emojiB} ${pair.sentenceB}`
}

export function getHomophoneRoundHint(pairs: HomophonePair[]): string {
  const words = [...new Set(pairs.map((p) => p.word))]
  return `Bu turda «${words.join('», «')}» kelimeleri aynı sesle farklı anlama geliyor.`
}

function chunkPairs<T>(items: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size))
  }
  return chunks
}

function homophoneRoundCountForSession(count: number, difficulty: Difficulty): number {
  if (count <= 0) return 0
  if (difficulty >= 3) return Math.min(Math.ceil(count * 0.55), Math.floor(HOMOPHONE_PAIRS.length / 3))
  if (difficulty >= 2) return Math.min(Math.ceil(count * 0.45), Math.floor(HOMOPHONE_PAIRS.length / 3))
  return Math.min(Math.max(1, Math.floor(count * 0.35)), Math.floor(HOMOPHONE_PAIRS.length / 3))
}

/** Oturum boyunca aynı çift/kelime tekrar etmez; turlar karışık gelir. */
export function generateSynonymsHomophonesSession(
  count: number,
  difficulty: Difficulty = 1,
): WordPairRound[] {
  const homophoneRounds = homophoneRoundCountForSession(count, difficulty)
  const synonymRounds = count - homophoneRounds

  const synonymPool = shuffle(SYNONYM_PAIRS).slice(0, synonymRounds * 3)
  const homophonePool = shuffle(HOMOPHONE_PAIRS).slice(0, homophoneRounds * 3)

  const rounds: WordPairRound[] = [
    ...chunkPairs(synonymPool, 3).map(
      (pairs): WordPairRound => ({
        mode: 'synonym',
        synonymPairs: pairs as [string, string][],
      }),
    ),
    ...chunkPairs(homophonePool, 3).map(
      (pairs): WordPairRound => ({
        mode: 'homophone',
        homophonePairs: pairs,
      }),
    ),
  ]

  return shuffle(rounds)
}

export function generateSynonymsHomophonesRound(difficulty: Difficulty = 1): WordPairRound {
  const useHomophone =
    difficulty >= 2 ? Math.random() > 0.4 : difficulty >= 1 && Math.random() > 0.55

  if (useHomophone) {
    const shuffled = shuffle(HOMOPHONE_PAIRS)
    return {
      mode: 'homophone',
      homophonePairs: shuffled.slice(0, 3),
    }
  }

  const shuffled = shuffle(SYNONYM_PAIRS)
  return {
    mode: 'synonym',
    synonymPairs: shuffled.slice(0, 3) as [string, string][],
  }
}

export { SYNONYM_PAIRS, HOMOPHONE_PAIRS }
