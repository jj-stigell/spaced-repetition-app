/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'
import SubmitButton from './SubmitButton'
import '@testing-library/jest-dom'

test('renders the submit button component with correct text', () => {
  const { getByText } = render(<SubmitButton buttonText='testing'/>)
  const text = getByText(/testing/)
  expect(text).toBeInTheDocument()
})
