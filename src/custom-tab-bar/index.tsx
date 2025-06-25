import React, { Component } from 'react'
import { View } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { Badge } from '@nutui/nutui-react-taro'
import {
  Home,
  CheckNormal,
  Plus,
  Message,
  User
} from '@nutui/icons-react-taro'
import './index.scss'

interface TabBarState {
  activeTab: number
  messageCount: number
  isVisible: boolean
}

// TabBar配置数据
const TAB_BAR_CONFIG = [
  {
    id: 'home',
    pagePath: '/pages/home/index',
    text: '首页',
    icon: Home,
    activeColor: '#07c160',
    normalColor: '#666666'
  },
  {
    id: 'tasks',
    pagePath: '/pages/tasks/index',
    text: '任务',
    icon: CheckNormal,
    activeColor: '#07c160',
    normalColor: '#666666'
  },
  {
    id: 'create',
    pagePath: '/pages/create/index',
    text: '创建',
    icon: Plus,
    activeColor: '#ffffff',
    normalColor: '#ffffff',
    special: true // 特殊样式的创建按钮
  },
  {
    id: 'messages',
    pagePath: '/pages/messages/index',
    text: '消息',
    icon: Message,
    activeColor: '#07c160',
    normalColor: '#666666',
    badge: true // 支持徽章显示
  },
  {
    id: 'profile',
    pagePath: '/pages/profile/index',
    text: '我的',
    icon: User,
    activeColor: '#07c160',
    normalColor: '#666666'
  }
]

/**
 * 微信小程序自定义TabBar组件
 * 集成微信小程序API，支持徽章、振动反馈、页面预加载等功能
 */
export default class CustomTabBar extends Component<{}, TabBarState> {

  constructor(props: {}) {
    super(props)

    this.state = {
      activeTab: 0,
      messageCount: 0,
      isVisible: true
    }
  }

  componentDidMount() {
    // 获取当前页面路径，设置对应的activeTab
    this.updateActiveTab()

    // 监听页面切换事件
    Taro.eventCenter.on('tabBarActiveChange', this.handleActiveChange)

    // 监听消息数量变化
    Taro.eventCenter.on('messageCountChange', this.handleMessageCountChange)
  }

  componentWillUnmount() {
    Taro.eventCenter.off('tabBarActiveChange', this.handleActiveChange)
    Taro.eventCenter.off('messageCountChange', this.handleMessageCountChange)
  }

  // 更新当前激活的Tab
  updateActiveTab = () => {
    const pages = Taro.getCurrentPages()
    if (pages.length === 0) return

    const currentPage = pages[pages.length - 1]
    const currentRoute = currentPage.route

    const activeIndex = TAB_BAR_CONFIG.findIndex(tab =>
      tab.pagePath === `/${currentRoute}`
    )

    if (activeIndex !== -1) {
      this.setState({ activeTab: activeIndex })
    }
  }

  // 处理activeTab变化
  handleActiveChange = (index: number) => {
    this.setState({ activeTab: index })
  }

  // 处理消息数量变化
  handleMessageCountChange = (count: number) => {
    this.setState({ messageCount: count })
  }

  // 处理Tab点击
  handleTabClick = async (item: typeof TAB_BAR_CONFIG[0], index: number) => {
    const { activeTab } = this.state

    // 如果点击的是当前激活的Tab，不做处理
    if (activeTab === index) return

    try {
      // 触发微信振动反馈
      await Taro.vibrateShort({
        type: 'light'
      }).catch(() => {
        // 振动API可能在某些环境下不支持，静默处理
      })

      // 特殊处理创建页面
      if (item.special) {
        // 创建页面使用navigateTo而不是switchTab
        await Taro.navigateTo({
          url: item.pagePath
        })
        return
      }

      // 页面预加载
      this.preloadPage(item.pagePath)

      // 切换到指定页面
      await Taro.switchTab({
        url: item.pagePath
      })

      // 更新activeTab状态
      this.setState({ activeTab: index })

      // 触发全局事件，通知其他组件
      Taro.eventCenter.trigger('tabBarActiveChange', index)

    } catch (error) {
      console.error('Tab切换失败:', error)
    }
  }

  // 页面预加载
  preloadPage = (pagePath: string) => {
    try {
      // 预加载下一个页面，提升切换性能
      Taro.preloadPage({
        url: pagePath
      }).catch(() => {
        // 预加载可能失败，静默处理
      })
    } catch (error) {
      // 某些Taro版本可能不支持preloadPage
    }
  }

  // 获取Tab图标
  renderTabIcon = (item: typeof TAB_BAR_CONFIG[0], isActive: boolean) => {
    const IconComponent = item.icon
    const color = isActive ? item.activeColor : item.normalColor

    return (
      <IconComponent
        size="24"
        color={color}
      />
    )
  }

  // 渲染Tab项
  renderTabItem = (item: typeof TAB_BAR_CONFIG[0], index: number) => {
    const { activeTab, messageCount } = this.state
    const isActive = activeTab === index

    return (
      <View
        key={item.id}
        className={`tab-item ${item.special ? 'special' : ''} ${isActive ? 'active' : ''}`}
        onClick={() => this.handleTabClick(item, index)}
      >
        {/* 图标容器 */}
        <View className="tab-icon-container">
          {/* 特殊创建按钮的背景 */}
          {item.special && <View className="special-bg" />}

          <View className="tab-icon">
            {this.renderTabIcon(item, isActive)}
          </View>

          {/* 消息徽章 */}
          {item.badge && messageCount > 0 && (
            <View className="tab-badge">
              <Badge
                value={messageCount > 99 ? '99+' : messageCount.toString()}
              />
            </View>
          )}
        </View>

        {/* 标签文字 */}
        <View
          className={`tab-label ${isActive ? 'active' : ''}`}
          style={{
            color: isActive ? item.activeColor : item.normalColor
          }}
        >
          {item.text}
        </View>
      </View>
    )
  }

  render() {
    const { isVisible } = this.state

    if (!isVisible) return null

    return (
      <View className="custom-tab-bar">
        <View className="tab-bar-content">
          {TAB_BAR_CONFIG.map((item, index) =>
            this.renderTabItem(item, index)
          )}
        </View>

        {/* 安全区域适配 */}
        <View className="safe-area-bottom" />
      </View>
    )
  }
}

// 导出组件供微信小程序使用
export { CustomTabBar }
