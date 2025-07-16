import { ApiResponse, PaginatedResponse, ProductFilters } from '@/types'
import { Product as AdminProduct } from '@/types/admin'
import { mockProducts } from '@/constants/mockData'

// 扩展Product类型以包含时间戳
interface Product extends AdminProduct {
  createdAt: string
  updatedAt: string
  info?: string
  packaging?: string
  outerBox?: string
  accessories?: string
}

// 转换admin Product为完整Product
const convertToProduct = (adminProduct: AdminProduct): Product => ({
  ...adminProduct,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  info: adminProduct.packageInfo || '',
  packaging: adminProduct.packageInfo || '',
  outerBox: adminProduct.outerBoxInfo || '',
  accessories: adminProduct.accessoriesInfo || ''
})

// 产品查询参数
export interface ProductQueryParams {
  page: number
  pageSize: number
  search?: string
  filters?: ProductFilters
}

// 获取产品列表
export const getProducts = async (params: ProductQueryParams): Promise<ApiResponse<PaginatedResponse<Product> & { stats: { total: number; shops: number; categories: number } }>> => {
  try {
    // 模拟网络延迟
    await new Promise(resolve => setTimeout(resolve, 500))

    let filteredProducts = mockProducts.map(convertToProduct)

    // 搜索过滤
    if (params.search) {
      const searchLower = params.search.toLowerCase()
      filteredProducts = filteredProducts.filter(product =>
        product.name.toLowerCase().includes(searchLower) ||
        product.sku?.toLowerCase().includes(searchLower) ||
        product.shop.toLowerCase().includes(searchLower)
      )
    }

    // 店铺过滤
    if (params.filters?.shop) {
      filteredProducts = filteredProducts.filter(product => product.shop === params.filters?.shop)
    }

    // 分类过滤
    if (params.filters?.category) {
      filteredProducts = filteredProducts.filter(product => product.category === params.filters?.category)
    }

    // 分页处理
    const startIndex = (params.page - 1) * params.pageSize
    const endIndex = startIndex + params.pageSize
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex)

    // 统计信息
    const uniqueShops = new Set(mockProducts.map(p => p.shop)).size
    const uniqueCategories = new Set(mockProducts.map(p => p.category)).size

    return {
      success: true,
      data: {
        items: paginatedProducts,
        total: filteredProducts.length,
        page: params.page,
        pageSize: params.pageSize,
        hasMore: endIndex < filteredProducts.length,
        stats: {
          total: mockProducts.length,
          shops: uniqueShops,
          categories: uniqueCategories
        }
      },
      message: '获取成功',
      code: 200
    }
  } catch (error) {
    console.error('获取产品列表失败:', error)
    return {
      success: false,
      data: {
        items: [],
        total: 0,
        page: 1,
        pageSize: params.pageSize,
        hasMore: false,
        stats: { total: 0, shops: 0, categories: 0 }
      },
      message: '获取产品列表失败',
      code: 500
    }
  }
}

// 根据ID获取产品详情
export const getProductById = async (id: string): Promise<ApiResponse<Product>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 300))

    const adminProduct = mockProducts.find(p => p.id === id)
    
    if (!adminProduct) {
      return {
        success: false,
        data: {} as Product,
        message: '产品不存在',
        code: 404
      }
    }

    return {
      success: true,
      data: convertToProduct(adminProduct),
      message: '获取成功',
      code: 200
    }
  } catch (error) {
    console.error('获取产品详情失败:', error)
    return {
      success: false,
      data: {} as Product,
      message: '获取产品详情失败',
      code: 500
    }
  }
}

// 根据SKU搜索产品
export const searchProductsBySku = async (sku: string): Promise<ApiResponse<Product[]>> => {
  try {
    await new Promise(resolve => setTimeout(resolve, 400))

    const results = mockProducts.filter(product => 
      product.sku?.toLowerCase().includes(sku.toLowerCase()) ||
      product.name.toLowerCase().includes(sku.toLowerCase())
    )

    return {
      success: true,
      data: results,
      message: '搜索成功',
      code: 200
    }
  } catch (error) {
    console.error('SKU搜索失败:', error)
    return {
      success: false,
      data: [],
      message: 'SKU搜索失败',
      code: 500
    }
  }
} 