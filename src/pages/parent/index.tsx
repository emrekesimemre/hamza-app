import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ACHIEVEMENTS } from '@/constants/achievements'
import { useMissionStore } from '@/store/useMissionStore'
import { ParentPinGate } from '@/components/parent/ParentPinGate'
import { ActivityChart, SubjectStats } from '@/components/parent/ProgressChart'
import { SUBJECT_LABELS } from '@/missions/types/mission.types'
import type { Subject } from '@/missions/types/mission.types'
import { formatDuration, getTodayISO } from '@/utils/date'
import { ArrowLeft } from 'lucide-react'

export default function ParentPage() {
  const [verified, setVerified] = useState(false)

  const parentPinHash = useMissionStore((s) => s.parentPinHash)
  const setParentPin = useMissionStore((s) => s.setParentPin)
  const childName = useMissionStore((s) => s.childName)
  const setChildName = useMissionStore((s) => s.setChildName)
  const completedTodayIds = useMissionStore((s) => s.completedTodayIds)
  const dailyCompletedMissionCount = useMissionStore((s) => s.dailyCompletedMissionCount)
  const dailyUsedSeconds = useMissionStore((s) => s.dailyUsedSeconds)
  const dailyTimeLimitSeconds = useMissionStore((s) => s.dailyTimeLimitSeconds)
  const soundEnabled = useMissionStore((s) => s.soundEnabled)
  const setSoundEnabled = useMissionStore((s) => s.setSoundEnabled)
  const setDailyTimeLimit = useMissionStore((s) => s.setDailyTimeLimit)
  const resetDailyProgress = useMissionStore((s) => s.resetDailyProgress)
  const lastResetDate = useMissionStore((s) => s.lastResetDate)
  const progress = useMissionStore((s) => s.progress)
  const currentStreak = useMissionStore((s) => s.currentStreak)
  const longestStreak = useMissionStore((s) => s.longestStreak)
  const stars = useMissionStore((s) => s.stars)
  const earnedBadges = useMissionStore((s) => s.earnedBadges)

  if (!verified) {
    return (
      <ParentPinGate
        pinHash={parentPinHash}
        onVerified={() => setVerified(true)}
        onSetupPin={setParentPin}
      />
    )
  }

  const today = getTodayISO()
  const gamesPlayedToday = completedTodayIds.length
  const activityData = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(`${today}T12:00:00`)
    date.setDate(date.getDate() - (6 - i))
    const dateStr = date.toISOString().slice(0, 10)
    const count = progress.filter((log) => log.completedAt.slice(0, 10) === dateStr).length
    return { date: dateStr, count }
  })

  const subjectMap = new Map<Subject, { correct: number; total: number; count: number }>()
  for (const log of progress) {
    const existing = subjectMap.get(log.subject) ?? { correct: 0, total: 0, count: 0 }
    existing.correct += log.correctCount
    existing.total += log.correctCount + log.wrongCount
    existing.count += 1
    subjectMap.set(log.subject, existing)
  }

  const subjectStats = Array.from(subjectMap.entries()).map(([subject, data]) => ({
    subject,
    label: SUBJECT_LABELS[subject],
    accuracy: data.total > 0 ? data.correct / data.total : 0,
    total: data.count,
  }))

  const weakestSubject = subjectStats.sort((a, b) => a.accuracy - b.accuracy)[0]

  const timeOptions = [
    { label: '25 dk', seconds: 25 * 60 },
    { label: '30 dk', seconds: 30 * 60 },
    { label: '35 dk', seconds: 35 * 60 },
  ]

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link
          to="/"
          className="flex items-center gap-1 rounded-xl px-2 py-2 font-semibold text-gray-600 transition hover:bg-white/60"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <h1 className="text-xl font-extrabold text-gray-800">👨‍👩‍👦 Ebeveyn Alanı</h1>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h2 className="mb-4 text-lg font-bold text-gray-700">{childName} — Bugün</h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-amber-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-amber-700">
              {dailyCompletedMissionCount}/3
            </p>
            <p className="text-sm text-gray-500">Bonus macera</p>
          </div>
          <div className="rounded-2xl bg-sky-50 p-4 text-center">
            <p className="text-2xl font-extrabold text-sky-700">{gamesPlayedToday}</p>
            <p className="text-sm text-gray-500">Toplam oyun (bugün)</p>
          </div>
          <div className="rounded-2xl bg-green-50 p-4 text-center sm:col-span-1 col-span-2 sm:col-auto">
            <p className="text-2xl font-extrabold text-green-700">
              {formatDuration(dailyUsedSeconds)}
            </p>
            <p className="text-sm text-gray-500">
              / {Math.floor(dailyTimeLimitSeconds / 60)} dk
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h3 className="mb-3 font-bold text-gray-700">Haftalık Özet</h3>
        <div className="grid grid-cols-3 gap-3 text-center">
          <div className="rounded-xl bg-orange-50 p-3">
            <p className="text-xl font-extrabold text-orange-600">🔥 {currentStreak}</p>
            <p className="text-xs text-gray-500">Seri</p>
          </div>
          <div className="rounded-xl bg-yellow-50 p-3">
            <p className="text-xl font-extrabold text-yellow-600">⭐ {stars}</p>
            <p className="text-xs text-gray-500">Toplam</p>
          </div>
          <div className="rounded-xl bg-purple-50 p-3">
            <p className="text-xl font-extrabold text-purple-600">🏅 {longestStreak}</p>
            <p className="text-xs text-gray-500">En uzun seri</p>
          </div>
        </div>
        {weakestSubject && (
          <p className="mt-3 text-sm text-gray-500">
            En çok zorlanılan ders: <strong>{weakestSubject.label}</strong> (
            {Math.round(weakestSubject.accuracy * 100)}%)
          </p>
        )}
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <ActivityChart data={activityData} />
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-md">
        <h3 className="mb-4 font-bold text-gray-700">Ders Bazlı Başarı</h3>
        <SubjectStats stats={subjectStats} />
      </div>

      {earnedBadges.length > 0 && (
        <div className="rounded-3xl bg-white p-6 shadow-md">
          <h3 className="mb-3 font-bold text-gray-700">Kazanılan Rozetler</h3>
          <div className="flex flex-wrap gap-2">
            {earnedBadges.map((id) => {
              const badge = ACHIEVEMENTS.find((a) => a.id === id)
              return badge ? (
                <span key={id} className="rounded-xl bg-purple-50 px-3 py-2 text-sm font-semibold">
                  {badge.icon} {badge.name}
                </span>
              ) : null
            })}
          </div>
        </div>
      )}

      <div className="rounded-3xl bg-white p-6 shadow-md space-y-4">
        <h3 className="font-bold text-gray-700">Ayarlar</h3>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-600">Çocuğun adı</p>
          <input
            type="text"
            value={childName}
            onChange={(e) => setChildName(e.target.value)}
            className="w-full rounded-xl border-2 border-gray-200 px-4 py-2 font-semibold text-gray-700 focus:border-sky-400 focus:outline-none"
            maxLength={20}
          />
        </div>

        <div>
          <p className="mb-2 text-sm font-semibold text-gray-600">Günlük süre limiti</p>
          <div className="flex gap-2">
            {timeOptions.map((opt) => (
              <button
                key={opt.seconds}
                type="button"
                onClick={() => setDailyTimeLimit(opt.seconds)}
                className={`flex-1 rounded-xl py-2 text-sm font-bold transition ${
                  dailyTimeLimitSeconds === opt.seconds
                    ? 'bg-sky-500 text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-semibold text-gray-600">Ses efektleri</span>
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className={`rounded-xl px-4 py-2 font-bold transition ${
              soundEnabled ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            {soundEnabled ? 'Açık' : 'Kapalı'}
          </button>
        </div>

        <div>
          <button
            type="button"
            onClick={() => {
              if (window.confirm('Bugünkü ilerlemeyi sıfırlamak istediğine emin misin?')) {
                resetDailyProgress()
              }
            }}
            className="w-full rounded-2xl bg-red-100 py-3 font-bold text-red-600 transition hover:bg-red-200 active:scale-95"
          >
            Bugünü Sıfırla
          </button>
          {lastResetDate && (
            <p className="mt-2 text-center text-xs text-gray-400">
              Son sıfırlama: {lastResetDate}
            </p>
          )}
        </div>
      </div>

      <Link
        to="/parent/progress"
        className="block rounded-2xl bg-gray-100 py-3 text-center font-semibold text-gray-600 transition hover:bg-gray-200"
      >
        Detaylı İlerleme →
      </Link>
    </div>
  )
}
