import React from 'react'

import { Box, Button, Container, Grid, Paper, experimentalStyled } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import LevelSelector from './LevelSelector'
import { category } from '../../config/path'
import RadarChart from './RadarChart'

const Item = experimentalStyled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(3),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

function Dashboard (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
  <div id="dashboard" style={{ marginTop: 15 }}>
    <Container maxWidth="md" sx={{ pb: 3 }}>
      <Box sx={{ flexGrow: 1, mt: 4 }}>
        <Grid container spacing={{ xs: 2, md: 2 }} columns={{ xs: 1, sm: 8, md: 8 }}>
            <Grid item xs={2} sm={4} md={4} key={1}>
              <div id="jlpt-level-selector">
                <LevelSelector />
              </div>
            </Grid>
            <Grid item xs={2} sm={4} md={4} key={2}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => { navigate(category) }}
              >
                {t('pages.dashboard.goToStudyButton')}
              </Button>
            </Grid>
            <Grid item xs={12} sm={12} md={12} key={5}>
              <Item><RadarChart /></Item>
            </Grid>
        </Grid>
      </Box>
    </Container>
  </div>
  )
}

export default Dashboard
