import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'

import { kanjiCards } from '../../data/mockdata'
import DialMenu from './DialMenu'
import CardFront from './CardFront'
import CardBack from './CardBack'

export default function Study ({ deckId }: any): React.JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()

  const [showCardBack, setShowCardBack] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0)

  /*
  React.useEffect(() => {
    if ((id !== undefined) && !isNaN(Number(id))) {
      axios.get(`api/v1/deck/${id}/cards`, { params: { language, onlyDue } })
        .then(function (response) {
          const cards: Card[] = response.data.data
          if (cards.length > 0) {
            const firstCard: Card = cards.shift() as Card
            dispatch(setCards({ activeCard: firstCard, cards }))
          } else {
            setIsError(t('errors.ERR_DECK_EMPTY'))
          }
        })
        .catch(function (error) {
          let errorCode: string | null = null

          if (Array.isArray(error?.response?.data?.errors)) {
            errorCode = error?.response?.data?.errors[0].code
          }

          if (errorCode != null) {
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
          } else if (error instanceof AxiosError) {
            dispatch(setNotification({ message: error.message, severity: 'error' }))
          } else {
            dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
          }
        }).finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsError(t('errors.ERR_DECK_ID_MISSING_OR_INVALID'))
    }
  }, [])
  */

  const handleNextCard = (): void => {
    setShowCardBack(false)
    setCurrentCardIndex((prevIndex) => (prevIndex + 1) % kanjiCards.length)
  }

  if (loading) {
    return (
      <div aria-label="Loading..." role="status" className="flex h-screen items-center justify-center space-x-2">
        <svg className="h-12 w-12 animate-spin stroke-blue-500" viewBox="0 0 256 256">
          <line x1="128" y1="32" x2="128" y2="64" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="195.9" y1="60.1" x2="173.3" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="224" y1="128" x2="192" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="195.9" y1="195.9" x2="173.3" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="128" y1="224" x2="128" y2="192" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="60.1" y1="195.9" x2="82.7" y2="173.3" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="32" y1="128" x2="64" y2="128" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
          <line x1="60.1" y1="60.1" x2="82.7" y2="82.7" strokeLinecap="round" strokeLinejoin="round" strokeWidth="24"/>
        </svg>
        <span className="text-4xl font-medium text-gray-500">{t('pages.review.loadingMessage')}</span>
      </div>
    )
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
