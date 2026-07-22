import { Link } from 'react-router-dom'
import type { LockReason } from '@/missions/types/mission.types'
import { StarCounter } from '@/components/layout/StarCounter'

interface AppLockScreenProps {
  lockReason: LockReason
  stars: number
}

export function AppLockScreen({ lockReason, stars }: AppLockScreenProps) {
  if (lockReason !== 'time') {
    return null
  }

  return (
    <div className="animate-bounce-in mx-auto max-w-md rounded-3xl bg-white p-8 text-center shadow-xl">
      <div className="mb-4 text-6xl">🌙</div>
      <h2 className="mb-3 text-2xl font-extrabold text-gray-800">BUGÜNLÜK SÜREN DOLDU</h2>
      <p className="mb-2 text-lg text-gray-600">Bugün harika çalıştın! Dinlenme zamanı.</p>
      <p className="mb-6 text-base text-gray-500">Yarın yeni oyunlar seni bekliyor!</p>
      <div className="mb-6 flex justify-center">
        <StarCounter stars={stars} size="lg" />
      </div>
      <Link
        to="/rewards"
        className="inline-block w-full rounded-2xl bg-purple-500 px-6 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-600 active:scale-95"
      >
        ÖDÜLLERİM
      </Link>
    </div>
  )
}
