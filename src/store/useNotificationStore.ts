import { create } from 'zustand'

// 通知类型
export type NotificationType = 'info' | 'success' | 'warning' | 'error'

// 通知接口
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message?: string
  timestamp: Date
  read: boolean
  actionUrl?: string
  metadata?: Record<string, any>
}

// 通知Store状态
interface NotificationState {
  // 状态
  notifications: Notification[]
  unreadCount: number

  // 操作
  addNotification: (notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) => void
  markAsRead: (id: string) => void
  markAllAsRead: () => void
  removeNotification: (id: string) => void
  clearNotifications: () => void

  // 工具方法
  getUnreadNotifications: () => Notification[]
  getNotificationsByType: (type: NotificationType) => Notification[]
}

// 创建通知Store
export const useNotificationStore = create<NotificationState>((set, get) => ({
  // 初始状态
  notifications: [],
  unreadCount: 0,

  // 添加通知
  addNotification: (notification) => {
    const newNotification: Notification = {
      ...notification,
      id: `notif_${Date.now()}`,
      timestamp: new Date(),
      read: false
    }

    set((state) => ({
      notifications: [newNotification, ...state.notifications],
      unreadCount: state.unreadCount + 1
    }))
  },

  // 标记为已读
  markAsRead: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id)
      if (!notification || notification.read) return state

      return {
        notifications: state.notifications.map(n =>
          n.id === id ? { ...n, read: true } : n
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      }
    })
  },

  // 标记全部为已读
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map(n => ({ ...n, read: true })),
      unreadCount: 0
    }))
  },

  // 删除通知
  removeNotification: (id) => {
    set((state) => {
      const notification = state.notifications.find(n => n.id === id)
      if (!notification) return state

      return {
        notifications: state.notifications.filter(n => n.id !== id),
        unreadCount: notification.read ? state.unreadCount : Math.max(0, state.unreadCount - 1)
      }
    })
  },

  // 清空所有通知
  clearNotifications: () => {
    set({
      notifications: [],
      unreadCount: 0
    })
  },

  // 获取未读通知
  getUnreadNotifications: () => {
    return get().notifications.filter(n => !n.read)
  },

  // 根据类型获取通知
  getNotificationsByType: (type) => {
    return get().notifications.filter(n => n.type === type)
  }
}))
