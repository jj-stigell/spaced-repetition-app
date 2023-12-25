import React from 'react'

import { useTranslation } from 'react-i18next'
import { useRouteError, isRouteErrorResponse } from 'react-router-dom'
import ErrorPage from '.'

export default function RouterError (): JSX.Element {
  const { t } = useTranslation()
  const error = useRouteError()

  return (
    <ErrorPage>
    {(isRouteErrorResponse(error))
      ? <i>{error.statusText}</i>
      : (error instanceof Error)
          ? <i>{error.message}</i>
          : <i>{t('pages.error.unknowError')}</i>
      }
    </ErrorPage>
  )
}
