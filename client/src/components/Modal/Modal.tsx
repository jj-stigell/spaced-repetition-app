/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { ComponentProps } from 'react'

interface IModal extends Omit<ComponentProps<'div'>, 'ref' | 'style'> {
  /**
   * Function for toggling the showstate of the modal.
   */
  toggleModal: () => void
  /**
   * If `true`, modal is and its children are dislpayed.
   * @default false
   */
  showModal: boolean
}

export default function Modal ({ toggleModal, showModal = false, children }: IModal): React.JSX.Element {
  return (
        <div
            onClick={() => { toggleModal() }}
            id="modal-background"
            data-testid="modal-background"
            className={`
            fixed inset-0 flex justify-center items-center transition-colors
            ${showModal ? 'visible bg-black/20' : 'invisible'}
            `}
        >
            <div
                onClick={(e) => { e.stopPropagation() }}
                className={`
                bg-white rounded-xl shadow transition-all
                ${showModal ? 'scale-100 opacity-100' : 'scale-125 opacity-0'}
                `}
            >
                <div id="modal-content" data-testid="modal-content" className="relative p-4 w-full max-w-lg max-h-full">
                    {children}
                </div>
            </div>
        </div>
  )
}
