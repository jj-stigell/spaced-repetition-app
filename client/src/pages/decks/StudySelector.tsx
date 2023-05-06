import React from 'react'

import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

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

function StudyOptions (
  { deckId, open, setOpen }:
  { deckId: number, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }
): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleStudyOptions = (deckId: number, onlyDueCards: boolean = false): void => {
    navigate(`/study/deck/${deckId}?onlydue=${String(onlyDueCards)}`)
  }

  return (
    <Modal
      open={open}
      onClose={() => { setOpen(!open) }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2" sx={{ textAlign: 'center', marginBottom: 3 }}>
          {t('modals.studySelector.title')}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button sx={buttonStyle} onClick={() => { handleStudyOptions(deckId, true) }}>
            {t('modals.studySelector.studyDueAndNew')}
          </Button>
          <Button sx={buttonStyle} onClick={() => { handleStudyOptions(deckId, false) }}>
            {t('modals.studySelector.studyAll')}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default StudyOptions
