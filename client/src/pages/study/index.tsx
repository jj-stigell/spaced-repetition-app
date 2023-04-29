/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { useNavigate, useParams } from 'react-router-dom'
import CircularLoader from '../../components/CircularLoader'
import { mockCards } from '../../mockData'
import { Card } from '../../types'

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
  const { id } = useParams()

  const [cards, setCards] = React.useState<Card[]>()
  const [currentCard, setCurrentCard] = React.useState<Card | null>(null)

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
      // TODO fetch from api
      setCurrentCard(mockCards.pop() as Card)
      setCards(mockCards)

      console.log(mockCards)
      console.log(currentCard)
      console.log(cards)
    }, 1000)
  }, [])

  if (currentCard == null) {
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
