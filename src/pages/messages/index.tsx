import React, { useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { Tabs, Badge, Card } from '@nutui/nutui-react-taro'
import { CheckNormal, Clock, User, Message } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation
} from '../../components'
import './index.scss'

// 消息类型接口
interface Message {
  id: string
  type: 'task' | 'approval' | 'workflow' | 'system'
  title: string
  content: string
  time: string
  isRead: boolean
  sender?: {
    name: string
    avatar?: string
  }
  relatedTask?: {
    id: string
    name: string
  }
}

const MessagesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('messages')
  const [currentMessageType, setCurrentMessageType] = useState('all')

  // 模拟消息数据
  const messages: Message[] = [
    {
      id: '1',
      type: 'task',
      title: '任务已分配',
      content: '您收到一个新的任务：产品需求评审',
      time: '2024-12-24 14:30',
      isRead: false,
      sender: { name: '产品经理', avatar: '' },
      relatedTask: { id: '1', name: '产品需求评审' }
    },
    {
      id: '2',
      type: 'approval',
      title: '待您审批',
      content: '设计方案审批流程需要您的审批',
      time: '2024-12-24 13:15',
      isRead: false,
      sender: { name: '张三', avatar: '' },
      relatedTask: { id: '2', name: '设计方案审批' }
    },
    {
      id: '3',
      type: 'workflow',
      title: '工作流状态更新',
      content: '代码评审工作流已进入下一步骤',
      time: '2024-12-24 11:45',
      isRead: true,
      sender: { name: '系统', avatar: '' },
      relatedTask: { id: '3', name: '代码评审' }
    },
    {
      id: '4',
      type: 'system',
      title: '系统通知',
      content: '系统将于今晚22:00-23:00进行维护',
      time: '2024-12-24 10:00',
      isRead: true,
      sender: { name: '系统管理员', avatar: '' }
    },
    {
      id: '5',
      type: 'task',
      title: '任务截止提醒',
      content: '您的任务"用户反馈处理"将在2小时后截止',
      time: '2024-12-24 09:30',
      isRead: false,
      sender: { name: '系统', avatar: '' },
      relatedTask: { id: '4', name: '用户反馈处理' }
    }
  ]

  // 消息分类配置
  const messageTypes = [
    { key: 'all', label: '全部', count: messages.length },
    { key: 'task', label: '任务', count: messages.filter(m => m.type === 'task').length },
    { key: 'approval', label: '审批', count: messages.filter(m => m.type === 'approval').length },
    { key: 'workflow', label: '流程', count: messages.filter(m => m.type === 'workflow').length },
    { key: 'system', label: '系统', count: messages.filter(m => m.type === 'system').length }
  ]

  // 获取筛选后的消息
  const filteredMessages = currentMessageType === 'all'
    ? messages
    : messages.filter(m => m.type === currentMessageType)

  // 未读消息数量
  const unreadCount = messages.filter(m => !m.isRead).length

  // 获取消息图标
  const getMessageIcon = (type: Message['type']) => {
    switch (type) {
      case 'task':
        return <CheckNormal size="16" color="#07c160" />
      case 'approval':
        return <Clock size="16" color="#ff8f00" />
      case 'workflow':
        return <User size="16" color="#576b95" />
      case 'system':
        return <Message size="16" color="#ff4757" />
      default:
        return <Message size="16" color="#666" />
    }
  }

  // 处理消息点击
  const handleMessageClick = (message: Message) => {
    console.log('点击消息:', message.title)

    if (message.relatedTask) {
      Taro.showToast({
        title: `跳转到任务: ${message.relatedTask.name}`,
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
                title={
                  <View className="tab-title">
                    <Text>{type.label}</Text>
                    {type.count > 0 && (
                      <Badge
                        content={type.count}
                        className="tab-badge"
                      />
                    )}
                  </View>
                }
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
                <Card
                  key={message.id}
                  className={`message-card ${!message.isRead ? 'unread' : ''}`}
                  onClick={() => handleMessageClick(message)}
                >
                  <View className="message-content">
                    <View className="message-header">
                      <View className="message-info">
                        <View className="message-icon">
                          {getMessageIcon(message.type)}
                        </View>
                        <View className="message-title-wrapper">
                          <Text className="message-title">{message.title}</Text>
                          {!message.isRead && (
                            <View className="unread-dot" />
                          )}
                        </View>
                      </View>
                      <Text className="message-time">{message.time}</Text>
                    </View>

                    <View className="message-body">
                      <Text className="message-text">{message.content}</Text>
                      {message.sender && (
                        <Text className="message-sender">
                          来自: {message.sender.name}
                        </Text>
                      )}
                    </View>

                    {message.relatedTask && (
                      <View className="related-task">
                        <Text className="task-label">相关任务:</Text>
                        <Text className="task-name">{message.relatedTask.name}</Text>
                      </View>
                    )}
                  </View>
                </Card>
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
