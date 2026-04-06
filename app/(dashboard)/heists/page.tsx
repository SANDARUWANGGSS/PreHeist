'use client'

import { useHeists } from '@/hooks/useHeists'
import HeistCard from '@/components/HeistCard'
import HeistCardSkeleton from '@/components/HeistCardSkeleton'
import type { Heist } from '@/types/heist'

type TaggedHeist = Heist & { mode: 'active' | 'assigned' }

function mergeHeists(active: Heist[], assigned: Heist[]): TaggedHeist[] {
  const tagged: TaggedHeist[] = [
    ...active.map((h) => ({ ...h, mode: 'active' as const })),
    ...assigned.map((h) => ({ ...h, mode: 'assigned' as const })),
  ]
  const seen = new Map<string, TaggedHeist>()
  for (const heist of tagged) {
    if (!seen.has(heist.id)) {
      seen.set(heist.id, heist)
    }
  }
  return [...seen.values()]
}

export default function HeistsPage() {
  const { heists: activeHeists, loading: activeLoading } = useHeists('active')
  const { heists: assignedHeists, loading: assignedLoading } =
    useHeists('assigned')

  const isLoading = activeLoading || assignedLoading
  const heists = mergeHeists(activeHeists, assignedHeists)

  return (
    <div className="page-content">
      <h1 className="text-2xl font-bold mb-6">Your Heists</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array.from({ length: 6 }).map((_, i) => <HeistCardSkeleton key={i} />)
        ) : heists.length === 0 ? (
          <p className="col-span-full text-body">No active heists found.</p>
        ) : (
          heists.map((heist) => (
            <HeistCard key={heist.id} heist={heist} mode={heist.mode} />
          ))
        )}
      </div>
    </div>
  )
}
