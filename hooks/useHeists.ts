'use client'

import { useState, useEffect } from 'react'
import {
  collection,
  onSnapshot,
  query,
  where,
  Timestamp,
} from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useUser } from '@/context/AuthContext'
import type { Heist } from '@/types/heist'

export type HeistMode = 'active' | 'assigned' | 'expired'

export function useHeists(mode: HeistMode): {
  heists: Heist[]
  loading: boolean
} {
  const { user } = useUser()
  const [heists, setHeists] = useState<Heist[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      setHeists([])
      setLoading(false)
      return
    }

    const heistsRef = collection(db, 'heists')

    let q
    if (mode === 'active') {
      q = query(
        heistsRef,
        where('assignedTo', '==', user.uid),
        where('deadline', '>', Timestamp.now())
      )
    } else if (mode === 'assigned') {
      q = query(heistsRef, where('createdBy', '==', user.uid))
    } else {
      q = query(heistsRef, where('deadline', '<', Timestamp.now()))
    }

    const unsubscribe = onSnapshot(q, (snapshot) => {
      let docs = snapshot.docs.map(
        (doc) => ({ id: doc.id, ...doc.data() }) as Heist
      )
      if (mode === 'expired') {
        docs = docs.filter((h) => h.finalStatus !== null)
      }
      setHeists(docs)
      setLoading(false)
    })

    return unsubscribe
  }, [mode, user?.uid])

  return { heists, loading }
}
