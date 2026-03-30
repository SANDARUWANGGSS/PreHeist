'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  addDoc,
  collection,
  getDocs,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUser } from '@/context/AuthContext'
import type { CreateHeistInput } from '@/types/heist'
import styles from './CreateHeistForm.module.css'

interface Operative {
  uid: string
  codename: string
}

export default function CreateHeistForm() {
  const { user } = useUser()
  const router = useRouter()

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [assignedTo, setAssignedTo] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [operatives, setOperatives] = useState<Operative[]>([])
  const [operativesLoading, setOperativesLoading] = useState(true)

  useEffect(() => {
    async function fetchOperatives() {
      try {
        const snapshot = await getDocs(collection(db, 'users'))
        setOperatives(
          snapshot.docs.map((doc) => ({
            uid: doc.id,
            codename: doc.data().codename as string,
          }))
        )
      } catch {
        // non-fatal — dropdown will show empty state
      } finally {
        setOperativesLoading(false)
      }
    }
    fetchOperatives()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const assignedToCodename =
        operatives.find((o) => o.uid === assignedTo)?.codename ?? ''

      const data: CreateHeistInput = {
        title,
        description,
        createdBy: user!.uid,
        createdByCodename: user!.displayName ?? '',
        assignedTo,
        assignedToCodename,
        deadline: Timestamp.fromDate(
          new Date(Date.now() + 48 * 60 * 60 * 1000)
        ),
        finalStatus: null,
        createdAt: serverTimestamp(),
      }

      await addDoc(collection(db, 'heists'), data)
      router.push('/heists')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className={styles.field}>
        <label htmlFor="title" className={styles.label}>
          Title
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className={styles.input}
          placeholder="Operation name..."
          disabled={loading}
          required
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="description" className={styles.label}>
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={styles.textarea}
          placeholder="Describe the mission objectives..."
          disabled={loading}
          required
          rows={4}
        />
      </div>

      <div className={styles.field}>
        <label htmlFor="assignedTo" className={styles.label}>
          Assign to Operative
        </label>
        <select
          id="assignedTo"
          value={assignedTo}
          onChange={(e) => setAssignedTo(e.target.value)}
          className={styles.select}
          disabled={loading || operativesLoading}
          required
        >
          <option value="" disabled>
            {operativesLoading
              ? 'Loading operatives...'
              : operatives.length === 0
                ? 'No operatives available'
                : 'Select an operative'}
          </option>
          {operatives.map((op) => (
            <option key={op.uid} value={op.uid}>
              {op.codename}
            </option>
          ))}
        </select>
      </div>

      <button type="submit" className={styles.submitButton} disabled={loading}>
        {loading ? 'Creating...' : 'Create Heist'}
      </button>

      {error && <p className={styles.errorText}>{error}</p>}
    </form>
  )
}
