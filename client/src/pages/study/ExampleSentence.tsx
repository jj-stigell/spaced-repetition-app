/* eslint-disable padded-blocks */
/* eslint-disable no-multiple-empty-lines */
/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import AudioButton from './AudioButton'

function ExampleSentence ({ sentence }: { sentence: any }): JSX.Element {

  return (
    <div>
      {sentence.sentence}
      <br/>
      {sentence.translation} <AudioButton src={sentence.audio} />
    </div>
  )
}

export default ExampleSentence


/*
      {
        id: 186,
        sentence: 'あの車は日産です。',
        translation: 'That car is Nissan.',
        furigana: 'あのくるまはにっさんです。',
        audio: 'https://dl.sndup.net/rtr8/194544434378829.mp3'
      }
*/
