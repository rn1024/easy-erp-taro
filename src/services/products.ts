import { ApiResponse, PaginatedResponse, ProductFilters, Product } from '@/types'
import { ApiService } from './api'

// Product类型 - 根据easy-erp-web接口返回字段定义
interface ApiProduct {
  id: string
  code: string
  sku: string
  name: string
  description?: string
  price: number
  cost: number
  status: string
  shop: {
    id: string
    nickname: string
  }
  category: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

// 产品查询参数
export interface ProductQueryParams {
  page: number
  pageSize: number
  search?: string
  filters?: ProductFilters
}

// API查询参数接口
interface ApiQueryParams extends Record<string, unknown> {
  page: number
  pageSize: number
  sku?: string
  shopId?: string
  categoryId?: string
}

// 获取产品列表 - 调用真实API
export const getProducts = async (params: ProductQueryParams): Promise<ApiResponse<PaginatedResponse<Product> & { stats: { total: number; shops: number; categories: number } }>> => {
  try {
    // 构建查询参数
    const queryParams: ApiQueryParams = {
      page: params.page,
      pageSize: params.pageSize
    }

    // 搜索参数映射
    if (params.search) {
      queryParams.sku = params.search  // 将搜索映射为SKU搜索
    }

    // 筛选参数映射
    if (params.filters?.shop) {
      queryParams.shopId = params.filters.shop
    }
    if (params.filters?.category) {
      queryParams.categoryId = params.filters.category
    }

    // 调用真实API
    const response = await ApiService.get('/products', queryParams)
    
    // 处理响应数据
    if (response.code === 0) {
      const data = response.data as { list?: ApiProduct[]; total?: number }
      const apiProducts = data.list || []
      const total = data.total || 0
      
      // 转换为前端Product类型
      const products: Product[] = apiProducts.map(p => ({
        id: p.id,
        name: p.name,
        shop: p.shop?.nickname || '',
        category: p.category?.name || '',
        info: p.description,
        sku: p.sku,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
      
      // 计算统计信息
      const uniqueShops = new Set(apiProducts.map((p: ApiProduct) => p.shop?.nickname || '')).size
      const uniqueCategories = new Set(apiProducts.map((p: ApiProduct) => p.category?.name || '')).size

      return {
        code: 0,
        msg: '获取成功',
        data: {
          list: products,
          total,
          page: params.page,
          pageSize: params.pageSize,
          totalPages: Math.ceil(total / params.pageSize),
          stats: {
            total,
            shops: uniqueShops,
            categories: uniqueCategories
          }
        }
      }
    } else {
      throw new Error(response.msg || '获取产品列表失败')
    }
  } catch (error) {
    // console.error('获取产品列表失败:', error)
    return {
      code: 1,
      msg: '获取产品列表失败',
      data: {
        list: [],
        total: 0,
        page: 1,
        pageSize: params.pageSize,
        totalPages: 0,
        stats: { total: 0, shops: 0, categories: 0 }
      }
    }
  }
}

// 根据ID获取产品详情 - 调用真实API
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  try {
    // 调用真实API
    const response = await ApiService.get(`/products/${id}`)
    
    if (response.code === 0) {
      const apiProduct = response.data as ApiProduct
      const product: Product = {
        id: apiProduct.id,
        name: apiProduct.name,
        shop: apiProduct.shop?.nickname || '',
        category: apiProduct.category?.name || '',
        info: apiProduct.description,
        sku: apiProduct.sku,
        createdAt: apiProduct.createdAt,
        updatedAt: apiProduct.updatedAt
      }
      return {
        code: 0,
        msg: '获取成功',
        data: product
      }
    } else {
      return {
        code: 1,
        msg: response.msg || '产品不存在',
        data: null as unknown as Product
      }
    }
  } catch (error) {
    // console.error('获取产品详情失败:', error)
    return {
      code: 1,
      msg: '获取产品详情失败',
      data: {} as Product
    }
  }
}

// 根据SKU搜索产品 - 调用真实API
export const searchProductsBySku = async (sku: string): Promise<ApiResponse<Product[]>> => {
  try {
    // 调用真实API进行SKU搜索
    const response = await ApiService.get('/products', {
      sku: sku,
      pageSize: 50  // 搜索时返回更多结果
    })

    if (response.code === 0) {
      const data = response.data as { list?: ApiProduct[] }
      const apiProducts = data.list || []
      const products: Product[] = apiProducts.map(p => ({
        id: p.id,
        name: p.name,
        shop: p.shop?.nickname || '',
        category: p.category?.name || '',
        info: p.description,
        sku: p.sku,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
      return {
        code: 0,
        msg: '搜索成功',
        data: products
      }
    } else {
      return {
        code: 1,
        msg: response.msg || 'SKU搜索失败',
        data: []
      }
    }
  } catch (error) {
    // console.error('SKU搜索失败:', error)
    return {
      code: 1,
      msg: 'SKU搜索失败',
      data: []
    }
  }
}