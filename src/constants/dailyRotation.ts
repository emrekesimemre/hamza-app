import type { Subject } from '@/missions/types/mission.types'

/**
 * 0=Pazar … 6=Cumartesi — Europe/Istanbul
 *
 * Her gün tam 3 farklı ders → ders başına 1 görev (dengeli karışım).
 * Matematik haftada 6 gün; Perşembe kısa dinlenme günü.
 */
export const DAILY_TOPIC_POOL: Record<number, Subject[]> = {
  0: ['math', 'turkish', 'life'], // Pazar
  1: ['math', 'turkish', 'logic'], // Pazartesi
  2: ['math', 'turkish', 'life'], // Salı
  3: ['math', 'logic', 'life'], // Çarşamba
  4: ['turkish', 'life', 'logic'], // Perşembe — mat yok
  5: ['math', 'turkish', 'logic'], // Cuma
  6: ['math', 'life', 'logic'], // Cumartesi
}

/** Günlük bonus trio (3 önerilen macera) tamamlanınca ekstra yıldız */
export const BONUS_TRIO_STARS = 10

/** Bonus macera sayısı (günlük önerilen 3 görev) */
export const DAILY_MISSION_COUNT = 3
export const RECENT_HISTORY_DAYS = 3

/** Ebeveyn / dashboard için kısa gün adları */
export const WEEKDAY_LABELS: Record<number, string> = {
  0: 'Pazar',
  1: 'Pazartesi',
  2: 'Salı',
  3: 'Çarşamba',
  4: 'Perşembe',
  5: 'Cuma',
  6: 'Cumartesi',
}
