/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
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
    render(<Button buttonText={buttonText} handleClick={handleClick} />)
    fireEvent.click(screen.getByRole('button'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('displays the loading text and disables button when loading', () => {
    render(<Button buttonText={buttonText} loading={true} loadingText={loadingText} />)
    expect(screen.getByRole('button')).toHaveTextContent(loadingText)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('is disabled when the disabled prop is true', () => {
    render(<Button buttonText={buttonText} disabled />)
    expect(screen.getByRole('button')).toBeDisabled()
  })

  it('has the correct type when specified', () => {
    render(<Button buttonText={buttonText} type="submit" />)
    expect(screen.getByRole('button')).toHaveAttribute('type', 'submit')
  })
})
