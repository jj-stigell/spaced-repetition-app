/* eslint-disable @typescript-eslint/strict-boolean-expressions */
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
import Spinner from 'src/components/Spinner'
import { setNotification } from 'src/features/notificationSlice'
import Button from 'src/components/Button'

export default function Manage (): JSX.Element {
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
      password: yup
        .string()
        .max(
          constants.account.passwordMaxLength,
          t('errors.ERR_PASSWORD_TOO_LONG', {
            length: constants.account.passwordMaxLength
          })
        )
        .required(t('errors.ERR_PASSWORD_REQUIRED')),
      passwordConfirmation: yup
        .string()
        .oneOf([yup.ref('password'), ''], t('errors.ERR_PASSWORD_MISMATCH'))
        .required(t('errors.ERR_PASSWORD_CONFIRMATION_REQUIRED'))
    }),
    onSubmit: async (values: any, { resetForm }) => {
      setDeleting(true)
      axios
        .delete(account, {
          data: {
            password: values.password
          }
        })
        .then(async function (data) {
          // Set notification and log out after that.
          const date: Date = new Date(data.data.data.deletionDate)
          await dispatch(
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
        })
        .catch(function () {
          resetForm()
          setDeleting(false)
        })
    }
  })

  return (
    <>
      <Modal setShowModal={setShowModal} showModal={showModal}>
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
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t('misc.password')}
            </label>
            <input
              className={`${
                formik.touched.password && formik.errors.password
                  ? 'bg-red-300 border-red-500 text-red-700'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              id="password"
              name="password"
              type="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.password}
            />
            {formik.touched.password && formik.errors.password
              ? (
              <div className="text-xs font-medium text-red-700 mt-1">
                {formik.errors.password as string}
              </div>
                )
              : null}
          </div>
          {/* Confirm password field */}
          <div>
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
            >
              {t('misc.passwordConfirm')}
            </label>
            <input
              className={`${
                formik.touched.passwordConfirmation &&
                formik.errors.passwordConfirmation
                  ? 'bg-red-300 border-red-500 text-red-700'
                  : 'bg-gray-50 border-gray-300 text-gray-900'
              } border sm:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`}
              id="passwordConfirmation"
              name="passwordConfirmation"
              type="password"
              placeholder="••••••••"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.passwordConfirmation}
            />
            {formik.touched.passwordConfirmation &&
            formik.errors.passwordConfirmation
              ? (
              <div className="text-xs font-medium text-red-700 mt-1">
                {formik.errors.passwordConfirmation as string}
              </div>
                )
              : null}
          </div>
          <button
            disabled={deleting}
            type="submit"
            className={`w-full text-white bg-red-500 hover:bg-red-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 ${
              deleting ? 'cursor-not-allowed' : ''
            }`}
          >
            {deleting
              ? (
              <Spinner
                text={t('pages.settings.deleteAccount.deleteProsessing')}
              />
                )
              : (
                  t('pages.settings.deleteAccount.deleteButton')
                )}
          </button>
        </form>
        <button
          disabled={deleting}
          onClick={() => {
            setShowModal(false)
          }}
          type="submit"
          className={`mt-4 w-full text-white bg-blue-500 hover:bg-blue-700 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-primary-600 dark:hover:bg-primary-700 ${deleting ? 'cursor-not-allowed' : ''}`}
        >
          {t('buttonGeneral.cancel')}
        </button>
      </Modal>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">
          {t('pages.settings.manageTitle')}
        </h1>
      </div>
      <hr className="mt-4 mb-8" />
      <div className="mb-10">
        <p className="py-2 text-xl font-semibold">
          {t('pages.settings.logout.title')}
        </p>
        <p className="mt-1">{t('pages.settings.logout.description')}</p>
        <Button
          loading={loggingOut}
          disabled={loggingOut}
          handleClick={handleLogout}
          buttonText={t('buttonGeneral.logout')}
        />
        <p className="py-2 text-xl font-semibold">
          {t('pages.settings.deleteAccount.title')}
        </p>
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
        <button
          onClick={() => { setShowModal(!showModal) }}
          className="ml-auto text-sm font-semibold text-rose-600 underline decoration-2 hover:text-rose-800"
        >
          {t('pages.settings.deleteAccount.continueButton')}
        </button>
      </div>
    </>
  )
}
