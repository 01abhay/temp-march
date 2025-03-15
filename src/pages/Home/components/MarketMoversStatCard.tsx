import { useNavigate } from 'react-router'
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

import type { Stock } from '../../../services/api'
import { Card, CardHeader, CardContent } from '../../../components/ui/base'

type MarketMoversStatCardProps = {
  title: string
  rows: Stock[]
  type: 'gainers' | 'losers' | 'most_active'
}

export default function MarketMoversStatCard(props: MarketMoversStatCardProps) {
  const { title, rows, type } = props
  const navigate = useNavigate()

  return (
    <Card sx={{ height: '100%', flexShrink: 0 }}>
      <CardHeader title={title} />
      <CardContent>
        <TableContainer>
          <Table size='small'>
            <TableBody>
              {rows.map(row => {
                const isPositive = row.change >= 0
                return (
                  <TableRow
                    key={row.id}
                    sx={{
                      '&:last-child td, &:last-child th': { border: 0 },
                      '&:hover': { backgroundColor: 'action.hover' },
                      cursor: 'pointer',
                    }}
                    onClick={() => navigate(`/stock/${row.id}`)}>
                    <TableCell component='th'>
                      <Typography variant='body2'>{row.name}</Typography>
                      <Typography variant='caption' color='text.secondary'>
                        {row.id}
                      </Typography>
                    </TableCell>
                    {(type === 'gainers' || type === 'losers') && (
                      <TableCell align='right'>
                        <Typography variant='body2'>{row.currentPrice}</Typography>
                        <Typography variant='caption' color={isPositive ? 'success' : 'error'}>
                          {isPositive ? (
                            <ArrowUpwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                          ) : (
                            <ArrowDownwardIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                          )}
                          {row.change} ({row.changePercent.toFixed(2)}%)
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
