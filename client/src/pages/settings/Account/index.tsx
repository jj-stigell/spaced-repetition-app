import React, { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import ChangePassword from './ChangePassword'
import ResetPassword from './ResetPassword'
import Modal from 'src/components/Modal'
import ChangeUsername from './ChangeUsername'

export default function Account (): React.JSX.Element {
  const { t } = useTranslation()
  const { username, email, role } = useAppSelector((state: RootState) => state.account)
  const [showUsernameModal, setShowUsernameModal] = useState(false)

  const toggleUsernameModal = (): void => {
    setShowUsernameModal(!showUsernameModal)
  }

  return (
    <>
    <Modal toggleModal={toggleUsernameModal} showModal={showUsernameModal}><ChangeUsername toggleModal={toggleUsernameModal} /></Modal>
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
          {t('pages.settings.accountInformation.emailInfo')} <strong>{email}</strong>
        </p>
        <button onClick={() => { alert('not implemented') }} className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          {t('pages.settings.accountInformation.changeButton')}
        </button>
      </div>
      <p className="pt-8 pb-2 text-xl font-semibold">
        {t('pages.settings.accountInformation.username')}
      </p>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">
          {t('pages.settings.accountInformation.usernameInfo')} <strong>{username}</strong>
        </p>
        <button onClick={toggleUsernameModal} className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          {t('pages.settings.accountInformation.changeButton')}
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
              ', Expiry: 31-12-2030'}
        </p>
        <button onClick={() => { alert('not implemented') }} className="inline-flex text-sm font-semibold text-blue-600 underline decoration-2">
          {t('pages.settings.accountInformation.manageMembershipButton')}
        </button>
      </div>
      <hr className="my-4" />
      <ChangePassword />
      <ResetPassword />
    </>
  )
}
