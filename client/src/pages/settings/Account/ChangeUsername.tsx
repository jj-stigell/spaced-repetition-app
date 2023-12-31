import { useFormik } from 'formik'
import React, { useState } from 'react'
import * as yup from 'yup'
import { useTranslation } from 'react-i18next'

import { useAppDispatch } from 'src/app/hooks'
import { account } from 'src/config/api'
import axios from 'src/lib/axios'
import { constants } from 'src/config/constants'
import { setNotification } from 'src/features/notificationSlice'
import Button from 'src/components/Button'
import InputField from 'src/components/InputField'
import { setUsername } from 'src/features/accountSlice'

interface IChangeUsername {
  toggleModal: () => void
}

interface IForm {
  username: string
}

export default function ChangeUsername ({ toggleModal }: IChangeUsername): React.JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()
  const [processing, setProcessing] = useState(false)

  const formik = useFormik({
    initialValues: {
      username: ''
    },
    validationSchema: yup.object({
      username: yup.string()
        .max(constants.account.usernameMaxLength, t('errors.ERR_USERNAME_TOO_LONG', { length: constants.account.usernameMaxLength }))
        .min(constants.account.usernameMinLength, t('errors.ERR_USERNAME_TOO_SHORT', { length: constants.account.usernameMinLength }))
        .required(t('errors.ERR_USERNAME_REQUIRED'))
    }),
    onSubmit: (values: IForm, { resetForm }) => {
      setProcessing(true)
      axios.patch(account, {
        username: values.username
      }).then(function (data) {
        dispatch(setUsername(values.username))
        resetForm()
        void dispatch(setNotification({ message: t('pages.settings.accountInformation.usernameUpdated'), severity: 'success' }))
        toggleModal()
      }).catch(function () {
      }).finally(function () {
        setProcessing(false)
      })
    }
  })

  return (
    <>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">{t('pages.settings.accountInformation.changeUsernameTitle')}</h1>
      <p className="mt-4">{t('pages.settings.accountInformation.changeUsernameDescription')}</p>
      <form
        className="mt-4 space-y-4 md:space-y-6"
        onSubmit={formik.handleSubmit}
      >
        <InputField
          id='username'
          type='text'
          name='username'
          label={t('misc.username')}
          placeholder='shintaro'
          value={formik.values.username}
          errors={formik.errors.username}
          fieldTouched={formik.touched.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <Button
          type='submit'
          disabled={processing}
          loading={processing}
          color='green'
          loadingText={t('pages.settings.accountInformation.updateProcessing')}
          buttonText={t('pages.settings.accountInformation.update')}
        />
      </form>
      <div className="my-4"/>
      <Button
        type='button'
        onClick={toggleModal}
        disabled={processing}
        buttonText={t('buttonGeneral.cancel')}
      />
    </>
  )
}
