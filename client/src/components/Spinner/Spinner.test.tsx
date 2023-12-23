import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Spinner from './Spinner'

describe('Spinner Component', () => {
  it('renders properly', () => {
    render(<Spinner text="Loading..." />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })

  it('displays the correct text', () => {
    const testText = 'Loading...'
    render(<Spinner text={testText} />)
    expect(screen.getByText(testText)).toBeInTheDocument()
  })
})
