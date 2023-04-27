import React from 'react'

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import Box from '@mui/material/Box'

import Logo from '../../components/Logo'
import { dashboard } from '../../config/path'

function NotFound (): JSX.Element {
  const { t } = useTranslation()
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
      <Box sx={{ mb: 3 }}>
        <Logo fontSize={50}/>
      </Box>
      <h1>{t('pages.notFound.title')}</h1>
      <p>{t('pages.notFound.description')}</p>
      <br/>
      <Link to={dashboard}>
        {t('pages.notFound.link')}
      </Link>
    </div>
  )
}

export default NotFound
