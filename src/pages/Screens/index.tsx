import { useState } from 'react'
import Box from '@mui/material/Box'
import Stack from '@mui/material/Stack'
import Typography from '@mui/material/Typography'
import Paper from '@mui/material/Paper'
import Button from '@mui/material/Button'
import Divider from '@mui/material/Divider'
import Grid from '@mui/material/Grid2'
import MenuItem from '@mui/material/MenuItem'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import FormControl from '@mui/material/FormControl'
import InputLabel from '@mui/material/InputLabel'
import SaveIcon from '@mui/icons-material/Save'
import FileDownloadIcon from '@mui/icons-material/FileDownload'

import { useScreenerStore } from './store'
import FilterPanel from './components/FilterPanel'
import ResultsTable from './components/ResultsTable'
import SavePresetDialog from './components/SavePresetDialog'

export default function Screens() {
  const { presets, activePresetId, setActivePreset, clearFilters, getFilteredStocks } = useScreenerStore()

  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)

  const handlePresetChange = (event: SelectChangeEvent<string>) => {
    const presetId = event.target.value
    if (presetId === 'clear') {
      clearFilters()
    } else {
      setActivePreset(presetId)
    }
  }

  const handleExportResults = () => {
    const stocks = getFilteredStocks()
    const csvContent = [
      Object.keys(stocks[0] || {}).join(','),
      ...stocks.map(stock => Object.values(stock).join(',')),
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'screener_results.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const filteredStocks = getFilteredStocks()

  return (
    <Box>
      <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        justifyContent='space-between'
        alignItems={{ xs: 'flex-start', md: 'center' }}
        mb={2}>
        <Typography variant='h4'>Stock Screener</Typography>
        <Stack direction='row' gap={1}>
          <Button variant='outlined' size='small' startIcon={<SaveIcon />} onClick={() => setIsSaveDialogOpen(true)}>
            Save Preset
          </Button>
          <Button
            variant='outlined'
            size='small'
            startIcon={<FileDownloadIcon />}
            onClick={handleExportResults}
            disabled={filteredStocks.length === 0}>
            Export Results
          </Button>
        </Stack>
      </Stack>

      <Grid container spacing={2}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='h6'>Filters</Typography>
              <FormControl size='small' sx={{ minWidth: 120 }}>
                <InputLabel id='preset-select-label'>Preset</InputLabel>
                <Select
                  labelId='preset-select-label'
                  value={activePresetId || ''}
                  label='Preset'
                  onChange={handlePresetChange}>
                  <MenuItem value='clear'>
                    <em>Clear All</em>
                  </MenuItem>
                  {presets.map(preset => (
                    <MenuItem key={preset.id} value={preset.id}>
                      {preset.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>

            <Divider sx={{ my: 2 }} />

            <FilterPanel />
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Paper sx={{ p: 2 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant='h6'>Results ({filteredStocks.length} stocks)</Typography>
            </Box>

            <ResultsTable stocks={filteredStocks} />
          </Paper>
        </Grid>
      </Grid>

      <SavePresetDialog open={isSaveDialogOpen} onClose={() => setIsSaveDialogOpen(false)} />
    </Box>
  )
}
