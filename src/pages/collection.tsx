import { Link } from 'react-router-dom'
import {
  REWARDS_CATALOG,
  REWARD_CATEGORY_LABELS,
  REWARD_CATEGORY_ORDER,
  getRewardsByCategory,
} from '@/constants/rewards'
import { REWARD_SETS } from '@/constants/rewardSets'
import { useMissionStore } from '@/store/useMissionStore'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'
import type { RewardCategory } from '@/types/rewards.types'
import { ArrowLeft } from 'lucide-react'

export default function CollectionPage() {
  const ownedRewards = useMissionStore((s) => s.ownedRewards)
  const activeAvatar = useMissionStore((s) => s.activeAvatar)
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)
  const activateReward = useMissionStore((s) => s.activateReward)
  const claimedSetBonuses = useMissionStore((s) => s.claimedSetBonuses)

  const isActive = (icon: string, category: string) => {
    if (category === 'avatar') return activeAvatar === icon
    if (category === 'dino-skin') return activeDinoSkin === icon
    if (category === 'item') return activeItem === icon
    return false
  }

  const renderCategory = (category: RewardCategory) => {
    const allInCategory = getRewardsByCategory(category)
    const owned = allInCategory.filter((r) => ownedRewards.includes(r.id))
    if (owned.length === 0) return null

    return (
      <section key={category}>
        <h3 className="mb-2 text-sm font-bold text-gray-600">
          {REWARD_CATEGORY_LABELS[category]} ({owned.length}/{allInCategory.length})
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {owned.map((reward) => (
            <button
              key={reward.id}
              type="button"
              onClick={() => activateReward(reward.id)}
              className={`rounded-2xl p-4 text-center transition active:scale-95 ${
                isActive(reward.icon, reward.category)
                  ? 'bg-purple-200 ring-2 ring-purple-400'
                  : 'bg-white shadow-sm hover:bg-purple-50'
              }`}
            >
              <span className="text-4xl">{reward.icon}</span>
              <p className="mt-2 text-xs font-bold text-gray-700">{reward.name}</p>
              {isActive(reward.icon, reward.category) && (
                <p className="mt-1 text-xs font-bold text-purple-600">Aktif ✨</p>
              )}
            </button>
          ))}
        </div>
      </section>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/rewards"
          className="flex items-center gap-1 rounded-xl px-2 py-2 font-semibold text-gray-600 transition hover:bg-white/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-2xl font-extrabold text-purple-700">🎒 Koleksiyonum</h1>
      </div>

      <div className="text-center text-sm font-semibold text-gray-500">
        {ownedRewards.length}/{REWARDS_CATALOG.length} ödül toplandı
      </div>

      <div>
        <h2 className="mb-2 text-center text-sm font-bold text-gray-600">Bugünkü Look&apos;um</h2>
        <CharacterPreview size="lg" showLabels />
      </div>

      {ownedRewards.length === 0 ? (
        <div className="rounded-3xl bg-purple-50 p-8 text-center">
          <p className="mb-4 text-4xl">🛍️</p>
          <p className="font-bold text-purple-700">Henüz ödülün yok</p>
          <p className="mt-1 text-sm text-gray-500">Maceraları tamamla, yıldız kazan!</p>
          <Link
            to="/rewards"
            className="mt-4 inline-block rounded-2xl bg-purple-500 px-6 py-3 font-bold text-white transition hover:bg-purple-600 active:scale-95"
          >
            Mağazaya Git
          </Link>
        </div>
      ) : (
        <div className="space-y-6">{REWARD_CATEGORY_ORDER.map(renderCategory)}</div>
      )}

      <div className="rounded-2xl bg-amber-50 p-4">
        <h3 className="mb-3 text-center font-bold text-amber-800">Set İlerlemesi</h3>
        <div className="space-y-3">
          {REWARD_SETS.map((set) => {
            const ownedCount = set.rewardIds.filter((id) => ownedRewards.includes(id)).length
            const claimed = claimedSetBonuses.includes(set.id)
            const progress = Math.round((ownedCount / set.rewardIds.length) * 100)
            return (
              <div key={set.id} className="rounded-xl bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-800">{set.name}</span>
                  <span className="text-xs font-semibold text-gray-500">
                    {claimed ? '✅ Tamamlandı' : `${ownedCount}/${set.rewardIds.length}`}
                  </span>
                </div>
                <div className="mt-2 h-2 overflow-hidden rounded-full bg-gray-100">
                  <div
                    className="h-full rounded-full bg-amber-400 transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                {!claimed && (
                  <p className="mt-1 text-xs text-amber-700">Tamamla → +{set.bonusStars} ⭐</p>
                )}
              </div>
            )
          })}
        </div>
      </div>

      <Link
        to="/rewards"
        className="block rounded-2xl bg-purple-100 py-3 text-center font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
      >
        Mağazaya Git
      </Link>
    </div>
  )
}
