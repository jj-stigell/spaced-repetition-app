import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import routes from 'src/config/routes'

export default function UnderConstruction (): React.JSX.Element {
  const { t } = useTranslation()
  return (
    <div className="w-full h-screen flex flex-col lg:flex-row items-center justify-center space-y-16 lg:space-y-0 space-x-8 2xl:space-x-0">
        <div className="w-full lg:w-1/2 flex flex-col items-center justify-center lg:px-2 xl:px-0 text-center">
            <p className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-wider text-gray-500 mt-2">{t('pages.construction.title')}</p>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">{t('pages.construction.body1')}</p>
            <img className="h-auto max-w-lg rounded-lg" src="https://3.bp.blogspot.com/-xW_gWajVwTU/VdLsCCdQGjI/AAAAAAAAw2A/Oc7319E7910/w1200-h630-p-k-no-nu/train_hosen_sagyou.png" alt="image description"/>
            <p className="text-lg md:text-xl lg:text-2xl text-gray-500 my-12">{t('pages.construction.body3')}</p>
            <Link to={routes.dashboard} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 rounded transition duration-150">{t('pages.construction.link')}</Link>
        </div>
    </div>
  )
}
