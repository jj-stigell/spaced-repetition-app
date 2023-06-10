import * as React from 'react'

import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import { useTranslation } from 'react-i18next'
import { TextField } from '@mui/material'
import { RootState } from '../app/store'
import { useAppSelector } from '../app/hooks'
import { useDispatch } from 'react-redux'

import { setLanguage } from '../features/accountSlice'
import axios from '../lib/axios'
import { changeSettings } from '../config/api'
import { resetCards } from '../features/cardSlice'
import { resetCategories } from '../features/categorySlice'
import { resetDecks } from '../features/deckSlice'

const languages = [
  { code: 'en', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fi', nativeName: 'Suomeksi', flag: '🇫🇮' }
]

function LanguageSelector ({ callApi = false }: { callApi?: boolean }): JSX.Element {
  const { t, i18n } = useTranslation()
  const dispatch = useDispatch()
  const language: string = useAppSelector((state: RootState) => state.account.account.language).toLocaleLowerCase()
  const [lang, setLang] = React.useState<string>(language)

  React.useEffect(() => {
    void i18n.changeLanguage(lang)
    dispatch(setLanguage(lang.toUpperCase()))
    if (callApi) {
      void axios.patch(changeSettings, { language: lang })
      dispatch(resetCards())
      dispatch(resetDecks())
      dispatch(resetCategories())
    }
  }, [lang])

  return (
    <Box sx={{ minWidth: 120 }}>
      <TextField
        id="select-ui-language"
        select
        helperText={t('pages.settings.accountInformation.languageSelectorInfo')}
        defaultValue={language}
        onChange={(e) => { setLang(e.target.value) }}
      >
        {languages.map((language) => (
          <MenuItem key={language.code} value={language.code}>
            {language.flag + ' ' + language.nativeName}
          </MenuItem>
        ))}
      </TextField>
    </Box>
  )
}

export default LanguageSelector
