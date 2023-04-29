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

export interface Deck {
  id: number
  name: string
  description: string
  dueCards: number
  newCards: number
}

function Decks (): JSX.Element {
  const navigate = useNavigate()
  const { category } = useParams()

  const [decks, setDecks] = React.useState<Deck[]>([])

  // temporary mock data
  const decksMock: Deck[] = [
    {
      id: 1,
      name: 'master deck',
      description: 'includes all the cards from individual decks',
      dueCards: 10,
      newCards: 3
    },
    {
      id: 2,
      name: `${category ?? 'xxx'} deck 1`,
      description: `first 25 ${category ?? 'xxx'} cards`,
      dueCards: 3,
      newCards: 7
    },
    {
      id: 3,
      name: `${category ?? 'xxx'} deck 2`,
      description: `cards 26 to 50 ${category ?? 'xxx'} cards`,
      dueCards: 14,
      newCards: 0
    },
    {
      id: 4,
      name: `${category ?? 'xxx'} deck 3`,
      description: `cards 51 to 75 ${category ?? 'xxx'} cards`,
      dueCards: 8,
      newCards: 3
    },
    {
      id: 5,
      name: `${category ?? 'xxx'} deck 4`,
      description: `cards 76 to 100 ${category ?? 'xxx'} cards`,
      dueCards: 0,
      newCards: 6
    },
    {
      id: 6,
      name: `${category ?? 'xxx'} deck 5`,
      description: `cards 101 to 120 ${category ?? 'xxx'} cards`,
      dueCards: 2,
      newCards: 0
    }
  ]


  const handleClick = (id: number): void => {
    console.log('deck selected', id)
    navigate(`/study/deck/${id}`)
  }

  React.useEffect(() => {
    setTimeout(() => {
      setDecks(decksMock)
    }, 1000)
  }, [])

  if (decks.length === 0) {
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
            {decks.map((deck: Deck) => (
              <Grid item xs={2} sm={4} md={4} key={deck.id}>
                <Item onClick={() => { handleClick(deck.id) }}>
                  {deck.name}
                  <br/>
                  description: {deck.description}
                  <br/>
                  due: {deck.dueCards}
                  <br/>
                  new: {deck.newCards}
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
