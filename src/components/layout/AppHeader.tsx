import { HamzaAvatar } from '@/components/common/HamzaAvatar'
import { StarCounter } from '@/components/layout/StarCounter'
import { useMissionStore } from '@/store/useMissionStore'
import { Link } from 'react-router-dom'

export function AppHeader() {
  const stars = useMissionStore((s) => s.stars)

  return (
    <header className="sticky top-0 z-40 border-b border-sky-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-sky-700">
          <HamzaAvatar />
          <span>Hamza Macera</span>
        </Link>
        <StarCounter stars={stars} />
      </div>
    </header>
  )
}
