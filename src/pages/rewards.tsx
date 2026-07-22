import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  REWARDS_CATALOG,
  REWARD_CATEGORY_LABELS,
  REWARD_CATEGORY_ORDER,
  getRewardsByCategory,
} from '@/constants/rewards'
import { REWARD_SETS } from '@/constants/rewardSets'
import { useMissionStore } from '@/store/useMissionStore'
import { RewardCard } from '@/components/rewards/RewardCard'
import { StarCounter } from '@/components/layout/StarCounter'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'
import { PurchaseCelebrationModal } from '@/components/rewards/PurchaseCelebrationModal'
import { RewardPreviewModal } from '@/components/rewards/RewardPreviewModal'
import type { Reward, PurchaseRewardResult, RewardCategory } from '@/types/rewards.types'
import { ArrowLeft } from 'lucide-react'

export default function RewardsPage() {
  const navigate = useNavigate()
  const stars = useMissionStore((s) => s.stars)
  const ownedRewards = useMissionStore((s) => s.ownedRewards)
  const activeAvatar = useMissionStore((s) => s.activeAvatar)
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)
  const purchaseReward = useMissionStore((s) => s.purchaseReward)
  const activateReward = useMissionStore((s) => s.activateReward)

  const [celebration, setCelebration] = useState<PurchaseRewardResult | null>(null)
  const [previewReward, setPreviewReward] = useState<Reward | null>(null)
  const [setsExpanded, setSetsExpanded] = useState(false)

  const handlePurchase = (rewardId: string) => {
    const result = purchaseReward(rewardId)
    if (result.success && result.reward) {
      setCelebration(result)
      setPreviewReward(null)
    }
  }

  const handleUseNow = () => {
    if (celebration?.reward) {
      activateReward(celebration.reward.id)
    }
    setCelebration(null)
  }

  const handleViewCollection = () => {
    setCelebration(null)
    navigate('/collection')
  }

  const isRewardActive = (reward: Reward) =>
    (reward.category === 'avatar' && activeAvatar === reward.icon) ||
    (reward.category === 'dino-skin' && activeDinoSkin === reward.icon) ||
    (reward.category === 'item' && activeItem === reward.icon)

  const renderCategory = (category: RewardCategory) => {
    const rewards = getRewardsByCategory(category)
    const ownedInCategory = rewards.filter((r) => ownedRewards.includes(r.id)).length

    return (
      <section key={category}>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-extrabold text-gray-800">
            {REWARD_CATEGORY_LABELS[category]}
          </h2>
          <span className="rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-bold text-purple-600">
            {ownedInCategory}/{rewards.length}
          </span>
        </div>
        <div className="space-y-4">
          {rewards.map((reward) => (
            <RewardCard
              key={reward.id}
              reward={reward}
              owned={ownedRewards.includes(reward.id)}
              active={isRewardActive(reward)}
              stars={stars}
              onPurchase={() => handlePurchase(reward.id)}
              onActivate={() => activateReward(reward.id)}
              onPreview={() => setPreviewReward(reward)}
            />
          ))}
        </div>
      </section>
    )
  }

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

      <div className="text-center text-sm font-semibold text-gray-500">
        {ownedRewards.length}/{REWARDS_CATALOG.length} ödül toplandı
      </div>

      <CharacterPreview size="sm" />

      <div className="rounded-2xl bg-amber-50 p-4">
        <button
          type="button"
          onClick={() => setSetsExpanded((v) => !v)}
          className="flex w-full items-center justify-between text-sm font-bold text-amber-800"
        >
          <span>🎁 Set Bonusları ({REWARD_SETS.length})</span>
          <span>{setsExpanded ? '▲' : '▼'}</span>
        </button>
        {setsExpanded && (
          <div className="mt-3 space-y-2">
            {REWARD_SETS.map((set) => {
              const owned = set.rewardIds.filter((id) => ownedRewards.includes(id)).length
              const complete = owned === set.rewardIds.length
              return (
                <div
                  key={set.id}
                  className={`rounded-xl px-3 py-2 text-xs ${complete ? 'bg-green-100 text-green-800' : 'bg-white text-gray-600'}`}
                >
                  <span className="font-bold">{set.name}</span>
                  <p className="text-[11px] text-gray-500">{set.description}</p>
                  <p className="mt-0.5">
                    {owned}/{set.rewardIds.length} {complete ? '✅' : `→ +${set.bonusStars} ⭐`}
                  </p>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {REWARD_CATEGORY_ORDER.map(renderCategory)}

      <Link
        to="/collection"
        className="block rounded-2xl bg-purple-100 py-4 text-center text-lg font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
      >
        🎒 Koleksiyonuma Bak
      </Link>

      {celebration?.success && celebration.reward && (
        <PurchaseCelebrationModal
          reward={celebration.reward}
          setBonus={celebration.setBonus}
          onUseNow={handleUseNow}
          onViewCollection={handleViewCollection}
        />
      )}

      {previewReward && (
        <RewardPreviewModal
          reward={previewReward}
          currentAvatar={activeAvatar}
          currentDino={activeDinoSkin}
          currentItem={activeItem}
          onClose={() => setPreviewReward(null)}
          onPurchase={() => handlePurchase(previewReward.id)}
          canAfford={stars >= previewReward.cost}
        />
      )}
    </div>
  )
}
