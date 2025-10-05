import React, { useState, useEffect, useCallback, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'
import { PageHeader, SectionCard, StatsGrid, FilterChips } from '@/components/common'

/**
 * APIs
 */
import { getProducts } from '@/services/products'

/**
 * Hooks
 */
import useListQuery, { type ListFetcherParams } from '@/hooks/useListQuery'
import useFilters from '@/hooks/useFilters'
import { useUserStore } from '@/stores/userStore'

/**
 * Types
 */
import type { DataTableColumn } from '@/components/DataTable'
import type { StatsGridItem } from '@/components/common'
import type { Product } from '@/types'

import './index.scss'

type ProductsResponse = {
  list: Product[]
  total: number
  totalPages: number
  page: number
  stats?: {
    total: number
    shops: number
    categories: number
  }
}

type ProductsQueryFilters = {
  search?: string
  shop?: string
  category?: string
}

type ProductsStats = {
  total: number
  shops: number
  categories: number
}

const SHOP_OPTIONS = ['天猫旗舰店', '京东专卖店', '拼多多官店', '独立官网']
const CATEGORY_OPTIONS = ['电子产品', '服装配饰', '家居用品', '运动户外', '美妆护肤']

const ProductsPage: React.FC = () => {
  const { userInfo } = useUserStore()
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  const filterManager = useFilters<'shop' | 'category'>({
    config: {
      shop: { multiple: false, defaultValue: null },
      category: { multiple: false, defaultValue: null }
    }
  })
  const { values: filterValues, setValue: setFilterValue, clearAll: clearAllFilters } = filterManager

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const list = useListQuery<Product, ProductsResponse, ProductsQueryFilters, ProductsStats>({
    fetcher: async (params: ListFetcherParams<ProductsQueryFilters>) => {
      const response = await getProducts({
        page: params.page,
        pageSize: params.pageSize,
        search: params.search ?? '',
        filters: {
          shop: params.shop ?? '',
          category: params.category ?? ''
        }
      })

      if (response.code !== 0) {
        throw new Error(response.msg)
      }

      return response.data
    },
    transform: (data, previousItems, params) => {
      const items = params.refresh ? data.list : [...previousItems, ...data.list]
      const stats: ProductsStats = data.stats ?? {
        total: data.total,
        shops: data.stats?.shops ?? 0,
        categories: data.stats?.categories ?? 0
      }

      return {
        items,
        total: data.total,
        page: data.page,
        pageSize: params.pageSize,
        hasMore: data.page < data.totalPages,
        extra: stats
      }
    },
    initialItems: [],
    initialFilters: { search: '', shop: '', category: '' },
    pageSize: 10,
    autoFetch: false
  })

  const {
    items,
    loading,
    refreshing,
    loadingMore,
    total,
    page,
    pageSize,
    extra,
    setFilters: applyFilters,
    load,
    refresh,
    setPageSize
  } = list

  const appliedFilters = useMemo<ProductsQueryFilters>(() => ({
    search: debouncedSearch || '',
    shop: typeof filterValues.shop === 'string' ? filterValues.shop : '',
    category: typeof filterValues.category === 'string' ? filterValues.category : ''
  }), [debouncedSearch, filterValues])

  useEffect(() => {
    applyFilters(appliedFilters, { refresh: true })
  }, [appliedFilters, applyFilters])

  const statsItems = useMemo<StatsGridItem[]>(() => {
    const stats = extra ?? { total, shops: 0, categories: 0 }
    return [
      {
        key: 'total',
        label: '总产品',
        value: stats.total,
        iconName: 'inventory',
        iconColor: '#3b82f6'
      },
      {
        key: 'shops',
        label: '店铺数',
        value: stats.shops,
        iconName: 'store',
        iconColor: '#10b981'
      },
      {
        key: 'categories',
        label: '分类数',
        value: stats.categories,
        iconName: 'category',
        iconColor: '#f59e0b'
      }
    ]
  }, [extra, total])

  const handleSearchChange = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleShopChange = useCallback((values: string[]) => {
    setFilterValue('shop', values[0] ?? null)
  }, [setFilterValue])

  const handleCategoryChange = useCallback((values: string[]) => {
    setFilterValue('category', values[0] ?? null)
  }, [setFilterValue])

  const handleClearFilters = useCallback(() => {
    setSearchValue('')
    clearAllFilters()
    applyFilters({ search: '', shop: '', category: '' }, { refresh: true })
  }, [applyFilters, clearAllFilters])

  const handleRefresh = useCallback(async () => {
    await refresh()
  }, [refresh])

  const handlePageChange = useCallback((nextPage: number, nextPageSize: number) => {
    if (nextPageSize !== pageSize) {
      setPageSize(nextPageSize)
    }
    load({ append: false, page: nextPage })
  }, [load, pageSize, setPageSize])

  const handleViewProduct = useCallback((product: Product) => {
    Taro.showModal({
      title: product.name,
      content: `店铺: ${product.shop}\n分类: ${product.category}\n包装: ${product.packaging || '无'}\n备注: ${product.remark || '无'}`,
      showCancel: false,
      confirmText: '确定'
    })
  }, [])

  const columns = useMemo<DataTableColumn[]>(() => [
    {
      key: 'name',
      title: '产品昵称',
      dataIndex: 'name',
      width: 160,
      fixed: 'left',
      render: (value, record) => (
        <View
          className='data-table__body-cell--highlight'
          onClick={() => handleViewProduct(record as Product)}
        >
          {value as string}
        </View>
      )
    },
    { key: 'shop', title: '店铺', dataIndex: 'shop', width: 120 },
    { key: 'category', title: '产品分类', dataIndex: 'category', width: 120 },
    {
      key: 'info',
      title: '产品信息',
      dataIndex: 'info',
      width: 200,
      render: (value) => (
        <View className='products-page__cell-ellipsis'>
          {(value as string) ?? '-'}
        </View>
      )
    },
    {
      key: 'packaging',
      title: '产品包装',
      dataIndex: 'packaging',
      width: 150,
      render: (value) => (value as string) ?? '-'
    },
    {
      key: 'outerBox',
      title: '产品外箱',
      dataIndex: 'outerBox',
      width: 150,
      render: (value) => (value as string) ?? '-'
    },
    {
      key: 'accessories',
      title: '配件信息',
      dataIndex: 'accessories',
      width: 200,
      render: (value) => (
        <View className='products-page__cell-ellipsis'>
          {(value as string) ?? '-'}
        </View>
      )
    },
    {
      key: 'remark',
      title: '备注',
      dataIndex: 'remark',
      width: 200,
      render: (value) => (
        <View className='products-page__cell-ellipsis'>
          {(value as string) ?? '-'}
        </View>
      )
    }
  ], [handleViewProduct])

  const selectedShopValues = useMemo(() => (
    typeof filterValues.shop === 'string' && filterValues.shop ? [filterValues.shop] : []
  ), [filterValues.shop])

  const selectedCategoryValues = useMemo(() => (
    typeof filterValues.category === 'string' && filterValues.category ? [filterValues.category] : []
  ), [filterValues.category])

  const shopFilterOptions = useMemo(() => (
    SHOP_OPTIONS.map(shop => ({ value: shop, label: shop }))
  ), [])

  const categoryFilterOptions = useMemo(() => (
    CATEGORY_OPTIONS.map(category => ({ value: category, label: category }))
  ), [])

  const isLoading = loading || refreshing || loadingMore

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
          <PageHeader
            title='产品管理'
            description='查看和管理所有产品信息'
            compact
          >
            <StatsGrid items={statsItems} />
          </PageHeader>

          <SectionCard
            title='筛选条件'
            description='通过店铺、分类或关键字快速定位产品'
            compact
            footer={(
              <View className='products-page__filter-actions'>
                <Text className='products-page__filter-reset' onClick={handleClearFilters}>清除筛选</Text>
              </View>
            )}
          >
            <SearchBar
              value={searchValue}
              placeholder='搜索产品昵称或SKU'
              onChange={handleSearchChange}
              onSearch={handleSearchChange}
            />
            <View className='products-page__filters'>
              <FilterChips
                options={shopFilterOptions}
                selectedValues={selectedShopValues}
                onChange={handleShopChange}
                allowClear
                scrollable
              />
              <FilterChips
                options={categoryFilterOptions}
                selectedValues={selectedCategoryValues}
                onChange={handleCategoryChange}
                allowClear
                scrollable
              />
            </View>
          </SectionCard>

          <SectionCard title='产品列表' compact flat>
            <DataTable
              columns={columns}
              dataSource={items as unknown as Record<string, unknown>[]}
              loading={isLoading}
              emptyText='暂无产品数据'
              pagination={{
                current: page,
                pageSize,
                total,
                showSizeChanger: true,
                pageSizeOptions: [10, 20, 50]
              }}
              onPageChange={handlePageChange}
            />
          </SectionCard>
        </View>
      </PullToRefresh>
    </MobileLayout>
  )
}

export default ProductsPage
