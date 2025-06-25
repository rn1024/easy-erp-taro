import { type ClassValue, clsx } from 'clsx'

/**
 * 安全的样式类名合并函数
 * 基于 clsx 实现，支持条件类名和数组合并
 *
 * @param inputs 类名输入，支持字符串、对象、数组等多种形式
 * @returns 合并后的类名字符串
 *
 * @example
 * cn('base-class', { 'active': isActive }, ['optional', 'classes'])
 * cn('text-white', condition && 'bg-blue', { 'font-bold': isBold })
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs)
}

/**
 * 创建带前缀的类名合并函数
 * @param prefix 类名前缀
 * @returns 带前缀的类名合并函数
 *
 * @example
 * const nutCn = createPrefixedCn('nut-')
 * nutCn('button', { 'primary': isPrimary }) // 'nut-button nut-primary'
 */
export function createPrefixedCn(prefix: string) {
  return (...inputs: ClassValue[]): string => {
    const merged = cn(...inputs);
    return merged.split(' ').map(cls => cls ? `${prefix}${cls}` : '').join(' ');
  }
}

/**
 * 微信小程序样式类名助手
 * 提供常用的微信风格类名
 */
export const wechatCn = {
  card: 'bg-white rounded-lg shadow-sm border border-gray-100',
  button: {
    primary: 'bg-wechat-green text-white rounded-full',
    secondary: 'bg-gray-100 text-gray-700 rounded-full',
    ghost: 'border border-gray-300 text-gray-700 rounded-full bg-transparent',
  },
  text: {
    primary: 'text-gray-900',
    secondary: 'text-gray-600',
    muted: 'text-gray-400',
  },
  layout: {
    container: 'px-4 py-2',
    section: 'mb-6',
    row: 'flex items-center',
  }
}
