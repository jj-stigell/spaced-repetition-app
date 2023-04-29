import React from 'react'

import { experimentalStyled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import LevelSelector from './LevelSelector'
import { DeckCategory, JlptLevel, Role } from '../../types'
import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import { Account } from '../../features/accountSlice'

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

function Study (): JSX.Element {
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { t } = useTranslation()
  const account: Account = useAppSelector((state: RootState) => state.account.account)
  let categories: string[] = Object.values(DeckCategory)

  // Display kana decks only in JLPT N5 level.
  if (account.jlptLevel !== JlptLevel.N5) {
    categories = categories.filter((cat: string) => cat !== DeckCategory.KANA)
  }

  // Don't display custom and favorite decks only to members.
  if (account.role === Role.NON_MEMBER) {
    categories = categories.filter((cat: string) => cat !== DeckCategory.CUSTOM && cat !== DeckCategory.FAVORITE)
  }

  return (
    <div id="study-page" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="jlpt-level">
          <LevelSelector />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            {categories.map((category: string) => (
              <Grid item xs={2} sm={4} md={4} key={category}>
                <Item onClick={() => { navigate(`/study/decks/${category.toLowerCase()}`) }}>{category}</Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Study
