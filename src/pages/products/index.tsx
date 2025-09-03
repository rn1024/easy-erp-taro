import React, { useState, useEffect, useCallback } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import DataTable, { DataTableColumn } from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'
import { useUserStore } from '@/stores/userStore'
import { getProducts } from '@/services/products'
import type { Product, ProductFilters } from '@/types'
import './index.scss'

interface ProductsState {
  products: Product[]
  loading: boolean
  refreshing: boolean
  searchQuery: string
  filters: ProductFilters
  pagination: {
    page: number
    pageSize: number
    total: number
    hasMore: boolean
  }
  stats: {
    total: number
    shops: number
    categories: number
  }
}

const ProductsPage: React.FC = () => {
  const { userInfo } = useUserStore()
  const [state, setState] = useState<ProductsState>({
    products: [],
    loading: false,
    refreshing: false,
    searchQuery: '',
    filters: {
      shop: '',
      category: ''
    },
    pagination: {
      page: 1,
      pageSize: 10,
      total: 0,
      hasMore: true
    },
    stats: {
      total: 0,
      shops: 0,
      categories: 0
    }
  })

  // 加载产品数据
  const loadProducts = useCallback(async (reset = false) => {
    try {
      const isRefresh = reset
      setState(prev => ({ 
        ...prev, 
        loading: !isRefresh, 
        refreshing: isRefresh 
      }))

      const page = reset ? 1 : state.pagination.page
      const response = await getProducts({
        page,
        pageSize: state.pagination.pageSize,
        search: state.searchQuery,
        filters: state.filters
      })

      if (response.code === 0) {
        const newProducts: Product[] = reset 
          ? response.data.list 
          : [...state.products, ...response.data.list]

        setState(prev => ({
          ...prev,
          products: newProducts,
          loading: false,
          refreshing: false,
          pagination: {
            ...prev.pagination,
            page: page,
            total: response.data.total,
            hasMore: response.data.page < response.data.totalPages
          },
          stats: response.data.stats || prev.stats
        }))
      } else {
        throw new Error(response.msg)
      }
    } catch (error) {
      // 加载产品数据失败: error
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        refreshing: false 
      }))
      
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    }
  }, [state.searchQuery, state.filters, state.pagination.page, state.pagination.pageSize, state.products])

  // 初始化加载
  useEffect(() => {
    loadProducts(true)
  }, [])

  // 搜索处理
  const handleSearch = useCallback((query: string) => {
    setState(prev => ({
      ...prev,
      searchQuery: query,
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])

  // 搜索执行
  useEffect(() => {
    const timer = setTimeout(() => {
      loadProducts(true)
    }, 300)
    return () => clearTimeout(timer)
  }, [state.searchQuery])

  // 筛选处理
  const handleFilterChange = useCallback((filterType: keyof ProductFilters, value: string) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, [filterType]: value },
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])

  // 筛选执行
  useEffect(() => {
    loadProducts(true)
  }, [state.filters])

  // 下拉刷新
  const handleRefresh = useCallback(async () => {
    await loadProducts(true)
  }, [loadProducts])



  // 加载更多执行
  useEffect(() => {
    if (state.pagination.page > 1) {
      loadProducts(false)
    }
  }, [state.pagination.page])

  // 清除筛选
  const handleClearFilters = useCallback(() => {
    setState(prev => ({
      ...prev,
      searchQuery: '',
      filters: { shop: '', category: '' },
      pagination: { ...prev.pagination, page: 1 }
    }))
  }, [])

  // 查看产品详情
  const handleViewProduct = useCallback((product: Product) => {
    Taro.showModal({
      title: product.name,
      content: `店铺: ${product.shop}\n分类: ${product.category}\n包装: ${product.packaging || '无'}\n备注: ${product.remark || '无'}`,
      showCancel: false,
      confirmText: '确定'
    })
  }, [])

  // 表格列配置
  const columns = [
    {
      key: 'name',
      title: '产品昵称',
      dataIndex: 'name',
      width: 160,
      fixed: 'left' as const,
      render: (value: string, record: Product) => (
        <View 
          className='data-table__body-cell--highlight'
          onClick={() => handleViewProduct(record)}
        >
          {value}
        </View>
      )
    },
    {
      key: 'shop',
      title: '店铺',
      dataIndex: 'shop',
      width: 120
    },
    {
      key: 'category',
      title: '产品分类',
      dataIndex: 'category',
      width: 120
    },
    {
      key: 'info',
      title: '产品信息',
      dataIndex: 'info',
      width: 200,
      render: (value: string) => (
        <View style={{ 
          maxWidth: '200rpx', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        >
          {value || '-'}
        </View>
      )
    },
    {
      key: 'packaging',
      title: '产品包装',
      dataIndex: 'packaging',
      width: 150,
      render: (value: string) => value || '-'
    },
    {
      key: 'outerBox',
      title: '产品外箱',
      dataIndex: 'outerBox',
      width: 150,
      render: (value: string) => value || '-'
    },
    {
      key: 'accessories',
      title: '配件信息',
      dataIndex: 'accessories',
      width: 200,
      render: (value: string) => (
        <View style={{ 
          maxWidth: '200rpx', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        >
          {value || '-'}
        </View>
      )
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: (value: string) => (
        <View style={{ 
          maxWidth: '200rpx', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}
        >
          {value || '-'}
        </View>
      )
    }
  ]

  // 筛选选项
  const shopOptions = ['全部店铺', '店铺A', '店铺B', '店铺C', '店铺D']
  const categoryOptions = ['全部分类', '电子产品', '服装配饰', '家居用品', '运动户外', '美妆护肤']

  if (!userInfo) {
    return (
      <MobileLayout>
        <View className='products-page'>
          <View className='products-page__loading'>
            <Text className='products-page__loading-text'>加载中...</Text>
          </View>
        </View>
      </MobileLayout>
    )
  }

  return (
    <MobileLayout>
      <PullToRefresh onRefresh={handleRefresh}>
        <View className='products-page'>
          {/* 头部统计 */}
          <View className='products-page__header'>
            <View className='products-page__header-title'>产品管理</View>
            <View className='products-page__header-desc'>查看和管理所有产品信息</View>
            <View className='products-page__header-stats'>
              <View className='products-page__header-stats-item'>
                <View className='products-page__header-stats-item-value'>{state.stats.total}</View>
                <View className='products-page__header-stats-item-label'>总产品</View>
              </View>
              <View className='products-page__header-stats-item'>
                <View className='products-page__header-stats-item-value'>{state.stats.shops}</View>
                <View className='products-page__header-stats-item-label'>店铺数</View>
              </View>
              <View className='products-page__header-stats-item'>
                <View className='products-page__header-stats-item-value'>{state.stats.categories}</View>
                <View className='products-page__header-stats-item-label'>分类数</View>
              </View>
            </View>
          </View>

          {/* 搜索栏 */}
          <View className='products-page__search'>
            <SearchBar
              value={state.searchQuery}
              placeholder='搜索产品昵称或SKU'
              onSearch={handleSearch}
              onChange={handleSearch}
            />
          </View>

          {/* 筛选器 */}
          <View className='products-page__filters'>
            <View className='products-page__filters-row'>
              {shopOptions.map(shop => (
                <View
                  key={shop}
                  className={`products-page__filters-chip ${
                    (shop === '全部店铺' && !state.filters.shop) || state.filters.shop === shop
                      ? 'products-page__filters-chip--active' 
                      : ''
                  }`}
                  onClick={() => handleFilterChange('shop', shop === '全部店铺' ? '' : shop)}
                >
                  {shop}
                </View>
              ))}
            </View>
            <View className='products-page__filters-row products-page__filters-row--second'>
              {categoryOptions.map(category => (
                <View
                  key={category}
                  className={`products-page__filters-chip ${
                    (category === '全部分类' && !state.filters.category) || state.filters.category === category
                      ? 'products-page__filters-chip--active' 
                      : ''
                  }`}
                  onClick={() => handleFilterChange('category', category === '全部分类' ? '' : category)}
                >
                  {category}
                </View>
              ))}
              {(state.filters.shop || state.filters.category || state.searchQuery) && (
                <View
                  className='products-page__filters-chip'
                  onClick={handleClearFilters}
                  style={{ background: '#ef4444', color: '#ffffff', border: 'none' }}
                >
                  <MaterialIcons name='clear' size={16} style={{ marginRight: '4rpx' }} />
                  清除
                </View>
              )}
            </View>
          </View>

          {/* 内容区域 */}
          <View className='products-page__content'>
            {state.loading && state.products.length === 0 ? (
              <View className='products-page__loading'>
                <MaterialIcons name='hourglass_empty' size={40} className='products-page__loading-icon' />
                <Text className='products-page__loading-text'>加载中...</Text>
              </View>
            ) : state.products.length === 0 ? (
              <View className='products-page__empty'>
                <MaterialIcons name='inventory_2' size={80} className='products-page__empty-icon' />
                <Text className='products-page__empty-text'>暂无产品数据</Text>
                <Text className='products-page__empty-desc'>请检查筛选条件或稍后重试</Text>
              </View>
            ) : (
              <DataTable
                columns={columns as DataTableColumn[]}
                dataSource={state.products as unknown as Record<string, unknown>[]}
                loading={state.loading}
                emptyText='暂无产品数据'
                pagination={{
                  current: state.pagination.page,
                  pageSize: state.pagination.pageSize,
                  total: state.pagination.total
                }}
                onPageChange={(page, pageSize) => {
                  setState(prev => ({
                    ...prev,
                    pagination: { ...prev.pagination, page, pageSize }
                  }))
                }}
              />
            )}
          </View>
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default ProductsPage