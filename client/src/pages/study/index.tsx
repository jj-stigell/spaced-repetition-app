/* eslint-disable no-multiple-empty-lines */
import React from 'react'
import { experimentalStyled as styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import Paper from '@mui/material/Paper'
import Grid from '@mui/material/Grid'
import Container from '@mui/material/Container'
import CssBaseline from '@mui/material/CssBaseline'
import { JLPT, jlptLevels } from '../../mockData'
import TagList from './TagList'

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
  '&:hover': {
    backgroundColor: '#ddd'
  }
}))

function Study (): JSX.Element {
  const handleClick = (id: string): void => {
    console.log('LEVEL SELECTED', id)
  }

  return (
    <div id="study-page" style={{ marginTop: 10 }}>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="tag-list-container">
          <TagList />
        </div>
        <Box sx={{ flexGrow: 1 }}>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 1, sm: 2, md: 2 }}>
            {jlptLevels.map((Level: JLPT) => (
              <Grid item xs={2} sm={4} md={4} key={Level.id}>
                <Item onClick={() => { handleClick(Level.id) }}>{Level.name}</Item>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </div>
  )
}

export default Study
