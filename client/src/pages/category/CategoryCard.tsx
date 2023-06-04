import React from 'react'

import { experimentalStyled } from '@mui/material/styles'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { Category } from '../../types'

const Item = experimentalStyled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(6),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: '#ddd'
  }
}))

function CategoryCard ({ category }: { category: Category }): JSX.Element {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()

  return (
    <Grid item xs={2} sm={4} md={4}>
      <Item onClick={() => { navigate(`/study/decks/${category.category.toLowerCase()}`) }}>
        Category: {category.category}
        <br/>
        Decks: {category.decks}
        <br/>
        { ((category?.progress) !== undefined) &&
        <div>
          <br/>
          Progress:
          <br/>
          new decks: {category.progress.new}
          <br/>
          learning decks: {category.progress.learning}
          <br/>
          finished decks: {category.progress.mature}
        </div>
        }
      </Item>
    </Grid>
  )
}

export default CategoryCard
