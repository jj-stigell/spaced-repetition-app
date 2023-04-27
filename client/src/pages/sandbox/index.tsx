import * as React from 'react'

// Third party imports
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { Container } from '@mui/material'

import AnswerButton from './AnswerButton'

// Project imports
const theme = createTheme()

function SandBox (): JSX.Element {
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <AnswerButton value={'button test'} correctAnswer={true}/>
      </Container>
    </ThemeProvider>
  )
}

export default SandBox
