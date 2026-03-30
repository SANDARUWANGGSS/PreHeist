import { renderHook, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  onSnapshot: vi.fn(),
  query: vi.fn(),
  where: vi.fn(),
  Timestamp: { now: vi.fn(() => ({ seconds: 9999999 })) },
}))
vi.mock('@/lib/firebase', () => ({ db: {} }))
vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))

import { useHeists } from '@/hooks/useHeists'
import { onSnapshot, where } from 'firebase/firestore'
import { useUser } from '@/context/AuthContext'

const mockOnSnapshot = vi.mocked(onSnapshot)
const mockWhere = vi.mocked(where)
const mockUseUser = vi.mocked(useUser)

type SnapshotCallback = (snapshot: {
  docs: { id: string; data: () => object }[]
}) => void
let capturedCallback: SnapshotCallback
let mockUnsubscribe: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  mockUnsubscribe = vi.fn()
  mockUseUser.mockReturnValue({ user: { uid: 'uid-1' } as any, loading: false })
  mockOnSnapshot.mockImplementation((_q: unknown, cb: unknown) => {
    capturedCallback = cb as SnapshotCallback
    return mockUnsubscribe as unknown as () => void
  })
})

function makeDocs(overrides: object[] = []) {
  return overrides.map((data, i) => ({ id: `heist-${i}`, data: () => data }))
}

describe('useHeists', () => {
  it("subscribes with assignedTo filter for 'active' mode", () => {
    renderHook(() => useHeists('active'))
    const calls = mockWhere.mock.calls
    expect(
      calls.some(
        (c) => c[0] === 'assignedTo' && c[1] === '==' && c[2] === 'uid-1'
      )
    ).toBe(true)
  })

  it("subscribes with createdBy filter for 'assigned' mode", () => {
    renderHook(() => useHeists('assigned'))
    const calls = mockWhere.mock.calls
    expect(
      calls.some(
        (c) => c[0] === 'createdBy' && c[1] === '==' && c[2] === 'uid-1'
      )
    ).toBe(true)
  })

  it("subscribes with deadline < now filter for 'expired' mode", () => {
    renderHook(() => useHeists('expired'))
    const calls = mockWhere.mock.calls
    expect(calls.some((c) => c[0] === 'deadline' && c[1] === '<')).toBe(true)
  })

  it('returns heists mapped from snapshot docs', () => {
    const { result } = renderHook(() => useHeists('assigned'))

    act(() => {
      capturedCallback({
        docs: makeDocs([
          { title: 'Steal the Stapler', createdBy: 'uid-1', finalStatus: null },
          { title: 'Coffee Heist', createdBy: 'uid-1', finalStatus: 'success' },
        ]),
      })
    })

    expect(result.current.heists).toHaveLength(2)
    expect(result.current.heists[0].title).toBe('Steal the Stapler')
    expect(result.current.loading).toBe(false)
  })

  it('returns empty array and skips query when user is null', () => {
    mockUseUser.mockReturnValue({ user: null, loading: false })
    const { result } = renderHook(() => useHeists('active'))
    expect(result.current.heists).toHaveLength(0)
    expect(result.current.loading).toBe(false)
    expect(mockOnSnapshot).not.toHaveBeenCalled()
  })

  it('cleans up the listener on unmount', () => {
    const { unmount } = renderHook(() => useHeists('active'))
    unmount()
    expect(mockUnsubscribe).toHaveBeenCalledOnce()
  })

  it('filters out null finalStatus for expired mode client-side', () => {
    const { result } = renderHook(() => useHeists('expired'))

    act(() => {
      capturedCallback({
        docs: makeDocs([
          {
            title: 'Old Heist',
            deadline: { seconds: 1 },
            finalStatus: 'success',
          },
          {
            title: 'Pending Heist',
            deadline: { seconds: 1 },
            finalStatus: null,
          },
        ]),
      })
    })

    expect(result.current.heists).toHaveLength(1)
    expect(result.current.heists[0].title).toBe('Old Heist')
  })
})
