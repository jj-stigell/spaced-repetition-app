/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { ChangeEvent } from 'react'

import { useTranslation } from 'react-i18next'
import { useAppDispatch } from 'src/app/hooks'

import Button from 'src/components/Button'
import InputField from 'src/components/InputField'
import { bugReport } from 'src/config/api'
import { setNotification } from 'src/features/notificationSlice'
import axios from 'src/lib/axios'

interface IBugReportForm {
  closeForm: () => void
  cardId?: number | string
}

export default function BugReportForm ({ closeForm, cardId }: IBugReportForm): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [processing, setProcessing] = React.useState<boolean>(false)
  const [valid, setValid] = React.useState<boolean>(false)
  const [type, setType] = React.useState<string>('UI')
  const [bugMessage, setBugMessage] = React.useState<string>('')

  const handleChange = (event: ChangeEvent<HTMLTextAreaElement>): void => {
    setBugMessage(event.target.value)
    setValid(event.target.value.length > 10)
  }

  const handleCategoryChange = (event: ChangeEvent<HTMLSelectElement>): void => {
    setType(event.target.value)
  }

  const bugCategory = [
    {
      id: 'UI',
      translation: t('modals.bugReport.category.ui')
    },
    {
      id: 'TRANSLATION',
      translation: t('modals.bugReport.category.translation')
    },
    {
      id: 'FUNCTIONALITY',
      translation: t('modals.bugReport.category.functionality')
    },
    {
      id: 'OTHER',
      translation: t('modals.bugReport.category.other')
    }
  ]

  const handleSubmit = (): void => {
    setProcessing(true)
    axios.post(bugReport, {
      cardId,
      type,
      bugMessage
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    }).finally(async () => {
      setProcessing(false)
      setBugMessage('')
      await dispatch(setNotification({ message: t('modals.bugReport.sendSuccess'), severity: 'success' }))
    })
  }

  return (
    <>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">{t('modals.bugReport.title')}</h1>
      <form className="mt-4 space-y-4 md:space-y-6" onSubmit={handleSubmit}>
        <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('modals.bugReport.description')}</label>
        <textarea onChange={handleChange} value={bugMessage} id="message" rows={6} className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="write your bug report here"/>
        <div className="mb-8">
          <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('modals.bugReport.category.title')}</label>
          <select onChange={handleCategoryChange} id="categories" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
            {bugCategory.map((category) => (
              <option key={category.id} value={category.id}>
                {category.translation}
              </option>
            ))}
          </select>
        </div>
        <Button
          type='submit'
          disabled={processing || !valid}
          loading={processing}
          color='green'
          loadingText={t('modals.bugReport.sendButton')}
          buttonText={t('modals.bugReport.sendButton')}
        />
      </form>
      <div className="my-4"/>
      <Button
        type='button'
        onClick={closeForm}
        disabled={processing}
        buttonText= {t('modals.bugReport.closeButton')}
      />
    </>
  )
}
