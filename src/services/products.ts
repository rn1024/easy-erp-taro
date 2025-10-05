/**
 * Types
 */
import type { Product as UiProduct, PaginatedResponse, ProductFilters } from '@/types'

/**
 * APIs
 */
import { ApiService } from './api'
import type { PageMeta, PageResType, ResType } from './types'

export type ProductImage = {
  id: string
  productId: string
  imageUrl: string
  fileName: string
  fileSize: number
  sortOrder: number
  isCover: boolean
  createdAt: string
  updatedAt: string
}

export type ProductImageFormData = {
  imageUrl: string
  fileName: string
  fileSize: number
  sortOrder: number
  isCover: boolean
}

export type ProductImageUploadParams = {
  productId: string
  images: ProductImageFormData[]
}

export type ProductCategory = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  _count: {
    products: number
  }
}

export type ProductCategoriesParams = Partial<{
  page: number
  pageSize: number
  name: string
}> & Record<string, unknown>

export type ProductCategoryFormData = {
  name: string
}

export type AccessoryImage = {
  id: string
  entityId: string
  entityType: string
  resourceType: string
  resourceUrl: string
  fileName: string
  fileSize: number
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export type ProductCost = {
  id: string
  productId: string
  costInfo?: string
  price?: string
  unit?: string
  supplier?: string
  createdAt: string
  updatedAt: string
}

export type ProductInfo = {
  id: string
  shopId: string
  categoryId: string
  code?: string
  name?: string
  specification?: string
  color?: string
  setQuantity: number
  internalSize?: string
  externalSize?: string
  weight?: number
  sku?: string
  asin?: string
  codeFileUrl?: string
  styleInfo?: string
  accessoryInfo?: string
  remark?: string
  packageType?: string
  packageOuterSize?: string
  packageInnerSize?: string
  packageWeight?: number
  outerBoxSize?: string
  labelFileUrl?: string
  operatorId: string
  createdAt: string
  updatedAt: string
  shop: {
    id: string
    nickname: string
  }
  category: {
    id: string
    name: string
  }
  operator: {
    id: string
    name: string
  }
  images?: ProductImage[]
  accessoryImages?: AccessoryImage[]
  costs?: ProductCost[]
  _count?: {
    finishedInventory: number
    spareInventory: number
    purchaseOrders?: number
    deliveryRecords?: number
  }
}

export type ProductsParams = Partial<{
  page: number
  pageSize: number
  shopId: string
  categoryId: string
  code: string
  sku: string
  asin: string
  nickname: string
  specification: string
  createdAtStart: string
  createdAtEnd: string
}> & Record<string, unknown>

export type ProductFormData = {
  shopId: string
  categoryId: string
  code?: string
  name?: string
  specification?: string
  color?: string
  setQuantity?: number
  internalSize?: string
  externalSize?: string
  weight?: number
  sku?: string
  asin?: string
  label?: string
  codeFileUrl?: string
  styleInfo?: string
  accessoryInfo?: string
  remark?: string
  packageType?: string
  packageOuterSize?: string
  packageInnerSize?: string
  packageWeight?: number
  outerBoxSize?: string
  labelFileUrl?: string
  productImages?: ProductImageFormData[]
  accessoryImages?: Array<{
    resourceUrl: string
    fileName: string
    fileSize: number
    sortOrder: number
  }>
}

export type ProductCategoriesData = {
  list: ProductCategory[]
  meta: PageMeta
}

type ProductsListData = {
  list: ProductInfo[]
  meta: PageMeta
}

export const getProductCategoriesApi = (params: ProductCategoriesParams = {}): Promise<ResType<ProductCategoriesData>> => {
  return ApiService.get<ProductCategoriesData>('/product-categories', params)
}

export const createProductCategoryApi = (data: ProductCategoryFormData): Promise<ResType<ProductCategory>> => {
  return ApiService.post<ProductCategory>('/product-categories', data)
}

export const getProductCategoryApi = (id: string): Promise<ResType<ProductCategory>> => {
  return ApiService.get<ProductCategory>(`/product-categories/${id}`)
}

export const updateProductCategoryApi = (id: string, data: ProductCategoryFormData): Promise<ResType<ProductCategory>> => {
  return ApiService.put<ProductCategory>(`/product-categories/${id}`, data)
}

export const deleteProductCategoryApi = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/product-categories/${id}`)
}

export const getProductsApi = (params: ProductsParams = {}): Promise<PageResType<ProductInfo>> => {
  return ApiService.get<ProductsListData>('/products', params)
}

export const createProductApi = (data: ProductFormData): Promise<ResType<ProductInfo>> => {
  return ApiService.post<ProductInfo>('/products', data)
}

export const getProductApi = (id: string): Promise<ResType<ProductInfo>> => {
  return ApiService.get<ProductInfo>(`/products/${id}`)
}

export const updateProductApi = (id: string, data: ProductFormData): Promise<ResType<ProductInfo>> => {
  return ApiService.put<ProductInfo>(`/products/${id}`, data)
}

export const deleteProductApi = (id: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/products/${id}`)
}

