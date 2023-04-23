import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { categories, Category } from '../../mockData'
import LevelSelector from './LevelSelector'
import { useNavigate } from 'react-router-dom'

const Item = styled(Paper)(({ theme }) => ({
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

  return (
    <div id="study-page" style={{ marginTop: 15 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="jlpt-level">
          <LevelSelector />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            {categories.map((category: Category) => (
              <Grid item xs={2} sm={4} md={4} key={category.id}>
                <Item onClick={() => { navigate(`/study/decks/${category.id.toLowerCase()}`) }}>{category.name}</Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Study
