import { render, screen, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

import PublicLayout from '@/app/(public)/layout'
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

describe('PublicLayout', () => {
  it('shows loader while auth state is loading', () => {
    mockUseUser.mockReturnValue({ user: null, loading: true })
    render(<PublicLayout>children</PublicLayout>)
    expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders children when user is not authenticated', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    render(<PublicLayout>public content</PublicLayout>)
    expect(screen.getByText('public content')).toBeInTheDocument()
  })

  it('redirects to /heists when user is authenticated', async () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    await act(async () => {
      render(<PublicLayout>children</PublicLayout>)
    })
    expect(mockReplace).toHaveBeenCalledWith('/heists')
  })

  it('renders nothing while redirect is in flight', () => {
    mockUseUser.mockReturnValue({ user: { uid: 'abc' } as any, loading: false })
    const { container } = render(<PublicLayout>children</PublicLayout>)
    expect(container.firstChild).toBeNull()
  })
})
