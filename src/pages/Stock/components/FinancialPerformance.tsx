import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import ButtonGroup from '@mui/material/ButtonGroup'
import Button from '@mui/material/Button'

import { getFinancialData } from '../../../services/api'
import { formatCurrency } from '../../../utils'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

const durationOptions = ['quarterly', 'annual'] as const

export function FinancialPerformance({ symbol }: { symbol: string }) {
  const [duration, setDuration] = useState<(typeof durationOptions)[number]>(durationOptions[0])

  const { isPending, data, error } = useQuery({
    queryKey: ['financial-performance', symbol],
    queryFn: () => getFinancialData(symbol),
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <Card>
      <CardHeader
        title='Financial Performance'
        action={
          <ButtonGroup variant='outlined'>
            {durationOptions.map(option => (
              <Button
                key={option}
                variant={duration === option ? 'contained' : 'outlined'}
                onClick={() => setDuration(option)}>
                {option}
              </Button>
            ))}
          </ButtonGroup>
        }
      />
      <CardContent sx={{ overflow: 'auto' }}>
        <ResponsiveContainer width='100%' height={400}>
          <BarChart data={data[duration]}>
            <CartesianGrid strokeDasharray='3 3' />
            <XAxis
              dataKey={duration === 'quarterly' ? 'date' : 'year'}
              textAnchor='end'
              angle={-45}
              height={60}
              style={{ fontSize: '12px', overflow: 'hidden' }}
            />
            <YAxis style={{ fontSize: '12px', overflow: 'hidden' }} tickFormatter={formatCurrency} />
            <Tooltip cursor={{ fill: 'transparent' }} />
            <Bar dataKey='revenue' name='Revenue' maxBarSize={24} fill='#8884d8' />
            <Bar dataKey='netIncome' name='Net Income' maxBarSize={24} fill='#82ca9d' />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
