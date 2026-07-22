import { useMissionStore } from '@/store/useMissionStore'
import { HamzaPhotoAvatar } from '@/components/common/HamzaPhotoAvatar'

interface HamzaAvatarProps {
  className?: string
}

export function HamzaAvatar({ className = 'h-11 w-11' }: HamzaAvatarProps) {
  const activeAvatar = useMissionStore((s) => s.activeAvatar)

  return (
    <HamzaPhotoAvatar
      className={className}
      accessory={activeAvatar}
      accessoryClassName="h-[44%] w-[44%] text-[0.65em]"
    />
  )
}
