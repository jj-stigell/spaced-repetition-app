/*
import React from 'react'

// Third party imports
import { experimentalStyled as styled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { useTranslation } from 'react-i18next'

// Project imports
import { Deck, Role } from '../../types'
import { RootState } from '../../app/store'
import { Account } from '../../features/accountSlice'
import { useAppSelector } from '../../app/hooks'

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

function DeckCard ({ deck, handleClick }: { deck: Deck, handleClick: any }): JSX.Element {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()

  const account: Account = useAppSelector((state: RootState) => state.account.account)

  return (
    <Grid item xs={2} sm={4} md={4} key={deck.id}>
      <Item onClick={() => { handleClick(deck.id) }}>
        {deck.title}
        <br/>
        { account.role === Role.NON_MEMBER
          ? <>Member deck, NO ACCESS</>
          : <>Member deck, study now</>
        }
        <br/>
        { deck.translationAvailable
          ? <>Translation available</>
          : <>Translation not available, using english</>
        }
        <br/>
        { account.role !== Role.NON_MEMBER &&
          <>Favorite: {((deck?.favorite) === true) ? <>true</> : <>false</>}</>
        }
        <br/>
        description: {deck.description}
        <br/>
        due: 4
        <br/>
        new: 3
        { ((deck?.progress) !== undefined) &&
        <div>
          <br/>
          Progress:
          <br/>
          new cards: {deck.progress.new}
          <br/>
          learning cards: {deck.progress.learning}
          <br/>
          matured cards: {deck.progress.mature}
        </div>
        }
        </Item>
    </Grid>
  )
}

export default DeckCard

*/
import * as React from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Deck } from '../../types'
import { Grid } from '@mui/material'
import { useTranslation } from 'react-i18next'

function DeckCard ({ deck, handleClick }: { deck: Deck, handleClick: any }): JSX.Element {
  const { t } = useTranslation()
  const img = 'https://i.imgur.com/6HSurT9.jpg'

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={img}
          title="deck image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {deck.title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {deck.description}
            <br/>
              { deck.translationAvailable
                ? <>{t('pages.decks.deck.translationAvailable')}</>
                : <>{t('pages.decks.deck.translationNotAvailable')}</>
              }
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            onClick={() => { handleClick(deck.id) }}
          >
            {t('pages.decks.studyButton')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default DeckCard
