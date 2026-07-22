export type RewardCategory = 'avatar' | 'dino-skin' | 'item'

export interface Reward {
  id: string
  name: string
  icon: string
  cost: number
  category: RewardCategory
}

export interface RewardPurchaseLog {
  rewardId: string
  rewardName: string
  icon: string
  purchasedAt: string
  cost: number
}

export interface SetBonusResult {
  setId: string
  setName: string
  bonusStars: number
  badgeId: string
}

export interface PurchaseRewardResult {
  success: boolean
  reward?: Reward
  setBonus?: SetBonusResult
  newBadges?: string[]
}
