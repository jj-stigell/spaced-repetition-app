import React from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import ChangePassword from './ChangePassword'

export default function Account (): JSX.Element {
  const { t } = useTranslation()
  const { username, email, role } = useAppSelector(
    (state: RootState) => state.account
  )

  return (
    <>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">
          {t('pages.settings.accountInformation.title')}
        </h1>
      </div>
      <hr className="mt-4 mb-8" />
      <p className="py-2 text-xl font-semibold">
        {t('pages.settings.accountInformation.email')}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Your email address is <strong>{email}</strong>
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Change
        </button>
      </div>
      <p className="pt-8 pb-2 text-xl font-semibold">
        {t('pages.settings.accountInformation.username')}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Your username is <strong>{username}</strong>
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Change
        </button>
      </div>
      <p className="pt-8 pb-2 text-xl font-semibold">
        {t('pages.settings.accountInformation.memberStatus')}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          {role === 'NON_MEMBER'
            ? t('pages.settings.accountInformation.expired') + ' 😅'
            : t('pages.settings.accountInformation.active') +
              ', Expiry: 23-12-2025'}
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Manage membership
        </button>
      </div>
      <hr className="my-4" />
      <ChangePassword />
      <p className="my-2">
        {t('pages.settings.changePassword.forgotPassword')} {' '}
        <button className="inline-flex font-semibold text-blue-600 underline decoration-2">
        {t('pages.settings.changePassword.resetPasswordButton')}
        </button>
      </p>
    </>
  )
}
