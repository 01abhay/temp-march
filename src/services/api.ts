import axios from 'axios'
import { z } from 'zod'

import indices from '../data/indices.json'
import stocks from '../data/stocks.json'
import historicalData from '../data/historical-data.json'

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

export async function getHistoricalData(id: string) {
  await wait(getRandomNumber(1000, 2000))
  const data = historicalData[id as keyof typeof historicalData]
  if (!data) throw new Error(`Historical data for stock ${id} not found`)
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

const alphavantageAPI = axios.create({
  baseURL: 'https://www.alphavantage.co/query',
  params: { apikey: import.meta.env.VITE_ALPHA_VANTAGE_API_KEY },
})

const companyOverviewSchema = z.any()
export type CompanyOverviewSchema = z.infer<typeof companyOverviewSchema>
export async function getCompanyOverview(symbol: string) {
  return alphavantageAPI.get('/OVERVIEW', { params: { symbol } }).then(res => companyOverviewSchema.parse(res.data))
}

// utils
const getRandomNumber = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min

const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms))
