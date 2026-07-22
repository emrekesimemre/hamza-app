import { Star } from 'lucide-react'

interface StarCounterProps {
  stars: number
  size?: 'sm' | 'lg'
}

export function StarCounter({ stars, size = 'sm' }: StarCounterProps) {
  const isLarge = size === 'lg'

  return (
    <div
      className={`inline-flex items-center gap-1.5 rounded-full bg-yellow-100 font-bold text-yellow-700 ${
        isLarge ? 'px-5 py-2.5 text-xl' : 'px-3 py-1.5 text-base'
      }`}
    >
      <Star className={`fill-yellow-400 text-yellow-400 ${isLarge ? 'h-6 w-6' : 'h-5 w-5'}`} />
      <span>{stars}</span>
      {isLarge && <span className="font-semibold">Yıldız</span>}
    </div>
  )
}
