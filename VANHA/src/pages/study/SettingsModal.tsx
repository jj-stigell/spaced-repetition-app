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
import { bugReport } from '../../config/api'
import axios from '../../lib/axios'
import { setNotification } from '../../features/notificationSlice'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import TextField from '@mui/material/TextField'
import MenuItem from '@mui/material/MenuItem'
import Checkbox from '@mui/material/Checkbox'
import { FormGroup, FormControlLabel } from '@mui/material'
import { RootState } from '../../app/store'
import { CategoryState } from '../../features/categorySlice'
import { updateStudySettings } from '../../features/accountSlice'

function SettingsModal (
  { open, setOpen }:
  { open: boolean, setOpen: React.Dispatch<React.SetStateAction<boolean>> }
): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = React.useState<boolean>(false)

  const { autoNextCard, nextCardtimer, autoPlayAudio } = useAppSelector((state: RootState) => state.account.account)
  const [checked, setChecked] = React.useState(autoNextCard)
  const [autoPlay, setAutoplay] = React.useState(autoPlayAudio)
  const [timer, setTimer] = React.useState<any>(nextCardtimer)

  function closeModal (): void {
    setChecked(autoNextCard)
    setTimer(nextCardtimer)
    setOpen(false)
  }

  function updateSettings (): void {
    setLoading(true)
    // TODO connect to backend
    /*
    axios.post(bugReport, {
      type,
      bugMessage
    }).finally(() => {
      setLoading(false)
      dispatch(setNotification({ message: t('modals.settings.sendSuccess'), severity: 'success' }))
    })
    */
    setTimeout(() => {
      setLoading(false)
      dispatch(updateStudySettings({ autoNextCard: checked, nextCardtimer: timer, autoPlayAudio: autoPlay }))
      dispatch(setNotification({ message: t('modals.settings.sendSuccess'), severity: 'success' }))
    }, 2000)
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
            label="Play audio automatically on correct answer"
            control={
              <Checkbox
                checked={autoPlay}
                onChange={() => { setAutoplay(!autoPlay) }}
                inputProps={{ 'aria-label': 'controlled' }}
              />
            }
          />
          <FormControlLabel
            label="Navigate automatically to next card with timer"
            control={
              <Checkbox
                checked={checked}
                onChange={() => { setChecked(!checked) }}
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
          helperText={isNaN(timer) ? 'Time must be number in seconds' : ''}
          sx={{ mt: 2, mb: 3 }}
          value={timer}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setTimer(event.target.value)
          }}
        />
          <Button sx={modalButtonStyle} disabled={loading || isNaN(timer) || (
            autoNextCard === checked && nextCardtimer === timer && autoPlayAudio === autoPlay
          )} onClick={() => { updateSettings() }}>
            {t('modals.settings.sendButton')}
          </Button>
          <Button sx={modalButtonStyle} disabled={loading} onClick={closeModal}>
            {t('modals.settings.closeButton')}
          </Button>
        </div>
      </Box>
    </Modal>
  )
}

export default SettingsModal
