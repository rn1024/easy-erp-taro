import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
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

  const handleNavigateToPackage = () => {
    console.log('点击包装任务卡片')
    Taro.showToast({
      title: '正在跳转到包装任务',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/warehouse/package/index' })
    }, 500)
  }

  const handleNavigateToShipment = () => {
    console.log('点击发货任务卡片')
    Taro.showToast({
      title: '正在跳转到发货任务',
      icon: 'loading',
      duration: 1000
    })
    setTimeout(() => {
      Taro.navigateTo({ url: '/pages/warehouse/shipment/index' })
    }, 500)
  }

  return (
    <MobileLayout className='warehouse-page'>
      <View className='warehouse-page__content'>
        {/* 任务入口卡片 */}
        <View className='warehouse-page__cards'>
          {/* 包装任务卡片 */}
          <View 
            className='warehouse-page__card warehouse-page__card--package'
            onClick={handleNavigateToPackage}
            onTouchStart={() => console.log('触摸开始 - 包装任务')}
          >
            <View className='task-card__header'>
              <View className='task-card__icon'>
                <MaterialIcons name='inventory_2' size={48} color='#1890ff' />
              </View>
              <View className='task-card__info'>
                <Text className='task-card__title'>包装任务</Text>
                <Text className='task-card__desc'>商品包装作业管理</Text>
              </View>
              <View className='task-card__arrow'>
                <MaterialIcons name='chevron_right' size={24} color='#999' />
              </View>
            </View>
            
            <View className='task-card__stats'>
              <View className='task-stat'>
                <Text className='task-stat__value'>{stats.packageTasks.total}</Text>
                <Text className='task-stat__label'>总任务</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--pending'>{stats.packageTasks.pending}</Text>
                <Text className='task-stat__label'>待处理</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--progress'>{stats.packageTasks.inProgress}</Text>
                <Text className='task-stat__label'>进行中</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--completed'>{stats.packageTasks.completed}</Text>
                <Text className='task-stat__label'>已完成</Text>
              </View>
            </View>
            
            <View className='task-card__progress'>
              <Text className='task-card__progress-text'>
                完成进度: {Math.round((stats.packageTasks.completed / stats.packageTasks.total) * 100)}%
              </Text>
              <View className='task-card__progress-bar'>
                <View 
                  className='task-card__progress-fill task-card__progress-fill--package'
                  style={{ width: `${(stats.packageTasks.completed / stats.packageTasks.total) * 100}%` }}
                />
              </View>
            </View>
          </View>

          {/* 发货任务卡片 */}
          <View 
            className='warehouse-page__card warehouse-page__card--shipment'
            onClick={handleNavigateToShipment}
            onTouchStart={() => console.log('触摸开始 - 发货任务')}
          >
            <View className='task-card__header'>
              <View className='task-card__icon'>
                <MaterialIcons name='local_shipping' size={48} color='#52c41a' />
              </View>
              <View className='task-card__info'>
                <Text className='task-card__title'>发货任务</Text>
                <Text className='task-card__desc'>物流发货作业管理</Text>
              </View>
              <View className='task-card__arrow'>
                <MaterialIcons name='chevron_right' size={24} color='#999' />
              </View>
            </View>
            
            <View className='task-card__stats'>
              <View className='task-stat'>
                <Text className='task-stat__value'>{stats.shipmentTasks.total}</Text>
                <Text className='task-stat__label'>总任务</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--pending'>{stats.shipmentTasks.pending}</Text>
                <Text className='task-stat__label'>待发货</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--transit'>{stats.shipmentTasks.inTransit}</Text>
                <Text className='task-stat__label'>在途中</Text>
              </View>
              <View className='task-stat'>
                <Text className='task-stat__value task-stat__value--completed'>{stats.shipmentTasks.completed}</Text>
                <Text className='task-stat__label'>已交付</Text>
              </View>
            </View>
            
            <View className='task-card__progress'>
              <Text className='task-card__progress-text'>
                完成进度: {Math.round((stats.shipmentTasks.completed / stats.shipmentTasks.total) * 100)}%
              </Text>
              <View className='task-card__progress-bar'>
                <View 
                  className='task-card__progress-fill task-card__progress-fill--shipment'
                  style={{ width: `${(stats.shipmentTasks.completed / stats.shipmentTasks.total) * 100}%` }}
                />
              </View>
            </View>
          </View>
        </View>
      </View>
    </MobileLayout>
  )
}

export default WarehousePage