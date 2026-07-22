import { useEffect, useRef } from 'react'
import { useMissionStore } from '@/store/useMissionStore'
import { isTabActive, TIME_WARNINGS, getRemainingSeconds } from '@/utils/timer'

export function useActiveTimer() {
  const tickActiveSeconds = useMissionStore((s) => s.tickActiveSeconds)
  const dailyUsedSeconds = useMissionStore((s) => s.dailyUsedSeconds)
  const dailyTimeLimitSeconds = useMissionStore((s) => s.dailyTimeLimitSeconds)
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached)
  const shownWarnings = useRef<Set<number>>(new Set())
  const lastTick = useRef<number | null>(null)

  useEffect(() => {
    if (timeLimitReached) return

    const interval = window.setInterval(() => {
      if (!isTabActive()) {
        lastTick.current = null
        return
      }

      const now = Date.now()
      if (lastTick.current !== null) {
        const elapsed = Math.floor((now - lastTick.current) / 1000)
        if (elapsed > 0) {
          tickActiveSeconds(elapsed)
        }
      }
      lastTick.current = now
    }, 1000)

    const handleVisibility = () => {
      if (!isTabActive()) lastTick.current = null
    }

    window.addEventListener('focus', handleVisibility)
    window.addEventListener('blur', handleVisibility)
    document.addEventListener('visibilitychange', handleVisibility)

    return () => {
      clearInterval(interval)
      window.removeEventListener('focus', handleVisibility)
      window.removeEventListener('blur', handleVisibility)
      document.removeEventListener('visibilitychange', handleVisibility)
    }
  }, [tickActiveSeconds, timeLimitReached])

  const remaining = getRemainingSeconds(dailyUsedSeconds, dailyTimeLimitSeconds)

  useEffect(() => {
    if (timeLimitReached) return

    for (const warning of TIME_WARNINGS) {
      if (
        remaining <= warning.remainingSeconds &&
        remaining > warning.remainingSeconds - 60 &&
        !shownWarnings.current.has(warning.remainingSeconds)
      ) {
        shownWarnings.current.add(warning.remainingSeconds)
      }
    }
  }, [remaining, timeLimitReached])

  return { remaining, dailyUsedSeconds, dailyTimeLimitSeconds }
}

export function useTimeWarning(): string | null {
  const dailyUsedSeconds = useMissionStore((s) => s.dailyUsedSeconds)
  const dailyTimeLimitSeconds = useMissionStore((s) => s.dailyTimeLimitSeconds)
  const timeLimitReached = useMissionStore((s) => s.timeLimitReached)

  if (timeLimitReached) return null

  const remaining = getRemainingSeconds(dailyUsedSeconds, dailyTimeLimitSeconds)

  for (const warning of TIME_WARNINGS) {
    if (remaining <= warning.remainingSeconds && remaining > warning.remainingSeconds - 60) {
      return warning.message
    }
  }

  return null
}

export function useDayInitializer() {
  const checkAndInitializeDay = useMissionStore((s) => s.checkAndInitializeDay)
  const pruneRecentMissionHistory = useMissionStore((s) => s.pruneRecentMissionHistory)

  useEffect(() => {
    checkAndInitializeDay()
    pruneRecentMissionHistory()
  }, [checkAndInitializeDay, pruneRecentMissionHistory])
}
