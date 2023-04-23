import React from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 300,
  bgcolor: 'background.paper',
  border: '1px solid #e70a28',
  boxShadow: 24,
  p: 4
}

const buttonStyle = {
  bgcolor: '#bbbbbb',
  '&:hover': {
    bgcolor: '#e70a28'
  },
  marginBottom: 3,
  flexGrow: 0,
  width: '50%',
  alignSelf: 'center'
}

function LevelSelector (): JSX.Element {
  const [open, setOpen] = React.useState<boolean>(false)
  const [jlptLevel, setJlptLevel] = React.useState<string>('N5')

  const handleModalClick = (): void => {
    setOpen(!open)
  }

  const handleLevelSelection = (selectedLevel: string): void => {
    setJlptLevel(selectedLevel)
    handleModalClick()
  }

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        sx={{
          bgcolor: '#bbbbbb',
          '&:hover': {
            bgcolor: '#e70a28'
          },
          marginBottom: 3,
          flexGrow: 0,
          mt: 3,
          mb: 2
        }}
        onClick={handleModalClick}
      >
        JLPT {jlptLevel} - Click to change
      </Button>
      <Modal
        open={open}
        onClose={handleModalClick}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', marginBottom: 3 }}>
            Select JLPT Level
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button sx={buttonStyle} onClick={() => { handleLevelSelection('N1') }}>JLPT N1</Button>
            <Button sx={buttonStyle} onClick={() => { handleLevelSelection('N2') }}>JLPT N2</Button>
            <Button sx={buttonStyle} onClick={() => { handleLevelSelection('N3') }}>JLPT N3</Button>
            <Button sx={buttonStyle} onClick={() => { handleLevelSelection('N4') }}>JLPT N4</Button>
            <Button sx={buttonStyle} onClick={() => { handleLevelSelection('N5') }}>JLPT N5</Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default LevelSelector
