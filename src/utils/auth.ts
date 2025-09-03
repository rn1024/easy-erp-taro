import Taro from '@tarojs/taro'
import { useUserStore } from '@/stores/userStore'
import { Permission, UserRole } from '@/types/admin'

// 检查用户是否已登录
export function isLoggedIn(): boolean {
  const token = Taro.getStorageSync('token')
  return !!token
}

// 检查用户权限
export function hasPermission(permission: Permission): boolean {
  const { hasPermission: storeHasPermission } = useUserStore.getState()
  return storeHasPermission(permission)
}

// 检查用户角色
export function checkRole(role: UserRole): boolean {
  const { checkRole: storeCheckRole } = useUserStore.getState()
  return storeCheckRole(role)
}

// 重定向到登录页
export function redirectToLogin(): void {
  Taro.redirectTo({
    url: '/pages/login/index'
  })
}

// 页面权限路由配置
export const PagePermissions: Record<string, Permission[]> = {
  // 查询模块
  '/pages/query/scan/index': [Permission.QUERY_READ],
  '/pages/query/sku/index': [Permission.QUERY_READ],
  
  // 库存模块
  '/pages/inventory/finished/index': [Permission.INVENTORY_READ],
  '/pages/inventory/spare/index': [Permission.INVENTORY_READ],
  
  // 任务模块
  '/pages/warehouse/package/index': [Permission.TASK_READ],
  '/pages/warehouse/shipment/index': [Permission.TASK_READ],
  
  // 产品模块 (仅管理员)
  '/pages/products/index': [Permission.PRODUCT_READ]
}

// 检查页面访问权限
export function checkPagePermission(url: string): boolean {
  const requiredPermissions = PagePermissions[url]
  
  // 如果页面不需要特殊权限，允许访问
  if (!requiredPermissions) {
    return true
  }
  
  // 检查是否有任一必需权限
  return requiredPermissions.some(permission => hasPermission(permission))
}

// 权限守卫函数
export function guardPage(url: string): boolean {
  // 首页和登录页不需要权限检查
  if (url === '/pages/index/index' || url === '/pages/login/index') {
    return true
  }
  
  // 检查登录状态
  if (!isLoggedIn()) {
    redirectToLogin()
    return false
  }
  
  // 检查页面权限
  if (!checkPagePermission(url)) {
    Taro.showToast({
      title: '暂无访问权限',
      icon: 'error',
      duration: 2000
    })
    
    // 重定向到首页
    Taro.switchTab({
      url: '/pages/index/index'
    })
    return false
  }
  
  return true
}

// 获取用户可访问的TabBar页面
export function getAccessibleTabPages(): string[] {
  const allTabPages = [
    '/pages/index/index',
    '/pages/query/scan/index',
    '/pages/inventory/finished/index',
    '/pages/warehouse/package/index',
    '/pages/products/index'
  ]
  
  return allTabPages.filter(page => {
    // 首页始终可访问
    if (page === '/pages/index/index') {
      return true
    }
    
    // 检查其他页面权限
    return checkPagePermission(page)
  })
}

// 角色显示名称映射
export const RoleNames: Record<UserRole, string> = {
  operator: '操作员',
  admin: '管理员'
}

// 权限显示名称映射
export const PermissionNames: Record<Permission, string> = {
  [Permission.QUERY_READ]: '信息查询',
  [Permission.INVENTORY_READ]: '库存查看',
  [Permission.INVENTORY_CREATE]: '库存新增',
  [Permission.INVENTORY_UPDATE]: '库存编辑',
  [Permission.INVENTORY_DELETE]: '库存删除',
  [Permission.TASK_READ]: '任务查看',
  [Permission.TASK_UPDATE]: '任务更新',
  [Permission.PRODUCT_READ]: '产品管理',
  [Permission.ADMIN_ALL]: '所有权限'
} 