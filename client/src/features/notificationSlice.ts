import { createSlice } from '@reduxjs/toolkit'

export interface Notification {
  showNotification?: boolean
  message: string
  autoHideDuration?: number
  severity: 'success' | 'error' | 'warning'
}

const initialState: Notification = {
  showNotification: false,
  message: 'default notification message',
  autoHideDuration: 5000,
  severity: 'success'
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    set (state, action) {
      return {
        showNotification: true,
        message: action.payload?.message ?? initialState.message,
        autoHideDuration: action.payload?.autoHideDuration ?? initialState.autoHideDuration,
        severity: action.payload?.severity ?? initialState.severity
      }
    },
    clear (action) {
      return initialState
    }
  }
})

export const setNotification = (payload: Notification) => {
  return async (dispatch: any) => {
    dispatch(set(payload))
    setTimeout(() => {
      dispatch(clear())
    }, payload.autoHideDuration ?? initialState.autoHideDuration)
  }
}

export const { set, clear } = notificationSlice.actions

export default notificationSlice.reducer
