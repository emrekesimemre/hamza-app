export interface RewardSet {
  id: string
  name: string
  description: string
  rewardIds: string[]
  bonusStars: number
  badgeId: string
}

export const REWARD_SETS: RewardSet[] = [
  {
    id: 'explorer-set',
    name: 'Kaşif Seti',
    description: 'Kaşif Hamza + Yeşil Dino + Mavi Scooter',
    rewardIds: ['avatar-explorer', 'dino-green', 'scooter-blue'],
    bonusStars: 15,
    badgeId: 'explorer-set',
  },
  {
    id: 'space-set',
    name: 'Uzay Seti',
    description: 'Astronot Hamza + Ateş Dino + Dino Şapka',
    rewardIds: ['avatar-astronaut', 'fire-dino', 'dino-hat'],
    bonusStars: 20,
    badgeId: 'space-set',
  },
  {
    id: 'hero-set',
    name: 'Kahraman Seti',
    description: 'Süper Kahraman + Ejderha Dino + Kılıç',
    rewardIds: ['avatar-superhero', 'dino-dragon', 'sword'],
    bonusStars: 25,
    badgeId: 'hero-set',
  },
  {
    id: 'wizard-set',
    name: 'Büyücü Seti',
    description: 'Büyücü Hamza + Unicorn Dino + Sihirli Değnek',
    rewardIds: ['avatar-wizard', 'dino-unicorn', 'magic-wand'],
    bonusStars: 25,
    badgeId: 'wizard-set',
  },
  {
    id: 'ninja-set',
    name: 'Ninja Seti',
    description: 'Ninja Hamza + Robot Dino + Kaykay',
    rewardIds: ['avatar-ninja', 'dino-robot', 'skateboard'],
    bonusStars: 25,
    badgeId: 'ninja-set',
  },
  {
    id: 'party-set',
    name: 'Parti Seti',
    description: 'Şef Hamza + Kaplumbağa Dino + Gitar',
    rewardIds: ['avatar-chef', 'dino-turtle', 'guitar'],
    bonusStars: 20,
    badgeId: 'party-set',
  },
  {
    id: 'royal-set',
    name: 'Kral Seti',
    description: 'Kovboy Hamza + Kristal Dino + Taç',
    rewardIds: ['avatar-cowboy', 'dino-crystal', 'crown'],
    bonusStars: 30,
    badgeId: 'royal-set',
  },
]

export function getCompletedSets(
  ownedRewards: string[],
  claimedSetBonuses: string[],
): RewardSet[] {
  return REWARD_SETS.filter(
    (set) =>
      !claimedSetBonuses.includes(set.id) &&
      set.rewardIds.every((id) => ownedRewards.includes(id)),
  )
}
