/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import { AxiosError } from 'axios'
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CircularLoader from '../../components/CircularLoader'
import axios from '../../lib/axios'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { Card, ExampleSentence } from '../../types'
import { exampleSentences as examples } from '../../mockData'

export interface Examples {
  id: number
}

function CardInformation (): JSX.Element {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [cardData, setCardData] = React.useState<any>(null)
  const [isError, setIsError] = React.useState<string | null>(null)

  const activeCard: Card = useAppSelector((state: RootState) => state.card.activeCard) as Card
  const language: string = useAppSelector((state: RootState) => state.account.account.language)

  const [exampleSentences, setExampleSentences] = React.useState<ExampleSentence[] | null>(null)

  React.useEffect(() => {
    axios.get(`api/v1/card/${activeCard.id}/examples`, { params: { language } })
      .then(function (response) {
        setCardData(response.data)
      })
      .catch(function (error) {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        const errorCode: string | null = error?.response?.data?.errors ? error?.response?.data?.errors[0]?.code : null

        if (errorCode != null) {
          setIsError(t(`errors.${errorCode}`))
        } else if (error instanceof AxiosError) {
          if (error.request.status === 401) {
            console.log('Should logout automatically and clear localstorage on http code:', error.request.status)
          } else {
            setIsError(error.message)
          }
        } else {
          setIsError(t('errors.ERR_CHECK_CONNECTION'))
        }
      }).finally(() => {
        setIsLoading(false)
        setIsError(null)
        setExampleSentences(examples)
      })
  }, [])

  if (isLoading) {
    return (<CircularLoader />)
  }

  if (isError != null) {
    return (
      <Box>
        <Typography variant='h4' align="center">
          {t(`errors.${isError}`)}
        </Typography>
      </Box>
    )
  }

  return (
    <>
      <p style={{ fontSize: 55, textAlign: 'center', marginBottom: 30 }}>Examples</p>
      <ul>
      { exampleSentences?.map((sentence: ExampleSentence) => {
        return (
          <li key={sentence.id}>
            {sentence.sentence} = {sentence.translation}
          </li>
        )
      })
      }
      </ul>
    </>
  )
}

export default CardInformation
