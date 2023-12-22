import React from 'react'
import { useTranslation } from 'react-i18next'
import { useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'

/*
  const { username, email, role } = useAppSelector((state: RootState) => state.account.account)
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('pages.settings.accountInformation.title')}</h2>
      <Box>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.username')}: {username}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.email')}: {email}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.memberStatus')}: {role === 'NON_MEMBER'
            ? t('pages.settings.accountInformation.expired') + ' 😅'
            : t('pages.settings.accountInformation.active') + ' 😊'}
        </Typography>
        <Typography sx={{ pt: 2 }}>{t('pages.settings.accountInformation.languageSelectorTitle')}</Typography>
        <LanguageSelector callApi={true}/>
      </Box>
    </>
  )
}
*/

export default function Account (): JSX.Element {
  const { t } = useTranslation()
  const { username, email, role } = useAppSelector((state: RootState) => state.account)

  return (
    <>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">{t('pages.settings.accountInformation.title')}</h1>
      </div>
      <hr className="mt-4 mb-8" />
      <p className="py-2 text-xl font-semibold">{t('pages.settings.accountInformation.email')}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Your email address is <strong>{email}</strong>
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Change
        </button>
      </div>
      <p className="pt-8 pb-2 text-xl font-semibold">{t('pages.settings.accountInformation.username')}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          Your username is <strong>{username}</strong>
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Change
        </button>
      </div>
      <p className="pt-8 pb-2 text-xl font-semibold">{t('pages.settings.accountInformation.memberStatus')}</p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          {role === 'NON_MEMBER'
            ? t('pages.settings.accountInformation.expired') + ' 😅'
            : t('pages.settings.accountInformation.active') + ', Expiry: 23-12-2025'}
        </p>
        <button className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          Manage membership
        </button>
      </div>
      <hr className="mt-4 mb-8" />
      <p className="py-2 text-xl font-semibold">Password</p>
      <div className="flex items-center">
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-3">
          <label htmlFor="login-password">
            <span className="text-sm text-gray-500">Current Password</span>
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input
                type="password"
                id="login-password"
                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="***********"
              />
            </div>
          </label>
          <label htmlFor="login-password">
            <span className="text-sm text-gray-500">New Password</span>
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input
                type="password"
                id="login-password"
                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="***********"
              />
            </div>
          </label>
          <label htmlFor="login-password">
            <span className="text-sm text-gray-500">New Password</span>
            <div className="relative flex overflow-hidden rounded-md border-2 transition focus-within:border-blue-600">
              <input
                type="password"
                id="login-password"
                className="w-full flex-shrink appearance-none border-gray-300 bg-white py-2 px-4 text-base text-gray-700 placeholder-gray-400 focus:outline-none"
                placeholder="***********"
              />
            </div>
          </label>
        </div>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="mt-5 ml-2 h-6 w-6 cursor-pointer text-sm font-semibold text-gray-600 underline decoration-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
          />
        </svg>
      </div>
      <p className="mt-4">
        Can&apos;t remember your current password? {' '}
        <button className="inline-flex font-semibold text-blue-600 underline decoration-2">
          Reset password.
        </button>
      </p>
      <button className="my-4 rounded-lg bg-blue-600 px-4 py-2 text-white">
        Save Password
      </button>
    </>
  )
}
