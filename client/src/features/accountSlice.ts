import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JlptLevel, Role } from '../types'

export interface Account {
  username: string
  email: string
  role: Role
  allowNewsLetter: boolean
  language: string
  jlptLevel: JlptLevel
}

export interface AccountState {
  isLoggedIn: boolean
  account: Account
}

export const initialState: AccountState = {
  isLoggedIn: false,
  account: {
    username: '',
    email: '',
    role: Role.NON_MEMBER,
    allowNewsLetter: false,
    language: 'EN',
    jlptLevel: JlptLevel.N5
  }
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount (state, action) {
      return action.payload
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

export const { setJlptLevel, setAccount } = accountSlice.actions

/*
export const logOutAccount = () => {
  return async (dispatch) => {
    dispatch(resetAccount(null))
    localStorage.removeItem('srs-token')
  }
}
*/

export default accountSlice.reducer
