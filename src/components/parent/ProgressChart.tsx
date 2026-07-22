interface ActivityChartProps {
  data: { date: string; count: number }[]
}

export function ActivityChart({ data }: ActivityChartProps) {
  const max = Math.max(...data.map((d) => d.count), 3)

  return (
    <div className="rounded-2xl bg-gray-50 p-4">
      <h3 className="mb-4 text-sm font-bold text-gray-600">Son 7 Gün</h3>
      <div className="flex items-end justify-between gap-2" style={{ height: 100 }}>
        {data.map((day) => {
          const height = max > 0 ? (day.count / max) * 80 + 8 : 8
          const label = day.date.slice(5)
          return (
            <div key={day.date} className="flex flex-1 flex-col items-center gap-1">
              <span className="text-xs font-bold text-gray-500">{day.count}</span>
              <div
                className="w-full rounded-t-lg bg-sky-400 transition-all"
                style={{ height }}
              />
              <span className="text-[10px] text-gray-400">{label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

interface SubjectStatsProps {
  stats: { subject: string; label: string; accuracy: number; total: number }[]
}

export function SubjectStats({ stats }: SubjectStatsProps) {
  if (stats.length === 0) {
    return <p className="text-sm text-gray-500">Henüz yeterli veri yok.</p>
  }

  return (
    <div className="space-y-3">
      {stats.map((s) => (
        <div key={s.subject} className="rounded-xl bg-gray-50 p-3">
          <div className="mb-1 flex justify-between text-sm">
            <span className="font-bold text-gray-700">{s.label}</span>
            <span className="text-gray-500">{Math.round(s.accuracy * 100)}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-400"
              style={{ width: `${Math.round(s.accuracy * 100)}%` }}
            />
          </div>
          <p className="mt-1 text-xs text-gray-400">{s.total} görev tamamlandı</p>
        </div>
      ))}
    </div>
  )
}
