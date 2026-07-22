import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Mission } from '@/missions/types/mission.types'
import { CompletionModal } from '@/components/common/CompletionModal'
import { useMissionStore } from '@/store/useMissionStore'

interface MissionCompleteHandlerProps {
  mission: Mission
  children: (onComplete: () => void) => React.ReactNode
}

export function MissionCompleteHandler({ mission, children }: MissionCompleteHandlerProps) {
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

  const timedOut = currentMissionProgress?.timedOutBeforeComplete ?? false

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

  return (
    <div className="mx-auto max-w-lg">
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

      {children(handleComplete)}

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
