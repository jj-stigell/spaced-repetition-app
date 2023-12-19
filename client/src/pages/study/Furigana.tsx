/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import React, { useState } from 'react'

const wrapperStyle = {
  display: 'inline-flex',
  flexFlow: 'row wrap',
  fontFamily: '\'ヒラギノ角ゴ ProN\', \'Hiragino Kaku Gothic ProN\', \'TakaoPゴシック\', TakaoPGothic, \'游ゴシック\', \'游ゴシック体\', YuGothic, \'Yu Gothic\', \'メイリオ\', Meiryo, \'ＭＳ ゴシック\', \'MS Gothic\', HiraKakuProN-W3, \'MotoyaLCedar\', \'Droid Sans Japanese\', sans-serif'
}

const pairStyle = {
  display: 'inline-flex',
  fontSize: '24px',
  lineHeight: '1',
  flexFlow: 'column nowrap',
  justifyContent: 'flex-end',
  alignItems: 'center',
  alignSelf: 'flex-end'
}

const furiStyle = {
  display: 'block',
  fontSize: '0.5em',
  letterSpacing: '-0.02em',
  margin: '0 0.1em',
  paddingTop: '0.2em',
  paddingBottom: '0.1em',
  opacity: '0.9'
}

const textStyle = {
  display: 'block'
}

function Wrapper ({ ...props }): React.JSX.Element {
  return <span lang="ja" style={{ ...wrapperStyle }} {...props} />
}

function Pair ({ ...props }): React.JSX.Element {
  return <span lang="ja" style={{ ...pairStyle }} {...props} />
}

function Furi ({ ...props }): React.JSX.Element {
  return <span lang="ja" style={{ ...furiStyle }} {...props} />
}

function Text ({ ...props }): React.JSX.Element {
  return <span lang="ja" style={{ ...textStyle }} {...props} />
}

export function groupFurigana (word: string, furigana: string): (string[])[] {
  if (word.length === 0) return []

  if (furigana.length === 0) return word.split('').map(char => [char])

  const result: (string[])[] = []
  const furiPairs = furigana.split(';').map(pair => {
    const [indexRange, reading] = pair.split(':')
    const rangeParts = indexRange.split('-').map(Number)
    return { start: rangeParts[0], end: rangeParts.length === 2 ? rangeParts[1] : rangeParts[0], reading }
  })

  let wordIndex = 1 // Start from the first character of the word (1-indexed)
  furiPairs.forEach(pair => {
    // Add characters before the current furigana range (if any)
    while (wordIndex < pair.start) {
      result.push([word[wordIndex - 1]])
      wordIndex++
    }

    // Add the group of characters and their furigana
    const group = word.slice(pair.start - 1, pair.end)
    result.push(pair.end === pair.start ? [group, pair.reading] : [group, pair.reading])

    // Update the index to the end of the current furigana range
    wordIndex = pair.end + 1
  })

  // Add any remaining characters after the last furigana range
  while (wordIndex <= word.length) {
    result.push([word[wordIndex - 1]])
    wordIndex++
  }

  return result
}

interface Props {
  sentence: string
  reading: string
}

export default function Furigana ({ sentence, reading }: Props): React.JSX.Element {
  const [showFurigana, setShowFurigana] = useState(false)
  const grouped = groupFurigana(sentence, reading)

  return (
    <div className="flex justify-between items-center mt-12">
      <Wrapper>
        {grouped.map(([word, furigana], index) => (
          <Pair key={`${word}${index}`}>
            {showFurigana && <Furi>{furigana}</Furi>}
            <Text>{word}</Text>
          </Pair>
        ))}
      </Wrapper>
      <button
        onClick={() => { setShowFurigana(!showFurigana) }}
        className="underline text-blue-500 hover:text-blue-700 mr-4"
      >
        {showFurigana ? 'Hide Furigana' : 'Show Furigana'}
      </button>
    </div>
  )
}
