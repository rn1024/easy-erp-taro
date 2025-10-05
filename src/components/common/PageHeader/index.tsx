import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export interface PageHeaderProps {
  title: string
  subtitle?: string
  description?: string
  meta?: React.ReactNode
  actions?: React.ReactNode | React.ReactNode[]
  children?: React.ReactNode
  className?: string
  align?: 'start' | 'center'
  compact?: boolean
  icon?: React.ReactNode
  footer?: React.ReactNode
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  description,
  meta,
  actions,
  children,
  className = '',
  align = 'start',
  compact = false,
  icon,
  footer
}) => {
  const actionNodes = React.Children.toArray(actions ?? [])
  const rootClass = [
    'page-header',
    className,
    align === 'center' ? 'page-header--center' : '',
    compact ? 'page-header--compact' : ''
  ].filter(Boolean).join(' ')

  return (
    <View className={rootClass}>
      <View className='page-header__top'>
        <View className='page-header__title-wrap'>
          {icon && (
            <View className='page-header__icon'>{icon}</View>
          )}
          <View className='page-header__text'>
            <Text className='page-header__title'>{title}</Text>
            {subtitle && (
              <Text className='page-header__subtitle'>{subtitle}</Text>
            )}
            {description && (
              <Text className='page-header__description'>{description}</Text>
            )}
            {meta && (
              <View className='page-header__meta'>
                {meta}
              </View>
            )}
          </View>
        </View>
        {actionNodes.length > 0 && (
          <View className='page-header__actions'>
            {actionNodes.map((action, index) => (
              <View key={index} className='page-header__action'>
                {action}
              </View>
            ))}
          </View>
        )}
      </View>

      {children && (
        <View className='page-header__content'>
          {children}
        </View>
      )}

      {footer && (
        <View className='page-header__footer'>
          {footer}
        </View>
      )}
    </View>
  )
}

export default PageHeader
