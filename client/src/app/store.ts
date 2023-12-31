import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import { NODE_ENV } from '../config/environment'

import accountReducer from '../features/accountSlice'
import notificationReducer from '../features/notificationSlice'
import rememberMeReducer from '../features/rememberMeSlice'
import registerReducer from '../features/registerSlice'

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register', 'notification']
}

const appReducer = combineReducers({
  account: accountReducer,
  notification: notificationReducer,
  remember: rememberMeReducer,
  register: registerReducer
})

const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: NODE_ENV !== 'production'
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
