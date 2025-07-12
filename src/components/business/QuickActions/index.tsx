import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

interface QuickAction {
  id: string
  title: string
  description: string
  color: string
  bgColor: string
  iconName: string
}

interface QuickActionsProps {
  onActionClick: (actionId: string) => void
}

const QuickActions: React.FC<QuickActionsProps> = ({ onActionClick }) => {
  const actions: QuickAction[] = [
    {
      id: 'create_workflow',
      title: '创建工作流',
      description: '新建工作流程',
      color: '#07c160',
      bgColor: 'rgba(7, 193, 96, 0.1)',
      iconName: 'add'
    },
    {
      id: 'my_tasks',
      title: '我的任务',
      description: '查看待办事项',
      color: '#576b95',
      bgColor: 'rgba(87, 107, 149, 0.1)',
      iconName: 'assignment'
    },
    {
      id: 'pending_approval',
      title: '待审批',
      description: '处理审批事项',
      color: '#fa9d3b',
      bgColor: 'rgba(250, 157, 59, 0.1)',
      iconName: 'schedule'
    },
    {
      id: 'analytics',
      title: '数据分析',
      description: '查看工作报表',
      color: '#3b82f6',
      bgColor: 'rgba(59, 130, 246, 0.1)',
      iconName: 'assessment'
    }
  ]

  const handleActionClick = (actionId: string) => {
    onActionClick(actionId)
  }

  return (
    <View className="quick-actions">
      <View className="quick-actions__container">
        <View className="quick-actions__card">
          <Text className="quick-actions__title">快速操作</Text>
          <View className="quick-actions__grid">
            {actions.map((action) => (
              <View
                key={action.id}
                className="quick-actions__item"
                onClick={() => handleActionClick(action.id)}
              >
                <View 
                  className="quick-actions__icon"
                  style={{ backgroundColor: action.bgColor, color: action.color }}
                >
                  <MaterialIcons 
                    name={action.iconName} 
                    size={24} 
                    color={action.color} 
                  />
                </View>
                <View className="quick-actions__content">
                  <Text className="quick-actions__item-title">
                    {action.title}
                  </Text>
                  <Text className="quick-actions__item-description">
                    {action.description}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  )
}

export default QuickActions 