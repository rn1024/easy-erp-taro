import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button, Input } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import InventoryCard from '@/components/InventoryCard'
import FormModal from '@/components/FormModal'
import withAuth from '@/components/AuthGuard'
import { Permission } from '@/types/admin'
import type { SpareInventory } from '@/types/admin'
import type { FormField, FormModalMethods } from '@/components/FormModal'
import './index.scss'

const SpareInventoryPage: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<SpareInventory[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  // 搜索和筛选
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedShop, setSelectedShop] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedSpareType, setSelectedSpareType] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // 表单相关
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingItem, setEditingItem] = useState<SpareInventory | null>(null)
  const [formLoading, setFormLoading] = useState(false)
  
  // 选项数据
  const [shops, _setShops] = useState<string[]>([
    '天猫旗舰店', '京东专卖店', '拼多多官店', '独立官网'
  ])
  const [categories, _setCategories] = useState<string[]>([
    '电子产品', '服装配饰', '家居用品', '运动户外', '美妆护肤'
  ])
  const [locations, _setLocations] = useState<string[]>([
    'A1-01', 'A1-02', 'A2-01', 'A2-02', 'B1-01', 'B1-02', 'B2-01', 'B2-02'
  ])
  const [spareTypes] = useState<('套' | '个')[]>(['套', '个'])
  
  const formModalRef = useRef<FormModalMethods | null>(null)

  // 模拟数据
  const mockData: SpareInventory[] = [
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

  // 表单字段配置
  const formFields: FormField[] = [
    {
      name: 'shop',
      label: '店铺',
      type: 'select',
      required: true,
      options: shops.map(shop => ({ label: shop, value: shop }))
    },
    {
      name: 'category',
      label: '产品分类',
      type: 'select',
      required: true,
      options: categories.map(cat => ({ label: cat, value: cat }))
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
      options: spareTypes.map(type => ({ label: type, value: type }))
    },
    {
      name: 'location',
      label: '货位',
      type: 'select',
      required: true,
      options: locations.map(loc => ({ label: loc, value: loc }))
    },
    {
      name: 'quantity',
      label: '库存数量',
      type: 'number',
      required: true,
      placeholder: '请输入库存数量'
    }
  ]

  // 加载数据
  const loadData = async (page = 1, append = false) => {
    try {
      if (!append) {
        setLoading(true)
      }
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredData = [...mockData]
      
      // 应用搜索过滤
      if (searchKeyword) {
        filteredData = filteredData.filter(item =>
          item.product.specification.includes(searchKeyword) ||
          item.shop.nickname.includes(searchKeyword) ||
          item.category.name.includes(searchKeyword)
        )
      }
      
      if (selectedShop) {
        filteredData = filteredData.filter(item => item.shop.nickname === selectedShop)
      }
      
      if (selectedCategory) {
        filteredData = filteredData.filter(item => item.category.name === selectedCategory)
      }
      
      if (selectedSpareType) {
        filteredData = filteredData.filter(item => item.spareType === selectedSpareType)
      }
      
      if (append) {
        setData(prev => [...prev, ...filteredData])
      } else {
        setData(filteredData)
      }
      
      // 模拟分页
      setHasMore(filteredData.length >= pageSize && page < 3)
      setCurrentPage(page)
      
    } catch (error) {
      // 加载散件库存失败: error
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'error'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 下拉刷新
  const handleRefresh = async () => {
    setRefreshing(true)
    setCurrentPage(1)
    await loadData(1, false)
  }

  // 上拉加载更多
  const handleLoadMore = async () => {
    if (!hasMore || loading) return
    await loadData(currentPage + 1, true)
  }

  // 初始化
  useEffect(() => {
    loadData()
  }, [])

  // 搜索和筛选变化时重新加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      loadData(1, false)
    }, 300)
    return () => clearTimeout(timer)
  }, [searchKeyword, selectedShop, selectedCategory, selectedSpareType])

  // 新增库存
  const handleAdd = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  // 编辑库存
  const handleEdit = (item: SpareInventory) => {
    setEditingItem(item)
    setShowFormModal(true)
  }

  // 删除库存
  const handleDelete = (item: SpareInventory) => {
    Taro.showModal({
      title: '删除确认',
      content: `确定要删除"${item.product.specification}"吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            // 模拟API调用
            await new Promise(resolve => setTimeout(resolve, 500))
            
            // 从列表中移除
            setData(prev => prev.filter(d => d.id !== item.id))
            
            Taro.showToast({
              title: '删除成功',
              icon: 'success'
            })
          } catch (error) {
            // 删除失败: error
            Taro.showToast({
              title: '删除失败，请重试',
              icon: 'error'
            })
          }
        }
      }
    })
  }

  // 表单提交
  const handleFormSubmit = async (formData: Record<string, unknown>) => {
    try {
      setFormLoading(true)
      
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (editingItem) {
        // 编辑模式
        const updatedItem = { ...editingItem, ...formData }
        setData(prev => prev.map(item => 
          item.id === editingItem.id ? updatedItem : item
        ))
        Taro.showToast({
          title: '编辑成功',
          icon: 'success'
        })
      } else {
        // 新增模式
        const newItem: SpareInventory = {
          id: Date.now().toString(),
          shopId: 'shop1',
          categoryId: 'cat1',
          productId: `P${Date.now()}`,
          spareType: '个',
          location: 'A1-01',
          quantity: 0,
          shop: { id: 'shop1', nickname: '天猫旗舰店' },
          category: { id: 'cat1', name: '电子产品' },
          product: { id: `P${Date.now()}`, code: `P${Date.now()}`, specification: '新产品', sku: `SKU${Date.now()}` },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          ...formData
        }
        setData(prev => [newItem, ...prev])
        Taro.showToast({
          title: '新增成功',
          icon: 'success'
        })
      }
      
      setShowFormModal(false)
    } catch (error) {
      // 保存失败: error
      Taro.showToast({
        title: '保存失败，请重试',
        icon: 'error'
      })
    } finally {
      setFormLoading(false)
    }
  }

  // 清空筛选
  const handleClearFilters = () => {
    setSearchKeyword('')
    setSelectedShop('')
    setSelectedCategory('')
    setSelectedSpareType('')
  }

  return (
    <MobileLayout>
      <View className='spare-inventory-page'>
        {/* 搜索栏 */}
        <View className='spare-inventory-page__search'>
          <View className='search-input'>
            <MaterialIcons name='search' size={20} color='#6b7280' />
            <Input
              placeholder='搜索产品名称、店铺或分类'
              value={searchKeyword}
              onChange={setSearchKeyword}
              clearable
            />
          </View>
          <View 
            className='filter-btn'
            onClick={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons 
              name='filter_list' 
              size={20} 
              color={showFilters ? '#3b82f6' : '#6b7280'} 
            />
          </View>
        </View>

        {/* 筛选器 */}
        {showFilters && (
          <View className='spare-inventory-page__filters'>
            <View className='filter-row'>
              <View className='filter-chips'>
                <Text className='filter-label'>店铺筛选:</Text>
                <View className='filter-chip-group'>
                  <View 
                    className={`filter-chip ${!selectedShop ? 'filter-chip--active' : ''}`}
                    onClick={() => setSelectedShop('')}
                  >
                    <Text>全部</Text>
                  </View>
                  {shops.map(shop => (
                    <View 
                      key={shop}
                      className={`filter-chip ${selectedShop === shop ? 'filter-chip--active' : ''}`}
                      onClick={() => setSelectedShop(shop)}
                    >
                      <Text>{shop}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View className='filter-chips'>
                <Text className='filter-label'>分类筛选:</Text>
                <View className='filter-chip-group'>
                  <View 
                    className={`filter-chip ${!selectedCategory ? 'filter-chip--active' : ''}`}
                    onClick={() => setSelectedCategory('')}
                  >
                    <Text>全部</Text>
                  </View>
                  {categories.map(category => (
                    <View 
                      key={category}
                      className={`filter-chip ${selectedCategory === category ? 'filter-chip--active' : ''}`}
                      onClick={() => setSelectedCategory(category)}
                    >
                      <Text>{category}</Text>
                    </View>
                  ))}
                </View>
              </View>
              
              <View className='filter-chips'>
                <Text className='filter-label'>散件类型:</Text>
                <View className='filter-chip-group'>
                  <View 
                    className={`filter-chip ${!selectedSpareType ? 'filter-chip--active' : ''}`}
                    onClick={() => setSelectedSpareType('')}
                  >
                    <Text>全部</Text>
                  </View>
                  {spareTypes.map(type => (
                    <View 
                      key={type}
                      className={`filter-chip ${selectedSpareType === type ? 'filter-chip--active' : ''}`}
                      onClick={() => setSelectedSpareType(type)}
                    >
                      <Text>{type}</Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>
            
            {(selectedShop || selectedCategory || selectedSpareType) && (
              <View className='filter-actions'>
                <Button 
                  size='small' 
                  fill='outline'
                  onClick={handleClearFilters}
                >
                  清空筛选
                </Button>
              </View>
            )}
          </View>
        )}

        {/* 工具栏 */}
        <View className='spare-inventory-page__toolbar'>
          <Button 
            type='primary' 
            size='small'
            onClick={handleAdd}
            className='add-btn'
          >
            <MaterialIcons name='add' size={16} color='#ffffff' />
            新增散件
          </Button>
        </View>

        {/* 库存列表 */}
        <View className='spare-inventory-page__content'>
          {loading && data.length === 0 ? (
            <View className='loading-state'>
              <MaterialIcons name='hourglass_empty' size={32} color='#6b7280' />
              <Text>加载中...</Text>
            </View>
          ) : data.length === 0 ? (
            <View className='empty-state'>
              <MaterialIcons name='build' size={48} color='#d1d5db' />
              <Text className='empty-text'>暂无散件库存数据</Text>
              <Text className='empty-desc'>点击上方按钮添加散件库存</Text>
            </View>
          ) : (
            <ScrollView
              className='inventory-list'
              refresherEnabled
              refresherTriggered={refreshing}
              onRefresherRefresh={handleRefresh}
              onScrollToLower={handleLoadMore}
              scrollY
            >
              {data.map(item => (
                <InventoryCard
                  key={item.id}
                  item={item}
                  type='spare'
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
              
              {hasMore && (
                <View className='load-more'>
                  <Text>上拉加载更多</Text>
                </View>
              )}
            </ScrollView>
          )}
        </View>

        {/* 表单弹窗 */}
        <FormModal
          ref={formModalRef}
          visible={showFormModal}
          title={editingItem ? '编辑散件库存' : '新增散件库存'}
          fields={formFields}
          initialValues={editingItem ? {
            shop: editingItem.shop.nickname,
            category: editingItem.category.name,
            productName: editingItem.product.specification,
            spareType: editingItem.spareType,
            location: editingItem.location,
            quantity: editingItem.quantity
          } : {}}
          loading={formLoading}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowFormModal(false)}
        />
      </View>
    </MobileLayout>
  )
}

export default withAuth(SpareInventoryPage, {
  requiredPermissions: [Permission.INVENTORY_READ]
})