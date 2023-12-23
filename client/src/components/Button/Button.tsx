import React, { ComponentProps } from 'react'

interface IButton extends Omit<ComponentProps<'button'>, 'ref' | 'style'> {
  /**
   * The text to be displayed on the button.
   */
  buttonText: string

  /**
   * Optional click event handler for the button.
   */
  handleClick?: () => void

  /**
   * Text to display when the button is in a loading state.
   * @default undefined
   */
  loadingText?: string

  /**
   * If `true`, the button is disabled.
   * @default false
   */
  disabled?: boolean

  /**
   * If `true`, the button is in a loading state.
   * @default false
   */
  loading?: boolean

  /**
   * The type of the button, can be 'button', 'submit', or 'reset'.
   * @default 'button'
   */
  type?: 'button' | 'submit' | 'reset'
}

export default function Button ({
  buttonText,
  handleClick,
  loadingText = buttonText,
  disabled,
  loading = false,
  type = 'button'
}: IButton): React.JSX.Element {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={handleClick}
      className={`flex justify-center items-center w-full text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 ${(disabled ?? false) ? 'cursor-not-allowed' : ''}`}
    >
      {loading
        ? (
        <>
          <svg width="20" height="20" fill="currentColor" className="mr-2 animate-spin" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
            <path d="M526 1394q0 53-37.5 90.5t-90.5 37.5q-52 0-90-38t-38-90q0-53 37.5-90.5t90.5-37.5 90.5 37.5 37.5 90.5zm498 206q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-704-704q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm1202 498q0 52-38 90t-90 38q-53 0-90.5-37.5t-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-964-996q0 66-47 113t-113 47-113-47-47-113 47-113 113-47 113 47 47 113zm1170 498q0 53-37.5 90.5t-90.5 37.5-90.5-37.5-37.5-90.5 37.5-90.5 90.5-37.5 90.5 37.5 37.5 90.5zm-640-704q0 80-56 136t-136 56-136-56-56-136 56-136 136-56 136 56 56 136zm530 206q0 93-66 158.5t-158 65.5q-93 0-158.5-65.5t-65.5-158.5q0-92 65.5-158t158.5-66q92 0 158 66t66 158z">
            </path>
          </svg>
          {loadingText}
        </>
          )
        : buttonText }
    </button>
  )
}
