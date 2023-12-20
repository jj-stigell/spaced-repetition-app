import React from 'react'

import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import routes from '../../config/routes'

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
type Props = {
  children: JSX.Element
}

export default function ErrorPage ({ children }: Props): JSX.Element {
  const { t } = useTranslation()

  return (
    <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', paddingTop: '50px' }}>
      <h1>{t('pages.error.title')}</h1>
      <p>{t('pages.error.description')}</p>
      <br/>
      <p>{t('pages.error.errorMessage')}</p>
      <p>{children}</p>
      <br/>
      <Link to={routes.dashboard}>
        {t('pages.error.link')}
      </Link>
    </div>
  )
}
