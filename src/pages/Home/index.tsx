import Stack from '@mui/material/Stack'

import IndexList from './components/IndexList'
import MarketMovementStats from './components/MarketMovementStats'
import SectorWiseStatsVisualization from './components/SectorWiseStatsVisualization'

export default function Home() {
  return (
    <Stack spacing={{ xs: 1, md: 2 }}>
      <IndexList />

      <MarketMovementStats />

      <SectorWiseStatsVisualization />
    </Stack>
  )
}
