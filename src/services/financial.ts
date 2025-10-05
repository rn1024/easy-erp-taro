import { ApiService } from './api'
import type { ResType } from './types'

export interface FinancialReportDetails {
  revenue?: {
    totalRevenue: number
    productSales: number
    serviceFees: number
    otherIncome: number
  }
  costs?: {
    totalCosts: number
    productCosts: number
    shippingCosts: number
    marketingCosts: number
    operatingCosts: number
    otherCosts: number
  }
  profit?: {
    grossProfit: number
    netProfit: number
    profitMargin: number
  }
  inventory?: {
    startingInventory: number
    endingInventory: number
    inventoryTurnover: number
  }
  sales?: {
    totalOrders: number
    averageOrderValue: number
    returnRate: number
    conversionRate: number
  }
  advertising?: {
    adSpend: number
    adRevenue: number
    acos: number
    roas: number
  }
  cashFlow?: {
    operatingCashFlow: number
    investmentCashFlow: number
    financingCashFlow: number
    netCashFlow: number
  }
}

export interface FinancialReport {
  id: string
  shopId: string
  reportMonth: string
  details: FinancialReportDetails
  createdAt: string
  updatedAt: string
  shop: {
    id: string
    nickname: string
    responsiblePerson: string
  }
}

export type FinancialReportQueryParams = Partial<{
  page: number
  pageSize: number
  shopId: string
  reportMonth: string
}> & Record<string, unknown>

export interface FinancialReportListResult {
  list: FinancialReport[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateFinancialReportData {
  shopId: string
  reportMonth: string
  details?: FinancialReportDetails
}

export interface UpdateFinancialReportData {
  reportMonth?: string
  details?: FinancialReportDetails
}

export const getFinancialReportsApi = (params: FinancialReportQueryParams = {}): Promise<ResType<FinancialReportListResult>> => {
  return ApiService.get<FinancialReportListResult>('/financial-reports', params)
}

export const getFinancialReportApi = (id: string): Promise<ResType<FinancialReport>> => {
  return ApiService.get<FinancialReport>(`/financial-reports/${id}`)
}

export const createFinancialReportApi = (data: CreateFinancialReportData): Promise<ResType<FinancialReport>> => {
  return ApiService.post<FinancialReport>('/financial-reports', data)
}

export const updateFinancialReportApi = (id: string, data: UpdateFinancialReportData): Promise<ResType<FinancialReport>> => {
  return ApiService.put<FinancialReport>(`/financial-reports/${id}`, data)
}

export const deleteFinancialReportApi = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/financial-reports/${id}`)
}

export const getDefaultFinancialReportDetails = (): FinancialReportDetails => ({
  revenue: {
    totalRevenue: 0,
    productSales: 0,
    serviceFees: 0,
    otherIncome: 0
  },
  costs: {
    totalCosts: 0,
    productCosts: 0,
    shippingCosts: 0,
    marketingCosts: 0,
    operatingCosts: 0,
    otherCosts: 0
  },
  profit: {
    grossProfit: 0,
    netProfit: 0,
    profitMargin: 0
  },
  inventory: {
    startingInventory: 0,
    endingInventory: 0,
    inventoryTurnover: 0
  },
  sales: {
    totalOrders: 0,
    averageOrderValue: 0,
    returnRate: 0,
    conversionRate: 0
  },
  advertising: {
    adSpend: 0,
    adRevenue: 0,
    acos: 0,
    roas: 0
  },
  cashFlow: {
    operatingCashFlow: 0,
    investmentCashFlow: 0,
    financingCashFlow: 0,
    netCashFlow: 0
  }
})

export const calculateFinancialMetrics = (details: FinancialReportDetails): FinancialReportDetails => {
  const updated: FinancialReportDetails = JSON.parse(JSON.stringify(details || {}))

  if (updated.revenue) {
    const { productSales = 0, serviceFees = 0, otherIncome = 0 } = updated.revenue
    updated.revenue.totalRevenue = productSales + serviceFees + otherIncome
  }

  if (updated.costs) {
    const { productCosts = 0, shippingCosts = 0, marketingCosts = 0, operatingCosts = 0, otherCosts = 0 } = updated.costs
    updated.costs.totalCosts = productCosts + shippingCosts + marketingCosts + operatingCosts + otherCosts
  }

  if (updated.revenue && updated.costs && updated.profit) {
    const revenue = updated.revenue.totalRevenue ?? 0
    const costs = updated.costs.totalCosts ?? 0
    updated.profit.grossProfit = revenue - costs
    updated.profit.netProfit = updated.profit.netProfit ?? updated.profit.grossProfit
    updated.profit.profitMargin = revenue === 0 ? 0 : Number((updated.profit.netProfit / revenue).toFixed(4))
  }

  if (updated.inventory) {
    const { startingInventory = 0, endingInventory = 0 } = updated.inventory
    const averageInventory = (startingInventory + endingInventory) / 2
    const denominator = averageInventory === 0 ? 1 : averageInventory
    const revenue = updated.revenue?.totalRevenue ?? 0
    updated.inventory.inventoryTurnover = Number((revenue / denominator).toFixed(2))
  }

  if (updated.sales) {
    const { totalOrders = 0 } = updated.sales
    const revenue = updated.revenue?.totalRevenue ?? 0
    updated.sales.averageOrderValue = totalOrders === 0 ? 0 : Number((revenue / totalOrders).toFixed(2))
  }

  if (updated.advertising) {
    const { adRevenue = 0, adSpend = 0 } = updated.advertising
    updated.advertising.acos = adRevenue === 0 ? 0 : Number(((adSpend / adRevenue) * 100).toFixed(2))
    updated.advertising.roas = adSpend === 0 ? 0 : Number((adRevenue / adSpend).toFixed(2))
  }

  if (updated.cashFlow) {
    const { operatingCashFlow = 0, investmentCashFlow = 0, financingCashFlow = 0 } = updated.cashFlow
    updated.cashFlow.netCashFlow = operatingCashFlow + investmentCashFlow + financingCashFlow
  }

  return updated
}
