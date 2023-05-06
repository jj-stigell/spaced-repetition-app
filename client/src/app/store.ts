import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import thunk from 'redux-thunk'
import { NODE_ENV } from '../config/environment'

// reducer imports
import accountReducer from '../features/accountSlice'
// import customizationReducer from '../features/customizationReducer'
import rememberMeReducer from '../features/rememberMeSlice'
import notificationReducer from '../features/notificationSlice'
import categoryReducer from '../features/categorySlice'
import deckReducer from '../features/deckSlice'
// import cardReducer from '../features/card/cardSlice'

export const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['register', 'notification', 'account', 'category', 'deck'] // TODO remove account from here in production later on
}

const appReducer = combineReducers({
  account: accountReducer,
  // customization: customizationReducer,
  remember: rememberMeReducer,
  notification: notificationReducer,
  category: categoryReducer,
  deck: deckReducer
  // cards: cardReducer
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
