import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Modal from './Modal'

describe('Modal Component', () => {
  const setShowModal = jest.fn()

  it('renders correctly', () => {
    render(<Modal toggleModal={setShowModal} showModal={false} />)
    expect(screen.getByTestId('modal-background')).toBeInTheDocument()
  })

  it('is visible when showModal is true', () => {
    render(<Modal toggleModal={setShowModal} showModal />)
    expect(screen.getByTestId('modal-background')).not.toHaveClass('invisible')
  })

  it('is not visible when showModal is false', () => {
    render(<Modal toggleModal={setShowModal} showModal={false} />)
    expect(screen.getByTestId('modal-background')).toHaveClass('invisible')
  })

  it('closes when clicking the background', () => {
    render(<Modal toggleModal={setShowModal} showModal />)
    fireEvent.click(screen.getByTestId('modal-background'))
    expect(setShowModal).toHaveBeenCalled()
  })

  it('does not close when clicking inside the modal', () => {
    setShowModal.mockClear()
    render(<Modal toggleModal={setShowModal} showModal />)
    const modalContent = screen.getByTestId('modal-content')
    fireEvent.click(modalContent)
    expect(setShowModal).not.toHaveBeenCalled()
  })

  it('renders modal children correctly', () => {
    const childText = 'Test Child'
    render(
      <Modal toggleModal={setShowModal} showModal>
        <div>{childText}</div>
      </Modal>
    )
    expect(screen.getByText(childText)).toBeInTheDocument()
  })
})
