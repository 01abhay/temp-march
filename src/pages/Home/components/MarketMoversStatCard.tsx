import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import Skeleton from '@mui/material/Skeleton'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import CachedIcon from '@mui/icons-material/Cached'

import type { MarketMovementResponse } from '../../../services/api'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

type MarketMoversStatCardProps = {
  title: string
  rows: MarketMovementResponse['top_gainers']
  type: 'gainers' | 'losers' | 'most_active'
}

export default function MarketMoversStatCard(props: MarketMoversStatCardProps) {
  const { title, rows, type } = props

  return (
    <Card sx={{ flexShrink: 0 }}>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {rows.map(row => {
                const isPositive = row.change_amount > 0
                return (
                  <TableRow key={row.ticker} sx={{ '&:last-child td, &:last-child th': { border: 0 } }}>
                    <TableCell component='th'>
                      <Typography variant='body2'>{row.company_name}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {row.ticker}
                      </Typography>
                    </TableCell>
                    {(type === 'gainers' || type === 'losers') && (
                      <TableCell align='right'>
                        <Typography variant='body2'>{row.price}</Typography>
                        <Typography variant='caption' color={isPositive ? 'success' : 'error'}>
                          {isPositive ? (
                            <ArrowUpwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                          )}
                          {row.change_amount} ({row.change_percentage.toFixed(2)}%)
                        </Typography>
                      </TableCell>
                    )}
                    {type === 'most_active' && (
                      <TableCell align='right'>
                        <Typography variant='body2' color='info'>
                          <CachedIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                          {row.volume}
                        </Typography>
                      </TableCell>
                    )}
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}

export function MarketMoversStatCardSkeleton() {
  return (
    <Card sx={{ flexShrink: 0 }}>
      <CardHeader title={<Skeleton variant='text' width={160} height={28} />} />
      <CardContent>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton variant='text' width={160} height={28} />
                  </TableCell>
                  <TableCell>
                    <Skeleton variant='text' width={80} height={28} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  )
}
