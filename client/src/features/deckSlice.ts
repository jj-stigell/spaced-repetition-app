import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Deck, DeckCategory } from '../types'

export interface DeckState {
  category?: DeckCategory
  decks: Deck[]
}

export const initialState: DeckState = {
  category: undefined,
  decks: []
}

const deckSlice = createSlice({
  name: 'deck',
  initialState,
  reducers: {
    setDecks (state, action: PayloadAction<DeckState>) {
      return action.payload
    }
  }
})

export const { setDecks } = deckSlice.actions

export default deckSlice.reducer
