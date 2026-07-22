import { DEFAULT_DINO } from '@/constants/rewards'
import { useMissionStore } from '@/store/useMissionStore'

type MascotMood = 'idle' | 'cheer' | 'celebrate'

interface DinoMascotProps {
  mood?: MascotMood
}

const MESSAGES: Record<MascotMood, string[]> = {
  idle: [
    'Bugün hangi maceraya atılacaksın?',
    '3 macera seni bekliyor!',
    'Hadi başlayalım!',
  ],
  cheer: [
    'Harika gidiyorsun!',
    'Devam et, yapabilirsin!',
    'Bir macera daha!',
  ],
  celebrate: [
    'Bugünkü maceran bitti!',
    'Yarın yeni görevler var!',
    'Muhteşem bir gün!',
  ],
}

export function DinoMascot({ mood = 'idle' }: DinoMascotProps) {
  const activeDinoSkin = useMissionStore((s) => s.activeDinoSkin)
  const activeItem = useMissionStore((s) => s.activeItem)
  const dino = activeDinoSkin ?? DEFAULT_DINO
  const messages = MESSAGES[mood]
  const message = messages[Math.floor(Date.now() / 10000) % messages.length]

  return (
    <div className="flex items-center gap-3 rounded-2xl bg-sky-50 px-4 py-3">
      <div className="relative shrink-0">
        <span className="animate-bounce-in text-4xl">{dino}</span>
        {activeItem && (
          <span className="absolute -bottom-1 -right-2 text-xl" title="Eşya">
            {activeItem}
          </span>
        )}
      </div>
      <p className="text-sm font-semibold text-sky-800">{message}</p>
    </div>
  )
}

export function StreakBadge() {
  const currentStreak = useMissionStore((s) => s.currentStreak)

  if (currentStreak <= 0) return null

  return (
    <div className="animate-streak-pulse inline-flex items-center gap-1 rounded-full bg-orange-100 px-3 py-1 font-bold text-orange-600">
      <span>🔥</span>
      <span>{currentStreak} gün seri</span>
    </div>
  )
}
