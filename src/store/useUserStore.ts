import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import Taro from '@tarojs/taro'

// 用户信息接口
export interface UserInfo {
  id: string
  username: string
  nickname: string
  avatar?: string
  email?: string
  phone?: string
  department?: string
  position?: string
  permissions?: string[]
}

// 用户Store状态
interface UserState {
  // 状态
  userInfo: UserInfo | null
  isLoggedIn: boolean
  token: string | null

  // 操作
  setUserInfo: (userInfo: UserInfo) => void
  setToken: (token: string) => void
  login: (userInfo: UserInfo, token: string) => void
  logout: () => void
  updateUserInfo: (updates: Partial<UserInfo>) => void
  hasPermission: (permission: string) => boolean
}

// 创建持久化存储
const storage = createJSONStorage(() => ({
  getItem: (name: string) => {
    return Taro.getStorageSync(name)
  },
  setItem: (name: string, value: any) => {
    Taro.setStorageSync(name, value)
  },
  removeItem: (name: string) => {
    Taro.removeStorageSync(name)
  }
}))

// 创建用户Store
export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      // 初始状态
      userInfo: null,
      isLoggedIn: false,
      token: null,

      // 设置用户信息
      setUserInfo: (userInfo) => {
        set({ userInfo, isLoggedIn: true })
      },

      // 设置Token
      setToken: (token) => {
        set({ token })
      },

      // 登录
      login: (userInfo, token) => {
        set({ userInfo, token, isLoggedIn: true })
      },

      // 登出
      logout: () => {
        set({ userInfo: null, token: null, isLoggedIn: false })
        // 清除所有存储
        Taro.clearStorageSync()
      },

      // 更新用户信息
      updateUserInfo: (updates) => {
        const currentUser = get().userInfo
        if (currentUser) {
          set({ userInfo: { ...currentUser, ...updates } })
        }
      },

      // 检查权限
      hasPermission: (permission) => {
        const userInfo = get().userInfo
        return userInfo?.permissions?.includes(permission) || false
      }
    }),
    {
      name: 'user-storage',
      storage,
      partialize: (state) => ({
        userInfo: state.userInfo,
        token: state.token,
        isLoggedIn: state.isLoggedIn
      })
    }
  )
)
