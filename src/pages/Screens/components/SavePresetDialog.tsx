import { useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Alert from '@mui/material/Alert'

import { useScreenerStore } from '../store'

interface SavePresetDialogProps {
  open: boolean
  onClose: () => void
}

function SavePresetDialog({ open, onClose }: SavePresetDialogProps) {
  const { activeFilters, addPreset } = useScreenerStore()

  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSave = () => {
    if (!name.trim()) {
      setError('Please enter a name for the preset')
      return
    }

    if (activeFilters.length === 0) {
      setError('No filters to save. Please add at least one filter.')
      return
    }

    addPreset(name.trim(), description.trim(), activeFilters)
    handleClose()
  }

  const handleClose = () => {
    setName('')
    setDescription('')
    setError(null)
    onClose()
  }

  return (
    <Dialog open={open} onClose={handleClose} maxWidth='sm' fullWidth>
      <DialogTitle>Save Filter Preset</DialogTitle>
      <DialogContent>
        {error && (
          <Alert severity='error' sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <TextField
          autoFocus
          margin='dense'
          label='Preset Name'
          fullWidth
          value={name}
          onChange={e => setName(e.target.value)}
          sx={{ mb: 2 }}
        />

        <TextField
          margin='dense'
          label='Description (optional)'
          fullWidth
          multiline
          rows={3}
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSave} variant='contained'>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default SavePresetDialog
