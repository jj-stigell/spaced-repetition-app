import React from 'react'

function CardFront ({ frontValue }: { frontValue: string }): JSX.Element {
  return (
    <p style={{ fontSize: 55, textAlign: 'center', paddingBottom: 50 }}>
      {frontValue}
    </p>
  )
}

export default CardFront
