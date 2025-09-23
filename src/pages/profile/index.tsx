import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Avatar } from '@nutui/nutui-react-taro'
// @ts-ignore
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
  completionRate: number
  averageResponseTime: string
}

const Profile: React.FC = () => {
  const [user] = useState<UserType>(mockUsers[0])
  const [userStats] = useState<UserStats>({
    createdWorkflows: 15,
    completedTasks: 48,
    pendingTasks: 6,
    completionRate: 89,
    averageResponseTime: '2.3小时'
  })

  const statsCards = [
    {
      title: '创建流程',
      value: userStats.createdWorkflows,
      icon: 'trending-up',
      color: '#5B8FF9'
    },
    {
      title: '完成任务',
      value: userStats.completedTasks,
      icon: 'check-circle',
      color: '#5AD8A6'
    },
    {
      title: '待办任务',
      value: userStats.pendingTasks,
      icon: 'schedule',
      color: '#FF9D4D'
    },
    {
      title: '完成率',
      value: `${userStats.completionRate}%`,
      icon: 'star',
      color: '#8E7EF3'
    }
  ]

  const settingItems = [
    {
      title: '账户设置',
      icon: 'person-outline',
      description: '编辑个人信息',
      onClick: () => Taro.navigateTo({ url: '/pages/userinfo/index' })
    },
    {
      title: '通知设置',
      icon: 'notifications-none',
      description: '管理推送通知',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      title: '安全设置',
      icon: 'shield',
      description: '密码和安全选项',
      onClick: () => Taro.navigateTo({ url: '/pages/security/index' })
    },
    {
      title: '帮助中心',
      icon: 'help-outline',
      description: '常见问题和支持',
      onClick: () => Taro.navigateTo({ url: '/pages/help/index' })
    }
  ]

  return (
    <MobileLayout className='profile-page'>
      <View className='profile-container'>
        {/* 用户信息卡片 */}
        <View className='user-card'>
          <View className='user-header'>
            <View className='avatar-wrapper'>
              <Avatar
                size='80'
                src={user.avatar}
                className='user-avatar'
              >
                {user.name.charAt(0)}
              </Avatar>
              <View className='camera-icon' onClick={() => Taro.showToast({ title: '更换头像', icon: 'none' })}>
                <MaterialIcons name='photo-camera' size={18} color='#666' />
              </View>
            </View>

            <View className='user-info'>
              <View className='name-row'>
                <Text className='user-name'>张三</Text>
                <MaterialIcons
                  name='edit'
                  size={18}
                  color='#999'
                  onClick={() => Taro.navigateTo({ url: '/pages/userinfo/index' })}
                />
              </View>
              <Text className='user-role'>产品经理</Text>
              <Text className='user-dept'>产品部</Text>
            </View>
          </View>

          <View className='user-contact'>
            <Text className='contact-info'>zhangsan@company.com</Text>
            <Text className='contact-info'>📞 138****8888</Text>
          </View>

          <View className='user-meta'>
            <View className='meta-item'>
              <MaterialIcons name='location-on' size={14} color='#999' />
              <Text className='meta-text'>入职: 2023年1月15日</Text>
            </View>
            <View className='meta-item'>
              <MaterialIcons name='schedule' size={14} color='#999' />
              <Text className='meta-text'>工作 983 天</Text>
            </View>
          </View>
        </View>

        {/* 我的统计 */}
        <View className='section'>
          <Text className='section-title'>我的统计</Text>
          <View className='stats-grid'>
            {statsCards.map((stat, index) => (
              <View key={index} className='stat-card'>
                <View className={`stat-icon icon-${stat.icon}`}>
                  <MaterialIcons name={stat.icon} size={24} color={stat.color} />
                </View>
                <Text className='stat-value'>{stat.value}</Text>
                <Text className='stat-label'>{stat.title}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 工作表现 */}
        <View className='section'>
          <Text className='section-title'>工作表现</Text>
          <View className='performance-card'>
            <View className='performance-item'>
              <View className='performance-header'>
                <Text className='performance-label'>任务完成率</Text>
                <Text className='performance-value'>{userStats.completionRate}%</Text>
              </View>
              <View className='progress-wrapper'>
                <View className='progress-bg'>
                  <View
                    className='progress-fill'
                    style={{ width: `${userStats.completionRate}%` }}
                  />
                </View>
              </View>
            </View>

            <View className='performance-item'>
              <View className='performance-header'>
                <Text className='performance-label'>平均响应时间</Text>
                <Text className='performance-time'>{userStats.averageResponseTime}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 设置 */}
        <View className='section'>
          <Text className='section-title'>设置</Text>
          <View className='settings-list'>
            {settingItems.map((item, index) => (
              <View key={index}>
                <View className='setting-item' onClick={item.onClick}>
                  <View className='setting-left'>
                    <View className='setting-icon'>
                      <MaterialIcons name={item.icon} size={20} color='#666' />
                    </View>
                    <View className='setting-content'>
                      <Text className='setting-title'>{item.title}</Text>
                      <Text className='setting-desc'>{item.description}</Text>
                    </View>
                  </View>
                  <MaterialIcons name='chevron-right' size={20} color='#999' />
                </View>
                {index < settingItems.length - 1 && <View className='setting-divider' />}
              </View>
            ))}
          </View>
        </View>

        {/* 退出登录 */}
        <View className='logout-section'>
          <View
            className='logout-button'
            onClick={() => {
              Taro.showModal({
                title: '提示',
                content: '确定要退出登录吗？',
                confirmText: '确定',
                cancelText: '取消',
                success: (res) => {
                  if (res.confirm) {
                    Taro.reLaunch({ url: '/pages/login/index' })
                  }
                }
              })
            }}
          >
            <MaterialIcons name='logout' size={20} color='#ff4d4f' />
            <Text className='logout-text'>退出登录</Text>
          </View>
        </View>
      </View>
    </MobileLayout>
  )
}

export default Profile