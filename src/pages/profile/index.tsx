import React, { useState } from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { Avatar, Card, Cell, Progress } from '@nutui/nutui-react-taro'
import {
  User,
  Setting,
  CheckNormal,
  Clock,
  ArrowRight,
  Warning
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import {
  MobileLayout,
  BottomNavigation
} from '../../components'
import './index.scss'

// 用户信息接口
interface UserProfile {
  id: string
  name: string
  avatar?: string
  email: string
  department: string
  position: string
  joinDate: string
  workDays: number
  stats: {
    completedTasks: number
    totalTasks: number
    approvalsPending: number
    workflowsCreated: number
  }
}

const ProfilePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('profile')

  // 模拟用户数据
  const userProfile: UserProfile = {
    id: '1001',
    name: '张三',
    avatar: '',
    email: 'zhangsan@company.com',
    department: '产品部',
    position: '产品经理',
    joinDate: '2023-03-15',
    workDays: 284,
    stats: {
      completedTasks: 18,
      totalTasks: 24,
      approvalsPending: 3,
      workflowsCreated: 12
    }
  }

  // 设置菜单配置
  const settingsMenu = [
    {
      id: 'account',
      title: '账户设置',
      desc: '个人信息、密码修改',
      icon: <User size="20" color="#576b95" />,
      path: '/pages/account/index',
      badge: null
    },
    {
      id: 'security',
      title: '安全设置',
      desc: '登录安全、隐私设置',
      icon: <Warning size="20" color="#07c160" />,
      path: '/pages/security/index',
      badge: null
    },
    {
      id: 'help',
      title: '帮助中心',
      desc: '使用指南、常见问题',
      icon: <Setting size="20" color="#ff8f00" />,
      path: '/pages/help/index',
      badge: null
    }
  ]

  // 计算完成率
  const completionRate = Math.round((userProfile.stats.completedTasks / userProfile.stats.totalTasks) * 100)

  // 处理设置项点击
  const handleSettingClick = (path: string) => {
    console.log('跳转到:', path)
    Taro.navigateTo({ url: path })
  }

  // 处理头像点击
  const handleAvatarClick = () => {
    Taro.showActionSheet({
      itemList: ['拍照', '从相册选择', '查看头像'],
      success: (res) => {
        console.log('选择了:', res.tapIndex)
        Taro.showToast({
          title: '功能开发中',
          icon: 'none',
          duration: 1500
        })
      }
    })
  }



  return (
    <MobileLayout
      className="profile-page"
      hasBottomTab={true}
      footer={
        <BottomNavigation
          messageCount={3}
        />
      }
    >
      <ScrollView
        className="profile-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className="profile-content">
          {/* 用户信息卡片 */}
          <Card className="user-info-card">
            <View className="user-header">
              <View
                className="user-avatar"
                onClick={handleAvatarClick}
              >
                <Avatar
                  size="80"
                  src={userProfile.avatar}
                  className="avatar"
                >
                  {userProfile.name.charAt(0)}
                </Avatar>
                <View className="avatar-edit">
                  <Setting size="12" color="#fff" />
                </View>
              </View>

              <View className="user-basic">
                <Text className="user-name">{userProfile.name}</Text>
                <Text className="user-position">
                  {userProfile.department} · {userProfile.position}
                </Text>
                <Text className="user-email">{userProfile.email}</Text>
              </View>
            </View>

            <View className="user-stats">
              <View className="join-info">
                <Text className="join-label">入职时间</Text>
                <Text className="join-date">{userProfile.joinDate}</Text>
                <Text className="work-days">已工作 {userProfile.workDays} 天</Text>
              </View>
            </View>
          </Card>

          {/* 工作统计卡片 */}
          <Card className="work-stats-card">
            <View className="stats-header">
              <Text className="stats-title">工作统计</Text>
              <Text className="stats-period">本月数据</Text>
            </View>

            <View className="stats-grid">
              <View className="stat-item">
                <View className="stat-icon completed">
                  <CheckNormal size="16" color="#07c160" />
                </View>
                <Text className="stat-value">{userProfile.stats.completedTasks}</Text>
                <Text className="stat-label">已完成任务</Text>
              </View>

              <View className="stat-item">
                <View className="stat-icon pending">
                  <Clock size="16" color="#ff8f00" />
                </View>
                <Text className="stat-value">{userProfile.stats.approvalsPending}</Text>
                <Text className="stat-label">待审批</Text>
              </View>

              <View className="stat-item">
                <View className="stat-icon created">
                  <User size="16" color="#576b95" />
                </View>
                <Text className="stat-value">{userProfile.stats.workflowsCreated}</Text>
                <Text className="stat-label">创建流程</Text>
              </View>
            </View>

            <View className="completion-progress">
              <View className="progress-header">
                <Text className="progress-label">任务完成率</Text>
                <Text className="progress-value">{completionRate}%</Text>
              </View>
              <Progress
                percentage={completionRate}
                strokeColor="#07c160"
                className="progress-bar"
              />
              <Text className="progress-desc">
                本月完成 {userProfile.stats.completedTasks} / {userProfile.stats.totalTasks} 个任务
              </Text>
            </View>
          </Card>

          {/* 设置菜单 */}
          <Card className="settings-menu-card">
            <View className="menu-header">
              <Text className="menu-title">设置</Text>
            </View>

            <View className="menu-list">
              {settingsMenu.map((item, index) => (
                <Cell
                  key={item.id}
                  className={`menu-item ${index === settingsMenu.length - 1 ? 'last' : ''}`}
                  onClick={() => handleSettingClick(item.path)}
                >
                  <View className="menu-content">
                    <View className="menu-left">
                      <View className="menu-icon">{item.icon}</View>
                      <View className="menu-info">
                        <Text className="menu-title-text">{item.title}</Text>
                        <Text className="menu-desc">{item.desc}</Text>
                      </View>
                    </View>
                    <View className="menu-right">
                      {item.badge && (
                        <View className="menu-badge">{item.badge}</View>
                      )}
                      <ArrowRight size="16" color="#999" />
                    </View>
                  </View>
                </Cell>
              ))}
            </View>
          </Card>

          {/* 底部安全区域占位 */}
          <View className="bottom-spacer" />
        </View>
      </ScrollView>
    </MobileLayout>
  )
}

export default ProfilePage
