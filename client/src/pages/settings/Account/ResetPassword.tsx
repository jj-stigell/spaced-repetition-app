import React from 'react'
import { useTranslation } from 'react-i18next'

import Modal from 'src/components/Modal'
import { resetPassword } from 'src/config/api'
import axios from 'src/lib/axios'
import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import Button from 'src/components/Button'
import { setNotification } from 'src/features/notificationSlice'

export default function ResetPassword (): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [showModal, setShowModal] = React.useState(false)
  const [resetting, setResetting] = React.useState(false)
  const { email } = useAppSelector((state: RootState) => state.account)

  const toggleModal = (): void => {
    setShowModal(!showModal)
  }

  const handleClick = (): void => {
    setResetting(true)
    axios.post(resetPassword, {
      email
    }).then(async function () {
      setResetting(false)
      await dispatch(setNotification({ message: t('pages.password.forgotPassword.successTitle'), severity: 'success' }))
      setShowModal(false)
    }).catch(function () {
    })
  }

  return (
    <>
      <Modal toggleModal={toggleModal} showModal={showModal}>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">{t('pages.password.forgotPassword.title')}</h1>
        <p className="my-4">{t('pages.password.forgotPassword.content')}</p>
        <p className="mb-6 text-center font-bold">{email}</p>
        <Button
          type='button'
          onClick={handleClick}
          loading={resetting}
          disabled={resetting}
          loadingText={t('pages.password.forgotPassword.processing')}
          buttonText={t('pages.password.forgotPassword.resetButton')}
        />
        <div className="my-4"/>
        <Button
          type='button'
          onClick={toggleModal}
          disabled={resetting}
          buttonText={t('buttonGeneral.cancel')}
        />
      </Modal>
      <p className="my-4">
        {t('pages.settings.changePassword.forgotPassword')} {' '}
        <button onClick={toggleModal} className="inline-flex font-semibold text-blue-600 underline decoration-2">
          {t('pages.settings.changePassword.resetPasswordButton')}
        </button>
      </p>
    </>
  )
}
