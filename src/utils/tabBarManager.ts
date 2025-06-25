import Taro from '@tarojs/taro'

/**
 * 自定义TabBar管理器
 * 提供全局TabBar状态管理和微信小程序API集成
 */
class TabBarManager {
  private messageCount: number = 0
  private currentActiveTab: number = 0

  /**
   * 设置消息数量
   * @param count 消息数量
   */
  setMessageCount(count: number) {
    this.messageCount = count

    // 通知TabBar组件更新徽章
    Taro.eventCenter.trigger('messageCountChange', count)

    // 如果支持原生TabBar徽章，也同步更新
    this.updateNativeTabBarBadge(count)
  }

  /**
   * 获取当前消息数量
   */
  getMessageCount(): number {
    return this.messageCount
  }

  /**
   * 设置当前激活的Tab
   * @param index Tab索引
   */
  setActiveTab(index: number) {
    this.currentActiveTab = index
    Taro.eventCenter.trigger('tabBarActiveChange', index)
  }

  /**
   * 获取当前激活的Tab
   */
  getActiveTab(): number {
    return this.currentActiveTab
  }

  /**
   * 显示TabBar
   */
  showTabBar() {
    try {
      // 如果有自定义TabBar实例，显示它
      const tabBar = this.getTabBarInstance()
      if (tabBar) {
        tabBar.setData?.({ isVisible: true })
      }
    } catch (error) {
      console.warn('显示TabBar失败:', error)
    }
  }

  /**
   * 隐藏TabBar
   */
  hideTabBar() {
    try {
      // 如果有自定义TabBar实例，隐藏它
      const tabBar = this.getTabBarInstance()
      if (tabBar) {
        tabBar.setData?.({ isVisible: false })
      }
    } catch (error) {
      console.warn('隐藏TabBar失败:', error)
    }
  }

  /**
   * 更新原生TabBar徽章（如果需要兼容）
   * @param count 徽章数量
   */
  private updateNativeTabBarBadge(count: number) {
    try {
      if (count > 0) {
        Taro.setTabBarBadge({
          index: 3, // 消息Tab的索引
          text: count > 99 ? '99+' : count.toString()
        }).catch(() => {
          // 静默处理，可能在某些环境下不支持
        })
      } else {
        Taro.removeTabBarBadge({
          index: 3
        }).catch(() => {
          // 静默处理
        })
      }
    } catch (error) {
      // 如果不支持原生TabBar API，忽略错误
    }
  }

  /**
   * 获取TabBar实例
   */
  private getTabBarInstance() {
    try {
      // 尝试获取微信小程序的TabBar实例
      const app = Taro.getApp()
      return app?.getTabBar?.()
    } catch (error) {
      return null
    }
  }

  /**
   * 切换到指定Tab
   * @param index Tab索引
   * @param url 页面路径（可选）
   */
  async switchTab(index: number, url?: string) {
    try {
      // 如果提供了URL，使用switchTab API
      if (url) {
        await Taro.switchTab({ url })
      }

      // 更新激活状态
      this.setActiveTab(index)

      // 触发振动反馈
      await Taro.vibrateShort({
        type: 'light'
      }).catch(() => {
        // 静默处理振动错误
      })

    } catch (error) {
      console.error('切换Tab失败:', error)
      throw error
    }
  }

  /**
   * 初始化TabBar状态
   */
  init() {
    // 根据当前页面设置激活Tab
    this.updateActiveTabFromCurrentPage()

    // 初始化消息数量（可以从缓存或API获取）
    this.loadMessageCount()
  }

  /**
   * 根据当前页面更新激活Tab
   */
  private updateActiveTabFromCurrentPage() {
    try {
      const pages = Taro.getCurrentPages()
      if (pages.length === 0) return

      const currentPage = pages[pages.length - 1]
      const currentRoute = currentPage.route

      // TabBar页面路径映射
      const tabPages = [
        'pages/home/index',
        'pages/tasks/index',
        'pages/create/index',
        'pages/messages/index',
        'pages/profile/index'
      ]

      const activeIndex = tabPages.findIndex(page =>
        currentRoute === page
      )

      if (activeIndex !== -1) {
        this.setActiveTab(activeIndex)
      }
    } catch (error) {
      console.warn('更新激活Tab失败:', error)
    }
  }

  /**
   * 加载消息数量
   */
  private loadMessageCount() {
    try {
      // 从本地存储获取消息数量
      const count = Taro.getStorageSync('messageCount') || 0
      this.setMessageCount(count)
    } catch (error) {
      console.warn('加载消息数量失败:', error)
    }
  }

  /**
   * 保存消息数量到本地存储
   */
  private saveMessageCount() {
    try {
      Taro.setStorageSync('messageCount', this.messageCount)
    } catch (error) {
      console.warn('保存消息数量失败:', error)
    }
  }
}

// 创建全局单例
const tabBarManager = new TabBarManager()

// 导出管理器实例
export default tabBarManager

// 导出便捷方法
export const {
  setMessageCount,
  getMessageCount,
  setActiveTab,
  getActiveTab,
  showTabBar,
  hideTabBar,
  switchTab
} = tabBarManager
