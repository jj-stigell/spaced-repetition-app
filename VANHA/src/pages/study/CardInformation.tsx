import React from 'react'

import { AxiosError } from 'axios'
import { Box, Grid, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

import CircularLoader from '../../components/CircularLoader'
import axios from '../../lib/axios'
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { Card, Example as ExampleType } from '../../types'
import Example from './Example'
import CardDetail from './CardDetail'

// temporary
import { textDetailedData as examples } from '../../mockData'

function CardInformation (): JSX.Element {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = React.useState<boolean>(true)
  const [isError, setIsError] = React.useState<string | null>(null)
  const [cardData, setCardData] = React.useState<any | null>(null)

  const activeCard: Card = useAppSelector((state: RootState) => state.card.activeCard) as Card
  const language: string = useAppSelector((state: RootState) => state.account.account.language)

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
        setCardData(examples)
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
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 2, sm: 8, md: 8 }}>
          <Grid item xs={2} sm={4} md={4}>
            Card data:
            <CardDetail data={examples.data} cardType={examples.cardType} />
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            Example sentences:
            <ul>
              { cardData?.data.exampleSentences.map((sentence: ExampleType) => <Example key={sentence.id} sentence={sentence} />)}
            </ul>
          </Grid>
          <Grid item xs={2} sm={4} md={4}>
            Example words:
            <ul>
              { cardData?.data.exampleWords.map((sentence: ExampleType) => <Example key={sentence.id} sentence={sentence} />)}
            </ul>
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
    strokeCount: 7,
    radicals: [
      {
        radical: '⾞',
        translation: 'car',
        position: null
      }
    ],
    exampleWords: {
      kunyomi: [
        {
          id: 276,
          example: '車椅子',
          translation: 'wheelchair',
          furigana: 'くるまいす',
          audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
        },
        {
          id: 967,
          example: '車椅子',
          translation: 'wheelchair',
          furigana: 'くるまいす',
          audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
        }
      ],
      onyomi: [
        {
          id: 764,
          example: '車検',
          translation: 'vehicle inspection',
          furigana: 'しゃけん',
          audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
        },
        {
          id: 456,
          example: '自動車',
          translation: 'automobile',
          furigana: 'じどうしゃ',
          audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
        }
      ]
    },
    exampleSentences: [
      {
        id: 354,
        example: '昨日は車で学校に行きました。',
        translation: 'Yesterday I went to school by car.',
        furigana: 'きのうはくるまでがっこうにいきました。',
        audio: 'https://dl.sndup.net/mjm2/194544434378608.mp3'
      },
      {
        id: 287,
        example: '車のタイヤがパンクされた。',
        translation: 'Cars tire was blown.',
        furigana: 'くるまのたいやがぱんくされた。',
        audio: 'https://dl.sndup.net/pb7r/194544434378718.mp3'
      },
      {
        id: 186,
        example: 'あの車は日産です。',
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
*/
