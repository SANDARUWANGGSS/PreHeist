import Link from 'next/link'
import styles from './HeistCard.module.css'
import type { Heist } from '@/types/heist'

interface HeistCardProps {
  heist: Heist
  mode: 'active' | 'assigned'
}

export default function HeistCard({ heist, mode }: HeistCardProps) {
  const deadline = heist.deadline.toDate()
  const formattedDeadline = new Intl.DateTimeFormat(undefined, {
    dateStyle: 'medium',
  }).format(deadline)

  const badgeClass =
    mode === 'active' ? styles.badgeActive : styles.badgeAssigned
  const badgeLabel = mode === 'active' ? 'Active' : 'Assigned'

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <Link href={`/heists/${heist.id}`} className={styles.title}>
          {heist.title}
        </Link>
        <span className={`${styles.badge} ${badgeClass}`}>{badgeLabel}</span>
      </div>

      <div className={styles.meta}>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Due</span>
          <span>{formattedDeadline}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Operative</span>
          <span>{heist.assignedToCodename}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaLabel}>Handler</span>
          <span>{heist.createdByCodename}</span>
        </div>
      </div>

      <p className={styles.description}>{heist.description}</p>
    </div>
  )
}
