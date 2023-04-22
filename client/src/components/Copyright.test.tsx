/**
 * @jest-environment jsdom
 */

import React from 'react'
import { render } from '@testing-library/react'
import Logo from './Logo'
import '@testing-library/jest-dom'
import { constants } from '../config/constants'

test('renders the copyright component', () => {
  const { getByText } = render(<Logo fontSize={20}/>)
  let text = getByText(constants.appName)
  expect(text).toBeInTheDocument()
  text = getByText(new RegExp(new Date().getFullYear().toString()))
  expect(text).toBeInTheDocument()
})
