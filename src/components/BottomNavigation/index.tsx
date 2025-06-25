import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Badge } from '@nutui/nutui-react-taro'
import { Home, CheckNormal, Plus, Message, User } from '@nutui/icons-react-taro'
// 移除不必要的导入，使用CSS env()处理安全区域
import { cn } from '../../utils/cn'
import tabBarManager from '../../utils/tabBarManager'
import './index.scss'

interface BottomNavigationProps {
  /** 消息数量 */
  messageCount?: number
  /** 是否显示 */
  visible?: boolean
}

// Tab配置
const TAB_CONFIG = [
  {
    id: 'home',
    label: '首页',
    icon: Home,
    pagePath: '/pages/home/index',
    index: 0
  },
  {
    id: 'tasks',
    label: '任务',
    icon: CheckNormal,
    pagePath: '/pages/tasks/index',
    index: 1
  },
  {
    id: 'create',
    label: '创建流程',
    icon: Plus,
    pagePath: '/pages/create/index',
    special: true,
    index: 2
  },
  {
    id: 'messages',
    label: '消息',
    icon: Message,
    pagePath: '/pages/messages/index',
    showBadge: true,
    index: 3
  },
  {
    id: 'profile',
    label: '我的',
    icon: User,
    pagePath: '/pages/profile/index',
    index: 4
  }
]

/**
 * 微信小程序增强底部导航组件
 * 自主管理导航逻辑，无需外部传入回调函数
 * 集成微信小程序API，支持振动反馈、徽章显示、页面预加载等功能
 * 动态适配底部安全区域高度
 */
const BottomNavigation: React.FC<BottomNavigationProps> = ({
  messageCount = 0,
  visible = true
}) => {
  const [currentTab, setCurrentTab] = useState('home')
  const [currentMessageCount, setCurrentMessageCount] = useState(messageCount)

  // 获取当前页面对应的Tab
  const getCurrentTabFromRoute = () => {
    try {
      const pages = Taro.getCurrentPages()
      if (pages.length === 0) return 'home'

      const currentPage = pages[pages.length - 1]
      const currentRoute = currentPage.route

      // 查找对应的Tab
      const tab = TAB_CONFIG.find(t =>
        currentRoute === t.pagePath.substring(1) // 移除开头的 '/'
      )

      return tab ? tab.id : 'home'
    } catch (error) {
      console.warn('获取当前页面Tab失败:', error)
      return 'home'
    }
  }

  useEffect(() => {
    // 初始化时设置当前Tab
    const currentTabId = getCurrentTabFromRoute()
    setCurrentTab(currentTabId)

    // 更新TabBar管理器状态
    const tab = TAB_CONFIG.find(t => t.id === currentTabId)
    if (tab) {
      tabBarManager.setActiveTab(tab.index)
    }

    // 监听TabBar管理器的状态变化
    const handleActiveChange = (index: number) => {
      const tab = TAB_CONFIG.find(t => t.index === index)
      if (tab) {
        setCurrentTab(tab.id)
      }
    }

    const handleMessageCountChange = (count: number) => {
      setCurrentMessageCount(count)
    }

    // 注册事件监听
    Taro.eventCenter.on('tabBarActiveChange', handleActiveChange)
    Taro.eventCenter.on('messageCountChange', handleMessageCountChange)

    return () => {
      Taro.eventCenter.off('tabBarActiveChange', handleActiveChange)
      Taro.eventCenter.off('messageCountChange', handleMessageCountChange)
    }
  }, [])

  useEffect(() => {
    setCurrentMessageCount(messageCount)
  }, [messageCount])

  // 处理Tab点击 - 完全自主的导航逻辑
  const handleTabClick = async (tab: typeof TAB_CONFIG[0]) => {
    // 如果点击的是当前激活的Tab，不做处理
    if (currentTab === tab.id) return

    try {
      // 触发微信振动反馈
      await Taro.vibrateShort({
        type: 'light'
      }).catch(() => {
        // 振动API可能在某些环境下不支持，静默处理
      })

      // 页面预加载
      try {
        await Taro.preloadPage({
          url: tab.pagePath
        }).catch(() => {
          // 预加载可能失败，静默处理
        })
      } catch (error) {
        // 某些Taro版本可能不支持preloadPage
      }

      // 所有tabBar页面都使用switchTab进行跳转
      await Taro.switchTab({
        url: tab.pagePath
      })

      // 更新TabBar管理器状态
      tabBarManager.setActiveTab(tab.index)

      // 更新本地状态
      setCurrentTab(tab.id)

    } catch (error) {
      console.error('Tab切换失败:', error)

      // 显示错误提示
      Taro.showToast({
        title: '页面跳转失败',
        icon: 'none',
        duration: 2000
      })
    }
  }

  // 渲染Tab图标
  const renderTabIcon = (tab: typeof TAB_CONFIG[0], isActive: boolean) => {
    const IconComponent = tab.icon
    const color = isActive ? '#07c160' : '#666'

    return (
      <IconComponent
        size="24"
        color={color}
      />
    )
  }

  // 渲染Tab项
  const renderTabItem = (tab: typeof TAB_CONFIG[0]) => {
    const isActive = currentTab === tab.id

    return (
      <View
        key={tab.id}
        className={cn('tab-item', {
          'special': tab.special,
          'active': isActive
        })}
        onClick={() => handleTabClick(tab)}
      >
        {/* 图标容器 */}
        <View className="tab-icon-container">
          {/* 特殊创建按钮的背景 */}
          {tab.special && <View className="special-bg" />}

          <View className="tab-icon">
            {renderTabIcon(tab, isActive)}
          </View>

          {/* 消息徽章 */}
          {tab.showBadge && currentMessageCount > 0 && (
            <View className="tab-badge">
              <Badge
                value={currentMessageCount > 99 ? '99+' : currentMessageCount.toString()}
              />
            </View>
          )}
        </View>

        {/* 标签文字 */}
        <View className={cn('tab-label', { 'active': isActive })}>
          {tab.label}
        </View>
      </View>
    )
  }

  if (!visible) return null

  // 简化：让CSS env()自动处理安全区域
  console.log('BottomNavigation 使用CSS env()自动处理安全区域')

  return (
    <View className="bottom-navigation">
      <View className="nav-content">
        {TAB_CONFIG.map(tab => renderTabItem(tab))}
      </View>
    </View>
  )
}

export default BottomNavigation
