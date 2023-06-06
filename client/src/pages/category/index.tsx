import React from 'react'

import { AxiosError } from 'axios'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import { Button, Skeleton } from '@mui/material'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Category, JlptLevel } from '../../types'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import axios from '../../lib/axios'
import { getCategories } from '../../config/api'
import { setNotification } from '../../features/notificationSlice'
import { CategoryState, setCategories } from '../../features/categorySlice'
import { dashboard } from '../../config/path'
import CategoryCard from './CategoryCard'

function Study (): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [isLoading, setIsLoading] = React.useState<boolean>(false)

  const categories: CategoryState = useAppSelector((state: RootState) => state.category)
  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  React.useEffect(() => {
    // Only fetch categories if undefined or does not match the set JLPT level.
    if (categories.jlptLevel === undefined || categories.jlptLevel !== jlptLevel) {
      setIsLoading(true)
      axios.get(`${getCategories}?level=${jlptLevel}`)
        .then(function (response) {
          console.log('Response for setting categories:', response.data.data)
          dispatch(setCategories({ jlptLevel, categories: response.data.data }))
          setIsLoading(false)
        })
        .catch(function (error) {
          setIsLoading(false)
          console.log('error encountered', error)
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const errorCode: string | null = error?.response?.data?.errors ? error?.response?.data?.errors[0]?.code : null

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
      <Container maxWidth="md" sx={{ pb: 3 }}>
      <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => { navigate(dashboard) }}
        >
          {t('pages.categories.returnButton')}
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 8, md: 8 }}>
            { categories.categories.length === 0 || isLoading
              ? [1, 2, 3, 4, 5, 6].map((number: number) => (
              <Grid item xs={2} sm={4} md={4} key={number}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
                ))
              : categories.categories.map((category: Category) => (
                <CategoryCard key={category.category} category={category} />
              ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Study
