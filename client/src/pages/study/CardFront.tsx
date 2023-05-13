import React from 'react'

function CardFront ({ frontValue }: { frontValue: string }): JSX.Element {
  return (
    <p style={{ fontSize: 55, textAlign: 'center', marginBottom: 30 }}>
      {frontValue}
    </p>
  )
}

export default CardFront
