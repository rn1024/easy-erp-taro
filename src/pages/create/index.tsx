import React from 'react'
import { View } from '@tarojs/components'
import CreateWorkflow from '@/components/business/CreateWorkflow'
import './index.scss'

const Create: React.FC = () => {
  return (
    <View className="create-page">
      <CreateWorkflow />
    </View>
  )
}

export default Create 