import { createSlice } from '@reduxjs/toolkit'

export interface Register {
  email: string
  username: string
  password: string
  passwordConfirmation: string
  language: string
  allowNewsLetter: false
}

export const initialState: Register = {
  email: '',
  username: '',
  password: '',
  passwordConfirmation: '',
  language: '',
  allowNewsLetter: false
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegister (state, action) {
      return action.payload
    },
    resetRegister (state) {
      return initialState
    }
  }
})

export const { setRegister, resetRegister } = registerSlice.actions

export default registerSlice.reducer
