import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import Navbar from '@/components/Navbar'

vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))
vi.mock('firebase/auth', () => ({ signOut: vi.fn() }))
vi.mock('@/lib/firebase', () => ({ auth: {} }))

import { useUser } from '@/context/AuthContext'
import { signOut } from 'firebase/auth'

const mockUseUser = vi.mocked(useUser)
const mockSignOut = vi.mocked(signOut)

beforeEach(() => {
  vi.clearAllMocks()
  mockUseUser.mockReturnValue({ user: null, loading: false })
  mockSignOut.mockResolvedValue(undefined)
})

describe('Navbar', () => {
  it('renders the main heading', () => {
    render(<Navbar />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders the Create Heist link', () => {
    render(<Navbar />)
    const createLink = screen.getByRole('link', { name: /create heist/i })
    expect(createLink).toBeInTheDocument()
    expect(createLink).toHaveAttribute('href', '/heists/create')
  })

  it('does not render logout button when user is null', () => {
    render(<Navbar />)
    expect(screen.queryByRole('button', { name: /logout/i })).toBeNull()
  })

  it('renders logout button when user is logged in', () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    render(<Navbar />)
    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })

  it('calls signOut when logout button is clicked', async () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    render(<Navbar />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    })

    expect(mockSignOut).toHaveBeenCalledWith({})
  })

  it('does not crash when signOut fails', async () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    mockSignOut.mockRejectedValue(new Error('network error'))
    render(<Navbar />)

    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /logout/i }))
    })

    expect(screen.getByRole('button', { name: /logout/i })).toBeInTheDocument()
  })
})
