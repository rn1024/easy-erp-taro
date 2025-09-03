import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Button, 
  Tag, 
  Dialog
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import './index.scss'

// 包装任务状态枚举
enum PackageStatus {
  PENDING_ARRIVAL = 'pending_arrival',    // 待到货
  WAITING_PACKAGE = 'waiting_package',    // 等待包装
  IN_PACKAGING = 'in_packaging',          // 正在包装
  COMPLETED = 'completed'                 // 已完成
}

// 状态标签映射
const StatusLabels = {
  [PackageStatus.PENDING_ARRIVAL]: '待到货',
  [PackageStatus.WAITING_PACKAGE]: '等待包装',
  [PackageStatus.IN_PACKAGING]: '正在包装',
  [PackageStatus.COMPLETED]: '已完成'
}

// 状态颜色映射
const StatusColors = {
  [PackageStatus.PENDING_ARRIVAL]: '#6b7280',
  [PackageStatus.WAITING_PACKAGE]: '#f59e0b',
  [PackageStatus.IN_PACKAGING]: '#3b82f6',
  [PackageStatus.COMPLETED]: '#10b981'
}

// 包装任务接口
interface PackageTask {
  id: string
  shop: string              // 店铺
  category: string          // 分类
  productName: string       // 产品昵称
  totalQty: number         // 总数量
  progress: number         // 进度 (0-100)
  status: PackageStatus    // 状态
  createdAt: string
  updatedAt: string
}

// 统计数据接口
interface PackageStats {
  total: number
  pendingArrival: number
  waitingPackage: number
  inPackaging: number
  completed: number
  completionRate: number
}

