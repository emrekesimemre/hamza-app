import { HAMZA_PHOTO, HAMZA_PHOTO_ALT } from '@/constants/branding'

interface HamzaAvatarProps {
  className?: string
}

export function HamzaAvatar({ className = 'h-11 w-11' }: HamzaAvatarProps) {
  return (
    <img
      src={HAMZA_PHOTO}
      alt={HAMZA_PHOTO_ALT}
      className={`shrink-0 rounded-full object-cover object-top ring-2 ring-sky-200 ${className}`}
    />
  )
}
