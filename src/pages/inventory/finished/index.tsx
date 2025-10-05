import React, { useState, useEffect, useMemo } from 'react'
import { View, Text } from '@tarojs/components'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import InventoryCard from '@/components/InventoryCard'
import { PageHeader, SectionCard, StatsGrid, FilterChips } from '@/components/common'

/**
 * Hooks
 */
import useListQuery from '@/hooks/useListQuery'
import useFilters from '@/hooks/useFilters'

/**
 * Types
 */
import type { FinishedInventory } from '@/types/admin'
import type { StatsGridItem } from '@/components/common'

import './index.scss'

type FinishedInventoryFilters = {
  search?: string
  shop?: string
  category?: string
}

type FinishedInventoryResponse = {
  list: FinishedInventory[]
  total: number
  totalPages: number
  page: number
  stats: FinishedInventoryStats
}

type FinishedInventoryStats = {
  total: number
  lowStock: number
  shops: number
  categories: number
}

const SHOPS = ['天猫旗舰店', '京东专卖店', '拼多多官店', '独立官网']
const CATEGORIES = ['数码配件', '服装配饰', '智能家电', '运动户外', '美妆护肤']

const MOCK_DATA: FinishedInventory[] = [
  {
    id: '1',
    shopId: 'shop-1',
    categoryId: 'category-1',
    productId: 'product-1',
    boxSize: '15x10x5cm',
    weight: 2.5,
    location: 'A1-01',
    stockQuantity: 120,
    shop: { id: 'shop-1', nickname: '天猫旗舰店' },
    category: { id: 'category-1', name: '数码配件' },
    product: { id: 'product-1', code: 'P-001', specification: 'iPhone 15 Pro Max 钛金属保护壳', sku: 'SKU-001' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    shopId: 'shop-2',
    categoryId: 'category-2',
    productId: 'product-2',
    boxSize: '60x40x20cm',
    weight: 8,
    location: 'B1-02',
    stockQuantity: 8,
    shop: { id: 'shop-2', nickname: '京东专卖店' },
    category: { id: 'category-2', name: '服装配饰' },
    product: { id: 'product-2', code: 'P-002', specification: '冬季羽绒服男款加厚保暖外套', sku: 'SKU-002' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    shopId: 'shop-3',
    categoryId: 'category-3',
    productId: 'product-3',
    boxSize: '45x45x25cm',
    weight: 12.5,
    location: 'A2-01',
    stockQuantity: 25,
    shop: { id: 'shop-3', nickname: '拼多多官店' },
    category: { id: 'category-3', name: '智能家电' },
    product: { id: 'product-3', code: 'P-003', specification: '智能扫地机器人带拖地功能', sku: 'SKU-003' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

const FinishedInventoryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const filterManager = useFilters<'shop' | 'category'>({
    config: {
      shop: { multiple: false, defaultValue: null },
      category: { multiple: false, defaultValue: null }
    }
  })

  const { values: filterValues, setValue: setFilterValue, clearAll: clearAllFilters } = filterManager

  const list = useListQuery<FinishedInventory, FinishedInventoryResponse, FinishedInventoryFilters, FinishedInventoryStats>({
    fetcher: async ({ page, pageSize, search = '', shop = '', category = '' }) => {
      await new Promise(resolve => setTimeout(resolve, 200))

      const baseData = [...MOCK_DATA]
      const filtered = baseData.filter(item => {
        const keyword = search.toLowerCase()
        const matchKeyword = keyword
          ? item.product.specification.toLowerCase().includes(keyword) ||
            item.shop.nickname.toLowerCase().includes(keyword) ||
            item.category.name.toLowerCase().includes(keyword) ||
            item.product.sku.toLowerCase().includes(keyword)
          : true

        const matchShop = shop ? item.shop.nickname === shop : true
        const matchCategory = category ? item.category.name === category : true

        return matchKeyword && matchShop && matchCategory
      })

      const total = filtered.length
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const currentPage = Math.min(page, totalPages)
      const start = (currentPage - 1) * pageSize
      const listData = filtered.slice(start, start + pageSize)

      const stats: FinishedInventoryStats = {
        total,
        lowStock: filtered.filter(item => item.stockQuantity < 20).length,
        shops: new Set(filtered.map(item => item.shop.nickname)).size,
        categories: new Set(filtered.map(item => item.category.name)).size
      }

      return {
        list: listData,
        total,
        totalPages,
        page: currentPage,
        stats
      }
    },
    transform: (response, previousItems, params) => ({
      items: params.refresh ? response.list : [...previousItems, ...response.list],
      total: response.total,
      page: response.page,
      pageSize: params.pageSize,
      hasMore: response.page < response.totalPages,
      extra: response.stats
    }),
    initialItems: [],
    initialFilters: { search: '', shop: '', category: '' },
    pageSize: 10,
    autoFetch: false
  })

  const {
    items,
    total,
    hasMore,
    loading,
    refreshing,
    loadingMore,
    extra,
    loadMore,
    setFilters
  } = list

  const appliedFilters = useMemo<FinishedInventoryFilters>(() => ({
    search: debouncedSearch || '',
    shop: typeof filterValues.shop === 'string' ? filterValues.shop : '',
    category: typeof filterValues.category === 'string' ? filterValues.category : ''
  }), [debouncedSearch, filterValues])

  useEffect(() => {
    setFilters(appliedFilters, { refresh: true })
  }, [appliedFilters, setFilters])

  const stats = useMemo<FinishedInventoryStats>(() => (
    extra ?? { total: 0, lowStock: 0, shops: 0, categories: 0 }
  ), [extra])

  const statsItems = useMemo<StatsGridItem[]>(() => [
    {
      key: 'total',
      label: '库存总量',
      value: stats.total,
      iconName: 'inventory',
      iconColor: '#3b82f6'
    },
    {
      key: 'low',
      label: '低库存',
      value: stats.lowStock,
      iconName: 'warning',
      iconColor: '#f59e0b'
    },
    {
      key: 'shops',
      label: '覆盖店铺',
      value: stats.shops,
      iconName: 'store',
      iconColor: '#10b981'
    }
  ], [stats])

  const selectedShopValues = useMemo(
    () => (typeof filterValues.shop === 'string' && filterValues.shop ? [filterValues.shop] : []),
    [filterValues.shop]
  )

  const selectedCategoryValues = useMemo(
    () => (typeof filterValues.category === 'string' && filterValues.category ? [filterValues.category] : []),
    [filterValues.category]
  )

  const handleShopFilterChange = (values: string[]): void => {
    setFilterValue('shop', values[0] ?? null)
  }

  const handleCategoryFilterChange = (values: string[]): void => {
    setFilterValue('category', values[0] ?? null)
  }

  const clearFilters = (): void => {
    setSearchValue('')
    clearAllFilters()
    setFilters({ search: '', shop: '', category: '' }, { refresh: true })
  }

  return (
    <MobileLayout className='finished-inventory'>
      <View className='finished-inventory__content'>
        <PageHeader
          title='成品库存管理'
          description='实时掌握成品库存状态'
          compact
        >
          <StatsGrid items={statsItems} />
        </PageHeader>

        <SectionCard
          title='筛选条件'
          description='通过关键字、店铺或分类组合过滤'
          compact
          footer={(
            <View className='finished-inventory__filter-actions'>
              <Text className='finished-inventory__filter-reset' onClick={clearFilters}>
                清除筛选
              </Text>
            </View>
          )}
        >
          <SearchBar
            value={searchValue}
            placeholder='搜索产品名称、SKU或店铺'
            onChange={setSearchValue}
            onSearch={setSearchValue}
          />
          <View className='finished-inventory__filters'>
            <FilterChips
              options={SHOPS.map(shop => ({ value: shop, label: shop }))}
              selectedValues={selectedShopValues}
              onChange={handleShopFilterChange}
              allowClear
              scrollable
            />
            <FilterChips
              options={CATEGORIES.map(category => ({ value: category, label: category }))}
              selectedValues={selectedCategoryValues}
              onChange={handleCategoryFilterChange}
              allowClear
              scrollable
            />
          </View>
        </SectionCard>

        <SectionCard
          title='成品库存列表'
          description={`共 ${total} 条记录`}
          compact
        >
          <View className='finished-inventory__list'>
            {items.map(item => (
              <InventoryCard key={item.id} item={item} type='finished' />
            ))}

            {!loading && !refreshing && items.length === 0 && (
              <View className='finished-inventory__empty'>
                <Text className='finished-inventory__empty-title'>暂无符合条件的成品库存</Text>
                <Text className='finished-inventory__empty-text'>可以尝试调整筛选条件或新增库存记录</Text>
              </View>
            )}
          </View>

          {hasMore && (
            <View className='finished-inventory__load-more'>
              <Text 
                className='finished-inventory__load-more-text'
                onClick={() => loadMore()}
              >
                {loadingMore ? '加载中...' : '加载更多'}
              </Text>
            </View>
          )}
        </SectionCard>
      </View>
    </MobileLayout>
  )
}

export default FinishedInventoryPage
