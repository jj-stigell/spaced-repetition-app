import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JlptLevel, Role } from '../types'

export interface Account {
  username: string
  email: string
  role: Role
  allowNewsLetter: boolean
  language: string
  jlptLevel: JlptLevel
  autoNextCard: boolean
  nextCardtimer: number
  autoPlayAudio: boolean
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
    jlptLevel: JlptLevel.N5,
    autoNextCard: true,
    nextCardtimer: 5,
    autoPlayAudio: true
  }
}

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount (state, action) {
      return action.payload
    },
    resetAccount (state) {
      return {
        isLoggedIn: false,
        account: {
          ...initialState.account,
          language: state.account.language
        }
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
    },
    setLanguage (state, action: PayloadAction<string>) {
      return {
        ...state,
        account: {
          ...state.account,
          language: action.payload
        }
      }
    },
    updateStudySettings (state, action: PayloadAction<{ autoNextCard?: boolean, nextCardtimer?: number, autoPlayAudio?: boolean }>) {
      return {
        ...state,
        account: {
          ...state.account,
          autoNextCard: action.payload?.autoNextCard ?? state.account.autoNextCard,
          nextCardtimer: action.payload.nextCardtimer ?? state.account.nextCardtimer,
          autoPlayAudio: action.payload.autoPlayAudio ?? state.account.autoPlayAudio
        }
      }
    }
  }
})

export const { setJlptLevel, setAccount, resetAccount, setLanguage, updateStudySettings } = accountSlice.actions

export default accountSlice.reducer
