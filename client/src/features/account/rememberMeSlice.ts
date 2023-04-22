import { createSlice } from '@reduxjs/toolkit'

export interface RememberMe {
  rememberMeEmail: string | null
  rememberMePassword: string | null
}

const initialState: RememberMe = {
  rememberMeEmail: null,
  rememberMePassword: null
}

const rememberSlice = createSlice({
  name: 'remember',
  initialState,
  reducers: {
    setRememberMe (state, action) {
      return action.payload
    },
    resetRememberMe (state, action) {
      return initialState
    }
  }
})

export const { setRememberMe, resetRememberMe } = rememberSlice.actions

export default rememberSlice.reducer
