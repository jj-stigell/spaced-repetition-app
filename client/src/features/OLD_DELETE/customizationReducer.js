import { createSlice } from '@reduxjs/toolkit'
import { fontFamily, borderRadius } from '../../config/config'

const initialState = {
  isOpen: [], // for active default menu
  fontFamily,
  borderRadius,
  opened: true
}

const customizationSlice = createSlice({
  name: 'customization',
  initialState,
  reducers: {
    menuOpen (state, action) {
      // const id = action.id;
      return {
        ...state,
        isOpen: [action.payload]
      }
    },
    setMenu (state, action) {
      return {
        ...state,
        opened: action.payload
      }
    },
    setFontFamily (state, action) {
      return {
        ...state,
        fontFamily: action.payload
      }
    },
    setBorderRadius (state, action) {
      return {
        ...state,
        borderRadius: action.payload
      }
    }
  }
})

export const { menuOpen, setMenu, setFontFamily, setBorderRadius } = customizationSlice.actions

export default customizationSlice.reducer
