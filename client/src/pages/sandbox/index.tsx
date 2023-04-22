/* eslint-disable @typescript-eslint/no-unused-vars */
import * as React from 'react'

// Third party imports
import { useFormik } from 'formik'
import * as yup from 'yup'
import { createTheme, ThemeProvider } from '@mui/material/styles'
import {
  Button,
  Typography,
  Container,
  Box,
  Grid,
  Link,
  Checkbox,
  TextField,
  CssBaseline,
  FormControlLabel
} from '@mui/material'

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
