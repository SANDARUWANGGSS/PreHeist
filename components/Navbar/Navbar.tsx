'use client'

import { useState } from 'react'
import { Clock8 } from 'lucide-react'
import Link from 'next/link'
import { signOut } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { useUser } from '@/context/AuthContext'
import styles from './Navbar.module.css'

export default function Navbar() {
  const { user } = useUser()
  const [signingOut, setSigningOut] = useState(false)

  async function handleLogout() {
    setSigningOut(true)
    try {
      await signOut(auth)
    } catch {
      // sign-out errors are non-fatal
    } finally {
      setSigningOut(false)
    }
  }

  return (
    <div className={styles.siteNav}>
      <nav>
        <header>
          <h1>
            <Link href="/heists">
              P<Clock8 className={styles.logo} size={14} strokeWidth={2.75} />
              cket Heist
            </Link>
          </h1>
          <div>Tiny missions. Big office mischief.</div>
        </header>
        <ul>
          <li>
            <Link href="/heists/create">Create Heist</Link>
          </li>
          {user && (
            <li>
              <button
                className={styles.logoutButton}
                onClick={handleLogout}
                disabled={signingOut}
              >
                {signingOut ? 'Signing out...' : 'Logout'}
              </button>
            </li>
          )}
        </ul>
      </nav>
    </div>
  )
}
