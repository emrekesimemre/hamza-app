import type { Difficulty } from '@/missions/types/mission.types'
import type { StoryOrderQuestion } from '@/missions/modules/types'
import { randomInt, shuffle } from '@/missions/modules/math/mathUtils'

interface Story {
  id: string
  title: string
  steps: { emoji: string; label: string }[]
  minDifficulty?: Difficulty
}

const STORIES: Story[] = [
  {
    id: 'rainbow',
    title: 'Yağmurdan sonra',
    steps: [
      { emoji: '🌧️', label: 'Yağmur yağdı' },
      { emoji: '☀️', label: 'Güneş çıktı' },
      { emoji: '🌈', label: 'Gökkuşağı belirdi' },
    ],
  },
  {
    id: 'cake',
    title: 'Kek yapımı',
    steps: [
      { emoji: '🥚', label: 'Malzemeler hazırlandı' },
      { emoji: '🔥', label: 'Fırında pişti' },
      { emoji: '🎂', label: 'Kek servis edildi' },
    ],
  },
  {
    id: 'school',
    title: 'Okula gidiş',
    steps: [
      { emoji: '⏰', label: 'Alarm çaldı' },
      { emoji: '🎒', label: 'Çanta hazırlandı' },
      { emoji: '🏫', label: 'Okula varıldı' },
    ],
  },
  {
    id: 'plant',
    title: 'Bitki büyümesi',
    steps: [
      { emoji: '🌱', label: 'Tohum ekildi' },
      { emoji: '💧', label: 'Sulandı' },
      { emoji: '🌻', label: 'Çiçek açtı' },
    ],
  },
  {
    id: 'sleep',
    title: 'Gece uykusu',
    steps: [
      { emoji: '🍽️', label: 'Akşam yemeği yendi' },
      { emoji: '🪥', label: 'Dişler fırçalandı' },
      { emoji: '😴', label: 'Uyundu' },
    ],
  },
  {
    id: 'snow',
    title: 'Kar yağışı',
    steps: [
      { emoji: '☁️', label: 'Bulutlar geldi' },
      { emoji: '❄️', label: 'Kar yağdı' },
      { emoji: '⛄', label: 'Kardan adam yapıldı' },
    ],
  },
  {
    id: 'breakfast',
    title: 'Sabah kahvaltısı',
    steps: [
      { emoji: '⏰', label: 'Uyandı' },
      { emoji: '🥣', label: 'Kahvaltı yaptı' },
      { emoji: '🚌', label: 'Servise bindi' },
    ],
  },
  {
    id: 'park',
    title: 'Park gezisi',
    steps: [
      { emoji: '👟', label: 'Ayakkabılar giyildi' },
      { emoji: '🌳', label: 'Parka gidildi' },
      { emoji: '🛝', label: 'Salıncağa bindi' },
    ],
  },
  {
    id: 'fishing',
    title: 'Balık tutma',
    steps: [
      { emoji: '🎣', label: 'Olta hazırlandı' },
      { emoji: '🐟', label: 'Balık yakalandı' },
      { emoji: '🍽️', label: 'Balık pişirildi' },
    ],
  },
  {
    id: 'birthday',
    title: 'Doğum günü',
    steps: [
      { emoji: '🎈', label: 'Balonlar asıldı' },
      { emoji: '🎂', label: 'Pasta kesildi' },
      { emoji: '🎁', label: 'Hediye açıldı' },
    ],
  },
  {
    id: 'drawing',
    title: 'Resim yapma',
    steps: [
      { emoji: '🖍️', label: 'Boya seçildi' },
      { emoji: '🎨', label: 'Resim çizildi' },
      { emoji: '🖼️', label: 'Resim asıldı' },
    ],
  },
  {
    id: 'library',
    title: 'Kütüphane',
    steps: [
      { emoji: '📚', label: 'Kitap seçildi' },
      { emoji: '📖', label: 'Kitap okundu' },
      { emoji: '🔖', label: 'Kitap geri bırakıldı' },
    ],
  },
  {
    id: 'bike',
    title: 'Bisiklet sürme',
    steps: [
      { emoji: '🪖', label: 'Kask takıldı' },
      { emoji: '🚲', label: 'Bisiklete binildi' },
      { emoji: '🏁', label: 'Tur tamamlandı' },
    ],
  },
  {
    id: 'market',
    title: 'Pazar alışverişi',
    steps: [
      { emoji: '📝', label: 'Liste yazıldı' },
      { emoji: '🛒', label: 'Alışveriş yapıldı' },
      { emoji: '🏠', label: 'Eve dönüldü' },
    ],
  },
  {
    id: 'swim',
    title: 'Yüzme',
    steps: [
      { emoji: '👙', label: 'Mayo giyildi' },
      { emoji: '🏊', label: 'Havuza girildi' },
      { emoji: '🚿', label: 'Duş alındı' },
    ],
  },
  {
    id: 'bird',
    title: 'Kuş besleme',
    steps: [
      { emoji: '🌾', label: 'Yem kondu' },
      { emoji: '🐦', label: 'Kuş geldi' },
      { emoji: '😊', label: 'Kuş izlendi' },
    ],
  },
  {
    id: 'letter',
    title: 'Mektup gönderme',
    steps: [
      { emoji: '✉️', label: 'Mektup yazıldı' },
      { emoji: '📮', label: 'Postaya verildi' },
      { emoji: '📬', label: 'Mektup ulaştı' },
    ],
  },
  {
    id: 'camp',
    title: 'Kamp',
    steps: [
      { emoji: '⛺', label: 'Çadır kuruldu' },
      { emoji: '🔥', label: 'Ateş yakıldı' },
      { emoji: '🌟', label: 'Yıldızlar izlendi' },
    ],
  },
  {
    id: 'juice',
    title: 'Meyve suyu',
    steps: [
      { emoji: '🍎', label: 'Elma toplandı' },
      { emoji: '🧺', label: 'Meyveler yıkandı' },
      { emoji: '🥤', label: 'Suyu sıkıldı' },
    ],
  },
  {
    id: 'dentist',
    title: 'Diş hekimi',
    steps: [
      { emoji: '🏥', label: 'Kliniğe gidildi' },
      { emoji: '🦷', label: 'Dişler kontrol edildi' },
      { emoji: '✅', label: 'Sağlıklı dişler' },
    ],
  },
  {
    id: 'flight',
    title: 'Uçak yolculuğu',
    steps: [
      { emoji: '🧳', label: 'Bavul hazırlandı' },
      { emoji: '✈️', label: 'Uçağa binildi' },
      { emoji: '🏖️', label: 'Tatil yeri' },
    ],
  },
  {
    id: 'movie',
    title: 'Film gecesi',
    steps: [
      { emoji: '🍿', label: 'Patlamış mısır' },
      { emoji: '📺', label: 'Film başladı' },
      { emoji: '😴', label: 'Uyku vakti' },
    ],
  },
  {
    id: 'laundry',
    title: 'Çamaşır günü',
    steps: [
      { emoji: '👕', label: 'Kirli çamaşırlar toplandı' },
      { emoji: '🫧', label: 'Makine çalıştı' },
      { emoji: '🌬️', label: 'Çamaşırlar kurudu' },
    ],
  },
  {
    id: 'puppy',
    title: 'Yavru köpek',
    steps: [
      { emoji: '🐕', label: 'Köpek sahiplenildi' },
      { emoji: '🦴', label: 'Kemik verildi' },
      { emoji: '🛁', label: 'Banyo yaptırıldı' },
    ],
  },
  {
    id: 'school-project',
    title: 'Okul ödevi',
    steps: [
      { emoji: '📋', label: 'Ödev alındı' },
      { emoji: '✏️', label: 'Ödev yapıldı' },
      { emoji: '📤', label: 'Öğretmene verildi' },
    ],
  },
  {
    id: 'school-full',
    title: 'Okula hazırlık',
    minDifficulty: 2,
    steps: [
      { emoji: '⏰', label: 'Alarm çaldı' },
      { emoji: '👕', label: 'Üniforma giyildi' },
      { emoji: '🎒', label: 'Çanta hazırlandı' },
      { emoji: '🏫', label: 'Okula varıldı' },
    ],
  },
  {
    id: 'cooking-full',
    title: 'Yemek pişirme',
    minDifficulty: 2,
    steps: [
      { emoji: '🥕', label: 'Sebzeler doğrandı' },
      { emoji: '🍳', label: 'Tencerede pişti' },
      { emoji: '🍽️', label: 'Tabağa kondu' },
      { emoji: '😋', label: 'Yemek yenildi' },
    ],
  },
  {
    id: 'garden-full',
    title: 'Bahçe işleri',
    minDifficulty: 2,
    steps: [
      { emoji: '🌱', label: 'Tohum ekildi' },
      { emoji: '💧', label: 'Her gün sulandı' },
      { emoji: '🌿', label: 'Filiz çıktı' },
      { emoji: '🌻', label: 'Çiçek açtı' },
    ],
  },
  {
    id: 'snowball',
    title: 'Kartopu oyunu',
    minDifficulty: 2,
    steps: [
      { emoji: '❄️', label: 'Kar yağdı' },
      { emoji: '⛄', label: 'Kardan adam yapıldı' },
      { emoji: '🎯', label: 'Kartopu atıldı' },
      { emoji: '🏠', label: 'Eve dönüldü' },
    ],
  },
  {
    id: 'beach',
    title: 'Deniz tatili',
    minDifficulty: 3,
    steps: [
      { emoji: '🧴', label: 'Güneş kremi sürüldü' },
      { emoji: '🏖️', label: 'Kumağa gidildi' },
      { emoji: '🌊', label: 'Denize girildi' },
      { emoji: '🍦', label: 'Dondurma yendi' },
    ],
  },
]

