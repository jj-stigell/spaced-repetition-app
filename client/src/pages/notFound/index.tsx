import React from 'react'

function NotFound (): JSX.Element {
  return (
    <div id="error-page">
      <h1>Oops!</h1>
      <p>Sorry, Page not found.</p>
      <a href='/'>Back to main page</a>
    </div>
  )
}

export default NotFound
