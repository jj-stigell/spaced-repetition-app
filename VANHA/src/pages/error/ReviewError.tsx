import React from 'react'

import ErrorPage from '.'

function ReviewError ({ errorMessage }: { errorMessage: string }): JSX.Element {
  return (
    <ErrorPage>
      <>
        {errorMessage}
      </>
    </ErrorPage>
  )
}

export default ReviewError
