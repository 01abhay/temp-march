import React, { useEffect, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { DndContext } from '@dnd-kit/core'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import Typography from '@mui/material/Typography'
import AddIcon from '@mui/icons-material/Add'
import EditIcon from '@mui/icons-material/Edit'
import DeleteIcon from '@mui/icons-material/Delete'
import AddchartIcon from '@mui/icons-material/Addchart'

import { type Watchlist, getWatchlist, deleteWatchlist } from '../../services/api'

import StocksTable from './components/StocksTable'
import WatchlistFormModal from './components/WatchlistFormModal'
import AddStockFormModal from './components/AddStockFormModal'

export default function Watchlists() {
  const { isPending, data, error } = useQuery({
    queryKey: ['watchlists'],
    queryFn: () => getWatchlist(),
  })

  const [open, setOpen] = useState(false)

  const [value, setValue] = useState<number>(-1)
  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue)
  }

  useEffect(() => {
    if (value === -1 && data && data.length) setValue(data[0].id)
  }, [data, value])

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  if (!data || !data.length)
    return (
      <Stack direction='row' spacing={2} alignItems='center' justifyContent='center'>
        <Typography variant='body1'>No watchlists found, please create one</Typography>
        <Button
          variant='outlined'
          size='small'
          color='primary'
          startIcon={<AddchartIcon />}
          onClick={() => setOpen(true)}>
          Create Watchlist
        </Button>
        <WatchlistFormModal open={open} onClose={() => setOpen(false)} />
      </Stack>
    )
  return (
    <Box sx={{ width: '100%', typography: 'body1' }}>
      <TabContext value={value}>
        <Stack direction='row' spacing={2} alignItems='center' justifyContent='space-between'>
          <TabList onChange={handleChange} variant='scrollable' scrollButtons='auto'>
            {data.map(watchlist => (
              <Tab key={watchlist.id} label={watchlist.name} value={watchlist.id} />
            ))}
          </TabList>

          <IconButton size='small' onClick={() => setOpen(true)}>
            <AddIcon />
          </IconButton>
          <WatchlistFormModal open={open} onClose={() => setOpen(false)} />
        </Stack>

        {data.map(watchlist => (
          <TabPanel key={watchlist.id} value={watchlist.id}>
            <DndContext>
              <Watchlist watchlist={watchlist} />
            </DndContext>
          </TabPanel>
        ))}
      </TabContext>
    </Box>
  )
}

function Watchlist({ watchlist }: { watchlist: Watchlist }) {
  const queryClient = useQueryClient()

  const [openStockForm, setOpenStockForm] = useState(false)
  const [openWatchlistForm, setOpenWatchlistForm] = useState(false)

  const deleteWatchlistMutation = useMutation({
    mutationFn: (id: number) => deleteWatchlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['watchlists'] })
    },
  })

  return (
    <>
      <StocksTable watchlistId={watchlist.id} stocks={watchlist.stocks} />

      <Stack direction='row' spacing={2} alignItems='center' justifyContent='flex-end' sx={{ mt: 2 }}>
        <Button
          variant='outlined'
          size='small'
          color='primary'
          startIcon={<AddchartIcon />}
          onClick={() => setOpenStockForm(true)}>
          Add Stock
        </Button>
        <AddStockFormModal open={openStockForm} onClose={() => setOpenStockForm(false)} watchlistId={watchlist.id} />

        <IconButton size='small' onClick={() => setOpenWatchlistForm(true)}>
          <EditIcon />
        </IconButton>
        <WatchlistFormModal
          open={openWatchlistForm}
          onClose={() => setOpenWatchlistForm(false)}
          initialValues={{ id: watchlist.id, name: watchlist.name }}
        />

        <IconButton
          size='small'
          color='error'
          onClick={() => deleteWatchlistMutation.mutate(watchlist.id)}
          disabled={deleteWatchlistMutation.isPending}>
          <DeleteIcon />
        </IconButton>
      </Stack>
    </>
  )
}
