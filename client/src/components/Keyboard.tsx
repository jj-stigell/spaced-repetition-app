/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState } from 'react'

// Includes dakuten and handakuten.
const hiraganaKeys = [
  ['あ', 'か', 'さ', 'た', 'な', 'は', 'ま', 'や', 'ら', 'わ', '゛'],
  ['い', 'き', 'し', 'ち', 'に', 'ひ', 'み', '', 'り', '', '゜'],
  ['う', 'く', 'す', 'つ', 'ぬ', 'ふ', 'む', 'ゆ', 'る', 'を', 'っ'],
  ['え', 'け', 'せ', 'て', 'ね', 'へ', 'め', '', 'れ', '', ''],
  ['お', 'こ', 'そ', 'と', 'の', 'ほ', 'も', 'よ', 'ろ', 'ん', '']
]

const hiraganaKeysYoon = [
  ['きゃ', 'しゃ', 'ちゃ', 'にゃ', 'ひゃ', 'みゃ', 'りゃ', 'ぎゃ', 'じゃ', 'ぢゃ', 'びゃ', 'ぴゃ'],
  ['きゅ', 'しゅ', 'ちゅ', 'にゅ', 'ひゅ', 'みゅ', 'りゅ', 'ぎゅ', 'じゅ', 'ぢゅ', 'びゅ', 'ぴゅ'],
  ['きょ', 'しょ', 'ちょ', 'にょ', 'ひょ', 'みょ', 'りょ', 'ぎょ', 'じょ', 'ぢょ', 'びょ', 'ぴょ']
]

function mapKeys (keys: string[][], handleKeyPress: (char: string) => void): React.JSX.Element {
  return (
    <>
      {keys.map((row, rowIndex) => (
        <div key={rowIndex} className="flex justify-center mb-2">
          {row.map((char, charIndex) => (
            <button
              key={charIndex}
              className={`px-4 py-2 m-1 border rounded-lg ${char ? 'bg-gray-200' : 'bg-transparent'} transform transition duration-200 hover:scale-110 hover:bg-sky-200`}
              onClick={() => { handleKeyPress(char) }}
              disabled={!char}
            >
              {char || '--'}
            </button>
          ))}
        </div>
      ))}
    </>
  )
}

interface Props {
  addCharFromKeyboard: (value: string) => void
}

export default function Keyboard ({ addCharFromKeyboard }: Props): React.JSX.Element {
  const [activeTab, setActiveTab] = useState('hiragana')

  const getTabClass = (tabName: string): string => {
    return `inline-block p-4 rounded-t-lg ${activeTab === tabName ? 'text-blue-600 bg-gray-100 active dark:bg-gray-800 dark:text-blue-500' : 'hover:text-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 dark:hover:text-gray-300'
    }`
  }

  const renderContent = (): React.JSX.Element | undefined => {
    switch (activeTab) {
      case 'hiragana':
        return mapKeys(hiraganaKeys, addCharFromKeyboard)
      case 'Yōon':
        return mapKeys(hiraganaKeysYoon, addCharFromKeyboard)
    }
  }

  return (
    <div className="w-2/3 mx-auto">
      <div className="relative right-0">
        <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200 dark:border-gray-700 dark:text-gray-400">
          <li className="me-2">
            <a className={getTabClass('hiragana')} onClick={() => { setActiveTab('hiragana') }} role="tab">
              <span>Hiragana</span>
            </a>
          </li>
          <li className="me-2">
            <a className={getTabClass('Yōon')} onClick={() => { setActiveTab('Yōon') }} role="tab">
              <span>Yōon</span>
            </a>
          </li>
        </ul>
        <div className="p-5">
          {renderContent()}
        </div>
      </div>
    </div>
  )
};
