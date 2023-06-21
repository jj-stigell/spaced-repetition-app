/* eslint-disable @typescript-eslint/no-misused-promises */
import React, { useState } from 'react'
import PlayCircleIcon from '@mui/icons-material/PlayCircle'
import StopCircleIcon from '@mui/icons-material/StopCircle'

function AudioButton ({ src }: { src: string }): JSX.Element {
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
    <div>
      <button onClick={handleClick}>
        {isPlaying ? <StopCircleIcon /> : <PlayCircleIcon />}
      </button>
    </div>
  )
}

export default AudioButton
