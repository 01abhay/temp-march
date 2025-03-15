import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { ResponsiveContainer, LineChart, CartesianGrid, XAxis, YAxis, Line, Tooltip } from 'recharts'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'

import { getHistoricalData } from '../../../services/api'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

const frequencyOptions = ['1w', '1m', '1y', '5y'] as const
const freqOptionToFreqKey = { '1w': 'daily', '1m': 'weekly', '1y': 'monthly', '5y': 'yearly' } as const
const freqToDateFormatter = { '1w': 'MMM D, YYYY', '1m': 'DD MMM YYYY', '1y': 'MMM YYYY', '5y': 'YYYY' } as const

export function PriceChart({ symbol }: { symbol: string }) {
  const [frequency, setFrequency] = useState<(typeof frequencyOptions)[number]>(frequencyOptions[0])

  const { isPending, data, error } = useQuery({
    queryKey: ['historical-data', symbol],
    queryFn: () => getHistoricalData(symbol),
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <Card>
      <CardHeader
        title='Price Chart'
        action={
          <ButtonGroup variant='outlined'>
            {frequencyOptions.map(option => (
              <Button
                key={option}
                variant={frequency === option ? 'contained' : 'outlined'}
                onClick={() => setFrequency(option)}>
                {option}
              </Button>
            ))}
          </ButtonGroup>
        }
      />
      <CardContent sx={{ overflow: 'auto' }}>
        <ResponsiveContainer width='100%' height={400} minWidth={480}>
          <LineChart data={data[freqOptionToFreqKey[frequency]]}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey='date'
              textAnchor='end'
              angle={-45}
              height={80}
              tickFormatter={date => dayjs(date).format(freqToDateFormatter[frequency])}
            />
            <YAxis domain={['low', 'high']} />
            <Tooltip />
            <Line type='monotone' dataKey='close' stroke='#8884d8' />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
