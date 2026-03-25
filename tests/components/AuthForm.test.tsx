import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import AuthForm from '@/components/AuthForm'

describe('AuthForm', () => {
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
})
