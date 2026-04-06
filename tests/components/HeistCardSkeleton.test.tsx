import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import HeistCardSkeleton from '@/components/HeistCardSkeleton'

describe('HeistCardSkeleton', () => {
  it('renders without errors', () => {
    render(<HeistCardSkeleton />)
  })

  it('renders no visible text content', () => {
    const { container } = render(<HeistCardSkeleton />)
    expect(container.textContent).toBe('')
  })

  it('is hidden from assistive technology', () => {
    render(<HeistCardSkeleton />)
    // The card is aria-hidden so screen readers skip it
    const card = screen.queryByRole('article')
    expect(card).not.toBeInTheDocument()
  })
})
