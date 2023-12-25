import React from 'react'
import LineChart from '../../components/charts/LineChart'
import RadarChart from '../../components/charts/RadarChart'
import LinkList from './LinkList'

export default function Dashboard (): React.JSX.Element {
  return (

      <div className="h-screen">
         <div className="grid grid-cols-2 grid-rows-3 md:grid-rows-4 md:grid-cols-4 gap-2 md:gap-4 h-screen">
         <div className="bg-indigo-100 col-span-1 md:col-span-2">
            <span>01</span>
         </div>
         <div className="col-span-1 md:col-span-2 row-span-1 md:row-span-2 h-72 shadow-xl rounded-xl dark:bg-gray-800">
            <h2 className="flex flex-row flex-nowrap items-center mb-2">
               <span
               className="flex-grow block border-t border-yomiko-red"
               aria-hidden="true"
               role="presentation"
               ></span>
               <span className="flex-none block mx-4 px-4 py-2.5 text-xs shadow-xl rounded-xl leading-none font-medium uppercase bg-yomiko-red text-white">
               Articles
               </span>
               <span
               className="flex-grow block border-t border-yomiko-red"
               aria-hidden="true"
               role="presentation"
               ></span>
            </h2>
            <ul>
               <li className="mb-2">
               <article className="container bg-white shadow-xl rounded-xl p-5 transform transition duration-800 hover:scale-105">
                  <h1 className="font-bold text-yomiko-red">
                     10 tips how to prepare for JLPT
                  </h1>
                  <p className="font-light text-gray-500">
                     It is less than one month until the JLPT exam day. Take
                     these 10 tips for you in the test. Concentrate on
                     reviewing the grammar points, vocabulary, and kanji you
                     find most challenging. It&apos;s crucial to reinforce weak
                     areas in this final stretch...
                  </p>
                  <h6 className="text-sm text-gray-300 mb-5">
                     Published 12/11/2022
                  </h6>
                  <a
                     href="/article/937623"
                     className="rounded-lg py-2 px-4 text-center text-white bg-yomiko-red hover:bg-red-800"
                  >
                     Read article
                  </a>
               </article>
               </li>
               <li className="mb-2">
               <article className="container bg-white shadow-xl rounded-2xl p-5 transform transition duration-800 hover:scale-105">
                  <h1 className="font-bold text-yomiko-red">
                     Why RTK Is a magnificent way to learn kanji
                  </h1>
                  <p className="font-light text-gray-500">
                     James Heisig&apos;s Remembering the Kanji is undeniably the best
                     way to learn and remember massive amount of kanji
                     characters in the shortest possible time frame. After this
                     article you too can harness the power of mnemonics to...
                  </p>
                  <h6 className="text-sm text-gray-300 mb-5">
                     Published 08/10/2022
                  </h6>
                  <a
                     href="/article/9459340"
                     className="rounded-lg py-2 px-4 text-center text-white bg-yomiko-red hover:bg-red-800"
                  >
                     Read article
                  </a>
               </article>
               </li>
               <li className="mb-2">
               <article className="container bg-white shadow-xl rounded-2xl p-5 transform transition duration-800 hover:scale-105">
                  <h1 className="font-bold text-yomiko-red">
                     Why RTK Is a magnificent way to learn kanji
                  </h1>
                  <p className="font-light text-gray-500">
                     James Heisig&apos;s Remembering the Kanji is undeniably the best
                     way to lear.....
                  </p>
                  <h6 className="text-sm text-gray-300 mb-5">
                     Published 08/10/2022
                  </h6>
                  <a
                     href="/article/9459340"
                     className="rounded-lg py-2 px-4 text-center text-white bg-yomiko-red hover:bg-red-800"
                  >
                     Read article
                  </a>
               </article>
               </li>
            </ul>
         </div>
         <div className="bg-purple-100 col-span-1 md:col-span-2">
            <span>03</span>
         </div>
         <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
            <LineChart />
         </div>
         <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
            <RadarChart />
         </div>
         <div className="col-span-1 md:col-span-2 flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
            <span>dkljfldskjfsldk</span>
         </div>
         </div>
         <LinkList />
      </div>

  )
}

