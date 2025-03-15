import Typography from '@mui/material/Typography'

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
  const subheader = `${change} (${changeInPercent}%)`
  return (
    <Card sx={{ flexShrink: 0 }}>
      <CardHeader
        title={title}
        subheader={subheader}
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
