import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { DAILY_MISSION_COUNT, BONUS_TRIO_STARS } from '@/constants/dailyRotation'
import { shouldClaimBonusTrio, shouldIncrementBonusCount } from '@/missions/engine/hybridMissionLogic'
import { REWARDS_CATALOG } from '@/constants/rewards'
import { getCompletedSets } from '@/constants/rewardSets'
import { checkNewAchievements } from '@/constants/achievements'
import { getMissionById } from '@/missions/catalog/missionCatalog'
import { adjustDifficulty, createDefaultDifficultyMap } from '@/missions/engine/difficultyEngine'
import { generateDailyMissions } from '@/missions/engine/missionGenerator'
import type {
  DailyMission,
  Difficulty,
  LockReason,
  MissionProgress,
  MissionType,
  RecentMissionEntry,
} from '@/missions/types/mission.types'
import type { ProgressLog } from '@/types/progress.types'
import type { PurchaseRewardResult, RewardPurchaseLog, SetBonusResult } from '@/types/rewards.types'
import { getTodayISO, daysBetween } from '@/utils/date'
import { STORAGE_KEY } from '@/utils/storage'
import { DEFAULT_DAILY_TIME_LIMIT_SECONDS } from '@/utils/timer'
import { hashPin } from '@/utils/pin'
import { playSound } from '@/utils/sound'

interface MissionStoreState {
  childName: string
  lastLoginDate: string
  dailyMissions: DailyMission[]
  dailyCompletedMissionCount: number
  completedTodayIds: string[]
  dailyUsedSeconds: number
  dailyTimeLimitSeconds: number
  timeLimitReached: boolean
  isLocked: boolean
  lockReason: LockReason
  currentMissionId: string | null
  currentMissionProgress: MissionProgress | null
  recentMissionHistory: RecentMissionEntry[]
  difficultyByType: Record<MissionType, Difficulty>
  progress: ProgressLog[]
  stars: number
  ownedRewards: string[]
  activeAvatar: string | null
  activeDinoSkin: string | null
  activeItem: string | null
  rewardPurchaseHistory: RewardPurchaseLog[]
  claimedSetBonuses: string[]
  soundEnabled: boolean
  onboardingCompleted: boolean
  parentPinHash: string | null
  lastResetDate: string | null
  starsEarnedToday: number
  currentStreak: number
  lastCompletedDay: string | null
  longestStreak: number
  earnedBadges: string[]
  bonusTrioClaimedToday: boolean
}

interface CompleteMissionResult {
  starsEarned: number
  allDone: boolean
  bonusStars: number
  streakBonus: number
  trioBonusStars: number
  newBadges: string[]
}

interface MissionStoreActions {
  checkAndInitializeDay: () => void
  initializeNewDay: (today: string) => void
  completeMission: (missionId: string) => CompleteMissionResult
  addStars: (amount: number) => void
  spendStars: (amount: number) => boolean
  startMission: (missionId: string) => boolean
  exitMission: () => void
  resetDailyProgress: () => void
  lockDay: (reason: LockReason) => void
  finalizeTimeLockIfNeeded: () => void
  setSoundEnabled: (enabled: boolean) => void
  setDailyTimeLimit: (seconds: number) => void
  setParentPin: (pin: string) => Promise<void>
  setChildName: (name: string) => void
  pruneRecentMissionHistory: () => void
  tickActiveSeconds: (seconds: number) => void
  setTimeLimitReached: (reached: boolean) => void
  completeOnboarding: () => void
  purchaseReward: (rewardId: string) => PurchaseRewardResult
  activateReward: (rewardId: string) => void
  setActiveAvatar: (rewardId: string) => void
  setActiveDinoSkin: (rewardId: string) => void
  setActiveItem: (rewardId: string) => void
  getMissionCatalogEntry: (missionId: string) => ReturnType<typeof getMissionById>
  recordAnswer: (correct: boolean) => void
}

type MissionStore = MissionStoreState & MissionStoreActions

const STREAK_BONUS_STARS = 5
const PERFECT_BONUS_STARS = 3

const initialToday = getTodayISO()

