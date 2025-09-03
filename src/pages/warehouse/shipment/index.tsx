import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import type { ITouchEvent } from '@tarojs/components'
import { 
  Button, 
  Tag, 
  Popup
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import './index.scss'

// 发货任务状态枚举
enum ShipmentStatus {
  WAREHOUSE_PENDING = 'warehouse_pending',      // 仓库待发货
  WAREHOUSE_SHIPPED = 'warehouse_shipped',      // 仓库已发货
  IN_TRANSIT = 'in_transit',                    // 在途
  ARRIVED_PORT = 'arrived_port',                // 到港
  DELIVERED = 'delivered',                      // 交付
  WAITING_RECEIVE = 'waiting_receive',          // 等待接收
  IN_RECEIVING = 'in_receiving',                // 正在接收
  COMPLETED = 'completed'                       // 已完成
}

// 状态标签映射
const StatusLabels = {
  [ShipmentStatus.WAREHOUSE_PENDING]: '仓库待发货',
  [ShipmentStatus.WAREHOUSE_SHIPPED]: '仓库已发货',
  [ShipmentStatus.IN_TRANSIT]: '在途',
  [ShipmentStatus.ARRIVED_PORT]: '到港',
  [ShipmentStatus.DELIVERED]: '交付',
  [ShipmentStatus.WAITING_RECEIVE]: '等待接收',
  [ShipmentStatus.IN_RECEIVING]: '正在接收',
  [ShipmentStatus.COMPLETED]: '已完成'
}

// 状态颜色映射
const StatusColors = {
  [ShipmentStatus.WAREHOUSE_PENDING]: '#f59e0b',
  [ShipmentStatus.WAREHOUSE_SHIPPED]: '#3b82f6',
  [ShipmentStatus.IN_TRANSIT]: '#6366f1',
  [ShipmentStatus.ARRIVED_PORT]: '#8b5cf6',
  [ShipmentStatus.DELIVERED]: '#06b6d4',
  [ShipmentStatus.WAITING_RECEIVE]: '#f59e0b',
  [ShipmentStatus.IN_RECEIVING]: '#3b82f6',
  [ShipmentStatus.COMPLETED]: '#10b981'
}

// 发货任务接口 - 根据PRD定义
interface ShipmentTask {
  id: string
  shop: string                    // 店铺
  category: string                // 产品分类
  productName: string             // 产品昵称
  totalBoxes: number              // 总箱数
  fbaCode: string                 // FBA件码
  fbaWarehouse: string            // FBA仓编号
  country: string                 // 国家
  channel: string                 // 渠道
  logistics: string               // 货代公司
  trackingCode: string            // 运单编码
  warehouseType: string           // 仓库发货类型
  invoiceDeadline: string         // 截止发票
  receiveDeadline: string         // 进仓收货期限
  clearance: string               // 头程物流清关
  date: string                    // 日期
  status: ShipmentStatus          // 状态
  createdAt: string
  updatedAt: string
}

// 统计数据接口
interface ShipmentStats {
  total: number
  totalBoxes: number
  warehousePending: number
  warehouseShipped: number
  inTransit: number
  arrivedPort: number
  delivered: number
  waitingReceive: number
  inReceiving: number
  completed: number
}

const ShipmentTaskPage: React.FC = () => {
  const [data, setData] = useState<ShipmentTask[]>([])
  const [_loading, setLoading] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showStatusDialog, setShowStatusDialog] = useState(false)
  const [currentTask, setCurrentTask] = useState<ShipmentTask | null>(null)
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<ShipmentStats>({
    total: 0,
    totalBoxes: 0,
    warehousePending: 0,
    warehouseShipped: 0,
    inTransit: 0,
    arrivedPort: 0,
    delivered: 0,
    waitingReceive: 0,
    inReceiving: 0,
    completed: 0
  })

  // 模拟数据
  const mockTasks: ShipmentTask[] = [
    {
      id: '1',
      shop: '天猫旗舰店',
      category: '电子产品',
      productName: 'iPhone 15 Pro 手机壳',
      totalBoxes: 25,
      fbaCode: 'FBA15X7YN000001',
      fbaWarehouse: 'LAX9',
      country: '美国',
      channel: 'Amazon',
      logistics: '顺丰国际',
      trackingCode: 'SF1234567890',
      warehouseType: '海运',
      invoiceDeadline: '2025-01-15',
      receiveDeadline: '2025-01-20',
      clearance: '自主清关',
      date: '2025-01-10',
      status: ShipmentStatus.IN_TRANSIT,
      createdAt: '2025-01-01T09:00:00Z',
      updatedAt: '2025-01-10T14:30:00Z'
    },
    {
      id: '2',
      shop: '京东专营店',
      category: '家居用品',
      productName: '智能扫地机器人',
      totalBoxes: 15,
      fbaCode: 'FBA15X7YN000002',
      fbaWarehouse: 'PHX7',
      country: '美国',
      channel: 'Amazon',
      logistics: '中外运',
      trackingCode: 'ZWY9876543210',
      warehouseType: '空运',
      invoiceDeadline: '2025-01-12',
      receiveDeadline: '2025-01-18',
      clearance: '代理清关',
      date: '2025-01-08',
      status: ShipmentStatus.DELIVERED,
      createdAt: '2025-01-01T08:00:00Z',
      updatedAt: '2025-01-12T16:00:00Z'
    },
    {
      id: '3',
      shop: '淘宝店铺',
      category: '服装配件',
      productName: '冬季保暖手套',
      totalBoxes: 40,
      fbaCode: 'FBA15X7YN000003',
      fbaWarehouse: 'DFW8',
      country: '美国',
      channel: 'Amazon',
      logistics: '邮政速递',
      trackingCode: 'EMS1122334455',
      warehouseType: '快递',
      invoiceDeadline: '2025-01-18',
      receiveDeadline: '2025-01-25',
      clearance: '自主清关',
      date: '2025-01-05',
      status: ShipmentStatus.WAREHOUSE_PENDING,
      createdAt: '2025-01-01T10:00:00Z',
      updatedAt: '2025-01-05T10:00:00Z'
    },
    {
      id: '4',
      shop: '拼多多店铺',
      category: '美妆护肤',
      productName: '护肤品套装',
      totalBoxes: 30,
      fbaCode: 'FBA15X7YN000004',
      fbaWarehouse: 'ATL2',
      country: '美国',
      channel: 'Amazon',
      logistics: '华南物流',
      trackingCode: 'HN5566778899',
      warehouseType: '海运',
      invoiceDeadline: '2025-01-20',
      receiveDeadline: '2025-01-28',
      clearance: '代理清关',
      date: '2025-01-12',
      status: ShipmentStatus.COMPLETED,
      createdAt: '2025-01-02T09:00:00Z',
      updatedAt: '2025-01-20T17:30:00Z'
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
    const totalBoxes = data.reduce((sum, item) => sum + item.totalBoxes, 0)
    const warehousePending = data.filter(item => item.status === ShipmentStatus.WAREHOUSE_PENDING).length
    const warehouseShipped = data.filter(item => item.status === ShipmentStatus.WAREHOUSE_SHIPPED).length
    const inTransit = data.filter(item => item.status === ShipmentStatus.IN_TRANSIT).length
    const arrivedPort = data.filter(item => item.status === ShipmentStatus.ARRIVED_PORT).length
    const delivered = data.filter(item => item.status === ShipmentStatus.DELIVERED).length
    const waitingReceive = data.filter(item => item.status === ShipmentStatus.WAITING_RECEIVE).length
    const inReceiving = data.filter(item => item.status === ShipmentStatus.IN_RECEIVING).length
    const completed = data.filter(item => item.status === ShipmentStatus.COMPLETED).length

    setStats({
      total,
      totalBoxes,
      warehousePending,
      warehouseShipped,
      inTransit,
      arrivedPort,
      delivered,
      waitingReceive,
      inReceiving,
      completed
    })
  }

  // 获取状态进度百分比
  const getStatusProgress = (status: ShipmentStatus): number => {
    const statusOrder = [
      ShipmentStatus.WAREHOUSE_PENDING,
      ShipmentStatus.WAREHOUSE_SHIPPED,
      ShipmentStatus.IN_TRANSIT,
      ShipmentStatus.ARRIVED_PORT,
      ShipmentStatus.DELIVERED,
      ShipmentStatus.WAITING_RECEIVE,
      ShipmentStatus.IN_RECEIVING,
      ShipmentStatus.COMPLETED
    ]
    
    const currentIndex = statusOrder.indexOf(status)
    return Math.round(((currentIndex + 1) / statusOrder.length) * 100)
  }

  // 筛选数据
  const getFilteredData = () => {
    return data.filter(item => {
      const matchSearch = !searchKeyword || 
        item.productName.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.shop.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.fbaCode.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        item.trackingCode.toLowerCase().includes(searchKeyword.toLowerCase())
      
      return matchSearch
    })
  }

  // 更新任务状态
  const handleStatusChange = (task: ShipmentTask, newStatus: ShipmentStatus) => {
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
  const handleTaskClick = (task: ShipmentTask) => {
    setCurrentTask(task)
    setShowStatusDialog(true)
  }

  // 切换详情展开
  const toggleTaskExpand = (taskId: string, e: ITouchEvent) => {
    e.stopPropagation() // 阻止事件冒泡
    const newExpanded = new Set(expandedTasks)
    if (newExpanded.has(taskId)) {
      newExpanded.delete(taskId)
    } else {
      newExpanded.add(taskId)
    }
    setExpandedTasks(newExpanded)
  }

  const filteredData = getFilteredData()

  return (
    <MobileLayout>
      <View className='shipment-task-page'>
        {/* 搜索框 */}
        <View className='shipment-task-page__search'>
          <SearchBar
            placeholder='搜索产品名称、FBA件码、运单号...'
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={setSearchKeyword}
          />
        </View>

        {/* 统计概览 */}
        <View className='shipment-task-page__stats'>
          <View className='overview-cards'>
            <View className='overview-card overview-card--primary'>
              <View className='overview-card__icon'>
                <MaterialIcons name='local_shipping' size={32} color='#3b82f6' />
              </View>
              <View className='overview-card__content'>
                <Text className='overview-card__value'>{stats.total}</Text>
                <Text className='overview-card__label'>总发货任务</Text>
              </View>
            </View>
            
            <View className='overview-card overview-card--success'>
              <View className='overview-card__icon'>
                <MaterialIcons name='inventory' size={32} color='#10b981' />
              </View>
              <View className='overview-card__content'>
                <Text className='overview-card__value'>{stats.totalBoxes}</Text>
                <Text className='overview-card__label'>总箱数</Text>
              </View>
            </View>
          </View>
          
          {/* 状态分布 */}
          <View className='status-distribution'>
            <Text className='status-distribution__title'>状态分布</Text>
            <View className='status-grid'>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.warehousePending}</Text>
                <Text className='status-item__label'>仓库待发货</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.warehouseShipped}</Text>
                <Text className='status-item__label'>仓库已发货</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.inTransit}</Text>
                <Text className='status-item__label'>在途</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.arrivedPort}</Text>
                <Text className='status-item__label'>到港</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.delivered}</Text>
                <Text className='status-item__label'>交付</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.waitingReceive}</Text>
                <Text className='status-item__label'>等待接收</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.inReceiving}</Text>
                <Text className='status-item__label'>正在接收</Text>
              </View>
              <View className='status-item'>
                <Text className='status-item__count'>{stats.completed}</Text>
                <Text className='status-item__label'>已完成</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 发货任务列表 */}
        <View className='shipment-task-page__content'>
          {filteredData.length > 0 ? (
            <View className='shipment-list'>
              {filteredData.map(task => (
                <View key={task.id} className='shipment-card'>
                  {/* 卡片头部 - 关键信息 */}
                  <View className='shipment-card__header' onClick={() => handleTaskClick(task)}>
                    <View className='shipment-card__info'>
                      <Text className='shipment-card__title'>{task.productName}</Text>
                      <Text className='shipment-card__meta'>
                        {task.shop} · {task.category}
                      </Text>
                      <Text className='shipment-card__fba'>
                        FBA: {task.fbaCode}
                      </Text>
                    </View>
                    <View className='shipment-card__status'>
                      <Tag 
                        type='primary' 
                        style={{ backgroundColor: StatusColors[task.status] }}
                      >
                        {StatusLabels[task.status]}
                      </Tag>
                    </View>
                  </View>
                  
                  {/* 进度条 */}
                  <View className='shipment-card__progress'>
                    <View className='progress-header'>
                      <Text className='progress-label'>配送进度</Text>
                      <Text className='progress-value'>{getStatusProgress(task.status)}%</Text>
                    </View>
                    <View className='progress-bar'>
                      <View 
                        className='progress-fill'
                        style={{ 
                          width: `${getStatusProgress(task.status)}%`,
                          backgroundColor: StatusColors[task.status]
                        }}
                      />
                    </View>
                  </View>
                  
                  {/* 关键信息简览 */}
                  <View className='shipment-card__summary'>
                    <View className='summary-item'>
                      <Text className='summary-label'>总箱数</Text>
                      <Text className='summary-value'>{task.totalBoxes}</Text>
                    </View>
                    <View className='summary-item'>
                      <Text className='summary-label'>目的地</Text>
                      <Text className='summary-value'>{task.country}</Text>
                    </View>
                    <View className='summary-item'>
                      <Text className='summary-label'>运输方式</Text>
                      <Text className='summary-value'>{task.warehouseType}</Text>
                    </View>
                    <View className='summary-item'>
                      <Text className='summary-label'>货代</Text>
                      <Text className='summary-value'>{task.logistics}</Text>
                    </View>
                  </View>
                  
                  {/* 详情切换按钮 */}
                  <View className='shipment-card__toggle'>
                    <View 
                      className='toggle-btn'
                      onClick={(e) => toggleTaskExpand(task.id, e)}
                    >
                      <Text className='toggle-text'>
                        {expandedTasks.has(task.id) ? '收起详情' : '展开详情'}
                      </Text>
                      <MaterialIcons 
                        name={expandedTasks.has(task.id) ? 'expand_less' : 'expand_more'} 
                        size={20} 
                        color='#6b7280'
                      />
                    </View>
                    <View 
                      className='status-btn'
                      onClick={() => handleTaskClick(task)}
                    >
                      <MaterialIcons name='edit' size={16} color='#3b82f6' />
                      <Text className='status-btn-text'>更新状态</Text>
                    </View>
                  </View>

                  {/* 详细信息 - 可展开 */}
                  {expandedTasks.has(task.id) && (
                    <View className='shipment-card__details'>
                      <View className='details-section'>
                        <Text className='section-title'>物流信息</Text>
                        <View className='detail-grid'>
                          <View className='detail-item'>
                            <Text className='detail-label'>FBA仓编号</Text>
                            <Text className='detail-value'>{task.fbaWarehouse}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>渠道</Text>
                            <Text className='detail-value'>{task.channel}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>运单编码</Text>
                            <Text className='detail-value'>{task.trackingCode}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>清关方式</Text>
                            <Text className='detail-value'>{task.clearance}</Text>
                          </View>
                        </View>
                      </View>
                      
                      <View className='details-section'>
                        <Text className='section-title'>时间节点</Text>
                        <View className='detail-grid'>
                          <View className='detail-item'>
                            <Text className='detail-label'>发货日期</Text>
                            <Text className='detail-value'>{task.date}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>截止发票</Text>
                            <Text className='detail-value'>{task.invoiceDeadline}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>收货期限</Text>
                            <Text className='detail-value'>{task.receiveDeadline}</Text>
                          </View>
                          <View className='detail-item'>
                            <Text className='detail-label'>更新时间</Text>
                            <Text className='detail-value'>{new Date(task.updatedAt).toLocaleString()}</Text>
                          </View>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className='empty-state'>
              <MaterialIcons name='local_shipping' size={64} color='#d1d5db' />
              <Text className='empty-text'>暂无发货任务</Text>
            </View>
          )}
        </View>
        
        {/* 状态更新弹出层 */}
        <Popup
          visible={showStatusDialog}
          position='bottom'
          onClose={() => setShowStatusDialog(false)}
          round
          style={{ padding: '20rpx' }}
        >
          <View className='status-selector'>
            <View className='status-selector__title'>
              <Text>更新发货状态</Text>
            </View>
            
            <View className='status-options'>
              {Object.entries(StatusLabels).map(([status, label]) => (
                <View
                  key={status}
                  className={`status-option ${currentTask?.status === status ? 'status-option--current' : ''}`}
                  onClick={() => currentTask && handleStatusChange(currentTask, status as ShipmentStatus)}
                >
                  <MaterialIcons 
                    name={currentTask?.status === status ? 'radio_button_checked' : 'radio_button_unchecked'}
                    size={20} 
                    color={currentTask?.status === status ? StatusColors[status as ShipmentStatus] : '#d1d5db'} 
                  />
                  <Text className='status-option__text'>{label}</Text>
                </View>
              ))}
            </View>

            <Button 
              block 
              size='large'
              type='default'
              onClick={() => setShowStatusDialog(false)}
              style={{ marginTop: '20rpx' }}
            >
              取消
            </Button>
          </View>
        </Popup>
      </View>
    </MobileLayout>
  )
}

export default ShipmentTaskPage