/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { categories, Category, JLPT, jlptLevels } from '../../mockData'
import Button from '@mui/material/Button'
import LevelSelector from '../category/LevelSelector'
import { useNavigate, useParams } from 'react-router-dom'
import CircularLoader from '../../components/CircularLoader'
import CircularProgress from '@mui/material/CircularProgress'
import SubmitButton from '../../components/SubmitButton'

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

export enum CardType {
  KANJI = 'KANJI',
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  VOCABULARY = 'VOCABULARY'
}

export enum ReviewType {
  RECALL = 'RECALL',
  RECOGNISE = 'RECOGNISE',
}

export interface answerOption {
  option: string
  correct: boolean
}

export interface KanaCard {
  kana: string
  story: string
  hint: string
  answerOptions: answerOption[]
}

export interface KanjiCard {
  kanji: string
  keyword: string
  story: string
  hint: string
  onyomi: string
  kunyomi: string
  onyomiRomaji: string
  kunyomiRomaji: string
  answerOptions: answerOption[]
}

export interface VocabularyCard {
  word: string
  keyword: string
  reading: string
  readingRomaji: string
  answerOptions: answerOption[]
}

export interface Card {
  id: number
  cardType: CardType
  reviewType: ReviewType
  card: KanjiCard | VocabularyCard | KanaCard
}


const cards: Card[] = [
  {
    id: 1,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECOGNISE,
    card: {
      kanji: '車',
      keyword: 'car',
      story: 'looks like a vehicle from birds eye view',
      hint: 'pictograph',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      answerOptions: [
        {
          option: 'car',
          correct: true
        },
        {
          option: 'airplane',
          correct: false
        },
        {
          option: 'boat',
          correct: false
        },
        {
          option: 'bicycle',
          correct: false
        }
      ]
    }
  },
  {
    id: 2,
    cardType: CardType.KANJI,
    reviewType: ReviewType.RECALL,
    card: {
      kanji: '車',
      keyword: 'car',
      story: 'looks like a vehicle from birds eye view',
      hint: 'pictograph',
      onyomi: 'しゃ',
      kunyomi: 'くるま',
      onyomiRomaji: 'sha',
      kunyomiRomaji: 'kuruma',
      answerOptions: [
        {
          option: 'car',
          correct: true
        },
        {
          option: 'airplane',
          correct: false
        },
        {
          option: 'boat',
          correct: false
        },
        {
          option: 'bicycle',
          correct: false
        }
      ]
    }
  },
  {
    id: 2,
    cardType: CardType.HIRAGANA,
    reviewType: ReviewType.RECALL,
    card: {
      kana: 'か',
      keyword: 'ka',
      story: 'shape is almost like "ka" in cursive',
      hint: 'I dont have any hints for you',
      answerOptions: [
        {
          option: 'ka',
          correct: true
        },
        {
          option: 'sa',
          correct: false
        },
        {
          option: 'ha',
          correct: false
        },
        {
          option: 'na',
          correct: false
        }
      ]
    }
  },
  {
    id: 2,
    cardType: CardType.KATAKANA,
    reviewType: ReviewType.RECALL,
    card: {
      kana: 'ホ',
      keyword: 'ho',
      story: 'Looks like the HOly cross with sunlight shining behind it',
      hint: 'jesus christ',
      answerOptions: [
        {
          option: 'ho',
          correct: true
        },
        {
          option: 'ko',
          correct: false
        },
        {
          option: 'so',
          correct: false
        },
        {
          option: 'no',
          correct: false
        }
      ]
    }
  }
]

/*
export interface KanaCard {
  kana: string
  story: string
  hint: string
  answerOptions: answerOption[]
}
*/


/*
fecth cards based on deck id and feed one by one to the review
*/

function Study (): JSX.Element {
  const navigate = useNavigate()
  const { id } = useParams()

  const [cards, setCards] = React.useState<Card[] | null>(null)

  /*
  1. get deck cards by id from api
  2. set cards to storage
  3. set first as the crrect card
  4. conditionally render correct type
  5. after answer reschedule
  6.take next card
  7. cards empty display message and redirect to deck list
  */



  const handleClick = (id: number): void => {
    console.log('deck selected', id)
    navigate(`/study/deck/${id}`)
  }

  React.useEffect(() => {
    setTimeout(() => {
      setCards([])
    }, 1000)
  }, [])

  if (cards == null) {
    return (<CircularLoader />)
  }

  return (
    <div id="study-page-card" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        kjflskdjflksdjkflsd
      </Container>
    </div>
  )
}

export default Study
