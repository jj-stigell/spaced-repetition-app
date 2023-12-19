import React from 'react';

const AudioPlayer = ({ audioUrl }) => {
  return (
    <audio controls src={audioUrl} preload="none"className="w-full">
      Your browser does not support the audio element.
    </audio>
  );
};

export default AudioPlayer;
