import * as React from 'react'

// Third party imports
import { Button } from '@mui/material'

interface ButtonProps {
  buttonText: string
  disabled?: boolean
}

function SubmitButton ({ buttonText, disabled = false }: ButtonProps): JSX.Element {
  return (
    <Button
      disabled={disabled}
      type="submit"
      fullWidth
      variant="contained"
      sx={{ mt: 3, mb: 2 }}
    >
      {buttonText}
    </Button>
  )
}

export default SubmitButton
