import React, { useState } from 'react'

import Account from './Account'
import Manage from './Manage'
import Study from './Study'

const activeTabStyle =
  'inline-block p-4 text-black bg-red-200 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
const inactiveTabStyle =
  'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-red-100 dark:hover:bg-gray-800 dark:hover:text-gray-300'

export default function Settings (): JSX.Element {
  const [activeTab, setActiveTab] = useState<'account' | 'study' | 'manage'>(
    'account'
  )

  const renderContent = (): React.JSX.Element => {
    switch (activeTab) {
      case 'account':
        return <Account />
      case 'study':
        return <Study />
      case 'manage':
        return <Manage />
    }
  }

  return (
    <div className="min-h-screen max-w-screen-xl">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-4">
          <a
            onClick={() => {
              setActiveTab('account')
            }}
            aria-current="page"
            className={
              activeTab === 'account' ? activeTabStyle : inactiveTabStyle
            }
          >
            Account
          </a>
        </li>
        <li className="me-4">
          <a
            onClick={() => {
              setActiveTab('study')
            }}
            className={
              activeTab === 'study' ? activeTabStyle : inactiveTabStyle
            }
          >
            Study
          </a>
        </li>
        <li className="me-4">
          <a
            onClick={() => {
              setActiveTab('manage')
            }}
            className={
              activeTab === 'manage' ? activeTabStyle : inactiveTabStyle
            }
          >
            Manage
          </a>
        </li>
      </ul>
      <div className="grid grid-cols-8 pt-3 sm:grid-cols-10">
        <div className="col-span-8 overflow-hidden rounded-xl bg-white shadow-xl sm:px-8 sm:shadow">
          {renderContent()}
        </div>
      </div>
    </div>
  )
}
