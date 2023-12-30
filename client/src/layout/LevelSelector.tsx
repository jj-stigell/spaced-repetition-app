import React from 'react'

import { useTranslation } from 'react-i18next'

import { useAppDispatch, useAppSelector } from 'src/app/hooks'
import { RootState } from 'src/app/store'
import Button from 'src/components/Button'
import { account } from 'src/config/api'
import { setJlptLevel } from 'src/features/accountSlice'
import axios from 'src/lib/axios'
import { JlptLevel } from 'src/types'

interface ILevelSelector {
  toggleModal: () => void
}

export default function LevelSelector ({ toggleModal }: ILevelSelector): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.jlptLevel)
  const [processing, setProcessing] = React.useState(false)

  const handleLevelSelection = (selectedLevel: JlptLevel): void => {
    if (jlptLevel !== selectedLevel) {
      setProcessing(true)
      axios.patch(account, {
        jlptLevel: selectedLevel
      }).then(() => {
        dispatch(setJlptLevel(selectedLevel))
        toggleModal()
      }).catch(function () {
      }).finally(() => {
        setProcessing(false)
      })
    } else {
      toggleModal()
    }
  }

  return (
    <div className='mx-12'>
      <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">{t('modals.jlptSelector.title')}</h1>
      <p className="mt-4">{t('pages.dashboard.jlptSelectorButton', { level: jlptLevel })}</p>
      <hr className="my-4" />
      <Button buttonText='JLPT N5' className='my-4' onClick={() => { handleLevelSelection(JlptLevel.N5) }} />
      <Button buttonText='JLPT N4' disabled className='my-4' onClick={() => { handleLevelSelection(JlptLevel.N4) }}>
        <svg className="mr-2 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/>
        </svg>
      </Button>
      <Button buttonText='JLPT N3' disabled className='my-4' onClick={() => { handleLevelSelection(JlptLevel.N3) }}>
        <svg className="mr-2 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/>
        </svg>
      </Button>
      <Button buttonText='JLPT N2' disabled className='my-4' onClick={() => { handleLevelSelection(JlptLevel.N2) }}>
        <svg className="mr-2 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/>
        </svg>
      </Button>
      <Button buttonText='JLPT N1' disabled className='my-4' onClick={() => { handleLevelSelection(JlptLevel.N1) }}>
        <svg className="mr-2 w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
          <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11.5 8V4.5a3.5 3.5 0 1 0-7 0V8M8 12v3M2 8h12a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z"/>
        </svg>
      </Button>
      <hr className="my-4" />
      <Button type='button' color='red' onClick={toggleModal} disabled={processing} buttonText={t('buttonGeneral.cancel')}/>
    </div>
  )
}
