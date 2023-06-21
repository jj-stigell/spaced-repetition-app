/* eslint-disable no-multiple-empty-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

import { AxiosError } from 'axios'
import { Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CircularLoader from '../../components/CircularLoader'
import axios from '../../lib/axios'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { Card, ExampleSentence as ExampleSentenceType } from '../../types'
import { exampleSentences as examples } from '../../mockData'
import ExampleSentence from './ExampleSentence'

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

  const [exampleSentences, setExampleSentences] = React.useState<ExampleSentenceType[] | null>(null)

  React.useEffect(() => {
    axios.get(`api/v1/card/${activeCard.id}/details`, { params: { language } })
      .then(function (response) {
        setCardData(response.data)
      })
      .catch(function (error) {
        let errorCode: string | null = null

        if (Array.isArray(error?.response?.data?.errors)) {
          errorCode = error?.response?.data?.errors[0].code
        }

        if (errorCode != null) {
          setIsError(t(`errors.${errorCode}`))
        } else if (error instanceof AxiosError) {
          setIsError(error.message)
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
      {/* <p style={{ fontSize: 30, textAlign: 'center', marginBottom: 30 }}>Information</p> */}





      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 8 }}>
            <Grid item xs={2} sm={4} md={4}>
              Example sentences
              <ul>
                { exampleSentences?.map((sentence: ExampleSentenceType) => <ExampleSentence key={sentence.id} sentence={sentence} />)}
              </ul>
            </Grid>
            <Grid item xs={2} sm={4} md={4}>
              Kanji data:
            </Grid>
        </Grid>
      </Box>





    </>
  )
}

export default CardInformation

/*
export const textDetailedData = {
  id: 2,
  cardType: CardType.KANJI,
  data: {
    kanji: '車',
    keyword: 'car',
    story: 'looks like a vehicle from birds eye view',
    hint: 'pictograph',
    onyomi: 'しゃ',
    kunyomi: 'くるま',
    onyomiRomaji: 'sha',
    kunyomiRomaji: 'kuruma',
    exampleSentences: [
      {
        id: 354,
        sentence: '昨日は車で学校に行きました。',
        translation: 'Yesterday I went to school by car.',
        furigana: 'きのうはくるまでがっこうにいきました。',
        audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
      },
      {
        id: 287,
        sentence: '車のタイヤがパンクされた。',
        translation: 'Cars tire was blown.',
        furigana: 'くるまのたいやがぱんくされた。',
        audio: 'https://dl.sndup.net/pb7r/194544434378718.mp3'
      },
      {
        id: 186,
        sentence: 'あの車は日産です。',
        translation: 'That car is Nissan.',
        furigana: 'あのくるまはにっさんです。',
        audio: 'https://dl.sndup.net/rtr8/194544434378829.mp3'
      }
    ]
  },
  personalData: {
    reviewCount: 23,
    mature: true
  }
}

      { exampleSentences?.map((sentence: ExampleSentence) => {
        return (
          <li key={sentence.id}>
            {sentence.sentence} = {sentence.translation}
          </li>
        )
      })
      }
*/
