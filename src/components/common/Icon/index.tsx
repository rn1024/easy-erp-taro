import React from 'react'
import { View, Image } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
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
  
  return iconPaths[name] ?? ''
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
  
  // 使用MaterialIcons - 将rpx转换为合适的px值
  const pixelSize = Math.round(size / 2) // 48rpx -> 24px
  return (
    <View 
      className={`icon-wrapper ${className}`}
      onClick={onClick}
      style={{ 
        width: `${size}rpx`, 
        height: `${size}rpx`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <MaterialIcons 
        name={name} 
        size={pixelSize} 
        color={color ?? '#ffffff'} 
      />
    </View>
  )
}

export default Icon
export type { IconProps }
