import type { Reward } from '@/types/rewards.types'
import { Star } from 'lucide-react'

interface RewardCardProps {
  reward: Reward
  owned: boolean
  active: boolean
  stars: number
  onPurchase: () => void
  onActivate: () => void
  onPreview: () => void
}

export function RewardCard({
  reward,
  owned,
  active,
  stars,
  onPurchase,
  onActivate,
  onPreview,
}: RewardCardProps) {
  const canAfford = stars >= reward.cost
  const needed = reward.cost - stars

  return (
    <div
      className={`rounded-3xl border-2 p-5 transition ${
        active ? 'border-purple-400 bg-purple-50' : 'border-gray-200 bg-white'
      }`}
    >
      <div className="flex items-center gap-4">
        <span className="text-5xl">{reward.icon}</span>
        <div className="flex-1">
          <h3 className="text-lg font-extrabold text-gray-800">{reward.name}</h3>
          {!owned && (
            <div className="mt-1 flex items-center gap-1 font-bold text-yellow-600">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {reward.cost}
            </div>
          )}
          {owned && active && (
            <p className="mt-1 text-sm font-bold text-purple-600">Aktif ✨</p>
          )}
          {owned && !active && (
            <p className="mt-1 text-sm font-semibold text-green-600">Sahipsin ✅</p>
          )}
        </div>
      </div>

      <div className="mt-4 space-y-2">
        {!owned && (
          <button
            type="button"
            onClick={onPreview}
            className="w-full rounded-2xl bg-sky-100 py-2.5 text-sm font-bold text-sky-700 transition hover:bg-sky-200 active:scale-95"
          >
            👀 Nasıl Görünecek?
          </button>
        )}

        {owned ? (
          !active ? (
            <button
              type="button"
              onClick={onActivate}
              className="w-full rounded-2xl bg-purple-500 py-3 font-bold text-white transition hover:bg-purple-600 active:scale-95"
            >
              Kullan
            </button>
          ) : null
        ) : canAfford ? (
          <button
            type="button"
            onClick={onPurchase}
            className="w-full rounded-2xl bg-yellow-500 py-3 font-bold text-white transition hover:bg-yellow-600 active:scale-95"
          >
            Satın Al
          </button>
        ) : (
          <p className="text-center font-semibold text-gray-500">{needed} ⭐ daha lazım!</p>
        )}
      </div>
    </div>
  )
}
