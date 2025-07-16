import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button, Input, Tag } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import TaskCard from '@/components/TaskCard'
import withAuth from '@/components/AuthGuard'
import { Permission, ShipmentStatus, ShipmentStatusLabels } from '@/types/admin'
import type { ShipmentTask } from '@/types/admin'
import type { Task } from '@/types'
import './index.scss'

const ShipmentTaskPage: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<ShipmentTask[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20)
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [selectedShop, setSelectedShop] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<ShipmentStatus | ''>('')
  
  // 页面引用
  const scrollViewRef = useRef<any>(null)

  // 状态选项配置
  const statusOptions: { label: string; value: ShipmentStatus; color: string }[] = [
    { label: ShipmentStatusLabels[ShipmentStatus.WAREHOUSE_PENDING], value: ShipmentStatus.WAREHOUSE_PENDING, color: '#f59e0b' },
    { label: ShipmentStatusLabels[ShipmentStatus.WAREHOUSE_SHIPPED], value: ShipmentStatus.WAREHOUSE_SHIPPED, color: '#3b82f6' },
    { label: ShipmentStatusLabels[ShipmentStatus.IN_TRANSIT], value: ShipmentStatus.IN_TRANSIT, color: '#6366f1' },
    { label: ShipmentStatusLabels[ShipmentStatus.ARRIVED_PORT], value: ShipmentStatus.ARRIVED_PORT, color: '#8b5cf6' },
    { label: ShipmentStatusLabels[ShipmentStatus.DELIVERED], value: ShipmentStatus.DELIVERED, color: '#06b6d4' },
    { label: ShipmentStatusLabels[ShipmentStatus.WAITING_RECEIVE], value: ShipmentStatus.WAITING_RECEIVE, color: '#f59e0b' },
    { label: ShipmentStatusLabels[ShipmentStatus.IN_RECEIVING], value: ShipmentStatus.IN_RECEIVING, color: '#3b82f6' },
    { label: ShipmentStatusLabels[ShipmentStatus.COMPLETED], value: ShipmentStatus.COMPLETED, color: '#10b981' }
  ]

  // 模拟数据 - 基于PRD中的ShipmentTask字段
  const mockData: ShipmentTask[] = [
    {
      id: '1',
      shop: '天猫旗舰店',
      category: '电子产品',
      productName: 'iPhone 15 Pro 保护壳套装',
      totalBoxes: 15,
      fbaCode: 'FBA15PRO2025',
      fbaWarehouse: 'LAX8',
      country: '美国',
      channel: 'Amazon',
      logistics: '顺丰国际',
      trackingCode: 'SF1234567890',
      warehouseType: '海外仓',
      invoiceDeadline: '2025-01-05',
      receiveDeadline: '2025-01-15',
      clearance: '双清包税',
      date: '2025-01-01',
      status: ShipmentStatus.IN_TRANSIT,
      createdAt: '2025-01-01T09:00:00Z',
      updatedAt: '2025-01-01T14:30:00Z'
    },
    {
      id: '2',
      shop: '京东专卖店',
      category: '服装配饰',
      productName: '冬季羽绒服男款',
      totalBoxes: 8,
      fbaCode: 'FBA-JD-COAT',
      fbaWarehouse: 'LHR2',
      country: '英国',
      channel: 'eBay',
      logistics: '中通国际',
      trackingCode: 'YTO9876543210',
      warehouseType: '直发',
      invoiceDeadline: '2025-01-03',
      receiveDeadline: '2025-01-10',
      clearance: '自助清关',
      date: '2025-01-01',
      status: ShipmentStatus.COMPLETED,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T15:00:00Z'
    },
    {
      id: '3',
      shop: '拼多多官店',
      category: '家居用品',
      productName: '智能扫地机器人',
      totalBoxes: 5,
      fbaCode: 'FBA-PDD-ROBOT',
      fbaWarehouse: 'FRA1',
      country: '德国',
      channel: 'Shopify',
      logistics: '递四方',
      trackingCode: '',
      warehouseType: '海外仓',
      invoiceDeadline: '2025-01-08',
      receiveDeadline: '2025-01-20',
      clearance: '双清包税',
      date: '2025-01-01',
      status: ShipmentStatus.WAREHOUSE_PENDING,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: '4',
      shop: '独立官网',
      category: '运动户外',
      productName: '专业跑步鞋系列',
      totalBoxes: 20,
      fbaCode: 'FBA-SHOE-RUN',
      fbaWarehouse: 'CDG1',
      country: '法国',
      channel: '独立站',
      logistics: 'DHL',
      trackingCode: 'DHL5555666677',
      warehouseType: '海外仓',
      invoiceDeadline: '2025-01-04',
      receiveDeadline: '2025-01-12',
      clearance: '税务代理',
      date: '2025-01-01',
      status: ShipmentStatus.ARRIVED_PORT,
      createdAt: '2025-01-01T07:30:00Z',
      updatedAt: '2025-01-01T13:20:00Z'
    },
    {
      id: '5',
      shop: '天猫旗舰店',
      category: '美妆护肤',
      productName: '精华液礼盒装',
      totalBoxes: 12,
      fbaCode: 'FBA-BEAUTY-SET',
      fbaWarehouse: 'NRT1',
      country: '日本',
      channel: 'Rakuten',
      logistics: 'EMS',
      trackingCode: 'EMS8888999900',
      warehouseType: '直发',
      invoiceDeadline: '2025-01-06',
      receiveDeadline: '2025-01-18',
      clearance: '双清包税',
      date: '2025-01-01',
      status: ShipmentStatus.DELIVERED,
      createdAt: '2025-01-01T11:00:00Z',
      updatedAt: '2025-01-01T16:00:00Z'
    }
  ]

  // 获取唯一的店铺和分类列表
  const shops = Array.from(new Set(mockData.map(item => item.shop)))
  const categories = Array.from(new Set(mockData.map(item => item.category)))

  // 转换为TaskCard需要的格式
  const convertToTaskFormat = (shipmentTask: ShipmentTask): Task => {
    const statusMap: Record<ShipmentStatus, 'pending' | 'in_progress' | 'completed'> = {
      [ShipmentStatus.WAREHOUSE_PENDING]: 'pending',
      [ShipmentStatus.WAREHOUSE_SHIPPED]: 'in_progress',
      [ShipmentStatus.IN_TRANSIT]: 'in_progress',
      [ShipmentStatus.ARRIVED_PORT]: 'in_progress',
      [ShipmentStatus.DELIVERED]: 'in_progress',
      [ShipmentStatus.WAITING_RECEIVE]: 'pending',
      [ShipmentStatus.IN_RECEIVING]: 'in_progress',
      [ShipmentStatus.COMPLETED]: 'completed'
    }
    
    // 根据状态计算进度
    const getProgressByStatus = (status: ShipmentStatus): number => {
      switch (status) {
        case ShipmentStatus.WAREHOUSE_PENDING: return 0
        case ShipmentStatus.WAREHOUSE_SHIPPED: return 15
        case ShipmentStatus.IN_TRANSIT: return 40
        case ShipmentStatus.ARRIVED_PORT: return 60
        case ShipmentStatus.DELIVERED: return 80
        case ShipmentStatus.WAITING_RECEIVE: return 85
        case ShipmentStatus.IN_RECEIVING: return 95
        case ShipmentStatus.COMPLETED: return 100
        default: return 0
      }
    }
    
    const progress = getProgressByStatus(shipmentTask.status)
    
    return {
      id: shipmentTask.id,
      title: shipmentTask.productName,
      description: `${shipmentTask.shop} · ${shipmentTask.category} · 箱数: ${shipmentTask.totalBoxes} · 目的地: ${shipmentTask.country} · FBA: ${shipmentTask.fbaWarehouse}`,
      status: statusMap[shipmentTask.status] || 'pending',
      priority: (shipmentTask.totalBoxes > 15 ? 'high' : shipmentTask.totalBoxes > 8 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      assignee: {
        id: '1',
        name: '发货员',
        email: 'shipper@company.com',
        avatar: '',
        role: 'shipper',
        department: '仓储部'
      },
      creator: {
        id: '1',
        name: '系统',
        email: 'system@company.com',
        avatar: '',
        role: 'system',
        department: '系统'
      },
      dueDate: shipmentTask.receiveDeadline,
      createdAt: shipmentTask.createdAt,
      updatedAt: shipmentTask.updatedAt,
      progress: progress,
      tags: [shipmentTask.category, shipmentTask.country, shipmentTask.channel],
      workflow: {
        currentStep: Math.floor(progress / 12.5), // 8个步骤
        totalSteps: 8,
        stepName: getStepName(progress)
      }
    }
  }

  // 根据进度获取步骤名称
  const getStepName = (progress: number): string => {
    if (progress === 0) return '待发货'
    if (progress <= 12.5) return '已发货'
    if (progress <= 25) return '运输中'
    if (progress <= 37.5) return '到达港口'
    if (progress <= 50) return '清关中'
    if (progress <= 62.5) return '配送中'
    if (progress <= 87.5) return '待收货'
    return '已完成'
  }

  // 统计信息
  const getStatistics = () => {
    const total = data.length
    const pending = data.filter(t => 
      t.status === ShipmentStatus.WAREHOUSE_PENDING || 
      t.status === ShipmentStatus.WAITING_RECEIVE
    ).length
    const inProgress = data.filter(t => 
      t.status === ShipmentStatus.WAREHOUSE_SHIPPED || 
      t.status === ShipmentStatus.IN_TRANSIT ||
      t.status === ShipmentStatus.ARRIVED_PORT ||
      t.status === ShipmentStatus.DELIVERED ||
      t.status === ShipmentStatus.IN_RECEIVING
    ).length
    const completed = data.filter(t => t.status === ShipmentStatus.COMPLETED).length
    
    return { total, pending, inProgress, completed }
  }

  // 数据筛选
  const getFilteredData = () => {
    return data.filter(item => {
      const matchesSearch = !searchText || 
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shop.toLowerCase().includes(searchText.toLowerCase()) ||
        item.trackingCode.toLowerCase().includes(searchText.toLowerCase()) ||
        item.country.toLowerCase().includes(searchText.toLowerCase()) ||
        item.fbaCode.toLowerCase().includes(searchText.toLowerCase())
      
      const matchesShop = !selectedShop || item.shop === selectedShop
      const matchesCategory = !selectedCategory || item.category === selectedCategory
      const matchesStatus = !selectedStatus || item.status === selectedStatus
      
      return matchesSearch && matchesShop && matchesCategory && matchesStatus
    })
  }

  // 初始化数据
  useEffect(() => {
    loadData()
  }, [])

  // 加载数据
  const loadData = async (refresh = false) => {
    if (refresh) {
      setRefreshing(true)
      setCurrentPage(1)
    } else {
      setLoading(true)
    }

    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      if (refresh) {
        setData(mockData)
        setHasMore(true)
      } else {
        setData(prev => currentPage === 1 ? mockData : [...prev, ...mockData])
        setHasMore(mockData.length >= pageSize)
      }
      
      setCurrentPage(prev => prev + 1)
    } catch (error) {
      console.error('加载数据失败:', error)
      Taro.showToast({
        title: '加载失败',
        icon: 'error'
      })
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // 处理状态更新
  const handleStatusUpdate = async (taskId: string, newStatus: ShipmentStatus) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      
      // 更新本地状态
      setData(prev => prev.map(item => 
        item.id === taskId 
          ? { 
              ...item, 
              status: newStatus,
              updatedAt: new Date().toISOString()
            }
          : item
      ))
      
      Taro.showToast({
        title: '状态更新成功',
        icon: 'success'
      })
    } catch (error) {
      console.error('状态更新失败:', error)
      Taro.showToast({
        title: '更新失败',
        icon: 'error'
      })
    }
  }

  // 处理任务点击
  const handleTaskClick = (task: Task) => {
    // 显示状态选择
    Taro.showActionSheet({
      itemList: statusOptions.map(option => option.label),
      success: (res) => {
        const selectedOption = statusOptions[res.tapIndex]
        if (selectedOption) {
          handleStatusUpdate(task.id, selectedOption.value)
        }
      }
    })
  }

  // 下拉刷新
  const onScrollToUpper = () => {
    if (!refreshing) {
      loadData(true)
    }
  }

  // 上拉加载更多
  const onScrollToLower = () => {
    if (!loading && hasMore) {
      loadData()
    }
  }

  const filteredData = getFilteredData()
  const statistics = getStatistics()

  return (
    <MobileLayout>
      <View className="shipment-task-page">
        {/* 统计卡片 */}
        <View className="shipment-task-page__stats">
          <View className="stats-grid">
            <View className="stat-item">
              <Text className="stat-number">{statistics.total}</Text>
              <Text className="stat-label">总任务</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-number">{statistics.pending}</Text>
              <Text className="stat-label">待处理</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-number">{statistics.inProgress}</Text>
              <Text className="stat-label">进行中</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-number">{statistics.completed}</Text>
              <Text className="stat-label">已完成</Text>
            </View>
          </View>
        </View>

        {/* 搜索栏 */}
        <View className="shipment-task-page__search">
          <View className="search-input">
            <MaterialIcons name="search" size={20} color="#6b7280" />
            <Input
              placeholder="搜索产品名称、店铺、运单号、FBA码..."
              value={searchText}
              onChange={(value) => setSearchText(value)}
              clearable
            />
          </View>
          <Button
            type="default"
            size="small"
            className="filter-btn"
            onClick={() => setShowFilters(!showFilters)}
          >
            <MaterialIcons 
              name={showFilters ? "filter_alt_off" : "filter_alt"} 
              size={16} 
              color="#6b7280" 
            />
          </Button>
        </View>

        {/* 筛选器 */}
        {showFilters && (
          <View className="shipment-task-page__filters">
            <ScrollView scrollX className="filter-scroll">
              {/* 店铺筛选 */}
              {shops.map(shop => (
                <Tag
                  key={shop}
                  type={selectedShop === shop ? 'primary' : 'default'}
                  onClick={() => setSelectedShop(selectedShop === shop ? '' : shop)}
                >
                  {shop}
                </Tag>
              ))}
              
              {/* 分类筛选 */}
              {categories.map(category => (
                <Tag
                  key={category}
                  type={selectedCategory === category ? 'primary' : 'default'}
                  onClick={() => setSelectedCategory(selectedCategory === category ? '' : category)}
                >
                  {category}
                </Tag>
              ))}
              
              {/* 状态筛选 */}
              {statusOptions.map(option => (
                <Tag
                  key={option.value}
                  type={selectedStatus === option.value ? 'primary' : 'default'}
                  onClick={() => setSelectedStatus(selectedStatus === option.value ? '' : option.value)}
                >
                  {option.label}
                </Tag>
              ))}
            </ScrollView>
          </View>
        )}

        {/* 任务列表 */}
        <ScrollView
          ref={scrollViewRef}
          className="shipment-task-page__list"
          scrollY
          enhanced
          showScrollbar={false}
          enablePassive
          onScrollToUpper={onScrollToUpper}
          onScrollToLower={onScrollToLower}
          refresherEnabled
          refresherTriggered={refreshing}
          onRefresherRefresh={onScrollToUpper}
        >
          {filteredData.length > 0 ? (
            <>
              {filteredData.map(task => (
                <TaskCard
                  key={task.id}
                  task={convertToTaskFormat(task)}
                  onClick={handleTaskClick}
                />
              ))}
              
              {/* 加载更多指示器 */}
              {loading && (
                <View className="loading-indicator">
                  <Text>加载中...</Text>
                </View>
              )}
              
              {!hasMore && filteredData.length > 0 && (
                <View className="no-more">
                  <Text>已显示全部任务</Text>
                </View>
              )}
            </>
          ) : (
            <View className="empty-state">
              <MaterialIcons name="inventory_2" size={64} color="#d1d5db" />
              <Text className="empty-text">暂无发货任务</Text>
              <Text className="empty-desc">
                {searchText || selectedShop || selectedCategory || selectedStatus 
                  ? '没有符合筛选条件的任务' 
                  : '还没有发货任务，请稍后再试'
                }
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </MobileLayout>
  )
}

export default withAuth(ShipmentTaskPage, {
  requiredPermissions: [Permission.TASK_READ]
}) 