const initialState: MissionStoreState = {
  childName: 'Hamza',
  lastLoginDate: initialToday,
  dailyMissions: generateDailyMissions(initialToday, [], createDefaultDifficultyMap()),
  dailyCompletedMissionCount: 0,
  completedTodayIds: [],
  dailyUsedSeconds: 0,
  dailyTimeLimitSeconds: DEFAULT_DAILY_TIME_LIMIT_SECONDS,
  timeLimitReached: false,
  isLocked: false,
  lockReason: null,
  currentMissionId: null,
  currentMissionProgress: null,
  recentMissionHistory: [],
  difficultyByType: createDefaultDifficultyMap(),
  progress: [],
  stars: 0,
  ownedRewards: [],
  activeAvatar: null,
  activeDinoSkin: null,
  activeItem: null,
  rewardPurchaseHistory: [],
  claimedSetBonuses: [],
  soundEnabled: true,
  onboardingCompleted: false,
  parentPinHash: null,
  lastResetDate: null,
  starsEarnedToday: 0,
  currentStreak: 0,
  lastCompletedDay: null,
  longestStreak: 0,
  earnedBadges: [],
  bonusTrioClaimedToday: false,
}

function computeStreakUpdate(
  lastCompletedDay: string | null,
  currentStreak: number,
  longestStreak: number,
  today: string,
  allDone: boolean,
): { currentStreak: number; longestStreak: number; streakBonus: number } {
  if (!allDone) return { currentStreak, longestStreak, streakBonus: 0 }

  let newStreak = currentStreak

  if (lastCompletedDay === today) {
    return { currentStreak: newStreak, longestStreak, streakBonus: 0 }
  }

  if (lastCompletedDay === null) {
    newStreak = 1
  } else {
    const gap = daysBetween(lastCompletedDay, today)
    if (gap === 1) {
      newStreak = currentStreak + 1
    } else {
      newStreak = 1
    }
  }

  const newLongest = Math.max(longestStreak, newStreak)
  const streakBonus = newStreak >= 3 && newStreak % 3 === 0 ? STREAK_BONUS_STARS : 0

  return { currentStreak: newStreak, longestStreak: newLongest, streakBonus }
}

