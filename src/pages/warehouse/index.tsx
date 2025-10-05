import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, StatsGrid, ProgressBar, Icon } from '@/components/common'

/**
 * Types
 */
import type { StatsGridItem } from '@/components/common'

import './index.scss'

interface TaskStats {
  packageTasks: {
    total: number
    pending: number
    inProgress: number
    completed: number
  }
  shipmentTasks: {
    total: number
    pending: number
    inTransit: number
    completed: number
  }
}

const WarehousePage: React.FC = () => {
  const [stats, _setStats] = useState<TaskStats>({
    packageTasks: {
      total: 45,
      pending: 8,
      inProgress: 12,
      completed: 25
    },
    shipmentTasks: {
      total: 32,
      pending: 6,
      inTransit: 9,
      completed: 17
    }
  })

  const handleNavigateToPackage = (): void => {
    Taro.showToast({
      title: '正在跳转到包装任务',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/warehouse/package/index' })
    }, 500)
  }

  const handleNavigateToShipment = (): void => {
    Taro.showToast({
      title: '正在跳转到发货任务',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/warehouse/shipment/index' })
    }, 500)
  }

  const getProgress = (completed: number, total: number) => {
    if (total === 0) {
      return 0
    }
    return Math.round((completed / total) * 100)
  }

  const taskCards: Array<{
    id: 'package' | 'shipment'
    title: string
    description: string
    iconName: string
    iconColor: string
    stats: StatsGridItem[]
    progress: number
    onClick: () => void
  }> = [
    {
      id: 'package',
      title: '包装任务',
      description: '商品包装作业管理',
      iconName: 'inventory_2',
      iconColor: '#1890ff',
      stats: [
        { key: 'total', label: '总任务', value: stats.packageTasks.total, variant: 'flat' },
        { key: 'pending', label: '待处理', value: stats.packageTasks.pending, variant: 'flat' },
        { key: 'progress', label: '进行中', value: stats.packageTasks.inProgress, variant: 'flat' },
        { key: 'completed', label: '已完成', value: stats.packageTasks.completed, variant: 'flat' }
      ],
      progress: getProgress(stats.packageTasks.completed, stats.packageTasks.total),
      onClick: handleNavigateToPackage
    },
    {
      id: 'shipment',
      title: '发货任务',
      description: '物流发货作业管理',
      iconName: 'local_shipping',
      iconColor: '#52c41a',
      stats: [
        { key: 'total', label: '总任务', value: stats.shipmentTasks.total, variant: 'flat' },
        { key: 'pending', label: '待发货', value: stats.shipmentTasks.pending, variant: 'flat' },
        { key: 'transit', label: '在途中', value: stats.shipmentTasks.inTransit, variant: 'flat' },
        { key: 'completed', label: '已交付', value: stats.shipmentTasks.completed, variant: 'flat' }
      ],
      progress: getProgress(stats.shipmentTasks.completed, stats.shipmentTasks.total),
      onClick: handleNavigateToShipment
    }
  ]

  return (
    <MobileLayout className='warehouse-page'>
      <View className='warehouse-page__content'>
        {taskCards.map(card => (
          <SectionCard
            key={card.id}
            title={card.title}
            description={card.description}
            titleIcon={<Icon name={card.iconName} size={40} color={card.iconColor} />}
            meta={<Text>完成进度：{card.progress}%</Text>}
            clickable
            onClick={card.onClick}
            compact
          >
            <StatsGrid items={card.stats} />
            <ProgressBar value={card.progress} max={100} showLabel={false} color={card.iconColor} />
          </SectionCard>
        ))}
      </View>
    </MobileLayout>
  )
}

export default WarehousePage
