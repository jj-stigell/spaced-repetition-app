import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

import { useAppDispatch } from 'src/app/hooks'
import Modal from 'src/components/Modal'
import { account, logout } from 'src/config/api'
import { resetAccount } from 'src/features/accountSlice'
import axios from 'src/lib/axios'
import { constants } from 'src/config/constants'
import { setNotification } from 'src/features/notificationSlice'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'

export default function Manage (): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [loggingOut, setLoggingOut] = useState(false)
  const [showModal, setShowModal] = useState(false)
  const [deleting, setDeleting] = useState(false)

  const handleLogout = (): void => {
    setLoggingOut(true)
    axios.post(logout).finally(function () {
      dispatch(resetAccount())
      setLoggingOut(false)
    })
  }

  const formik = useFormik({
    initialValues: {
      password: '',
      passwordConfirmation: ''
    },
    validationSchema: yup.object({
      password: yup.string()
        .max(constants.account.passwordMaxLength, t('errors.ERR_PASSWORD_TOO_LONG', { length: constants.account.passwordMaxLength }))
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      passwordConfirmation: yup.string()
        .oneOf([yup.ref('password'), ''], t('errors.ERR_PASSWORD_MISMATCH'))
        .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED'))
    }),
    onSubmit: (values: any, { resetForm }) => {
      setDeleting(true)
      axios.delete(account, {
        data: {
          password: values.password
        }
      }).then(function (data) {
        // Set notification and log out after that.
        const date: Date = new Date(data.data.data.deletionDate)
        void dispatch(
          setNotification({
            message: t('pages.settings.deleteAccount.deleteSuccess', { date: date.toLocaleDateString() }),
            severity: 'warning',
            autoHideDuration: 30000
          })
        )
        setDeleting(false)
        setTimeout(() => {
          resetForm()
          handleLogout()
        }, 1000)
      }).catch(function () {
        resetForm()
        setDeleting(false)
      })
    }
  })

  const toggleModal = (): void => {
    formik.resetForm()
    setShowModal(!showModal)
  }

  return (
    <>
      <Modal toggleModal={toggleModal} showModal={showModal}>
        <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
          {t('pages.settings.deleteAccount.title')}
        </h1>
        <p className="mt-4">
          {t('pages.settings.deleteAccount.modalWarningUpper')}
        </p>
        <p className="mt-4">
          {t('pages.settings.deleteAccount.modalWarningLower')}
        </p>
        <form
          className="mt-4 space-y-4 md:space-y-6"
          onSubmit={formik.handleSubmit}
        >
          {/* Password field */}
          <InputField
            id='password'
            type='password'
            name='password'
            label={t('misc.password')}
            placeholder='••••••••'
            value={formik.values.password}
            errors={formik.errors.password}
            fieldTouched={formik.touched.password}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          {/* Confirm password field */}
          <InputField
            id='passwordConfirmation'
            type='password'
            name='passwordConfirmation'
            label={t('misc.passwordConfirm')}
            placeholder='••••••••'
            value={formik.values.passwordConfirmation}
            errors={formik.errors.passwordConfirmation}
            fieldTouched={formik.touched.passwordConfirmation}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
          <Button
            type='submit'
            disabled={deleting}
            loading={deleting}
            color='red'
            loadingText={t('pages.settings.deleteAccount.deleteProsessing')}
            buttonText={t('pages.settings.deleteAccount.deleteButton')}
          />
        </form>
        <div className="my-4"/>
        <Button
          type='button'
          onClick={toggleModal}
          disabled={deleting}
          buttonText={t('buttonGeneral.cancel')}
        />
      </Modal>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">
          {t('pages.settings.manageTitle')}
        </h1>
      </div>
      <hr className="mt-4 mb-8" />
      <div className="mb-10">
        <p className="py-2 text-xl font-semibold">{t('pages.settings.logout.title')}</p>
        <p className="mt-1">{t('pages.settings.logout.description')}</p>
        <div className="my-4"/>
        <Button
          loading={loggingOut}
          disabled={loggingOut}
          onClick={handleLogout}
          buttonText={t('buttonGeneral.logout')}
        />
        <hr className="my-4" />
        <p className="mb-4 text-xl font-semibold">{t('pages.settings.deleteAccount.title')}</p>
        <p className="inline-flex items-center rounded-full bg-rose-100 px-4 py-1 text-rose-600">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="mr-2 h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {t('pages.settings.deleteAccount.caution')}
        </p>
        <p className="mt-2">{t('pages.settings.deleteAccount.note')}</p>
        <button onClick={toggleModal} className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2 hover:text-rose-800">
          {t('pages.settings.deleteAccount.continueButton')}
        </button>
      </div>
    </>
  )
}
