/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import { useTranslation } from 'react-i18next'

import { Role } from '../../types'
import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'

function AudioButton ({ src }: { src: string }): JSX.Element {
  const { t } = useTranslation()
  const [isPlaying, setIsPlaying] = useState(false)
  const audio = new Audio(src)
  const { role } = useAppSelector((state: RootState) => state.account.account)

  function handleClick (): void {
    if (!isPlaying) {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      audio.currentTime = 0
      setIsPlaying(false)
    }
  }

  function handleAudioEnded (): void {
    setIsPlaying(false)
    audio.currentTime = 0
  }

  audio.addEventListener('ended', handleAudioEnded)

  return (
    <Tooltip title={role === Role.NON_MEMBER
      ? t('pages.review.view.detailsOptionsTab.exampleSentence.playButtonDisabled')
      : isPlaying
        ? t('pages.review.view.detailsOptionsTab.exampleSentence.stopButton')
        : t('pages.review.view.detailsOptionsTab.exampleSentence.playButton')
    }>
      <IconButton onClick={handleClick} disabled={role === Role.NON_MEMBER}>
        {isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default AudioButton
