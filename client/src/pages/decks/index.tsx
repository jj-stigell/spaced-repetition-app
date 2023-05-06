/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import Button from '@mui/material/Button'
import { useNavigate, useParams } from 'react-router-dom'
import CircularLoader from '../../components/CircularLoader'
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { Deck, DeckCategory, Role } from '../../types'
import axios from '../../lib/axios'
import { getDecks } from '../../config/api'
import { RootState } from '../../app/store'
import { DeckState, setDecks } from '../../features/deckSlice'
import { AxiosError } from 'axios'
import { useTranslation } from 'react-i18next'
import { Account } from '../../features/accountSlice'

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
  const account: Account = useAppSelector((state: RootState) => state.account.account)
  const deck: DeckState = useAppSelector((state: RootState) => state.deck)

  React.useEffect(() => {
    if (category !== undefined) {
      if (deck.category === undefined || deck.category !== category) {
        axios.get(`${getDecks}?level=${account.jlptLevel}&category=${category}`)
          .then(function (response) {
            dispatch(setDecks({ category: category as DeckCategory, decks: response.data.data }))
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
    } else {
      // TODO add category missing error translation.
      dispatch(setNotification({ message: t('CATEGORY.MISSING'), severity: 'error' }))
    }
  }, [])

  const handleClick = (id: number): void => {
    console.log('deck selected', id)
    navigate(`/study/deck/${id}`)
  }

  if (deck.decks.length === 0) {
    return (<CircularLoader />)
  }

  return (
    <div id="study-page-decks" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
          onClick={() => { navigate(-1) }}
        >
          Back to category select
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            {deck.decks.map((deck: Deck) => (
              <Grid item xs={2} sm={4} md={4} key={deck.id}>
                <Item onClick={() => { handleClick(deck.id) }}>
                  {deck.title}
                  <br/>
                  { account.role === Role.NON_MEMBER
                    ? <>Member deck, NO ACCESS</>
                    : <>Member deck, study now</>
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
