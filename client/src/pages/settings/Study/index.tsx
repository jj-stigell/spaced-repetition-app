import React from 'react'
import { useTranslation } from 'react-i18next'

import ReviewSettings from './ReviewSettings'

export default function Study (): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <>
      <div className="pt-4">
        <h1 className="py-2 text-2xl font-semibold">{t('pages.settings.study.title')}</h1>
      </div>
      <hr className="mt-4 mb-8" />
      <ReviewSettings />
      <hr className="my-8" />
      <p className="mt-2 mb-4 text-xl font-semibold">{t('pages.settings.study.languageSettings')}</p>
      <div className="mb-8">
        <p className="text-gray-600 mb-4">{t('pages.settings.study.studyLanguage')}</p>
        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option>English</option>
        </select>
      </div>
      <div className="mb-8">
        <p className="text-gray-600 mb-4">{t('pages.settings.study.uiLanguage')}</p>
        <select id="countries" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
          <option>English</option>
        </select>
      </div>
    </>
  )
}
