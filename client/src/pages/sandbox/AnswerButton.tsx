/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'
import { LinearProgress, Box, linearProgressClasses, Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
  height: 15,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: theme.palette.grey[300]
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#308fe8'
  }
}))

const AnswerButton = (
  { value, correctAnswer }:
  { value: string, correctAnswer: boolean }
): JSX.Element => {
  const handleClick = (): void => {
    if (correctAnswer) {
      console.log('YU ARE CORRECT')
    }
  }

  return (
    <Box sx={{ width: '50%', mr: 1 }}>
      <Button
      variant="contained"
      onClick={() => { handleClick() }}
      sx={{
        borderRadius: '10px',
        padding: '10px',
        backgroundColor: 'green',
        boxShadow: 5,
        width: '300px'
      }}
      >
        {value}
      </Button>
    </Box>
  )
}

export default AnswerButton
