export type RewardCategory = 'avatar' | 'dino-skin' | 'item'

export interface Reward {
  id: string
  name: string
  icon: string
  cost: number
  category: RewardCategory
}
