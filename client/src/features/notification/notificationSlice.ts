import { createSlice } from '@reduxjs/toolkit'

export interface Notification {
  showNotification: boolean
  message: string
  autoHideDuration: number
  severity: 'success' | 'error' | 'warning' | 'info'
  anchorOrigin: {
    vertical: 'bottom' | 'top'
    horizontal: 'center' | 'left' | 'right'
  }
}

const initialState: Notification = {
  showNotification: false,
  message: 'default notification message',
  autoHideDuration: 5000,
  severity: 'success',
  anchorOrigin: {
    vertical: 'top',
    horizontal: 'center'
  }
}

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification (state, action) {
      return {
        showNotification: true,
        message: action.payload?.message ?? initialState.message,
        autoHideDuration: action.payload?.autoHideDuration ?? initialState.autoHideDuration,
        severity: action.payload?.severity ?? initialState.severity,
        anchorOrigin: {
          vertical: action.payload?.anchorOrigin?.vertical ?? initialState.anchorOrigin.vertical,
          horizontal: action.payload?.anchorOrigin?.horizontal ?? initialState.anchorOrigin.horizontal
        }
      }
    }
  }
})

export const { setNotification } = notificationSlice.actions

export default notificationSlice.reducer
