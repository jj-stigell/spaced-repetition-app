import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  registered: false,
  email: null
}

const registerSlice = createSlice({
  name: 'register',
  initialState,
  reducers: {
    setRegister (state, action) {
      return action.payload
    }
  }
})

export const { setRegister } = registerSlice.actions

export default registerSlice.reducer
