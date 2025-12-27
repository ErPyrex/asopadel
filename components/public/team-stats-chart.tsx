'use client'

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

interface TeamStatsChartProps {
  stats: {
    name: string
    value: number
  }[]
}

export function TeamStatsChart({ stats }: TeamStatsChartProps) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={stats}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          allowDecimals={false}
        />
        <Tooltip
          contentStyle={{
            background: '#fff',
            border: '1px solid #ccc',
            borderRadius: '4px',
          }}
          cursor={{ fill: 'transparent' }}
        />
        <Bar
          dataKey="value"
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
          barSize={50}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
