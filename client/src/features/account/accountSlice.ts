import { createSlice } from '@reduxjs/toolkit'

export interface AccountState {
  token?: string | null
  isLoggedIn: boolean
  account?: {
    role: string
    username: string
    email: string
    sessionId: string
    sessions: string[] | null
  }
}

const initialState: AccountState = {
  isLoggedIn: false
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
    setVerified (state, action) {
      return {
        ...state,
        verified: action.payload
      }
    },
    setSessions (state, action) {
      return {
        ...state,
        sessions: action.payload
      }
    },
    removeSession (state, action) {
      return state
      /*
      return {
        ...state,
        sessions: state.sessions.filter(session => session.id !== action.payload)
      }
      */
    },
    resetAccount (state, action) {
      return initialState
    }
  }
})

export const { setAccount, setLogin, resetAccount, setVerified, setSessions, removeSession } = accountSlice.actions

/*
export const logOutAccount = () => {
  return async (dispatch) => {
    dispatch(resetAccount(null))
    localStorage.removeItem('srs-token')
  }
}
*/

export default accountSlice.reducer
