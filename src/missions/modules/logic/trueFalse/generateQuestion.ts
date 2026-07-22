import type { Difficulty } from '@/missions/types/mission.types'
import type { TrueFalseQuestion } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

const FACTS: { statement: string; emoji: string; isTrue: boolean }[] = [
  // Doğa ve bilim
  { statement: 'Balinalar uçabilir.', emoji: '🐋', isTrue: false },
  { statement: 'Güneş doğudan doğar.', emoji: '🌅', isTrue: true },
  { statement: 'Kediler kanatlıdır.', emoji: '🐱', isTrue: false },
  { statement: 'Buz ısındığında erir.', emoji: '🧊', isTrue: true },
  { statement: 'Balıklar karada nefes alır.', emoji: '🐟', isTrue: false },
  { statement: 'Bitkiler büyümek için suya ihtiyaç duyar.', emoji: '🌱', isTrue: true },
  { statement: 'Ay her gece tam dolunay olur.', emoji: '🌙', isTrue: false },
  { statement: 'Arılar bal yapar.', emoji: '🐝', isTrue: true },
  { statement: 'Penguenler kutuplarda yaşar.', emoji: '🐧', isTrue: true },
  { statement: 'İnsanlar 3 ayakla yürür.', emoji: '🚶', isTrue: false },
  { statement: 'Yağmur gökyüzünden düşer.', emoji: '🌧️', isTrue: true },
  { statement: 'Tavuklar altın yumurtlar.', emoji: '🐔', isTrue: false },
  { statement: 'Türkiye\'de dört mevsim vardır.', emoji: '🍂', isTrue: true },
  { statement: 'Deniz suyu tatlıdır.', emoji: '🌊', isTrue: false },
  { statement: 'Okula gitmek öğrenmeye yardım eder.', emoji: '🏫', isTrue: true },
  // Türkiye ve Coğrafya
  { statement: 'Türkiye\'nin başkenti Ankara\'dır.', emoji: '🇹🇷', isTrue: true },
  { statement: 'Türkiye\'de deniz yoktur.', emoji: '🌊', isTrue: false },
  { statement: 'Türkiye\'de 81 il vardır.', emoji: '🗺️', isTrue: true },
  // Hayvanlar
  { statement: 'Kelebekler önce yumurta, sonra tırtıl olur.', emoji: '🦋', isTrue: true },
  { statement: 'Köpeklerin koku alma duyusu insanlardan daha gelişmiştir.', emoji: '🐕', isTrue: true },
  { statement: 'Zürafalar suda nefes alır.', emoji: '🦒', isTrue: false },
  { statement: 'Kaktüsler çölde yaşar.', emoji: '🌵', isTrue: true },
  { statement: 'Turnalar güneye göç eder.', emoji: '🦢', isTrue: true },
  { statement: 'Zebralar siyah-beyaz çizgilidir.', emoji: '🦓', isTrue: true },
  { statement: 'Aslanlar okyanusta yaşar.', emoji: '🦁', isTrue: false },
  { statement: 'Karıncalar kendi vücut ağırlıklarından çok daha fazlasını taşıyabilir.', emoji: '🐜', isTrue: true },
  { statement: 'Ahtapotların sekiz kolu vardır.', emoji: '🐙', isTrue: true },
  // Sağlık ve Besin
  { statement: 'Şeker dişlere zarar verir.', emoji: '🦷', isTrue: true },
  { statement: 'Bal arılardan değil, bitkilerden gelir.', emoji: '🍯', isTrue: false },
  { statement: 'Çikolata kakao bitkisinden yapılır.', emoji: '🍫', isTrue: true },
  { statement: 'Çiçekler güneş ışığı olmadan da büyüyebilir.', emoji: '🌸', isTrue: false },
  { statement: 'İnsanların iki diş takımı vardır: süt dişleri ve kalıcı dişler.', emoji: '😁', isTrue: true },
  // Uzay ve Dünya
  { statement: 'Güneş Sistemi\'nde 8 gezegen vardır.', emoji: '🪐', isTrue: true },
  { statement: 'Ay Dünya\'nın uydusudur.', emoji: '🌕', isTrue: true },
  { statement: 'Astronotlar uzayda ağırlıksız hisseder.', emoji: '🧑‍🚀', isTrue: true },
  { statement: 'Güneş doğudan değil batıdan doğar.', emoji: '🌅', isTrue: false },
  // Zaman ve Matematik
  { statement: 'Bir dakika 60 saniyedir.', emoji: '⏱️', isTrue: true },
  { statement: 'Bir yılda 12 ay vardır.', emoji: '📅', isTrue: true },
  { statement: 'Bir haftada 8 gün vardır.', emoji: '📆', isTrue: false },
  { statement: 'Parmak izi her insanda farklıdır.', emoji: '👆', isTrue: true },
]

const OPTIONS = [
  { value: 1, label: 'Doğru ✅' },
  { value: 0, label: 'Yanlış ❌' },
]

export function generateTrueFalseQuestion(_difficulty: Difficulty = 1): TrueFalseQuestion {
  const fact = FACTS[randomInt(0, FACTS.length - 1)]
  return {
    statement: fact.statement,
    emoji: fact.emoji,
    isTrue: fact.isTrue,
    correctAnswer: fact.isTrue ? 1 : 0,
    options: OPTIONS,
  }
}

export function generateTrueFalseSession(
  count: number,
  difficulty: Difficulty = 1,
): TrueFalseQuestion[] {
  const questions: TrueFalseQuestion[] = []
  const used = new Set<string>()
  let attempts = 0
  while (questions.length < count && attempts < count * 30) {
    const q = generateTrueFalseQuestion(difficulty)
    if (!used.has(q.statement)) {
      used.add(q.statement)
      questions.push(q)
    }
    attempts += 1
  }
  return shuffle(questions)
}

export function getTrueFalseQuestionKey(q: TrueFalseQuestion): string {
  return q.statement
}
