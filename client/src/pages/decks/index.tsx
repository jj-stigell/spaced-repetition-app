import React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Project imports
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Deck, DeckCategory } from '../../types'
import axios from '../../lib/axios'
import { getDecks } from '../../config/api'
import { RootState } from '../../app/store'
import { DeckState, setDecks } from '../../features/deckSlice'
import { Account } from '../../features/accountSlice'
import { category as categoryPath } from '../../config/path'
import StudyOptions from './StudySelector'
import { Skeleton } from '@mui/material'
import DeckCard from './DeckCard'

function Decks (): JSX.Element {
  const navigate = useNavigate()
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const { category } = useParams()

  const [selectedDeckId, setSelectedDeckId] = React.useState<number>(1)
  const [showModal, setShowModal] = React.useState<boolean>(false)

  const account: Account = useAppSelector((state: RootState) => state.account.account)
  const deck: DeckState = useAppSelector((state: RootState) => state.deck)

  React.useEffect(() => {
    // TODO make loading view with skeleton
    if (category !== undefined) {
      if (deck.category === undefined || deck.category !== category) {
        axios.get(`${getDecks}?level=${account.jlptLevel}&category=${category}&language=${account.language}`)
          .then(function (response) {
            dispatch(setDecks({ category: category as DeckCategory, decks: response.data.data }))
          })
          .catch(function (error) {
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
      }
    } else {
      // TODO add category missing error translation.
      dispatch(setNotification({ message: t('CATEGORY.MISSING'), severity: 'error' }))
    }
  }, [])

  const handleClick = (id: number): void => {
    setSelectedDeckId(id)
    setShowModal(true)
  }

  return (
    <div id="study-page-decks" style={{ marginTop: 15 }}>
      <StudyOptions deckId={selectedDeckId} open={showModal} setOpen={setShowModal} />
      <Container maxWidth="md" sx={{ pb: 3 }}>
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 2, mb: 2 }}
          onClick={() => { navigate(categoryPath) }}
        >
          {t('pages.decks.returnButton')}
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 8, md: 8 }}>
            { deck.decks.length === 0
              ? [1, 2, 3, 4, 5, 6].map((number: number) => (
              <Grid item xs={2} sm={4} md={4} key={number}>
                <Skeleton variant="rounded" height={200} />
              </Grid>
                ))
              : deck.decks.map((deck: Deck) => (
                <DeckCard deck={deck} handleClick={handleClick} key={deck.id}/>
              ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Decks
