import { DAILY_TOPIC_POOL } from '@/constants/dailyRotation'
import { getDayOfWeekIstanbul } from '@/utils/date'
import type { Subject } from '@/missions/types/mission.types'

export function getDailyTopicPool(dayOfWeek?: number): Subject[] {
  const day = dayOfWeek ?? getDayOfWeekIstanbul()
  return DAILY_TOPIC_POOL[day] ?? DAILY_TOPIC_POOL[1]
}
