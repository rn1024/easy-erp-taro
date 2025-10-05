import React, { useEffect, useMemo, useRef, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import InventoryCard from '@/components/InventoryCard'
import FormModal from '@/components/FormModal'
import withAuth from '@/components/AuthGuard'
import SearchBar from '@/components/SearchBar'
import { SectionCard, StatsGrid, FilterChips } from '@/components/common'

/**
 * Hooks
 */
import useListQuery from '@/hooks/useListQuery'
import useFilters from '@/hooks/useFilters'

/**
 * Types
 */
import { Permission, type SpareInventory } from '@/types/admin'
import type { FormField, FormModalMethods } from '@/components/FormModal'
import type { StatsGridItem } from '@/components/common'

import './index.scss'

type SpareInventoryFilters = {
  search?: string
  shop?: string
  category?: string
  spareType?: string
}

type SpareInventoryResponse = {
  list: SpareInventory[]
  total: number
  totalPages: number
  page: number
  stats: SpareInventoryStats
}

type SpareInventoryStats = {
  total: number
  lowStock: number
  shops: number
  categories: number
}

const SHOPS = ['天猫旗舰店', '京东专卖店', '拼多多官店', '独立官网']
const CATEGORIES = ['电子产品', '服装配饰', '家居用品', '运动户外', '美妆护肤']
const LOCATIONS = ['A1-01', 'A1-02', 'A2-01', 'A2-02', 'B1-01', 'B1-02', 'B2-01', 'B2-02']
const SPARE_TYPES: Array<'套' | '个'> = ['套', '个']

const MOCK_DATA: SpareInventory[] = [
  {
    id: '1',
    shopId: 'shop1',
    categoryId: 'cat1',
    productId: 'P001',
    spareType: '套',
    location: 'A1-01',
    quantity: 85,
    shop: { id: 'shop1', nickname: '天猫旗舰店' },
    category: { id: 'cat1', name: '电子产品' },
    product: { id: 'P001', code: 'P001', specification: 'iPhone 保护套配件包', sku: 'SKU001' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    shopId: 'shop2',
    categoryId: 'cat2',
    productId: 'P002',
    spareType: '个',
    location: 'B1-02',
    quantity: 6,
    shop: { id: 'shop2', nickname: '京东专卖店' },
    category: { id: 'cat2', name: '服装配饰' },
    product: { id: 'P002', code: 'P002', specification: '羽绒服拉链头备用件', sku: 'SKU002' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    shopId: 'shop3',
    categoryId: 'cat3',
    productId: 'P003',
    spareType: '套',
    location: 'A2-01',
    quantity: 32,
    shop: { id: 'shop3', nickname: '拼多多官店' },
    category: { id: 'cat3', name: '家居用品' },
    product: { id: 'P003', code: 'P003', specification: '扫地机器人滤网组合', sku: 'SKU003' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    shopId: 'shop4',
    categoryId: 'cat4',
    productId: 'P004',
    spareType: '个',
    location: 'B2-01',
    quantity: 120,
    shop: { id: 'shop4', nickname: '独立官网' },
    category: { id: 'cat4', name: '运动户外' },
    product: { id: 'P004', code: 'P004', specification: '跑步鞋鞋带备用', sku: 'SKU004' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    shopId: 'shop1',
    categoryId: 'cat5',
    productId: 'P005',
    spareType: '个',
    location: 'A1-02',
    quantity: 3,
    shop: { id: 'shop1', nickname: '天猫旗舰店' },
    category: { id: 'cat5', name: '美妆护肤' },
    product: { id: 'P005', code: 'P005', specification: '精华液滴管头', sku: 'SKU005' },
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
]

const SpareInventoryPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SpareInventory | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  const formModalRef = useRef<FormModalMethods | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue.trim())
    }, 300)
    return () => clearTimeout(timer)
  }, [searchValue])

  const filterManager = useFilters<'shop' | 'category' | 'spareType'>({
    config: {
      shop: { multiple: false, defaultValue: null },
      category: { multiple: false, defaultValue: null },
      spareType: { multiple: false, defaultValue: null }
    }
  })

  const { values: filterValues, setValue: setFilterValue, clearAll: clearAllFilters } = filterManager

  const list = useListQuery<SpareInventory, SpareInventoryResponse, SpareInventoryFilters, SpareInventoryStats>({
    fetcher: async ({ page, pageSize, search = '', shop = '', category = '', spareType = '' }) => {
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
        const matchSpareType = spareType ? item.spareType === spareType : true

        return matchKeyword && matchShop && matchCategory && matchSpareType
      })

      const total = filtered.length
      const totalPages = Math.max(1, Math.ceil(total / pageSize))
      const currentPage = Math.min(page, totalPages)
      const start = (currentPage - 1) * pageSize
      const listData = filtered.slice(start, start + pageSize)

      const stats: SpareInventoryStats = {
        total,
        lowStock: filtered.filter(item => item.quantity < 10).length,
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
    initialFilters: { search: '', shop: '', category: '', spareType: '' },
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
    refresh,
    setFilters
  } = list

  const appliedFilters = useMemo<SpareInventoryFilters>(() => ({
    search: debouncedSearch || '',
    shop: typeof filterValues.shop === 'string' ? filterValues.shop : '',
    category: typeof filterValues.category === 'string' ? filterValues.category : '',
    spareType: typeof filterValues.spareType === 'string' ? filterValues.spareType : ''
  }), [debouncedSearch, filterValues])

  useEffect(() => {
    setFilters(appliedFilters, { refresh: true })
  }, [appliedFilters, setFilters])

  const stats = useMemo<SpareInventoryStats>(() => (
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

  const formFields: FormField[] = useMemo(() => ([
    {
      name: 'shop',
      label: '店铺',
      type: 'select',
      required: true,
      options: SHOPS.map(shop => ({ label: shop, value: shop }))
    },
    {
      name: 'category',
      label: '产品分类',
      type: 'select',
      required: true,
      options: CATEGORIES.map(cat => ({ label: cat, value: cat }))
    },
    {
      name: 'productName',
      label: '产品昵称',
      type: 'input',
      required: true,
      placeholder: '请输入产品昵称'
    },
    {
      name: 'spareType',
      label: '散件类型',
      type: 'select',
      required: true,
      options: SPARE_TYPES.map(type => ({ label: type, value: type }))
    },
    {
      name: 'location',
      label: '货位',
      type: 'select',
      required: true,
      options: LOCATIONS.map(loc => ({ label: loc, value: loc }))
    },
    {
      name: 'quantity',
      label: '库存数量',
      type: 'number',
      required: true,
      placeholder: '请输入库存数量'
    }
  ]), [])

  const handleAddInventory = (): void => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  const handleEditInventory = (item: SpareInventory): void => {
    setEditingItem(item)
    setShowFormModal(true)
    formModalRef.current?.setValues?.({
      shop: item.shop.nickname,
      category: item.category.name,
      productName: item.product.specification,
      spareType: item.spareType,
      location: item.location,
      quantity: item.quantity
    })
  }

  const handleDeleteInventory = (item: SpareInventory): void => {
    Taro.showModal({
      title: '删除散件库存',
      content: `确认删除【${item.product.specification}】的库存记录吗？`,
      success: async (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已删除（示例）', icon: 'success' })
          await refresh()
        }
      }
    })
  }

  const handleSubmit = async (_values: Record<string, unknown>): Promise<void> => {
    setFormLoading(true)
    await new Promise(resolve => setTimeout(resolve, 500))
    setFormLoading(false)
    setShowFormModal(false)
    Taro.showToast({ title: editingItem ? '已更新' : '已创建', icon: 'success' })
    await refresh()
  }

  const selectedShopValues = useMemo(
    () => (typeof filterValues.shop === 'string' && filterValues.shop ? [filterValues.shop] : []),
    [filterValues.shop]
  )

  const selectedCategoryValues = useMemo(
    () => (typeof filterValues.category === 'string' && filterValues.category ? [filterValues.category] : []),
    [filterValues.category]
  )

  const selectedSpareTypeValues = useMemo(
    () => (typeof filterValues.spareType === 'string' && filterValues.spareType ? [filterValues.spareType] : []),
    [filterValues.spareType]
  )

  const handleShopFilterChange = (values: string[]): void => {
    setFilterValue('shop', values[0] ?? null)
  }

  const handleCategoryFilterChange = (values: string[]): void => {
    setFilterValue('category', values[0] ?? null)
  }

  const handleSpareTypeFilterChange = (values: string[]): void => {
    setFilterValue('spareType', values[0] ?? null)
  }

  const clearFilters = (): void => {
    setSearchValue('')
    clearAllFilters()
    setFilters({ search: '', shop: '', category: '', spareType: '' }, { refresh: true })
  }

  const statsHeader = (
    <StatsGrid items={statsItems} />
  )

  return (
    <MobileLayout className='spare-inventory'>
      <View className='spare-inventory__content'>
        <SectionCard
          title='散件库存概览'
          description='实时掌握散件库存状态'
          compact
        >
          {statsHeader}
        </SectionCard>

        <SectionCard
          title='筛选条件'
          description='通过关键字、店铺、分类或散件类型组合过滤'
          compact
          footer={(
            <View className='spare-inventory__filter-actions'>
              <Text className='spare-inventory__filter-reset' onClick={clearFilters}>
                清除筛选
              </Text>
            </View>
          )}
        >
          <SearchBar
            value={searchValue}
            placeholder='搜索产品昵称、SKU或店铺'
            onChange={setSearchValue}
            onSearch={setSearchValue}
          />
          <View className='spare-inventory__filters'>
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
            <FilterChips
              options={SPARE_TYPES.map(type => ({ value: type, label: type }))}
              selectedValues={selectedSpareTypeValues}
              onChange={handleSpareTypeFilterChange}
              allowClear
            />
          </View>
        </SectionCard>

        <SectionCard
          title='散件库存列表'
          description={`共 ${total} 条记录`}
          compact
          actions={[
            <Button
              key='add'
              type='primary'
              size='mini'
              onClick={handleAddInventory}
            >
              新增库存
            </Button>
          ]}
        >
          <View className='spare-inventory__list'>
            {items.map(item => (
              <InventoryCard
                key={item.id}
                item={item}
                type='spare'
                onEdit={handleEditInventory}
                onDelete={handleDeleteInventory}
              />
            ))}

            {!loading && !refreshing && items.length === 0 && (
              <View className='spare-inventory__empty'>
                <Text className='spare-inventory__empty-title'>暂无符合条件的散件库存</Text>
                <Text className='spare-inventory__empty-text'>可以尝试调整筛选条件或新增库存记录</Text>
              </View>
            )}
          </View>

          {hasMore && (
            <View className='spare-inventory__load-more'>
              <Button
                loading={loadingMore}
                onClick={() => loadMore()}
                size='small'
                type='primary'
              >
                加载更多
              </Button>
            </View>
          )}
        </SectionCard>
      </View>

      <FormModal
        ref={formModalRef}
        title={editingItem ? '编辑散件库存' : '新增散件库存'}
        visible={showFormModal}
        loading={formLoading}
        fields={formFields}
        onClose={() => setShowFormModal(false)}
        onSubmit={handleSubmit}
        permissions={[Permission.INVENTORY_WRITE]}
      />
    </MobileLayout>
  )
}

export default withAuth(SpareInventoryPage, [Permission.INVENTORY_READ])
