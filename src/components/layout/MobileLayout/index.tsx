import React from 'react'
import { View } from '@tarojs/components'
import { SafeArea } from '@nutui/nutui-react-taro'
import './index.scss'

interface MobileLayoutProps {
  children: React.ReactNode
  showSafeArea?: boolean
  className?: string
}

const MobileLayout: React.FC<MobileLayoutProps> = ({ 
  children, 
  showSafeArea = true,
  className = ''
}) => {
  return (
    <View className={`mobile-layout ${className}`}>
      {showSafeArea ? (
        <SafeArea position="top" />
      ) : null}
      <View className="mobile-layout__content">
        {children}
      </View>
      {showSafeArea ? (
        <SafeArea position="bottom" />
      ) : null}
    </View>
  )
}

export default MobileLayout 