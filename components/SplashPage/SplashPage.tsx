'use client'

import { Clock8 } from 'lucide-react'
import Link from 'next/link'
import styles from './SplashPage.module.css'

export default function SplashPage() {
  return (
    <div className={styles.container}>
      <div className={styles.noise} aria-hidden="true" />

      <div className={styles.dossier}>
        <div className={styles.cornerTL} aria-hidden="true" />
        <div className={styles.cornerTR} aria-hidden="true" />
        <div className={styles.cornerBL} aria-hidden="true" />
        <div className={styles.cornerBR} aria-hidden="true" />

        <div className={styles.topBadge}>MISSION BRIEFING</div>

        <div className={styles.stamp} aria-hidden="true">
          CLASSIFIED
        </div>

        <div className={styles.logoWrap}>
          <h1 className={styles.logo}>
            P<Clock8 className={styles.logoIcon} strokeWidth={2.75} />
            cket
          </h1>
          <span className={styles.logoSub}>Heist</span>
        </div>

        <p className={styles.tagline}>
          Outsmart.&nbsp; Outmaneuver.&nbsp; Out.
        </p>

        <div className={styles.divider} aria-hidden="true" />

        <ul className={styles.briefing}>
          <li className={styles.briefingRow}>
            <span className={styles.briefingLabel}>STATUS</span>
            <span className={styles.briefingDots} aria-hidden="true" />
            <span className={styles.briefingValue}>AWAITING OPERATIVE</span>
          </li>
          <li className={styles.briefingRow}>
            <span className={styles.briefingLabel}>OBJECTIVE</span>
            <span className={styles.briefingDots} aria-hidden="true" />
            <span className={styles.briefingValue}>
              COMPLETE OFFICE MISSIONS
            </span>
          </li>
          <li className={styles.briefingRow}>
            <span className={styles.briefingLabel}>CLEARANCE</span>
            <span className={styles.briefingDots} aria-hidden="true" />
            <span className={styles.redacted} aria-label="redacted">
              ████████████
            </span>
          </li>
        </ul>

        <Link href="/signup" className={styles.cta}>
          <span className={styles.ctaPrefix}>&gt;_</span> ACCEPT MISSION
        </Link>

        <p className={styles.signInHint}>
          Already an operative?{' '}
          <Link href="/login" className={styles.signInLink}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
