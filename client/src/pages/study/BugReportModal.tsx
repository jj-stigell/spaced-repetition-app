/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import LockIcon from '@mui/icons-material/Lock'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'

// Project imports
import { modalButtonStyle, modalStyle } from '../dashboard/LevelSelector'
import { sendBugReport } from '../../config/api'
import axios from '../../lib/axios'
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch } from '../../app/hooks'

function BugReportModal (
  { cardId, open, setOpen }:
  { cardId: number | undefined, open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }
): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState<boolean>(false)
  const [type, setType] = React.useState<string>('TRANSLATION')
  const [bugMessage, setBugMessage] = React.useState<string>('')

  const sendReport = (): void => {
    setLoading(true)
    axios.post(sendBugReport, {
      cardId,
      type,
      bugMessage
    }).finally(() => {
      setLoading(false)
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

          <Button sx={modalButtonStyle} disabled={loading} onClick={() => { sendReport() }}>
            {t('modals.bugReport.sendButton')}
          </Button>
          <Button sx={modalButtonStyle} color='error' disabled={loading} onClick={() => { setOpen(false) }}>
            {t('modals.bugReport.closeButton')}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default BugReportModal
