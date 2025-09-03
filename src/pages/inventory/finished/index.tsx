import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button, Toast as _Toast, Dialog as _Dialog, Input, Picker as _Picker } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import InventoryCard from '@/components/InventoryCard'
import FormModal from '@/components/FormModal'
import withAuth from '@/components/AuthGuard'
import { FinishedInventoryAPI as _FinishedInventoryAPI } from '@/services'
import { Permission } from '@/types/admin'
import type { FinishedInventory } from '@/types/admin'
import type { FormField, FormModalMethods } from '@/components/FormModal'
import './index.scss'

const FinishedInventoryPage: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<FinishedInventory[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  // 搜索和筛选
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedShop, setSelectedShop] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  
  // 表单相关
  const [showFormModal, setShowFormModal] = useState(false)
  const [editingItem, setEditingItem] = useState<FinishedInventory | null>(null)
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
  
  const formModalRef = useRef<FormModalMethods | null>(null)

  // 模拟数据 - 适配新字段格式
  const mockData: FinishedInventory[] = [
    {
      id: '1',
      shopId: 'S001',
      categoryId: 'C001', 
      productId: 'P001',
      boxSize: '15x10x5cm',
      packQuantity: 50,
      weight: 2.5,
      location: 'A1-01',
      stockQuantity: 120,
      shop: { id: 'S001', nickname: '天猫旗舰店' },
      category: { id: 'C001', name: '电子产品' },
      product: { id: 'P001', code: 'IPH15PM001', specification: 'iPhone 15 Pro Max 钛金属保护壳', sku: 'SKU001' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '2',
      shopId: 'S002',
      categoryId: 'C002',
      productId: 'P002',
      boxSize: '60x40x20cm',
      packQuantity: 20,
      weight: 8.0,
      location: 'B1-02',
      stockQuantity: 8,
      shop: { id: 'S002', nickname: '京东专卖店' },
      category: { id: 'C002', name: '服装配饰' },
      product: { id: 'P002', code: 'YRF002', specification: '冬季羽绒服男款加厚保暖外套', sku: 'SKU002' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '3',
      shopId: 'S003',
      categoryId: 'C003',
      productId: 'P003',
      boxSize: '45x45x25cm',
      packQuantity: 10,
      weight: 12.5,
      location: 'A2-01',
      stockQuantity: 25,
      shop: { id: 'S003', nickname: '拼多多官店' },
      category: { id: 'C003', name: '家居用品' },
      product: { id: 'P003', code: 'SDJ003', specification: '智能扫地机器人带拖地功能', sku: 'SKU003' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '4',
      shopId: 'S004',
      categoryId: 'C004',
      productId: 'P004',
      boxSize: '35x25x15cm',
      packQuantity: 30,
      weight: 5.5,
      location: 'B2-01',
      stockQuantity: 65,
      shop: { id: 'S004', nickname: '独立官网' },
      category: { id: 'C004', name: '运动户外' },
      product: { id: 'P004', code: 'RUN004', specification: '专业跑步鞋透气减震运动鞋', sku: 'SKU004' },
      createdAt: '2024-01-01T00:00:00Z',
      updatedAt: '2024-01-01T00:00:00Z'
    },
    {
      id: '5',
      shopId: 'S001',
      categoryId: 'C005',
      productId: 'P005',
      boxSize: '25x20x10cm',
      packQuantity: 100,
      weight: 3.2,
      location: 'A1-02',
      stockQuantity: 5,
      shop: { id: 'S001', nickname: '天猫旗舰店' },
      category: { id: 'C005', name: '美妆护肤' },
      product: { id: 'P005', code: 'COSM005', specification: '水乳套装深层补水保湿精华', sku: 'SKU005' },
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
      name: 'outerSize',
      label: '外箱尺寸',
      type: 'input',
      required: true,
      placeholder: '例如: 40x30x20cm'
    },
    {
      name: 'cartonQty',
      label: '装箱数量',
      type: 'number',
      required: true,
      placeholder: '请输入装箱数量'
    },
    {
      name: 'weight',
      label: '重量(kg)',
      type: 'number',
      required: true,
      precision: 2,
      placeholder: '请输入重量'
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
      
      // 模拟API调用，保持原有逻辑但适配新字段格式
      await new Promise(resolve => setTimeout(resolve, 500))
      
      let filteredData = [...mockData]
      
      // 应用搜索过滤 - 适配新字段格式
      if (searchKeyword) {
        filteredData = filteredData.filter(item =>
          item.product?.specification?.includes(searchKeyword) ||
          item.shop?.nickname?.includes(searchKeyword) ||
          item.category?.name?.includes(searchKeyword)
        )
      }
      
      if (selectedShop) {
        filteredData = filteredData.filter(item => item.shop?.nickname === selectedShop)
      }
      
      if (selectedCategory) {
        filteredData = filteredData.filter(item => item.category?.name === selectedCategory)
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
      // 加载成品库存失败: error
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
  }, [searchKeyword, selectedShop, selectedCategory])

  // 新增库存
  const handleAdd = () => {
    setEditingItem(null)
    setShowFormModal(true)
  }

  // 编辑库存
  const handleEdit = (item: FinishedInventory) => {
    setEditingItem(item)
    setShowFormModal(true)
  }

  // 删除库存
  const handleDelete = (item: FinishedInventory) => {
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
        const newItem: FinishedInventory = {
          id: Date.now().toString(),
          shopId: formData.shop as string || '',
          categoryId: formData.category as string || '',
          productId: `P${Date.now()}`,
          boxSize: formData.outerSize as string || '',
          packQuantity: Number(formData.cartonQty) || 0,
          weight: Number(formData.weight) || 0,
          location: formData.location as string || '',
          stockQuantity: Number(formData.quantity) || 0,
          shop: { id: formData.shop as string || '', nickname: formData.shop as string || '' },
          category: { id: formData.category as string || '', name: formData.category as string || '' },
          product: { id: `P${Date.now()}`, code: '', specification: formData.productName as string || '', sku: '' },
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
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
  }

  return (
    <MobileLayout>
      <View className='finished-inventory-page'>
        {/* 搜索栏 */}
        <View className='finished-inventory-page__search'>
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
          <View className='finished-inventory-page__filters'>
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
            </View>
            
            {(selectedShop || selectedCategory) && (
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
        <View className='finished-inventory-page__toolbar'>
          <Button 
            type='primary' 
            size='small'
            onClick={handleAdd}
            className='add-btn'
          >
            <MaterialIcons name='add' size={16} color='#ffffff' />
            新增库存
          </Button>
        </View>

        {/* 库存列表 */}
        <View className='finished-inventory-page__content'>
          {loading && data.length === 0 ? (
            <View className='loading-state'>
              <MaterialIcons name='hourglass_empty' size={32} color='#6b7280' />
              <Text>加载中...</Text>
            </View>
          ) : data.length === 0 ? (
            <View className='empty-state'>
              <MaterialIcons name='inventory_2' size={48} color='#d1d5db' />
              <Text className='empty-text'>暂无库存数据</Text>
              <Text className='empty-desc'>点击上方按钮添加成品库存</Text>
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
                  type='finished'
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
          title={editingItem ? '编辑成品库存' : '新增成品库存'}
          fields={formFields}
          initialValues={editingItem ? {
            shop: editingItem.shop?.nickname || '',
            category: editingItem.category?.name || '',
            productName: editingItem.product?.specification || '',
            outerSize: editingItem.boxSize || '',
            cartonQty: editingItem.packQuantity || 0,
            weight: editingItem.weight || 0,
            location: editingItem.location || '',
            quantity: editingItem.stockQuantity || 0
          } : {}}
          loading={formLoading}
          onSubmit={handleFormSubmit}
          onCancel={() => setShowFormModal(false)}
        />
      </View>
    </MobileLayout>
  )
}

export default withAuth(FinishedInventoryPage, {
  requiredPermissions: [Permission.INVENTORY_READ]
})