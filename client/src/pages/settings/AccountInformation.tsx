import * as React from 'react'

// Third party imports
import { Box, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import LanguageSelector from '../../components/LanguageSelector'

function AccountInformation (): JSX.Element {
  const { username, email, role } = useAppSelector((state: RootState) => state.account.account)
  const { t } = useTranslation()

  return (
    <>
      <h2>{t('pages.settings.accountInformation.title')}</h2>
      <Box>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.username')}: {username}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.email')}: {email}
        </Typography>
        <Typography variant="body1" color="text.primary">
          {t('pages.settings.accountInformation.memberStatus')}: {role === 'NON_MEMBER'
            ? t('pages.settings.accountInformation.expired') + ' 😅'
            : t('pages.settings.accountInformation.active') + ' 😊'}
        </Typography>
        <Typography sx={{ pt: 2 }}>{t('pages.settings.accountInformation.languageSelectorTitle')}</Typography>
        <LanguageSelector callApi={true}/>
      </Box>
    </>
  )
}

export default AccountInformation
