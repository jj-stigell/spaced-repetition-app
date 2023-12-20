import React from 'react'

import Spinner from './Spinner'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Props = {
  loading: boolean
  handleClick: () => void
  loadingText: string
  buttonText: string
}

export default function Button ({ loading, handleClick, loadingText, buttonText }: Props): React.JSX.Element {
  return (
    <button
      disabled={loading}
      onClick={handleClick}
      className="w-full text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700"
    >
      {loading ? (<Spinner text={loadingText} />) : buttonText }
    </button>
  )
}
