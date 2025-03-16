import axios from 'axios'
import { z } from 'zod'

import indices from '../data/indices.json'
import stocks from '../data/stocks.json'
import historicalData from '../data/historical-data.json'
import financialData from '../data/financial-data.json'
import watchlists from '../data/watchlists.json'

import { wait, getRandomNumber } from '../utils'

export async function getIndices() {
  await wait(getRandomNumber(1000, 2000))
  return indices
}

export type Stock = (typeof stocks)[number]
export async function getStock(id: string) {
  await wait(getRandomNumber(1000, 2000))
  const stock = stocks.find(stock => stock.id === id)
  if (!stock) throw new Error(`Stock with id ${id} not found`)
  return stock
}

export async function getStocks({ symbols }: { symbols?: string[] }) {
  await wait(getRandomNumber(1000, 2000))
  let _stocks = stocks
  if (symbols) _stocks = symbols.map(symbol => stocks.find(stock => stock.id === symbol)).filter(Boolean) as Stock[]

  return _stocks
}

export async function getHistoricalData(id: string) {
  await wait(getRandomNumber(1000, 2000))
  const data = historicalData[id as keyof typeof historicalData]
  if (!data) throw new Error(`Historical data for stock ${id} not found`)
  return data
}

export async function getFinancialData(id: string) {
  await wait(getRandomNumber(1000, 2000))
  const data = financialData[id as keyof typeof financialData]
  if (!data) throw new Error(`Financial data for stock ${id} not found`)
  return data
}

export async function getMarketMovement() {
  await wait(getRandomNumber(1000, 2000))

  const topGainers = stocks
    .filter(stock => stock.change >= 0)
    .sort((a, b) => b.change - a.change)
    .slice(0, 5)
  const topLosers = stocks
    .filter(stock => stock.change < 0)
    .sort((a, b) => a.change - b.change)
    .slice(0, 5)
  const mostActive = stocks.sort((a, b) => b.volume - a.volume).slice(0, 5)

  return { top_gainers: topGainers, top_losers: topLosers, most_actively_traded: mostActive }
}

export type Watchlist = (typeof watchlists)[number]
export async function getWatchlist() {
  await wait(getRandomNumber(1000, 2000))
  let _watchlists = localStorage.getItem('watchlists')
  if (!_watchlists) localStorage.setItem('watchlists', JSON.stringify(watchlists))
  _watchlists = localStorage.getItem('watchlists') ?? '[]'
  return JSON.parse(_watchlists) as typeof watchlists
}

export async function createWatchlist(name: string) {
  const watchlists = await getWatchlist()
  const newWatchlist = { id: Math.random(), name, stocks: [] }
  localStorage.setItem('watchlists', JSON.stringify([...watchlists, newWatchlist]))
  return newWatchlist
}

export async function updateWatchlist(id: number, payload: { name?: string; stocks?: string[] }) {
  const watchlists = await getWatchlist()
  const newWatchlists = watchlists.map(watchlist => (watchlist.id === id ? { ...watchlist, ...payload } : watchlist))
  localStorage.setItem('watchlists', JSON.stringify(newWatchlists))
  return newWatchlists
}

export async function addStockToWatchlist(id: number, stock: string) {
  const watchlists = await getWatchlist()
  const newWatchlists = watchlists.map(watchlist =>
    watchlist.id === id ? { ...watchlist, stocks: [...watchlist.stocks, stock] } : watchlist
  )
  localStorage.setItem('watchlists', JSON.stringify(newWatchlists))
  return newWatchlists
}

export async function deleteWatchlist(id: number) {
  const watchlists = await getWatchlist()
  const newWatchlists = watchlists.filter(watchlist => watchlist.id !== id)
  localStorage.setItem('watchlists', JSON.stringify(newWatchlists))
  return newWatchlists
}

// NOTE: this is not used in the project due to limited API availability in free tier, but it's here for reference
const alphavantageAPI = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
  params: { apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY },
})

const companyOverviewSchema = z.any()
export type CompanyOverviewSchema = z.infer<typeof companyOverviewSchema>
export async function getCompanyOverview(symbol: string) {
  return alphavantageAPI.get('/OVERVIEW', { params: { symbol } }).then(res => companyOverviewSchema.parse(res.data))
}
