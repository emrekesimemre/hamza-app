import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ACHIEVEMENTS } from '@/constants/achievements'
import { BONUS_TRIO_STARS } from '@/constants/dailyRotation'
import { useMissionStore } from '@/store/useMissionStore'
import { getMissionById } from '@/missions/catalog/missionCatalog'
import { AppLockScreen } from '@/components/layout/AppLockScreen'
import { DailyProgress } from '@/components/layout/DailyProgress'
import { MissionCatalog } from '@/components/layout/MissionCatalog'
import { MissionCard } from '@/components/missions/MissionCard'
import { OnboardingModal } from '@/components/common/OnboardingModal'
import { StarCounter } from '@/components/layout/StarCounter'
import { DinoMascot, StreakBadge } from '@/components/common/DinoMascot'
import { CharacterPreview } from '@/components/rewards/CharacterPreview'
import { TodaySubjects } from '@/components/layout/TodaySubjects'

export default function DashboardPage() {
  const [showOnboarding, setShowOnboarding] = useState(false)

  const childName = useMissionStore((s) => s.childName)
  const stars = useMissionStore((s) => s.stars)
  const dailyMissions = useMissionStore((s) => s.dailyMissions)
  const completedTodayIds = useMissionStore((s) => s.completedTodayIds)
  const dailyCompletedMissionCount = useMissionStore((s) => s.dailyCompletedMissionCount)
  const bonusTrioClaimedToday = useMissionStore((s) => s.bonusTrioClaimedToday)
  const isLocked = useMissionStore((s) => s.isLocked)
  const lockReason = useMissionStore((s) => s.lockReason)
  const onboardingCompleted = useMissionStore((s) => s.onboardingCompleted)
  const completeOnboarding = useMissionStore((s) => s.completeOnboarding)
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached)
  const earnedBadges = useMissionStore((s) => s.earnedBadges)

  const sortedBonusMissions = [...dailyMissions].sort((a, b) => a.order - b.order)
  const playDisabled = timeLimitReached || (isLocked && lockReason === 'time')

  const mascotMood =
    bonusTrioClaimedToday
      ? 'celebrate'
      : dailyCompletedMissionCount > 0
        ? 'cheer'
        : 'idle'

  useEffect(() => {
    if (!onboardingCompleted) {
      setShowOnboarding(true)
    }
  }, [onboardingCompleted])

  const handleOnboardingComplete = () => {
    completeOnboarding()
    setShowOnboarding(false)
  }

  if (isLocked && lockReason === 'time') {
    return <AppLockScreen lockReason={lockReason} stars={stars} />
  }

  return (
    <>
      {showOnboarding && !onboardingCompleted && (
        <OnboardingModal onComplete={handleOnboardingComplete} />
      )}

      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-sky-700">🦖 OYUN ALANI</h1>
          <p className="mt-1 text-lg font-semibold text-gray-600">Merhaba {childName}!</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
            <StarCounter stars={stars} size="lg" />
            <StreakBadge />
          </div>
        </div>

        <DinoMascot mood={mascotMood} />

        <CharacterPreview size="sm" />

        <section className="rounded-3xl bg-amber-50/80 p-4 ring-1 ring-amber-200">
          <h2 className="mb-1 text-center text-lg font-extrabold text-amber-900">
            Bugünün Bonus Maceraları
          </h2>
          <p className="mb-3 text-center text-xs text-amber-800">
            3 bonusu bitir → +{BONUS_TRIO_STARS} ekstra yıldız
            {bonusTrioClaimedToday && ' · Bonus alındı!'}
          </p>
          <TodaySubjects />
          <div className="my-4">
            <DailyProgress completed={dailyCompletedMissionCount} />
          </div>
          <div className="space-y-4">
            {sortedBonusMissions.map((dm) => {
              const mission = getMissionById(dm.missionId)
              if (!mission) return null
              return (
                <MissionCard
                  key={dm.missionId}
                  mission={mission}
                  dailyMission={dm}
                  variant="bonus"
                  completedToday={completedTodayIds.includes(mission.id)}
                  disabled={playDisabled}
                />
              )
            })}
          </div>
        </section>

        <MissionCatalog disabled={playDisabled} />

        {earnedBadges.length > 0 && (
          <div className="rounded-2xl bg-purple-50 p-4">
            <h3 className="mb-2 text-center font-bold text-purple-700">Rozetlerim</h3>
            <div className="flex flex-wrap justify-center gap-2">
              {earnedBadges.map((id) => {
                const badge = ACHIEVEMENTS.find((a) => a.id === id)
                return badge ? (
                  <span
                    key={id}
                    title={badge.description}
                    className="rounded-xl bg-white px-3 py-2 text-sm font-bold shadow-sm"
                  >
                    {badge.icon} {badge.name}
                  </span>
                ) : null
              })}
            </div>
          </div>
        )}

        <div className="flex flex-col gap-3 pt-4">
          <Link
            to="/rewards"
            className="block rounded-2xl bg-purple-100 py-4 text-center text-lg font-bold text-purple-700 transition hover:bg-purple-200 active:scale-95"
          >
            ⭐ Ödül Mağazası
          </Link>
          <Link
            to="/collection"
            className="block rounded-2xl bg-purple-50 py-3 text-center text-base font-bold text-purple-600 transition hover:bg-purple-100 active:scale-95"
          >
            🎒 Koleksiyonum
          </Link>
          <Link
            to="/parent"
            className="block rounded-2xl bg-gray-100 py-3 text-center text-base font-semibold text-gray-600 transition hover:bg-gray-200 active:scale-95"
          >
            👨‍👩‍👦 Ebeveyn Alanı
          </Link>
        </div>
      </div>
    </>
  )
}
