import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { NODE_ENV } from '../config/environment'

import accountReducer from '../features/accountSlice'
import cardReducer from '../features/cardSlice'
import categoryReducer from '../features/categorySlice'
import deckReducer from '../features/deckSlice'
import notificationReducer from '../features/notificationSlice'
import rememberMeReducer from '../features/rememberMeSlice'

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register', 'notification']
}

const appReducer = combineReducers({
  account: accountReducer,
  card: cardReducer,
  category: categoryReducer,
  deck: deckReducer,
  notification: notificationReducer,
  remember: rememberMeReducer
})

const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch
