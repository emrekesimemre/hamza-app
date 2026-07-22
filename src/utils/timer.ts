export const DEFAULT_DAILY_TIME_LIMIT_SECONDS = 30 * 60

export const TIME_WARNINGS = [
  { remainingSeconds: 10 * 60, message: 'Harika gidiyorsun!' },
  { remainingSeconds: 5 * 60, message: 'Son macerana hazırlan!' },
] as const

export function isTabActive(): boolean {
  return document.visibilityState === 'visible' && document.hasFocus()
}

export function getRemainingSeconds(used: number, limit: number): number {
  return Math.max(0, limit - used)
}
