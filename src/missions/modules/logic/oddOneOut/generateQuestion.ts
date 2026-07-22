import type { Difficulty } from '@/missions/types/mission.types'
import type { OddOneOutQuestion } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

interface Group {
  category: string
  items: { emoji: string; label: string }[]
  odd: { emoji: string; label: string }
}

const GROUPS: Group[] = [
  {
    category: 'Meyveler arasında',
    items: [
      { emoji: '🍎', label: 'Elma' },
      { emoji: '🍌', label: 'Muz' },
      { emoji: '🍇', label: 'Üzüm' },
    ],
    odd: { emoji: '🥕', label: 'Havuç' },
  },
  {
    category: 'Hayvanlar arasında',
    items: [
      { emoji: '🐶', label: 'Köpek' },
      { emoji: '🐱', label: 'Kedi' },
      { emoji: '🐰', label: 'Tavşan' },
    ],
    odd: { emoji: '🚗', label: 'Araba' },
  },
  {
    category: 'Taşıtlar arasında',
    items: [
      { emoji: '🚌', label: 'Otobüs' },
      { emoji: '🚲', label: 'Bisiklet' },
      { emoji: '✈️', label: 'Uçak' },
    ],
    odd: { emoji: '🏠', label: 'Ev' },
  },
  {
    category: 'Okul eşyaları arasında',
    items: [
      { emoji: '✏️', label: 'Kalem' },
      { emoji: '📏', label: 'Cetvel' },
      { emoji: '📖', label: 'Kitap' },
    ],
    odd: { emoji: '🍕', label: 'Pizza' },
  },
  {
    category: 'Doğa olayları arasında',
    items: [
      { emoji: '🌧️', label: 'Yağmur' },
      { emoji: '❄️', label: 'Kar' },
      { emoji: '💨', label: 'Rüzgâr' },
    ],
    odd: { emoji: '🪑', label: 'Sandalye' },
  },
  {
    category: 'Renkler arasında',
    items: [
      { emoji: '🔴', label: 'Kırmızı' },
      { emoji: '🔵', label: 'Mavi' },
      { emoji: '🟡', label: 'Sarı' },
    ],
    odd: { emoji: '🐘', label: 'Fil' },
  },
  {
    category: 'Deniz canlıları arasında',
    items: [
      { emoji: '🐟', label: 'Balık' },
      { emoji: '🐙', label: 'Ahtapot' },
      { emoji: '🦀', label: 'Yengeç' },
    ],
    odd: { emoji: '🦅', label: 'Kartal' },
  },
  {
    category: 'Giyecekler arasında',
    items: [
      { emoji: '👕', label: 'Tişört' },
      { emoji: '👖', label: 'Pantolon' },
      { emoji: '🧥', label: 'Mont' },
    ],
    odd: { emoji: '🍦', label: 'Dondurma' },
  },
  {
    category: 'Sporlar arasında',
    items: [
      { emoji: '⚽', label: 'Futbol' },
      { emoji: '🏀', label: 'Basketbol' },
      { emoji: '🎾', label: 'Tenis' },
    ],
    odd: { emoji: '🎻', label: 'Keman' },
  },
  {
    category: 'Müzik aletleri arasında',
    items: [
      { emoji: '🎸', label: 'Gitar' },
      { emoji: '🥁', label: 'Davul' },
      { emoji: '🎹', label: 'Piyano' },
    ],
    odd: { emoji: '🥒', label: 'Salatalık' },
  },
  {
    category: 'Meslekler arasında',
    items: [
      { emoji: '👨‍⚕️', label: 'Doktor' },
      { emoji: '👩‍🏫', label: 'Öğretmen' },
      { emoji: '👨‍🚒', label: 'İtfaiyeci' },
    ],
    odd: { emoji: '🐸', label: 'Kurbağa' },
  },
  {
    category: 'Ev eşyaları arasında',
    items: [
      { emoji: '🛋️', label: 'Koltuk' },
      { emoji: '🛏️', label: 'Yatak' },
      { emoji: '🪑', label: 'Sandalye' },
    ],
    odd: { emoji: '🐬', label: 'Yunus' },
  },
  {
    category: 'Çiçekler arasında',
    items: [
      { emoji: '🌹', label: 'Gül' },
      { emoji: '🌻', label: 'Ayçiçeği' },
      { emoji: '🌷', label: 'Lale' },
    ],
    odd: { emoji: '🚁', label: 'Helikopter' },
  },
  {
    category: 'Sebzeler arasında',
    items: [
      { emoji: '🥕', label: 'Havuç' },
      { emoji: '🥦', label: 'Brokoli' },
      { emoji: '🌽', label: 'Mısır' },
    ],
    odd: { emoji: '🍎', label: 'Elma' },
  },
  {
    category: 'Tatlılar arasında',
    items: [
      { emoji: '🍰', label: 'Pasta' },
      { emoji: '🍪', label: 'Kurabiye' },
      { emoji: '🍭', label: 'Şeker' },
    ],
    odd: { emoji: '🥕', label: 'Havuç' },
  },
  {
    category: 'Böcekler arasında',
    items: [
      { emoji: '🐝', label: 'Arı' },
      { emoji: '🦋', label: 'Kelebek' },
      { emoji: '🐛', label: 'Tırtıl' },
    ],
    odd: { emoji: '🐟', label: 'Balık' },
  },
  {
    category: 'Motorlu araçlar arasında',
    items: [
      { emoji: '🚗', label: 'Araba' },
      { emoji: '🛻', label: 'Kamyonet' },
      { emoji: '🚑', label: 'Ambulans' },
    ],
    odd: { emoji: '🐴', label: 'At' },
  },
  {
    category: 'İçecekler arasında',
    items: [
      { emoji: '🥛', label: 'Süt' },
      { emoji: '🍵', label: 'Çay' },
      { emoji: '🧃', label: 'Meyve suyu' },
    ],
    odd: { emoji: '📖', label: 'Kitap' },
  },
  {
    category: 'Mutfak eşyaları arasında',
    items: [
      { emoji: '🍳', label: 'Tava' },
      { emoji: '🥄', label: 'Kaşık' },
      { emoji: '🍶', label: 'Tencere' },
    ],
    odd: { emoji: '🛏️', label: 'Yatak' },
  },
  {
    category: 'Oyuncaklar arasında',
    items: [
      { emoji: '🪀', label: 'Yoyo' },
      { emoji: '🧸', label: 'Ayı peluş' },
      { emoji: '⚽', label: 'Top' },
    ],
    odd: { emoji: '📐', label: 'Gönye' },
  },
  {
    category: 'Kış kıyafetleri arasında',
    items: [
      { emoji: '🧣', label: 'Atkı' },
      { emoji: '🧤', label: 'Eldiven' },
      { emoji: '🧥', label: 'Kaban' },
    ],
    odd: { emoji: '🩴', label: 'Terlik' },
  },
  {
    category: 'Gökyüzü cisimleri arasında',
    items: [
      { emoji: '⭐', label: 'Yıldız' },
      { emoji: '🌙', label: 'Ay' },
      { emoji: '☀️', label: 'Güneş' },
    ],
    odd: { emoji: '🐠', label: 'Balık' },
  },
  {
    category: 'Yaban hayvanları arasında',
    items: [
      { emoji: '🦁', label: 'Aslan' },
      { emoji: '🐘', label: 'Fil' },
      { emoji: '🦒', label: 'Zürafa' },
    ],
    odd: { emoji: '🚲', label: 'Bisiklet' },
  },
  {
    category: 'Mevsimler arasında',
    items: [
      { emoji: '🌸', label: 'İlkbahar' },
      { emoji: '☀️', label: 'Yaz' },
      { emoji: '🍂', label: 'Sonbahar' },
    ],
    odd: { emoji: '🌊', label: 'Deniz' },
  },
  {
    category: 'Kuşlar arasında',
    items: [
      { emoji: '🦅', label: 'Kartal' },
      { emoji: '🦜', label: 'Papağan' },
      { emoji: '🐦', label: 'Serçe' },
    ],
    odd: { emoji: '🐊', label: 'Timsah' },
  },
]

export function generateOddOneOutQuestion(_difficulty: Difficulty = 1): OddOneOutQuestion {
  const group = GROUPS[randomInt(0, GROUPS.length - 1)]
  const slot = randomInt(0, 3)
  const items = [...group.items]
  items.splice(slot, 0, group.odd)

  const options = items.map((item, i) => ({
    value: i,
    label: item.label,
  }))

  return {
    prompt: `${group.category} hangisi farklı?`,
    items,
    correctAnswer: slot,
    options,
  }
}

export function generateOddOneOutSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): OddOneOutQuestion[] {
  const questions: OddOneOutQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0
  while (questions.length < count && attempts < count * 50) {
    const q = generateOddOneOutQuestion(difficulty)
    const key = getOddOneOutQuestionKey(q)
    if (!used.has(key)) {
      used.add(key)
      questions.push(q)
    }
    attempts += 1
  }
  while (questions.length < count) {
    questions.push(generateOddOneOutQuestion(difficulty))
  }
  return shuffle(questions)
}

export function getOddOneOutQuestionKey(q: OddOneOutQuestion): string {
  return q.items.map((i) => i.emoji).join(',')
}
