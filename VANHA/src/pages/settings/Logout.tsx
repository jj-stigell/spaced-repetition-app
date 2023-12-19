import React from 'react'

// Third party imports
import Button from '@mui/material/Button'
import { useTranslation } from 'react-i18next'

// Project imports
import { useAppDispatch } from '../../app/hooks'
import { logout } from '../../config/api'
import { resetAccount } from '../../features/accountSlice'
import axios from '../../lib/axios'
import { resetDecks } from '../../features/deckSlice'
import { resetCategories } from '../../features/categorySlice'

function Logout (): JSX.Element {
  const dispatch = useAppDispatch()
  const { t } = useTranslation()

  const handleLogout = (): void => {
    axios.post(logout)
      .finally(function () {
        dispatch(resetAccount())
        dispatch(resetDecks())
        dispatch(resetCategories())
      })
  }

  return (
    <Button
      type="submit"
      fullWidth
      variant="contained"
      onClick={handleLogout}
      sx={{ mt: 3, mb: 2 }}
    >
      {t('buttonGeneral.logout')}
    </Button>
  )
}

export default Logout
