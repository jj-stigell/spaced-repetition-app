import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { Category, JlptLevel } from '../types'

export interface CategoryState {
  jlptLevel?: JlptLevel
  categories: Category[]
}

export const initialState: CategoryState = {
  jlptLevel: undefined,
  categories: []
}

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    setCategories (state, action: PayloadAction<CategoryState>) {
      return action.payload
    },
    resetCategories () {
      return initialState
    }
  }
})

export const { setCategories, resetCategories } = categorySlice.actions

export default categorySlice.reducer
