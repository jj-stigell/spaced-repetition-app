import React from 'react'
import ReactDOM from 'react-dom/client'

// Third party imports
import { PersistGate } from 'redux-persist/integration/react'
import { createTheme, CssBaseline, ThemeProvider } from '@mui/material'
import { Provider } from 'react-redux'

// Project imports
import reportWebVitals from './reportWebVitals'
import { store, persistor } from './app/store'
import App from './App'
import './index.css'
import './i18n'

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
)

const theme = createTheme({
  palette: {
    primary: {
      dark: '#353c27',
      main: '#e60422',
      light: '#f2f2f2'
    }
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          color: '#ffffff', // Set the text color to white
          backgroundColor: '#de5063', // Set the background color to pink
          '&:hover': {
            backgroundColor: '#e60422' // Set the hover background color to a lighter shade of pink
          }
        }
      }
    }
  }
})

root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
