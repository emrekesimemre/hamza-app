import { WEEKDAY_LABELS } from '@/constants/dailyRotation'
import { getDailyTopicPool } from '@/missions/engine/rotationEngine'
import {
  SUBJECT_CHIP_CLASS,
  SUBJECT_EMOJI,
  SUBJECT_LABELS,
  type Subject,
} from '@/missions/types/mission.types'
import { getDayOfWeekIstanbul } from '@/utils/date'

export function TodaySubjects() {
  const day = getDayOfWeekIstanbul()
  const subjects = getDailyTopicPool(day)
  const weekday = WEEKDAY_LABELS[day] ?? ''

  return (
    <div className="rounded-2xl bg-white/80 px-4 py-3 shadow-sm ring-1 ring-sky-100">
      <p className="mb-2 text-center text-xs font-semibold uppercase tracking-wide text-gray-500">
          {weekday} · Önerilen dersler
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {subjects.map((subject) => (
          <SubjectChip key={subject} subject={subject} />
        ))}
      </div>
      <p className="mt-2 text-center text-xs text-gray-400">
        Her dersten 1 macera · Yarın farklı dersler gelecek
      </p>
    </div>
  )
}

function SubjectChip({ subject }: { subject: Subject }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${SUBJECT_CHIP_CLASS[subject]}`}
    >
      <span aria-hidden>{SUBJECT_EMOJI[subject]}</span>
      {SUBJECT_LABELS[subject]}
    </span>
  )
}
