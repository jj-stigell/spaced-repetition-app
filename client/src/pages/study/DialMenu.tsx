import React, { useState } from 'react'
import Modal from 'src/components/Modal'
import BugReportForm from './modals/BugReportForm'
import ReviewSettings from 'src/pages/settings/Study/ReviewSettings'
import ExitWarning from './modals/ExitWarning'

export default function DialMenu (): React.JSX.Element {
  const [showReviewSettings, setShowReviewSettings] = useState<boolean>(false)
  const [showBugForm, setShowBugForm] = useState<boolean>(false)
  const [showExitModal, setShowExitModal] = useState<boolean>(false)

  return (
    <>
      <Modal toggleModal={() => { setShowReviewSettings(!showReviewSettings) }} showModal={showReviewSettings}>
        <ReviewSettings closeForm={() => { setShowReviewSettings(!showReviewSettings) }} />
      </Modal>
      <Modal toggleModal={() => { setShowBugForm(!showBugForm) }} showModal={showBugForm}>
        <BugReportForm closeForm={() => { setShowBugForm(!showBugForm) }}/>
      </Modal>
      <Modal toggleModal={() => { setShowExitModal(!showExitModal) }} showModal={showExitModal}>
        <ExitWarning closeForm={() => { setShowExitModal(!showExitModal) }} />
      </Modal>
      <div className="grid min-h-[10px] w-full place-items-center overflow-x-scroll rounded-lg p-2 lg:overflow-visible">
        <div className="relative h-2 w-full">
          <div className="absolute top-0 left-0">
            <div className="group">
              <button
                disabled={showBugForm || showReviewSettings || showExitModal}
                className="relative h-12 max-h-[48px] w-12 max-w-[48px] select-none rounded-full bg-gray-900 text-center align-middle font-sans text-sm font-medium uppercase text-white shadow-md shadow-gray-900/10 transition-all hover:shadow-lg hover:shadow-gray-900/20 focus:opacity-[0.85] focus:shadow-none active:opacity-[0.85] active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none"
                type="button"
              >
                <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    aria-hidden="true"
                    className="h-5 w-5 transition-transform group-hover:rotate-45"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 4.5v15m7.5-7.5h-15"
                    ></path>
                  </svg>
                </span>
              </button>
            {showBugForm || showReviewSettings || showExitModal
              ? null
              : (
                <div className="absolute top-[53px] left-[-4px] hidden w-max flex-col items-center gap-1 p-0.5 group-hover:flex ">
                  <div data-projection-id="87">
                    <button
                      onClick={() => { setShowExitModal(!showExitModal) }}
                      className="m-0.5 flex h-16 min-h-[48px] w-16 min-w-[48px] flex-col items-center justify-center gap-1 rounded-full border border-blue-gray-50 bg-white p-1 font-normal transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110 active:scale-100"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
                        ></path>
                      </svg>
                      <p className="block font-sans text-xs font-normal text-blue-gray-900 antialiased">Home</p>
                    </button>
                  </div>
                  <div data-projection-id="88">
                    <button onClick={() => { setShowReviewSettings(!showReviewSettings) }} className="m-0.5 flex h-16 min-h-[48px] w-16 min-w-[48px] flex-col items-center justify-center gap-1 rounded-full border border-blue-gray-50 bg-white p-1 font-normal transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110 active:scale-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        aria-hidden="true"
                        className="h-5 w-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
                        ></path>
                      </svg>
                      <p className="block font-sans text-xs font-normal text-blue-gray-900 antialiased">Settings</p>
                    </button>
                  </div>
                  <div data-projection-id="89">
                    <button onClick={() => { setShowBugForm(!showBugForm) }} className="m-0.5 flex h-16 min-h-[48px] w-16 min-w-[48px] flex-col items-center justify-center gap-1 rounded-full border border-blue-gray-50 bg-white p-1 font-normal transition-transform duration-300 ease-in-out hover:scale-110 focus:scale-110 active:scale-100">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth="1.5"
                        stroke="currentColor"
                        className="w-6 h-6"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 12.75c1.148 0 2.278.08 3.383.237 1.037.146 1.866.966 1.866 2.013 0 3.728-2.35 6.75-5.25 6.75S6.75 18.728 6.75 15c0-1.046.83-1.867 1.866-2.013A24.204 24.204 0 0112 12.75zm0 0c2.883 0 5.647.508 8.207 1.44a23.91 23.91 0 01-1.152 6.06M12 12.75c-2.883 0-5.647.508-8.208 1.44.125 2.104.52 4.136 1.153 6.06M12 12.75a2.25 2.25 0 002.248-2.354M12 12.75a2.25 2.25 0 01-2.248-2.354M12 8.25c.995 0 1.971-.08 2.922-.236.403-.066.74-.358.795-.762a3.778 3.778 0 00-.399-2.25M12 8.25c-.995 0-1.97-.08-2.922-.236-.402-.066-.74-.358-.795-.762a3.734 3.734 0 01.4-2.253M12 8.25a2.25 2.25 0 00-2.248 2.146M12 8.25a2.25 2.25 0 012.248 2.146M8.683 5a6.032 6.032 0 01-1.155-1.002c.07-.63.27-1.222.574-1.747m.581 2.749A3.75 3.75 0 0115.318 5m0 0c.427-.283.815-.62 1.155-.999a4.471 4.471 0 00-.575-1.752M4.921 6a24.048 24.048 0 00-.392 3.314c1.668.546 3.416.914 5.223 1.082M19.08 6c.205 1.08.337 2.187.392 3.314a23.882 23.882 0 01-5.223 1.082"
                        />
                      </svg>
                      <p className="block font-sans text-xs font-normal text-blue-gray-900 antialiased">Report Bug</p>
                    </button>
                  </div>
                </div>
                )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
