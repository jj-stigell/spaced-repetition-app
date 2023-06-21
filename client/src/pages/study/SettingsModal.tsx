/* eslint-disable @typescript-eslint/no-unused-vars */
import React from 'react'

// Third party imports
import { useTranslation } from 'react-i18next'
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
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { FormGroup, FormControlLabel } from '@mui/material'

function SettingsModal (
  { open, setOpen }:
  { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }
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
    axios.post(sendBugReport, {
      type,
      bugMessage
    }).finally(() => {
      setLoading(false)
      setBugMessage('')
      dispatch(setNotification({ message: t('modals.settings.sendSuccess'), severity: 'success' }))
    })
  }

  const [checked, setChecked] = React.useState(true)
  const [timer, setTimer] = React.useState<any>(5)

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    setChecked(event.target.checked)
  }

  return (
    <Modal
      open={open}
      onClose={() => { setOpen(!open) }}
      aria-labelledby="modal-edit-study-settings"
    >
      <Box sx={modalStyle}>
        <Typography id="study-settings-title" variant="h6" component="h3" sx={{ textAlign: 'center', marginBottom: 3 }}>
          {t('modals.settings.title')}
        </Typography>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
        <FormGroup>
          <FormControlLabel
            label="Navigate automatically to next card with timer"
            control={
              <Checkbox
                checked={checked}
                onChange={handleChange}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
        </FormGroup>
        <TextField
          id="outlined-controlled"
          label="Next card timer"
          disabled={!checked}
          error={isNaN(timer)}
          helperText={isNaN(timer) ? 'Timer must be number' : ''}
          sx={{ mt: 2, mb: 3 }}
          value={timer}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTimer(event.target.value)
          }}
        />
          <Button sx={modalButtonStyle} disabled={loading || !valid} onClick={() => { sendReport() }}>
            {t('modals.settings.sendButton')}
          </Button>
          <Button sx={modalButtonStyle} disabled={loading} onClick={() => { setOpen(false) }}>
            {t('modals.settings.closeButton')}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}
/*
    "settings": {
      "title": "Check and edit study settings",
      "sendSuccess": "Settings updated! You can close this window by clicking close.",
      "sendButton": "Update settings",
      "closeButton": "Close"
    }
  },
*/

export default SettingsModal
