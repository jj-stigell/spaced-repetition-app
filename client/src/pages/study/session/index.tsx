import React, { useState } from 'react'
import { kanjiCards } from '../../../data/mockdata'
import DialMenu from './DialMenu'
import CardFront from './CardFront'
import CardBack from './CardBack'

export default function Study ({ deckId }: any): React.JSX.Element {
  const [showCardBack, setShowCardBack] = useState(false)
  const [currentCardIndex, setCurrentCardIndex] = useState(0)

  const handleNextCard = (): void => {
    setShowCardBack(false)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % kanjiCards.length)
  }

  return (
    <div className="p-6 bg-blue-100">
        <div className="p-4 border rounded bg-white">
          <DialMenu />
          <CardFront data={kanjiCards[currentCardIndex]} showCardBack={showCardBack} setShowCardBack={setShowCardBack} />
          {showCardBack && <CardBack data={kanjiCards[currentCardIndex]} handleNextCard={handleNextCard} />}
        </div>
    </div>
  )
};
