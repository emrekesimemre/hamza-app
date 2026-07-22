interface MissionProgressBarProps {
  current: number
  total: number
}

export function MissionProgressBar({ current, total }: MissionProgressBarProps) {
  return (
    <div className="mb-6">
      <div className="mb-2 flex justify-between text-sm font-bold text-gray-500">
        <span>Soru {current}/{total}</span>
        <span>
          {Array.from({ length: total }).map((_, i) => (
            <span key={i} className={i < current - 1 ? 'text-yellow-500' : 'text-gray-300'}>
              ⭐
            </span>
          ))}
        </span>
      </div>
      <div className="h-3 overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-sky-500 transition-all duration-300"
          style={{ width: `${((current - 1) / total) * 100}%` }}
        />
      </div>
    </div>
  )
}
