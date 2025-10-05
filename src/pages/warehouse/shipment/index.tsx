import React, { useEffect, useMemo, useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Button, Popup } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { SectionCard, StatsGrid, FilterChips, ProgressBar, InfoList, type StatsGridItem } from '@/components/common'

/**
 * Types
 */
import type { ITouchEvent } from '@tarojs/components'

import './index.scss'

enum ShipmentStatus {
  WAREHOUSE_PENDING = 'warehouse_pending',
  WAREHOUSE_SHIPPED = 'warehouse_shipped',
  IN_TRANSIT = 'in_transit',
  ARRIVED_PORT = 'arrived_port',
  DELIVERED = 'delivered',
  WAITING_RECEIVE = 'waiting_receive',
  IN_RECEIVING = 'in_receiving',
  COMPLETED = 'completed'
}

const StatusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.WAREHOUSE_PENDING]: '仓库待发货',
  [ShipmentStatus.WAREHOUSE_SHIPPED]: '仓库已发货',
  [ShipmentStatus.IN_TRANSIT]: '在途',
  [ShipmentStatus.ARRIVED_PORT]: '到港',
  [ShipmentStatus.DELIVERED]: '交付',
  [ShipmentStatus.WAITING_RECEIVE]: '等待接收',
  [ShipmentStatus.IN_RECEIVING]: '正在接收',
  [ShipmentStatus.COMPLETED]: '已完成'
}

const StatusColors: Record<ShipmentStatus, string> = {
  [ShipmentStatus.WAREHOUSE_PENDING]: '#f59e0b',
  [ShipmentStatus.WAREHOUSE_SHIPPED]: '#3b82f6',
  [ShipmentStatus.IN_TRANSIT]: '#6366f1',
  [ShipmentStatus.ARRIVED_PORT]: '#8b5cf6',
  [ShipmentStatus.DELIVERED]: '#06b6d4',
  [ShipmentStatus.WAITING_RECEIVE]: '#f59e0b',
  [ShipmentStatus.IN_RECEIVING]: '#3b82f6',
  [ShipmentStatus.COMPLETED]: '#10b981'
}

interface ShipmentTask {
  id: string
  shop: string
  category: string
  productName: string
  totalBoxes: number
  fbaCode: string
  fbaWarehouse: string
  country: string
  channel: string
  logistics: string
  trackingCode: string
  warehouseType: string
  invoiceDeadline: string
  receiveDeadline: string
  clearance: string
  date: string
  status: ShipmentStatus
  createdAt: string
  updatedAt: string
}

