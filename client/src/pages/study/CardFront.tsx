import React from 'react'

function CardFront ({ frontValue }: { frontValue: string }): JSX.Element {
  return (
    <p style={{ fontSize: 55, textAlign: 'center', marginBottom: 40 }}>
      {frontValue}
    </p>
  )
}

export default CardFront
