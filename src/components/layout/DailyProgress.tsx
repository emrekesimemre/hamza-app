interface DailyProgressProps {
  completed: number
  total?: number
}

export function DailyProgress({ completed, total = 3 }: DailyProgressProps) {
  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-4 w-4 rounded-full transition-all ${
            i < completed ? 'scale-110 bg-yellow-400 shadow-md' : 'bg-gray-200'
          }`}
        />
      ))}
      <span className="ml-2 text-sm font-semibold text-gray-600">
        {completed}/{total} bonus
      </span>
    </div>
  )
}
