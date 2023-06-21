import React from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'

import AudioButton from './AudioButton'
import { Example as ExampleType } from '../../types'

function Example ({ sentence }: { sentence: ExampleType }): JSX.Element {
  return (
    <Box sx={{ border: 1, p: 2, pt: 3 }}>
      {(sentence.type != null) &&
      <Chip
        label={sentence.type}
        sx={{
          backgroundColor: sentence.type.toLowerCase() === 'onyomi' ? '#eb4034' : '#f216dc',
          mr: 3
        }} />
      }
      {sentence.example}
      <br/>
      {sentence.translation} <AudioButton src={sentence.audio} />
    </Box>
  )
}

export default Example
