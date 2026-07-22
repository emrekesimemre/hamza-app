import { Link } from 'react-router-dom'
import { REWARDS_CATALOG } from '@/constants/rewards'
import { useMissionStore } from '@/store/useMissionStore'
import { RewardCard } from '@/components/rewards/RewardCard'
import { StarCounter } from '@/components/layout/StarCounter'
import { ArrowLeft } from 'lucide-react'

export default function RewardsPage() {
  const stars = useMissionStore((s) => s.stars)
  const ownedRewards = useMissionStore((s) => s.ownedRewards)
  const activeAvatar = useMissionStore((s) => s.activeAvatar)
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)
  const purchaseReward = useMissionStore((s) => s.purchaseReward)
  const setActiveAvatar = useMissionStore((s) => s.setActiveAvatar)
  const setActiveDinoSkin = useMissionStore((s) => s.setActiveDinoSkin)
  const setActiveItem = useMissionStore((s) => s.setActiveItem)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1 rounded-xl px-2 py-2 font-semibold text-gray-600 transition hover:bg-white/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold text-purple-700">⭐ Ödül Mağazası</h1>
      </div>

      <div className="flex justify-center">
        <StarCounter stars={stars} size="lg" />
      </div>

      <div className="space-y-4">
        {REWARDS_CATALOG.map((reward) => {
          const owned = ownedRewards.includes(reward.id)
          const active =
            (reward.category === 'avatar' && activeAvatar === reward.icon) ||
            (reward.category === 'dino-skin' && activeDinoSkin === reward.icon) ||
            (reward.category === 'item' && activeItem === reward.icon)

          return (
            <RewardCard
              key={reward.id}
              reward={reward}
              owned={owned}
              active={active}
              stars={stars}
              onPurchase={() => purchaseReward(reward.id)}
              onActivate={() => {
                if (reward.category === 'avatar') setActiveAvatar(reward.id)
                if (reward.category === 'dino-skin') setActiveDinoSkin(reward.id)
                if (reward.category === 'item') setActiveItem(reward.id)
              }}
            />
          )
        })}
      </div>
    </div>
  )
}
