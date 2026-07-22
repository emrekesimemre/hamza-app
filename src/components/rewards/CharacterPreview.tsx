import { DEFAULT_AVATAR, DEFAULT_DINO } from '@/constants/rewards'
import { HamzaPhotoAvatar } from '@/components/common/HamzaPhotoAvatar'
import { useMissionStore } from '@/store/useMissionStore'

type PreviewSize = 'sm' | 'md' | 'lg'

interface CharacterPreviewProps {
  size?: PreviewSize
  avatar?: string | null
  dinoSkin?: string | null
  item?: string | null
  showLabels?: boolean
}

const SIZE_CLASSES: Record<
  PreviewSize,
  { container: string; dino: string; item: string; photo: string; accessory: string }
> = {
  sm: {
    container: 'gap-2 p-3',
    dino: 'text-4xl',
    item: 'text-xl',
    photo: 'h-10 w-10',
    accessory: 'h-[44%] w-[44%] text-[0.65em]',
  },
  md: {
    container: 'gap-4 p-5',
    dino: 'text-6xl',
    item: 'text-2xl',
    photo: 'h-14 w-14',
    accessory: 'h-[44%] w-[44%] text-[0.7em]',
  },
  lg: {
    container: 'gap-6 p-8',
    dino: 'text-7xl',
    item: 'text-3xl',
    photo: 'h-20 w-20',
    accessory: 'h-[44%] w-[44%] text-[0.75em]',
  },
}

export function CharacterPreview({
  size = 'md',
  avatar: avatarProp,
  dinoSkin: dinoProp,
  item: itemProp,
  showLabels = false,
}: CharacterPreviewProps) {
  const storeAvatar = useMissionStore((s) => s.activeAvatar)
  const storeDino = useMissionStore((s) => s.activeDinoSkin)
  const storeItem = useMissionStore((s) => s.activeItem)

  const avatar = avatarProp !== undefined ? avatarProp : storeAvatar
  const dino = dinoProp !== undefined ? dinoProp : storeDino ?? DEFAULT_DINO
  const item = itemProp !== undefined ? itemProp : storeItem
  const classes = SIZE_CLASSES[size]
  const accessory = avatar && avatar !== DEFAULT_AVATAR ? avatar : null

  return (
    <div
      className={`flex flex-col items-center rounded-3xl bg-gradient-to-b from-sky-50 to-purple-50 ${classes.container}`}
    >
      <div className="flex items-end justify-center gap-3">
        <div className="flex flex-col items-center">
          <HamzaPhotoAvatar
            className={classes.photo}
            accessory={accessory}
            accessoryClassName={classes.accessory}
          />
          {showLabels && (
            <span className="mt-1 text-xs font-semibold text-gray-500">Hamza</span>
          )}
        </div>

        <div className="relative flex flex-col items-center">
          <span className={`animate-bounce-in ${classes.dino}`}>{dino}</span>
          {item && (
            <span
              className={`absolute -bottom-1 -right-2 ${classes.item}`}
              title="Eşya"
            >
              {item}
            </span>
          )}
          {showLabels && (
            <span className="mt-1 text-xs font-semibold text-gray-500">Dino</span>
          )}
        </div>
      </div>
      {showLabels && item && (
        <p className="mt-2 text-xs font-semibold text-purple-600">Eşya: {item}</p>
      )}
    </div>
  )
}
