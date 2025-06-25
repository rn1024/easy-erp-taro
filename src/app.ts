import React, { useEffect } from 'react'
import { useDidShow, useDidHide } from '@tarojs/taro'
// 导入 NutUI 样式文件
import '@nutui/nutui-react-taro/dist/style.css'
// 全局样式
import './app.scss'
// 导入TabBar管理器
import tabBarManager from './utils/tabBarManager'

function App(props) {
  // 可以使用所有的 React Hooks
  useEffect(() => {
    // 应用启动时初始化TabBar管理器
    tabBarManager.init()
  }, [])

  // 对应 onShow
  useDidShow(() => {
    // 应用显示时更新TabBar状态
    tabBarManager.init()
  })

  // 对应 onHide
  useDidHide(() => {
    // 应用隐藏时可以进行一些清理工作
  })

  return props.children
}

export default App
