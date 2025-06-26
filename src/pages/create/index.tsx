import React, { useEffect } from 'react'
import { View, ScrollView } from '@tarojs/components'
import Taro, { useDidShow } from '@tarojs/taro'
import { CustomWorkflowBuilder } from '../../components'
import tabBarManager from '../../utils/tabBarManager'
import './index.scss'

const CreatePage: React.FC = () => {
  useEffect(() => {
    // 设置当前激活的Tab
    tabBarManager.setActiveTab(2)
  }, [])

  useDidShow(() => {
    // 设置自定义 tabBar 的选中状态
    if (typeof Taro.getTabBar === 'function') {
      const tabBar = Taro.getTabBar(Taro.getCurrentInstance().page) as any
      if (tabBar && tabBar.setData) {
        tabBar.setData({
          selected: 2
        })
      }
    }
  })

  return (
    <View className="create-page">
      <ScrollView
        className="create-scroll"
        scrollY
        enhanced
        showScrollbar={false}
      >
        <CustomWorkflowBuilder />
      </ScrollView>
    </View>
  )
}

export default CreatePage
