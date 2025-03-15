import { useQuery } from '@tanstack/react-query'
import Stack from '@mui/material/Stack'

import { getIndices } from '../../../services/api'
import IndexStatCard from './IndexStatCard'

export default function IndexList() {
  const { isPending, data, error } = useQuery({
    queryKey: ['get.indices'],
    queryFn: getIndices,
  })

  console.log(data)

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <Stack
      direction='row'
      spacing={{ xs: 1, md: 2 }}
      alignItems='flex-start'
      sx={theme => ({ overflowX: 'auto', m: `${theme.spacing(-1)} !important`, p: 1 })}>
      {data.map(index => (
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
