import React from 'react'

import { AxiosError } from 'axios'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import LockIcon from '@mui/icons-material/Lock'
import Typography from '@mui/material/Typography'
import { useTranslation } from 'react-i18next'

import axios from '../../lib/axios'
import { JlptLevel } from '../../types'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { setJlptLevel } from '../../features/accountSlice'
import { RootState } from '../../app/store'
import { changeSettings } from '../../config/api'
import { setNotification } from '../../features/notificationSlice'
import { resetDecks } from '../../features/deckSlice'

export const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 350,
  bgcolor: 'primary.light',
  border: '3px solid primary.main',
  borderRadius: 3,
  boxShadow: 24,
  p: 4
}

export const modalButtonStyle = {
  marginBottom: 3,
  flexGrow: 0,
  width: '75%',
  alignSelf: 'center'
}

function LevelSelector (): JSX.Element {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()

  const [open, setOpen] = React.useState<boolean>(false)

  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  const handleModalClick = (): void => {
    setOpen(!open)
  }

  const handleLevelSelection = (selectedLevel: JlptLevel): void => {
    dispatch(setJlptLevel(selectedLevel))
    dispatch(resetDecks())
    handleModalClick()

    axios.patch(changeSettings, {
      jlptLevel: selectedLevel
    }).catch(function (error) {
      let errorCode: string | null = null

      if (Array.isArray(error?.response?.data?.errors)) {
        errorCode = error?.response?.data?.errors[0].code
      }

      if (errorCode != null) {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        dispatch(setNotification({ message: t(`errors.${errorCode}`), severity: 'error' }))
      } else if (error instanceof AxiosError) {
        dispatch(setNotification({ message: error.message, severity: 'error' }))
      } else {
        dispatch(setNotification({ message: t('errors.ERR_CHECK_CONNECTION'), severity: 'error' }))
      }
    })
  }

  return (
    <>
      <Button
        fullWidth
        variant="contained"
        onClick={handleModalClick}
      >
        {t('pages.dashboard.jlptSelectorButton', { level: jlptLevel })}
      </Button>
      <Modal
        open={open}
        onClose={handleModalClick}
        aria-labelledby="modal-select-jlpt-level"
        aria-describedby="modal-select-the-desired-jlpt-level-for-studying"
      >
        <Box sx={modalStyle}>
          <Typography id="jlpt-level-title" variant="h6" component="h2" sx={{ textAlign: 'center', marginBottom: 3 }}>
            {t('modals.jlptSelector.title')}
          </Typography>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <Button sx={modalButtonStyle} onClick={() => { handleLevelSelection(JlptLevel.N5) }}>JLPT N5</Button>
            <Button disabled sx={modalButtonStyle} onClick={() => { handleLevelSelection(JlptLevel.N4) }}><LockIcon fontSize="small" />JLPT N4</Button>
            <Button disabled sx={modalButtonStyle} onClick={() => { handleLevelSelection(JlptLevel.N3) }}><LockIcon fontSize="small" />JLPT N3</Button>
            <Button disabled sx={modalButtonStyle} onClick={() => { handleLevelSelection(JlptLevel.N2) }}><LockIcon fontSize="small" />JLPT N2</Button>
            <Button disabled sx={modalButtonStyle} onClick={() => { handleLevelSelection(JlptLevel.N1) }}><LockIcon fontSize="small" />JLPT N1</Button>
          </div>
        </Box>
      </Modal>
    </>
  )
}

export default LevelSelector
