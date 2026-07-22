import type { Reward } from '@/types/rewards.types'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'
import { DEFAULT_AVATAR, DEFAULT_DINO } from '@/constants/rewards'

interface RewardPreviewModalProps {
  reward: Reward
  currentAvatar: string | null
  currentDino: string | null
  currentItem: string | null
  onClose: () => void
  onPurchase?: () => void
  canAfford?: boolean
}

function previewForReward(
  reward: Reward,
  currentAvatar: string | null,
  currentDino: string | null,
  currentItem: string | null,
) {
  switch (reward.category) {
    case 'avatar':
      return { avatar: reward.icon, dino: currentDino ?? DEFAULT_DINO, item: currentItem }
    case 'dino-skin':
      return { avatar: currentAvatar, dino: reward.icon, item: currentItem }
    case 'item':
      return { avatar: currentAvatar, dino: currentDino ?? DEFAULT_DINO, item: reward.icon }
    default:
      return { avatar: currentAvatar ?? DEFAULT_AVATAR, dino: currentDino ?? DEFAULT_DINO, item: currentItem }
  }
}

export function RewardPreviewModal({
  reward,
  currentAvatar,
  currentDino,
  currentItem,
  onClose,
  onPurchase,
  canAfford,
}: RewardPreviewModalProps) {
  const preview = previewForReward(reward, currentAvatar, currentDino, currentItem)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce-in w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
        <h2 className="mb-2 text-xl font-extrabold text-gray-800">Nasıl Görünecek?</h2>
        <p className="mb-4 text-sm text-gray-500">
          {reward.icon} {reward.name} ile birlikte
        </p>

        <CharacterPreview
          size="md"
          avatar={preview.avatar}
          dinoSkin={preview.dino}
          item={preview.item}
          showLabels
        />

        <div className="mt-6 flex flex-col gap-2">
          {onPurchase && canAfford && (
            <button
              type="button"
              onClick={onPurchase}
              className="w-full rounded-2xl bg-yellow-500 py-3 font-bold text-white transition hover:bg-yellow-600 active:scale-95"
            >
              Satın Al — {reward.cost} ⭐
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl bg-gray-100 py-3 font-bold text-gray-600 transition hover:bg-gray-200 active:scale-95"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  )
}
