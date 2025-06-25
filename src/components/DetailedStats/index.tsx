import React from 'react'
import { View, Text } from '@tarojs/components'
import { Progress } from '@nutui/nutui-react-taro'
import { CheckNormal, Clock, User } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

// 详细统计数据接口
export interface DetailedStatsData {
  activeUsers: number
  completionRate: number
  avgCompletionTime: string
  overallProgress: number
}

interface DetailedStatsProps {
  /** 详细统计数据 */
  stats: DetailedStatsData
  /** 自定义样式类名 */
  className?: string
}

/**
 * 详细统计组件
 * 展示活跃用户、完成率、平均完成时间等详细统计信息
 */
const DetailedStats: React.FC<DetailedStatsProps> = ({
  stats,
  className
}) => {
  return (
    <View className={cn('detailed-stats', className)}>
      <View className="detail-title">详细统计</View>

      <View className="detail-items">
        {/* 活跃用户 */}
        <View className="detail-item">
          <View className="detail-icon">
            <User size="20" color="#576b95" />
          </View>
          <Text className="detail-label">活跃用户</Text>
          <Text className="detail-value">{stats.activeUsers}人</Text>
        </View>

        {/* 完成率 */}
        <View className="detail-item">
          <View className="detail-icon">
            <CheckNormal size="20" color="#07c160" />
          </View>
          <Text className="detail-label">完成率</Text>
          <Text className="detail-value">{stats.completionRate}%</Text>
        </View>

        {/* 平均完成时间 */}
        <View className="detail-item">
          <View className="detail-icon">
            <Clock size="20" color="#ff8f00" />
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
  )
}

export default DetailedStats
