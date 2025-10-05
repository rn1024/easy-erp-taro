import React from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export interface SectionCardProps {
  title?: string
  description?: string
  titleIcon?: React.ReactNode
  meta?: React.ReactNode
  actions?: React.ReactNode | React.ReactNode[]
  footer?: React.ReactNode
  children?: React.ReactNode
  className?: string
  contentClassName?: string
  compact?: boolean
  flat?: boolean
  clickable?: boolean
  onClick?: () => void
}

const SectionCard: React.FC<SectionCardProps> = ({
  title,
  description,
  titleIcon,
  meta,
  actions,
  footer,
  children,
  className = '',
  contentClassName = '',
  compact = false,
  flat = false,
  clickable = false,
  onClick
}) => {
  const actionNodes = React.Children.toArray(actions ?? [])
  const rootClass = [
    'section-card',
    className,
    compact ? 'section-card--compact' : '',
    flat ? 'section-card--flat' : '',
    clickable ? 'section-card--clickable' : ''
  ].filter(Boolean).join(' ')

  return (
    <View className={rootClass} onClick={onClick}>
      {(title || description || titleIcon || meta || actionNodes.length > 0) && (
        <View className='section-card__header'>
          <View className='section-card__heading'>
            {titleIcon}
            <View className='section-card__heading-text'>
              {title && (
                <Text className='section-card__title'>
                  {title}
                </Text>
              )}
              {description && (
                <Text className='section-card__description'>
                  {description}
                </Text>
              )}
              {meta && (
                <View className='section-card__meta'>
                  {meta}
                </View>
              )}
            </View>
          </View>
          {actionNodes.length > 0 && (
            <View className='section-card__actions'>
              {actionNodes.map((action, index) => (
                <View key={index} className='section-card__action'>
                  {action}
                </View>
              ))}
            </View>
          )}
        </View>
      )}

      {children && (
        <View className={['section-card__content', contentClassName].filter(Boolean).join(' ')}>
          {children}
        </View>
      )}

      {footer && (
        <View className='section-card__footer'>
          {footer}
        </View>
      )}
    </View>
  )
}

export default SectionCard