const PackageTaskPage: React.FC = () => {
  const [data, setData] = useState<PackageTask[]>([])
  const [_loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [currentTask, setCurrentTask] = useState<PackageTask | null>(null)
  const [stats, setStats] = useState<PackageStats>({
    total: 0,
    pendingArrival: 0,
    waitingPackage: 0,
    inPackaging: 0,
    completed: 0,
    completionRate: 0
  })

  // 模拟数据
  const mockTasks: PackageTask[] = [
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
      shop: '京东专营店',
      category: '家居用品',
      productName: '智能扫地机器人',
      totalQty: 80,
      progress: 100,
      status: PackageStatus.COMPLETED,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-01T16:00:00Z'
    },
    {
      id: '3',
      shop: '拼多多店铺',
      category: '服装配件',
      productName: '冬季保暖手套',
      totalQty: 200,
      progress: 0,
      status: PackageStatus.PENDING_ARRIVAL,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-01T10:00:00Z'
    },
    {
      id: '4',
      shop: '淘宝旗舰店',
      category: '美妆护肤',
      productName: '精华液套装',
      totalQty: 120,
      progress: 25,
      status: PackageStatus.WAITING_PACKAGE,
      createdAt: '2025-01-01T11:00:00Z',
      updatedAt: '2025-01-01T13:00:00Z'
    },
    {
      id: '5',
      shop: '天猫旗舰店',
      category: '电子产品',
      productName: 'MacBook Pro 电脑包',
      totalQty: 95,
      progress: 60,
      status: PackageStatus.IN_PACKAGING,
      createdAt: '2025-01-02T09:00:00Z',
      updatedAt: '2025-01-02T11:30:00Z'
    }
  ]

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    calculateStats()
  }, [data])

  const loadData = async () => {
    setLoading(true)
    // 模拟API请求
    setTimeout(() => {
      setData(mockTasks)
      setLoading(false)
    }, 500)
  }

  // 计算统计数据
  const calculateStats = () => {
    const total = data.length
    const pendingArrival = data.filter(item => item.status === PackageStatus.PENDING_ARRIVAL).length
    const waitingPackage = data.filter(item => item.status === PackageStatus.WAITING_PACKAGE).length
    const inPackaging = data.filter(item => item.status === PackageStatus.IN_PACKAGING).length
    const completed = data.filter(item => item.status === PackageStatus.COMPLETED).length
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0

    setStats({
      total,
      pendingArrival,
      waitingPackage,
      inPackaging,
      completed,
      completionRate
    })
  }

  // 筛选数据
  const getFilteredData = () => {
    return data.filter(item => {
      const matchSearch = !searchKeyword || 
        item.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.shop.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.category.toLowerCase().includes(searchKeyword.toLowerCase())
      
      return matchSearch
    })
  }

  // 更新任务状态
  const handleStatusChange = (task: PackageTask, newStatus: PackageStatus) => {
    setData(prev => prev.map(t => 
      t.id === task.id 
        ? { ...t, status: newStatus, updatedAt: new Date().toISOString() }
        : t
    ))
    setShowStatusDialog(false)
    setCurrentTask(null)
    
    Taro.showToast({
      title: '状态更新成功',
      icon: 'success'
    })
  }

  // 处理任务卡片点击
  const handleTaskClick = (task: PackageTask) => {
    setCurrentTask(task)
    setShowStatusDialog(true)
  }

  const filteredData = getFilteredData()

  return (
    <MobileLayout>
      <View className='package-task-page'>
        {/* 搜索框 */}
        <View className='package-task-page__search'>
          <SearchBar
            placeholder='搜索产品名称、店铺或分类...'
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={setSearchKeyword}
          />
        </View>

        {/* 统计概览 */}
        <View className='package-task-page__stats'>
          <View className='stats-grid'>
            <View className='stat-card stat-card--primary'>
              <View className='stat-card__icon'>
                <MaterialIcons name='inventory' size={32} color='#3b82f6' />
              </View>
              <View className='stat-card__content'>
                <Text className='stat-card__value'>{stats.total}</Text>
                <Text className='stat-card__label'>总任务</Text>
              </View>
            </View>
            
            <View className='stat-card stat-card--warning'>
              <View className='stat-card__icon'>
                <MaterialIcons name='schedule' size={32} color='#f59e0b' />
              </View>
              <View className='stat-card__content'>
                <Text className='stat-card__value'>{stats.pendingArrival}</Text>
                <Text className='stat-card__label'>待到货</Text>
              </View>
            </View>
            
            <View className='stat-card stat-card--info'>
              <View className='stat-card__icon'>
                <MaterialIcons name='hourglass_empty' size={32} color='#6b7280' />
              </View>
              <View className='stat-card__content'>
                <Text className='stat-card__value'>{stats.waitingPackage}</Text>
                <Text className='stat-card__label'>等待包装</Text>
              </View>
            </View>
            
            <View className='stat-card stat-card--processing'>
              <View className='stat-card__icon'>
                <MaterialIcons name='build' size={32} color='#3b82f6' />
              </View>
              <View className='stat-card__content'>
                <Text className='stat-card__value'>{stats.inPackaging}</Text>
                <Text className='stat-card__label'>正在包装</Text>
              </View>
            </View>
          </View>
          
          {/* 完成率展示 */}
          <View className='completion-card'>
            <View className='completion-header'>
              <Text className='completion-title'>整体完成率</Text>
              <Text className='completion-value'>{stats.completionRate}%</Text>
            </View>
            <View className='completion-bar'>
              <View 
                className='completion-fill'
                style={{ width: `${stats.completionRate}%` }}
              />
            </View>
            <Text className='completion-detail'>
              已完成 {stats.completed} / {stats.total} 个任务
            </Text>
          </View>
        </View>

        {/* 任务卡片列表 */}
        <View className='package-task-page__content'>
          {filteredData.length > 0 ? (
            <View className='task-list'>
              {filteredData.map(task => (
                <View key={task.id} className='task-card' onClick={() => handleTaskClick(task)}>
                  {/* 卡片头部 */}
                  <View className='task-card__header'>
                    <View className='task-card__info'>
                      <Text className='task-card__title'>{task.productName}</Text>
                      <Text className='task-card__meta'>{task.shop} · {task.category}</Text>
                    </View>
                    <Tag 
                      type='primary' 
                      style={{ backgroundColor: StatusColors[task.status] }}
                    >
                      {StatusLabels[task.status]}
                    </Tag>
                  </View>

                  {/* 数量信息 */}
                  <View className='task-card__quantity'>
                    <MaterialIcons name='inventory_2' size={20} color='#6b7280' />
                    <Text className='quantity-text'>总数量: {task.totalQty}</Text>
                  </View>

                  {/* 进度条 */}
                  <View className='task-card__progress'>
                    <View className='progress-header'>
                      <Text className='progress-label'>完成进度</Text>
                      <Text className='progress-value'>{task.progress}%</Text>
                    </View>
                    <View className='progress-bar'>
                      <View 
                        className='progress-fill'
                        style={{ 
                          width: `${task.progress}%`,
                          backgroundColor: StatusColors[task.status]
                        }}
                      />
                    </View>
                  </View>

                  {/* 卡片底部 */}
                  <View className='task-card__footer'>
                    <View className='task-card__time'>
                      <MaterialIcons name='schedule' size={16} color='#9ca3af' />
                      <Text className='time-text'>
                        更新: {new Date(task.updatedAt).toLocaleDateString()}
                      </Text>
                    </View>
                    <MaterialIcons name='chevron_right' size={20} color='#6b7280' />
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View className='empty-state'>
              <MaterialIcons name='inventory_2' size={64} color='#d1d5db' />
              <Text className='empty-text'>暂无包装任务</Text>
            </View>
          )}
        </View>
        
        {/* 状态更新对话框 */}
        <Dialog
          visible={showStatusDialog}
          title='更新任务状态'
          onClose={() => setShowStatusDialog(false)}
          footer={
            <View className='dialog-footer'>
              <Button onClick={() => setShowStatusDialog(false)}>取消</Button>
            </View>
          }
        >
          <View className='status-dialog'>
            {Object.entries(StatusLabels).map(([status, label]) => (
              <View
                key={status}
                className={`status-option ${currentTask?.status === status ? 'status-option--current' : ''}`}
                onClick={() => currentTask && handleStatusChange(currentTask, status as PackageStatus)}
              >
                <MaterialIcons 
                  name='radio_button_checked' 
                  size={20} 
                  color={currentTask?.status === status ? StatusColors[status as PackageStatus] : '#d1d5db'} 
                />
                <Text className='status-option__text'>{label}</Text>
              </View>
            ))}
          </View>
        </Dialog>
      </View>
    </MobileLayout>
  )
}

export default PackageTaskPage