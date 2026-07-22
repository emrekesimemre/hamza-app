import type { Reward, RewardCategory } from '@/types/rewards.types'

export const REWARDS_CATALOG: Reward[] = [
  // —— Avatarlar ——
  {
    id: 'avatar-explorer',
    name: 'Kaşif Hamza',
    icon: '👦',
    cost: 40,
    category: 'avatar',
  },
  {
    id: 'avatar-astronaut',
    name: 'Astronot Hamza',
    icon: '👨‍🚀',
    cost: 60,
    category: 'avatar',
  },
  {
    id: 'avatar-superhero',
    name: 'Süper Kahraman',
    icon: '🦸',
    cost: 75,
    category: 'avatar',
  },
  {
    id: 'avatar-pirate',
    name: 'Korsan Hamza',
    icon: '🏴‍☠️',
    cost: 55,
    category: 'avatar',
  },
  {
    id: 'avatar-chef',
    name: 'Şef Hamza',
    icon: '👨‍🍳',
    cost: 45,
    category: 'avatar',
  },
  {
    id: 'avatar-wizard',
    name: 'Büyücü Hamza',
    icon: '🧙',
    cost: 80,
    category: 'avatar',
  },
  {
    id: 'avatar-ninja',
    name: 'Ninja Hamza',
    icon: '🥷',
    cost: 70,
    category: 'avatar',
  },
  {
    id: 'avatar-cowboy',
    name: 'Kovboy Hamza',
    icon: '🤠',
    cost: 50,
    category: 'avatar',
  },

  // —— Dino görünümleri ——
  {
    id: 'fire-dino',
    name: 'Ateş Dinozor',
    icon: '🦖',
    cost: 100,
    category: 'dino-skin',
  },
  {
    id: 'dino-green',
    name: 'Yeşil Dinozor',
    icon: '🦕',
    cost: 45,
    category: 'dino-skin',
  },
  {
    id: 'dino-dragon',
    name: 'Ejderha Dino',
    icon: '🐲',
    cost: 90,
    category: 'dino-skin',
  },
  {
    id: 'dino-unicorn',
    name: 'Unicorn Dino',
    icon: '🦄',
    cost: 85,
    category: 'dino-skin',
  },
  {
    id: 'dino-robot',
    name: 'Robot Dino',
    icon: '🤖',
    cost: 95,
    category: 'dino-skin',
  },
  {
    id: 'dino-crystal',
    name: 'Kristal Dino',
    icon: '💎',
    cost: 120,
    category: 'dino-skin',
  },
  {
    id: 'dino-turtle',
    name: 'Kaplumbağa Dino',
    icon: '🐢',
    cost: 55,
    category: 'dino-skin',
  },

  // —— Eşyalar ——
  {
    id: 'balloon',
    name: 'Renkli Balon',
    icon: '🎈',
    cost: 25,
    category: 'item',
  },
  {
    id: 'dino-hat',
    name: 'Dino Şapka',
    icon: '🎩',
    cost: 30,
    category: 'item',
  },
  {
    id: 'sunglasses',
    name: 'Güneş Gözlüğü',
    icon: '😎',
    cost: 35,
    category: 'item',
  },
  {
    id: 'magic-wand',
    name: 'Sihirli Değnek',
    icon: '🪄',
    cost: 40,
    category: 'item',
  },
  {
    id: 'scooter-blue',
    name: 'Mavi Scooter',
    icon: '🛴',
    cost: 50,
    category: 'item',
  },
  {
    id: 'guitar',
    name: 'Gitar',
    icon: '🎸',
    cost: 50,
    category: 'item',
  },
  {
    id: 'skateboard',
    name: 'Kaykay',
    icon: '🛹',
    cost: 55,
    category: 'item',
  },
  {
    id: 'rocket-pack',
    name: 'Roket Çantası',
    icon: '🎒',
    cost: 60,
    category: 'item',
  },
  {
    id: 'sword',
    name: 'Kılıç',
    icon: '⚔️',
    cost: 65,
    category: 'item',
  },
  {
    id: 'trophy',
    name: 'Altın Kupa',
    icon: '🏆',
    cost: 80,
    category: 'item',
  },
  {
    id: 'crown',
    name: 'Taç',
    icon: '👑',
    cost: 100,
    category: 'item',
  },
]

export const REWARD_CATEGORY_LABELS: Record<RewardCategory, string> = {
  avatar: '👤 Avatarlar',
  'dino-skin': '🦖 Dino Görünümleri',
  item: '🎒 Eşyalar',
}

export const REWARD_CATEGORY_ORDER: RewardCategory[] = ['avatar', 'dino-skin', 'item']

export const DEFAULT_AVATAR = '🧒'
export const DEFAULT_DINO = '🦖'

export function getRewardById(id: string) {
  return REWARDS_CATALOG.find((r) => r.id === id)
}

export function getRewardsByCategory(category: RewardCategory) {
  return REWARDS_CATALOG.filter((r) => r.category === category)
}
