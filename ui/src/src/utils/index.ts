import type { TaskStatus, TaskPriority, LoadingState } from '@/types'
import { TASK_STATUS_CONFIG, TASK_PRIORITY_CONFIG, VALIDATION_RULES } from '@/constants/mockData'

/**
 * 格式化日期显示
 */
export function formatDate(date: string | Date, format: 'short' | 'long' | 'relative' = 'short'): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  
  if (format === 'relative') {
    const diffTime = now.getTime() - targetDate.getTime()
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return '今天'
    if (diffDays === 1) return '昨天'
    if (diffDays === -1) return '明天'
    if (diffDays > 1) return `${diffDays} 天前`
    if (diffDays < -1) return `${Math.abs(diffDays)} 天后`
  }
  
  if (format === 'long') {
    return targetDate.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    })
  }
  
  return targetDate.toLocaleDateString('zh-CN', {
    month: 'short',
    day: 'numeric'
  })
}

/**
 * 获取任务状态的显示信息
 */
export function getTaskStatusInfo(status: TaskStatus) {
  return TASK_STATUS_CONFIG[status] || {
    label: status,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)'
  }
}

/**
 * 获取任务优先级的显示信息
 */
export function getTaskPriorityInfo(priority: TaskPriority) {
  return TASK_PRIORITY_CONFIG[priority] || {
    label: priority,
    color: '#6b7280',
    bgColor: 'rgba(107, 114, 128, 0.1)'
  }
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

/**
 * 节流函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let lastTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastTime >= wait) {
      lastTime = now
      func(...args)
    }
  }
}

/**
 * 生成随机ID
 */
export function generateId(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`
}

/**
 * 深度克隆对象
 */
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj
  if (obj instanceof Date) return new Date(obj.getTime()) as T
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T
  if (typeof obj === 'object') {
    const clonedObj = {} as { [key: string]: any }
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        clonedObj[key] = deepClone(obj[key])
      }
    }
    return clonedObj as T
  }
  return obj
}

/**
 * 检查是否为移动设备
 */
export function isMobileDevice(): boolean {
  if (typeof window === 'undefined') return false
  return window.innerWidth <= 768 || /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
}

/**
 * 计算任务进度百分比
 */
export function calculateProgress(completed: number, total: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
}

/**
 * 验证邮箱格式
 */
export function isValidEmail(email: string): boolean {
  return VALIDATION_RULES.email.test(email)
}

/**
 * 验证手机号格式 (中国)
 */
export function isValidPhone(phone: string): boolean {
  return VALIDATION_RULES.phone.test(phone)
}

/**
 * 验证密码强度
 */
export function isValidPassword(password: string): boolean {
  return VALIDATION_RULES.password.test(password)
}

/**
 * 验证用户名格式
 */
export function isValidUsername(username: string): boolean {
  return VALIDATION_RULES.username.test(username)
}

/**
 * 截断文本
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

/**
 * 等待指定时间
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

/**
 * 检查是否支持 Touch 事件
 */
export function supportsTouchEvents(): boolean {
  if (typeof window === 'undefined') return false
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0
}

/**
 * 检查网络连接状态
 */
export function isOnline(): boolean {
  if (typeof navigator === 'undefined') return true
  return navigator.onLine
}

/**
 * 复制文本到剪贴板
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text)
      return true
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea')
      textArea.value = text
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
      return true
    }
  } catch (err) {
    console.error('Failed to copy text: ', err)
    return false
  }
}

/**
 * 获取本地存储数据
 */
export function getStorageItem<T>(key: string, defaultValue?: T): T | null {
  try {
    if (typeof window === 'undefined') return defaultValue || null
    const item = localStorage.getItem(key)
    return item ? JSON.parse(item) : defaultValue || null
  } catch (error) {
    console.error('Error reading from localStorage:', error)
    return defaultValue || null
  }
}

/**
 * 设置本地存储数据
 */
export function setStorageItem<T>(key: string, value: T): boolean {
  try {
    if (typeof window === 'undefined') return false
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error('Error writing to localStorage:', error)
    return false
  }
}

/**
 * 移除本地存储数据
 */
export function removeStorageItem(key: string): boolean {
  try {
    if (typeof window === 'undefined') return false
    localStorage.removeItem(key)
    return true
  } catch (error) {
    console.error('Error removing from localStorage:', error)
    return false
  }
}

/**
 * 格式化相对时间
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const targetDate = typeof date === 'string' ? new Date(date) : date
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000)
  
  if (diffInSeconds < 60) return '刚刚'
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}分钟前`
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}小时前`
  if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}天前`
  if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}个月前`
  return `${Math.floor(diffInSeconds / 31536000)}年前`
}

/**
 * 获取随机颜色
 */
export function getRandomColor(): string {
  const colors = [
    '#3b82f6', '#10b981', '#f59e0b', '#ef4444', 
    '#8b5cf6', '#06b6d4', '#84cc16', '#f97316'
  ]
  return colors[Math.floor(Math.random() * colors.length)]
}

/**
 * 检查对象是否为空
 */
export function isEmpty(obj: any): boolean {
  if (obj == null) return true
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0
  if (typeof obj === 'object') return Object.keys(obj).length === 0
  return false
}

/**
 * 合并类名
 */
export function classNames(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

/**
 * 创建异步队列
 */
export class AsyncQueue {
  private queue: Array<() => Promise<any>> = []
  private processing = false

  async add<T>(task: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await task()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.processing || this.queue.length === 0) return
    
    this.processing = true
    while (this.queue.length > 0) {
      const task = this.queue.shift()
      if (task) {
        try {
          await task()
        } catch (error) {
          console.error('Queue task failed:', error)
        }
      }
    }
    this.processing = false
  }
}

/**
 * 创建可取消的Promise
 */
export function createCancellablePromise<T>(
  promise: Promise<T>
): { promise: Promise<T>; cancel: () => void } {
  let cancelled = false
  
  const cancellablePromise = new Promise<T>((resolve, reject) => {
    promise
      .then(value => {
        if (!cancelled) resolve(value)
      })
      .catch(error => {
        if (!cancelled) reject(error)
      })
  })
  
  return {
    promise: cancellablePromise,
    cancel: () => {
      cancelled = true
    }
  }
}

/**
 * 重试函数
 */
export async function retry<T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = error as Error
      if (attempt < maxAttempts) {
        await sleep(delay * attempt) // 指数退避
      }
    }
  }
  
  throw lastError!
}

/**
 * 数组分块
 */
export function chunk<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size))
  }
  return chunks
}

/**
 * 数组去重
 */
export function unique<T>(array: T[]): T[] {
  return Array.from(new Set(array))
}

/**
 * 按属性去重
 */
export function uniqueBy<T>(array: T[], key: keyof T): T[] {
  const seen = new Set()
  return array.filter(item => {
    const value = item[key]
    if (seen.has(value)) return false
    seen.add(value)
    return true
  })
}