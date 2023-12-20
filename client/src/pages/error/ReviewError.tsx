import React from 'react'

import ErrorPage from '.'

export default function ReviewError ({ errorMessage }: { errorMessage: string }): JSX.Element {
  return (
    <ErrorPage>
      <>
        {errorMessage}
      </>
    </ErrorPage>
  )
}
