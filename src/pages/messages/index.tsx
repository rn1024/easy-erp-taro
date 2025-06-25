import React, { useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { Tabs, Badge, Card, Avatar } from '@nutui/nutui-react-taro'
import { CheckNormal, Clock, User, Warning, Refresh } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation
} from '../../components'
import './index.scss'

// 消息类型接口
interface Message {
  id: string
  type: 'task' | 'system' | 'unread'
  title: string
  content: string
  time: string
  isRead: boolean
  sender?: {
    name: string
    avatar?: string
  }
  category: string
  action?: string
}

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages')
  const [currentMessageType, setCurrentMessageType] = useState('all')

  // 模拟消息数据 - 按设计稿内容
  const messages: Message[] = [
    {
      id: '1',
      type: 'task',
      title: '新任务分配',
      content: '您被分配了新任务"产品需求评审"，请及时处理',
      time: '6/22 10:30',
      isRead: false,
      sender: { name: '产品经理', avatar: '' },
      category: '任务',
      action: '查看任务'
    },
    {
      id: '2',
      type: 'unread',
      title: '审批提醒',
      content: '您有3个工作流程待审批，请尽快处理',
      time: '6/22 09:15',
      isRead: false,
      sender: { name: '', avatar: '' },
      category: '审批'
    },
    {
      id: '3',
      type: 'task',
      title: '流程状态更新',
      content: '用户界面设计流程已进入下一环节',
      time: '6/22 08:45',
      isRead: true,
      sender: { name: '李四', avatar: '' },
      category: '流程'
    },
    {
      id: '4',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚22:00-24:00进行维护，期间可能影响使用',
      time: '6/21 16:00',
      isRead: true,
      sender: { name: '', avatar: '' },
      category: '系统'
    },
    {
      id: '5',
      type: 'task',
      title: '任务即将到期',
      content: '任务"移动端适配"将于明天到期，请注意及时完成',
      time: '6/21 14:30',
      isRead: false,
      sender: { name: '', avatar: '' },
      category: '任务',
      action: '查看任务'
    }
  ]

  // 消息分类配置 - 按设计稿调整
  const messageTypes = [
    { key: 'all', label: '全部', count: messages.length },
    { key: 'unread', label: '未读', count: messages.filter(m => !m.isRead).length },
    { key: 'task', label: '任务', count: messages.filter(m => m.type === 'task').length },
    { key: 'system', label: '系统', count: messages.filter(m => m.type === 'system').length }
  ]

  // 获取筛选后的消息
  const getFilteredMessages = () => {
    switch (currentMessageType) {
      case 'unread':
        return messages.filter(m => !m.isRead)
      case 'task':
        return messages.filter(m => m.type === 'task')
      case 'system':
        return messages.filter(m => m.type === 'system')
      default:
        return messages
    }
  }

  const filteredMessages = getFilteredMessages()

  // 未读消息数量
  const unreadCount = messages.filter(m => !m.isRead).length

  // 获取消息图标
  const getMessageIcon = (message: Message) => {
    if (message.sender?.name === '产品经理') {
      return <Avatar size="32" className="sender-avatar">产</Avatar>
    }
    if (message.title.includes('审批')) {
      return <Clock size="16" color="#ff8f00" />
    }
    if (message.title.includes('流程')) {
      return <Avatar size="32" className="sender-avatar">李</Avatar>
    }
    if (message.type === 'system') {
      return <Warning size="16" color="#ff4757" />
    }
    if (message.title.includes('即将到期')) {
      return <CheckNormal size="16" color="#07c160" />
    }
    return <User size="16" color="#576b95" />
  }

  // 处理消息点击
  const handleMessageClick = (message: Message) => {
    console.log('点击消息:', message.title)

    if (message.action) {
      Taro.showToast({
        title: message.action,
        icon: 'none',
        duration: 2000
      })
    } else {
      Taro.showToast({
        title: '查看消息详情',
        icon: 'none',
        duration: 1500
      })
    }
  }

  // 处理全部已读
  const handleMarkAllRead = () => {
    Taro.showToast({
      title: '已全部标记为已读',
      icon: 'success',
      duration: 1500
    })
  }

  return (
    <MobileLayout
      className="messages-page"
      hasBottomTab={true}
      footer={
        <BottomNavigation
          messageCount={unreadCount}
        />
      }
    >
      <View className="messages-content">
        {/* 消息头部 */}
        <View className="messages-header">
          <View className="header-info">
            <Text className="header-title">消息中心</Text>
            {unreadCount > 0 && (
              <Badge content={unreadCount} className="unread-badge" />
            )}
          </View>

          {unreadCount > 0 && (
            <View
              className="mark-all-read"
              onClick={handleMarkAllRead}
            >
              <Text className="mark-text">全部已读</Text>
            </View>
          )}
        </View>

        {/* 消息分类标签 */}
        <View className="message-tabs">
          <Tabs
            value={currentMessageType}
            onChange={(value) => setCurrentMessageType(value)}
            className="tabs-container"
          >
            {messageTypes.map(type => (
              <Tabs.TabPane
                key={type.key}
                value={type.key}
                title={type.label}
              />
            ))}
          </Tabs>
        </View>

        {/* 消息列表 */}
        <ScrollView
          className="messages-scroll"
          scrollY
          enhanced
          showScrollbar={false}
        >
          <View className="messages-list">
            {filteredMessages.length > 0 ? (
              filteredMessages.map(message => (
                <View
                  key={message.id}
                  className={`message-item ${!message.isRead ? 'unread' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <View className="message-left">
                    <View className="message-icon">
                      {getMessageIcon(message)}
                    </View>
                  </View>

                  <View className="message-main">
                    <View className="message-header">
                      <View className="message-title-row">
                        <Text className="message-title">{message.title}</Text>
                        <Text className="message-category">{message.category}</Text>
                      </View>
                      {!message.isRead && (
                        <View className="unread-dot" />
                      )}
                    </View>

                    <Text className="message-content">{message.content}</Text>

                    <View className="message-footer">
                      <Text className="message-sender-time">
                        {message.sender?.name && `${message.sender.name} • `}{message.time}
                      </Text>
                      {message.action && (
                        <Text className="message-action">{message.action}</Text>
                      )}
                    </View>
                  </View>
                </View>
              ))
            ) : (
              <View className="empty-state">
                <View className="empty-icon">📬</View>
                <View className="empty-title">暂无消息</View>
                <View className="empty-desc">
                  {currentMessageType === 'all'
                    ? '您目前没有任何消息'
                    : `暂无${messageTypes.find(t => t.key === currentMessageType)?.label}消息`
                  }
                </View>
              </View>
            )}
          </View>
        </ScrollView>
      </View>
    </MobileLayout>
  )
}

export default MessagesPage
