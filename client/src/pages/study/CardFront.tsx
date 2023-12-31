/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/strict-boolean-expressions */
import React, { useState, useEffect } from 'react'
import { Card, AnswerOption, CardType, ReviewType, VocabularyCard } from '../../types'
import Keyboard from '../../components/Keyboard'
import Furigana from './Furigana'

interface Props {
  data: Card
  showCardBack: boolean
  setShowCardBack: (show: boolean) => void
}

/*
export enum CardType {
  KANJI = 'KANJI',
  HIRAGANA = 'HIRAGANA',
  KATAKANA = 'KATAKANA',
  VOCABULARY = 'VOCABULARY'
}

export enum ReviewType {
  RECALL = 'RECALL',
  RECOGNISE = 'RECOGNISE',
}
*/

interface PropsKanjiFront {
  data: Card
  handleAnswerSelect: (option: AnswerOption) => void
  getButtonClasses: (option: AnswerOption) => void
  showCardBack: boolean
}

const KanjiFront = ({ data, handleAnswerSelect, getButtonClasses, showCardBack }: PropsKanjiFront): React.JSX.Element => (
    <>
        <div className="text-center text-8xl my-12">{data.reviewType === ReviewType.RECOGNISE ? data.card.value : data.card.keyword}</div>
        <div className="grid grid-cols-2 gap-4">
            {data.card.answerOptions.map((option: AnswerOption, index: number) => (
                <button
                    key={index}
                    onClick={() => { handleAnswerSelect(option) }}
                    className={`p-2 border rounded ${getButtonClasses(option)}`}
                    disabled={showCardBack}
                >
                    {option.option}
                </button>
            ))}
        </div>
    </>
)

/*
interface IProps {
  show: boolean;
  children?: React.ReactNode;
  header?: React.ReactNode;
}
*/

interface PropsVocabularyFront {
  data: Card
  handleAnswerSelect: (option: AnswerOption) => void
  getButtonClasses: (option: AnswerOption) => void
  handleAnswerSubmit: (value: string, correctValue: string) => void
  showCardBack: boolean
}

const VocabularyFront = ({ data, handleAnswerSelect, getButtonClasses, handleAnswerSubmit, showCardBack }: PropsVocabularyFront): React.JSX.Element => {
  const [inputValue, setInputValue] = useState('')
  const [showKeyboard, setShowKeyboard] = useState(false)
  const [tries, setTries] = useState(0)
  const vocabularyData = data.card as VocabularyCard

  const handleInputChange = (event: any): void => {
    setInputValue(event.target.value)
  }

  const addCharFromKeyboard = (char: string): void => {
    setInputValue(prev => prev + char)
  }

  const submitAnswer = (): void => {
    handleAnswerSubmit(inputValue, vocabularyData.reading)
    setTries(prev => prev + 1)
    setInputValue('')
  }

  return (
        <>
            <div>
                {data.reviewType === ReviewType.RECALL
                  ? (
                    <div className="text-center text-8xl my-12">{data.card.keyword}</div>
                    )
                  : (
                      showCardBack
                        ? (
                        <Furigana sentence={data.card.value} reading={vocabularyData.reading}/>
                          )
                        : (
                        <div className="text-center text-8xl my-12">{data.card.value}</div>
                          )
                    )}
            </div>
            <div className="w-3/5 items-center justify-center mx-auto">

                { data.reviewType === ReviewType.WRITE
                  ? (
                    <div className='text-center'>
                        <label htmlFor="answer" className="block mb-2 text-lg font-medium text-gray-900 dark:text-black">
                            以下に指定されたスペースに、単語をひらがなで入力してください
                        </label>
                        <div className="flex items-center">
                            <input
                                type="text"
                                id="input_answer"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder=""
                                required
                                value={inputValue}
                                onChange={handleInputChange}
                            />
                            <button className="ml-2 p-2.5 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={() => { submitAnswer() }}>Submit</button>
                            <button className="flex items-center justify-center ml-2 p-2.5 border rounded-lg bg-blue-500 hover:bg-blue-600" onClick={() => { setShowKeyboard(!showKeyboard) }}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                </svg>
                            </button>
                            { tries > 2 && <button className="ml-2 p-2.5 bg-yellow-500 text-white rounded-lg" onClick={() => { console.log(true) }}>Show answer</button> }
                        </div>

                            <div className={`mt-4 border shadow w-96 h-screen fixed top-0  bg-slate-200 p-3 duration-500 transition-all ${showKeyboard ? 'right-0' : '-right-full'} `}>

                                <Keyboard addCharFromKeyboard={addCharFromKeyboard}/>
                            </div>

                    </div>
                    )
                  : (
                      data.card.answerOptions.map((option: AnswerOption, index: number) => (
                        <button
                            key={index}
                            onClick={() => { handleAnswerSelect(option) }}
                            className={`p-2 border rounded ${getButtonClasses(option)}`}
                            disabled={showCardBack}
                        >
                            {option.option}
                        </button>
                      ))
                    ) }
            </div>
        </>
  )
}

export default function CardFront ({ data, showCardBack, setShowCardBack }: Props): React.JSX.Element {
  const [selectedAnswers, setSelectedAnswers] = useState<any[]>([])

  useEffect(() => {
    setSelectedAnswers([])
  }, [data])

  const handleAnswerSelect = (option: AnswerOption): void => {
    setSelectedAnswers(prev => [...prev, option])
    if (option.correct) {
      setShowCardBack(true)
    }
  }

  const handleAnswerSubmit = (value: string, correctValue: string): void => {
    if (value === correctValue) {
      setShowCardBack(true)
    }
  }

  const getButtonClasses = (option: AnswerOption): string => {
    const isSelected = selectedAnswers.includes(option)
    if (isSelected) return option.correct ? 'bg-green-200' : 'bg-gray-200'
    return 'bg-white'
  }

  switch (data.cardType) {
    case CardType.KANJI:
      return <KanjiFront data={data} handleAnswerSelect={handleAnswerSelect} getButtonClasses={getButtonClasses} showCardBack={showCardBack} />
    case CardType.VOCABULARY:
      return <VocabularyFront data={data} handleAnswerSelect={handleAnswerSelect} getButtonClasses={getButtonClasses} showCardBack={showCardBack} handleAnswerSubmit={handleAnswerSubmit} />
  }

  return (
        <>
            <div className="text-center text-8xl my-12">{'ksfdjlkfjklsd'}</div>
            <div className="grid grid-cols-2 gap-4">
                {data.card.answerOptions.map((option: AnswerOption, index: number) => (
                    <button
                        key={index}
                        onClick={() => { handleAnswerSelect(option) }}
                        className={`p-2 border rounded ${getButtonClasses(option)}`}
                        disabled={showCardBack}
                    >
                        {option.option}
                    </button>
                ))}
            </div>
        </>
  )
};
