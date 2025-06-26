import React from 'react'
import { View, ScrollView, Text } from '@tarojs/components'
import { Avatar, Progress } from '@nutui/nutui-react-taro'
import {
  User,
  Setting,
  CheckNormal,
  Clock,
  ArrowRight,
  Service
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import './index.scss'

const ProfilePage: React.FC = () => {
  // 模拟用户数据
  const userProfile = {
    name: '张三',
    avatar: '',
    email: 'zhangsan@company.com',
    department: '产品部',
    position: '产品经理',
    joinDate: '2023-03-15',
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
      icon: <User size={20} color="#576b95" />,
      path: '/pages/account/index'
    },
    {
      id: 'security',
      title: '安全设置',
      desc: '登录安全、隐私设置',
      icon: <Setting size={20} color="#07c160" />,
      path: '/pages/security/index'
    },
    {
      id: 'help',
      title: '帮助中心',
      desc: '使用指南、常见问题',
      icon: <Service size={20} color="#ff8f00" />,
      path: '/pages/help/index'
    }
  ]

  // 计算完成率
  const completionRate = Math.round((userProfile.stats.completedTasks / userProfile.stats.totalTasks) * 100)

  // 处理设置项点击
  const handleSettingClick = (path: string) => {
    Taro.navigateTo({ url: path })
  }

  // 处理头像点击
  const handleAvatarClick = () => {
    Taro.showToast({
      title: '功能开发中',
      icon: 'none'
    })
  }

  return (
    <View className="profile-page">
      <ScrollView
        className="profile-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <View className="profile-content">
          {/* 用户信息卡片 */}
          <View className="user-info-card">
            <View className="user-header">
              <View className="user-avatar" onClick={handleAvatarClick}>
                <Avatar
                  size="80"
                  src={userProfile.avatar}
                  className="avatar"
                >
                  {userProfile.name.charAt(0)}
                </Avatar>
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
              </View>
            </View>
          </View>

          {/* 工作统计卡片 */}
          <View className="work-stats-card">
            <View className="stats-header">
              <Text className="stats-title">工作统计</Text>
              <Text className="stats-period">本月数据</Text>
            </View>

            <View className="stats-grid">
              <View className="stat-item">
                <View className="stat-icon completed">
                  <CheckNormal size={16} color="#07c160" />
                </View>
                <Text className="stat-value">{userProfile.stats.completedTasks}</Text>
                <Text className="stat-label">已完成任务</Text>
              </View>

              <View className="stat-item">
                <View className="stat-icon pending">
                  <Clock size={16} color="#ff8f00" />
                </View>
                <Text className="stat-value">{userProfile.stats.approvalsPending}</Text>
                <Text className="stat-label">待审批</Text>
              </View>

              <View className="stat-item">
                <View className="stat-icon created">
                  <User size={16} color="#576b95" />
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
                percent={completionRate}
                color="#07c160"
                className="progress-bar"
              />
              <Text className="progress-desc">
                本月完成 {userProfile.stats.completedTasks} / {userProfile.stats.totalTasks} 个任务
              </Text>
            </View>
          </View>

          {/* 设置菜单 */}
          <View className="settings-menu-card">
            <View className="menu-header">
              <Text className="menu-title">设置</Text>
            </View>

            <View className="menu-list">
              {settingsMenu.map((item, index) => (
                <View
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
                      <ArrowRight size={16} color="#999" />
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>

          {/* 底部安全区域占位，为 tabBar 留出空间 */}
          <View className="bottom-spacer" style={{ height: '120rpx' }} />
        </View>
      </ScrollView>
    </View>
  )
}

export default ProfilePage
