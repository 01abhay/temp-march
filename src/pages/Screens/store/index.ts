import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { Stock } from '../../../services/api'
import stocks from '../../../data/stocks.json'
import screenerPresets from '../../../data/screener-presets.json'

export interface ScreenerFilter {
  id: string
  field: keyof Stock
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains'
  value: number | string
}

export interface ScreenerPreset {
  id: string
  name: string
  description: string
  filters: ScreenerFilter[]
}

interface ScreenerCriteria {
  metric: string
  operator: string
  value: number
}

interface ScreenerPresetData {
  id: number
  name: string
  description: string
  criteria: ScreenerCriteria[]
  createdAt: string
}

interface ScreenerState {
  presets: ScreenerPreset[]
  activePresetId: string | null
  activeFilters: ScreenerFilter[]
  sortField: keyof Stock | null
  sortDirection: 'asc' | 'desc'

  addPreset: (name: string, description: string, filters: ScreenerFilter[]) => void
  removePreset: (id: string) => void
  updatePreset: (id: string, name: string, description: string, filters: ScreenerFilter[]) => void
  setActivePreset: (id: string | null) => void
  addFilter: (filter: ScreenerFilter) => void
  updateFilter: (id: string, filter: Partial<ScreenerFilter>) => void
  removeFilter: (id: string) => void
  clearFilters: () => void
  setSortField: (field: keyof Stock | null) => void
  setSortDirection: (direction: 'asc' | 'desc') => void

  getFilteredStocks: () => Stock[]
}

const mapOperator = (op: string): 'gt' | 'lt' | 'eq' | 'gte' | 'lte' | 'contains' => {
  switch (op) {
    case '>':
      return 'gt'
    case '<':
      return 'lt'
    case '=':
      return 'eq'
    case '>=':
      return 'gte'
    case '<=':
      return 'lte'
    default:
      return 'eq'
  }
}

const transformedPresets: ScreenerPreset[] = (screenerPresets.presets as ScreenerPresetData[]).map(preset => ({
  id: preset.id.toString(),
  name: preset.name,
  description: preset.description,
  filters: preset.criteria.map((criteria, index) => ({
    id: `${preset.id}-${index}`,
    field: criteria.metric as keyof Stock,
    operator: mapOperator(criteria.operator),
    value: criteria.value,
  })),
}))

export const useScreenerStore = create<ScreenerState>()(
  persist(
    (set, get) => ({
      presets: transformedPresets,
      activePresetId: null,
      activeFilters: [],
      sortField: null,
      sortDirection: 'desc',

      addPreset: (name, description, filters) =>
        set(state => ({
          presets: [
            ...state.presets,
            {
              id: Date.now().toString(),
              name,
              description,
              filters,
            },
          ],
        })),

      removePreset: id =>
        set(state => ({
          presets: state.presets.filter(preset => preset.id !== id),
          activePresetId: state.activePresetId === id ? null : state.activePresetId,
        })),

      updatePreset: (id, name, description, filters) =>
        set(state => ({
          presets: state.presets.map(preset => (preset.id === id ? { ...preset, name, description, filters } : preset)),
        })),

      setActivePreset: id =>
        set(state => {
          const preset = id ? state.presets.find(p => p.id === id) : null
          return {
            activePresetId: id,
            activeFilters: preset ? [...preset.filters] : [],
          }
        }),

      addFilter: filter =>
        set(state => ({
          activeFilters: [...state.activeFilters, filter],
        })),

      updateFilter: (id, filter) =>
        set(state => ({
          activeFilters: state.activeFilters.map(f => (f.id === id ? { ...f, ...filter } : f)),
        })),

      removeFilter: id =>
        set(state => ({
          activeFilters: state.activeFilters.filter(f => f.id !== id),
        })),

      clearFilters: () =>
        set(() => ({
          activeFilters: [],
          activePresetId: null,
        })),

      setSortField: field =>
        set(state => ({
          sortField: field,
          sortDirection:
            field === state.sortField ? (state.sortDirection === 'asc' ? 'desc' : 'asc') : state.sortDirection,
        })),

      setSortDirection: direction =>
        set(() => ({
          sortDirection: direction,
        })),

      getFilteredStocks: () => {
        const { activeFilters, sortField, sortDirection } = get()

        let filteredStocks = stocks.filter(stock => {
          return activeFilters.every(filter => {
            const stockValue = stock[filter.field]
            const filterValue = filter.value

            switch (filter.operator) {
              case 'gt':
                return typeof stockValue === 'number' && stockValue > Number(filterValue)
              case 'lt':
                return typeof stockValue === 'number' && stockValue < Number(filterValue)
              case 'eq':
                return stockValue === filterValue
              case 'gte':
                return typeof stockValue === 'number' && stockValue >= Number(filterValue)
              case 'lte':
                return typeof stockValue === 'number' && stockValue <= Number(filterValue)
              case 'contains':
                return (
                  typeof stockValue === 'string' && stockValue.toLowerCase().includes(String(filterValue).toLowerCase())
                )
              default:
                return true
            }
          })
        })

        if (sortField) {
          filteredStocks = [...filteredStocks].sort((a, b) => {
            const aValue = a[sortField]
            const bValue = b[sortField]

            if (typeof aValue === 'number' && typeof bValue === 'number') {
              return sortDirection === 'asc' ? aValue - bValue : bValue - aValue
            }

            if (typeof aValue === 'string' && typeof bValue === 'string') {
              return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
            }

            return 0
          })
        }

        return filteredStocks
      },
    }),
    {
      name: 'screener-storage',
      partialize: state => ({
        presets: state.presets,
        activePresetId: state.activePresetId,
        activeFilters: state.activeFilters,
        sortField: state.sortField,
        sortDirection: state.sortDirection,
      }),
    }
  )
)
