import React from 'react'

// Third party imports
import { AxiosError } from 'axios'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Button from '@mui/material/Button'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

// Project imports
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Deck, DeckCategory, Role } from '../../types'
import axios from '../../lib/axios'
import { getDecks } from '../../config/api'
import { RootState } from '../../app/store'
import { DeckState, setDecks } from '../../features/deckSlice'
import { Account } from '../../features/accountSlice'
import { category as categoryPath } from '../../config/path'
import StudyOptions from './StudySelector'
import { Skeleton } from '@mui/material'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: '#ddd'
  }
}))

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
        axios.get(`${getDecks}?level=${account.jlptLevel}&category=${category}`)
          .then(function (response) {
            dispatch(setDecks({ category: category as DeckCategory, decks: response.data.data }))
          })
          .catch(function (error) {
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
      <CssBaseline />
      <StudyOptions deckId={selectedDeckId} open={showModal} setOpen={setShowModal} />
      <Container maxWidth="md">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
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
              <Grid item xs={2} sm={4} md={4} key={deck.id}>
                <Item onClick={() => { handleClick(deck.id) }}>
                  {deck.title}
                  <br/>
                  { account.role === Role.NON_MEMBER
                    ? <>Member deck, NO ACCESS</>
                    : <>Member deck, study now</>
                  }
                  <br/>
                  { deck.translationAvailable
                    ? <>Translation available</>
                    : <>Translation not available, using english</>
                  }
                  <br/>
                  { account.role !== Role.NON_MEMBER &&
                    <>Favorite: {((deck?.favorite) === true) ? <>true</> : <>false</>}</>
                  }
                  <br/>
                  description: {deck.description}
                  <br/>
                  due: 4
                  <br/>
                  new: 3
                  { ((deck?.progress) !== undefined) &&
                  <div>
                    <br/>
                    Progress:
                    <br/>
                    new cards: {deck.progress.new}
                    <br/>
                    learning cards: {deck.progress.learning}
                    <br/>
                    matured cards: {deck.progress.mature}
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

export default Decks
