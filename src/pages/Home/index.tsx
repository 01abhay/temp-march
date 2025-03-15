import Stack from '@mui/material/Stack'

import IndexStatCard from './components/IndexStatCard'

export default function Home() {
  return (
    <Stack direction='row' spacing={2} alignItems='flex-start' sx={{ overflowX: 'auto', m: -1, p: 1 }}>
      <IndexStatCard title='Nasdaq Composite' change={451.08} changeInPercent={2.61} value={17754.09} />
      <IndexStatCard title='S&P 500' change={451.08} changeInPercent={2.61} value={17754.09} />
      <IndexStatCard title='Dow Jones Industrial Average' change={451.08} changeInPercent={2.61} value={17754.09} />
    </Stack>
  )
}
