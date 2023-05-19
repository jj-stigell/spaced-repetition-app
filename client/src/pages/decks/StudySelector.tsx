import React from 'react'

import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'background.paper',
  border: '3px solid #fad25f',
  borderRadius: 3,
  boxShadow: 24,
  p: 4
}

const buttonStyle = {
  bgcolor: '#f7e09e',
  '&:hover': {
    bgcolor: '#fad25f'
  },
  color: 'black',
  marginBottom: 3,
  flexGrow: 0,
  width: '75%',
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
      aria-labelledby="modal-select-study-type"
      aria-describedby="modal-select-study-due-or-all-cards"
    >
      <Box sx={style}>
        <Typography id="study-type-title" variant="h6" component="h2" sx={{ textAlign: 'center', marginBottom: 3 }}>
          {t('modals.studySelector.title')}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <Button sx={buttonStyle} disabled onClick={() => { handleStudyOptions(deckId, true) }}>
            <LockIcon fontSize="small" />
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
