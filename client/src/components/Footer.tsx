import React from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'

import routes from 'src/config/routes'

export default function Footer (): React.JSX.Element {
  const { t } = useTranslation()

  return (
    <footer className="fixed bottom-0 left-0 z-20 w-full p-4 bg-white border-t border-gray-200 shadow md:flex md:items-center md:justify-between md:p-6 dark:bg-gray-800 dark:border-gray-600">
      <span className="text-sm text-gray-500 sm:text-center dark:text-gray-400">
        © 2023{' '}
        <a href="https://yomiko.io/" className="hover:underline" target='_blank' rel="noreferrer">
          Yomiko™
        </a>
        . All Rights Reserved.
      </span>
      <ul className="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
        <li>
          <Link to={routes.about} className="hover:underline me-4 md:me-6">
            {t('footer.about')}
          </Link>
        </li>
        <li>
          <Link to={routes.privacy} className="hover:underline me-4 md:me-6">
            {t('footer.privacyPolicy')}
          </Link>
        </li>
        <li>
          <Link to={routes.contact} className="hover:underline">
            {t('footer.contact')}
          </Link>
        </li>
      </ul>
    </footer>
  )
}
