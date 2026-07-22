export interface Achievement {
  id: string
  name: string
  description: string
  icon: string
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first-mission',
    name: 'İlk Macera',
    description: 'İlk görevi tamamla',
    icon: '🌟',
  },
  {
    id: 'math-master',
    name: 'Matematik Ustası',
    description: '10 matematik görevi tamamla',
    icon: '🔢',
  },
  {
    id: 'streak-7',
    name: '7 Gün Kahramanı',
    description: '7 gün üst üste macera tamamla',
    icon: '🏅',
  },
  {
    id: 'star-hunter',
    name: 'Yıldız Avcısı',
    description: '500 yıldız topla',
    icon: '⭐',
  },
  {
    id: 'perfect-mission',
    name: 'Mükemmel Tur',
    description: 'Bir görevi hatasız tamamla',
    icon: '💎',
  },
  {
    id: 'streak-3',
    name: '3 Gün Serisi',
    description: '3 gün üst üste 3/3 tamamla',
    icon: '🔥',
  },
  {
    id: 'explorer-set',
    name: 'Kaşif Seti',
    description: 'Kaşif setinin tüm parçalarını topla',
    icon: '🧭',
  },
  {
    id: 'space-set',
    name: 'Uzay Seti',
    description: 'Uzay setinin tüm parçalarını topla',
    icon: '🚀',
  },
  {
    id: 'first-reward',
    name: 'İlk Ödül',
    description: 'Mağazadan ilk ödülünü al',
    icon: '🎁',
  },
  {
    id: 'hero-set',
    name: 'Kahraman Seti',
    description: 'Kahraman setinin tüm parçalarını topla',
    icon: '🦸',
  },
  {
    id: 'wizard-set',
    name: 'Büyücü Seti',
    description: 'Büyücü setinin tüm parçalarını topla',
    icon: '🧙',
  },
  {
    id: 'ninja-set',
    name: 'Ninja Seti',
    description: 'Ninja setinin tüm parçalarını topla',
    icon: '🥷',
  },
  {
    id: 'party-set',
    name: 'Parti Seti',
    description: 'Parti setinin tüm parçalarını topla',
    icon: '🎸',
  },
  {
    id: 'royal-set',
    name: 'Kral Seti',
    description: 'Kral setinin tüm parçalarını topla',
    icon: '👑',
  },
  {
    id: 'collector-10',
    name: 'Koleksiyoncu',
    description: '10 farklı ödül topla',
    icon: '🎒',
  },
]

export function getAchievementById(id: string): Achievement | undefined {
  return ACHIEVEMENTS.find((a) => a.id === id)
}

export interface AchievementCheckContext {
  totalMissionsCompleted: number
  mathMissionsCompleted: number
  stars: number
  currentStreak: number
  longestStreak: number
  lastMissionPerfect: boolean
}

export function checkNewAchievements(
  earned: string[],
  ctx: AchievementCheckContext,
): string[] {
  const newBadges: string[] = []

  const tryAward = (id: string, condition: boolean) => {
    if (condition && !earned.includes(id) && !newBadges.includes(id)) {
      newBadges.push(id)
    }
  }

  tryAward('first-mission', ctx.totalMissionsCompleted >= 1)
  tryAward('math-master', ctx.mathMissionsCompleted >= 10)
  tryAward('streak-7', ctx.longestStreak >= 7)
  tryAward('star-hunter', ctx.stars >= 500)
  tryAward('perfect-mission', ctx.lastMissionPerfect)
  tryAward('streak-3', ctx.currentStreak >= 3)

  return newBadges
}
