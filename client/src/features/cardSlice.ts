import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import _ from 'lodash'
import { AnswerOption, Card } from '../types'

/**
 * Shuffles answer options randomly to avoid the situation
 * where user memorizes the correct answer button position.
 * @param {AnswerOption[]} array - Array of options.
 * @returns {AnswerOption[]} - Shuffled options.
 */
function shuffleOptions (array: AnswerOption[]): AnswerOption[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]]
  }
  return array
}

interface CardState {
  activeCard: Card | null
  cards: Card[]
}

const initialState: CardState = {
  activeCard: null,
  cards: []
}

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCards (state, action: PayloadAction<CardState>) {
      const activeCard: Card = action.payload.activeCard as Card
      activeCard.card.answerOptions = shuffleOptions(activeCard.card.answerOptions)

      return {
        activeCard,
        cards: action.payload.cards
      }
    },
    resetCards () {
      return initialState
    },
    setNextCard (state, action: PayloadAction<boolean>) {
      const cards: Card[] = _.cloneDeep(state.cards)

      // If answer is not correct, push current card to the end of the card queue.
      if (!action.payload) {
        if (state.activeCard != null) {
          cards.push(state.activeCard)
        }
      }

      const newActiveCard: Card | undefined = cards.shift()

      if (newActiveCard !== undefined) {
        newActiveCard.card.answerOptions = shuffleOptions(newActiveCard.card.answerOptions)
      }

      return {
        activeCard: newActiveCard ?? null,
        cards
      }
    }
  }
})

export const { setCards, resetCards, setNextCard } = cardSlice.actions

export default cardSlice.reducer
