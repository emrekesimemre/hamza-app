import { useNavigate } from 'react-router-dom'
import type { Mission } from '@/missions/types/mission.types'
import { useMissionStore } from '@/store/useMissionStore'
import { useState } from 'react'
import { CompletionModal } from '@/components/common/CompletionModal'

interface StubMissionRunnerProps {
  mission: Mission
}

export function StubMissionRunner({ mission }: StubMissionRunnerProps) {
  const navigate = useNavigate()
  const completeMission = useMissionStore((s) => s.completeMission)
  const childName = useMissionStore((s) => s.childName)
  const stars = useMissionStore((s) => s.stars)
  const starsEarnedToday = useMissionStore((s) => s.starsEarnedToday)
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached)
  const currentMissionProgress = useMissionStore((s) => s.currentMissionProgress)

  const [showModal, setShowModal] = useState(false)
  const [result, setResult] = useState({
    starsEarned: 0,
    allDone: false,
    bonusStars: 0,
    streakBonus: 0,
    trioBonusStars: 0,
    newBadges: [] as string[],
  })

  const handleComplete = () => {
    const res = completeMission(mission.id)
    setResult(res)
    setShowModal(true)
  }

  const handleContinue = () => {
    setShowModal(false)
    navigate('/')
  }

  const handleGoToRewards = () => {
    setShowModal(false)
    navigate('/rewards')
  }

  const timedOut = currentMissionProgress?.timedOutBeforeComplete ?? false

  return (
    <div className="mx-auto max-w-lg">
      <div className="animate-bounce-in rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-4 text-center text-7xl">{mission.icon}</div>
        <h1 className="mb-2 text-center text-2xl font-extrabold text-gray-800">{mission.title}</h1>
        <p className="mb-6 text-center text-gray-500">{mission.description}</p>

        <div className="mb-8 rounded-2xl bg-sky-50 p-6 text-center">
          <p className="text-lg font-semibold text-sky-700">
            🎮 Bu macera yakında gerçek oyunla gelecek!
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Şimdilik test için aşağıdaki butona basarak macerayı tamamlayabilirsin.
          </p>
        </div>

        {timeLimitReached && (
          <div className="mb-4 rounded-2xl bg-orange-50 p-4 text-center text-orange-700">
            ⏰ Süren doldu! Bu macerayı bitir ama yıldız kazanamayabilirsin.
          </div>
        )}

        {timedOut && (
          <div className="mb-4 rounded-2xl bg-orange-50 p-4 text-center text-orange-700">
            Süre dolduğu için yıldız kazanamayacaksın.
          </div>
        )}

        <button
          type="button"
          onClick={handleComplete}
          className="w-full rounded-2xl bg-grass py-5 text-xl font-bold text-white shadow-lg transition hover:bg-grass-dark active:scale-95"
        >
          Macera Tamamla ⭐ +{mission.rewardStars}
        </button>
      </div>

      {showModal && (
        <CompletionModal
          starsEarned={result.starsEarned}
          allDone={result.allDone}
          childName={childName}
          totalStars={stars}
          starsEarnedToday={starsEarnedToday}
          bonusStars={result.bonusStars}
          streakBonus={result.streakBonus}
          trioBonusStars={result.trioBonusStars}
          newBadges={result.newBadges}
          onContinue={handleContinue}
          onGoToRewards={handleGoToRewards}
        />
      )}
    </div>
  )
}
