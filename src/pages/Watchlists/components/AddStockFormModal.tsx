import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import Modal from '@mui/material/Modal'
import Button from '@mui/material/Button'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

import { getStocks, addStockToWatchlist } from '../../../services/api'

export default function AddStockFormModal(props: { open: boolean; onClose: () => void; watchlistId: number }) {
  const { open, onClose, watchlistId } = props

  const queryClient = useQueryClient()

  const [symbol, setSymbol] = useState('')

  const stocksQuery = useQuery({
    queryKey: ['get.stocks'],
    queryFn: () => getStocks({}),
  })

  const addStockToWatchlistMutation = useMutation({
    mutationFn: (symbol: string) => addStockToWatchlist(watchlistId, symbol),
    onSuccess: () => {
      setSymbol('')
      onClose()
      queryClient.invalidateQueries({ queryKey: ['watchlists'] })
    },
  })

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CardHeader title='Add Stock to Watchlist' />
          <CardContent>
            <Select label='Name' value={symbol} onChange={e => setSymbol(e.target.value)} fullWidth>
              {stocksQuery.data?.map(stock => (
                <MenuItem key={stock.id} value={stock.id}>
                  {stock.name}
                </MenuItem>
              ))}
            </Select>
          </CardContent>
          <CardActions>
            <Button
              variant='contained'
              color='primary'
              onClick={() => addStockToWatchlistMutation.mutate(symbol)}
              disabled={addStockToWatchlistMutation.isPending}>
              Add
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  )
}
