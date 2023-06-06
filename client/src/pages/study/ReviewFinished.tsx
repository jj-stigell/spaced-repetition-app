import React from 'react'

// Third party imports
import { Container, Typography } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { Link, useNavigate } from 'react-router-dom'

// Project imports
import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { constants } from '../../config/constants'
import { DeckCategory, Role } from '../../types'

function ReviewFinished (): JSX.Element {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [count, setCount] = React.useState<number>(constants.redirectTimeout)
  const { role } = useAppSelector((state: RootState) => state.account.account)
  const category = useAppSelector((state: RootState) => state.deck.category) as DeckCategory

  React.useEffect(() => {
    if (count === 0) {
      navigate(`/study/decks/${category.toLowerCase()}`)
    } else {
      setTimeout(() => {
        setCount(count - 1)
      }, 1000000)
    }
  }, [count])

  return (
    <div id="study-page-card" style={{
      height: '100vh',
      textAlign: 'center',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <Container maxWidth="sm">
        <Typography variant='h4' sx={{ marginBottom: 3 }}>
          {t('pages.review.reviewFinished.title')}
        </Typography>
        { role === Role.MEMBER && (
          <div style={{
            width: '320px',
            height: '250px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid black',
            marginLeft: 'auto',
            marginRight: 'auto',
            marginBottom: 45
          }}>
            <div style={{ fontSize: '20px', textAlign: 'center' }}>
              Advertisement placeholder
            </div>
          </div>
        )}
        <Typography variant='h5' sx={{ marginBottom: 3 }}>
          {t('pages.review.reviewFinished.redirectMessage', { count })}
        </Typography>
      { role !== Role.NON_MEMBER && (
        <>
          <p>
            {t('pages.review.reviewFinished.redirectImmediately')}
          </p>
          <Link to={`/study/decks/${category.toLowerCase()}`}>
            {t('pages.review.reviewFinished.redirectLink')}
          </Link>
        </>
      )}
      </Container>
    </div>
  )
}

export default ReviewFinished