/*
export default function Dashboard () {
  return (
      <>
         <SideMenu />
         <div className="p-6 sm:ml-64 bg-rose-50">
            <div className="grid grid-cols-3 gap-4 mb-4 mt-16">
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
                  <LineChart />
               </div>
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
                  <RadarChart />
               </div>
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800">
                  <ul>
                     <li className="mb-2">
                        <article className="container bg-white shadow-xl rounded-xl p-5">
                           <h1 className="font-bold text-yellow-500">10 tips how to prepare for JLPT</h1>
                           <p className="font-light text-gray-500">It is less than one month until the JLPT exam day. Take these 10 tips for.....</p>
                           <h6 className="text-sm text-gray-300 mb-5">Published 12/11/2022</h6>
                           <a href="/article/937623" className="rounded-lg py-2 px-4 text-center text-white bg-yellow-400 hover:bg-yellow-500">Read article</a>
                        </article>
                     </li>
                     <li className="mb-2">
                        <article className="container bg-white shadow-xl rounded-2xl p-5 transform transition duration-800 hover:scale-105">
                           <h1 className="font-bold text-yellow-500">Why RTK Is a magnificent way to learn kanji</h1>
                           <p className="font-light text-gray-500">James Heisig's Remembering the Kanji is undeniably the best way to lear.....</p>
                           <h6 className="text-sm text-gray-300 mb-5">Published 08/10/2022</h6>
                           <a href="/article/9459340" className="rounded-lg py-2 px-4 text-center text-white bg-yellow-400 hover:bg-yellow-500">Read article</a>
                        </article>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-200 dark:bg-gray-800">
               <p className="text-2xl text-gray-400 dark:text-gray-500">
                  <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                  </svg>
               </p>
            </div>
         </div>
      </>
  )
}
*/

/*
import LineChart from "../components/charts/LineChart";
import RadarChart from "../components/charts/RadarChart";
import SideMenu from "./SideMenu";

export default function Dashboard () {
  return (
      <>
         <SideMenu />
         <div className="p-6 sm:ml-64 bg-rose-50">
            <div className="grid grid-cols-3 gap-4 mb-4 mt-16">
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
                  <LineChart />
               </div>
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800 transform transition duration-800 hover:scale-105 bg-white">
                  <RadarChart />
               </div>
               <div className="flex items-center justify-center h-72 shadow-xl rounded-xl dark:bg-gray-800">
                  <ul>
                     <li className="mb-2">
                        <article className="container bg-white shadow-xl rounded-xl p-5">
                           <h1 className="font-bold text-yellow-500">10 tips how to prepare for JLPT</h1>
                           <p className="font-light text-gray-500">It is less than one month until the JLPT exam day. Take these 10 tips for.....</p>
                           <h6 className="text-sm text-gray-300 mb-5">Published 12/11/2022</h6>
                           <a href="/article/937623" className="rounded-lg py-2 px-4 text-center text-white bg-yellow-400 hover:bg-yellow-500">Read article</a>
                        </article>
                     </li>
                     <li className="mb-2">
                        <article className="container bg-white shadow-xl rounded-2xl p-5 transform transition duration-800 hover:scale-105">
                           <h1 className="font-bold text-yellow-500">Why RTK Is a magnificent way to learn kanji</h1>
                           <p className="font-light text-gray-500">James Heisig's Remembering the Kanji is undeniably the best way to lear.....</p>
                           <h6 className="text-sm text-gray-300 mb-5">Published 08/10/2022</h6>
                           <a href="/article/9459340" className="rounded-lg py-2 px-4 text-center text-white bg-yellow-400 hover:bg-yellow-500">Read article</a>
                        </article>
                     </li>
                  </ul>
               </div>
            </div>
            <div className="flex items-center justify-center h-48 mb-4 rounded bg-gray-200 dark:bg-gray-800">
               <p className="text-2xl text-gray-400 dark:text-gray-500">
                  <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                     <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                  </svg>
               </p>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
               <div className="flex items-center justify-center rounded bg-gray-200 h-28 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                     <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                     </svg>
                  </p>
               </div>
               <div className="flex items-center justify-center rounded bg-gray-200 h-28 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                     <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                     </svg>
                  </p>
               </div>
               <div className="flex items-center justify-center rounded bg-gray-200 h-28 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                     <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                     </svg>
                  </p>
               </div>
               <div className="flex items-center justify-center rounded bg-gray-200 h-28 dark:bg-gray-800">
                  <p className="text-2xl text-gray-400 dark:text-gray-500">
                     <svg className="w-3.5 h-3.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 18">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 1v16M1 9h16"/>
                     </svg>
                  </p>
               </div>
            </div>
         </div>
      </>
  )
}

*/
