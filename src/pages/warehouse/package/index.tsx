import React, { useState, useEffect, useRef } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Button, Input, Tag } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import TaskCard from '@/components/TaskCard'
import withAuth from '@/components/AuthGuard'
import { Permission, PackageStatus, PackageStatusLabels } from '@/types/admin'
import type { PackageTask } from '@/types/admin'
import type { Task } from '@/types'
import './index.scss'

const PackageTaskPage: React.FC = () => {
  // 状态管理
  const [data, setData] = useState<PackageTask[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshing, setRefreshing] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(10)
  
  // 搜索和筛选状态
  const [searchText, setSearchText] = useState('')
  const [selectedShop, setSelectedShop] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState<PackageStatus | ''>('')

  // 状态选项
  const statusOptions: { label: string; value: PackageStatus; color: string }[] = [
    { label: PackageStatusLabels[PackageStatus.PENDING_ARRIVAL], value: PackageStatus.PENDING_ARRIVAL, color: '#6b7280' },
    { label: PackageStatusLabels[PackageStatus.WAITING_PACKAGE], value: PackageStatus.WAITING_PACKAGE, color: '#f59e0b' },
    { label: PackageStatusLabels[PackageStatus.IN_PACKAGING], value: PackageStatus.IN_PACKAGING, color: '#3b82f6' },
    { label: PackageStatusLabels[PackageStatus.COMPLETED], value: PackageStatus.COMPLETED, color: '#10b981' }
  ]

  // 模拟数据
  const mockData: PackageTask[] = [
    {
      id: '1',
      shop: '天猫旗舰店',
      category: '电子产品',
      productName: 'iPhone 15 Pro 保护壳套装',
      totalQty: 150,
      progress: 85,
      status: PackageStatus.IN_PACKAGING,
      createdAt: '2025-01-01T09:00:00Z',
      updatedAt: '2025-01-01T14:30:00Z'
    },
    {
      id: '2',
      shop: '京东专卖店',
      category: '服装配饰',
      productName: '冬季羽绒服男款',
      totalQty: 80,
      progress: 100,
      status: PackageStatus.COMPLETED,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T15:00:00Z'
    },
    {
      id: '3',
      shop: '拼多多官店',
      category: '家居用品',
      productName: '智能扫地机器人',
      totalQty: 50,
      progress: 0,
      status: PackageStatus.WAITING_PACKAGE,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: '4',
      shop: '独立官网',
      category: '运动户外',
      productName: '专业跑步鞋系列',
      totalQty: 200,
      progress: 45,
      status: PackageStatus.IN_PACKAGING,
      createdAt: '2025-01-01T07:30:00Z',
      updatedAt: '2025-01-01T13:20:00Z'
    },
    {
      id: '5',
      shop: '天猫旗舰店',
      category: '美妆护肤',
      productName: '精华液礼盒装',
      totalQty: 120,
      progress: 15,
      status: PackageStatus.PENDING_ARRIVAL,
      createdAt: '2025-01-01T11:00:00Z',
      updatedAt: '2025-01-01T16:00:00Z'
    }
  ]

  // 转换为TaskCard需要的格式
  const convertToTaskFormat = (packageTask: PackageTask): Task => {
    const statusMap: Record<PackageStatus, 'pending' | 'in_progress' | 'completed'> = {
      [PackageStatus.PENDING_ARRIVAL]: 'pending',
      [PackageStatus.WAITING_PACKAGE]: 'pending', 
      [PackageStatus.IN_PACKAGING]: 'in_progress',
      [PackageStatus.COMPLETED]: 'completed'
    }
    
    return {
      id: packageTask.id,
      title: packageTask.productName,
      description: `${packageTask.shop} · ${packageTask.category} · 数量: ${packageTask.totalQty}`,
      status: statusMap[packageTask.status],
      priority: (packageTask.totalQty > 100 ? 'high' : packageTask.totalQty > 50 ? 'medium' : 'low') as 'high' | 'medium' | 'low',
      assignee: {
        id: '1',
        name: '包装员',
        avatar: '',
        email: 'packer@company.com',
        role: 'operator' as const,
        department: '包装部门'
      },
      creator: {
        id: '1',
        name: '系统',
        avatar: '',
        email: 'system@company.com', 
        role: 'admin' as const,
        department: '系统'
      },
      dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      createdAt: packageTask.createdAt,
      updatedAt: packageTask.updatedAt,
      progress: packageTask.progress,
      tags: [packageTask.category],
      workflow: {
        currentStep: Math.floor(packageTask.progress / 25),
        totalSteps: 4,
        stepName: getStepName(packageTask.progress)
      }
    }
  }

  // 获取当前步骤名称
  const getStepName = (progress: number): string => {
    if (progress === 0) return '待开始'
    if (progress <= 25) return '准备包装'
    if (progress <= 50) return '包装中'
    if (progress <= 75) return '质检中'
    return '已完成'
  }

  // 统计信息
  const getStatistics = () => {
    const total = data.length
    const pending = data.filter(t => 
      t.status === PackageStatus.PENDING_ARRIVAL || t.status === PackageStatus.WAITING_PACKAGE
    ).length
    const inProgress = data.filter(t => t.status === PackageStatus.IN_PACKAGING).length
    const completed = data.filter(t => t.status === PackageStatus.COMPLETED).length
    
    return { total, pending, inProgress, completed }
  }

  // 数据筛选
  const getFilteredData = () => {
    return data.filter(item => {
      const matchSearch = !searchText || 
        item.productName.toLowerCase().includes(searchText.toLowerCase()) ||
        item.shop.toLowerCase().includes(searchText.toLowerCase())
      
      const matchShop = !selectedShop || item.shop === selectedShop
      const matchCategory = !selectedCategory || item.category === selectedCategory
      const matchStatus = !selectedStatus || item.status === selectedStatus
      
      return matchSearch && matchShop && matchCategory && matchStatus
    })
  }

  // 获取筛选选项
  const getFilterOptions = () => {
    const shops = Array.from(new Set(data.map(item => item.shop)))
    const categories = Array.from(new Set(data.map(item => item.category)))
    
    return { shops, categories }
  }

  // 更新任务状态
  const handleStatusUpdate = async (taskId: string, newStatus: PackageStatus) => {
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 300))
      
      // 更新本地状态
      setData(prev => prev.map(item => 
        item.id === taskId 
          ? { 
              ...item, 
              status: newStatus,
              progress: newStatus === PackageStatus.COMPLETED ? 100 : 
                       newStatus === PackageStatus.IN_PACKAGING ? 50 : 0,
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
        title: '状态更新失败',
        icon: 'error'
      })
    }
  }

  // 状态选择
  const handleTaskStatusSelect = (taskId: string) => {
    Taro.showActionSheet({
      itemList: statusOptions.map(option => option.label),
      success: (res) => {
        const selectedOption = statusOptions[res.tapIndex]
        if (selectedOption) {
          handleStatusUpdate(taskId, selectedOption.value)
        }
      }
    })
  }

  // 页面初始化
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
        setRefreshing(false)
      } else {
        setData(mockData)
        setLoading(false)
      }
    } catch (error) {
      console.error('加载数据失败:', error)
      setLoading(false)
      setRefreshing(false)
      
      Taro.showToast({
        title: '加载失败，请重试',
        icon: 'error'
      })
    }
  }

  // 加载更多
  const loadMore = async () => {
    if (!hasMore || loading) return
    
    setCurrentPage(prev => prev + 1)
    // 模拟没有更多数据
    setHasMore(false)
  }

  // 下拉刷新
  const handlePullRefresh = () => {
    loadData(true)
  }

  // 清除筛选
  const clearFilters = () => {
    setSelectedShop('')
    setSelectedCategory('')
    setSelectedStatus('')
  }

  const { shops, categories } = getFilterOptions()
  const filteredData = getFilteredData()
  const statistics = getStatistics()

  return (
    <MobileLayout>
      <View className="package-task-page">
        {/* 统计卡片 */}
        <View className="package-task-page__stats">
          <View className="stats-grid">
            <View className="stat-item">
              <Text className="stat-number">{statistics.total}</Text>
              <Text className="stat-label">总任务</Text>
            </View>
            <View className="stat-item">
              <Text className="stat-number">{statistics.pending}</Text>
              <Text className="stat-label">待包装</Text>
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
        <View className="package-task-page__search">
          <View className="search-input">
            <MaterialIcons name="search" size={20} color="#9ca3af" />
            <Input
              placeholder="搜索任务或店铺..."
              value={searchText}
              onChange={(value) => setSearchText(value)}
              clearable
            />
          </View>
        </View>

        {/* 筛选器 */}
        <View className="package-task-page__filters">
          <ScrollView scrollX className="filter-scroll">
            <View className="filter-chips">
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
              
              {/* 清除筛选 */}
              {(selectedShop || selectedCategory || selectedStatus) && (
                <Button
                  size="small"
                  fill="none"
                  onClick={clearFilters}
                >
                  <MaterialIcons name="clear" size={16} />
                  清除
                </Button>
              )}
            </View>
          </ScrollView>
        </View>

        {/* 任务列表 */}
        <View className="package-task-page__content">
          <ScrollView
            scrollY
            refresherEnabled
            refresherTriggered={refreshing}
            onRefresherRefresh={handlePullRefresh}
            onScrollToLower={loadMore}
            className="task-scroll"
          >
            {loading ? (
              <View className="loading-state">
                <MaterialIcons name="autorenew" size={32} color="#3b82f6" />
                <Text>加载中...</Text>
              </View>
            ) : filteredData.length > 0 ? (
              <>
                {filteredData.map(task => (
                  <TaskCard
                    key={task.id}
                    task={convertToTaskFormat(task)}
                    onClick={() => handleTaskStatusSelect(task.id)}
                  />
                ))}
                {!hasMore && (
                  <View className="end-tip">
                    <Text>没有更多数据了</Text>
                  </View>
                )}
              </>
            ) : (
              <View className="empty-state">
                <MaterialIcons name="inventory_2" size={64} color="#d1d5db" />
                <Text className="empty-title">暂无包装任务</Text>
                <Text className="empty-desc">当前筛选条件下没有找到任务</Text>
                <Button size="small" onClick={clearFilters}>
                  清除筛选条件
                </Button>
              </View>
            )}
          </ScrollView>
        </View>
      </View>
    </MobileLayout>
  )
}

export default withAuth(PackageTaskPage, {
  requiredPermissions: [Permission.TASK_READ]
}) 