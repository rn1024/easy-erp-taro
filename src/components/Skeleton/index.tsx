import React from 'react'
import { View } from '@tarojs/components'
import { Skeleton as NutSkeleton } from '@nutui/nutui-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

interface SkeletonProps {
  loading?: boolean
  rows?: number
  title?: boolean
  avatar?: boolean
  avatarSize?: string
  animate?: boolean
  className?: string
  children?: React.ReactNode
}

/**
 * 骨架屏组件
 * 用于在数据加载时展示占位内容
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  loading = true,
  rows = 3,
  title = true,
  avatar = false,
  avatarSize = '50',
  animate = true,
  className,
  children
}) => {
  if (!loading) {
    return <>{children}</>
  }

  return (
    <NutSkeleton
      rows={rows}
      title={title}
      avatar={avatar}
      avatarSize={avatarSize}
      animated={animate}
      className={cn('skeleton-wrapper', className)}
    />
  )
}

/**
 * 列表骨架屏
 */
export const ListSkeleton: React.FC<{
  count?: number
  className?: string
}> = ({ count = 3, className }) => {
  return (
    <View className={cn('list-skeleton', className)}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={index} className="list-skeleton-item">
          <Skeleton
            avatar
            rows={2}
            title
            className="list-item-skeleton"
          />
        </View>
      ))}
    </View>
  )
}

/**
 * 卡片骨架屏
 */
export const CardSkeleton: React.FC<{
  className?: string
}> = ({ className }) => {
  return (
    <View className={cn('card-skeleton', className)}>
      <Skeleton
        rows={4}
        title
        className="card-content-skeleton"
      />
    </View>
  )
}

/**
 * 表单骨架屏
 */
export const FormSkeleton: React.FC<{
  fields?: number
  className?: string
}> = ({ fields = 4, className }) => {
  return (
    <View className={cn('form-skeleton', className)}>
      {Array.from({ length: fields }).map((_, index) => (
        <View key={index} className="form-field-skeleton">
          <View className="field-label-skeleton" />
          <View className="field-input-skeleton" />
        </View>
      ))}
    </View>
  )
}
