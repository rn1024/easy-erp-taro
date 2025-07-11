import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { Cell, Avatar, Switch, Badge } from '@nutui/nutui-react-taro'
import MobileLayout from '@/components/layout/MobileLayout'
import { mockUsers } from '@/constants/mockData'
import { User } from '@/types'
import './index.scss'

const Profile: React.FC = () => {
  const [user] = useState<User>(mockUsers[0]) // 模拟当前用户
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

  const menuItems = [
    {
      title: '我的任务',
      icon: '📋',
      badge: 5,
      onClick: () => console.log('跳转到我的任务')
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
      icon: '⚙️',
      onClick: () => console.log('跳转到账户设置')
    },
    {
      title: '隐私设置',
      icon: '🔒',
      onClick: () => console.log('跳转到隐私设置')
    },
    {
      title: '帮助中心',
      icon: '❓',
      onClick: () => console.log('跳转到帮助中心')
    },
    {
      title: '关于我们',
      icon: 'ℹ️',
      onClick: () => console.log('跳转到关于我们')
    }
  ]

  return (
    <MobileLayout className="profile-page">
      <View className="profile-page__content">
        {/* 用户信息卡片 */}
        <View className="profile-page__user-card">
          <Avatar
            size="80"
            src={user.avatar}
            className="profile-page__avatar"
          >
            {user.name.charAt(0)}
          </Avatar>
          <View className="profile-page__user-info">
            <View className="profile-page__user-name">{user.name}</View>
            <View className="profile-page__user-role">{user.role}</View>
            <View className="profile-page__user-department">{user.department}</View>
            <View className="profile-page__user-email">{user.email}</View>
          </View>
        </View>

        {/* 快速操作 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">快速操作</View>
          <View className="profile-page__menu-list">
            {menuItems.map((item, index) => (
              <Cell
                key={index}
                className="profile-page__menu-item"
                onClick={item.onClick}
              >
                <View className="profile-page__menu-content">
                  <View className="profile-page__menu-icon">{item.icon}</View>
                  <View className="profile-page__menu-title">{item.title}</View>
                  {item.badge && (
                    <Badge value={item.badge} className="profile-page__menu-badge" />
                  )}
                </View>
              </Cell>
            ))}
          </View>
        </View>

        {/* 通知设置 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">通知设置</View>
          <View className="profile-page__settings-list">
            <Cell className="profile-page__setting-item">
              <View className="profile-page__setting-content">
                <View className="profile-page__setting-label">任务提醒</View>
                <Switch
                  checked={notifications.taskReminders}
                  onChange={(value) => handleNotificationChange('taskReminders', value)}
                />
              </View>
            </Cell>
            <Cell className="profile-page__setting-item">
              <View className="profile-page__setting-content">
                <View className="profile-page__setting-label">工作流更新</View>
                <Switch
                  checked={notifications.workflowUpdates}
                  onChange={(value) => handleNotificationChange('workflowUpdates', value)}
                />
              </View>
            </Cell>
            <Cell className="profile-page__setting-item">
              <View className="profile-page__setting-content">
                <View className="profile-page__setting-label">邮件通知</View>
                <Switch
                  checked={notifications.emailNotifications}
                  onChange={(value) => handleNotificationChange('emailNotifications', value)}
                />
              </View>
            </Cell>
          </View>
        </View>

        {/* 设置菜单 */}
        <View className="profile-page__section">
          <View className="profile-page__section-title">设置</View>
          <View className="profile-page__menu-list">
            {settingItems.map((item, index) => (
              <Cell
                key={index}
                className="profile-page__menu-item"
                onClick={item.onClick}
              >
                <View className="profile-page__menu-content">
                  <View className="profile-page__menu-icon">{item.icon}</View>
                  <View className="profile-page__menu-title">{item.title}</View>
                </View>
              </Cell>
            ))}
          </View>
        </View>
      </View>
    </MobileLayout>
  )
}

export default Profile 