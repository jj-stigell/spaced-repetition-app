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
import { mockRadarData } from '../../mockData'

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

function RadarChart (): JSX.Element {
  const { t } = useTranslation()
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isLoading, setisLoading] = React.useState<boolean>(false)
  const jlptLevel: JlptLevel = useAppSelector((state: RootState) => state.account.account.jlptLevel)

  const data: RadarChartPayload[] = mockRadarData
  const label: string = t('stats.radarChart.title', { level: jlptLevel })
  const labels: string[] = data.map((value: RadarChartPayload) => t(`stats.radarChart.labels.${value.label}`))
  const dataPoints: number[] = data.map((value: RadarChartPayload) => value.value)

  // Filter categories with lowest progress to give recommendation.
  const lowestValue: number = Math.min(...data.map(obj => obj.value))
  const objectsWithLowestValue: RadarChartPayload[] = data.filter(obj => obj.value === lowestValue)

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

  if (isLoading) {
    return (
      <Skeleton variant="rounded" height={200} />
    )
  }

  return (
    <>
      <Radar data={chartData} />
      <Typography sx={{ mt: 2 }}>
        { t('stats.radarChart.studyTip', { category: objectsWithLowestValue[0].label })}
      </Typography>
    </>
  )
}

export default RadarChart
