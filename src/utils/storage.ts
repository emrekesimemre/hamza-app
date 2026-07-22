export const STORAGE_KEY = 'hamza-mission-storage'

export function clearStorage(): void {
  localStorage.removeItem(STORAGE_KEY)
}
