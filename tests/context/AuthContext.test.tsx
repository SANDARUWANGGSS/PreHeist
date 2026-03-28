import { renderHook, act } from '@testing-library/react'
import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  type MockedFunction,
} from 'vitest'
import { onAuthStateChanged, User } from 'firebase/auth'
import AuthProvider, { useUser } from '@/context/AuthContext'

vi.mock('@/lib/firebase', () => ({ auth: {} }))
vi.mock('firebase/auth', () => ({ onAuthStateChanged: vi.fn() }))

type AuthCallback = (user: User | null) => void
const mockOnAuthStateChanged = vi.mocked(
  onAuthStateChanged
) as unknown as MockedFunction<
  (auth: unknown, callback: AuthCallback) => () => void
>

beforeEach(() => {
  mockOnAuthStateChanged.mockReset()
})

describe('useUser', () => {
  it('throws when called outside AuthProvider', () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    expect(() => renderHook(() => useUser())).toThrow(
      'useUser must be used within an AuthProvider'
    )
    consoleSpy.mockRestore()
  })

  it('returns loading:true before auth state resolves', () => {
    mockOnAuthStateChanged.mockImplementation(() => () => {})

    const { result } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    expect(result.current.loading).toBe(true)
    expect(result.current.user).toBeNull()
  })

  it('returns user:null and loading:false when logged out', () => {
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: AuthCallback) => {
        callback(null)
        return () => {}
      }
    )

    const { result } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toBeNull()
  })

  it('returns the user object and loading:false when logged in', () => {
    const fakeUser = { uid: 'abc123', email: 'test@example.com' } as User

    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: AuthCallback) => {
        callback(fakeUser)
        return () => {}
      }
    )

    const { result } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    expect(result.current.loading).toBe(false)
    expect(result.current.user).toEqual(fakeUser)
  })

  it('updates user when auth state changes', () => {
    const fakeUser = { uid: 'abc123', email: 'test@example.com' } as User
    let capturedCallback: AuthCallback | null = null

    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: AuthCallback) => {
        capturedCallback = callback
        callback(null)
        return () => {}
      }
    )

    const { result } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    expect(result.current.user).toBeNull()

    act(() => {
      capturedCallback!(fakeUser)
    })

    expect(result.current.user).toEqual(fakeUser)
  })

  it('calls unsubscribe on unmount', () => {
    const unsubscribe = vi.fn()
    mockOnAuthStateChanged.mockImplementation(
      (_auth: unknown, callback: AuthCallback) => {
        callback(null)
        return unsubscribe
      }
    )

    const { unmount } = renderHook(() => useUser(), {
      wrapper: AuthProvider,
    })

    unmount()

    expect(unsubscribe).toHaveBeenCalledOnce()
  })
})
