import React, { Suspense, lazy, ComponentType } from 'react'
import { View } from '@tarojs/components'
import { Skeleton } from '../components/Skeleton'

// 懒加载选项
export interface LazyLoadOptions {
  fallback?: React.ReactNode
  errorFallback?: React.ComponentType<{ error: Error }>
  delay?: number
  skeleton?: 'default' | 'list' | 'card' | 'form'
}

// 默认加载组件
const DefaultFallback: React.FC = () => (
  <View className="lazy-loading">
    <Skeleton />
  </View>
)

// 默认错误组件
const DefaultErrorFallback: React.FC<{ error: Error }> = ({ error }) => (
  <View className="lazy-error">
    <View className="lazy-error__message">加载失败：{error.message}</View>
  </View>
)

// 错误边界组件
class LazyErrorBoundary extends React.Component<
  {
    fallback: React.ComponentType<{ error: Error }>
    children: React.ReactNode
  },
  { hasError: boolean; error: Error | null }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Lazy load error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError && this.state.error) {
      const ErrorFallback = this.props.fallback
      return <ErrorFallback error={this.state.error} />
    }

    return this.props.children
  }
}

// 懒加载高阶组件
export function lazyLoad<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
): ComponentType<any> {
  const {
    fallback = <DefaultFallback />,
    errorFallback = DefaultErrorFallback,
    delay = 0,
    skeleton = 'default'
  } = options

  // 如果设置了延迟，添加延迟逻辑
  const delayedImport = delay > 0
    ? () => new Promise<{ default: T }>(resolve => {
        setTimeout(() => {
          importFunc().then(resolve)
        }, delay)
      })
    : importFunc

  const LazyComponent = lazy(delayedImport)

  return (props: any) => {
    return (
      <LazyErrorBoundary fallback={errorFallback}>
        <Suspense fallback={fallback}>
          <LazyComponent {...props} />
        </Suspense>
      </LazyErrorBoundary>
    )
  }
}

// 预加载组件
export function preloadComponent(
  importFunc: () => Promise<{ default: ComponentType<any> }>
): void {
  importFunc()
}

// 批量预加载
export function preloadComponents(
  importFuncs: Array<() => Promise<{ default: ComponentType<any> }>>
): void {
  importFuncs.forEach(preloadComponent)
}

// 路由级别的懒加载
export function lazyLoadRoute(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  options?: LazyLoadOptions
) {
  return lazyLoad(importFunc, {
    skeleton: 'default',
    ...options
  })
}

// 大型组件的懒加载（如 CustomWorkflowBuilder）
export function lazyLoadHeavyComponent(
  importFunc: () => Promise<{ default: ComponentType<any> }>,
  options?: LazyLoadOptions
) {
  return lazyLoad(importFunc, {
    skeleton: 'card',
    delay: 100, // 添加小延迟避免闪烁
    ...options
  })
}
