import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Card } from '../types'

interface CardState {
  activeCard?: Card
  cards: Card[]
}

const initialState: CardState = {
  activeCard: undefined,
  cards: []
}

const cardSlice = createSlice({
  name: 'card',
  initialState,
  reducers: {
    setCards (state, action: PayloadAction<CardState>) {
      return action.payload
    },
    resetCards () {
      return initialState
    }
  }
})

export const { setCards, resetCards } = cardSlice.actions

export default cardSlice.reducer
