import { useQuery } from '@tanstack/react-query'
import Stack from '@mui/material/Stack'

import { getIndices } from '../../../services/api'
import IndexStatCard, { IndexStatCardSkeleton } from './IndexStatCard'

export default function IndexList() {
  const { isPending, data, error } = useQuery({
    queryKey: ['get.indices'],
    queryFn: getIndices,
  })

  if (error) return <div>Error: {error.message}</div>
  return (
    <Stack
      direction='row'
      spacing={{ xs: 1, md: 2 }}
      alignItems='flex-start'
      sx={theme => ({ overflowX: 'auto', m: `${theme.spacing(-1)} !important`, p: 1 })}>
      {isPending
        ? Array.from({ length: 3 }).map((_, index) => <IndexStatCardSkeleton key={index} />)
        : data.map(index => (
            <IndexStatCard
              key={index.title}
              title={index.title}
              change={index.change}
              changeInPercent={index.changeInPercent}
              value={index.value}
            />
          ))}
    </Stack>
  )
}
