import React from 'react';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

export const data = {
  labels: ['Kanji', 'Vocabulary', 'Grammar', 'Listening', 'Kana', 'Reading'],
  datasets: [
    {
      label: 'JLPT N5 Learning status',
      data: [7, 10, 7, 6, 9, 4],
      backgroundColor: 'rgba(255, 99, 132, 0.2)',
      borderColor: 'rgba(255, 99, 132, 1)',
      borderWidth: 1,
    },
    {
      label: 'JLPT N5 Ready Goal',
      data: [9, 9, 8, 7, 10, 7],
      backgroundColor: 'rgba(25, 239, 45, 0.2)',
      borderColor: 'rgba(25, 239, 45, 1)',
      borderWidth: 1,
    },
  ],
};

export default function RadarChart() {
  return (
    <Radar data={data} />
  );
}
