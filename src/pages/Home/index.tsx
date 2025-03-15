import Stack from '@mui/material/Stack'

import IndexList from './components/IndexList'
import MarketMovementStats from './components/MarketMovementStats'

export default function Home() {
  return (
    <Stack spacing={{ xs: 1, md: 2 }}>
      <IndexList />

      <MarketMovementStats />
    </Stack>
  )
}
