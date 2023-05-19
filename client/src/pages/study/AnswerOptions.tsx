import React from 'react'

import { Button } from '@mui/material'
import { AnswerOption } from '../../types'

function AnswerOptions (
  { options, handleAnswer, showAnswer, pressedButton }:
  { options: AnswerOption[], handleAnswer: (option: AnswerOption) => void, showAnswer: boolean, pressedButton: string }
): JSX.Element {
  return (
    <>
      {options.map((option: AnswerOption) => {
        return (
          <Button
            key={option.option}
            onClick={() => {
              if (!showAnswer) {
                handleAnswer(option)
              }
            }}
            disabled={showAnswer && !option.correct && pressedButton !== option.option}
            type="button"
            fullWidth
            variant="contained"
            sx={{
              mt: 0,
              mb: 2,
              boxShadow: 3,
              padding: 1,
              fontSize: 30,
              '&:hover': {
                backgroundColor: !showAnswer ? '#9dcc27' : option.correct ? 'green' : 'red'
              },
              backgroundColor:
                !showAnswer ? '#c9b375' : pressedButton === option.option ? option.correct ? 'green' : 'red' : option.correct ? 'green' : 'yellow'
            }}
          >
            {option.option}
          </Button>
        )
      })}
    </>
  )
}

export default AnswerOptions
