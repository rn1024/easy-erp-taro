import React from 'react'
import { View, Image, Text } from '@tarojs/components'
import './index.scss'

interface IconProps {
  name: string
  size?: number
  color?: string
  className?: string
  onClick?: () => void
}

// 图标映射表 - 使用动态导入路径
const getIconPath = (name: string): string => {
  const iconPaths = {
    // 用户相关
    'user': '/assets/icons/user.png',
    'user-active': '/assets/icons/user-active.png',
    
    // 导航相关
    'home': '/assets/icons/home.png',
    'home-active': '/assets/icons/home-active.png',
    'create': '/assets/icons/create.png',
    'create-active': '/assets/icons/create-active.png',
    'task': '/assets/icons/task.png',
    'task-active': '/assets/icons/task-active.png',
    'message': '/assets/icons/message.png',
    'message-active': '/assets/icons/message-active.png'
  }
  
  return iconPaths[name] || ''
}

// 文字图标映射 - 替代emoji的文字描述
const getTextIcon = (name: string): string => {
  const textIcons = {
    'person': '用户',
    'lock': '锁定',
    'eye': '显示',
    'eye-hide': '隐藏',
    'forbidden': '禁止',
    'secure': '安全',
    'camera': '相机',
    'settings': '设置',
    'edit': '编辑',
    'email': '邮箱',
    'phone': '电话',
    'location': '位置',
    'schedule': '时间',
    'arrow-right': '→',
    'assignment': '任务',
    'check-circle': '完成',
    'pending': '待办',
    'trending-up': '趋势'
  }
  
  return textIcons[name] || name
}

const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color, 
  className = '', 
  onClick 
}) => {
  const iconPath = getIconPath(name)
  
  // 如果是PNG图标资源
  if (iconPath) {
    return (
      <View 
        className={`icon-wrapper ${className}`} 
        onClick={onClick}
        style={{ width: `${size}rpx`, height: `${size}rpx` }}
      >
        <Image 
          src={iconPath} 
          className='icon-image'
          style={{ width: `${size}rpx`, height: `${size}rpx` }}
        />
      </View>
    )
  }
  
  // 如果是文字图标
  const textIcon = getTextIcon(name)
  return (
    <View 
      className={`icon-text ${className}`}
      onClick={onClick}
      style={{ 
        fontSize: `${size}rpx`,
        color: color || 'inherit',
        lineHeight: 1
      }}
    >
      <Text>{textIcon}</Text>
    </View>
  )
}

export default Icon
export type { IconProps }