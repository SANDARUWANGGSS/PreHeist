import styles from './HeistCardSkeleton.module.css'

export default function HeistCardSkeleton() {
  return (
    <div className={styles.card} aria-hidden="true">
      <div className={styles.header}>
        <div className={`${styles.titleBar} ${styles.shimmer}`} />
        <div className={`${styles.badgeBar} ${styles.shimmer}`} />
      </div>

      <div className={styles.meta}>
        <div className={`${styles.metaRow} ${styles.shimmer}`} />
        <div className={`${styles.metaRow} ${styles.shimmer}`} />
        <div
          className={`${styles.metaRow} ${styles.metaRowShort} ${styles.shimmer}`}
        />
      </div>

      <div className={styles.descriptionLines}>
        <div className={`${styles.descriptionLine} ${styles.shimmer}`} />
        <div className={`${styles.descriptionLine} ${styles.shimmer}`} />
        <div
          className={`${styles.descriptionLine} ${styles.descriptionLineShort} ${styles.shimmer}`}
        />
      </div>
    </div>
  )
}