export const useMissionStore = create<MissionStore>()(
  persist(
    (set, get) => ({
      ...initialState,

      checkAndInitializeDay: () => {
        const today = getTodayISO()
        const { lastLoginDate, currentMissionId, lockReason } = get()
        if (lockReason === 'missions') {
          set({ isLocked: false, lockReason: null })
        }
        if (today !== lastLoginDate && currentMissionId === null) {
          get().initializeNewDay(today)
        }
      },

      initializeNewDay: (today) => {
        const { recentMissionHistory, difficultyByType } = get()
        get().pruneRecentMissionHistory()

        set({
          dailyMissions: generateDailyMissions(today, recentMissionHistory, difficultyByType),
          dailyUsedSeconds: 0,
          timeLimitReached: false,
          dailyCompletedMissionCount: 0,
          completedTodayIds: [],
          bonusTrioClaimedToday: false,
          isLocked: false,
          lockReason: null,
          currentMissionProgress: null,
          currentMissionId: null,
          lastLoginDate: today,
          starsEarnedToday: 0,
        })
      },

      completeMission: (missionId) => {
        const state = get()
        const mission = getMissionById(missionId)
        if (!mission) {
          return {
            starsEarned: 0,
            allDone: false,
            bonusStars: 0,
            streakBonus: 0,
            trioBonusStars: 0,
            newBadges: [],
          }
        }

        const alreadyCompleted = state.completedTodayIds.includes(missionId)
        const isBonusMission = state.dailyMissions.some((dm) => dm.missionId === missionId)
        const timedOut = state.currentMissionProgress?.timedOutBeforeComplete ?? false
        let starsEarned = 0
        let bonusStars = 0

        const correctCount = state.currentMissionProgress?.correctCount ?? 0
        const wrongCount = state.currentMissionProgress?.wrongCount ?? 0
        const totalAnswers = correctCount + wrongCount
        const lastMissionPerfect = wrongCount === 0 && totalAnswers >= 5

        if (!alreadyCompleted) {
          let dailyMissions = state.dailyMissions
          let dailyCompletedMissionCount = state.dailyCompletedMissionCount

          if (shouldIncrementBonusCount(isBonusMission, false)) {
            dailyMissions = state.dailyMissions.map((dm) =>
              dm.missionId === missionId ? { ...dm, status: 'done' as const } : dm,
            )
            dailyCompletedMissionCount = state.dailyCompletedMissionCount + 1
          }

          starsEarned = timedOut ? 0 : mission.rewardStars

          if (!timedOut && lastMissionPerfect) {
            bonusStars += PERFECT_BONUS_STARS
          }

          const startedAt = state.currentMissionProgress?.startedAt
          if (!timedOut && startedAt && mission.estimatedMinutes) {
            const elapsedMin = (Date.now() - new Date(startedAt).getTime()) / 60000
            if (elapsedMin < mission.estimatedMinutes) {
              bonusStars += 2
            }
          }

          const progressEntry: ProgressLog = {
            missionId,
            missionType: mission.type,
            subject: mission.subject,
            correctCount,
            wrongCount,
            completedAt: new Date().toISOString(),
            starsEarned: starsEarned + bonusStars,
          }

          const newDifficulty = adjustDifficulty(
            mission.type,
            state.difficultyByType[mission.type] ?? 1,
            [...state.progress, progressEntry],
          )

          set({
            completedTodayIds: [...state.completedTodayIds, missionId],
            dailyMissions,
            dailyCompletedMissionCount,
            stars: state.stars + starsEarned + bonusStars,
            starsEarnedToday: state.starsEarnedToday + starsEarned + bonusStars,
            recentMissionHistory: [
              ...state.recentMissionHistory,
              { missionId, completedDate: state.lastLoginDate },
            ],
            currentMissionProgress: state.currentMissionProgress
              ? { ...state.currentMissionProgress, isCompleted: true }
              : null,
            currentMissionId: null,
            progress: [...state.progress, progressEntry],
            difficultyByType: {
              ...state.difficultyByType,
              [mission.type]: newDifficulty,
            },
          })
        } else {
          set({
            currentMissionProgress: state.currentMissionProgress
              ? { ...state.currentMissionProgress, isCompleted: true }
              : null,
            currentMissionId: null,
          })
        }

        const updated = get()
        const bonusAllDone = updated.dailyCompletedMissionCount >= DAILY_MISSION_COUNT
        let streakBonus = 0
        let trioBonusStars = 0

        if (shouldClaimBonusTrio(updated.dailyCompletedMissionCount, updated.bonusTrioClaimedToday)) {
          trioBonusStars = BONUS_TRIO_STARS
          get().addStars(trioBonusStars)

          const today = getTodayISO()
          const streakUpdate = computeStreakUpdate(
            updated.lastCompletedDay,
            updated.currentStreak,
            updated.longestStreak,
            today,
            true,
          )
          streakBonus = streakUpdate.streakBonus

          if (streakBonus > 0) {
            get().addStars(streakBonus)
            if (updated.soundEnabled) playSound('streak')
          }

          set({
            bonusTrioClaimedToday: true,
            currentStreak: streakUpdate.currentStreak,
            longestStreak: streakUpdate.longestStreak,
            lastCompletedDay: today,
            starsEarnedToday: get().starsEarnedToday,
          })
        }

        const mathMissions = updated.progress.filter((p) => p.subject === 'math').length
        const newBadges = checkNewAchievements(updated.earnedBadges, {
          totalMissionsCompleted: updated.progress.length,
          mathMissionsCompleted: mathMissions,
          stars: get().stars,
          currentStreak: get().currentStreak,
          longestStreak: get().longestStreak,
          lastMissionPerfect,
        })

        if (newBadges.length > 0) {
          set({ earnedBadges: [...updated.earnedBadges, ...newBadges] })
        }

        const today = getTodayISO()
        if (today !== get().lastLoginDate) {
          get().initializeNewDay(today)
        }

        get().finalizeTimeLockIfNeeded()

        if (!timedOut && updated.soundEnabled) playSound('complete')

        return {
          starsEarned: starsEarned + bonusStars,
          allDone: bonusAllDone && trioBonusStars > 0,
          bonusStars,
          streakBonus,
          trioBonusStars,
          newBadges,
        }
      },

      addStars: (amount) => {
        set((s) => ({ stars: s.stars + amount, starsEarnedToday: s.starsEarnedToday + amount }))
      },

      spendStars: (amount) => {
        const { stars } = get()
        if (stars < amount) return false
        set({ stars: stars - amount })
        return true
      },

      startMission: (missionId) => {
        const state = get()
        if (state.timeLimitReached && state.currentMissionId === null) return false

        const mission = getMissionById(missionId)
        if (!mission) return false

        const inBonus = state.dailyMissions.some((dm) => dm.missionId === missionId)
        const dailyMissions = inBonus
          ? state.dailyMissions.map((dm) =>
              dm.missionId === missionId && dm.status !== 'done'
                ? { ...dm, status: 'active' as const }
                : dm,
            )
          : state.dailyMissions

        set({
          dailyMissions,
          currentMissionId: missionId,
          currentMissionProgress: {
            missionId,
            step: 0,
            correctCount: 0,
            wrongCount: 0,
            startedAt: new Date().toISOString(),
            isCompleted: false,
            timedOutBeforeComplete: false,
          },
        })

        return true
      },

      exitMission: () => {
        const state = get()
        const dailyMissions = state.dailyMissions.map((dm) =>
          dm.missionId === state.currentMissionId && dm.status === 'active'
            ? { ...dm, status: 'pending' as const }
            : dm,
        )

        set({
          dailyMissions,
          currentMissionId: null,
          currentMissionProgress: null,
        })

        get().finalizeTimeLockIfNeeded()
      },

      resetDailyProgress: () => {
        const today = getTodayISO()
        const { recentMissionHistory, difficultyByType } = get()

        set({
          dailyMissions: generateDailyMissions(today, recentMissionHistory, difficultyByType),
          dailyUsedSeconds: 0,
          timeLimitReached: false,
          dailyCompletedMissionCount: 0,
          completedTodayIds: [],
          bonusTrioClaimedToday: false,
          isLocked: false,
          lockReason: null,
          currentMissionProgress: null,
          currentMissionId: null,
          lastLoginDate: today,
          starsEarnedToday: 0,
          lastResetDate: today,
        })
      },

      lockDay: (reason) => {
        if (!reason) return
        set({ isLocked: true, lockReason: reason })
      },

      finalizeTimeLockIfNeeded: () => {
        const { timeLimitReached, currentMissionId } = get()
        if (timeLimitReached && currentMissionId === null) {
          get().lockDay('time')
        }
      },

      setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),

      setDailyTimeLimit: (seconds) => set({ dailyTimeLimitSeconds: seconds }),

      setChildName: (name) => set({ childName: name.trim() || 'Hamza' }),

      setParentPin: async (pin) => {
        const parentPinHash = await hashPin(pin)
        set({ parentPinHash })
      },

      pruneRecentMissionHistory: () => {
        const today = getTodayISO()
        set((s) => ({
          recentMissionHistory: s.recentMissionHistory.filter(
            (entry) => daysBetween(entry.completedDate, today) <= 3,
          ),
        }))
      },

      tickActiveSeconds: (seconds) => {
        const state = get()
        const newUsed = state.dailyUsedSeconds + seconds
        const reached = newUsed >= state.dailyTimeLimitSeconds

        set({
          dailyUsedSeconds: newUsed,
          timeLimitReached: reached || state.timeLimitReached,
        })

        if (reached) {
          if (state.currentMissionId === null) {
            get().lockDay('time')
          } else {
            set((s) => ({
              currentMissionProgress: s.currentMissionProgress
                ? { ...s.currentMissionProgress, timedOutBeforeComplete: true }
                : null,
            }))
          }
        }
      },

      setTimeLimitReached: (reached) => {
        set({ timeLimitReached: reached })
        if (reached) get().finalizeTimeLockIfNeeded()
      },

      completeOnboarding: () => set({ onboardingCompleted: true }),

      purchaseReward: (rewardId) => {
        const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)
        if (!reward) return { success: false }

        const { ownedRewards, earnedBadges } = get()
        if (ownedRewards.includes(rewardId)) return { success: false }
        if (!get().spendStars(reward.cost)) return { success: false }

        const purchaseLog: RewardPurchaseLog = {
          rewardId: reward.id,
          rewardName: reward.name,
          icon: reward.icon,
          purchasedAt: new Date().toISOString(),
          cost: reward.cost,
        }

        set((s) => ({
          ownedRewards: [...s.ownedRewards, rewardId],
          rewardPurchaseHistory: [purchaseLog, ...s.rewardPurchaseHistory].slice(0, 50),
        }))

        const newBadges: string[] = []
        if (!earnedBadges.includes('first-reward')) {
          newBadges.push('first-reward')
          set((s) => ({ earnedBadges: [...s.earnedBadges, 'first-reward'] }))
        }

        const setBonus = (() => {
          const { ownedRewards, claimedSetBonuses } = get()
          const completed = getCompletedSets(ownedRewards, claimedSetBonuses)
          if (completed.length === 0) return undefined

          const rewardSet = completed[0]
          get().addStars(rewardSet.bonusStars)
          set((s) => ({ claimedSetBonuses: [...s.claimedSetBonuses, rewardSet.id] }))

          return {
            setId: rewardSet.id,
            setName: rewardSet.name,
            bonusStars: rewardSet.bonusStars,
            badgeId: rewardSet.badgeId,
          } satisfies SetBonusResult
        })()

        if (setBonus?.badgeId && !get().earnedBadges.includes(setBonus.badgeId)) {
          newBadges.push(setBonus.badgeId)
          set((s) => ({ earnedBadges: [...s.earnedBadges, setBonus.badgeId] }))
        }

        if (get().ownedRewards.length >= 10 && !get().earnedBadges.includes('collector-10')) {
          newBadges.push('collector-10')
          set((s) => ({ earnedBadges: [...s.earnedBadges, 'collector-10'] }))
        }

        playSound('complete')

        return {
          success: true,
          reward,
          setBonus,
          newBadges: newBadges.length > 0 ? newBadges : undefined,
        }
      },

      activateReward: (rewardId) => {
        const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)
        if (!reward) return
        const { ownedRewards } = get()
        if (!ownedRewards.includes(rewardId)) return

        if (reward.category === 'avatar') get().setActiveAvatar(rewardId)
        if (reward.category === 'dino-skin') get().setActiveDinoSkin(rewardId)
        if (reward.category === 'item') get().setActiveItem(rewardId)
      },

      setActiveAvatar: (rewardId) => {
        const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)
        if (reward?.category === 'avatar') {
          set({ activeAvatar: reward.icon })
        }
      },

      setActiveDinoSkin: (rewardId) => {
        const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)
        if (reward?.category === 'dino-skin') {
          set({ activeDinoSkin: reward.icon })
        }
      },

      setActiveItem: (rewardId) => {
        const reward = REWARDS_CATALOG.find((r) => r.id === rewardId)
        if (reward?.category === 'item') {
          set({ activeItem: reward.icon })
        }
      },

      getMissionCatalogEntry: (missionId) => getMissionById(missionId),

      recordAnswer: (correct) => {
        set((s) => {
          if (!s.currentMissionProgress) return s
          return {
            currentMissionProgress: {
              ...s.currentMissionProgress,
              correctCount: s.currentMissionProgress.correctCount + (correct ? 1 : 0),
              wrongCount: s.currentMissionProgress.wrongCount + (correct ? 0 : 1),
              step: s.currentMissionProgress.step + 1,
            },
          }
        })
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({
        childName: state.childName,
        lastLoginDate: state.lastLoginDate,
        dailyMissions: state.dailyMissions,
        dailyCompletedMissionCount: state.dailyCompletedMissionCount,
        completedTodayIds: state.completedTodayIds,
        dailyUsedSeconds: state.dailyUsedSeconds,
        dailyTimeLimitSeconds: state.dailyTimeLimitSeconds,
        timeLimitReached: state.timeLimitReached,
        isLocked: state.isLocked,
        lockReason: state.lockReason,
        currentMissionId: state.currentMissionId,
        currentMissionProgress: state.currentMissionProgress,
        recentMissionHistory: state.recentMissionHistory,
        difficultyByType: state.difficultyByType,
        progress: state.progress,
        stars: state.stars,
        ownedRewards: state.ownedRewards,
        activeAvatar: state.activeAvatar,
        activeDinoSkin: state.activeDinoSkin,
        activeItem: state.activeItem,
        rewardPurchaseHistory: state.rewardPurchaseHistory,
        claimedSetBonuses: state.claimedSetBonuses,
        soundEnabled: state.soundEnabled,
        onboardingCompleted: state.onboardingCompleted,
        parentPinHash: state.parentPinHash,
        lastResetDate: state.lastResetDate,
        starsEarnedToday: state.starsEarnedToday,
        currentStreak: state.currentStreak,
        lastCompletedDay: state.lastCompletedDay,
        longestStreak: state.longestStreak,
        earnedBadges: state.earnedBadges,
        bonusTrioClaimedToday: state.bonusTrioClaimedToday,
      }),
      onRehydrateStorage: () => (state) => {
        if (state?.lockReason === 'missions') {
          state.isLocked = false
          state.lockReason = null
        }

        if (!state) return

        state.dailyMissions = state.dailyMissions.map((dm) =>
          state.completedTodayIds.includes(dm.missionId) && dm.status !== 'done'
            ? { ...dm, status: 'done' as const }
            : dm,
        )

        const doneBonusCount = state.dailyMissions.filter((dm) =>
          state.completedTodayIds.includes(dm.missionId),
        ).length

        if (doneBonusCount !== state.dailyCompletedMissionCount) {
          state.dailyCompletedMissionCount = doneBonusCount
        }
      },
    },
  ),
)
