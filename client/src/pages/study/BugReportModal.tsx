import React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

// Project imports
import { modalButtonStyle, modalStyle } from '../dashboard/LevelSelector'
import { bugReport } from '../../config/api'
import axios from '../../lib/axios'
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch } from '../../app/hooks'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'

function BugReportModal (
  { cardId, open, setOpen }:
  { cardId: number | undefined, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }
): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [valid, setValid] = React.useState<boolean>(false)
  const [type, setType] = React.useState<string>('TRANSLATION')
  const [bugMessage, setBugMessage] = React.useState<string>('')

  const bugCategory = [
    {
      id: 'TRANSLATION',
      translation: t('modals.bugReport.category.translation')
    },
    {
      id: 'UI',
      translation: t('modals.bugReport.category.ui')
    },
    {
      id: 'FUNCTIONALITY',
      translation: t('modals.bugReport.category.functionality')
    },
    {
      id: 'OTHER',
      translation: t('modals.bugReport.category.other')
    }
  ]

  const sendReport = (): void => {
    setLoading(true)
    axios.post(bugReport, {
      cardId,
      type,
      bugMessage
    }).finally(() => {
      setLoading(false)
      setBugMessage('')
      dispatch(setNotification({ message: t('modals.bugReport.sendSuccess'), severity: 'success' }))
    })
  }

  return (
    <Modal
      open={open}
      onClose={() => { setOpen(!open) }}
      aria-labelledby="modal-send-bug-report"
    >
      <Box sx={modalStyle}>
        <Typography id="bug-report-title" variant="h6" component="h3" sx={{ textAlign: 'center', marginBottom: 3 }}>
          {t('modals.bugReport.title')}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <TextField
            id="outlined-multiline-static"
            label={t('modals.bugReport.description')}
            disabled={loading}
            multiline
            rows={5}
            onChange={(e) => {
              setBugMessage(e.target.value)
              if (bugMessage.length >= 5 && bugMessage.length <= 100) {
                setValid(true)
              } else {
                setValid(false)
              }
            }}
            defaultValue=""
            sx={{
              mb: 3
            }}
          />
          <TextField
            id="select-bug-categorye"
            label={t('modals.bugReport.category.title')}
            select
            disabled={loading}
            defaultValue={type}
            onChange={(e) => { setType(e.target.value) }}
            sx={{
              mb: 3
            }}
          >
            {bugCategory.map((category) => (
              <MenuItem key={category.id} value={category.id}>
                {category.translation}
              </MenuItem>
            ))}
          </TextField>
          <Button sx={modalButtonStyle} disabled={loading || !valid} onClick={() => { sendReport() }}>
            {t('modals.bugReport.sendButton')}
          </Button>
          <Button sx={modalButtonStyle} disabled={loading} onClick={() => { setOpen(false) }}>
            {t('modals.bugReport.closeButton')}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default BugReportModal
