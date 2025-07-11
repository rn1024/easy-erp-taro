import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { 
  Cell, 
  CellGroup, 
  Badge, 
  Avatar, 
  SearchBar, 
  Empty,
  Button
} from '@nutui/nutui-react-taro'
import { Search } from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

interface MessageItem {
  id: string
  type: 'system' | 'workflow' | 'mention' | 'approval'
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
  // 预留扩展属性
}

const MessageCenter: React.FC<MessageCenterProps> = () => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedTab, setSelectedTab] = useState('all')
  const [messages, setMessages] = useState<MessageItem[]>([
    {
      id: '1',
      type: 'workflow',
      title: '产品需求评审流程',
      content: '您的产品需求评审任务已被分配，请及时处理',
      timestamp: '2024-01-06 14:30',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face',
      sender: '张三',
      priority: 'high',
      relatedId: 'workflow_123'
    },
    {
      id: '2',
      type: 'system',
      title: '系统维护通知',
      content: '系统将于今晚22:00-24:00进行例行维护',
      timestamp: '2024-01-06 10:15',
      isRead: true,
      priority: 'medium'
    },
    {
      id: '3',
      type: 'mention',
      title: '任务讨论',
      content: '李四在"界面设计优化"任务中@了您',
      timestamp: '2024-01-05 16:45',
      isRead: false,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face',
      sender: '李四',
      priority: 'high',
      relatedId: 'task_456'
    },
    {
      id: '4',
      type: 'approval',
      title: '审批请求',
      content: '王五提交的请假申请等待您的审批',
      timestamp: '2024-01-05 09:20',
      isRead: true,
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=40&h=40&fit=crop&crop=face',
      sender: '王五',
      priority: 'medium',
      relatedId: 'approval_789'
    },
    {
      id: '5',
      type: 'workflow',
      title: '任务状态变更',
      content: '"移动端开发"任务状态已更新为"进行中"',
      timestamp: '2024-01-04 14:22',
      isRead: true,
      priority: 'low',
      relatedId: 'task_101'
    }
  ])

  const tabs = [
    { id: 'all', name: '全部', count: messages.length },
    { id: 'unread', name: '未读', count: messages.filter(m => !m.isRead).length },
    { id: 'workflow', name: '工作流', count: messages.filter(m => m.type === 'workflow').length },
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

    // 按搜索关键词过滤
    if (searchKeyword) {
      filtered = filtered.filter(m => 
        m.title.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        m.content.toLowerCase().includes(searchKeyword.toLowerCase()) ||
        (m.sender && m.sender.toLowerCase().includes(searchKeyword.toLowerCase()))
      )
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
    switch (message.type) {
      case 'workflow':
        if (message.relatedId) {
          Taro.navigateTo({
            url: `/pages/workflowDetail/index?id=${message.relatedId}`
          })
        }
        break
      case 'approval':
        if (message.relatedId) {
          Taro.navigateTo({
            url: `/pages/approvalDetail/index?id=${message.relatedId}`
          })
        }
        break
      case 'mention':
        if (message.relatedId) {
          Taro.navigateTo({
            url: `/pages/taskDetail/index?id=${message.relatedId}`
          })
        }
        break
             default:
         console.log('消息详情功能开发中')
     }
   }
 

 
   const handleMarkAllRead = () => {
     setMessages(prev => prev.map(m => ({ ...m, isRead: true })))
     console.log('已标记全部消息为已读')
   }

  const getMessageIcon = (type: string) => {
    switch (type) {
      case 'workflow':
        return '📋'
      case 'system':
        return '⚙️'
      case 'mention':
        return '💬'
      case 'approval':
        return '✋'
      default:
        return '📬'
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return '#ff4d4f'
      case 'medium':
        return '#faad14'
      case 'low':
        return '#52c41a'
      default:
        return '#d9d9d9'
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
      return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
    }
  }

  const filteredMessages = getFilteredMessages()

  return (
    <View className="message-center">
      <View className="message-center__header">
        <View className="message-center__title">消息中心</View>
        <Button 
          size="small" 
          fill="none"
          onClick={handleMarkAllRead}
          className="message-center__mark-all-btn"
        >
          全部已读
        </Button>
      </View>

      <View className="message-center__content">
        {/* 搜索框 */}
        <View className="message-center__search">
          <SearchBar
            placeholder="搜索消息"
            value={searchKeyword}
            onChange={setSearchKeyword}
            left={<Search size="16" />}
          />
        </View>

        {/* 标签页 */}
        <View className="message-center__tabs">
          {tabs.map(tab => (
            <View
              key={tab.id}
              className={`message-center__tab ${
                selectedTab === tab.id ? 'message-center__tab--active' : ''
              }`}
              onClick={() => setSelectedTab(tab.id)}
            >
              <View className="message-center__tab-name">{tab.name}</View>
              {tab.count > 0 && (
                <Badge value={tab.count} className="message-center__tab-badge" />
              )}
            </View>
          ))}
        </View>

                 {/* 消息列表 */}
        <View className="message-center__list">
          {filteredMessages.length > 0 ? (
            <CellGroup>
              {filteredMessages.map(message => (
                <Cell
                  key={message.id}
                  onClick={() => handleMessageClick(message)}
                  className={`message-center__message-item ${
                    !message.isRead ? 'message-center__message-item--unread' : ''
                  }`}
                >
                  <View className="message-item__container">
                    <View className="message-item__avatar">
                      {message.avatar ? (
                        <Avatar size="40" src={message.avatar} />
                      ) : (
                        <View className="message-item__icon">
                          {getMessageIcon(message.type)}
                        </View>
                      )}
                    </View>
                    
                    <View className="message-item__content">
                      <View className="message-item__header">
                        <View className="message-item__title">
                          {message.title}
                        </View>
                        <View 
                          className="message-item__priority"
                          style={{ backgroundColor: getPriorityColor(message.priority) }}
                        />
                      </View>
                      
                      <View className="message-item__text">
                        {message.content}
                      </View>
                      
                      <View className="message-item__footer">
                        {message.sender && (
                          <View className="message-item__sender">
                            {message.sender}
                          </View>
                        )}
                        <View className="message-item__time">
                          {formatTime(message.timestamp)}
                        </View>
                      </View>
                    </View>
                    
                    {!message.isRead && (
                      <View className="message-item__unread-dot" />
                    )}
                  </View>
                </Cell>
              ))}
            </CellGroup>
          ) : (
            <Empty 
              description="暂无消息"
              className="message-center__empty"
            />
          )}
        </View>
      </View>
    </View>
  )
}

export default MessageCenter 