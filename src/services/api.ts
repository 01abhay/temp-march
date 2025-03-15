import axios from 'axios'
import { z } from 'zod'

import indices from '../data/indices.json'
import marketMovements from '../data/market-movement.json'

export async function getIndices() {
  await wait(getRandomNumber(1000, 2000))
  return indices
}

export type MarketMovementResponse = typeof marketMovements
export async function getMarketMovement() {
  await wait(getRandomNumber(1000, 2000))
  return marketMovements
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
