import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('firebase/firestore', () => ({
  addDoc: vi.fn(),
  collection: vi.fn(),
  getDocs: vi.fn(),
  serverTimestamp: vi.fn(() => ({ type: 'serverTimestamp' })),
  Timestamp: {
    fromDate: vi.fn((date: Date) => ({
      seconds: Math.floor(date.getTime() / 1000),
    })),
  },
}))
vi.mock('@/lib/firebase', () => ({ auth: {}, db: {} }))
vi.mock('@/context/AuthContext', () => ({ useUser: vi.fn() }))
vi.mock('next/navigation', () => ({ useRouter: vi.fn() }))

import CreateHeistForm from '@/components/CreateHeistForm'
import { addDoc, getDocs, Timestamp } from 'firebase/firestore'
import { useUser } from '@/context/AuthContext'
import { useRouter } from 'next/navigation'

const mockAddDoc = vi.mocked(addDoc)
const mockGetDocs = vi.mocked(getDocs)
const mockTimestampFromDate = vi.mocked(Timestamp.fromDate)
const mockUseUser = vi.mocked(useUser)
const mockUseRouter = vi.mocked(useRouter)

const fakeOperatives = [
  { id: 'uid-2', data: () => ({ codename: 'NightOwl' }) },
  { id: 'uid-3', data: () => ({ codename: 'IronFox' }) },
]

let mockPush: ReturnType<typeof vi.fn>

beforeEach(() => {
  vi.clearAllMocks()
  mockPush = vi.fn()
  mockUseRouter.mockReturnValue({ push: mockPush } as any)
  mockUseUser.mockReturnValue({
    user: { uid: 'uid-1', displayName: 'ShadowFox' } as any,
    loading: false,
  })
  mockGetDocs.mockResolvedValue({ docs: fakeOperatives } as any)
  mockAddDoc.mockResolvedValue({ id: 'heist-1' } as any)
})

async function fillAndSubmit(
  title = 'Break Room Takeover',
  description = 'Steal all the coffee'
) {
  fireEvent.change(screen.getByLabelText('Title'), {
    target: { value: title },
  })
  fireEvent.change(screen.getByLabelText('Description'), {
    target: { value: description },
  })
  // wait for operatives to load then select one
  const select = await screen.findByLabelText('Assign to Operative')
  fireEvent.change(select, { target: { value: 'uid-2' } })
}

describe('CreateHeistForm', () => {
  it('renders title, description, and assignee fields', async () => {
    render(<CreateHeistForm />)
    expect(screen.getByLabelText('Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Description')).toBeInTheDocument()
    expect(
      await screen.findByLabelText('Assign to Operative')
    ).toBeInTheDocument()
  })

  it('populates assignee dropdown from users collection on mount', async () => {
    render(<CreateHeistForm />)
    expect(
      await screen.findByRole('option', { name: 'NightOwl' })
    ).toBeInTheDocument()
    expect(screen.getByRole('option', { name: 'IronFox' })).toBeInTheDocument()
  })

  it('calls addDoc with the correct data shape on submit', async () => {
    render(<CreateHeistForm />)
    await fillAndSubmit()

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Create Heist' }).closest('form')!
      )
    })

    expect(mockAddDoc).toHaveBeenCalledOnce()
    const [, data] = mockAddDoc.mock.calls[0]
    expect(data).toMatchObject({
      title: 'Break Room Takeover',
      description: 'Steal all the coffee',
      createdBy: 'uid-1',
      createdByCodename: 'ShadowFox',
      assignedTo: 'uid-2',
      assignedToCodename: 'NightOwl',
      finalStatus: null,
    })
  })

  it('sets deadline to 48 hours from now', async () => {
    const now = Date.now()
    render(<CreateHeistForm />)
    await fillAndSubmit()

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Create Heist' }).closest('form')!
      )
    })

    expect(mockTimestampFromDate).toHaveBeenCalledOnce()
    const calledWith: Date = mockTimestampFromDate.mock.calls[0][0]
    const diff = calledWith.getTime() - now
    const fortyEightHours = 48 * 60 * 60 * 1000
    expect(diff).toBeGreaterThanOrEqual(fortyEightHours - 1000)
    expect(diff).toBeLessThanOrEqual(fortyEightHours + 1000)
  })

  it('disables form while submission is in progress', async () => {
    mockAddDoc.mockReturnValue(new Promise(() => {}))
    render(<CreateHeistForm />)
    await fillAndSubmit()

    fireEvent.submit(
      screen.getByRole('button', { name: 'Create Heist' }).closest('form')!
    )

    expect(screen.getByLabelText('Title')).toBeDisabled()
    expect(screen.getByLabelText('Description')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Creating...' })).toBeDisabled()
  })

  it('shows error message when addDoc fails', async () => {
    mockAddDoc.mockRejectedValue(new Error('Firestore error'))
    render(<CreateHeistForm />)
    await fillAndSubmit()

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Create Heist' }).closest('form')!
      )
    })

    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
  })

  it('redirects to /heists after successful submission', async () => {
    render(<CreateHeistForm />)
    await fillAndSubmit()

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Create Heist' }).closest('form')!
      )
    })

    expect(mockPush).toHaveBeenCalledWith('/heists')
  })
})
