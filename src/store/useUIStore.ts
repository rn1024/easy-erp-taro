import { create } from 'zustand'

// 主题类型
export type Theme = 'light' | 'dark' | 'auto'

// 语言类型
export type Language = 'zh-CN' | 'en-US'

// UI Store状态
interface UIState {
  // 状态
  theme: Theme
  language: Language
  sidebarCollapsed: boolean
  loadingCount: number
  globalLoading: boolean

  // 操作
  setTheme: (theme: Theme) => void
  setLanguage: (language: Language) => void
  toggleSidebar: () => void
  setSidebarCollapsed: (collapsed: boolean) => void

  // 加载状态管理
  startLoading: () => void
  stopLoading: () => void
  setGlobalLoading: (loading: boolean) => void
}

// 创建UI Store
export const useUIStore = create<UIState>((set, get) => ({
  // 初始状态
  theme: 'light',
  language: 'zh-CN',
  sidebarCollapsed: false,
  loadingCount: 0,
  globalLoading: false,

  // 设置主题
  setTheme: (theme) => {
    set({ theme })
  },

  // 设置语言
  setLanguage: (language) => {
    set({ language })
  },

  // 切换侧边栏
  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  // 设置侧边栏状态
  setSidebarCollapsed: (collapsed) => {
    set({ sidebarCollapsed: collapsed })
  },

  // 开始加载
  startLoading: () => {
    set((state) => ({
      loadingCount: state.loadingCount + 1,
      globalLoading: true
    }))
  },

  // 停止加载
  stopLoading: () => {
    set((state) => {
      const newCount = Math.max(0, state.loadingCount - 1)
      return {
        loadingCount: newCount,
        globalLoading: newCount > 0
      }
    })
  },

  // 设置全局加载状态
  setGlobalLoading: (loading) => {
    set({ globalLoading: loading })
  }
}))
