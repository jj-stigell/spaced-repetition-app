import React from 'react'
import Box from '@mui/material/Box'

function KanjiDetail ({ data }: { data: any }): JSX.Element {
  return (
    <Box sx={{ border: 1, p: 2, pt: 3 }}>
      kanji: {data.kanji}
      <br/>
      onyomi: {data.onyomi}
      <br/>
      kunyomi: {data.kunyomi}
      <br/>
      strokeCount: {data.strokeCount}
      <br/>
      radicals:
      <ul>
      { data.radicals.map((radical: any) => {
        return <li key={radical.radical}>
          {radical.radical}
          <br/>
          translation: {radical.translation}
          <br/>
          position: { radical.position != null ? radical.position : '-'}
        </li>
      }) }
      </ul>

    </Box>
  )
}

export default KanjiDetail

/*
    kanji: '車',
    keyword: 'car',
    story: 'looks like a vehicle from birds eye view',
    hint: 'pictograph',
    onyomi: 'しゃ',
    kunyomi: 'くるま',
    onyomiRomaji: 'sha',
    kunyomiRomaji: 'kuruma',
    strokeCount: 7,
    radicals: [
      {
        radical: '⾞',
        translation: 'car',
        position: null
      }
    ],
*/
