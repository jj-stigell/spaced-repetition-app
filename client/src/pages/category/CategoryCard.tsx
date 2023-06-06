import * as React from 'react'

import Card from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import { Category, JlptLevel } from '../../types'
import { Grid } from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'

function CategoryCard ({ category }: { category: Category }): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()

  let img
  const cat: string = category.category.toLowerCase()
  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  switch (cat) {
    case 'kanji':
      img = 'https://i.imgur.com/6HSurT9.jpg'
      break
    case 'kana':
      img = 'https://i.imgur.com/kmphZiP.jpg'
      break
    case 'grammar':
      img = 'https://i.imgur.com/fvdLTL2.jpg'
      break
    case 'vocabulary':
      img = 'https://i.imgur.com/lsFAwsr.jpg'
      break
    default:
      img = 'https://i.imgur.com/lsFAwsr.jpg'
      break
  }

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Card sx={{ maxWidth: 400 }}>
        <CardMedia
          sx={{ height: 140 }}
          image={img}
          title="category image"
        />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {t(`pages.categories.${cat}.title`, { jlptLevel })}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {t(`pages.categories.${cat}.description`, { jlptLevel, amount: category.decks })}
          </Typography>
        </CardContent>
        <CardActions>
          <Button
            fullWidth
            onClick={() => { navigate(`/study/decks/${cat}`) }}
          >
            {t('pages.categories.studyButton')}
          </Button>
        </CardActions>
      </Card>
    </Grid>
  )
}

export default CategoryCard
