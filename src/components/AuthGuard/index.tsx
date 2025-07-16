import React, { useEffect, useState } from 'react'
import { View, Text } from '@tarojs/components'
import { useUserStore } from '@/stores/userStore'
import { isLoggedIn, redirectToLogin } from '@/utils/auth'
import { Permission, UserRole } from '@/types/admin'
import './index.scss'

// 无权限访问组件
const NoPermissionComponent: React.FC = () => (
  <View className="no-permission">
    <View className="no-permission__icon">🚫</View>
    <Text className="no-permission__title">暂无访问权限</Text>
    <Text className="no-permission__message">请联系管理员获取相应权限</Text>
  </View>
)

// 未登录组件
const NotLoggedInComponent: React.FC = () => (
  <View className="not-logged-in">
    <View className="not-logged-in__icon">🔐</View>
    <Text className="not-logged-in__title">请先登录</Text>
    <Text className="not-logged-in__message">正在跳转到登录页...</Text>
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
) {
  const AuthGuardedComponent: React.FC<T> = (props) => {
    const {
      requiredPermissions = [],
      requiredRole,
      fallback: FallbackComponent = NoPermissionComponent,
      redirectOnFail = false
    } = options

    const { isLoggedIn: storeLoggedIn, hasPermission, checkRole } = useUserStore()
    const [isChecking, setIsChecking] = useState(true)
    const [hasAccess, setHasAccess] = useState(false)

    useEffect(() => {
      const checkAccess = () => {
        // 检查登录状态
        if (!isLoggedIn() || !storeLoggedIn) {
          if (redirectOnFail) {
            redirectToLogin()
          }
          setHasAccess(false)
          setIsChecking(false)
          return
        }

        // 检查角色权限
        if (requiredRole && !checkRole(requiredRole)) {
          setHasAccess(false)
          setIsChecking(false)
          return
        }

        // 检查具体权限
        if (requiredPermissions.length > 0) {
          const hasRequiredPermission = requiredPermissions.some(permission =>
            hasPermission(permission)
          )
          if (!hasRequiredPermission) {
            setHasAccess(false)
            setIsChecking(false)
            return
          }
        }

        setHasAccess(true)
        setIsChecking(false)
      }

      checkAccess()
    }, [storeLoggedIn, requiredPermissions, requiredRole, hasPermission, checkRole, redirectOnFail])

    // 检查中状态
    if (isChecking) {
      return (
        <View className="auth-checking">
          <Text>权限检查中...</Text>
        </View>
      )
    }

    // 未登录状态
    if (!isLoggedIn() || !storeLoggedIn) {
      return <NotLoggedInComponent />
    }

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

export const PermissionGuard: React.FC<PermissionGuardProps> = ({
  children,
  requiredPermissions = [],
  requiredRole,
  fallback,
  showFallback = true
}) => {
  const { isLoggedIn, hasPermission, checkRole } = useUserStore()

  // 检查登录状态
  if (!isLoggedIn) {
    return showFallback ? (fallback || <NotLoggedInComponent />) : null
  }

  // 检查角色权限
  if (requiredRole && !checkRole(requiredRole)) {
    return showFallback ? (fallback || <NoPermissionComponent />) : null
  }

  // 检查具体权限
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some(permission =>
      hasPermission(permission)
    )
    if (!hasRequiredPermission) {
      return showFallback ? (fallback || <NoPermissionComponent />) : null
    }
  }

  return <>{children}</>
}

export default withAuth 