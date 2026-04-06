import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import HeistsPage from '@/app/(dashboard)/heists/page'
import { useHeists } from '@/hooks/useHeists'
import { Timestamp } from 'firebase/firestore'

vi.mock('@/hooks/useHeists')
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

function makeHeist(id: string, overrides = {}) {
  return {
    id,
    title: `Heist ${id}`,
    description: 'A secret mission.',
    createdBy: 'uid-1',
    createdByCodename: 'Shadow Fox',
    assignedTo: 'uid-2',
    assignedToCodename: 'Iron Wolf',
    deadline: { toDate: () => new Date('2026-12-31') } as unknown as Timestamp,
    finalStatus: null,
    createdAt: { toDate: () => new Date('2026-01-01') } as unknown as Timestamp,
    ...overrides,
  }
}

function mockUseHeists({
  active = { heists: [], loading: false },
  assigned = { heists: [], loading: false },
} = {}) {
  vi.mocked(useHeists).mockImplementation((mode) => {
    if (mode === 'active') return active
    if (mode === 'assigned') return assigned
    return { heists: [], loading: false }
  })
}

beforeEach(() => {
  vi.clearAllMocks()
})

describe('HeistsPage', () => {
  it('shows 6 skeletons while active hook is loading', () => {
    mockUseHeists({ active: { heists: [], loading: true } })
    const { container } = render(<HeistsPage />)
    // Skeletons are aria-hidden, count by DOM presence
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons).toHaveLength(6)
  })

  it('shows 6 skeletons while assigned hook is loading', () => {
    mockUseHeists({ assigned: { heists: [], loading: true } })
    const { container } = render(<HeistsPage />)
    const skeletons = container.querySelectorAll('[aria-hidden="true"]')
    expect(skeletons).toHaveLength(6)
  })

  it('renders a HeistCard for each heist when loaded', () => {
    mockUseHeists({
      active: { heists: [makeHeist('a1'), makeHeist('a2')], loading: false },
      assigned: { heists: [makeHeist('b1')], loading: false },
    })
    render(<HeistsPage />)
    expect(screen.getByText('Heist a1')).toBeInTheDocument()
    expect(screen.getByText('Heist a2')).toBeInTheDocument()
    expect(screen.getByText('Heist b1')).toBeInTheDocument()
  })

  it('does not call useHeists with "expired"', () => {
    mockUseHeists()
    render(<HeistsPage />)
    const calls = vi.mocked(useHeists).mock.calls.map(([mode]) => mode)
    expect(calls).not.toContain('expired')
    expect(calls).toContain('active')
    expect(calls).toContain('assigned')
  })

  it('deduplicates heists that appear in both lists', () => {
    const sharedHeist = makeHeist('shared')
    mockUseHeists({
      active: { heists: [sharedHeist], loading: false },
      assigned: { heists: [sharedHeist], loading: false },
    })
    render(<HeistsPage />)
    const links = screen.getAllByRole('link', { name: 'Heist shared' })
    expect(links).toHaveLength(1)
  })

  it('shows empty state when both lists are empty and loading is false', () => {
    mockUseHeists()
    render(<HeistsPage />)
    expect(screen.getByText('No active heists found.')).toBeInTheDocument()
  })
})
