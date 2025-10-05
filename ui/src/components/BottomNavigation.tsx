import React from 'react';
import { 
  Home, 
  CheckSquare, 
  Plus, 
  MessageCircle, 
  User 
} from 'lucide-react';

interface BottomNavigationProps {
  activeTab: string
  onTabChange: (tab: string) => void
  messageCount?: number
}

export default function BottomNavigation({ 
  activeTab, 
  onTabChange, 
  messageCount = 0 
}: BottomNavigationProps) {
  
  const tabs = [
    {
      id: 'home',
      title: '首页',
      icon: Home
    },
    {
      id: 'tasks',
      title: '任务',
      icon: CheckSquare
    },
    {
      id: 'create',
      title: '创建',
      icon: Plus
    },
    {
      id: 'messages',
      title: '消息',
      icon: MessageCircle,
      badge: messageCount
    },
    {
      id: 'profile',
      title: '我的',
      icon: User
    }
  ]

  const handleTabClick = (tab: string) => {
    onTabChange(tab)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 z-50">
      <div className="flex">
        {tabs.map((tab) => {
          const Icon = tab.icon
          const isActive = activeTab === tab.id
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className={`flex-1 flex flex-col items-center justify-center py-2 px-2 relative transition-colors ${
                isActive ? 'text-blue-500' : 'text-gray-500'
              }`}
            >
              <div className="relative">
                <Icon className="h-6 w-6 mb-1" />
                {tab.badge && tab.badge > 0 && (
                  <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </div>
                )}
              </div>
              <span className="text-xs">{tab.title}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}