import { DAILY_MISSION_COUNT, RECENT_HISTORY_DAYS } from '@/constants/dailyRotation'
import { MISSION_CATALOG } from '@/missions/catalog/missionCatalog'
import { resolveDifficulty } from '@/missions/engine/difficultyEngine'
import { getDailyTopicPool } from '@/missions/engine/rotationEngine'
import type {
  DailyMission,
  Difficulty,
  Mission,
  MissionType,
  RecentMissionEntry,
  Subject,
} from '@/missions/types/mission.types'
import { daysBetween } from '@/utils/date'

function shuffle<T>(items: T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function getRecentMissionIds(history: RecentMissionEntry[], today: string): Set<string> {
  return new Set(
    history
      .filter((entry) => daysBetween(entry.completedDate, today) <= RECENT_HISTORY_DAYS)
      .map((entry) => entry.missionId),
  )
}

function groupBySubject(missions: Mission[]): Map<Subject, Mission[]> {
  const map = new Map<Subject, Mission[]>()
  for (const mission of missions) {
    const list = map.get(mission.subject) ?? []
    list.push(mission)
    map.set(mission.subject, list)
  }
  return map
}

function pickFromSubject(
  subject: Subject,
  grouped: Map<Subject, Mission[]>,
  usedIds: Set<string>,
): Mission | null {
  const candidates = shuffle(grouped.get(subject) ?? []).filter((m) => !usedIds.has(m.id))
  if (candidates.length === 0) {
    const fallback = shuffle(grouped.get(subject) ?? [])
    return fallback[0] ?? null
  }
  return candidates[0]
}

function buildDistribution(pool: Subject[]): number[] {
  if (pool.length >= DAILY_MISSION_COUNT) {
    return pool.slice(0, DAILY_MISSION_COUNT).map(() => 1)
  }

  if (pool.length === 2) {
    return [2, 1]
  }

  return [DAILY_MISSION_COUNT]
}

export function selectDailyMissions(
  today: string,
  recentHistory: RecentMissionEntry[],
  difficultyByType: Record<MissionType, Difficulty>,
  topicPool?: Subject[],
): DailyMission[] {
  const pool = topicPool ?? getDailyTopicPool()
  const recentIds = getRecentMissionIds(recentHistory, today)

  let candidates = MISSION_CATALOG.filter(
    (mission) => pool.includes(mission.subject) && !recentIds.has(mission.id),
  )

  if (candidates.length < DAILY_MISSION_COUNT) {
    candidates = MISSION_CATALOG.filter((mission) => pool.includes(mission.subject))
  }

  const grouped = groupBySubject(candidates)
  const distribution = buildDistribution(pool)
  const selected: Mission[] = []
  const usedIds = new Set<string>()

  pool.forEach((subject, index) => {
    const count = distribution[index] ?? 0
    for (let i = 0; i < count && selected.length < DAILY_MISSION_COUNT; i += 1) {
      const mission = pickFromSubject(subject, grouped, usedIds)
      if (mission) {
        selected.push(mission)
        usedIds.add(mission.id)
      }
    }
  })

  while (selected.length < DAILY_MISSION_COUNT) {
    const remaining = candidates.filter((m) => !usedIds.has(m.id))
    if (remaining.length === 0) break
    const next = remaining[0]
    selected.push(next)
    usedIds.add(next.id)
  }

  return selected.slice(0, DAILY_MISSION_COUNT).map((mission, order) => ({
    missionId: mission.id,
    order,
    status: 'pending' as const,
    resolvedDifficulty: resolveDifficulty(mission.type, difficultyByType),
  }))
}
