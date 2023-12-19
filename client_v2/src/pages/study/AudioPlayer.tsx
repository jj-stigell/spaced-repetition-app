import React from 'react'

export default function AudioPlayer ({ audioUrl }: any): React.JSX.Element {
  return (
    <audio controls src={audioUrl} preload="none"className="w-full">
      Your browser does not support the audio element.
    </audio>
  )
};
