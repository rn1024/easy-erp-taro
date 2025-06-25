import React from 'react'
import { View, Text } from '@tarojs/components'
import { Badge } from '@nutui/nutui-react-taro'
import { Plus, User, Clock, CheckNormal } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

// 快速操作项类型
export interface QuickAction {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  bgColor: string
  count?: number
  description?: string
  disabled?: boolean
}

interface QuickActionsProps {
  /** 操作点击回调函数 */
  onActionClick: (actionId: string) => void
  /** 自定义操作列表 */
  actions?: QuickAction[]
  /** 网格列数 */
  columns?: number
  /** 自定义样式类名 */
  className?: string
  /** 是否显示计数 */
  showCount?: boolean
  /** 组件标题 */
  title?: string
}

/**
 * 快速操作面板组件
 * 提供常用功能的快速入口，支持自定义操作项和网格布局
 */
const QuickActions: React.FC<QuickActionsProps> = ({
  onActionClick,
  actions,
  columns = 2,
  className,
  showCount = true,
  title = '快速操作'
}) => {

  // 默认操作列表
  const defaultActions: QuickAction[] = [
    {
      id: 'create_workflow',
      title: '创建流程',
      icon: <Plus size="24" />,
      color: '#576b95',
      bgColor: '#e8f0fe',
      description: '快速创建新的工作流程'
    },
    {
      id: 'my_tasks',
      title: '我的任务',
      icon: <CheckNormal size="24" />,
      color: '#07c160',
      bgColor: '#e8f7ee',
      count: 8,
      description: '查看分配给我的任务'
    },
    {
      id: 'team_tasks',
      title: '团队任务',
      icon: <User size="24" />,
      color: '#8b5cf6',
      bgColor: '#f3f0ff',
      count: 15,
      description: '查看团队所有任务'
    },
    {
      id: 'pending_approval',
      title: '待我审批',
      icon: <Clock size="24" />,
      color: '#ff8f00',
      bgColor: '#fff2e8',
      count: 3,
      description: '需要我审批的任务'
    },
    {
      id: 'data_report',
      title: '数据报告',
      icon: <Plus size="24" />,
      color: '#576b95',
      bgColor: '#e8f0fe',
      description: '查看工作流统计数据'
    },
    {
      id: 'workflow_settings',
      title: '流程设置',
      icon: <User size="24" />,
      color: '#666',
      bgColor: '#f5f5f5',
      description: '管理工作流程设置'
    }
  ]

  const actionList = actions || defaultActions

  // 处理操作点击
  const handleActionClick = (action: QuickAction) => {
    if (action.disabled) return
    onActionClick(action.id)
  }

  // 根据列数计算网格样式
  const getGridStyle = () => {
    return {
      gridTemplateColumns: `repeat(${columns}, 1fr)`
    }
  }

  return (
    <View className={cn('quick-actions', className)}>

      {/* 标题 */}
      {title && (
        <View className="actions-header">
          <Text className="actions-title">{title}</Text>
        </View>
      )}

      {/* 操作网格 */}
      <View
        className="actions-grid"
        style={getGridStyle()}
      >
        {actionList.map((action) => (
          <View
            key={action.id}
            className={cn('action-card', {
              'disabled': action.disabled
            })}
            onClick={() => handleActionClick(action)}
          >

            {/* 图标容器 */}
            <View className="action-icon-container">
              <View
                className="action-icon"
                style={{
                  background: action.bgColor,
                  color: action.color
                }}
              >
                {React.cloneElement(action.icon as React.ReactElement, {
                  color: action.color
                })}
              </View>

              {/* 计数徽章 */}
              {showCount && action.count && action.count > 0 && (
                <Badge
                  value={action.count > 99 ? '99+' : action.count.toString()}
                  className="action-badge"
                />
              )}
            </View>

            {/* 操作信息 */}
            <View className="action-info">
              <Text className="action-title">{action.title}</Text>

              {/* 计数显示 */}
              {showCount && action.count !== undefined && (
                <Text className="action-count">
                  {action.count > 99 ? '99+' : action.count}
                </Text>
              )}

              {/* 描述信息 */}
              {action.description && (
                <Text className="action-description" numberOfLines={2}>
                  {action.description}
                </Text>
              )}
            </View>


          </View>
        ))}
      </View>

      {/* 操作项为空时的占位 */}
      {actionList.length === 0 && (
        <View className="empty-actions">
          <Text className="empty-text">暂无快速操作</Text>
        </View>
      )}
    </View>
  )
}

export default QuickActions
