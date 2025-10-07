import React, { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image, Input } from '@tarojs/components'
import { Button, Dialog, Switch } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, StatsGrid, Icon } from '@/components/common'

/**
 * Constants
 */
import { mockUsers } from '@/constants/mockData'

/**
 * Types
 */
import { User as UserType } from '@/types'
import type { StatsGridItem } from '@/components/common'

import './index.scss'

interface UserStats {
  createdWorkflows: number
  completedTasks: number
  pendingTasks: number
  completionRate: number
  averageResponseTime: string
}

interface NotificationSettings {
  taskReminders: boolean
  emailNotifications: boolean
  pushNotifications: boolean
  weeklyReports: boolean
}

type SettingItem = {
  title: string
  icon: string
  description: string
  onClick: () => void
}

const Profile: React.FC = () => {
  const [user, setUser] = useState<UserType>(mockUsers[0])
  const [userStats] = useState<UserStats>({
    createdWorkflows: 15,
    completedTasks: 48,
    pendingTasks: 6,
    completionRate: 89,
    averageResponseTime: '2.3小时'
  })

  const [showEditProfile, setShowEditProfile] = useState(false)
  const [showNotificationSettings, setShowNotificationSettings] = useState(false)
  const [editProfileData, setEditProfileData] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.phone || '',
    position: user.position || ''
  })

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    taskReminders: true,
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  })

  const statsItems = useMemo<StatsGridItem[]>(() => ([
    {
      key: 'created',
      label: '创建流程',
      value: userStats.createdWorkflows,
      iconName: 'add_circle',
      iconColor: '#6366f1',
      iconBgColor: 'rgba(99, 102, 241, 0.1)',
      valueColor: '#1f2937'
    },
    {
      key: 'completed',
      label: '完成任务',
      value: userStats.completedTasks,
      iconName: 'done',
      iconColor: '#059669',
      iconBgColor: 'rgba(5, 150, 105, 0.1)',
      valueColor: '#1f2937'
    },
    {
      key: 'pending',
      label: '待办任务',
      value: userStats.pendingTasks,
      iconName: 'schedule',
      iconColor: '#d97706',
      iconBgColor: 'rgba(217, 119, 6, 0.1)',
      valueColor: '#1f2937'
    },
    {
      key: 'rate',
      label: '完成率',
      value: `${userStats.completionRate}%`,
      iconName: 'trending_up',
      iconColor: '#7c3aed',
      iconBgColor: 'rgba(124, 58, 237, 0.1)',
      valueColor: '#1f2937'
    }
  ]), [userStats])

  const settingItems: SettingItem[] = useMemo(() => ([
    {
      title: '账户设置',
      icon: 'person',
      description: '编辑个人信息',
      onClick: () => setShowEditProfile(true)
    },
    {
      title: '通知设置',
      icon: 'notifications_none',
      description: '管理推送通知',
      onClick: () => setShowNotificationSettings(true)
    },
    {
      title: '安全设置',
      icon: 'security',
      description: '密码和安全选项',
      onClick: () => Taro.navigateTo({ url: '/pages/security/index' })
    },
    {
      title: '帮助中心',
      icon: 'help',
      description: '常见问题和支持',
      onClick: () => Taro.navigateTo({ url: '/pages/help/index' })
    }
  ]), [])

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const calculateWorkingDays = () => {
    const joinDate = new Date('2023-01-15')
    const today = new Date()
    const diffTime = Math.abs(today.getTime() - joinDate.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const handleProfileUpdate = (field: string, value: string) => {
    setEditProfileData(prev => ({ ...prev, [field]: value }))
  }

  const handleSaveProfile = () => {
    setUser(prev => ({
      ...prev,
      name: editProfileData.name,
      email: editProfileData.email,
      phone: editProfileData.phone,
      position: editProfileData.position
    }))
    setShowEditProfile(false)
    Taro.showToast({ title: '保存成功', icon: 'success' })
  }

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }))
  }

  const handleLogout = () => {
    Taro.showModal({
      title: '确认退出',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.reLaunch({ url: '/pages/login/index' })
        }
      }
    })
  }

  return (
    <MobileLayout className='profile-page'>
      <View className='profile-page__content'>
        {/* 用户信息卡片 */}
        <SectionCard className='profile-page__user-card'>
          <View className='profile-page__user'>
            <View className='profile-page__avatar-container'>
              <Image
                src={user.avatar || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'}
                className='profile-page__avatar'
                mode='aspectFill'
              />
              <View className='profile-page__avatar-action' onClick={() => Taro.showToast({ title: '更换头像', icon: 'none' })}>
                <Icon name='photo_camera' size={14} color='#ffffff' />
              </View>
            </View>
            <View className='profile-page__user-info'>
              <View className='profile-page__user-header'>
                <Text className='profile-page__user-name'>{user.name}</Text>
                <View className='profile-page__edit-button' onClick={() => setShowEditProfile(true)}>
                  <Icon name='edit' size={12} color='#6b7280' />
                </View>
              </View>
              <Text className='profile-page__user-position'>{user.position || '产品经理'}</Text>
              <Text className='profile-page__user-department'>{user.department || '产品部'}</Text>
            </View>
          </View>
          
          <View className='profile-page__user-details'>
            <View className='profile-page__detail-item'>
              <Icon name='email' size={16} color='#9ca3af' />
              <Text className='profile-page__detail-text'>{user.email || 'zhangsan@company.com'}</Text>
            </View>
            <View className='profile-page__detail-item'>
              <Icon name='phone' size={16} color='#9ca3af' />
              <Text className='profile-page__detail-text'>{user.phone || '138****8888'}</Text>
            </View>
            <View className='profile-page__detail-item'>
              <Icon name='location' size={16} color='#9ca3af' />
              <Text className='profile-page__detail-text'>入职: {formatJoinDate('2023-01-15')}</Text>
            </View>
            <View className='profile-page__detail-item'>
              <Icon name='schedule' size={16} color='#9ca3af' />
              <Text className='profile-page__detail-text'>工作 {calculateWorkingDays()} 天</Text>
            </View>
          </View>
        </SectionCard>

        {/* 统计数据 */}
        <SectionCard title='我的统计' className='profile-page__stats'>
          <StatsGrid items={statsItems} />
        </SectionCard>

        {/* 工作表现 */}
        <SectionCard title='工作表现' className='profile-page__performance'>
          <View className='profile-page__performance-item'>
            <Text className='profile-page__performance-label'>任务完成率</Text>
            <View className='profile-page__performance-value'>
              <View className='profile-page__progress-bar'>
                <View 
                  className='profile-page__progress-fill'
                  style={{ width: `${userStats.completionRate}%` }}
                />
              </View>
              <Text className='profile-page__performance-percent'>{userStats.completionRate}%</Text>
            </View>
          </View>
          
          <View className='profile-page__performance-item'>
            <Text className='profile-page__performance-label'>平均响应时间</Text>
            <View className='profile-page__performance-badge'>
              <Text className='profile-page__performance-badge-text'>{userStats.averageResponseTime}</Text>
            </View>
          </View>
        </SectionCard>

        {/* 设置菜单 */}
        <SectionCard title='设置' className='profile-page__settings'>
          {settingItems.map((item, index) => (
            <View key={item.title}>
              <View className='profile-page__setting-item' onClick={item.onClick}>
                <View className='profile-page__setting-icon'>
                  <Icon name={item.icon} size={20} color='#6b7280' />
                </View>
                <View className='profile-page__setting-content'>
                  <Text className='profile-page__setting-title'>{item.title}</Text>
                  <Text className='profile-page__setting-description'>{item.description}</Text>
                </View>
                <Icon name='chevron_right' size={16} color='#9ca3af' />
              </View>
              {index < settingItems.length - 1 && (
                <View className='profile-page__setting-divider' />
              )}
            </View>
          ))}
        </SectionCard>

        {/* 退出按钮 */}
        <View className='profile-page__logout'>
          <Button
            type='default'
            size='large'
            className='profile-page__logout-button'
            onClick={handleLogout}
          >
            <Icon name='logout' size={16} color='#ef4444' />
            <Text className='profile-page__logout-text'>退出登录</Text>
          </Button>
        </View>
      </View>

      {/* 编辑个人信息弹窗 */}
      <Dialog
        visible={showEditProfile}
        title='编辑个人信息'
        onCancel={() => setShowEditProfile(false)}
        onConfirm={handleSaveProfile}
        className='profile-page__edit-dialog'
      >
        <View className='profile-page__edit-form'>
          <View className='profile-page__form-item'>
            <Text className='profile-page__form-label'>姓名</Text>
            <Input
              className='profile-page__form-input'
              value={editProfileData.name}
              onInput={(e) => handleProfileUpdate('name', e.detail.value)}
              placeholder='请输入姓名'
            />
          </View>
          <View className='profile-page__form-item'>
            <Text className='profile-page__form-label'>邮箱</Text>
            <Input
              className='profile-page__form-input'
              type='email'
              value={editProfileData.email}
              onInput={(e) => handleProfileUpdate('email', e.detail.value)}
              placeholder='请输入邮箱地址'
            />
          </View>
          <View className='profile-page__form-item'>
            <Text className='profile-page__form-label'>手机号</Text>
            <Input
              className='profile-page__form-input'
              type='number'
              value={editProfileData.phone}
              onInput={(e) => handleProfileUpdate('phone', e.detail.value)}
              placeholder='请输入手机号'
            />
          </View>
          <View className='profile-page__form-item'>
            <Text className='profile-page__form-label'>职位</Text>
            <Input
              className='profile-page__form-input'
              value={editProfileData.position}
              onInput={(e) => handleProfileUpdate('position', e.detail.value)}
              placeholder='请输入职位'
            />
          </View>
        </View>
      </Dialog>

      {/* 通知设置弹窗 */}
      <Dialog
        visible={showNotificationSettings}
        title='通知设置'
        onCancel={() => setShowNotificationSettings(false)}
        onConfirm={() => {
          setShowNotificationSettings(false)
          Taro.showToast({ title: '设置已保存', icon: 'success' })
        }}
        className='profile-page__notification-dialog'
      >
        <View className='profile-page__notification-form'>
          <View className='profile-page__notification-item'>
            <View className='profile-page__notification-content'>
              <Text className='profile-page__notification-title'>任务提醒</Text>
              <Text className='profile-page__notification-desc'>新任务和截止日期提醒</Text>
            </View>
            <Switch
              checked={notificationSettings.taskReminders}
              onChange={(value) => handleNotificationChange('taskReminders', value)}
            />
          </View>
          
          <View className='profile-page__notification-item'>
            <View className='profile-page__notification-content'>
              <Text className='profile-page__notification-title'>邮件通知</Text>
              <Text className='profile-page__notification-desc'>重要通知邮件提醒</Text>
            </View>
            <Switch
              checked={notificationSettings.emailNotifications}
              onChange={(value) => handleNotificationChange('emailNotifications', value)}
            />
          </View>
          
          <View className='profile-page__notification-item'>
            <View className='profile-page__notification-content'>
              <Text className='profile-page__notification-title'>推送通知</Text>
              <Text className='profile-page__notification-desc'>手机推送消息</Text>
            </View>
            <Switch
              checked={notificationSettings.pushNotifications}
              onChange={(value) => handleNotificationChange('pushNotifications', value)}
            />
          </View>
          
          <View className='profile-page__notification-item'>
            <View className='profile-page__notification-content'>
              <Text className='profile-page__notification-title'>周报</Text>
              <Text className='profile-page__notification-desc'>每周工作总结</Text>
            </View>
            <Switch
              checked={notificationSettings.weeklyReports}
              onChange={(value) => handleNotificationChange('weeklyReports', value)}
            />
          </View>
        </View>
      </Dialog>
    </MobileLayout>
  )
}

export default Profile