import React from 'react'

import { AxiosError } from 'axios'
import { experimentalStyled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LevelSelector from './LevelSelector'
import { Category, JlptLevel } from '../../types'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import axios from '../../lib/axios'
import { getCategories } from '../../config/api'
import { setNotification } from '../../features/notificationSlice'
import { CategoryState, setCategories } from '../../features/categorySlice'

const Item = experimentalStyled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: '#ddd'
  }
}))

function Study (): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const categories: CategoryState = useAppSelector((state: RootState) => state.category)
  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  React.useEffect(() => {
    // Only fetch categories if undefined or does not match the set JLPT level.
    if (categories.jlptLevel === undefined || categories.jlptLevel !== jlptLevel) {
      axios.get(`${getCategories}?level=${jlptLevel}`)
        .then(function (response) {
          console.log('Response for setting categories:', response.data.data)
          dispatch(setCategories({ jlptLevel, categories: response.data.data }))
        })
        .catch(function (error) {
          console.log('error encountered', error)
          const errorCode: string | null = error?.response?.data?.errors[0]?.code

          if (errorCode != null) {
            // TODO: what if there are multiple errors.
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
          } else if (error instanceof AxiosError) {
            dispatch(setNotification({ message: error.message, severity: 'error' }))
          } else {
            dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
          }
        })
    }
  }, [jlptLevel])

  return (
    <div id="study-page" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="jlpt-level">
          <LevelSelector />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            {categories.categories.map((category: Category) => (
              <Grid item xs={2} sm={4} md={4} key={category.category}>
                <Item onClick={() => { navigate(`/study/decks/${category.category.toLowerCase()}`) }}>
                  Category: {category.category}
                  <br/>
                  Decks: {category.decks}
                  <br/>
                  { ((category?.progress) !== undefined) &&
                  <div>
                    <br/>
                    Progress:
                    <br/>
                    new decks: {category.progress.new}
                    <br/>
                    learning decks: {category.progress.learning}
                    <br/>
                    finished decks: {category.progress.mature}
                  </div>
                  }
                </Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Study
