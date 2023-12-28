import React from 'react'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'

import { useAppDispatch } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import Button from 'src/components/Button'
import { updateStudySettings } from 'src/features/accountSlice'

interface IReviewSettings {
  closeForm?: () => void
}

export default function ReviewSettings ({ closeForm }: IReviewSettings): React.JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const { autoNextCard, nextCardtimer, autoPlayAudio } = useSelector((state: RootState) => state.account)

  const increment = (): void => {
    dispatch(updateStudySettings({ nextCardtimer: Math.min(nextCardtimer + 1, 999) }))
  }

  const decrement = (): void => {
    dispatch(updateStudySettings({ nextCardtimer: Math.max(nextCardtimer - 1, 1) }))
  }

  return (
    <>
      <p className="mt-2 mb-4 text-xl font-semibold">{t('pages.settings.study.reviewSettings')}</p>
      <div className="mb-4 space-x-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">{t('pages.settings.study.autoplayAudio')}</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={autoPlayAudio} onClick={() => { dispatch(updateStudySettings({ autoPlayAudio: !autoPlayAudio })) }} />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
        </label>
      </div>
      <div className="mb-4 space-x-4 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <p className="text-gray-600">{t('pages.settings.study.showNextCardAutomatically')}</p>
        <label className="relative inline-flex items-center cursor-pointer">
          <input type="checkbox" className="sr-only peer" checked={autoNextCard} onClick={() => { dispatch(updateStudySettings({ autoNextCard: !autoNextCard })) }} />
          <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"/>
        </label>
      </div>
      {autoNextCard && (
        <>
          <label htmlFor="quantity-input" className="block mb-2 text-sm font-medium text-gray-600 dark:text-white">{t('pages.settings.study.setTimerForShowingNewCard')}</label>
          <div className="relative flex items-center max-w-[8rem]">
            <button type="button" id="decrement-button" onClick={() => { decrement() }} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-s-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 2">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h16"/>
                </svg>
            </button>
            <input type="text" id="quantity-input" data-input-counter aria-describedby="helper-text-explanation" className="bg-gray-50 border-x-0 border-gray-300 h-11 text-center text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" value={nextCardtimer} />
            <button type="button" id="increment-button" onClick={() => { increment() }} className="bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:border-gray-600 hover:bg-gray-200 border border-gray-300 rounded-e-lg p-3 h-11 focus:ring-gray-100 dark:focus:ring-gray-700 focus:ring-2 focus:outline-none">
                <svg className="w-3 h-3 text-gray-900 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 1v16M1 9h16"/>
                </svg>
            </button>
          </div>
        </>
      )}
      {closeForm !== undefined && (
        <Button
          type='button'
          onClick={closeForm}
          buttonText={t('modals.settings.closeButton')}
          className='mt-8'
        />
      )}
    </>
  )
}
