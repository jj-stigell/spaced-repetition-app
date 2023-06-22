import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import AudioButton from './AudioButton'
import { Example as ExampleType } from '../../types'
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip'
import { styled } from '@mui/material/styles'

const CustomToolTip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9'
  }
}))

function Example ({ sentence }: { sentence: ExampleType }): JSX.Element {
  // TODO move to i18n
  const tooltipKun = `Kunyomi is the native Japanese way of reading kanji, 
  the Chinese characters used in Japanese. It's typically used when a kanji 
  character stands alone or is combined with hiragana, a Japanese syllabary script.`

  const tooltipOn = `Onyomi is the Chinese-derived way of reading kanji, the 
  Chinese characters used in Japanese. It's typically used when multiple kanji 
  characters are combined together to form a word.`

  return (
    <Box sx={{ border: 1, p: 2, pt: 3 }}>
      {(sentence.type != null && (sentence.type === 'kunyomi' || sentence.type === 'onyomi')) &&
      <CustomToolTip
        title={
          <React.Fragment>
            {/* <Typography color="inherit">{sentence.type.toUpperCase()}</Typography> */}
            {sentence.type === 'kunyomi' ? tooltipKun : tooltipOn}
          </React.Fragment>
        }
      >
        <Chip
          label={sentence.type}
          sx={{
            backgroundColor: sentence.type.toLowerCase() === 'onyomi' ? '#eb4034' : '#f216dc',
            mr: 3
          }}
        />
      </CustomToolTip>
      }
      {sentence.example}
      <br/>
      {sentence.translation} <AudioButton src={sentence.audio} />
    </Box>
  )
}

export default Example
