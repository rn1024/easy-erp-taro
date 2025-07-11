import React from 'react'
import { View } from '@tarojs/components'
import MessageCenter from '@/components/business/MessageCenter'
import './index.scss'

const Messages: React.FC = () => {
  return (
    <View className="messages-page">
      <MessageCenter />
    </View>
  )
}

export default Messages 