import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import routes from 'src/config/routes'

export default function UnderConstruction (): React.JSX.Element {
  const { t } = useTranslation()
  const location = useLocation()
  const { pathname } = location

  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center">
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-gray-500 mt-2">{pathname}</p>
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-wider text-gray-500 mt-2">{t('pages.construction.title')}</p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">{t('pages.construction.body1')}</p>
            <img className="h-auto max-w-lg rounded-lg" src="https://i.ibb.co/cbjW73R/train-hosen-sagyou.png" alt="image description"/>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">{t('pages.construction.body3')}</p>
            <Link to={routes.dashboard} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded transition duration-150">{t('pages.construction.link')}</Link>
        </div>
    </div>
  )
}
