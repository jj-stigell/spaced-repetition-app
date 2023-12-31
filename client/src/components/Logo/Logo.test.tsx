import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { constants } from '../../config/constants'
import Logo from './Logo'
import { BrowserRouter } from 'react-router-dom'

describe('Logo Component', () => {
  it('renders the component correctly', () => {
    render(
      <BrowserRouter>
        <Logo/>
      </BrowserRouter>
    )
    expect(screen.getByText(constants.appName)).toBeInTheDocument()
  })
})
