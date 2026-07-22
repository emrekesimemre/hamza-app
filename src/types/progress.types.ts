import type { MissionType, Subject } from '@/missions/types/mission.types'

export interface ProgressLog {
  missionId: string
  missionType: MissionType
  subject: Subject
  correctCount: number
  wrongCount: number
  completedAt: string
  starsEarned: number
}
