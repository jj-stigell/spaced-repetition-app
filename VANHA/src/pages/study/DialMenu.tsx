import React from 'react'

import { styled } from '@mui/material/styles'
import Box from '@mui/material/Box'
import SpeedDial from '@mui/material/SpeedDial'
import SpeedDialIcon from '@mui/material/SpeedDialIcon'
import SpeedDialAction from '@mui/material/SpeedDialAction'
import BugReportIcon from '@mui/icons-material/BugReport'
import ExitToAppIcon from '@mui/icons-material/ExitToApp'
import SettingsIcon from '@mui/icons-material/Settings'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { RootState } from '../../app/store'
import { useAppSelector } from '../../app/hooks'
import BugReportModal from './BugReportModal'
import SettingsModal from './SettingsModal'

const StyledSpeedDial = styled(SpeedDial)(({ theme }) => ({
  position: 'absolute',
  '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
    bottom: theme.spacing(2),
    right: theme.spacing(2)
  },
  '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
    top: theme.spacing(2),
    left: theme.spacing(2)
  }
}))

function DialMenu (): JSX.Element {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const [showBugModal, setShowBugModal] = React.useState<boolean>(false)
  const [showSettingsModal, setShowSettingsModal] = React.useState<boolean>(false)

  const category: string = useAppSelector((state: RootState) => state.deck.category)?.toLowerCase() as string
  const cardId: number | undefined = useAppSelector((state: RootState) => state.card.activeCard?.id)

  return (
    <Box sx={{ transform: 'translateZ(0px)', flexGrow: 1 }}>
      <Box sx={{ position: 'relative', mt: 2, height: 10 }}>
        <StyledSpeedDial
          ariaLabel="SpeedDial playground example"
          icon={<SpeedDialIcon />}
          direction="down"
        >
          <SpeedDialAction
            icon={<SettingsIcon />}
            tooltipTitle={t('pages.review.view.dialMenu.settings')}
            onClick={() => { setShowSettingsModal(true) }}
          />
          <SpeedDialAction
            icon={<BugReportIcon />}
            tooltipTitle={t('pages.review.view.dialMenu.bugReport')}
            onClick={() => { setShowBugModal(true) }}
          />
          <SpeedDialAction
            icon={<ExitToAppIcon />}
            tooltipTitle={t('pages.review.view.dialMenu.backToDeck')}
            onClick={() => { navigate(`/study/decks/${category}`) }}
          />
        </StyledSpeedDial>
      </Box>
      <BugReportModal cardId={cardId} open={showBugModal} setOpen={setShowBugModal} />
      <SettingsModal open={showSettingsModal} setOpen={setShowSettingsModal} />
    </Box>
  )
}

export default DialMenu
