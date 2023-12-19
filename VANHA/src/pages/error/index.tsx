import React from 'react'

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { dashboard } from '../../config/path'

function ErrorPage ({ children }: { children: JSX.Element }): JSX.Element {
  const { t } = useTranslation()

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
      <h1>{t('pages.error.title')}</h1>
      <p>{t('pages.error.description')}</p>
      <br/>
      <p>{t('pages.error.errorMessage')}</p>
      <p>{children}</p>
      <br/>
      <Link to={dashboard}>
        {t('pages.error.link')}
      </Link>
    </div>
  )
}

export default ErrorPage
