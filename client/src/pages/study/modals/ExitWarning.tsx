import React from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import Button from 'src/components/Button'
import routes from 'src/config/routes'

interface IExitWarning {
  closeForm: () => void
}

export default function ExitWarning ({ closeForm }: IExitWarning): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  return (
    <>
      <h1 className="text-center text-base font-bold text-gray-900 md:text-2xl dark:text-white">{t('modals.exit.title')}</h1>
      <p className="text-center mb-10 mt-4">{t('modals.exit.description')}</p>
      <Button
        type='button'
        onClick={closeForm}
        buttonText={t('modals.exit.continueButton')}
      />
      <Button
        type='button'
        color='red'
        className='my-4'
        onClick={() => { navigate(routes.study) }}
        buttonText={t('modals.exit.exitButton')}
      />
    </>
  )
}
