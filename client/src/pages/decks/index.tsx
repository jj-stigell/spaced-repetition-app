import React, { useEffect, useState } from 'react'
import DeckCard from './DeckCard'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import axios from 'src/lib/axios'
import { getDecks } from 'src/config/api'
import { mockDecks } from 'src/data/mockdata'
import DeckCardSkeleton from './DeckCardSkeleton'

export default function Decks (): React.JSX.Element {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const [categories, setGategories] = useState(mockDecks as any[])
  // const [categories, setCategories] = useState([])
  const [showModal, setShowModal] = useState<boolean>(false)
  const account = useAppSelector((state: RootState) => state.account)

  useEffect(() => {
    /*
    axios.get(`${getDecks}?level=${account.jlptLevel}&language=${account.language}`)
      .then(function (data) {
        // dispatch(setDecks({ category: category as DeckCategory, decks: response.data.data }))
        console.log(data)
      })
      .catch(function (error) {
        console.log(error)
      })
      */
  }, [])

  const skeletons = [1, 2, 3]

  return (
    <>
      {
        (categories.length === 0)
          ? skeletons.map((skeleton) => (
            <>
              <div role="status" className="max-w-sm animate-pulse">
                <div className="h-3.5 bg-gray-200 rounded-full dark:bg-gray-700 w-58 mb-4"/>
              </div>
              <div className="flex space-x-4 overflow-x-auto">
                {[1, 2, 3, 4, 5, 6].map((value: number) => {
                  return (
                    <DeckCardSkeleton key={value}/>
                  )
                })}
              </div>
              { skeleton !== 5 && <hr className="my-4" /> }
          </>
          ))
          : categories.map((category, index) => {
            return (
              <>
                <h1 className="mt-2 mb-4 text-3xl font-semibold dark:text-white">{category.category}</h1>
                <div className="flex space-x-4 overflow-x-auto">
                  {category.decks.map((deck: any) => {
                    return (
                      <DeckCard
                        key={deck.id}
                        id={deck.id}
                        title={deck.title}
                        description={deck.description}
                        cards={deck.cards}
                        memberOnly={deck.memberOnly}
                        translationAvailable={deck.translationAvailable}
                        category={deck.category}
                        role={account.role}
                      />
                    )
                  })}
                </div>
                { index !== categories.length - 1 && <hr className="my-4" /> }
              </>
            )
          })

      }
    </>
  )
};
