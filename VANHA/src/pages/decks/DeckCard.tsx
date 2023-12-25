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
