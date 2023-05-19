/* eslint-disable padded-blocks */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'

import { AxiosError } from 'axios'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import { Box, Button, Typography, Container, Tab } from '@mui/material'
import LockIcon from '@mui/icons-material/Lock'
import LockOpenIcon from '@mui/icons-material/LockOpen'
import { useTranslation } from 'react-i18next'
import { useParams, useSearchParams } from 'react-router-dom'
import _ from 'lodash'

import CircularLoader from '../../components/CircularLoader'
import { mockCards } from '../../mockData'
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

/*
1. get deck cards by id from api
2. set cards to storage
3. set first as the crrect card
4. conditionally render correct type
5. after answer reschedule
6. take next card
7. cards empty display message and redirect to deck list
*/

function Study (): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const onlyDue: string | null = searchParams.get('onlydue')

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [showAnswer, setShowAnswer] = React.useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = React.useState<boolean>(false)
  const [reviewsFinished, setReviewsFinished] = React.useState<boolean>(false)
  const [isError, setIsError] = React.useState<string | null>(null)
  const [pressedButton, setPressedButton] = React.useState<string>('')
  const [activeTab, setActiveTab] = React.useState('1')

  const language: string = useAppSelector((state: RootState) => state.account.account.language)
  const activeCard: Card | null = useAppSelector((state: RootState) => state.card.activeCard)
  const otherCards: Card[] = useAppSelector((state: RootState) => state.card.cards)

  const handleChange = (event: React.SyntheticEvent, newValue: string): void => {
    setActiveTab(newValue)
  }

  function resetView (): void {
    setCorrectAnswer(false)
    setShowAnswer(false)
    setActiveTab('1')
  }

  React.useEffect(() => {
    if ((id !== undefined) && !isNaN(Number(id))) {
      axios.get(`api/v1/deck/${id}/cards`, { params: { language, onlyDue } })
        .then(function (response) {
          const cards: Card[] = mockCards // response.data.data
          if (cards.length > 0) {
            const firstCard: Card = cards.shift() as Card
            dispatch(setCards({ activeCard: firstCard, cards }))
          } else {
            setIsError(t('errors.ERR_DECK_EMPTY'))
          }
        })
        .catch(function (error) {
          console.log('ERROR ENCOUNTERED', error)
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          const errorCode: string | null = error?.response?.data?.errors ? error?.response?.data?.errors[0]?.code : null

          if (errorCode != null) {
            dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
            // setIsError(t(`errors.${errorCode}`))
          } else if (error instanceof AxiosError) {
            if (error.request.status === 401) {
              console.log('Should logout automatically and clear localstorage on http code:', error.request.status)
            } else {
              dispatch(setNotification({ message: error.message, severity: 'error' }))
            // setIsError(error.message)
            }
          } else {
            dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
            // setIsError(t('errors.ERR_CHECK_CONNECTION'))
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
    if (correctAnswer) {
      // RESCHEDULE BASED ON
      // card id
      // review type
      const today = new Date()
      const formattedDate = today.toISOString().slice(0, 10)
      console.log('client date', formattedDate) // output: '2023-05-10'

      const rescheduleDays = 5 // Number of days to reschedule
      const rescheduleDate = new Date()
      rescheduleDate.setDate(today.getDate() + rescheduleDays)
      const formattedRescheduleDate = rescheduleDate.toISOString().slice(0, 10)
      console.log('reschedule to date', formattedRescheduleDate)
    }
  }

  function showNextCard (): void {
    if (otherCards.length === 0 && correctAnswer) {
      // All cards reviewed, set reviews finished screen.
      dispatch(resetCards())
      setReviewsFinished(true)
    } else {
      dispatch(setNextCard({ correctAnswer }))
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
    <div id="study-page-card" style={{ marginTop: 10 }}>
        {/* <p style={{ textAlign: 'center', fontSize: 13 }}>DEV BUILD:: {activeCard.cardType} CARD, {activeCard.reviewType} REVIEW</p> */}
        <CardFront frontValue={activeCard.reviewType === ReviewType.RECALL ? activeCard.card.keyword : activeCard.card.value} />
        <Box sx={{ width: '100%', typography: 'body1' }}>
          <TabContext value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <TabList onChange={handleChange} aria-label="study-tabs" sx={{ backgroundColor: '#4f7ce3' }} variant="fullWidth">
                <Tab label="Answer options" value="1" />
                <Tab
                  icon={showAnswer ? <LockOpenIcon fontSize="small" /> : <LockIcon fontSize="small" />}
                  iconPosition="start"
                  label="Details"
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
                  onClick={() => { showNextCard() }}
                  color="success"
                  type="button"
                  fullWidth
                  variant="contained"
                  sx={{
                    mt: 0,
                    mb: 2,
                    boxShadow: 3,
                    padding: 1,
                    fontSize: 30,
                    '&:hover': {
                      backgroundColor: '#e8ad09'
                    },
                    backgroundColor: '#fcba03'
                  }}
                >
                  Next card
                </Button>
                }
              </Container>
            </TabPanel>
            <TabPanel value="2">
              <CardInformation />
            </TabPanel>
          </TabContext>
        </Box>
        <br/>
        <Button
          onClick={() => { resetView() }}
          type="submit"
          fullWidth
          color='success'
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          Reset
        </Button>
    </div>
  )
}

export default Study
