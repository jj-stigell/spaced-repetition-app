import { createSlice } from '@reduxjs/toolkit'

const initialState = []

const accountSlice = createSlice({
  name: 'decks',
  initialState,
  reducers: {
    setDecks (state, action) {
      return action.payload
    },
    // eslint-disable-next-line no-unused-vars
    resetDecks (state, action) {
      return initialState
    }
  }
})

export const { setDecks, resetDecks } = accountSlice.actions

export const addDeckSettingsToDeck = ({ deckId, deckSettings, decks }) => {
  return async (dispatch) => {
    const deck = decks.filter(deck => deck.id === deckId)
    if (deck) deck.accountDeckSettings = deckSettings
    dispatch(setDecks(decks))
  }
}

export default accountSlice.reducer
