import React from 'react'

import { CardType } from '../../types'
import KanjiDetail from './KanjiDetail'

function CardDetail ({ data, cardType }: { data: any, cardType: CardType }): JSX.Element {
  switch (cardType) {
    case CardType.KANJI:
      return <KanjiDetail data={data}/>
    case CardType.KATAKANA:
      return <KanjiDetail data={data}/>
    case CardType.HIRAGANA:
      return <KanjiDetail data={data}/>
    case CardType.VOCABULARY:
      return <KanjiDetail data={data}/>
    default:
      return <KanjiDetail data={data}/>
  }
}

export default CardDetail
