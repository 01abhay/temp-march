import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { CSS } from '@dnd-kit/utilities'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import IconButton from '@mui/material/IconButton'
import TableContainer from '@mui/material/TableContainer'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Typography from '@mui/material/Typography'
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward'
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward'
import DeleteIcon from '@mui/icons-material/Delete'
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'

import { type Stock, getStocks, updateWatchlist } from '../../../services/api'

interface SortableTableRowProps {
  row: Stock
  updateWatchlistMutation: {
    mutate: (stocks: string[]) => void
    isPending: boolean
  }
  data: Stock[]
  navigate: (path: string) => void
}
function SortableTableRow({ row, updateWatchlistMutation, data, navigate }: SortableTableRowProps) {
  const isPositive = row.change >= 0

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: row.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1 : 0,
    '&:last-child td, &:last-child th': { border: 0 },
    '&:hover': { backgroundColor: 'action.hover' },
    cursor: 'pointer',
  }

  return (
    <TableRow ref={setNodeRef} key={row.id} sx={style} onClick={() => navigate(`/stock/${row.id}`)}>
      <TableCell padding='checkbox'>
        <IconButton size='small' {...attributes} {...listeners} sx={{ cursor: 'grab' }}>
          <DragIndicatorIcon fontSize='small' />
        </IconButton>
      </TableCell>
      <TableCell component='th'>
        <Typography variant='body2'>{row.name}</Typography>
        <Typography variant='caption' color='text.secondary'>
          {row.id}
        </Typography>
      </TableCell>
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
      <TableCell align='right'>
        <IconButton
          size='small'
          color='error'
          onClick={(e: React.MouseEvent) => {
            e.stopPropagation()
            updateWatchlistMutation.mutate(data.filter(stock => stock.id !== row.id).map(stock => stock.id))
          }}
          disabled={updateWatchlistMutation.isPending}>
          <DeleteIcon />
        </IconButton>
      </TableCell>
    </TableRow>
  )
}

export default function StocksTable({ stocks, watchlistId }: { stocks: string[]; watchlistId: number }) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [items, setItems] = useState<Stock[]>([])

  const { isPending, data, error } = useQuery({
    queryKey: ['get.stocks', stocks],
    queryFn: () => getStocks({ symbols: stocks }),
  })

  useEffect(() => {
    if (data) setItems(data)
  }, [data])

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const updateWatchlistMutation = useMutation({
    mutationFn: (stocks: string[]) => updateWatchlist(watchlistId, { stocks }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['get.stocks'] })
    },
  })

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      setItems(items => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)

        const newItems = arrayMove(items, oldIndex, newIndex)

        console.log('newItems', newItems)

        updateWatchlistMutation.mutate(newItems.map(item => item.id))

        return newItems
      })
    }
  }

  if (isPending) return <div>Loading...</div>
  if (error) return <div>Error: {error.message}</div>
  return (
    <TableContainer>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <Table size='small'>
          <TableBody>
            {items.length ? (
              <SortableContext items={items.map(item => item.id)} strategy={verticalListSortingStrategy}>
                {items.map(row => (
                  <SortableTableRow
                    key={row.id}
                    row={row}
                    updateWatchlistMutation={updateWatchlistMutation}
                    data={items}
                    navigate={navigate}
                  />
                ))}
              </SortableContext>
            ) : (
              <TableRow>
                <TableCell colSpan={4} align='center'>
                  <Typography variant='body2'>No stocks found</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </DndContext>
    </TableContainer>
  )
}
