import React, { useState, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, StatsGrid, Icon } from '@/components/common'

import './index.scss'

interface WarehouseStats {
  totalOrders: number
  packagingQueue: number
  shippingQueue: number
  completedToday: number
  efficiency: number
}

interface TaskItem {
  id: string
  orderNumber: string
  customerName: string
  products: {
    name: string
    quantity: number
    sku: string
  }[]
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'packaging' | 'shipping' | 'completed'
  assignee?: string
  deadline: string
  estimatedTime: number // 分钟
  createdAt: string
}

interface QuickAction {
  id: string
  title: string
  subtitle: string
  icon: string
  iconColor: string
  bgColor: string
  route: string
  badge?: number
}

const priorityConfig = {
  high: { label: '紧急', color: '#ff4d4f', bgColor: 'rgba(255, 77, 79, 0.1)' },
  medium: { label: '普通', color: '#faad14', bgColor: 'rgba(250, 173, 20, 0.1)' },
  low: { label: '较低', color: '#52c41a', bgColor: 'rgba(82, 196, 26, 0.1)' }
}

const statusConfig = {
  pending: { label: '待处理', color: '#8c8c8c', bgColor: 'rgba(140, 140, 140, 0.1)' },
  packaging: { label: '包装中', color: '#1890ff', bgColor: 'rgba(24, 144, 255, 0.1)' },
  shipping: { label: '发货中', color: '#722ed1', bgColor: 'rgba(114, 46, 209, 0.1)' },
  completed: { label: '已完成', color: '#52c41a', bgColor: 'rgba(82, 196, 26, 0.1)' }
}

