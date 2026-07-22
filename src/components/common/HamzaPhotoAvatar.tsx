import { DEFAULT_AVATAR } from '@/constants/rewards'
import { HAMZA_PHOTO, HAMZA_PHOTO_ALT } from '@/constants/branding'

interface HamzaPhotoAvatarProps {
  className?: string
  /** Kostüm emojisi — fotoğraf her zaman görünür, emoji üstüne bindirilir */
  accessory?: string | null
  accessoryClassName?: string
}

export function HamzaPhotoAvatar({
  className = 'h-11 w-11',
  accessory,
  accessoryClassName = 'text-base',
}: HamzaPhotoAvatarProps) {
  const showAccessory = accessory && accessory !== DEFAULT_AVATAR

  return (
    <div className={`relative shrink-0 ${className}`}>
      <img
        src={HAMZA_PHOTO}
        alt={HAMZA_PHOTO_ALT}
        className="h-full w-full rounded-full object-cover object-top ring-2 ring-sky-200"
      />
      {showAccessory && (
        <span
          className={`pointer-events-none absolute -right-0.5 -top-0.5 flex items-center justify-center rounded-full bg-white/95 leading-none shadow-sm ring-1 ring-sky-200 ${accessoryClassName}`}
          aria-hidden
        >
          {accessory}
        </span>
      )}
    </div>
  )
}
