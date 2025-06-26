import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Badge } from '@nutui/nutui-react-taro'
import { Home, CheckNormal, Plus, Message, User } from '@nutui/icons-react-taro'
// 移除不必要的导入，使用CSS env()处理安全区域
import { cn } from '../../utils/cn'
import tabBarManager from '../../utils/tabBarManager'
import './index.scss'

interface TabItem {
  pagePath: string
  text: string
  iconPath: string
  selectedIconPath: string
}

/**
 * 微信小程序增强底部导航组件
 * 自主管理导航逻辑，无需外部传入回调函数
 * 集成微信小程序API，支持振动反馈、徽章显示、页面预加载等功能
 * 动态适配底部安全区域高度
 */
const BottomNavigation: React.FC = () => {
  const [selected, setSelected] = useState(0)
  const [messageCount, setMessageCount] = useState(0)

  const color = '#6b7280'
  const selectedColor = '#3b82f6'

  const list: TabItem[] = [
    {
      pagePath: '/pages/home/index',
      text: '首页',
      iconPath: '/assets/icons/home.png',
      selectedIconPath: '/assets/icons/home-active.png'
    },
    {
      pagePath: '/pages/tasks/index',
      text: '任务',
      iconPath: '/assets/icons/task.png',
      selectedIconPath: '/assets/icons/task-active.png'
    },
    {
      pagePath: '/pages/create/index',
      text: '创建',
      iconPath: '/assets/icons/add.png',
      selectedIconPath: '/assets/icons/add-active.png'
    },
    {
      pagePath: '/pages/messages/index',
      text: '消息',
      iconPath: '/assets/icons/message.png',
      selectedIconPath: '/assets/icons/message-active.png'
    },
    {
      pagePath: '/pages/profile/index',
      text: '我的',
      iconPath: '/assets/icons/user.png',
      selectedIconPath: '/assets/icons/user-active.png'
    }
  ]

  useEffect(() => {
    // 监听 tabBar 状态变化
    const handleTabChange = (index: number) => {
      setSelected(index)
    }

    const handleMessageChange = (count: number) => {
      setMessageCount(count)
    }

    Taro.eventCenter.on('tabBarActiveChange', handleTabChange)
    Taro.eventCenter.on('messageCountChange', handleMessageChange)

    // 初始化状态
    setSelected(tabBarManager.getActiveTab())
    setMessageCount(tabBarManager.getMessageCount())

    return () => {
      Taro.eventCenter.off('tabBarActiveChange', handleTabChange)
      Taro.eventCenter.off('messageCountChange', handleMessageChange)
    }
  }, [])

  const switchTab = (index: number, url: string) => {
    tabBarManager.switchTab(index, url)
  }

  // 渲染Tab项
  const renderTabItem = (item: TabItem, index: number) => {
    const isSelected = selected === index
    const isCreate = index === 2
    const isMessage = index === 3

    return (
      <View
        key={index}
        className={cn('tab-item', {
          'special': isCreate,
          'active': isSelected
        })}
        onClick={() => switchTab(index, item.pagePath)}
      >
        {isCreate ? (
          <View className='create-button'>
            <Image className='create-icon' src={item.iconPath} />
          </View>
        ) : (
          <>
            <View className='icon-wrapper'>
              <Image
                className='tab-icon'
                src={isSelected ? item.selectedIconPath : item.iconPath}
              />
              {isMessage && messageCount > 0 && (
                <View className='badge'>{messageCount > 99 ? '99+' : messageCount}</View>
              )}
            </View>
            <Text
              className='tab-text'
              style={{ color: isSelected ? selectedColor : color }}
            >
              {item.text}
            </Text>
          </>
        )}
      </View>
    )
  }

  // 简化：让CSS env()自动处理安全区域
  console.log('BottomNavigation 使用CSS env()自动处理安全区域')

  return (
    <View className="bottom-navigation">
      <View className="nav-content">
        {list.map((item, index) => renderTabItem(item, index))}
      </View>
    </View>
  )
}

export default BottomNavigation
