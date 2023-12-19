/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'

export default function UserInteractionPanel ({ onReadingSubmit, onShowHint, inputValue, onInputChange }: any): React.JSX.Element {
  const buttonClass = inputValue ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-200'

  return (
      <form onSubmit={onReadingSubmit} className="flex flex-col items-center">
          <input
              type="text"
              placeholder="Enter reading"
              className="mb-2 p-2 border rounded"
              onChange={onInputChange}
              value={inputValue}
          />
          <button
              type="submit"
              className={`${buttonClass} text-white px-4 py-2 rounded mb-2 transition duration-200 ease-in-out`}
              disabled={!(inputValue)}
          >
              Submit
          </button>
          <button type="button" onClick={onShowHint} className="text-gray-600">Hint</button>
      </form>
  )
}
