import { useState } from 'react'
import Box from '@mui/material/Box'
import Button from '@mui/material/Button'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import TextField from '@mui/material/TextField'
import IconButton from '@mui/material/IconButton'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import { Stock } from '../../../services/api'
import screenerPresets from '../../../data/screener-presets.json'
import { useScreenerStore } from '../store'

// Available metrics from the presets data
const availableMetrics = screenerPresets.availableMetrics

// Available operators
const operators = [
  { value: 'gt', label: '>' },
  { value: 'lt', label: '<' },
  { value: 'eq', label: '=' },
  { value: 'gte', label: '>=' },
  { value: 'lte', label: '<=' },
  { value: 'contains', label: 'Contains' },
]

function FilterPanel() {
  const { activeFilters, addFilter, updateFilter, removeFilter } = useScreenerStore()

  const [newField, setNewField] = useState<keyof Stock | ''>('')
  const [newOperator, setNewOperator] = useState<'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains'>('gt')
  const [newValue, setNewValue] = useState<string>('')

  const handleAddFilter = () => {
    if (newField && newValue) {
      addFilter({
        id: Date.now().toString(),
        field: newField as keyof Stock,
        operator: newOperator,
        value: newValue,
      })

      // Reset form
      setNewField('')
      setNewOperator('gt')
      setNewValue('')
    }
  }

  const handleUpdateFilterField = (id: string, event: SelectChangeEvent) => {
    updateFilter(id, { field: event.target.value as keyof Stock })
  }

  const handleUpdateFilterOperator = (id: string, event: SelectChangeEvent) => {
    updateFilter(id, {
      operator: event.target.value as 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains',
    })
  }

  const handleUpdateFilterValue = (id: string, event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    updateFilter(id, { value: event.target.value })
  }

  return (
    <Box>
      {activeFilters.length > 0 ? (
        <Stack spacing={2} divider={<Divider flexItem />}>
          {activeFilters.map(filter => (
            <Box key={filter.id}>
              <Stack direction='row' spacing={1} alignItems='center'>
                <FormControl size='small' sx={{ minWidth: 120 }}>
                  <InputLabel>Field</InputLabel>
                  <Select value={filter.field} label='Field' onChange={e => handleUpdateFilterField(filter.id, e)}>
                    {availableMetrics.map(metric => (
                      <MenuItem key={metric.id} value={metric.id}>
                        {metric.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size='small' sx={{ minWidth: 100 }}>
                  <InputLabel>Operator</InputLabel>
                  <Select
                    value={filter.operator}
                    label='Operator'
                    onChange={e => handleUpdateFilterOperator(filter.id, e)}>
                    {operators.map(op => (
                      <MenuItem key={op.value} value={op.value}>
                        {op.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size='small'
                  label='Value'
                  value={filter.value}
                  onChange={e => handleUpdateFilterValue(filter.id, e)}
                  sx={{ flexGrow: 1 }}
                />

                <IconButton color='error' onClick={() => removeFilter(filter.id)} size='small'>
                  <DeleteIcon />
                </IconButton>
              </Stack>
            </Box>
          ))}
        </Stack>
      ) : (
        <Typography variant='body2' color='text.secondary' sx={{ mb: 2, textAlign: 'center' }}>
          No filters applied. Add a filter to start screening stocks.
        </Typography>
      )}

      <Divider sx={{ my: 2 }} />

      <Typography variant='subtitle2' gutterBottom>
        Add New Filter
      </Typography>

      <Stack direction='row' spacing={1} alignItems='center'>
        <FormControl size='small' sx={{ minWidth: 120 }}>
          <InputLabel>Field</InputLabel>
          <Select value={newField} label='Field' onChange={e => setNewField(e.target.value as keyof Stock)}>
            {availableMetrics.map(metric => (
              <MenuItem key={metric.id} value={metric.id}>
                {metric.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size='small' sx={{ minWidth: 100 }}>
          <InputLabel>Operator</InputLabel>
          <Select
            value={newOperator}
            label='Operator'
            onChange={e => setNewOperator(e.target.value as 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains')}>
            {operators.map(op => (
              <MenuItem key={op.value} value={op.value}>
                {op.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          size='small'
          label='Value'
          value={newValue}
          onChange={e => setNewValue(e.target.value)}
          sx={{ flexGrow: 1 }}
        />

        <Button
          variant='contained'
          onClick={handleAddFilter}
          disabled={!newField || !newValue}
          startIcon={<AddIcon />}
          size='small'>
          Add
        </Button>
      </Stack>
    </Box>
  )
}

export default FilterPanel