const WarehousePage: React.FC = () => {
  const [stats] = useState<WarehouseStats>({
    totalOrders: 156,
    packagingQueue: 23,
    shippingQueue: 18,
    completedToday: 67,
    efficiency: 95.2
  })
  
  const [currentTasks] = useState<TaskItem[]>([
    {
      id: 'T001',
      orderNumber: 'ORD-2024-001234',
      customerName: '张先生',
      products: [
        { name: 'iPhone 15 Pro Max', quantity: 1, sku: 'IPHONE15PM-512-BLUE' },
        { name: 'MagSafe充电器', quantity: 1, sku: 'MAGSAFE-CHARGER-WHITE' }
      ],
      priority: 'high',
      status: 'packaging',
      assignee: '李师傅',
      deadline: '14:30',
      estimatedTime: 15,
      createdAt: '10:20'
    },
    {
      id: 'T002',
      orderNumber: 'ORD-2024-001235',
      customerName: '王女士',
      products: [
        { name: 'MacBook Pro 14英寸', quantity: 1, sku: 'MBP14-M3-512GB-SPACE' }
      ],
      priority: 'medium',
      status: 'pending',
      deadline: '16:00',
      estimatedTime: 25,
      createdAt: '11:15'
    },
    {
      id: 'T003',
      orderNumber: 'ORD-2024-001236',
      customerName: '陈总',
      products: [
        { name: 'AirPods Pro 第3代', quantity: 2, sku: 'AIRPODS-PRO3-WHITE' },
        { name: 'Apple Watch Series 9', quantity: 1, sku: 'WATCH-S9-45MM-MIDNIGHT' }
      ],
      priority: 'low',
      status: 'shipping',
      assignee: '赵师傅',
      deadline: '17:30',
      estimatedTime: 20,
      createdAt: '09:45'
    }
  ])

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
    // 模拟刷新逻辑
  }

  const handleQuickAction = (route: string) => {
    Taro.navigateTo({ url: route })
  }

  const handleTaskClick = (task: TaskItem) => {
    const productList = task.products.map(p => `${p.name} x${p.quantity}`).join('\n')
    Taro.showModal({
      title: `任务详情 - ${task.orderNumber}`,
      content: `客户：${task.customerName}\n商品：\n${productList}\n负责人：${task.assignee || '未分配'}\n截止时间：${task.deadline}\n预计用时：${task.estimatedTime}分钟`,
      showCancel: false,
      confirmText: '确定'
    })
  }

  const formatTime = (timeStr: string) => {
    return `今天 ${timeStr}`
  }

  const getTimeRemaining = (deadline: string) => {
    const now = new Date()
    const deadlineTime = new Date(`${now.toDateString()} ${deadline}:00`)
    const diff = deadlineTime.getTime() - now.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    if (diff < 0) return '已超时'
    if (hours > 0) return `${hours}小时${minutes}分钟`
    return `${minutes}分钟`
  }

  const statsItems = useMemo(() => [
    {
      key: 'total',
      label: '总订单',
      value: stats.totalOrders,
      iconName: 'receipt_long',
      iconColor: '#3b82f6',
      iconBgColor: 'rgba(59, 130, 246, 0.1)'
    },
    {
      key: 'packaging',
      label: '包装队列',
      value: stats.packagingQueue,
      iconName: 'inventory_2',
      iconColor: '#f59e0b',
      iconBgColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      key: 'shipping',
      label: '发货队列',
      value: stats.shippingQueue,
      iconName: 'local_shipping',
      iconColor: '#8b5cf6',
      iconBgColor: 'rgba(139, 92, 246, 0.1)'
    },
    {
      key: 'completed',
      label: '今日完成',
      value: stats.completedToday,
      iconName: 'done_all',
      iconColor: '#10b981',
      iconBgColor: 'rgba(16, 185, 129, 0.1)'
    }
  ], [stats])

  const quickActions: QuickAction[] = useMemo(() => [
    {
      id: 'package',
      title: '包装任务',
      subtitle: '管理包装作业',
      icon: 'inventory_2',
      iconColor: '#ffffff',
      bgColor: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      route: '/pages/warehouse/package/index',
      badge: stats.packagingQueue
    },
    {
      id: 'shipment',
      title: '发货任务',
      subtitle: '管理发货作业',
      icon: 'local_shipping',
      iconColor: '#ffffff',
      bgColor: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      route: '/pages/warehouse/shipment/index',
      badge: stats.shippingQueue
    },
    {
      id: 'inventory',
      title: '库存管理',
      subtitle: '查看库存状态',
      icon: 'inventory',
      iconColor: '#ffffff',
      bgColor: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      route: '/pages/inventory/finished/index'
    },
    {
      id: 'reports',
      title: '作业报表',
      subtitle: '查看统计数据',
      icon: 'assessment',
      iconColor: '#ffffff',
      bgColor: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      route: '/pages/reports/warehouse/index'
    }
  ], [stats])

  return (
    <MobileLayout className='warehouse-page'>
      <View className='warehouse-page__wrapper'>
        {/* 页面头部 */}
        <View className='warehouse-page__header'>
          <Text className='warehouse-page__title'>仓库管理</Text>
          <Text className='warehouse-page__subtitle'>实时监控仓库作业状态</Text>
          <View className='warehouse-page__efficiency'>
            <Icon name='trending_up' size={16} color='#10b981' />
            <Text className='warehouse-page__efficiency-text'>作业效率 {stats.efficiency}%</Text>
          </View>
        </View>

        {/* 统计数据 */}
        <SectionCard className='warehouse-page__stats'>
          <StatsGrid items={statsItems} />
        </SectionCard>

        {/* 快捷操作 */}
        <SectionCard title='快捷操作' className='warehouse-page__actions'>
          <View className='warehouse-page__action-grid'>
            {quickActions.map((action) => (
              <View
                key={action.id}
                className='warehouse-page__action-card'
                style={{ background: action.bgColor }}
                onClick={() => handleQuickAction(action.route)}
              >
                <View className='warehouse-page__action-header'>
                  <Icon name={action.icon} size={24} color={action.iconColor} />
                  {action.badge && action.badge > 0 && (
                    <View className='warehouse-page__action-badge'>
                      {action.badge}
                    </View>
                  )}
                </View>
                <View className='warehouse-page__action-content'>
                  <Text className='warehouse-page__action-title'>{action.title}</Text>
                  <Text className='warehouse-page__action-subtitle'>{action.subtitle}</Text>
                </View>
              </View>
            ))}
          </View>
        </SectionCard>

        {/* 当前任务 */}
        <PullToRefresh onRefresh={handleRefresh}>
          <View className='warehouse-page__content'>
            <View className='warehouse-page__task-header'>
              <Text className='warehouse-page__task-title'>当前任务</Text>
              <Text className='warehouse-page__task-count'>({currentTasks.length}个)</Text>
            </View>
            
            <View className='warehouse-page__task-list'>
              {currentTasks.map((task) => {
                const priorityDisplay = priorityConfig[task.priority]
                const statusDisplay = statusConfig[task.status]
                
                return (
                  <View
                    key={task.id}
                    className='task-card'
                    onClick={() => handleTaskClick(task)}
                  >
                    <View className='task-card__header'>
                      <View className='task-card__order-info'>
                        <Text className='task-card__order-number'>{task.orderNumber}</Text>
                        <Text className='task-card__customer'>{task.customerName}</Text>
                      </View>
                      <View className='task-card__badges'>
                        <View 
                          className='task-card__priority'
                          style={{ 
                            background: priorityDisplay.bgColor,
                            color: priorityDisplay.color 
                          }}
                        >
                          {priorityDisplay.label}
                        </View>
                        <View 
                          className='task-card__status'
                          style={{ 
                            background: statusDisplay.bgColor,
                            color: statusDisplay.color 
                          }}
                        >
                          {statusDisplay.label}
                        </View>
                      </View>
                    </View>
                    
                    <View className='task-card__content'>
                      <View className='task-card__products'>
                        {task.products.slice(0, 2).map((product, index) => (
                          <Text key={index} className='task-card__product'>
                            {product.name} ×{product.quantity}
                          </Text>
                        ))}
                        {task.products.length > 2 && (
                          <Text className='task-card__product-more'>
                            等{task.products.length}件商品
                          </Text>
                        )}
                      </View>
                    </View>
                    
                    <View className='task-card__footer'>
                      <View className='task-card__time-info'>
                        <View className='task-card__deadline'>
                          <Icon name='schedule' size={14} color='var(--text-tertiary)' />
                          <Text className='task-card__deadline-text'>
                            {getTimeRemaining(task.deadline)}
                          </Text>
                        </View>
                        <Text className='task-card__created'>
                          创建于 {formatTime(task.createdAt)}
                        </Text>
                      </View>
                      {task.assignee && (
                        <View className='task-card__assignee'>
                          <Icon name='person' size={14} color='var(--text-tertiary)' />
                          <Text className='task-card__assignee-name'>{task.assignee}</Text>
                        </View>
                      )}
                    </View>
                  </View>
                )
              })}
            </View>
            
            {currentTasks.length === 0 && (
              <View className='warehouse-page__empty'>
                <Icon name='inventory_2' size={48} color='var(--text-tertiary)' />
                <Text className='warehouse-page__empty-text'>暂无进行中的任务</Text>
                <Text className='warehouse-page__empty-hint'>所有任务都已完成</Text>
              </View>
            )}
          </View>
        </PullToRefresh>
      </View>
    </MobileLayout>
  )
}

export default WarehousePage
