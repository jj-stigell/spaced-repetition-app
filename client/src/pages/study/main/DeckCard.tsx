import React from 'react'
import { useTranslation } from 'react-i18next'
import { Role } from 'src/types'

interface IDeckCard {
  id: number
  title: string
  description: string
  cards: number
  memberOnly: boolean
  translationAvailable: boolean
  category: string
  role: Role
}

// https://pixabay.com/service/license-summary/
const kanjiDeck: string = 'https://i.ibb.co/C731yy2/Kanji-deck.png'
const vocabularyDeck: string = 'https://i.ibb.co/Hr52zSy/Vocabulary-deck.png'
const grammarDeck: string = 'https://i.ibb.co/0p7zKQb/Grammar-deck.png'
const imageNotFound: string = 'https://i.ibb.co/wzKQFF1/Image-not-available.webp'

function getImage (category: string): string {
  if (category === 'KANJI') {
    return kanjiDeck
  } else if (category === 'VOCABULARY') {
    return vocabularyDeck
  } else if (category === 'GRAMMAR') {
    return grammarDeck
  } else {
    return imageNotFound
  }
}

export default function DeckCard ({ id, title, description, cards, memberOnly, translationAvailable, category }: IDeckCard): React.JSX.Element {
  const { t } = useTranslation()
  const image = getImage(category)
  const role = Role.NON_MEMBER
  const disabled = memberOnly && role === Role.NON_MEMBER

  return (
    <div className={`flex-none w-60 p-2 rounded-xl ${disabled ? 'bg-gray-300' : 'bg-white transform transition-all hover:-translate-y-2 duration-200 shadow-lg hover:shadow-2xl'}`}>
      <img className="h-40 object-cover rounded-xl w-60 object-cover rounded-xl" src={image} alt=""/>
      <div className="p-2">
        <h2 className="font-bold text-lg mb-2 ">{title}</h2>
        <p className="text-sm text-gray-600">{description}</p>
        <p className="text-sm text-gray-600">{cards} cards</p>
      </div>
      <div className="m-2">
        <button disabled={disabled} onClick={() => { console.log('stuudydydydy') }} className={`px-3 py-1 rounded-md text-white ${disabled ? 'bg-gray-600' : ' bg-purple-600 hover:bg-purple-700'}`}>
          {t(disabled ? 'memberOnly' : 'study')}
        </button>
      </div>
    </div>
  )
};
