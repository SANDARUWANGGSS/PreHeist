import { render, screen, fireEvent, act } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import AuthForm from '@/components/AuthForm'

vi.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: vi.fn(),
  updateProfile: vi.fn(),
}))
vi.mock('firebase/firestore', () => ({
  setDoc: vi.fn(),
  doc: vi.fn(),
}))
vi.mock('@/lib/firebase', () => ({ auth: {}, db: {} }))
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({ push: vi.fn() })),
}))
vi.mock('@/lib/generateCodename', () => ({
  generateCodename: vi.fn().mockReturnValue('TestShadowFox'),
}))

import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { setDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'

const mockCreateUser = vi.mocked(createUserWithEmailAndPassword)
const mockUpdateProfile = vi.mocked(updateProfile)
const mockSetDoc = vi.mocked(setDoc)

describe('AuthForm', () => {
  let mockPush: ReturnType<typeof vi.fn>

  beforeEach(() => {
    vi.clearAllMocks()
    mockPush = vi.fn()
    vi.mocked(useRouter).mockReturnValue({ push: mockPush } as any)
    mockCreateUser.mockResolvedValue({ user: { uid: 'uid-123' } } as any)
    mockUpdateProfile.mockResolvedValue(undefined)
    mockSetDoc.mockResolvedValue(undefined)
  })

  it('renders email and password fields', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Password')).toBeInTheDocument()
  })

  it('renders "Login" submit button in login mode', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('renders "Sign Up" submit button in signup mode', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByRole('button', { name: 'Sign Up' })).toBeInTheDocument()
  })

  it('hides password by default', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    )
  })

  it('reveals password when toggle is clicked', () => {
    render(<AuthForm mode="login" />)
    fireEvent.click(screen.getByRole('button', { name: 'Show password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'text')
  })

  it('hides password again when toggle is clicked a second time', () => {
    render(<AuthForm mode="login" />)
    const toggle = screen.getByRole('button', { name: 'Show password' })
    fireEvent.click(toggle)
    fireEvent.click(screen.getByRole('button', { name: 'Hide password' }))
    expect(screen.getByLabelText('Password')).toHaveAttribute(
      'type',
      'password'
    )
  })

  it('logs email and password to console on submit', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})
    render(<AuthForm mode="login" />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'secret123' },
    })
    fireEvent.submit(
      screen.getByRole('button', { name: 'Login' }).closest('form')!
    )

    expect(consoleSpy).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'secret123',
    })
    consoleSpy.mockRestore()
  })

  it('switch link points to /signup in login mode', () => {
    render(<AuthForm mode="login" />)
    expect(screen.getByRole('link', { name: 'Sign up' })).toHaveAttribute(
      'href',
      '/signup'
    )
  })

  it('switch link points to /login in signup mode', () => {
    render(<AuthForm mode="signup" />)
    expect(screen.getByRole('link', { name: 'Login' })).toHaveAttribute(
      'href',
      '/login'
    )
  })

  it('disables inputs and submit button while loading', () => {
    mockCreateUser.mockReturnValue(new Promise(() => {}))
    render(<AuthForm mode="signup" />)

    fireEvent.submit(
      screen.getByRole('button', { name: 'Sign Up' }).closest('form')!
    )

    expect(screen.getByLabelText('Email')).toBeDisabled()
    expect(screen.getByLabelText('Password')).toBeDisabled()
    expect(screen.getByRole('button', { name: 'Loading...' })).toBeDisabled()
  })

  it('displays error message when signup fails', async () => {
    mockCreateUser.mockRejectedValue(new Error('auth/email-already-in-use'))
    render(<AuthForm mode="signup" />)

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Sign Up' }).closest('form')!
      )
    })

    expect(
      screen.getByText('Something went wrong. Please try again.')
    ).toBeInTheDocument()
  })

  it('calls Firebase functions and redirects on successful signup', async () => {
    render(<AuthForm mode="signup" />)

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'new@example.com' },
    })
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password123' },
    })

    await act(async () => {
      fireEvent.submit(
        screen.getByRole('button', { name: 'Sign Up' }).closest('form')!
      )
    })

    expect(mockCreateUser).toHaveBeenCalledWith(
      {},
      'new@example.com',
      'password123'
    )
    expect(mockUpdateProfile).toHaveBeenCalledWith(
      { uid: 'uid-123' },
      { displayName: 'TestShadowFox' }
    )
    expect(mockSetDoc).toHaveBeenCalled()
    expect(mockPush).toHaveBeenCalledWith('/heists')
  })
})