function storiesForDifficulty(difficulty: Difficulty): Story[] {
  return STORIES.filter((story) => (story.minDifficulty ?? 1) <= difficulty)
}

function formatOrder(steps: { emoji: string; label: string }[]): string {
  return steps.map((s) => s.emoji).join(' → ')
}

function buildWrongOrders(
  steps: { emoji: string; label: string }[],
  correctLabel: string,
  count: number,
): string[] {
  const wrongOrders: string[] = []
  let attempts = 0

  while (wrongOrders.length < count && attempts < 80) {
    const shuffled = shuffle([...steps])
    const label = formatOrder(shuffled)
    if (label !== correctLabel && !wrongOrders.includes(label)) {
      wrongOrders.push(label)
    }
    attempts += 1
  }

  while (wrongOrders.length < count) {
    const reversed = formatOrder([...steps].reverse())
    if (reversed !== correctLabel && !wrongOrders.includes(reversed)) {
      wrongOrders.push(reversed)
    } else {
      wrongOrders.push(formatOrder(shuffle([...steps])))
    }
  }

  return wrongOrders
}

function buildStoryOrderQuestion(story: Story, difficulty: Difficulty): StoryOrderQuestion {
  const correctLabel = formatOrder(story.steps)
  const wrongCount = difficulty >= 2 ? 3 : 2
  const wrongOrders = buildWrongOrders(story.steps, correctLabel, wrongCount)
  const choices = shuffle([correctLabel, ...wrongOrders.slice(0, wrongCount)])
  const correctAnswer = choices.indexOf(correctLabel)

  return {
    title: story.title,
    steps: shuffle([...story.steps]),
    correctAnswer,
    options: choices.map((label, value) => ({ value, label })),
  }
}

export function generateStoryOrderQuestion(difficulty: Difficulty = 1): StoryOrderQuestion {
  const pool = storiesForDifficulty(difficulty)
  const story = pool[randomInt(0, pool.length - 1)]
  return buildStoryOrderQuestion(story, difficulty)
}

export function generateStoryOrderSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeTitles: string[] = [],
): StoryOrderQuestion[] {
  const pool = shuffle(
    storiesForDifficulty(difficulty).filter((story) => !excludeTitles.includes(story.title)),
  )
  const questions: StoryOrderQuestion[] = []

  for (const story of pool) {
    if (questions.length >= count) break
    questions.push(buildStoryOrderQuestion(story, difficulty))
  }

  while (questions.length < count) {
    questions.push(generateStoryOrderQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getStoryOrderQuestionKey(q: StoryOrderQuestion): string {
  return q.title
}

export function getStoryOrderStoryId(title: string): string | undefined {
  return STORIES.find((story) => story.title === title)?.id
}

export const STORY_COUNT = STORIES.length
