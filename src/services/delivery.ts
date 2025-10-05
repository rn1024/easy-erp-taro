import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export enum ShipmentRecordStatus {
  PREPARING = 'PREPARING',
  SHIPPED = 'SHIPPED',
  IN_TRANSIT = 'IN_TRANSIT',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export const shipmentRecordStatusOptions = [
  { label: '准备中', value: ShipmentRecordStatus.PREPARING },
  { label: '已发货', value: ShipmentRecordStatus.SHIPPED },
  { label: '在途', value: ShipmentRecordStatus.IN_TRANSIT },
  { label: '已交付', value: ShipmentRecordStatus.DELIVERED },
  { label: '已取消', value: ShipmentRecordStatus.CANCELLED }
]

export const getShipmentRecordStatusLabel = (status: ShipmentRecordStatus | string): { label: string; color: string } => {
  const map: Record<string, { label: string; color: string }> = {
    PREPARING: { label: '准备中', color: 'blue' },
    SHIPPED: { label: '已发货', color: 'orange' },
    IN_TRANSIT: { label: '在途', color: 'purple' },
    DELIVERED: { label: '已交付', color: 'green' },
    CANCELLED: { label: '已取消', color: 'default' }
  }
  return map[status] ?? { label: '未知', color: 'default' }
}

export interface ShipmentProductRecordInfo {
  id: string
  shipmentRecordId: string
  productId: string
  forwarderId?: string
  totalBoxes: number
  fbaShipmentCode?: string
  fbaWarehouseCode?: string
  createdAt: string
  updatedAt: string
  product?: {
    id: string
    code: string
    specification?: string
    sku: string
  }
  forwarder?: {
    id: string
    nickname: string
    contactPerson: string
    contactPhone?: string
  }
}

export interface ShipmentRecordInfo {
  id: string
  shopId: string
  country?: string
  channel?: string
  shippingChannel?: string
  warehouseReceiptDeadline?: string
  shippingDetails?: string
  date: string
  status: ShipmentRecordStatus
  operatorId: string
  createdAt: string
  updatedAt: string
  shipmentFile?: string
  shop?: {
    id: string
    nickname: string
    responsiblePerson: string
  }
  operator?: {
    id: string
    name: string
    operator: string
  }
  shipmentProducts?: ShipmentProductRecordInfo[]
}

export interface CreateShipmentRecordData {
  shopId: string
  country?: string
  channel?: string
  shippingChannel?: string
  warehouseReceiptDeadline?: string
  shippingDetails?: string
  date: string
  shipmentFile?: string
  products: Array<{
    productId: string
    forwarderId: string
    totalBoxes: number
    fbaShipmentCode?: string
    fbaWarehouseCode?: string
  }>
}

export interface UpdateShipmentRecordData {
  shopId?: string
  country?: string
  channel?: string
  shippingChannel?: string
  warehouseReceiptDeadline?: string
  shippingDetails?: string
  date?: string
  status?: ShipmentRecordStatus
  shipmentFile?: string
  products?: Array<{
    id?: string
    productId: string
    forwarderId: string
    totalBoxes: number
    fbaShipmentCode?: string
    fbaWarehouseCode?: string
  }>
}

export type ShipmentRecordQueryParams = Partial<{
  shopId: string
  status: ShipmentRecordStatus
  country: string
  channel: string
  shippingChannel: string
  productNickname: string
  productSpecification: string
  productSku: string
  createdAtStart: string
  createdAtEnd: string
  page: number
  pageSize: number
}> & Record<string, unknown>

export type ShipmentProductRecordQueryParams = Partial<{
  shipmentRecordId: string
  productId: string
  forwarderId: string
  fbaShipmentCode: string
  page: number
  pageSize: number
}> & Record<string, unknown>

type ShipmentRecordListData = {
  list: ShipmentRecordInfo[]
  meta: PageMeta
}

type ShipmentProductRecordListData = {
  list: ShipmentProductRecordInfo[]
  meta: PageMeta
}

export const getShipmentRecordsApi = (params: ShipmentRecordQueryParams): Promise<PageResType<ShipmentRecordInfo>> => {
  return ApiService.get<ShipmentRecordListData>('/shipment-records', params)
}

export const getShipmentRecordApi = (id: string): Promise<ResType<ShipmentRecordInfo>> => {
  return ApiService.get<ShipmentRecordInfo>(`/shipment-records/${id}`)
}

export const createShipmentRecordApi = (data: CreateShipmentRecordData): Promise<ResType<ShipmentRecordInfo>> => {
  return ApiService.post<ShipmentRecordInfo>('/shipment-records', data)
}

export const updateShipmentRecordApi = (id: string, data: UpdateShipmentRecordData): Promise<ResType<ShipmentRecordInfo>> => {
  return ApiService.put<ShipmentRecordInfo>(`/shipment-records/${id}`, data)
}

export const deleteShipmentRecordApi = (id: string): Promise<ResType<unknown>> => {
  return ApiService.delete<unknown>(`/shipment-records/${id}`)
}

export const getShipmentProductRecordsApi = (params: ShipmentProductRecordQueryParams): Promise<PageResType<ShipmentProductRecordInfo>> => {
  return ApiService.get<ShipmentProductRecordListData>('/shipment-product-records', params)
}

export const createShipmentProductRecordApi = (
  data: Omit<ShipmentProductRecordInfo, 'id' | 'createdAt' | 'updatedAt' | 'product' | 'forwarder'>
): Promise<ResType<ShipmentProductRecordInfo>> => {
  return ApiService.post<ShipmentProductRecordInfo>('/shipment-product-records', data)
}

export const updateShipmentProductRecordApi = (
  id: string,
  data: Partial<Omit<ShipmentProductRecordInfo, 'id' | 'createdAt' | 'updatedAt' | 'product' | 'forwarder'>>
): Promise<ResType<ShipmentProductRecordInfo>> => {
  return ApiService.put<ShipmentProductRecordInfo>(`/shipment-product-records/${id}`, data)
}

export const deleteShipmentProductRecordApi = (id: string): Promise<ResType<unknown>> => {
  return ApiService.delete<unknown>(`/shipment-product-records/${id}`)
}

export const DeliveryRecordStatus = ShipmentRecordStatus
export const deliveryRecordStatusOptions = shipmentRecordStatusOptions
export const getDeliveryRecordStatusLabel = getShipmentRecordStatusLabel

export type DeliveryRecordInfo = ShipmentRecordInfo
export type CreateDeliveryRecordData = CreateShipmentRecordData
export type UpdateDeliveryRecordData = UpdateShipmentRecordData
export type DeliveryRecordQueryParams = ShipmentRecordQueryParams

export const getDeliveryRecordsApi = getShipmentRecordsApi
export const getDeliveryRecordApi = getShipmentRecordApi
export const createDeliveryRecordApi = createShipmentRecordApi
export const updateDeliveryRecordApi = updateShipmentRecordApi
export const deleteDeliveryRecordApi = deleteShipmentRecordApi
