'use client'

import { Home, CheckSquare, Plus, MessageCircle, User } from 'lucide-react'
import { classNames } from '@/utils'
import type { TabId } from '@/types'

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  messageCount?: number
}

const navigationItems = [
  { id: 'home', label: '首页', icon: Home },
  { id: 'tasks', label: '任务', icon: CheckSquare },
  { id: 'create', label: '创建', icon: Plus },
  { id: 'messages', label: '消息', icon: MessageCircle },
  { id: 'profile', label: '我的', icon: User }
]

export function BottomNavigation({ activeTab, onTabChange, messageCount = 0 }: BottomNavigationProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 max-w-sm mx-auto">
      <div className="bg-white border-t border-gray-200 px-2 py-1 wechat-safe-area-bottom backdrop-blur-sm">
        <div className="flex items-center justify-around">
          {navigationItems.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            const showBadge = item.id === 'messages' && messageCount > 0
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={classNames(
                  'flex flex-col items-center justify-center px-3 py-2 rounded-lg transition-all duration-200',
                  'touch-feedback min-h-[44px] min-w-[44px]',
                  isActive 
                    ? 'text-wechat-green bg-green-50' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                )}
                aria-label={item.label}
              >
                <div className="relative">
                  <Icon className={classNames(
                    'h-5 w-5 transition-transform',
                    isActive && 'scale-110'
                  )} />
                  {showBadge && (
                    <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                      {messageCount > 99 ? '99+' : messageCount}
                    </div>
                  )}
                </div>
                <span className={classNames(
                  'text-xs mt-1 transition-colors',
                  isActive ? 'text-wechat-green font-medium' : 'text-gray-500'
                )}>
                  {item.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default BottomNavigation