const MOCK_TASKS: ShipmentTask[] = [
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

const STATUS_FLOW: ShipmentStatus[] = [
  ShipmentStatus.WAREHOUSE_PENDING,
  ShipmentStatus.WAREHOUSE_SHIPPED,
  ShipmentStatus.IN_TRANSIT,
  ShipmentStatus.ARRIVED_PORT,
  ShipmentStatus.DELIVERED,
  ShipmentStatus.WAITING_RECEIVE,
  ShipmentStatus.IN_RECEIVING,
  ShipmentStatus.COMPLETED
]

const STATUS_OPTIONS = [{ value: '', label: '全部状态' }, ...STATUS_FLOW.map(status => ({ value: status, label: StatusLabels[status] }))]

const ShipmentTaskPage: React.FC = () => {
  const [tasks, setTasks] = useState<ShipmentTask[]>([])
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set())
  const [statusPopupVisible, setStatusPopupVisible] = useState(false)
  const [currentTask, setCurrentTask] = useState<ShipmentTask | null>(null)

  useEffect(() => {
    setLoading(true)
    setTimeout(() => {
      setTasks(MOCK_TASKS)
      setLoading(false)
    }, 300)
  }, [])

  const filteredTasks = useMemo(() => {
    const keyword = searchValue.trim().toLowerCase()
    return tasks.filter(task => {
      const matchesKeyword = keyword
        ? task.productName.toLowerCase().includes(keyword) ||
          task.shop.toLowerCase().includes(keyword) ||
          task.fbaCode.toLowerCase().includes(keyword) ||
          task.trackingCode.toLowerCase().includes(keyword)
        : true
      const matchesStatus = statusFilter ? task.status === statusFilter : true
      return matchesKeyword && matchesStatus
    })
  }, [searchValue, statusFilter, tasks])

  const statsItems = useMemo<StatsGridItem[]>(() => {
    const total = tasks.length
    const totalBoxes = tasks.reduce((sum, task) => sum + task.totalBoxes, 0)
    const inTransit = tasks.filter(task => task.status === ShipmentStatus.IN_TRANSIT).length
    const completed = tasks.filter(task => task.status === ShipmentStatus.COMPLETED).length

    return [
      {
        key: 'total',
        label: '发货任务',
        value: total,
        iconName: 'local_shipping',
        iconColor: '#3b82f6'
      },
      {
        key: 'boxes',
        label: '总箱数',
        value: totalBoxes,
        iconName: 'inventory',
        iconColor: '#10b981'
      },
      {
        key: 'inTransit',
        label: '在途',
        value: inTransit,
        iconName: 'flight',
        iconColor: '#6366f1'
      },
      {
        key: 'completed',
        label: '已完成',
        value: completed,
        iconName: 'check_circle',
        iconColor: '#10b981'
      }
    ]
  }, [tasks])

  const getStatusProgress = (status: ShipmentStatus) => {
    const index = STATUS_FLOW.indexOf(status)
    if (index === -1) return 0
    return Math.round(((index + 1) / STATUS_FLOW.length) * 100)
  }

  const toggleTaskExpand = (taskId: string, event: ITouchEvent) => {
    event.stopPropagation()
    setExpandedTasks(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) {
        next.delete(taskId)
      } else {
        next.add(taskId)
      }
      return next
    })
  }

  const openStatusPopup = (task: ShipmentTask) => {
    setCurrentTask(task)
    setStatusPopupVisible(true)
  }

  const handleStatusChange = (status: ShipmentStatus) => {
    if (!currentTask) {
      return
    }
    setTasks(prev => prev.map(item => (
      item.id === currentTask.id
        ? { ...item, status, updatedAt: new Date().toISOString() }
        : item
    )))
    setStatusPopupVisible(false)
    setCurrentTask(null)
    Taro.showToast({ title: '状态更新成功', icon: 'success' })
  }

  const renderTaskDetails = (task: ShipmentTask) => (
    <InfoList
      columns={1}
      dense
      items={[
        { key: 'fba', label: 'FBA件码', value: task.fbaCode },
        { key: 'warehouse', label: 'FBA仓', value: task.fbaWarehouse },
        { key: 'country', label: '国家', value: task.country },
        { key: 'channel', label: '渠道', value: task.channel },
        { key: 'logistics', label: '货代公司', value: task.logistics },
        { key: 'tracking', label: '运单编码', value: task.trackingCode },
        { key: 'type', label: '发货方式', value: task.warehouseType },
        { key: 'invoice', label: '发票截止', value: task.invoiceDeadline },
        { key: 'receive', label: '收货截止', value: task.receiveDeadline },
        { key: 'clearance', label: '清关方式', value: task.clearance }
      ]}
    />
  )

  return (
    <MobileLayout className='shipment-task'>
      <View className='shipment-task__content'>
        <SectionCard title='发货任务概览' description='跟踪发货节点与在途情况' compact>
          <StatsGrid items={statsItems} />
        </SectionCard>

        <SectionCard title='任务筛选' description='支持按关键字与状态组合筛选' compact>
          <SearchBar
            value={searchValue}
            placeholder='搜索产品名称、FBA件码或运单号'
            onChange={setSearchValue}
            onSearch={setSearchValue}
          />
          <FilterChips
            options={STATUS_OPTIONS}
            selectedValues={statusFilter ? [statusFilter] : []}
            onChange={(values) => setStatusFilter(values[0] ?? '')}
            allowClear
            scrollable
          />
        </SectionCard>

        <SectionCard
          title='发货任务列表'
          description={`共 ${filteredTasks.length} 条任务`}
          compact
        >
          <View className='shipment-task__list'>
            {filteredTasks.map(task => {
              const expanded = expandedTasks.has(task.id)
              return (
                <View key={task.id} className='shipment-task__card'>
                  <View className='shipment-task__card-header'>
                    <View className='shipment-task__card-heading'>
                      <Text className='shipment-task__card-title'>{task.productName}</Text>
                      <View
                        className='shipment-task__status'
                        style={{ backgroundColor: StatusColors[task.status] }}
                      >
                        {StatusLabels[task.status]}
                      </View>
                    </View>
                    <View className='shipment-task__card-actions'>
                      <Button
                        size='mini'
                        onClick={() => openStatusPopup(task)}
                      >
                        更新状态
                      </Button>
                      <View
                        className='shipment-task__expand'
                        onClick={(event) => toggleTaskExpand(task.id, event)}
                      >
                        <MaterialIcons
                          name={expanded ? 'expand_less' : 'expand_more'}
                          size={24}
                          color='#6b7280'
                        />
                      </View>
                    </View>
                  </View>

                  <View className='shipment-task__meta'>
                    <Text>店铺：{task.shop}</Text>
                    <Text>分类：{task.category}</Text>
                    <Text>总箱数：{task.totalBoxes}</Text>
                    <Text>发货日期：{task.date}</Text>
                  </View>

                  <View className='shipment-task__progress'>
                    <Text className='shipment-task__progress-text'>流程进度 {getStatusProgress(task.status)}%</Text>
                    <ProgressBar value={getStatusProgress(task.status)} showLabel={false} />
                  </View>

                  <View className='shipment-task__timestamps'>
                    <Text>创建：{task.createdAt.slice(0, 10)}</Text>
                    <Text>更新：{task.updatedAt.slice(0, 10)}</Text>
                  </View>

                  {expanded && (
                    <View className='shipment-task__details'>
                      {renderTaskDetails(task)}
                    </View>
                  )}
                </View>
              )
            })}

            {!loading && filteredTasks.length === 0 && (
              <View className='shipment-task__empty'>
                <MaterialIcons name='inventory_2' size={64} color='#d1d5db' />
                <Text className='shipment-task__empty-title'>暂无符合条件的任务</Text>
                <Text className='shipment-task__empty-text'>尝试调整筛选条件或稍后再试</Text>
              </View>
            )}
          </View>
        </SectionCard>
      </View>

      <Popup
        visible={statusPopupVisible}
        position='bottom'
        round
        onClose={() => setStatusPopupVisible(false)}
      >
        <View className='shipment-task__popup'>
          <Text className='shipment-task__popup-title'>选择新的任务状态</Text>
          <View className='shipment-task__popup-list'>
            {STATUS_FLOW.map(status => (
              <Button
                key={status}
                block
                size='small'
                style={{
                  marginBottom: '16rpx',
                  background: StatusColors[status],
                  color: '#ffffff'
                }}
                onClick={() => handleStatusChange(status)}
              >
                {StatusLabels[status]}
              </Button>
            ))}
          </View>
        </View>
      </Popup>
    </MobileLayout>
  )
}

export default ShipmentTaskPage
