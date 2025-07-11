import React from 'react'
import { View } from '@tarojs/components'
import { Card, Tag, Avatar, Progress } from '@nutui/nutui-react-taro'
import { Task } from '@/types'
import { statusOptions, priorityOptions } from '@/constants/mockData'
import './index.scss'

interface TaskCardProps {
  task: Task
  onClick?: (task: Task) => void
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  const getStatusConfig = (status: string) => {
    return statusOptions.find(item => item.value === status) || statusOptions[0]
  }

  const getPriorityConfig = (priority: string) => {
    return priorityOptions.find(item => item.value === priority) || priorityOptions[0]
  }

  const statusConfig = getStatusConfig(task.status)
  const priorityConfig = getPriorityConfig(task.priority)

  const handleClick = () => {
    onClick?.(task)
  }

  return (
    <Card className="task-card" onClick={handleClick}>
      <View className="task-card__header">
        <View className="task-card__title">{task.title}</View>
        <View className="task-card__tags">
          <Tag 
            background={statusConfig.color} 
            plain
          >
            {statusConfig.label}
          </Tag>
          <Tag 
            background={priorityConfig.color} 
            plain
          >
            {priorityConfig.label}
          </Tag>
        </View>
      </View>

      <View className="task-card__description">
        {task.description}
      </View>

      <View className="task-card__progress">
        <View className="task-card__progress-label">
          进度: {task.progress}%
        </View>
        <Progress 
          percent={task.progress} 
          color={statusConfig.color}
          showText={false}
        />
      </View>

      <View className="task-card__footer">
        <View className="task-card__assignee">
          <Avatar 
            size="24" 
            src={task.assignee.avatar}
          >
            {task.assignee.name.charAt(0)}
          </Avatar>
          <span className="task-card__assignee-name">
            {task.assignee.name}
          </span>
        </View>
        <View className="task-card__due-date">
          截止: {task.dueDate}
        </View>
      </View>

      {task.tags && task.tags.length > 0 && (
        <View className="task-card__task-tags">
          {task.tags.map((tag, index) => (
            <Tag 
              key={index}
              plain
              background="#1890ff"
            >
              {tag}
            </Tag>
          ))}
        </View>
      )}
    </Card>
  )
}

export default TaskCard 