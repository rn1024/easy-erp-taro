import React from 'react'
import { View, Text } from '@tarojs/components'
import { Tag } from '@nutui/nutui-react-taro'
import { CheckNormal, Clock, Warning, ArrowUp } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import DetailedStats from '../DetailedStats'
import type { DetailedStatsData } from '../DetailedStats'
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
    if (!showTrend) return null

    return (
      <View className="trend-badge">
        <ArrowUp size="12" color="#fff" />
        <Text className="trend-text">本周趋势</Text>
      </View>
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
      <DetailedStats
        stats={{
          activeUsers: stats.activeUsers,
          completionRate: stats.completionRate,
          avgCompletionTime: stats.avgCompletionTime,
          overallProgress: stats.overallProgress
        }}
      />
    </View>
  )
}

export default WorkflowOverview
