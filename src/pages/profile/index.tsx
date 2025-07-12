import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Button, Avatar } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'



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
  
  const [currentView, setCurrentView] = useState<'main' | 'account' | 'security'>('main')

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

  const handleBackToMain = () => {
    setCurrentView('main')
  }





  const statsCards = [
    {
      title: '创建流程',
      value: userStats.createdWorkflows,
      iconName: 'add',
      color: '#1890ff',
      bgColor: 'rgba(24, 144, 255, 0.1)'
    },
    {
      title: '完成任务',
      value: userStats.completedTasks,
      iconName: 'done',
      color: '#52c41a',
      bgColor: 'rgba(82, 196, 26, 0.1)'
    },
    {
      title: '待办任务',
      value: userStats.pendingTasks,
      iconName: 'schedule',
      color: '#fa8c16',
      bgColor: 'rgba(250, 140, 22, 0.1)'
    },
    {
      title: '完成率',
      value: `${userStats.completionRate}%`,
      iconName: 'star',
      color: '#722ed1',
      bgColor: 'rgba(114, 46, 209, 0.1)'
    }
  ]

  const menuItems = [
    {
      title: '账户设置',
      iconName: 'person',
      description: '编辑个人信息',
      onClick: () => Taro.navigateTo({ url: '/pages/userinfo/index' })
    },
    {
      title: '安全设置',
      iconName: 'security',
      description: '密码和安全选项',
      onClick: () => Taro.navigateTo({ url: '/pages/security/index' })
    },
    {
      title: '帮助中心',
      iconName: 'help',
      description: '常见问题和支持',
      onClick: () => Taro.navigateTo({ url: '/pages/help/index' })
    }
  ]

  // 账户设置现在是独立页面，通过路由跳转

  // 安全设置现在是独立页面，通过路由跳转



  return (
    <MobileLayout className="profile-page">
      <View className="profile-page__content">
        {/* 用户信息卡片 */}
        <View className="profile-page__user-card">
          <View className="profile-page__user-header">
            <View className="profile-page__avatar-container">
              <Avatar
                size="64"
                src={user.avatar}
                className="profile-page__avatar"
              >
                {user.name.charAt(0)}
              </Avatar>

            </View>
            
            <View className="profile-page__user-info">
              <View className="profile-page__user-name-row">
                <Text className="profile-page__user-name">{user.name}</Text>

              </View>
              <Text className="profile-page__user-position">{user.role}</Text>
              <Text className="profile-page__user-department">{user.department}</Text>
            </View>
          </View>
          
          <View className="profile-page__user-details">
            <View className="profile-page__detail-row">
              <View className="profile-page__detail-item">
                <MaterialIcons name="email" size={16} color="#666" />
                <Text className="profile-page__detail-text">{user.email}</Text>
              </View>
              <View className="profile-page__detail-item">
                <MaterialIcons name="phone" size={16} color="#666" />
                <Text className="profile-page__detail-text">138****8888</Text>
              </View>
            </View>
            <View className="profile-page__detail-row">
              <View className="profile-page__detail-item">
                <MaterialIcons name="location_on" size={16} color="#666" />
                <Text className="profile-page__detail-text">入职: {formatJoinDate('2023-01-15')}</Text>
              </View>
              <View className="profile-page__detail-item">
                <MaterialIcons name="schedule" size={16} color="#666" />
                <Text className="profile-page__detail-text">工作 {calculateWorkingDays()} 天</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 统计数据 */}
        <View className="profile-page__section">
          <Text className="profile-page__section-title">我的统计</Text>
          <View className="profile-page__stats-grid">
            {statsCards.map((card, index) => {
              return (
                <View key={index} className="profile-page__stat-card">
                  <View className="profile-page__stat-content">
                    <View className="profile-page__stat-header">
                      <View 
                        className="profile-page__stat-icon"
                        style={{ backgroundColor: card.bgColor }}
                      >
                        <MaterialIcons 
                          name={card.iconName} 
                          size={28} 
                          color={card.color} 
                        />
                      </View>
                    </View>
                    <Text className="profile-page__stat-value">{card.value}</Text>
                    <Text className="profile-page__stat-label">{card.title}</Text>
                  </View>
                </View>
              )
            })}
          </View>
        </View>

        {/* 工作表现 */}
        <View className="profile-page__section">
          <Text className="profile-page__section-title">工作表现</Text>
          <View className="profile-page__performance-card">
            <View className="profile-page__performance-item">
              <View className="profile-page__performance-header">
                <Text className="profile-page__performance-label">任务完成率</Text>
                <View className="profile-page__performance-right">
                  <View className="profile-page__progress-container">
                    <View 
                      className="profile-page__progress-bar"
                      style={{ width: `${userStats.completionRate}%` }}
                    />
                  </View>
                  <Text className="profile-page__performance-value">{userStats.completionRate}%</Text>
                </View>
              </View>
            </View>
            
            <View className="profile-page__performance-item">
              <View className="profile-page__performance-header">
                <Text className="profile-page__performance-label">平均响应时间</Text>
                <View className="profile-page__performance-badge">
                  <Text>{userStats.averageResponseTime}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* 设置菜单 */}
        <View className="profile-page__section">
          <Text className="profile-page__section-title">设置</Text>
          <View className="profile-page__menu-card">
            {menuItems.map((item, index) => {
              return (
                <View key={index}>
                  <View 
                    className="profile-page__menu-item"
                    onClick={item.onClick}
                  >
                    <View className="profile-page__menu-icon">
                      <MaterialIcons name={item.iconName} size={20} color="#666" />
                    </View>
                    <View className="profile-page__menu-content">
                      <Text className="profile-page__menu-title">{item.title}</Text>
                      <Text className="profile-page__menu-desc">{item.description}</Text>
                    </View>
                    <View className="profile-page__menu-arrow">
                      <MaterialIcons name="MaterialIcons" size={16} color="#666" />
                    </View>
                  </View>
                  {index < menuItems.length - 1 && (
                    <View className="profile-page__menu-divider" />
                  )}
                </View>
              )
            })}
          </View>
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