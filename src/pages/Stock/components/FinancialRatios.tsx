import { useMemo } from 'react'
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'

import { type Stock } from '../../../services/api'
import { formatCurrency } from '../../../utils'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

export function FinancialRatios({ stock }: { stock: Stock }) {
  const financialRatios = useMemo(
    () => [
      { label: 'PE Ratio', value: stock.pe },
      { label: 'EPS', value: stock.eps },
      { label: 'Beta', value: stock.beta },
      { label: 'Dividend', value: formatCurrency(stock.dividend) },
      { label: 'Dividend Yield', value: stock.dividendYield + '%' },
    ],
    [stock]
  )

  return (
    <Card>
      <CardHeader title='Financial Ratios' />
      <CardContent sx={{ overflow: 'auto' }}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 5 }}>
            <Grid container spacing={2}>
              {financialRatios.map(item => (
                <Grid size={{ xs: 12 }} key={item.label}>
                  <Stack direction='row' alignItems='center' justifyContent='space-between'>
                    <Typography variant='h6'>{item.label}</Typography>
                    <Typography variant='body2'>{item.value}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid size={{ xs: 12, md: 7 }}>
            <ResponsiveContainer width='100%' height={400}>
              <BarChart data={financialRatios}>
                <CartesianGrid strokeDasharray='3 3' />
                <XAxis
                  dataKey='label'
                  textAnchor='end'
                  angle={-45}
                  height={60}
                  style={{ fontSize: '12px', overflow: 'hidden' }}
                />
                <YAxis dataKey='value' style={{ fontSize: '12px', overflow: 'hidden' }} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey='value' name='Change' maxBarSize={24} fill='#8884d8' />
              </BarChart>
            </ResponsiveContainer>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}
