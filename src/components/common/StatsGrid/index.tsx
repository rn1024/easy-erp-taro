import React from 'react'
import { View, Text } from '@tarojs/components'
import Icon from '../Icon'
import './index.scss'

export type TrendDirection = 'up' | 'down' | 'stable'

export interface StatsGridItem {
  key: string
  label: string
  value: React.ReactNode
  description?: React.ReactNode
  icon?: React.ReactNode
  iconName?: string
  iconColor?: string
  iconBgColor?: string
  valueColor?: string
  backgroundColor?: string
  trendText?: string
  trendDirection?: TrendDirection
  trendColor?: string
  className?: string
  variant?: 'default' | 'flat'
  onClick?: () => void
}

export interface StatsGridProps {
  items: StatsGridItem[]
  singleColumn?: boolean
  className?: string
  itemClassName?: string
}

const trendIconMap: Record<TrendDirection, string> = {
  up: 'trending_up',
  down: 'trending_down', 
  stable: 'remove'
}

const StatsGrid: React.FC<StatsGridProps> = ({
  items,
  singleColumn = false,
  className = '',
  itemClassName = ''
}) => {
  const rootClass = [
    'stats-grid',
    singleColumn ? 'stats-grid--single' : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <View className={rootClass}>
      {items.map((item) => {
        const {
          key,
          label,
          value,
          description,
          icon,
          iconName,
          iconColor,
          iconBgColor,
          valueColor,
          backgroundColor,
          trendText,
          trendDirection = 'stable',
          trendColor,
          className: itemExtraClass = '',
          variant = 'default',
          onClick
        } = item

        const hasTrend = Boolean(trendText)
        const clickable = typeof onClick === 'function'
        const itemClass = [
          'stats-grid__item',
          variant === 'flat' ? 'stats-grid__item--flat' : '',
          clickable ? 'stats-grid__item--clickable' : '',
          itemExtraClass,
          itemClassName
        ].filter(Boolean).join(' ')

        const iconNode = icon || (iconName ? (
          <View
            className='stats-grid__icon'
            style={{
              backgroundColor: iconBgColor || 'var(--bg-hover)',
              color: iconColor || 'var(--color-primary)'
            }}
          >
            <Icon name={iconName} size={24} color={iconColor || '#478EF2'} />
          </View>
        ) : null)

        return (
          <View
            key={key}
            className={itemClass}
            style={{ background: backgroundColor }}
            onClick={onClick}
          >
            <View className='stats-grid__header'>
              <View className='stats-grid__content'>
                <Text
                  className='stats-grid__value'
                  style={{ color: valueColor }}
                >
                  {value}
                </Text>
                <Text className='stats-grid__label'>{label}</Text>
                {description && (
                  <Text className='stats-grid__description'>
                    {description}
                  </Text>
                )}
              </View>
              
              {iconNode}
              
              {hasTrend && (
                <View
                  className='stats-grid__trend'
                  style={{ color: trendColor || 'var(--text-secondary)' }}
                >
                  <Icon
                    name={trendIconMap[trendDirection]}
                    size={16}
                    color={trendColor || iconColor || '#6b7280'}
                  />
                  <Text>{trendText}</Text>
                </View>
              )}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default StatsGrid
