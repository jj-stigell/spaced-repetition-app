import * as React from 'react'

import Box from '@mui/material/Box'
import MenuItem from '@mui/material/MenuItem'
import FormControl from '@mui/material/FormControl'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import { useTranslation } from 'react-i18next'

const languages = [
  { code: 'en', nativeName: 'English', flag: '🇬🇧' },
  { code: 'fi', nativeName: 'Suomeksi', flag: '🇫🇮' }
]

function LanguageSelector (): JSX.Element {
  const { i18n } = useTranslation()

  const [language, setLanguage] = React.useState<string>('')

  const handleChange = (event: SelectChangeEvent): void => {
    setLanguage(event.target.value)
  }

  React.useEffect(() => {
    void i18n.changeLanguage(language)
  }, [language])

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <Select
          labelId="select-ui-language-label"
          id="select-ui-language"
          value={language}
          label="language"
          onChange={handleChange}
        >
          <MenuItem value={languages[0].code}>{ languages[0].flag + ' ' + languages[0].nativeName}</MenuItem>
          <MenuItem value={languages[1].code}>{ languages[1].flag + ' ' + languages[1].nativeName}</MenuItem>
        </Select>
      </FormControl>
    </Box>
  )
}

export default LanguageSelector
