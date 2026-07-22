import { Link } from 'react-router-dom'
import type { Mission, DailyMission } from '@/missions/types/mission.types'
import { SUBJECT_LABELS } from '@/missions/types/mission.types'
import { BONUS_TRIO_STARS } from '@/constants/dailyRotation'
import { CheckCircle2, Star } from 'lucide-react'

interface MissionCardProps {
  mission: Mission
  dailyMission: DailyMission
  disabled?: boolean
  variant?: 'bonus' | 'catalog'
  completedToday?: boolean
}

export function MissionCard({
  mission,
  dailyMission,
  disabled,
  variant = 'bonus',
  completedToday = false,
}: MissionCardProps) {
  const isBonus = variant === 'bonus'
  const isDone = dailyMission.status === 'done' || (isBonus && completedToday)

  if (isBonus && isDone) {
    return (
      <div className="rounded-3xl border-2 border-green-200 bg-green-50 p-5 opacity-90">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{mission.icon}</span>
            <div>
              <h3 className="text-lg font-extrabold text-gray-800">{mission.title}</h3>
              <p className="text-sm font-semibold text-green-600">{SUBJECT_LABELS[mission.subject]}</p>
            </div>
          </div>
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <p className="mt-3 text-center font-bold text-green-600">Bonus tamamlandı!</p>
        <Link
          to={`/mission/${mission.id}`}
          className="mt-3 block text-center text-sm font-bold text-sky-600 hover:underline"
        >
          Tekrar oyna
        </Link>
      </div>
    )
  }

  const content = (
    <div
      className={`rounded-3xl border-2 bg-white p-5 shadow-md transition ${
        disabled
          ? 'cursor-not-allowed border-gray-200 opacity-50'
          : isBonus
            ? 'border-amber-200 hover:border-amber-400 hover:shadow-lg active:scale-[0.98]'
            : 'border-sky-200 hover:border-sky-400 hover:shadow-lg active:scale-[0.98]'
      }`}
    >
      {isBonus && (
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-wide text-amber-600">
          Bonus macera
        </p>
      )}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <span className="text-4xl">{mission.icon}</span>
          <div>
            <h3 className="text-lg font-extrabold text-gray-800">{mission.title}</h3>
            <p className={`text-sm font-semibold ${isBonus ? 'text-amber-700' : 'text-sky-600'}`}>
              {SUBJECT_LABELS[mission.subject]}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 rounded-full bg-yellow-100 px-2 py-1 text-sm font-bold text-yellow-700">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          +{mission.rewardStars}
        </div>
      </div>
      {isBonus && (
        <p className="mt-2 text-center text-xs text-amber-700">
          3 bonusu bitir → +{BONUS_TRIO_STARS} ekstra yıldız
        </p>
      )}
      {!isBonus && completedToday && (
        <p className="mt-2 text-center text-xs font-bold text-green-600">Bugün oynandı</p>
      )}
      {!disabled && (
        <div className="mt-4 text-center">
          <span
            className={`inline-block rounded-2xl px-8 py-3 text-lg font-bold text-white ${
              isBonus ? 'bg-amber-500' : 'bg-sky-500'
            }`}
          >
            {completedToday && !isBonus ? 'TEKRAR OYNA' : 'BAŞLA'}
          </span>
        </div>
      )}
    </div>
  )

  if (disabled) return content

  return <Link to={`/mission/${mission.id}`}>{content}</Link>
}
