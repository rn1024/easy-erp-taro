import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'

/**
 * APIs
 */
import * as AuthAPI from '@/services/auth'

/**
 * Types
 */
import type { AuthUser, LoginForm, UserRole } from '@/types/admin'
import { Permission } from '@/types/admin'

interface UserState {
  // 状态
  userInfo: AuthUser | null
  token: string | null
  isLoggedIn: boolean
  permissions: Permission[]
  loading: boolean
  error: string | null

  // Actions
  login: (credentials: LoginForm) => Promise<void>
  logout: () => void
  updateUserInfo: (info: Partial<AuthUser>) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  hasPermission: (permission: Permission) => boolean
  checkRole: (requiredRole: UserRole) => boolean
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      userInfo: null,
      token: null,
      isLoggedIn: false,
      permissions: [],
      loading: false,
      error: null,

      // 登录 - 对接真实API
      login: async (credentials: LoginForm): Promise<void> => {
        set({ loading: true, error: null })
        
        try {
          // 调用真实的登录API
          const response = await AuthAPI.login(credentials.username, credentials.password)
          
          if (response.code !== 0) {
            throw new Error(response.msg || '登录失败')
          }

          const { token, refreshToken, user, roles, permissions } = response.data
          
          // 适配用户数据格式
          const authUser: AuthUser = {
            id: user.id,
            username: user.name,  // easy-erp-web返回的是name字段
            name: user.name,
            role: roles.length > 0 ? (roles[0].name === '管理员' ? 'admin' : 'operator') as UserRole : 'operator',
            permissions,
            token
          }
          
          set({
            userInfo: authUser,
            token,
            isLoggedIn: true,
            permissions: permissions as Permission[],
            loading: false,
            error: null
          })

          // 存储token到Taro storage
          Taro.setStorageSync('token', token)
          Taro.setStorageSync('refreshToken', refreshToken)
          
          // 跳转到首页
          Taro.switchTab({
            url: '/pages/index/index'
          })
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : '登录失败'
          set({
            loading: false,
            error: errorMessage
          })
          throw error
        }
      },

      // 登出
      logout: (): void => {
        set({
          userInfo: null,
          token: null,
          isLoggedIn: false,
          permissions: [],
          error: null
        })

        // 清除本地存储
        Taro.removeStorageSync('token')
        
        // 跳转到登录页
        Taro.redirectTo({
          url: '/pages/login/index'
        })
      },

      // 更新用户信息
      updateUserInfo: (info: Partial<AuthUser>): void => {
        const { userInfo } = get()
        if (userInfo) {
          set({
            userInfo: { ...userInfo, ...info }
          })
        }
      },

      // 设置加载状态
      setLoading: (loading: boolean): void => {
        set({ loading })
      },

      // 设置错误信息
      setError: (error: string | null): void => {
        set({ error })
      },

      // 检查权限
      hasPermission: (permission: Permission): boolean => {
        const { permissions } = get()
        return permissions.includes(Permission.ADMIN_ALL) || permissions.includes(permission)
      },

      // 检查角色
      checkRole: (requiredRole: UserRole): boolean => {
        const { userInfo } = get()
        if (!userInfo) return false
        
        // 管理员可以访问所有功能
        if (userInfo.role === 'admin') return true
        
        // 检查具体角色
        return userInfo.role === requiredRole
      }
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: (name: string): string | null => {
          return Taro.getStorageSync(name)
        },
        setItem: (name: string, value: string): void => {
          Taro.setStorageSync(name, value)
        },
        removeItem: (name: string): void => {
          Taro.removeStorageSync(name)
        }
      })),
      // 只持久化关键信息
      partialize: (state): Partial<UserState> => ({
        userInfo: state.userInfo,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        permissions: state.permissions
      })
    }
  )
)