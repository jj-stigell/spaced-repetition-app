import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import InputField from './InputField'

describe('InputField Component', () => {
  const label = 'Email'
  const value = 'test@example.com'
  const handleChange = jest.fn()
  const handleBlur = jest.fn()
  const errorMessage = 'Invalid email'
  const placeholder = 'Enter your email'

  it('renders the input field with label', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} />)
    expect(screen.getByLabelText(label)).toBeInTheDocument()
  })

  it('displays the correct input value', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} />)
    expect(screen.getByLabelText(label)).toHaveValue(value)
  })

  it('displays the correct placeholder', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} placeholder={placeholder} />)
    expect(screen.getByPlaceholderText(placeholder)).toBeInTheDocument()
  })

  it('calls onChange when the input value is changed', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} />)
    fireEvent.change(screen.getByLabelText(label), { target: { value: 'new@example.com' } })
    expect(handleChange).toHaveBeenCalled()
  })

  it('calls onBlur when the input is blurred', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} onBlur={handleBlur} />)
    fireEvent.blur(screen.getByLabelText(label))
    expect(handleBlur).toHaveBeenCalled()
  })

  it('shows an error message when there is an error', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} errors={errorMessage} fieldTouched={true} />)
    expect(screen.getByText(errorMessage)).toBeInTheDocument()
  })

  it('changes input style when there is an error', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} errors={errorMessage} fieldTouched={true} />)
    expect(screen.getByLabelText(label)).toHaveClass('bg-red-300 border-red-500 text-red-700')
  })

  it('applies additional props passed via rest parameters', () => {
    render(<InputField id='email' label={label} value={value} onChange={handleChange} data-testid='test-input' />)
    expect(screen.getByTestId('test-input')).toBeInTheDocument()
  })
})
