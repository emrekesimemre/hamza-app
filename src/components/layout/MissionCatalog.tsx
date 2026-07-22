import { Link } from 'react-router-dom'
import type { Mission } from '@/missions/types/mission.types'
import { SUBJECT_LABELS, SUBJECT_CHIP_CLASS, SUBJECT_EMOJI, type Subject } from '@/missions/types/mission.types'
import { MISSION_CATALOG } from '@/missions/catalog/missionCatalog'
import { useMissionStore } from '@/store/useMissionStore'
import { Star } from 'lucide-react'

const SUBJECT_ORDER: Subject[] = ['math', 'turkish', 'logic', 'life']

interface CatalogMissionCardProps {
  mission: Mission
  completedToday: boolean
  disabled?: boolean
}

export function CatalogMissionCard({ mission, completedToday, disabled }: CatalogMissionCardProps) {
  const content = (
    <div
      className={`rounded-2xl border-2 bg-white p-4 shadow-sm transition ${
        disabled
          ? 'cursor-not-allowed border-gray-200 opacity-50'
          : 'border-gray-100 hover:border-sky-300 hover:shadow-md active:scale-[0.98]'
      }`}
    >
      <div className="flex items-start gap-3">
        <span className="text-3xl">{mission.icon}</span>
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-sm font-extrabold text-gray-800">{mission.title}</h3>
          <p className="text-xs font-semibold text-gray-500">{SUBJECT_LABELS[mission.subject]}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-0.5 rounded-full bg-yellow-100 px-2 py-0.5 text-xs font-bold text-yellow-700">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />+{mission.rewardStars}
            </span>
            {completedToday && (
              <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-bold text-green-700">
                Bugün oynandı
              </span>
            )}
          </div>
        </div>
      </div>
      {!disabled && (
        <p className="mt-3 text-center text-xs font-bold text-sky-600">
          {completedToday ? 'TEKRAR OYNA' : 'BAŞLA'}
        </p>
      )}
    </div>
  )

  if (disabled) return content
  return <Link to={`/mission/${mission.id}`}>{content}</Link>
}

export function MissionCatalog({ disabled }: { disabled?: boolean }) {
  const completedTodayIds = useMissionStore((s) => s.completedTodayIds)

  const grouped = SUBJECT_ORDER.map((subject) => ({
    subject,
    missions: MISSION_CATALOG.filter((m) => m.subject === subject),
  })).filter((g) => g.missions.length > 0)

  return (
    <div className="space-y-6">
      <h2 className="text-center text-lg font-extrabold text-gray-800">Tüm Oyunlar</h2>
      {grouped.map(({ subject, missions }) => (
        <section key={subject}>
          <div
            className={`mb-3 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-bold ${SUBJECT_CHIP_CLASS[subject]}`}
          >
            <span>{SUBJECT_EMOJI[subject]}</span>
            {SUBJECT_LABELS[subject]}
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {missions.map((mission) => (
              <CatalogMissionCard
                key={mission.id}
                mission={mission}
                completedToday={completedTodayIds.includes(mission.id)}
                disabled={disabled}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
