// 事件类型
export type EventType = string | symbol

// 事件监听器
export type EventListener<T = any> = (data: T) => void

// 事件总线类
export class EventBus {
  private events: Map<EventType, Set<EventListener>> = new Map()

  // 订阅事件
  on<T = any>(event: EventType, listener: EventListener<T>): () => void {
    if (!this.events.has(event)) {
      this.events.set(event, new Set())
    }

    const listeners = this.events.get(event)!
    listeners.add(listener)

    // 返回取消订阅函数
    return () => {
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.events.delete(event)
      }
    }
  }

  // 订阅一次性事件
  once<T = any>(event: EventType, listener: EventListener<T>): () => void {
    const wrappedListener: EventListener<T> = (data) => {
      listener(data)
      this.off(event, wrappedListener)
    }

    return this.on(event, wrappedListener)
  }

  // 取消订阅
  off(event: EventType, listener?: EventListener): void {
    if (!this.events.has(event)) return

    if (listener) {
      const listeners = this.events.get(event)!
      listeners.delete(listener)
      if (listeners.size === 0) {
        this.events.delete(event)
      }
    } else {
      // 如果没有指定listener，移除该事件的所有监听器
      this.events.delete(event)
    }
  }

  // 触发事件
  emit<T = any>(event: EventType, data?: T): void {
    if (!this.events.has(event)) return

    const listeners = this.events.get(event)!
    listeners.forEach(listener => {
      try {
        listener(data)
      } catch (error) {
        console.error(`Error in event listener for ${String(event)}:`, error)
      }
    })
  }

  // 清除所有事件监听器
  clear(): void {
    this.events.clear()
  }

  // 获取事件监听器数量
  listenerCount(event?: EventType): number {
    if (event) {
      return this.events.get(event)?.size || 0
    }

    let count = 0
    this.events.forEach(listeners => {
      count += listeners.size
    })
    return count
  }

  // 获取所有事件名称
  eventNames(): EventType[] {
    return Array.from(this.events.keys())
  }
}

// 创建全局事件总线实例
export const globalEventBus = new EventBus()

// 预定义事件类型
export const Events = {
  // 用户相关
  USER_LOGIN: Symbol('USER_LOGIN'),
  USER_LOGOUT: Symbol('USER_LOGOUT'),
  USER_UPDATE: Symbol('USER_UPDATE'),

  // 工作流相关
  WORKFLOW_CREATE: Symbol('WORKFLOW_CREATE'),
  WORKFLOW_UPDATE: Symbol('WORKFLOW_UPDATE'),
  WORKFLOW_DELETE: Symbol('WORKFLOW_DELETE'),
  WORKFLOW_EXECUTE: Symbol('WORKFLOW_EXECUTE'),

  // 通知相关
  NOTIFICATION_ADD: Symbol('NOTIFICATION_ADD'),
  NOTIFICATION_READ: Symbol('NOTIFICATION_READ'),
  NOTIFICATION_CLEAR: Symbol('NOTIFICATION_CLEAR'),

  // UI相关
  THEME_CHANGE: Symbol('THEME_CHANGE'),
  LANGUAGE_CHANGE: Symbol('LANGUAGE_CHANGE'),
  SIDEBAR_TOGGLE: Symbol('SIDEBAR_TOGGLE'),

  // 全局事件
  GLOBAL_LOADING_START: Symbol('GLOBAL_LOADING_START'),
  GLOBAL_LOADING_END: Symbol('GLOBAL_LOADING_END'),
  GLOBAL_ERROR: Symbol('GLOBAL_ERROR'),

  // 路由相关
  ROUTE_CHANGE: Symbol('ROUTE_CHANGE'),
  ROUTE_BEFORE_LEAVE: Symbol('ROUTE_BEFORE_LEAVE'),
} as const

// React Hook - 使用事件总线
import { useEffect, useCallback } from 'react'

export function useEventBus<T = any>(
  event: EventType,
  handler: EventListener<T>,
  eventBus: EventBus = globalEventBus
) {
  useEffect(() => {
    const unsubscribe = eventBus.on(event, handler)
    return unsubscribe
  }, [event, handler, eventBus])

  const emit = useCallback(
    (data?: T) => {
      eventBus.emit(event, data)
    },
    [event, eventBus]
  )

  return { emit }
}
