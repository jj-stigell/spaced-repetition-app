/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'
import IconButton from '@mui/material/IconButton'
import { Role } from '../../types'
import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import Tooltip from '@mui/material/Tooltip'

function AudioButton ({ src }: { src: string }): JSX.Element {
  const { role } = useAppSelector((state: RootState) => state.account.account)
  const audio = new Audio(src)
  const [isPlaying, setIsPlaying] = useState(false)

  const handleClick = async (): Promise<void> => {
    if (!isPlaying) {
      await audio.play()
      setIsPlaying(true)
    } else {
      audio.pause()
      setIsPlaying(false)
    }
  }

  return (
    <Tooltip title={role === Role.NON_MEMBER ? 'example audio is a member feature' : ''}>
      <IconButton onClick={handleClick} disabled={role === Role.NON_MEMBER}>
        {isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
      </IconButton>
    </Tooltip>
  )
}

export default AudioButton
