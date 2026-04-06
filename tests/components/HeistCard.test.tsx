import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import HeistCard from '@/components/HeistCard'
import type { Heist } from '@/types/heist'
import { Timestamp } from 'firebase/firestore'

vi.mock('next/link', () => ({
  default: ({
    href,
    children,
    className,
  }: {
    href: string
    children: React.ReactNode
    className?: string
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}))

function makeHeist(overrides: Partial<Heist> = {}): Heist {
  return {
    id: 'heist-1',
    title: 'Operation Nightfall',
    description: 'Infiltrate the vault and extract the documents.',
    createdBy: 'uid-handler',
    createdByCodename: 'Shadow Fox',
    assignedTo: 'uid-operative',
    assignedToCodename: 'Iron Wolf',
    deadline: { toDate: () => new Date('2026-06-15') } as unknown as Timestamp,
    finalStatus: null,
    createdAt: { toDate: () => new Date('2026-01-01') } as unknown as Timestamp,
    ...overrides,
  }
}

describe('HeistCard', () => {
  it('renders the heist title as a link to /heists/:id', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    const link = screen.getByRole('link', { name: 'Operation Nightfall' })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/heists/heist-1')
  })

  it('renders "Active" badge when mode is active', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    expect(screen.getByText('Active')).toBeInTheDocument()
  })

  it('renders "Assigned" badge when mode is assigned', () => {
    render(<HeistCard heist={makeHeist()} mode="assigned" />)
    expect(screen.getByText('Assigned')).toBeInTheDocument()
  })

  it('renders the operative codename', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    expect(screen.getByText('Iron Wolf')).toBeInTheDocument()
  })

  it('renders the handler codename', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    expect(screen.getByText('Shadow Fox')).toBeInTheDocument()
  })

  it('renders a formatted deadline string', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    // Should not render a raw timestamp — should be a human readable date
    const due = screen.getByText(/Jun|June|2026/i)
    expect(due).toBeInTheDocument()
  })

  it('renders the description text', () => {
    render(<HeistCard heist={makeHeist()} mode="active" />)
    expect(
      screen.getByText('Infiltrate the vault and extract the documents.')
    ).toBeInTheDocument()
  })
})
