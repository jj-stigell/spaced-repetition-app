import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'

// reducer imports
import accountReducer from '../features/account/accountSlice'
// import customizationReducer from '../features/customizationReducer'
// import registerReducer from '../features/OLD_DELETE/registerReducer'
import rememberMeReducer from '../features/account/rememberMeSlice'
import notificationReducer from '../features/notification/notificationSlice'
// import deckReducer from '../features/deckReducer'
// import cardReducer from '../features/card/cardSlice'

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register', 'notification']
}

const appReducer = combineReducers({
  account: accountReducer,
  // customization: customizationReducer,
  // register: registerReducer
  remember: rememberMeReducer,
  notification: notificationReducer
  // decks: deckReducer,
  // cards: cardReducer
})

const persistedReducer = persistReducer(persistConfig, appReducer)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
  middleware: [thunk]
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>

export type AppDispatch = typeof store.dispatch

/*
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const rootReducer: Reducer = async (state: RootState, action: AnyAction) => {
  console.log('HEREEEEE')
  if (action.type === 'account/resetAccount') {
    // this applies to all keys defined in persistConfig(s)
    await persistConfig.storage.removeItem('persist:root')

    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    state = {} as RootState
  }
  return appReducer(state, action)
}
*/
