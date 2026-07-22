import type { Reward } from '@/types/rewards.types'

export const REWARDS_CATALOG: Reward[] = [
  {
    id: 'scooter-blue',
    name: 'Mavi Scooter',
    icon: '🛴',
    cost: 50,
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
    id: 'fire-dino',
    name: 'Ateş Dinozor',
    icon: '🦖',
    cost: 100,
    category: 'dino-skin',
  },
  {
    id: 'avatar-explorer',
    name: 'Kaşif Hamza',
    icon: '🧒',
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
    id: 'dino-green',
    name: 'Yeşil Dinozor',
    icon: '🦕',
    cost: 45,
    category: 'dino-skin',
  },
]

export const DEFAULT_AVATAR = '🧒'
export const DEFAULT_DINO = '🦖'
