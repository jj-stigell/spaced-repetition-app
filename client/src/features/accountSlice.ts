import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JlptLevel, Role } from '../types'

export interface AccountState {
  isLoggedIn: boolean
  account: {
    role: Role
    jlptLevel: JlptLevel
    username: string
    email: string
  }
}

const initialState: AccountState = {
  isLoggedIn: false,
  account: {
    role: Role.NonMember,
    jlptLevel: JlptLevel.N5,
    username: '',
    email: ''
  }
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount (state, action) {
      return action.payload
    },
    setLogin (state, action) {
      return {
        ...state,
        isLoggedIn: action.payload
      }
    },
    setJlptLevel (state, action: PayloadAction<JlptLevel>) {
      return {
        ...state,
        account: {
          ...state.account,
          jlptLevel: action.payload
        }
      }
    }
  }
})

export const { setAccount, setJlptLevel, setLogin } = accountSlice.actions

/*
export const logOutAccount = () => {
  return async (dispatch) => {
    dispatch(resetAccount(null))
    localStorage.removeItem('srs-token')
  }
}
*/

export default accountSlice.reducer
