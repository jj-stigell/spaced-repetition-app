import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Button from './Button'

describe('Button Component', () => {
  const buttonText = 'Click Me'
  const loadingText = 'Loading...'
  const handleClick = jest.fn()

  it('renders the button with text', () => {
    render(<Button buttonText={buttonText} />)
    expect(screen.getByRole('button')).toHaveTextContent(buttonText)
  })

  it('calls the handleClick function when clicked', () => {
    render(<Button buttonText={buttonText} onClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('shows loading text when loading', () => {
    render(<Button buttonText={buttonText} loadingText={loadingText} loading />)
    expect(screen.getByRole('button')).toHaveTextContent(loadingText)
  })

  it('shows buttonText as default when loading but loadingText not given', () => {
    render(<Button buttonText={buttonText} loading />)
    expect(screen.getByRole('button')).toHaveTextContent(buttonText)
  })

  it('is disabled when the disabled prop is true', () => {
    render(<Button buttonText={buttonText} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has the correct type when specified', () => {
    render(<Button buttonText={buttonText} type="submit" />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })

  it('applies the correct color class based on the color prop', () => {
    const { rerender } = render(<Button buttonText="Test" color="blue" />)
    expect(screen.getByRole('button')).toHaveClass('bg-blue-600 hover:bg-blue-700')

    rerender(<Button buttonText="Test" color="red" />)
    expect(screen.getByRole('button')).toHaveClass('bg-red-600 hover:bg-red-700')

    rerender(<Button buttonText="Test" color="green" />)
    expect(screen.getByRole('button')).toHaveClass('bg-green-600 hover:bg-green-700')
  })
})
