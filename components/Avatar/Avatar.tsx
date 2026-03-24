import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
}

function getInitials(name: string): string {
  const upperLetters = name.match(/[A-Z]/g) ?? []
  if (upperLetters.length >= 2) {
    return upperLetters[0] + upperLetters[1]
  }
  return name.charAt(0)
}

export default function Avatar({ name }: AvatarProps) {
  const initials = getInitials(name)
  return (
    <div className={styles.avatar} role="img" aria-label={name}>
      {initials}
    </div>
  )
}
