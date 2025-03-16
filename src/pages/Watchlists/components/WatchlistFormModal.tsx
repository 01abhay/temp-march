import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import Button from '@mui/material/Button'
import Modal from '@mui/material/Modal'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import CardContent from '@mui/material/CardContent'
import CardActions from '@mui/material/CardActions'

import { createWatchlist, updateWatchlist } from '../../../services/api'
import TextField from '@mui/material/TextField'

export default function WatchlistFormModal(props: {
  open: boolean
  onClose: () => void
  initialValues?: { id: number; name: string }
}) {
  const { open, onClose, initialValues } = props

  const queryClient = useQueryClient()

  const [name, setName] = useState(initialValues?.name || '')

  const createWatchlistMutation = useMutation({
    mutationFn: (name: string) => createWatchlist(name),
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['watchlists'] })
    },
  })

  const updateWatchlistMutation = useMutation({
    mutationFn: (name: string) => updateWatchlist(initialValues!.id, { name }),
    onSuccess: () => {
      onClose()
      queryClient.invalidateQueries({ queryKey: ['watchlists'] })
    },
  })

  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Card sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
          <CardHeader title='Create Watchlist' />
          <CardContent>
            <TextField label='Name' value={name} onChange={e => setName(e.target.value)} />
          </CardContent>
          <CardActions>
            <Button
              variant='contained'
              color='primary'
              onClick={() => {
                if (initialValues) {
                  updateWatchlistMutation.mutate(name)
                } else {
                  createWatchlistMutation.mutate(name)
                }
              }}
              disabled={createWatchlistMutation.isPending || updateWatchlistMutation.isPending}>
              {initialValues ? 'Update' : 'Create'}
            </Button>
          </CardActions>
        </Card>
      </Modal>
    </>
  )
}
