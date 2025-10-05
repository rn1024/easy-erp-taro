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
  
  return iconPaths[name] ?? ''
}

// 文字图标映射 - 替代emoji的文字描述
const getTextIcon = (name: string): string => {
  const textIcons = {
    'person': '用户',
    'person_outline': '个人',
    'lock': '锁定',
    'eye': '显示',
    'eye_off': '隐藏',
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
    'trending-up': '趋势',
    'trending_down': '下降',
    'qr_code_scanner': '扫码',
    'inventory_2': '库存',
    'inventory': '库存',
    'history': '历史',
    'search': '搜索',
    'visibility': '显示',
    'visibility_off': '隐藏',
    'photo_camera': '照相',
    'notifications_none': '通知',
    'chevron_right': '→',
    'expand_less': '收起',
    'expand_more': '展开',
    'thumb_up': '👍',
    'security': '安全',
    'help': '帮助',
    'help_center': '帮助中心',
    'help_outline': '帮助说明',
    'logout': '退出',
    'arrow_back': '←',
    'arrow_forward': '→',
    'build': '构建',
    'task': '任务',
    'chat_bubble': '聊天',
    'shield': '盾牌',
    'smartphone': '手机',
    'key': '密钥',
    'warning': '警告',
    'close': '关闭',
    'business': '商务',
    'store': '店铺',
    'category': '分类',
    'remove': '移除'
  }
  
  return textIcons[name] ?? name
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
        color: color ?? 'inherit',
        lineHeight: 1
      }}
    >
      <Text>{textIcon}</Text>
    </View>
  )
}

export default Icon
export type { IconProps }
