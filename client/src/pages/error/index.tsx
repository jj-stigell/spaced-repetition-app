/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React from 'react'

import { useTranslation } from 'react-i18next'
import { useRouteError, isRouteErrorResponse, Link } from 'react-router-dom'
import { dashboard } from '../../config/path'

function ErrorPage (): JSX.Element {
  const { t } = useTranslation()
  const error = useRouteError()
  console.error(error)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', marginTop: '50px' }}>
      <h1>{t('pages.error.title')}</h1>
      <p>{t('pages.error.description')}</p>
      <br/>
      <p>{t('pages.error.errorMessage')}</p>
      <p>
        {(isRouteErrorResponse(error))
          ? <i>{error.statusText}</i>
          : (error instanceof Error)
              ? <i>{error.message}</i>
              : <i>{t('pages.error.unknowError')}</i>
        }
      </p>
      <br/>
      <Link to={dashboard}>
        {t('pages.error.link')}
      </Link>
    </div>
  )
}

export default ErrorPage