export const getProductImagesApi = (productId: string): Promise<ResType<ProductImage[]>> => {
  return ApiService.get<ProductImage[]>(`/products/${productId}/images`)
}

export const uploadProductImagesApi = (productId: string, images: ProductImageFormData[]): Promise<ResType<ProductImage[]>> => {
  return ApiService.post<ProductImage[]>(`/products/${productId}/images`, { images })
}

export const updateProductImageApi = (productId: string, imageId: string, data: Partial<ProductImageFormData>): Promise<ResType<ProductImage>> => {
  return ApiService.put<ProductImage>(`/products/${productId}/images/${imageId}`, data)
}

export const deleteProductImageApi = (productId: string, imageId: string): Promise<ResType<null>> => {
  return ApiService.delete<null>(`/products/${productId}/images/${imageId}`)
}

export const setCoverImageApi = (productId: string, imageId: string): Promise<ResType<ProductImage>> => {
  return ApiService.patch<ProductImage>(`/products/${productId}/images/${imageId}/set-cover`)
}

// 兼容当前页面使用的转换函数

const mapToUiProduct = (apiProduct: ProductInfo): UiProduct => ({
  id: apiProduct.id,
  name: apiProduct.name ?? '',
  shop: apiProduct.shop?.nickname ?? '',
  category: apiProduct.category?.name ?? '',
  info: apiProduct.specification ?? apiProduct.remark,
  sku: apiProduct.sku ?? '',
  createdAt: apiProduct.createdAt,
  updatedAt: apiProduct.updatedAt
})

export type ProductQueryParams = {
  page: number
  pageSize: number
  search?: string
  filters?: ProductFilters
}

export const getProducts = async (params: ProductQueryParams): Promise<ResType<PaginatedResponse<UiProduct> & { stats: { total: number; shops: number; categories: number } }>> => {
  try {
    const query: ProductsParams = {
      page: params.page,
      pageSize: params.pageSize
    }

    if (params.search) {
      query.sku = params.search
    }

    if (params.filters?.shop) {
      query.shopId = params.filters.shop
    }

    if (params.filters?.category) {
      query.categoryId = params.filters.category
    }

    const response = await getProductsApi(query)

    if (response.code !== 0 || !response.data) {
      throw new Error(response.msg || '获取产品列表失败')
    }

    const list = response.data.list ?? []
    const meta = response.data.meta
    const total = meta?.total ?? list.length
    const products = list.map(mapToUiProduct)
    const uniqueShops = new Set(list.map(item => item.shop?.nickname ?? '')).size
    const uniqueCategories = new Set(list.map(item => item.category?.name ?? '')).size

    return {
      code: 0,
      msg: '获取成功',
      data: {
        list: products,
        total,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: meta?.totalPages ?? Math.ceil(total / params.pageSize || 1),
        stats: {
          total,
          shops: uniqueShops,
          categories: uniqueCategories
        }
      }
    }
  } catch (error) {
    return {
      code: 1,
      msg: error instanceof Error ? error.message : '获取产品列表失败',
      data: {
        list: [],
        total: 0,
        page: params.page,
        pageSize: params.pageSize,
        totalPages: 0,
        stats: { total: 0, shops: 0, categories: 0 }
      }
    }
  }
}

export const getProductById = async (id: string): Promise<ResType<UiProduct>> => {
  try {
    const response = await getProductApi(id)
    if (response.code !== 0 || !response.data) {
      throw new Error(response.msg || '产品不存在')
    }
    return {
      code: 0,
      msg: '获取成功',
      data: mapToUiProduct(response.data)
    }
  } catch (error) {
    return {
      code: 1,
      msg: error instanceof Error ? error.message : '获取产品详情失败',
      data: {} as UiProduct
    }
  }
}

export const searchProductsBySku = async (sku: string): Promise<ResType<UiProduct[]>> => {
  try {
    const response = await getProductsApi({ sku, pageSize: 50 })
    if (response.code !== 0 || !response.data) {
      throw new Error(response.msg || 'SKU搜索失败')
    }
    return {
      code: 0,
      msg: '搜索成功',
      data: (response.data.list ?? []).map(mapToUiProduct)
    }
  } catch (error) {
    return {
      code: 1,
      msg: error instanceof Error ? error.message : 'SKU搜索失败',
      data: []
    }
  }
}
