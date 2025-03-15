import { useQuery } from '@tanstack/react-query'
import Grid from '@mui/material/Grid2'

import { getMarketMovement } from '../../../services/api'
import MarketMoversStatCard from './MarketMoversStatCard'

export default function MarketMovementStats() {
  const { isPending, data, error } = useQuery({
    queryKey: ['get.market-movement'],
    queryFn: getMarketMovement,
  })

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>

  const [topGainers, topLosers, mostActive] = [data.top_gainers, data.top_losers, data.most_actively_traded].map(rows =>
    rows.slice(0, 5)
  )

  return (
    <Grid container spacing={{ xs: 1, md: 2 }}>
      <Grid size={{ xs: 12, md: 4 }}>
        <MarketMoversStatCard title='Top Gainers' rows={topGainers} type='gainers' />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MarketMoversStatCard title='Top Losers' rows={topLosers} type='losers' />
      </Grid>
      <Grid size={{ xs: 12, md: 4 }}>
        <MarketMoversStatCard title='Most Active' rows={mostActive} type='most_active' />
      </Grid>
    </Grid>
  )
}
