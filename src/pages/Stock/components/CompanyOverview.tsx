import Stack from '@mui/material/Stack'
import Grid from '@mui/material/Grid2'
import Typography from '@mui/material/Typography'
import CorporateFareIcon from '@mui/icons-material/CorporateFare'

import type { Stock } from '../../../services/api'
import { formatCurrency } from '../../../utils'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

export function CompanyOverview({ data }: { data: Stock }) {
  return (
    <Card>
      <CardHeader avatar={<CorporateFareIcon />} title={data.name} subheader={data.industry} />
      <CardContent>
        <Stack direction='row' spacing={2} alignItems='flex-end'>
          <Typography variant='h2'>{formatCurrency(data.currentPrice)}</Typography>
          <Typography variant='caption' color={data.change >= 0 ? 'success' : 'error'}>
            {formatCurrency(data.change)} ({data.changePercent.toFixed(2)}%)
          </Typography>
        </Stack>

        <Typography variant='body1' sx={{ mt: 3, mb: 2 }}>
          {data.description}
        </Typography>

        <Grid container spacing={2}>
          {[
            { label: 'Market Cap', value: formatCurrency(data.marketCap) },
            { label: 'PE Ratio', value: data.pe },
            { label: '52 Week Range', value: `${formatCurrency(data.yearLow)} - ${formatCurrency(data.yearHigh)}` },
          ].map(item => (
            <Grid size={{ xs: 12, md: 4 }} key={item.label}>
              <Stack direction='row' alignItems='center' justifyContent='space-between'>
                <Typography variant='h6'>{item.label}</Typography>
                <Typography variant='body2'>{item.value}</Typography>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </CardContent>
    </Card>
  )
}
