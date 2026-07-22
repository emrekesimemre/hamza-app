import { useEffect } from 'react'
import { getAchievementById } from '@/constants/achievements'
import { fireConfetti, fireStarBurst } from '@/utils/confetti'

interface CompletionModalProps {
  starsEarned: number
  allDone: boolean
  childName: string
  totalStars: number
  starsEarnedToday: number
  bonusStars?: number
  streakBonus?: number
  trioBonusStars?: number
  newBadges?: string[]
  onContinue: () => void
  onGoToRewards?: () => void
}

export function CompletionModal({
  starsEarned,
  allDone,
  childName,
  totalStars,
  starsEarnedToday,
  bonusStars = 0,
  streakBonus = 0,
  trioBonusStars = 0,
  newBadges = [],
  onContinue,
  onGoToRewards,
}: CompletionModalProps) {
  useEffect(() => {
    if (allDone) {
      fireConfetti()
    } else {
      fireStarBurst()
    }
  }, [allDone])

  const bonusLine =
    bonusStars > 0 ? `(+${bonusStars} bonus dahil)` : undefined

  if (allDone) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="animate-bounce-in w-full max-w-md rounded-3xl bg-white p-8 text-center shadow-2xl">
          <div className="mb-4 text-6xl">🏆</div>
          <h2 className="mb-2 text-2xl font-extrabold text-gray-800">
            3 BONUS MACERAYI TAMAMLADIN!
          </h2>
          <p className="mb-4 text-lg text-gray-600">Harika iş çıkardın {childName}!</p>
          {trioBonusStars > 0 && (
            <div className="mb-2 text-lg font-bold text-amber-600">
              🎁 Bonus ödül: +{trioBonusStars} ⭐
            </div>
          )}
          <div className="mb-2 text-lg font-bold text-yellow-600">
            ⭐ Bugün kazandığın: {starsEarnedToday}
          </div>
          {streakBonus > 0 && (
            <div className="mb-2 text-lg font-bold text-orange-500">
              🔥 Seri bonusu: +{streakBonus} ⭐
            </div>
          )}
          <div className="mb-6 text-lg font-bold text-yellow-600">
            ⭐ Toplam yıldızın: {totalStars}
          </div>
          {newBadges.length > 0 && (
            <div className="mb-4 rounded-2xl bg-purple-50 p-3">
              <p className="font-bold text-purple-700">Yeni rozet kazandın!</p>
              {newBadges.map((id) => {
                const badge = getAchievementById(id)
                return badge ? (
                  <p key={id} className="mt-1 text-sm text-purple-600">
                    {badge.icon} {badge.name}
                  </p>
                ) : null
              })}
            </div>
          )}
          <p className="mb-6 text-base text-gray-500">
            Başka oyunlar da seni bekliyor — istediğini seç!
          </p>
          <button
            type="button"
            onClick={onContinue}
            className="mb-3 w-full rounded-2xl bg-sky-500 py-4 text-lg font-bold text-white shadow-lg transition hover:bg-sky-600 active:scale-95"
          >
            OYUN SEÇ
          </button>
          <button
            type="button"
            onClick={onGoToRewards ?? onContinue}
            className="w-full rounded-2xl bg-purple-100 py-3 text-base font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
          >
            Ödül Mağazası
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="animate-bounce-in w-full max-w-sm rounded-3xl bg-white p-8 text-center shadow-2xl">
        <div className="mb-4 text-6xl">🎉</div>
        <h2 className="mb-2 text-2xl font-extrabold text-gray-800">HARIKA!</h2>
        <p className="mb-4 text-lg text-gray-600">Görevi tamamladın!</p>
        {starsEarned > 0 && (
          <div className="animate-pulse-star mb-2 text-2xl font-extrabold text-yellow-500">
            ⭐ +{starsEarned} Yıldız
          </div>
        )}
        {bonusLine && (
          <p className="mb-4 text-sm font-semibold text-green-600">{bonusLine}</p>
        )}
        {newBadges.length > 0 && (
          <div className="mb-4 rounded-2xl bg-purple-50 p-3">
            {newBadges.map((id) => {
              const badge = getAchievementById(id)
              return badge ? (
                <p key={id} className="text-sm font-bold text-purple-700">
                  {badge.icon} Yeni rozet: {badge.name}
                </p>
              ) : null
            })}
          </div>
        )}
        <button
          type="button"
          onClick={onContinue}
          className="w-full rounded-2xl bg-grass py-4 text-lg font-bold text-white shadow-lg transition hover:bg-grass-dark active:scale-95"
        >
          DEVAM ET
        </button>
      </div>
    </div>
  )
}
