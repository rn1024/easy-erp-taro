import React from 'react'
import { View, Text } from '@tarojs/components'
import { Badge as NutBadge } from '@nutui/nutui-react-taro'
import { cn } from '../../../utils/cn'
import './index.scss'

export interface BadgeProps {
  /**
   * 徽标内容
   */
  value?: string | number

  /**
   * 最大值，超过最大值会显示 max+
   */
  max?: number

  /**
   * 是否为小圆点
   */
  dot?: boolean

  /**
   * 徽标类型
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info'

  /**
   * 徽标大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * 是否为轮廓样式
   * @default false
   */
  outline?: boolean

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 子元素
   */
  children?: React.ReactNode
}

/**
 * 徽标组件
 * 用于展示状态、数量等信息
 */
export const Badge: React.FC<BadgeProps> = ({
  value,
  max,
  dot = false,
  variant = 'default',
  size = 'medium',
  outline = false,
  className,
  children
}) => {
  // 获取颜色值
  const getColor = () => {
    const colorMap = {
      default: '#949494',
      primary: '#07C160',
      success: '#00B578',
      warning: '#FF9F0A',
      danger: '#FF3B30',
      info: '#2F86F6'
    }
    return colorMap[variant]
  }

  return (
    <NutBadge
      value={value}
      max={max}
      dot={dot}
      color={getColor()}
      className={cn(
        'ui-badge',
        `ui-badge--${variant}`,
        `ui-badge--${size}`,
        {
          'ui-badge--outline': outline
        },
        className
      )}
    >
      {children}
    </NutBadge>
  )
}

/**
 * 状态徽标
 * 用于展示状态信息
 */
export interface StatusBadgeProps {
  /**
   * 状态类型
   */
  status?: 'default' | 'success' | 'processing' | 'error' | 'warning'

  /**
   * 状态文本
   */
  text?: string

  /**
   * 自定义类名
   */
  className?: string
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status = 'default',
  text,
  className
}) => {
  const statusMap = {
    default: { color: '#949494', text: '默认' },
    success: { color: '#00B578', text: '成功' },
    processing: { color: '#07C160', text: '进行中' },
    error: { color: '#FF3B30', text: '错误' },
    warning: { color: '#FF9F0A', text: '警告' }
  }

  const config = statusMap[status]

  return (
    <View className={cn('ui-status-badge', className)}>
      <View
        className="ui-status-badge__dot"
        style={{ backgroundColor: config.color }}
      />
      <Text className="ui-status-badge__text">{text || config.text}</Text>
    </View>
  )
}
