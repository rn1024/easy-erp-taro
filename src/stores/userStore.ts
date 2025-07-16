import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'
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

      // 登录
      login: async (credentials: LoginForm) => {
        set({ loading: true, error: null })
        
        try {
          // TODO: 替换为实际的登录API调用
          // 模拟登录请求
          const response = await new Promise<{ user: AuthUser }>((resolve, reject) => {
            setTimeout(() => {
              if (credentials.username === 'admin' && credentials.password === '123456') {
                resolve({
                  user: {
                    id: '1',
                    username: 'admin',
                    name: '管理员',
                    role: 'admin',
                    permissions: ['*'],
                    token: 'mock-token-' + Date.now()
                  }
                })
              } else if (credentials.username === 'operator' && credentials.password === '123456') {
                resolve({
                  user: {
                    id: '2',
                    username: 'operator',
                    name: '操作员',
                    role: 'operator',
                    permissions: [
                      'query:read',
                      'inventory:read',
                      'inventory:create',
                      'inventory:update',
                      'inventory:delete',
                      'task:read',
                      'task:update'
                    ],
                    token: 'mock-token-' + Date.now()
                  }
                })
              } else {
                reject(new Error('用户名或密码错误'))
              }
            }, 1000)
          })

          const { user } = response
          
          set({
            userInfo: user,
            token: user.token,
            isLoggedIn: true,
            permissions: user.permissions as Permission[],
            loading: false,
            error: null
          })

          // 存储token到Taro storage
          Taro.setStorageSync('token', user.token)
          
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
      logout: () => {
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
      updateUserInfo: (info: Partial<AuthUser>) => {
        const { userInfo } = get()
        if (userInfo) {
          set({
            userInfo: { ...userInfo, ...info }
          })
        }
      },

      // 设置加载状态
      setLoading: (loading: boolean) => {
        set({ loading })
      },

      // 设置错误信息
      setError: (error: string | null) => {
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
        getItem: (name: string) => {
          return Taro.getStorageSync(name)
        },
        setItem: (name: string, value: string) => {
          Taro.setStorageSync(name, value)
        },
        removeItem: (name: string) => {
          Taro.removeStorageSync(name)
        }
      })),
      // 只持久化关键信息
      partialize: (state) => ({
        userInfo: state.userInfo,
        token: state.token,
        isLoggedIn: state.isLoggedIn,
        permissions: state.permissions
      })
    }
  )
) 