import React, { ComponentType } from 'react'
import { View, Text } from '@tarojs/components'
import { ListSkeleton, CardSkeleton, FormSkeleton, Skeleton } from '../components/Skeleton'
import { Button } from '../components/ui'
import { IconFont } from '@nutui/icons-react-taro'
import { cn } from '../utils/cn'

// HOC属性接口
export interface WithLoadingAndErrorProps {
  loading?: boolean
  error?: Error | string | null
  retry?: () => void
  skeleton?: 'list' | 'card' | 'form' | 'custom'
  skeletonCount?: number
  errorTitle?: string
  errorDescription?: string
  emptyMessage?: string
  isEmpty?: boolean
}

// 错误组件
const ErrorComponent: React.FC<{
  error: Error | string
  retry?: () => void
  title?: string
  description?: string
}> = ({ error, retry, title, description }) => {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <View className="error-container">
      <IconFont name="warning" size="64" className="error-icon" />
      <Text className="error-title">{title || '加载失败'}</Text>
      <Text className="error-message">
        {description || errorMessage || '发生了未知错误'}
      </Text>
      {retry && (
        <Button variant="primary" size="small" onClick={retry}>
          重试
        </Button>
      )}
    </View>
  )
}

// 空状态组件
const EmptyComponent: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <View className="empty-container">
      <IconFont name="empty" size="64" className="empty-icon" />
      <Text className="empty-message">{message || '暂无数据'}</Text>
    </View>
  )
}

// 高阶组件
export function withLoadingAndError<P extends object>(
  Component: ComponentType<P>,
  defaultProps?: Partial<WithLoadingAndErrorProps>
) {
  return React.forwardRef<any, P & WithLoadingAndErrorProps>((props, ref) => {
    const {
      loading = false,
      error = null,
      retry,
      skeleton = 'card',
      skeletonCount = 3,
      errorTitle,
      errorDescription,
      emptyMessage,
      isEmpty = false,
      ...restProps
    } = { ...defaultProps, ...props }

    // 加载状态
    if (loading) {
      switch (skeleton) {
        case 'list':
          return <ListSkeleton />
        case 'card':
          return <CardSkeleton />
        case 'form':
          return <FormSkeleton />
        default:
          return <Skeleton />
      }
    }

    // 错误状态
    if (error) {
      return (
        <ErrorComponent
          error={error}
          retry={retry}
          title={errorTitle}
          description={errorDescription}
        />
      )
    }

    // 空状态
    if (isEmpty) {
      return <EmptyComponent message={emptyMessage} />
    }

    // 正常渲染
    return <Component ref={ref} {...(restProps as P)} />
  })
}

// 样式
const styles = `
.error-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  min-height: 400rpx;
}

.error-icon {
  color: #ff3b30;
  margin-bottom: 24rpx;
}

.error-title {
  font-size: 36rpx;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16rpx;
}

.error-message {
  font-size: 28rpx;
  color: #808080;
  text-align: center;
  margin-bottom: 32rpx;
  max-width: 80%;
}

.empty-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48rpx;
  min-height: 400rpx;
}

.empty-icon {
  color: #b2b2b2;
  margin-bottom: 24rpx;
}

.empty-message {
  font-size: 28rpx;
  color: #808080;
  text-align: center;
}
`
