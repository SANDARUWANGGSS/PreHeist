'use client'

import { useHeists } from '@/hooks/useHeists'

function HeistList({ mode }: { mode: 'active' | 'assigned' | 'expired' }) {
  const { heists, loading } = useHeists(mode)

  if (loading) return <p>Loading...</p>
  if (heists.length === 0) return <p>No heists here.</p>

  return (
    <ul>
      {heists.map((heist) => (
        <li key={heist.id}>{heist.title}</li>
      ))}
    </ul>
  )
}

export default function HeistsPage() {
  return (
    <div className="page-content">
      <div className="active-heists">
        <h2>Your Active Heists</h2>
        <HeistList mode="active" />
      </div>
      <div className="assigned-heists">
        <h2>Heists You&apos;ve Assigned</h2>
        <HeistList mode="assigned" />
      </div>
      <div className="expired-heists">
        <h2>All Expired Heists</h2>
        <HeistList mode="expired" />
      </div>
    </div>
  )
}
