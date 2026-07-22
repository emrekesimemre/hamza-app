import { Link } from 'react-router-dom'
import { REWARDS_CATALOG } from '@/constants/rewards'
import { useMissionStore } from '@/store/useMissionStore'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'

export function AvatarRoom() {
  const ownedRewards = useMissionStore((s) => s.ownedRewards)
  const activeAvatar = useMissionStore((s) => s.activeAvatar)
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)
  const activateReward = useMissionStore((s) => s.activateReward)

  const owned = REWARDS_CATALOG.filter((r) => ownedRewards.includes(r.id))

  const avatars = owned.filter((r) => r.category === 'avatar')
  const dinoSkins = owned.filter((r) => r.category === 'dino-skin')
  const items = owned.filter((r) => r.category === 'item')

  const isActive = (icon: string, category: string) => {
    if (category === 'avatar') return activeAvatar === icon
    if (category === 'dino-skin') return activeDinoSkin === icon
    if (category === 'item') return activeItem === icon
    return false
  }

  const renderCategory = (
    title: string,
    rewards: typeof owned,
  ) => {
    if (rewards.length === 0) return null
    return (
      <div>
        <h3 className="mb-2 text-sm font-bold text-gray-600">{title}</h3>
        <div className="flex flex-wrap justify-center gap-2">
          {rewards.map((r) => (
            <button
              key={r.id}
              type="button"
              onClick={() => activateReward(r.id)}
              className={`rounded-2xl px-4 py-3 text-3xl transition active:scale-95 ${
                isActive(r.icon, r.category)
                  ? 'bg-purple-200 ring-2 ring-purple-400'
                  : 'bg-white hover:bg-purple-50'
              }`}
              title={r.name}
            >
              {r.icon}
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-6 rounded-3xl bg-gradient-to-b from-purple-50 to-sky-50 p-5">
      <h3 className="mb-3 text-center text-lg font-extrabold text-purple-700">
        🎨 Karakter Odası
      </h3>
      <p className="mb-4 text-center text-sm text-gray-500">
        Ödüllerini giydir, kombinini oluştur!
      </p>

      <CharacterPreview size="sm" />

      {owned.length > 0 ? (
        <div className="mt-4 space-y-4">
          {renderCategory('Avatarlar', avatars)}
          {renderCategory('Dino Görünümleri', dinoSkins)}
          {renderCategory('Eşyalar', items)}
        </div>
      ) : (
        <p className="mt-4 text-center text-sm text-gray-500">
          Henüz ödülün yok. Mağazadan bir şeyler al!
        </p>
      )}

      <div className="mt-4 flex flex-col gap-2">
        <Link
          to="/collection"
          className="block rounded-2xl bg-purple-100 py-3 text-center text-sm font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
        >
          Koleksiyonuma Bak
        </Link>
      </div>
    </div>
  )
}
