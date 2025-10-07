import React, { useState } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { Icon } from '@/components/common'

import './index.scss'

type MessageType = 'task' | 'system' | 'workflow'

interface Message {
  id: string
  title: string
  content: string
  type: MessageType
  sender: {
    name: string
    avatar: string
  }
  time: string
  isRead: boolean
}

const typeConfig: Record<MessageType, { label: string; color: string }> = {
  task: { label: '任务', color: '#3b82f6' },
  system: { label: '系统', color: '#f59e0b' },
  workflow: { label: '流程', color: '#10b981' }
}

const Messages: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      title: '新任务分配',
      content: '您被分配了新任务"产品需求评审"，请及时处理',
      type: 'task',
      sender: {
        name: '产品经理',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      time: '10:30',
      isRead: false
    },
    {
      id: '2',
      title: '流程状态更新',
      content: '用户界面设计流程已进入下一环节',
      type: 'workflow',
      sender: {
        name: '李四',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      time: '09:15',
      isRead: true
    },
    {
      id: '3',
      title: '系统维护通知',
      content: '系统将于今晚22:00-24:00进行维护，期间可能影响使用',
      type: 'system',
      sender: {
        name: '系统',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      time: '08:45',
      isRead: true
    },
    {
      id: '4',
      title: '任务即将到期',
      content: '任务"移动端适配"将于明天到期，请注意及时完成',
      type: 'task',
      sender: {
        name: '项目经理',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      time: '昨天',
      isRead: false
    },
    {
      id: '5',
      title: '工作流完成',
      content: '数据库优化工作流已完成所有环节',
      type: 'workflow',
      sender: {
        name: '王五',
        avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/196430/38/8105/14329/60c806a4Ed506298a/e6de9fb7b8490f38.png'
      },
      time: '昨天',
      isRead: true
    }
  ])

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleMessageClick = (messageId: string) => {
    // 标记消息为已读
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, isRead: true } : msg
    ))
    
    // 显示消息详情
    const message = messages.find(msg => msg.id === messageId)
    if (message) {
      Taro.showModal({
        title: message.title,
        content: message.content,
        showCancel: false,
        confirmText: '确定'
      })
    }
  }

  const filteredMessages = messages.filter(msg => {
    if (!searchText.trim()) return true
    
    const searchLower = searchText.toLowerCase()
    return msg.title.toLowerCase().includes(searchLower) ||
           msg.content.toLowerCase().includes(searchLower) ||
           msg.sender.name.toLowerCase().includes(searchLower)
  })

  return (
    <MobileLayout className='messages-page'>
      <View className='messages-page__wrapper'>
        {/* 搜索区域 */}
        <View className='messages-page__search-section'>
          <SearchBar
            placeholder='搜索消息内容、发送人...'
            value={searchText}
            onChange={setSearchText}
            onSearch={setSearchText}
            className='messages-page__search-bar'
          />
        </View>

        {/* 消息列表 */}
        <PullToRefresh onRefresh={handleRefresh}>
          <View className='messages-page__content'>
            <View className='messages-page__message-list'>
              {filteredMessages.map((message) => {
                const typeInfo = typeConfig[message.type]
                
                return (
                  <View
                    key={message.id}
                    className={`message-card ${!message.isRead ? 'message-card--unread' : ''}`}
                    onClick={() => handleMessageClick(message.id)}
                  >
                    {/* 消息头部 */}
                    <View className='message-card__header'>
                      <Image
                        className='message-card__avatar'
                        src={message.sender.avatar}
                        alt={message.sender.name}
                      />
                      <View className='message-card__info'>
                        <View className='message-card__title-section'>
                          <Text className='message-card__title'>{message.title}</Text>
                          <Text className='message-card__time'>{message.time}</Text>
                        </View>
                        <View className='message-card__meta-section'>
                          <Text className='message-card__sender'>{message.sender.name}</Text>
                          <View 
                            className={`message-card__type-badge message-card__type-badge--${message.type}`}
                          >
                            <Text className='message-card__type-text'>
                              {typeInfo.label}
                            </Text>
                          </View>
                        </View>
                      </View>
                      {!message.isRead && (
                        <View className='message-card__unread-dot' />
                      )}
                    </View>

                    {/* 消息内容 */}
                    <View className='message-card__content'>
                      <Text className='message-card__message'>{message.content}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
            
            {filteredMessages.length === 0 && (
              <View className='messages-page__empty'>
                <Icon name='message' size={48} color='var(--text-tertiary)' />
                <Text className='messages-page__empty-text'>暂无符合条件的消息</Text>
                <Text className='messages-page__empty-hint'>尝试调整搜索条件</Text>
              </View>
            )}
          </View>
        </PullToRefresh>
      </View>
    </MobileLayout>
  )
}

export default Messages