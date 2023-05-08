/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import CircularLoader from '../../components/CircularLoader'
import { mockCards } from '../../mockData'
import { Card, CardType } from '../../types'
import axios from '../../lib/axios'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setNotification } from '../../features/notificationSlice'
import { AxiosError } from 'axios'
import { setCards } from '../../features/cardSlice'
import { useTranslation } from 'react-i18next'
import { constants } from '../../config/constants'
import { category } from '../../config/path'
import ErrorPage from '../error'

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

/*
fecth cards based on deck id and feed one by one to the review
*/

function Study (): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [showError, setShowError] = React.useState<boolean>(false)
  const language: string = useAppSelector((state: RootState) => state.account.account.language)
  const activeCard: Card | undefined = useAppSelector((state: RootState) => state.card.activeCard)
  const onlyDue: string = searchParams.get('onlydue') === null ? 'false' : 'true'

  console.log('LANGAUGE is', language)

  /*
  1. get deck cards by id from api
  2. set cards to storage
  3. set first as the crrect card
  4. conditionally render correct type
  5. after answer reschedule
  6.take next card
  7. cards empty display message and redirect to deck list
  */

  //    axios.get(`api/v1/deck/${id}/cards?language=${language}${(onlyDue !== null) ? `&onlydue=${onlyDue}` : ''}`)

  React.useEffect(() => {
    if ((id !== undefined) && !isNaN(Number(id))) {
      axios.get(`api/v1/deck/${id}/cards?language=${language}&onlydue=${onlyDue}`)
        .then(function (response) {
          console.log(response)

          const cards: Card[] = response.data.data
          if (cards.length > 1) {
            const firstCard: Card = cards.shift() as Card

            console.log('First card is', firstCard)
            console.log('Rest of the cards', cards)

            dispatch(setCards({ activeCard: firstCard, cards }))
          } else {
          // TODO: add the translation
            dispatch(setNotification({ message: t('errors.cardLoadingError'), severity: 'error' }))
          }
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
        }).finally(() => {
          setIsLoading(false)
        })
    } else {
      setShowError(true)
      // TODO: add translation
      dispatch(setNotification({
        message: t('deck id is missing or wrong type, returning to deck selection in 5 secs'),
        severity: 'error',
        autoHideDuration: constants.redirectTimeout * 1000
      }))
      setTimeout(() => {
        navigate(category)
      }, constants.redirectTimeout * 1000)
    }
  }, [])

  if (showError) {
    // TODO: make this nicer
    return (<>Error encountered</>)
  }

  if (isLoading) {
    return (<CircularLoader />)
  }

  return (
    <div id="study-page-card" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
      {(() => {
        switch (activeCard?.cardType) {
          case CardType.KANJI:
            return (
              <>
              <p>KANJI CARD</p>
              </>
            )
          case CardType.HIRAGANA:
            return <p>HIRAGANA CARD</p>
          case CardType.KATAKANA:
            return <p>KATAKANA CARD</p>
          case CardType.VOCABULARY:
            return <p>VOCAB CARD</p>
          default:
            return <>Could not load card</>
        }
      })()}
      </Container>
    </div>
  )
}

export default Study
