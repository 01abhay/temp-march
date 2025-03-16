import { useParams } from 'react-router'
import { useQuery } from '@tanstack/react-query'
import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid2'

import { getStock } from '../../services/api'
import { CompanyOverview } from './components/CompanyOverview'
import { PriceChart } from './components/PriceChart'
import { FinancialRatios } from './components/FinancialRatios'
import { FinancialPerformance } from './components/FinancialPerformance'

export default function Stock() {
  const { symbol } = useParams()

  const { isPending, data, error } = useQuery({
    queryKey: ['stock', symbol],
    queryFn: () => getStock(symbol as string),
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <Stack spacing={2}>
      <CompanyOverview data={data} />

      <PriceChart symbol={symbol!} />

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 6 }}>
          <FinancialRatios stock={data} />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <FinancialPerformance symbol={symbol!} />
        </Grid>
      </Grid>
    </Stack>
  )
}
