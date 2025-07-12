import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Button
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import './index.scss'

interface MessageItem {
  id: string
  type: 'system' | 'workflow' | 'task' | 'approval'
  title: string
  content: string
  timestamp: string
  isRead: boolean
  avatar?: string
  sender?: string
  priority: 'high' | 'medium' | 'low'
  relatedId?: string
}

interface MessageCenterProps {
  onBack?: () => void
}

const MessageCenter: React.FC<MessageCenterProps> = ({ onBack }) => {
  const [selectedTab, setSelectedTab] = useState('all')
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      type: 'task',
      title: '新任务分配',
      content: '您被分配了新任务"产品需求评审"，请及时处理',
      timestamp: '2024-06-22 10:30',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
      sender: '产品经理',
      priority: 'high',
      relatedId: 'task_123'
    },
    {
      id: '2',
      type: 'approval',
      title: '审批提醒',
      content: '您有3个工作流程待审批，请尽快处理',
      timestamp: '2024-06-22 09:15',
      isRead: false,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'workflow',
      title: '流程状态更新',
      content: '用户界面设计流程已进入下一环节',
      timestamp: '2024-06-22 08:45',
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face',
      sender: '李四',
      priority: 'low'
    },
    {
      id: '4',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚22:00-24:00进行维护，期间可能影响使用',
      timestamp: '2024-06-21 16:00',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '5',
      type: 'task',
      title: '任务即将到期',
      content: '任务"移动端适配"将于明天到期，请注意及时完成',
      timestamp: '2024-06-21 14:30',
      isRead: true,
      priority: 'medium',
      relatedId: 'task_456'
    }
  ])

  const tabs = [
    { id: 'all', name: '全部', count: messages.length },
    { id: 'unread', name: '未读', count: messages.filter(m => !m.isRead).length },
    { id: 'task', name: '任务', count: messages.filter(m => m.type === 'task').length },
    { id: 'system', name: '系统', count: messages.filter(m => m.type === 'system').length }
  ]

  const getFilteredMessages = () => {
    let filtered = messages

    // 按标签过滤
    if (selectedTab !== 'all') {
      if (selectedTab === 'unread') {
        filtered = filtered.filter(m => !m.isRead)
      } else {
        filtered = filtered.filter(m => m.type === selectedTab)
      }
    }

    return filtered.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
  }

  const handleMessageClick = (message: MessageItem) => {
    // 标记为已读
    if (!message.isRead) {
      setMessages(prev => prev.map(m => 
        m.id === message.id ? { ...m, isRead: true } : m
      ))
    }

    // 根据消息类型进行不同的处理
    if (message.relatedId) {
      Taro.showToast({
        title: '查看详情功能开发中',
        icon: 'none'
      })
    }
  }

  const handleMarkAllRead = () => {
    setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
    Taro.showToast({
      title: '已标记全部为已读',
      icon: 'success'
    })
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'task':
        return 'check'
      case 'system':
        return 'notifications'
      case 'workflow':
        return 'build'
      case 'approval':
        return 'schedule'
      default:
        return 'build'
    }
  }

  const getMessageTypeText = (type: string) => {
    switch (type) {
      case 'task':
        return '任务'
      case 'approval':
        return '审批'
      case 'workflow':
        return '流程'
      case 'system':
        return '系统'
      default:
        return '消息'
    }
  }

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const hours = Math.floor(diff / (1000 * 60 * 60))
    
    if (hours < 1) {
      const minutes = Math.floor(diff / (1000 * 60))
      return `${minutes}分钟前`
    } else if (hours < 24) {
      return `${hours}小时前`
    } else {
      const month = date.getMonth() + 1
      const day = date.getDate()
      return `${month}月${day}日`
    }
  }

  const filteredMessages = getFilteredMessages()
  const unreadCount = messages.filter(m => !m.isRead).length

  return (
    <View className="message-center">
      <View className="message-center__content">
        {/* 标签页 */}
        <View className="message-center__tabs">
          <View className="message-center__tabs-container">
            {tabs.map(tab => (
              <View
                key={tab.id}
                className={`message-center__tab ${
                  selectedTab === tab.id ? 'message-center__tab--active' : ''
                }`}
                onClick={() => setSelectedTab(tab.id)}
              >
                <Text className="message-center__tab-text">{tab.name}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 消息列表 */}
        <View className="message-center__list">
          {filteredMessages.length === 0 ? (
            <View className="message-center__empty">
              <Text className="message-center__empty-text">暂无消息</Text>
            </View>
          ) : (
            filteredMessages.map(message => {
              const iconName = getMessageIcon(message.type)
              return (
                <View
                  key={message.id}
                  className={`message-center__message-card ${
                    !message.isRead ? 'message-center__message-card--unread' : ''
                  }`}
                  onClick={() => handleMessageClick(message)}
                >
                  <View className="message-card__content">
                    <View className="message-card__header">
                      <View className="message-card__avatar">
                        {message.avatar ? (
                          <View 
                            className="message-card__avatar-img"
                            style={{ 
                              backgroundImage: `url(${message.avatar})` 
                            }}
                          />
                        ) : (
                          <View className="message-card__icon">
                            <MaterialIcons name={iconName} size={24} color="#666" />
                          </View>
                        )}
                      </View>
                      
                      <View className="message-card__info">
                        <View className="message-card__title-row">
                          <Text className="message-card__title">{message.title}</Text>
                          <View className="message-card__type-badge">
                            {getMessageTypeText(message.type)}
                          </View>
                          {!message.isRead && (
                            <View className="message-card__unread-dot" />
                          )}
                        </View>
                        
                        <Text className="message-card__content-text">
                          {message.content}
                        </Text>
                        
                        <View className="message-card__footer">
                          <View className="message-card__meta">
                            {message.sender && (
                              <>
                                <Text className="message-card__sender">{message.sender}</Text>
                                <Text className="message-card__separator">•</Text>
                              </>
                            )}
                            <Text className="message-card__time">
                              {formatTime(message.timestamp)}
                            </Text>
                          </View>
                          
                          {message.relatedId && (
                            <Text className="message-card__action">
                              查看任务
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </View>
    </View>
  )
}

export default MessageCenter 