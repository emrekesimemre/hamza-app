import { DAILY_MISSION_COUNT } from '@/constants/dailyRotation'

export function shouldClaimBonusTrio(
  bonusCompletedCount: number,
  bonusTrioClaimedToday: boolean,
  requiredCount: number = DAILY_MISSION_COUNT,
): boolean {
  return bonusCompletedCount >= requiredCount && !bonusTrioClaimedToday
}

export function shouldIncrementBonusCount(
  isBonusMission: boolean,
  alreadyCompletedToday: boolean,
): boolean {
  return isBonusMission && !alreadyCompletedToday
}
