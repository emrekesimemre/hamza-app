import { selectDailyMissions } from '@/missions/engine/missionSelector'
import type {
  DailyMission,
  Difficulty,
  MissionType,
  RecentMissionEntry,
  Subject,
} from '@/missions/types/mission.types'

export function generateDailyMissions(
  today: string,
  recentHistory: RecentMissionEntry[],
  difficultyByType: Record<MissionType, Difficulty>,
  topicPool?: Subject[],
): DailyMission[] {
  return selectDailyMissions(today, recentHistory, difficultyByType, topicPool)
}
