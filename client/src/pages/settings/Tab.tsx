/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { Children, PropsWithChildren, ReactElement, useMemo, useState } from 'react'
import { useAppDispatch } from 'src/app/hooks'
import { logout } from 'src/config/api'
import { resetAccount } from 'src/features/accountSlice'
import axios from 'src/lib/axios'

const activeTabStyle = 'inline-block p-4 text-black bg-red-200 rounded-t-lg active dark:bg-gray-800 dark:text-blue-500'
const inactiveTabStyle = 'inline-block p-4 rounded-t-lg hover:text-gray-600 hover:bg-red-100 dark:hover:bg-gray-800 dark:hover:text-gray-300'

// eslint-disable-next-line react/prop-types
export default function Tabs <T> ({ children }: any): JSX.Element {
  const dispatch = useAppDispatch()
  const [loggingOut, setLoggingOut] = useState(false)

  const [activeTab, setActiveTab] = useState<'account' | 'study' | 'manage'>('account')

  const tabs = useMemo(
    () =>
      Children.map(
        Children.toArray(children) as Array<ReactElement<PropsWithChildren<T>>>,
        ({ props }) => props
      ),
    [children]
  )

  const handleLogout = (): void => {
    setLoggingOut(true)
    axios.post(logout)
      .finally(function () {
        dispatch(resetAccount())
        setLoggingOut(false)
      })
  }

  return (

    <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
        <li className="me-4">
            <a onClick={() => { setActiveTab('account') }} aria-current="page" className={activeTab === 'account' ? activeTabStyle : inactiveTabStyle}>Account</a>
        </li>
        <li className="me-4">
            <a onClick={() => { setActiveTab('study') }} className={activeTab === 'study' ? activeTabStyle : inactiveTabStyle}>Study</a>
        </li>
        <li className="me-4">
            <a onClick={() => { setActiveTab('manage') }} className={activeTab === 'manage' ? activeTabStyle : inactiveTabStyle}>Manage</a>
        </li>
    </ul>
  )
}
