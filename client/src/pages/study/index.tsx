/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import Container from '@mui/material/Container'
import { useParams, useSearchParams } from 'react-router-dom'
import CircularLoader from '../../components/CircularLoader'
import { mockCards } from '../../mockData'
import { AnswerOption, Card, ReviewType } from '../../types'
import axios from '../../lib/axios'
import { RootState } from '../../app/store'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setNotification } from '../../features/notificationSlice'
import { AxiosError } from 'axios'
import { setCards } from '../../features/cardSlice'
import { useTranslation } from 'react-i18next'
import { Box, Button, Typography } from '@mui/material'
import ReviewFinished from './ReviewFinished'
import CardFront from './CardFront'
import AnswerOptions from './AnswerOptions'
import ReviewError from '../error/ReviewError'

function Study (): JSX.Element {
  const { t } = useTranslation()
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()

  const onlyDue: string | null = searchParams.get('onlydue')

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [showAnswer, setShowAnswer] = React.useState<boolean>(false)
  const [correctAnswer, setCorrectAnswer] = React.useState<boolean>(false)
  const [reviewsFinished, setReviewsFinished] = React.useState<boolean>(true)
  const [isError, setIsError] = React.useState<string | null>(null)
  const [pressedButton, setPressedButton] = React.useState<string>('')

  const language: string = useAppSelector((state: RootState) => state.account.account.language)
  const activeCard: Card | undefined = useAppSelector((state: RootState) => state.card.activeCard)
  const otherCards: Card[] = useAppSelector((state: RootState) => state.card.cards)

  function shuffleOptions (array: AnswerOption[]): AnswerOption[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]
    }
    return array
  }

  let copyOfOptions: AnswerOption[] | undefined = ((activeCard?.card.answerOptions) !== undefined) ? [...activeCard.card.answerOptions] : undefined

  if (copyOfOptions !== undefined && !showAnswer) {
    console.log('SHUFFLING')
    copyOfOptions = shuffleOptions(copyOfOptions)
  }

  /*
  1. get deck cards by id from api
  2. set cards to storage
  3. set first as the crrect card
  4. conditionally render correct type
  5. after answer reschedule
  6.take next card
  7. cards empty display message and redirect to deck list
  */

  React.useEffect(() => {
    if ((id !== undefined) && !isNaN(Number(id))) {
      axios.get(`api/v1/deck/${id}/cards`, { params: { language, onlyDue } })
        .then(function (response) {
          console.log(response)

          const cards: Card[] = mockCards // response.data.data

          if (cards.length > 0) {
            const firstCard: Card = cards.shift() as Card

            console.log('First card is', firstCard)
            console.log('Rest of the cards', cards)

            dispatch(setCards({ activeCard: firstCard, cards }))
          } else {
            setIsError(t('errors.ERR_DECK_EMPTY'))
          }
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
        }).finally(() => {
          setIsLoading(false)
        })
    } else {
      setIsError(t('errors.ERR_DECK_ID_MISSING_OR_INVALID'))
    }
    setIsLoading(false)
  }, [])

  const resetView = (): void => {
    setCorrectAnswer(false)
    setShowAnswer(false)
  }

  const handleAnswer = (option: AnswerOption): void => {
    console.log('ANSWER BOOLEAN:::', option.correct)
    console.log('shiuffled cards in handle answer', copyOfOptions)
    setPressedButton(option.option)
    setShowAnswer(true)
    console.log('shiuffled cards in handle answer last one', copyOfOptions)
    if (option.correct) {
      setCorrectAnswer(true)

      // RESCHEDULE BASED ON
      // card id
      // review type
      const today = new Date()
      const formattedDate = today.toISOString().slice(0, 10)
      console.log('client date', formattedDate) // output: '2023-05-10'
      console.log('reschedule to date', 54656)

      // SET NEXT CARD TO THE VIEW

      setTimeout(() => {
        if (otherCards.length === 0) {
          // STOP REVIEW
          console.log('NO MORE CARDS!!!!')
          setReviewsFinished(true)
        } else {
          // possibly only one in cards

          // at least one value in array
          // [card1, card2, ..., cardN]

          // If one [card1], newCards become [] and new active = card1
          // Next round evaluation len arr == 0

          const newCards: Card[] = [...otherCards]
          const newActiveCard: Card | undefined = newCards.shift()

          dispatch(setCards({ activeCard: newActiveCard, cards: newCards }))
          resetView()
        }
      }, 8000)
    }
  }

  if (reviewsFinished) {
    return (<ReviewFinished />)
  }

  if (isLoading || activeCard === undefined) {
    return (
      <Box>
        <CircularLoader />
        <Typography variant='h4' align="center">
          {t('pages.review.loadingMessage')}
        </Typography>
      </Box>
    )
  }

  if (isError != null) {
    return (<ReviewError errorMessage={isError} />)
  }



  return (
    <div id="study-page-card" style={{ marginTop: 10 }}>
      <Container maxWidth="sm">
        <p style={{ textAlign: 'center' }}>DEV BUILD:: {activeCard.cardType} CARD, {activeCard.reviewType} REVIEW</p>
        <CardFront frontValue={activeCard.reviewType === ReviewType.RECALL ? activeCard.card.keyword : activeCard.card.value} />
        <hr/>
        <br/>
        { copyOfOptions !== undefined &&
          <AnswerOptions options={copyOfOptions} handleAnswer={handleAnswer} showAnswer={showAnswer} pressedButton={pressedButton} />
        }
        <br/>
        <br/>
        { showAnswer && correctAnswer &&
          <Button
            onClick={() => {
            }}
            color={'success'}
            type="button"
            fullWidth
            variant="contained"
            sx={{
              mt: 3,
              mb: 2,
              boxShadow: 3,
              padding: 1,
              fontSize: 30
            }}
          >
            Next card
          </Button>
        }
        <br/>
        <Button
          onClick={() => { resetView() }}
          type="submit"
          fullWidth
          color='success'
          variant="contained"
          sx={{ mt: 3, mb: 2 }}
        >
          reset
        </Button>
      </Container>
    </div>
  )
}

export default Study

//                   pressedButton === option.option && showAnswer && correctAnswer ? 'green' : 'blue'

