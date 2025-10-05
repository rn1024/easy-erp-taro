import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

export interface InfoListItem {
  key: string
  label: React.ReactNode
  value: React.ReactNode
  icon?: React.ReactNode
  iconName?: string
  iconColor?: string
}

export interface InfoListProps {
  items: InfoListItem[]
  columns?: 1 | 2
  dense?: boolean
  bordered?: boolean
  className?: string
  itemClassName?: string
}

const InfoList: React.FC<InfoListProps> = ({
  items,
  columns = 1,
  dense = false,
  bordered = false,
  className = '',
  itemClassName = ''
}) => {
  const rootClass = [
    'info-list',
    className,
    columns === 2 ? 'info-list--two-column' : '',
    dense ? 'info-list--dense' : '',
    bordered ? 'info-list--bordered' : ''
  ].filter(Boolean).join(' ')

  return (
    <View className={rootClass}>
      {items.map((item) => {
        const { key, label, value, icon, iconName, iconColor } = item
        const iconNode = icon || (iconName ? (
          <View className='info-list__icon' style={{ color: iconColor }}>
            <MaterialIcons name={iconName} size={18} color={iconColor || '#6b7280'} />
          </View>
        ) : null)

        const renderLabel = () => {
          if (typeof label === 'string' || typeof label === 'number') {
            return (
              <Text className='info-list__label'>
                {label}
              </Text>
            )
          }
          return (
            <View className='info-list__label'>
              {label}
            </View>
          )
        }

        const renderValue = () => {
          if (typeof value === 'string' || typeof value === 'number') {
            return (
              <Text className='info-list__value'>
                {value}
              </Text>
            )
          }
          return (
            <View className='info-list__value'>
              {value}
            </View>
          )
        }

        return (
          <View key={key} className={['info-list__item', itemClassName].filter(Boolean).join(' ')}>
            {iconNode && (
              <View className='info-list__icon-wrapper'>
                {iconNode}
              </View>
            )}
            <View className='info-list__content'>
              {renderLabel()}
              {renderValue()}
            </View>
          </View>
        )
      })}
    </View>
  )
}

export default InfoList
