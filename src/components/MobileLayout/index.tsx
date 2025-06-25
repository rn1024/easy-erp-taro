import React from 'react'
import { View } from '@tarojs/components'
import { useMobile, useSafeAreaStyles, useIsIphoneX } from '../../hooks/useMobile'
import { cn } from '../../utils/cn'
import './index.scss'

interface MobileLayoutProps {
  /** 自定义样式类名 */
  className?: string
  /** 启用安全区域适配 */
  enableSafeArea?: boolean
  /** 启用键盘弹起适配 */
  enableKeyboardAdjust?: boolean
  /** 是否有底部TabBar */
  hasBottomTab?: boolean
  /** 页面头部内容 */
  header?: React.ReactNode
  /** 页面底部内容 */
  footer?: React.ReactNode
  /** 子组件 */
  children: React.ReactNode
}

/**
 * 移动端页面布局容器
 * 专为Taro小程序环境设计，处理安全区域和键盘适配
 */
const MobileLayout: React.FC<MobileLayoutProps> = ({
  className,
  enableSafeArea = false,
  enableKeyboardAdjust = false,
  hasBottomTab = false,
  header,
  footer,
  children
}) => {
  const { screenInfo } = useMobile()
  const safeAreaStyles = useSafeAreaStyles()
  const isIphoneX = useIsIphoneX()

  return (
    <View className={cn('mobile-layout', className, {
      'safe-area-enabled': enableSafeArea,
      'keyboard-adjust-enabled': enableKeyboardAdjust,
      'has-bottom-tab': hasBottomTab,
      'iphone-x': isIphoneX
    })}>

      {/* 状态栏占位 - 仅在需要时显示 */}
      {enableSafeArea && safeAreaStyles.statusBarHeight && (
        <View
          className="status-bar-placeholder"
          style={{ height: safeAreaStyles.statusBarHeight }}
        />
      )}

      {/* 页面头部 */}
      {header && (
        <View className="layout-header">
          {header}
        </View>
      )}

      {/* 主要内容区域 */}
      <View className="layout-content">
        {children}
      </View>

      {/* 页面底部 */}
      {footer && (
        <View className="layout-footer">
          {footer}
        </View>
      )}

      {/* 底部安全区域占位 (iPhone X系列) */}
      {enableSafeArea && isIphoneX && (
        <View
          className="safe-area-bottom"
          style={{ height: safeAreaStyles.safeAreaBottom }}
        />
      )}
    </View>
  )
}

export default MobileLayout
