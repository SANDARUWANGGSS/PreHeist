import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))
vi.mock('@/components/Navbar', () => ({ default: () => null }))

import DashboardLayout from '@/app/(dashboard)/layout'
import { useUser } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const mockUseUser = vi.mocked(useUser)
const mockUseRouter = vi.mocked(useRouter)
let mockReplace: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  mockReplace = vi.fn()
  mockUseRouter.mockReturnValue({ replace: mockReplace } as any)
  mockUseUser.mockReturnValue({ user: null, loading: false })
})

describe('DashboardLayout', () => {
  it('shows loader while auth state is loading', () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })
    render(<DashboardLayout>children</DashboardLayout>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders children when user is authenticated', () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    render(<DashboardLayout>protected content</DashboardLayout>)
    expect(screen.getByText('protected content')).toBeInTheDocument()
  })

  it('redirects to /login when user is not authenticated', async () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    await act(async () => {
      render(<DashboardLayout>children</DashboardLayout>)
    })
    expect(mockReplace).toHaveBeenCalledWith('/login')
  })

  it('renders nothing while redirect is in flight', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    const { container } = render(<DashboardLayout>children</DashboardLayout>)
    expect(container.firstChild).toBeNull()
  })
})
