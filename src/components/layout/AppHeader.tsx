import { DEFAULT_AVATAR, DEFAULT_DINO } from '@/constants/rewards'
import { StarCounter } from '@/components/layout/StarCounter'
import { useMissionStore } from '@/store/useMissionStore'
import { Link } from 'react-router-dom'

export function AppHeader() {
  const stars = useMissionStore((s) => s.stars)
  const activeAvatar = useMissionStore((s) => s.activeAvatar)
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)

  const avatar = activeAvatar ?? DEFAULT_AVATAR
  const dino = activeDinoSkin ?? DEFAULT_DINO
  const item = activeItem ?? ''

  return (
    <header className="sticky top-0 z-40 border-b border-sky-200/60 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
        <Link to="/" className="flex items-center gap-2 text-xl font-extrabold text-sky-700">
          <span className="text-3xl">{avatar}{item}</span>
          <span className="hidden text-2xl sm:inline">{dino}</span>
          <span className="hidden sm:inline">Macera</span>
        </Link>
        <StarCounter stars={stars} />
      </div>
    </header>
  )
}

export function HeaderAvatarFallback() {
  return DEFAULT_AVATAR
}
