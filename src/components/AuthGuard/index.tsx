import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'

/**
 * Components
 */
import { Icon } from '@/components/common'

/**
 * Hooks
 */
import { useUserStore } from '@/stores/userStore'

/**
 * Utils
 */
import { isLoggedIn as _checkLoginStatus } from '@/utils/auth'

/**
 * Types
 */
import { Permission, UserRole } from '@/types/admin'

import './index.scss'

// 无权限访问组件
const NoPermissionComponent: React.FC = () => (
  <View className='no-permission'>
    <Icon name='forbidden' size={48} className='no-permission__icon' />
    <Text className='no-permission__title'>暂无访问权限</Text>
    <Text className='no-permission__message'>请联系管理员获取相应权限</Text>
  </View>
)

// 未登录组件
const NotLoggedInComponent: React.FC = () => (
  <View className='not-logged-in'>
    <Icon name='secure' size={48} className='not-logged-in__icon' />
    <Text className='not-logged-in__title'>请先登录</Text>
    <Text className='not-logged-in__message'>正在跳转到登录页...</Text>
  </View>
)

// 权限守卫HOC属性
interface AuthGuardProps {
  requiredPermissions?: Permission[]
  requiredRole?: UserRole
  fallback?: React.ComponentType
  redirectOnFail?: boolean
}

// 权限守卫HOC
export function withAuth<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  options: AuthGuardProps = {}
): React.FC<T> {
  const AuthGuardedComponent: React.FC<T> = (props): React.ReactElement => {
    const {
      requiredPermissions: _requiredPermissions = [],
      requiredRole: _requiredRole,
      fallback: FallbackComponent = NoPermissionComponent,
      redirectOnFail: _redirectOnFail = false
    } = options

    const { isLoggedIn: _storeLoggedIn, hasPermission: _hasPermission, checkRole: _checkRole } = useUserStore()
    const [isChecking, setIsChecking] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
      const checkAccess = (): void => {
        // TODO: 临时跳过所有权限检查，直接允许访问
        setHasAccess(true)
        setIsChecking(false)
      }

      checkAccess()
    }, [])

    // 检查中状态
    if (isChecking) {
      return (
        <View className='auth-checking'>
          <Text>权限检查中...</Text>
        </View>
      )
    }

    // TODO: 临时注释登录检查，允许直接访问库存页面
    // 未登录状态
    // if (!checkLoginStatus() || !storeLoggedIn) {
    //   return <NotLoggedInComponent />
    // }

    // 无权限访问
    if (!hasAccess) {
      return <FallbackComponent />
    }

    // 有权限，渲染原组件
    return <WrappedComponent {...props} />
  }

  // 设置显示名称
  AuthGuardedComponent.displayName = `withAuth(${WrappedComponent.displayName || WrappedComponent.name})`

  return AuthGuardedComponent
}

// 权限守卫组件（用于组件级权限控制）
interface PermissionGuardProps {
  children: React.ReactNode
  requiredPermissions?: Permission[]
  requiredRole?: UserRole
  fallback?: React.ReactNode
  showFallback?: boolean
}

export const PermissionGuard = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback,
  showFallback = true
}: PermissionGuardProps): React.ReactNode => {
  const { isLoggedIn, hasPermission, checkRole } = useUserStore()

  // 检查登录状态
  if (!isLoggedIn) {
    return showFallback ? (fallback ?? <NotLoggedInComponent />) : null
  }

  // 检查角色权限
  if (requiredRole && !checkRole(requiredRole)) {
    return showFallback ? (fallback ?? <NoPermissionComponent />) : null
  }

  // 检查具体权限
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission =>
      hasPermission(permission)
    )
    if (!hasRequiredPermission) {
      return showFallback ? (fallback ?? <NoPermissionComponent />) : null
    }
  }

  return <>{children}</>
}

export default withAuth
