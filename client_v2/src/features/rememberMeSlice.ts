import { createSlice } from '@reduxjs/toolkit'

export interface RememberMe {
  rememberEmail?: string
  rememberPassword?: string
}

const initialState: RememberMe = {
  rememberEmail: undefined,
  rememberPassword: undefined
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
