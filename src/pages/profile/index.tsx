import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Cell, Avatar, Switch, Badge, Card, Progress, Button } from '@nutui/nutui-react-taro'
import { 
  User, 
  Setting, 
  Notice, 
  Service, 
  Edit,
  ArrowRight,
  Clock,
  CheckNormal
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/layout/MobileLayout'
import { mockUsers } from '@/constants/mockData'
import { User as UserType } from '@/types'
import './index.scss'

interface UserStats {
  createdWorkflows: number
  completedTasks: number
  pendingTasks: number
  totalWorkingDays: number
  completionRate: number
  averageResponseTime: string
}

const Profile: React.FC = () => {
  const [user] = useState<UserType>(mockUsers[0])
  const [userStats] = useState<UserStats>({
    createdWorkflows: 15,
    completedTasks: 48,
    pendingTasks: 6,
    totalWorkingDays: 365,
    completionRate: 89,
    averageResponseTime: '2.3小时'
  })
  
  const [notifications, setNotifications] = useState({
    taskReminders: true,
    workflowUpdates: true,
    emailNotifications: false
  })

  const handleNotificationChange = (key: string, value: boolean) => {
    setNotifications(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateWorkingDays = () => {
    const today = new Date()
    const joinDate = new Date('2023-01-15')
    const diffTime = Math.abs(today.getTime() - joinDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const statsCards = [
    {
      title: '创建流程',
      value: userStats.createdWorkflows,
      icon: Service,
      color: '#1890ff',
      bgColor: 'rgba(24, 144, 255, 0.1)'
    },
    {
      title: '完成任务',
      value: userStats.completedTasks,
      icon: CheckNormal,
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)'
    },
    {
      title: '待办任务',
      value: userStats.pendingTasks,
      icon: Clock,
      color: '#fa8c16',
      bgColor: 'rgba(250, 140, 22, 0.1)'
    },
    {
      title: '完成率',
      value: `${userStats.completionRate}%`,
      icon: CheckNormal,
      color: '#722ed1',
      bgColor: 'rgba(114, 46, 209, 0.1)'
    }
  ]

  const menuItems = [
    {
      title: '我的任务',
      icon: '📋',
      badge: 5,
      onClick: () => Taro.switchTab({ url: '/pages/tasks/index' })
    },
    {
      title: '我的审批',
      icon: '✅',
      badge: 2,
      onClick: () => console.log('跳转到我的审批')
    },
    {
      title: '工作流程',
      icon: '🔄',
      onClick: () => console.log('跳转到工作流程')
    },
    {
      title: '团队协作',
      icon: '👥',
      onClick: () => console.log('跳转到团队协作')
    }
  ]

  const settingItems = [
    {
      title: '账户设置',
      icon: User,
      description: '编辑个人信息',
      onClick: () => console.log('跳转到账户设置')
    },
    {
      title: '通知设置',
      icon: Notice,
      description: '管理推送通知',
      onClick: () => console.log('跳转到通知设置')
    },
    {
      title: '安全设置',
      icon: Setting,
      description: '密码和安全选项',
      onClick: () => console.log('跳转到安全设置')
    },
    {
      title: '帮助中心',
      icon: Service,
      description: '常见问题和支持',
      onClick: () => console.log('跳转到帮助中心')
    }
  ]

  return (
    <MobileLayout className="profile-page">
      <View className="profile-page__content">
        {/* 用户信息卡片 */}
        <Card className="profile-page__user-card">
          <View className="profile-page__user-header">
            <Avatar
              size="80"
              src={user.avatar}
              className="profile-page__avatar"
            >
              {user.name.charAt(0)}
            </Avatar>
            <View className="profile-page__user-info">
              <View className="profile-page__user-name-row">
                <Text className="profile-page__user-name">{user.name}</Text>
                <Button
                  className="profile-page__edit-btn"
                  size="small"
                  fill="outline"
                  onClick={() => console.log('编辑个人信息')}
                >
                  <Edit size="12" />
                </Button>
              </View>
              <Text className="profile-page__user-role">{user.role}</Text>
              <Text className="profile-page__user-department">{user.department}</Text>
            </View>
          </View>
          
          <View className="profile-page__user-details">
            <View className="profile-page__detail-item">
              <Text className="profile-page__detail-label">邮箱</Text>
              <Text className="profile-page__detail-value">{user.email}</Text>
            </View>
            <View className="profile-page__detail-item">
              <Text className="profile-page__detail-label">入职时间</Text>
              <Text className="profile-page__detail-value">{formatJoinDate('2023-01-15')}</Text>
            </View>
            <View className="profile-page__detail-item">
              <Text className="profile-page__detail-label">工作天数</Text>
              <Text className="profile-page__detail-value">{calculateWorkingDays()} 天</Text>
            </View>
          </View>
        </Card>

        {/* 统计数据 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">我的统计</View>
          <View className="profile-page__stats-grid">
            {statsCards.map((card, index) => {
              const Icon = card.icon
              return (
                <Card key={index} className="profile-page__stat-card">
                  <View className="profile-page__stat-content">
                    <View className="profile-page__stat-header">
                      <View 
                        className="profile-page__stat-icon"
                        style={{ 
                          backgroundColor: card.bgColor,
                          color: card.color 
                        }}
                      >
                        <Icon size="20" />
                      </View>
                    </View>
                    <View className="profile-page__stat-value">{card.value}</View>
                    <View className="profile-page__stat-label">{card.title}</View>
                  </View>
                </Card>
              )
            })}
          </View>
        </View>

        {/* 工作表现 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">工作表现</View>
          <Card className="profile-page__performance-card">
            <View className="profile-page__performance-item">
              <View className="profile-page__performance-header">
                <Text className="profile-page__performance-label">任务完成率</Text>
                <Text className="profile-page__performance-value">{userStats.completionRate}%</Text>
              </View>
              <Progress 
                percent={userStats.completionRate} 
                color="#52c41a"
                showText={false}
                strokeWidth={8}
              />
            </View>
            
            <View className="profile-page__performance-item">
              <View className="profile-page__performance-header">
                <Text className="profile-page__performance-label">平均响应时间</Text>
                <Text className="profile-page__performance-badge">
                  {userStats.averageResponseTime}
                </Text>
              </View>
            </View>
          </Card>
        </View>

        {/* 快速操作 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">快速操作</View>
          <View className="profile-page__menu-grid">
            {menuItems.map((item, index) => (
              <Card 
                key={index} 
                className="profile-page__menu-card"
                onClick={item.onClick}
              >
                <View className="profile-page__menu-content">
                  <View className="profile-page__menu-icon">{item.icon}</View>
                  <View className="profile-page__menu-title">{item.title}</View>
                  {item.badge && (
                    <Badge value={item.badge.toString()} className="profile-page__menu-badge" />
                  )}
                </View>
              </Card>
            ))}
          </View>
        </View>

        {/* 通知设置 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">通知设置</View>
          <Card className="profile-page__notification-card">
            <View className="profile-page__notification-item">
              <View className="profile-page__notification-info">
                <Text className="profile-page__notification-label">任务提醒</Text>
                <Text className="profile-page__notification-desc">新任务和截止日期提醒</Text>
              </View>
              <Switch
                checked={notifications.taskReminders}
                onChange={(value) => handleNotificationChange('taskReminders', value)}
              />
            </View>
            <View className="profile-page__notification-item">
              <View className="profile-page__notification-info">
                <Text className="profile-page__notification-label">工作流更新</Text>
                <Text className="profile-page__notification-desc">工作流程状态变更通知</Text>
              </View>
              <Switch
                checked={notifications.workflowUpdates}
                onChange={(value) => handleNotificationChange('workflowUpdates', value)}
              />
            </View>
            <View className="profile-page__notification-item">
              <View className="profile-page__notification-info">
                <Text className="profile-page__notification-label">邮件通知</Text>
                <Text className="profile-page__notification-desc">重要通知邮件提醒</Text>
              </View>
              <Switch
                checked={notifications.emailNotifications}
                onChange={(value) => handleNotificationChange('emailNotifications', value)}
              />
            </View>
          </Card>
        </View>

        {/* 设置菜单 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">设置</View>
          <Card className="profile-page__settings-card">
            {settingItems.map((item, index) => {
              const Icon = item.icon
              return (
                <View key={index}>
                  <View 
                    className="profile-page__setting-item"
                    onClick={item.onClick}
                  >
                    <View className="profile-page__setting-icon">
                      <Icon size="20" />
                    </View>
                    <View className="profile-page__setting-content">
                      <Text className="profile-page__setting-title">{item.title}</Text>
                      <Text className="profile-page__setting-desc">{item.description}</Text>
                    </View>
                    <ArrowRight size="16" className="profile-page__setting-arrow" />
                  </View>
                  {index < settingItems.length - 1 && (
                    <View className="profile-page__setting-divider" />
                  )}
                </View>
              )
            })}
          </Card>
        </View>

        {/* 退出登录 */}
        <View className="profile-page__section">
          <Button
            className="profile-page__logout-btn"
            fill="outline"
            onClick={() => {
              Taro.showModal({
                title: '确认退出',
                content: '确定要退出登录吗？',
                success: (res) => {
                  if (res.confirm) {
                    console.log('用户点击确定')
                  }
                }
              })
            }}
          >
            退出登录
          </Button>
        </View>
      </View>
    </MobileLayout>
  )
}

export default Profile 