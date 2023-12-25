/* eslint-disable padded-blocks */
import React from 'react'

import { AxiosError } from 'axios'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Typography, Container, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'

import CircularLoader from '../../components/CircularLoader'
import { AnswerOption, Card, ReviewType } from '../../types'
import axios from '../../lib/axios'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setNotification } from '../../features/notificationSlice'
import { resetCards, setCards, setNextCard } from '../../features/cardSlice'
import ReviewFinished from './ReviewFinished'
import CardFront from './CardFront'
import AnswerOptions from './AnswerOptions'
import ReviewError from '../error/ReviewError'
import CardInformation from './CardInformation'
import DialMenu from './DialMenu'

function Study (): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const onlyDue: string | null = searchParams.get('onlydue')

  const { autoNextCard, nextCardtimer, language } = useAppSelector((state: RootState) => state.account.account)
  const activeCard: Card | null = useAppSelector((state: RootState) => state.card.activeCard)
  const otherCards: Card[] = useAppSelector((state: RootState) => state.card.cards)

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [showAnswer, setShowAnswer] = React.useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = React.useState<boolean>(false)
  const [reviewsFinished, setReviewsFinished] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<string | null>(null)
  const [pressedButton, setPressedButton] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState('1')
  const [autoNext, setAutoNext] = React.useState<boolean>(autoNextCard)
  const [count, setCount] = React.useState<number>(nextCardtimer)

  function handleChange (event: React.SyntheticEvent, newValue: string): void {
    setAutoNext(false)
    setActiveTab(newValue)
  }

  function resetView (): void {
    setCorrectAnswer(false)
    setShowAnswer(false)
    setActiveTab('1')
  }

  React.useEffect(() => {
    if (showAnswer) {
      if (count === 0 && autoNext) {
        showNextCard()
      } else if (count > 0) {
        setTimeout(() => {
          setCount(count - 1)
        }, 1000)
      }
    }
  }, [count, showAnswer])

  React.useEffect(() => {
    if ((id !== undefined) && !isNaN(Number(id))) {
      axios.get(`api/v1/deck/${id}/cards`, { params: { language, onlyDue } })
        .then(function (response) {
          const cards: Card[] = response.data.data
          if (cards.length > 0) {
            const firstCard: Card = cards.shift() as Card
            dispatch(setCards({ activeCard: firstCard, cards }))
          } else {
            setIsError(t('errors.ERR_DECK_EMPTY'))
          }
        })
        .catch(function (error) {
          let errorCode: string | null = null

          if (Array.isArray(error?.response?.data?.errors)) {
            errorCode = error?.response?.data?.errors[0].code
          }

          if (errorCode != null) {
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
      setIsError(t('errors.ERR_DECK_ID_MISSING_OR_INVALID'))
    }
  }, [])

  function handleAnswer (option: AnswerOption): void {
    setCorrectAnswer(option.correct)
    setPressedButton(option.option)
    setShowAnswer(true)
    setCount(nextCardtimer)
  }

  function showNextCard (): void {
    if (otherCards.length === 0 && correctAnswer) {
      // All cards reviewed, set reviews finished screen.
      dispatch(resetCards())
      setReviewsFinished(true)
    } else {
      dispatch(setNextCard(correctAnswer))
      resetView()
    }
  }

  if (reviewsFinished) {
    return (<ReviewFinished />)
  }

  if (isError != null) {
    return (<ReviewError errorMessage={isError} />)
  }

  if (isLoading || activeCard == null) {
    return (
      <Box>
        <CircularLoader />
        <Typography variant='h4' align="center">
          {t('pages.review.loadingMessage')}
        </Typography>
      </Box>
    )
  }

  return (
    <div id="study-page-card" style={{ paddingTop: 5, backgroundColor: 'primary.light' }}>
        <DialMenu />
        <CardFront frontValue={activeCard.reviewType === ReviewType.RECALL ? activeCard.card.keyword : activeCard.card.value} />
        <Box sx={{ width: '100%', typography: 'body1', backgroundColor: 'primary.light' }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList textColor="inherit" onChange={handleChange} aria-label="study-tabs" sx={{ backgroundColor: 'primary.main' }} variant="fullWidth">
                <Tab
                  label={t('pages.review.view.answerOptionsTab.button')}
                  value="1"
                />
                <Tab
                  iconPosition="start"
                  label={t('pages.review.view.detailsOptionsTab.button')}
                  value="2"
                  disabled={!showAnswer}
                />
              </TabList>
            </Box>
            <TabPanel value="1">
              <Container maxWidth="sm">
                { activeCard.card.answerOptions != null &&
                  <AnswerOptions options={activeCard.card.answerOptions} handleAnswer={handleAnswer} showAnswer={showAnswer} pressedButton={pressedButton} />
                }
                { showAnswer &&
                <Button
                  onClick={() => {
                    if (autoNext) {
                      setAutoNext(false)
                    } else {
                      showNextCard()
                      setAutoNext(autoNextCard)
                    }
                  }}
                  color="success"
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 0,
                    mb: 2,
                    boxShadow: 3,
                    padding: 2,
                    fontSize: 20,
                    '&:hover': {
                      backgroundColor: '#e8ad09'
                    },
                    backgroundColor: '#fcba03'
                  }}
                >
                  { autoNext ? t('pages.review.view.cancelNextCardButton', { count }) : t('pages.review.view.nextCardButton')}
                </Button>
                }
              </Container>
            </TabPanel>
            <TabPanel value="2">
              <CardInformation />
            </TabPanel>
          </TabContext>
        </Box>
    </div>
  )
}

export default Study
