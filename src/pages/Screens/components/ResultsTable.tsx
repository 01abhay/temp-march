import { useState } from 'react'
import { useNavigate } from 'react-router'
import Box from '@mui/material/Box'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Paper from '@mui/material/Paper'
import TableSortLabel from '@mui/material/TableSortLabel'
import IconButton from '@mui/material/IconButton'
import Tooltip from '@mui/material/Tooltip'
import Pagination from '@mui/material/Pagination'
import NorthIcon from '@mui/icons-material/North'
import SouthIcon from '@mui/icons-material/South'
import VisibilityIcon from '@mui/icons-material/Visibility'

import { Stock } from '../../../services/api'
import { useScreenerStore } from '../store'

interface ResultsTableProps {
  stocks: Stock[]
}

function ResultsTable({ stocks }: ResultsTableProps) {
  const navigate = useNavigate()
  const { sortField, sortDirection, setSortField } = useScreenerStore()

  const [page, setPage] = useState(1)
  const rowsPerPage = 10

  const handleChangePage = (_: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage)
  }

  const handleSort = (field: keyof Stock) => {
    setSortField(field)
  }

  const handleViewStock = (stockId: string) => {
    navigate(`/stock/${stockId}`)
  }

  const startIndex = (page - 1) * rowsPerPage
  const endIndex = startIndex + rowsPerPage
  const displayedStocks = stocks.slice(startIndex, endIndex)
  const totalPages = Math.ceil(stocks.length / rowsPerPage)

  return (
    <Box>
      <TableContainer component={Paper} variant='outlined'>
        <Table size='small'>
          <TableHead>
            <TableRow>
              <TableCell>
                <TableSortLabel
                  active={sortField === 'name'}
                  direction={sortField === 'name' ? sortDirection : 'asc'}
                  onClick={() => handleSort('name')}>
                  Name
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={sortField === 'currentPrice'}
                  direction={sortField === 'currentPrice' ? sortDirection : 'asc'}
                  onClick={() => handleSort('currentPrice')}>
                  Price
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={sortField === 'changePercent'}
                  direction={sortField === 'changePercent' ? sortDirection : 'asc'}
                  onClick={() => handleSort('changePercent')}>
                  Change %
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={sortField === 'pe'}
                  direction={sortField === 'pe' ? sortDirection : 'asc'}
                  onClick={() => handleSort('pe')}>
                  P/E
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={sortField === 'marketCap'}
                  direction={sortField === 'marketCap' ? sortDirection : 'asc'}
                  onClick={() => handleSort('marketCap')}>
                  Market Cap
                </TableSortLabel>
              </TableCell>
              <TableCell align='right'>
                <TableSortLabel
                  active={sortField === 'sector'}
                  direction={sortField === 'sector' ? sortDirection : 'asc'}
                  onClick={() => handleSort('sector')}>
                  Sector
                </TableSortLabel>
              </TableCell>
              <TableCell align='center'>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedStocks.map(stock => (
              <TableRow key={stock.id}>
                <TableCell>{stock.name}</TableCell>
                <TableCell align='right'>{stock.currentPrice}</TableCell>
                <TableCell align='right' sx={{ color: stock.changePercent > 0 ? 'success.main' : 'error.main' }}>
                  {stock.changePercent > 0 ? (
                    <NorthIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                  ) : (
                    <SouthIcon sx={{ fontSize: 'inherit', verticalAlign: 'middle', mr: 0.5 }} />
                  )}
                  {stock.changePercent}%
                </TableCell>
                <TableCell align='right'>{stock.pe}</TableCell>
                <TableCell align='right'>{stock.marketCap.toLocaleString()}</TableCell>
                <TableCell align='right'>{stock.sector}</TableCell>
                <TableCell align='center'>
                  <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                    <Tooltip title='View details'>
                      <IconButton size='small' onClick={() => handleViewStock(stock.id)}>
                        <VisibilityIcon fontSize='small' />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination count={totalPages} page={page} onChange={handleChangePage} color='primary' />
        </Box>
      )}
    </Box>
  )
}

export default ResultsTable
