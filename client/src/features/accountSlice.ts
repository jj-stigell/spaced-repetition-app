import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { JlptLevel, Role } from 'src/types'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
export type Account = {
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

export type AccountState = {
  isLoggedIn: boolean
  username: string
  email: string
  role: Role
  allowNewsLetter: boolean
  language: string
  jlptLevel: JlptLevel
  autoNextCard: boolean
  nextCardtimer: number
  autoPlayAudio: boolean
} & Account

export const initialState: AccountState = {
  isLoggedIn: false,
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

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    setAccount (state, action) {
      return action.payload
    },
    resetAccount (state) {
      return initialState
    },
    setJlptLevel (state, action: PayloadAction<JlptLevel>) {
      return {
        ...state,
        jlptLevel: action.payload
      }
    },
    setLanguage (state, action: PayloadAction<string>) {
      return {
        ...state,
        language: action.payload
      }
    },
    updateStudySettings (state, action: PayloadAction<{ autoNextCard?: boolean, nextCardtimer?: number, autoPlayAudio?: boolean }>) {
      return {
        ...state,
        autoNextCard: action.payload?.autoNextCard ?? state.autoNextCard,
        nextCardtimer: action.payload.nextCardtimer ?? state.nextCardtimer,
        autoPlayAudio: action.payload.autoPlayAudio ?? state.autoPlayAudio
      }
    }
  }
})

export const { setJlptLevel, setAccount, resetAccount, setLanguage, updateStudySettings } = accountSlice.actions

export default accountSlice.reducer
