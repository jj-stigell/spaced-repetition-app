import React from 'react'

import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import { Radar } from 'react-chartjs-2'
import { useTranslation } from 'react-i18next'
import { Skeleton, Typography } from '@mui/material'

import { useAppSelector } from '../../app/hooks'
import { RootState } from '../../app/store'
import { JlptLevel, RadarChartPayload } from '../../types'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const mockFromBackEnd = [
  {
    label: 'kanji',
    value: 1
  },
  {
    label: 'kana',
    value: 2
  },
  {
    label: 'vocabulary',
    value: 3
  },
  {
    label: 'grammar',
    value: 4
  },
  {
    label: 'listening',
    value: 5
  },
  {
    label: 'reading',
    value: 10
  }
]

function RadarChart (): JSX.Element {
  const { t } = useTranslation()

  const [isLoading, setisLoading] = React.useState<boolean>(true)

  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  const data: RadarChartPayload[] = mockFromBackEnd
  const label: string = t('stats.radarChart.title', { level: jlptLevel })
  const labels: string[] = data.map((value: RadarChartPayload) => t(`stats.radarChart.labels.${value.label}`))
  const dataPoints: number[] = data.map((value: RadarChartPayload) => value.value)

  // Filter categories with lowest progress to give recommendation.
  const lowestValue: number = Math.min(...mockFromBackEnd.map(obj => obj.value))
  const objectsWithLowestValue: RadarChartPayload[] = mockFromBackEnd.filter(obj => obj.value === lowestValue)

  const chartData = {
    labels,
    datasets: [
      {
        label,
        data: dataPoints,
        backgroundColor: 'rgba(95, 250, 95, 0.2)', // Filling color for the area.
        borderColor: 'rgba(14, 176, 57, 1)',
        borderWidth: 1
      }
    ]
  }

  React.useEffect(() => {
    // Fecth from backend.
    setTimeout(() => {
      setisLoading(false)
    }, 4000)
  }, [jlptLevel])

  if (isLoading) {
    return (
      <Skeleton variant="rounded" height={200} />
    )
  }

  return (
    <>
      <Radar data={chartData} />
      <Typography sx={{ }}>
        { t('stats.radarChart.studyTip', { category: objectsWithLowestValue[0].label })}
      </Typography>
    </>
  )
}

export default RadarChart
