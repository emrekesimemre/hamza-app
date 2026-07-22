import { useEffect } from 'react'
import type { Reward, SetBonusResult } from '@/types/rewards.types'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'
import { fireConfetti } from '@/utils/confetti'

interface PurchaseCelebrationModalProps {
  reward: Reward
  setBonus?: SetBonusResult
  onUseNow: () => void
  onViewCollection: () => void
}

export function PurchaseCelebrationModal({
  reward,
  setBonus,
  onUseNow,
  onViewCollection,
}: PurchaseCelebrationModalProps) {
  useEffect(() => {
    fireConfetti()
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce-in w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-2 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-extrabold text-gray-800">Tebrikler!</h2>
        <p className="mb-4 text-lg text-gray-600">
          <span className="text-3xl">{reward.icon}</span> {reward.name} artık senin!
        </p>

        <div className="mb-4">
          <CharacterPreview size="sm" />
        </div>

        {setBonus && (
          <div className="mb-4 rounded-2xl bg-amber-50 p-3">
            <p className="font-bold text-amber-700">🎁 {setBonus.setName} tamamlandı!</p>
            <p className="text-sm font-semibold text-amber-600">
              +{setBonus.bonusStars} ⭐ bonus yıldız kazandın!
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onUseNow}
          className="mb-3 w-full rounded-2xl bg-purple-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-purple-600 active:scale-95"
        >
          Hemen Kullan ✨
        </button>
        <button
          type="button"
          onClick={onViewCollection}
          className="w-full rounded-2xl bg-purple-100 py-3 text-base font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
        >
          Koleksiyonuma Bak
        </button>
      </div>
    </div>
  )
}
