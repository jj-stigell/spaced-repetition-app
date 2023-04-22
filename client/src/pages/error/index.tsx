/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'

function ErrorPage (): JSX.Element {
  const error = useRouteError()
  console.error(error)

  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, an unexpected error has occurred.</p>
      <p>
        {(isRouteErrorResponse(error))
          ? <i>{error.statusText}</i>
          : (error instanceof Error)
              ? <i>{error.message}</i>
              : <i>{'Unknown Error'}</i>
        }
      </p>
    </div>
  )
}

export default ErrorPage
