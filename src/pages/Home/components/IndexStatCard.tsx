import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'

import { Card, CardHeader, CardContent } from '../../../components/ui/base'

type IndexStatCardProps = {
  title: string
  change: number
  changeInPercent: number
  value: number
}

export default function IndexStatCard(props: IndexStatCardProps) {
  const { title, change, changeInPercent, value } = props

  const isPositive = change > 0
  return (
    <Card sx={{ flexShrink: 0 }}>
      <CardHeader
        title={title}
        subheader={
          <>
            {isPositive ? (
              <ArrowUpwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
            ) : (
              <ArrowDownwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
            )}
            {`${change} (${changeInPercent}%)`}
          </>
        }
        slotProps={{ subheader: { sx: { color: isPositive ? 'green' : 'red' } } }}
      />
      <CardContent>
        <Typography variant='h3' align='center'>
          {value}
        </Typography>
      </CardContent>
    </Card>
  )
}

export function IndexStatCardSkeleton() {
  return (
    <Card sx={{ flexShrink: 0 }}>
      <CardHeader title={<Skeleton variant='text' width={160} height={28} />} />
      <CardContent>
        <Skeleton variant='text' width={160} height={28} />
        <Skeleton variant='text' width={160} height={28} />
      </CardContent>
    </Card>
  )
}
