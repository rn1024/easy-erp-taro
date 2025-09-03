import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { SafeArea, Loading } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/stores/userStore'
import './index.scss'

interface MobileLayoutProps {
  children: React.ReactNode
  title?: string
  showSafeArea?: boolean
  showBack?: boolean
  showLoading?: boolean
  loadingText?: string
  rightAction?: React.ReactNode
  className?: string
  onBack?: () => void
  errorBoundary?: boolean
}

interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
}

interface ErrorInfo {
  componentStack: string
  [key: string]: unknown
}

// 错误边界组件
class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // 页面错误
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <View className='error-boundary'>
          <View className='error-boundary__icon'>
            <MaterialIcons name='error' size={48} color='#ef4444' />
          </View>
          <Text className='error-boundary__title'>页面加载出错</Text>
          <Text className='error-boundary__message'>请稍后重试或联系管理员</Text>
          <View 
            className='error-boundary__button'
            onClick={() => {
              this.setState({ hasError: false })
              Taro.reLaunch({ url: '/pages/index/index' })
            }}
          >
            <Text>返回首页</Text>
          </View>
        </View>
      )
    }

    return this.props.children
  }
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  title,
  showSafeArea = true,
  showBack = false,
  showLoading = false,
  loadingText = '加载中...',
  rightAction,
  className = '',
  onBack,
  errorBoundary = true
}) => {
  const { userInfo } = useUserStore()
  const [currentPage, setCurrentPage] = useState<string>('')

  useEffect(() => {
    // 获取当前页面路径
    const pages = Taro.getCurrentPages()
    if (pages.length > 0) {
      const currentPagePath = pages[pages.length - 1].route
      setCurrentPage(currentPagePath || '')
    }
  }, [])

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      const pages = Taro.getCurrentPages()
      if (pages.length > 1) {
        Taro.navigateBack()
      } else {
        Taro.switchTab({ url: '/pages/index/index' })
      }
    }
  }

  // 根据当前页面判断是否显示TabBar占位
  const isTabBarPage = [
    'pages/index/index',
    'pages/query/scan/index',
    'pages/inventory/finished/index', 
    'pages/warehouse/index',
    'pages/profile/index'
  ].includes(currentPage)

  const layoutContent = (
    <View className={`mobile-layout ${className} ${isTabBarPage ? 'mobile-layout--with-tabbar' : ''}`}>
      {showSafeArea && <SafeArea position='top' />}
      
      {/* 自定义导航栏 */}
      {(title || showBack || rightAction) && (
        <View className='mobile-layout__header'>
          <View className='mobile-layout__nav'>
            {showBack && (
              <View className='mobile-layout__nav-left' onClick={handleBack}>
                <MaterialIcons name='arrow_back' size={24} color='#1a1a1a' />
              </View>
            )}
            
            {title && (
              <View className='mobile-layout__nav-title'>
                <Text className='mobile-layout__nav-title-text'>{title}</Text>
              </View>
            )}
            
            {rightAction && (
              <View className='mobile-layout__nav-right'>
                {rightAction}
              </View>
            )}
          </View>
        </View>
      )}

      {/* 用户信息快速访问 */}
      {userInfo && currentPage === 'pages/index/index' && (
        <View className='mobile-layout__user-info'>
          <Text className='mobile-layout__user-welcome'>
            欢迎，{userInfo.name}
          </Text>
          <Text className='mobile-layout__user-role'>
            {userInfo.role === 'admin' ? '管理员' : '操作员'}
          </Text>
        </View>
      )}

      {/* 页面内容 */}
      <View className='mobile-layout__content'>
        {showLoading ? (
          <View className='mobile-layout__loading'>
            <Loading />
            <Text className='mobile-layout__loading-text'>{loadingText}</Text>
          </View>
        ) : (
          children
        )}
      </View>

      {showSafeArea && <SafeArea position='bottom' />}
    </View>
  )

  if (errorBoundary) {
    return (
      <ErrorBoundary>
        {layoutContent}
      </ErrorBoundary>
    )
  }

  return layoutContent
}

export default MobileLayout