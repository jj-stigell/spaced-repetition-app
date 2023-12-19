import React from 'react'

import { AxiosError } from 'axios'
import Box from '@mui/material/Box'
import { Button, Typography } from '@mui/material'
import Container from '@mui/material/Container'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { useAppDispatch } from '../../app/hooks'
import axios from '../../lib/axios'
import { setNotification } from '../../features/notificationSlice'
import { dashboard } from '../../config/path'
import DataTable from './components/DataTable'
import CircularLoader from '../../components/CircularLoader'
import { DeckAdmin } from '../../types'
import { Furigana } from '../../components/Furigana'

function AdminDashBoard (): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [decks, setDecks] = React.useState<DeckAdmin[]>([])

  React.useEffect(() => {
    // Only fetch categories if undefined or does not match the set JLPT level.
    setIsLoading(true)
    axios.get('/api/v1/admin/decks')
      .then(function (response) {
        setDecks(response.data.data)
        setIsLoading(false)
      })
      .catch(function (error) {
        setIsLoading(false)
        let errorCode: string | null = null

        if (Array.isArray(error?.response?.data?.errors)) {
          errorCode = error?.response?.data?.errors[0].code
        }

        if (errorCode != null) {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
        } else if (error instanceof AxiosError) {
          dispatch(setNotification({ message: error.message, severity: 'error' }))
        } else {
          dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
        }
      })
  }, [])

  return (
    <div id="study-page" style={{ marginTop: 15 }}>
      <Container maxWidth='xl' sx={{ pb: 3 }}>
      <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => { navigate(dashboard) }}
        >
          {t('pages.categories.returnButton')}
        </Button>
        <Typography variant='h3'>All Decks</Typography>
        <Furigana sentence="今日は浅野くんと公園に行った。" reading="1-2:きょう;4-5:あさの;9-10:こうえん;12:い" />
        <Typography>Im underlined! his is some <u>mispeled</u> text.</Typography>
        his is some <u>mispeled</u> text.
        <Box sx={{ flexGrow: 1 }}>
          {/* Data table for decks */}
          { isLoading ? <CircularLoader /> : <DataTable data={decks} onClick={(id) => { navigate(`deck/${String(id)}`) }} /> }
        </Box>
      </Container>
    </div>
  )
}

export default AdminDashBoard
