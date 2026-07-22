import type { HealthyFoodQuestion } from '@/missions/modules/types'
import type { Difficulty } from '@/missions/types/mission.types'
import { shuffle } from '@/missions/modules/math/mathUtils'

interface FoodItem {
  emoji: string
  label: string
  isHealthy: boolean
}

const FOOD_POOL: FoodItem[] = [
  { emoji: '🍎', label: 'Elma', isHealthy: true },
  { emoji: '🥕', label: 'Havuç', isHealthy: true },
  { emoji: '🥦', label: 'Brokoli', isHealthy: true },
  { emoji: '🍌', label: 'Muz', isHealthy: true },
  { emoji: '🥛', label: 'Süt', isHealthy: true },
  { emoji: '🍞', label: 'Ekmek', isHealthy: true },
  { emoji: '🍫', label: 'Çikolata', isHealthy: false },
  { emoji: '🍭', label: 'Şeker', isHealthy: false },
  { emoji: '🍟', label: 'Patates Kızartması', isHealthy: false },
  { emoji: '🥤', label: 'Gazlı İçecek', isHealthy: false },
  { emoji: '🍩', label: 'Donut', isHealthy: false },
  { emoji: '🍕', label: 'Pizza', isHealthy: false },
  { emoji: '🥒', label: 'Salatalık', isHealthy: true },
  { emoji: '🍇', label: 'Üzüm', isHealthy: true },
  { emoji: '🥜', label: 'Fıstık', isHealthy: true },
  { emoji: '🧃', label: 'Meyve Suyu', isHealthy: true },
  { emoji: '🍪', label: 'Kurabiye', isHealthy: false },
  { emoji: '🌽', label: 'Mısır', isHealthy: true },
  { emoji: '🍦', label: 'Dondurma', isHealthy: false },
]

export function generateHealthyFoodQuestion(_difficulty: Difficulty = 1): HealthyFoodQuestion {
  const item = FOOD_POOL[Math.floor(Math.random() * FOOD_POOL.length)]
  return {
    emoji: item.emoji,
    label: item.label,
    isHealthy: item.isHealthy,
    correctAnswer: item.isHealthy ? 0 : 1,
  }
}

export function generateHealthyFoodSession(
  count: number,
  difficulty: Difficulty = 1,
  excludeKeys: string[] = [],
): HealthyFoodQuestion[] {
  const questions: HealthyFoodQuestion[] = []
  const used = new Set(excludeKeys)
  let attempts = 0

  while (questions.length < count && attempts < count * 50) {
    const q = generateHealthyFoodQuestion(difficulty)
    if (!used.has(q.label)) {
      used.add(q.label)
      questions.push(q)
    }
    attempts += 1
  }

  while (questions.length < count) {
    questions.push(generateHealthyFoodQuestion(difficulty))
  }

  return shuffle(questions)
}

export function getHealthyFoodQuestionKey(q: HealthyFoodQuestion): string {
  return q.label
}
