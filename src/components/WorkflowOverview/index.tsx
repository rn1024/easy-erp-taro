import React from 'react'
import { View, Text } from '@tarojs/components'
import { Progress, Tag } from '@nutui/nutui-react-taro'
import { CheckNormal, Clock, Warning, User } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

// 统计数据接口
export interface OverviewStats {
  totalTasks: number
  completedTasks: number
  pendingTasks: number
  overdueTasks: number
  activeUsers: number
  completionRate: number
  avgCompletionTime: string
  overallProgress: number
  trend?: 'up' | 'down' | 'stable'
}

interface WorkflowOverviewProps {
  /** 统计数据 */
  stats: OverviewStats
  /** 自定义样式类名 */
  className?: string
  /** 是否显示趋势 */
  showTrend?: boolean
}

/**
 * 工作流概览组件
 * 展示工作流数据概览和统计信息
 */
const WorkflowOverview: React.FC<WorkflowOverviewProps> = ({
  stats,
  className,
  showTrend = true
}) => {

  // 计算完成率
  const completionPercentage = Math.round((stats.completedTasks / stats.totalTasks) * 100) || 0

  // 格式化趋势显示
  const renderTrend = () => {
    if (!showTrend || !stats.trend) return null

    const trendConfig = {
      up: { text: '本周趋势', color: 'success', textColor: '#07c160' },
      down: { text: '本周趋势', color: 'danger', textColor: '#ff4757' },
      stable: { text: '本周趋势', color: 'primary', textColor: '#576b95' }
    }

    const config = trendConfig[stats.trend]

    return (
      <Tag
        type={config.color as any}
        size="small"
        className="trend-tag"
      >
        {config.text}
      </Tag>
    )
  }

  return (
    <View className={cn('workflow-overview', className)}>

      {/* 头部标题和趋势 */}
      <View className="overview-header">
        <Text className="overview-title">工作流概览</Text>
        {renderTrend()}
      </View>

      {/* 统计卡片网格 */}
      <View className="stats-grid">

        {/* 总任务数 */}
        <View className="stat-card primary">
          <View className="stat-icon-wrapper">
            <View className="stat-icon primary">
              <CheckNormal size="24" color="#576b95" />
            </View>
          </View>
          <View className="stat-content">
            <Text className="stat-number">{stats.totalTasks}</Text>
            <Text className="stat-label">总任务数</Text>
          </View>
        </View>

        {/* 已完成任务 */}
        <View className="stat-card success">
          <View className="stat-icon-wrapper">
            <View className="stat-icon success">
              <CheckNormal size="24" color="#07c160" />
            </View>
          </View>
          <View className="stat-content">
            <Text className="stat-number">{stats.completedTasks}</Text>
            <Text className="stat-label">已完成</Text>
          </View>
          <View className="stat-badge success">
            <Text className="badge-text">{completionPercentage}%</Text>
          </View>
        </View>

        {/* 待处理任务 */}
        <View className="stat-card warning">
          <View className="stat-icon-wrapper">
            <View className="stat-icon warning">
              <Clock size="24" color="#ff8f00" />
            </View>
          </View>
          <View className="stat-content">
            <Text className="stat-number">{stats.pendingTasks}</Text>
            <Text className="stat-label">待处理</Text>
          </View>
        </View>

        {/* 已逾期任务 */}
        <View className="stat-card danger">
          <View className="stat-icon-wrapper">
            <View className="stat-icon danger">
              <Warning size="24" color="#ff4757" />
            </View>
          </View>
          <View className="stat-content">
            <Text className="stat-number">{stats.overdueTasks}</Text>
            <Text className="stat-label">已逾期</Text>
          </View>
          {stats.overdueTasks > 0 && (
            <View className="stat-badge danger">
              <Text className="badge-text">需关注</Text>
            </View>
          )}
        </View>
      </View>

      {/* 详细统计 */}
      <View className="detail-stats">
        <Text className="detail-title">详细统计</Text>

        <View className="detail-items">
          {/* 活跃用户 */}
          <View className="detail-item">
            <View className="detail-icon">
              <User size="20" color="#666" />
            </View>
            <Text className="detail-label">活跃用户</Text>
            <Text className="detail-value">{stats.activeUsers}人</Text>
          </View>

          {/* 完成率 */}
          <View className="detail-item">
            <View className="detail-icon">
              <CheckNormal size="20" color="#666" />
            </View>
            <Text className="detail-label">完成率</Text>
            <Text className="detail-value">{stats.completionRate}%</Text>
          </View>

          {/* 平均完成时间 */}
          <View className="detail-item">
            <View className="detail-icon">
              <Clock size="20" color="#666" />
            </View>
            <Text className="detail-label">平均完成时间</Text>
            <Text className="detail-value">{stats.avgCompletionTime}</Text>
          </View>
        </View>

        {/* 总体完成进度 */}
        <View className="overall-progress">
          <View className="progress-header">
            <Text className="progress-label">总体完成进度</Text>
            <Text className="progress-value">{stats.overallProgress}%</Text>
          </View>
          <Progress
            percentage={stats.overallProgress}
            strokeWidth="16"
            color="#07c160"
            className="progress-bar"
          />
        </View>
      </View>
    </View>
  )
}

export default WorkflowOverview
