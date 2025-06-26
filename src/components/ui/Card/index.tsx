import React from 'react'
import { View, Text } from '@tarojs/components'
import { cn } from '../../../utils/cn'
import './index.scss'

export interface CardProps {
  /**
   * 标题
   */
  title?: React.ReactNode

  /**
   * 副标题
   */
  subtitle?: React.ReactNode

  /**
   * 额外内容（右上角）
   */
  extra?: React.ReactNode

  /**
   * 底部操作区
   */
  actions?: React.ReactNode

  /**
   * 是否显示边框
   * @default true
   */
  bordered?: boolean

  /**
   * 是否可点击
   * @default false
   */
  clickable?: boolean

  /**
   * 内边距大小
   * @default 'medium'
   */
  padding?: 'none' | 'small' | 'medium' | 'large'

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 子元素
   */
  children?: React.ReactNode

  /**
   * 点击事件
   */
  onClick?: () => void
}

/**
 * 卡片组件
 * 用于展示信息的容器组件
 */
export const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  extra,
  actions,
  bordered = true,
  clickable = false,
  padding = 'medium',
  className,
  children,
  onClick
}) => {
  return (
    <View
      className={cn(
        'ui-card',
        {
          'ui-card--bordered': bordered,
          'ui-card--clickable': clickable,
          [`ui-card--padding-${padding}`]: padding !== 'medium'
        },
        className
      )}
      onClick={onClick}
    >
      {(title || subtitle || extra) && (
        <View className="ui-card__header">
          <View className="ui-card__header-content">
            {title && (
              <View className="ui-card__title">
                {typeof title === 'string' ? <Text>{title}</Text> : title}
              </View>
            )}
            {subtitle && (
              <View className="ui-card__subtitle">
                {typeof subtitle === 'string' ? <Text>{subtitle}</Text> : subtitle}
              </View>
            )}
          </View>
          {extra && (
            <View className="ui-card__extra">{extra}</View>
          )}
        </View>
      )}

      {children && (
        <View className="ui-card__body">{children}</View>
      )}

      {actions && (
        <View className="ui-card__actions">{actions}</View>
      )}
    </View>
  )
}

/**
 * 卡片头部组件
 */
export const CardHeader: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => {
  return (
    <View className={cn('ui-card-header', className)}>
      {children}
    </View>
  )
}

/**
 * 卡片内容组件
 */
export const CardContent: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => {
  return (
    <View className={cn('ui-card-content', className)}>
      {children}
    </View>
  )
}

/**
 * 卡片标题组件
 */
export const CardTitle: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => {
  return (
    <View className={cn('ui-card-title', className)}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  )
}

/**
 * 卡片描述组件
 */
export const CardDescription: React.FC<{
  className?: string
  children?: React.ReactNode
}> = ({ className, children }) => {
  return (
    <View className={cn('ui-card-description', className)}>
      {typeof children === 'string' ? <Text>{children}</Text> : children}
    </View>
  )
}
