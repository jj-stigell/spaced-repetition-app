import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Keyboard, { hiraganaKeys, hiraganaKeysYoon, mapKeys } from './Keyboard'

describe('Keyboard Component', () => {
  const addCharFromKeyboard = jest.fn()

  it('renders properly', () => {
    render(<Keyboard addCharFromKeyboard={addCharFromKeyboard} />)
    expect(screen.getByRole('tab', { name: /Hiragana/i })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: /Yōon/i })).toBeInTheDocument()
  })

  it('switches tabs correctly', () => {
    render(<Keyboard addCharFromKeyboard={addCharFromKeyboard} />)

    // Initial tab is Hiragana
    expect(screen.getByText('あ')).toBeInTheDocument()

    // Switch to Yōon tab
    fireEvent.click(screen.getByRole('tab', { name: /Yōon/i }))
    expect(screen.getByText('きゃ')).toBeInTheDocument()
  })

  it('simulates key press correctly', () => {
    render(<Keyboard addCharFromKeyboard={addCharFromKeyboard} />)

    // Simulate key press
    fireEvent.click(screen.getByText('あ'))
    expect(addCharFromKeyboard).toHaveBeenCalledWith('あ')
  })

  it('renders keys correctly', () => {
    render(<Keyboard addCharFromKeyboard={addCharFromKeyboard} />)

    // Check if keys are rendered
    hiraganaKeys.flat().forEach((char) => {
      if (char.length > 0) {
        expect(screen.getByText(char)).toBeInTheDocument()
      }
    })

    // Switch to Yōon tab and check keys
    fireEvent.click(screen.getByRole('tab', { name: /Yōon/i }))
    hiraganaKeysYoon.flat().forEach((char) => {
      if (char.length > 0) {
        expect(screen.getByText(char)).toBeInTheDocument()
      }
    })
  })
})

describe('mapKeys Function', () => {
  const mockHandleKeyPress = jest.fn()
  const testKeys = [['A', 'B', 'C'], ['D', 'E', 'F']]

  it('renders all keys correctly', () => {
    render(mapKeys(testKeys, mockHandleKeyPress))

    // Check if all keys are rendered
    testKeys.flat().forEach((char) => {
      expect(screen.getByText(char)).toBeInTheDocument()
    })
  })

  it('handles key presses correctly', () => {
    render(mapKeys(testKeys, mockHandleKeyPress))

    // Simulate key press
    fireEvent.click(screen.getByText('A'))
    expect(mockHandleKeyPress).toHaveBeenCalledWith('A')
  })

  it('displays empty keys as disabled', () => {
    const keysWithEmpty = [['G', '', 'H']]
    render(mapKeys(keysWithEmpty, mockHandleKeyPress))

    expect(screen.getByText('--')).toBeInTheDocument()
    expect(screen.getByText('--')).toBeDisabled()
  })
})
