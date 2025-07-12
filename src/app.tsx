import { Component, PropsWithChildren } from 'react'
import { useLaunch } from '@tarojs/taro'
import '@nutui/nutui-react-taro/dist/style.css'
// 导入taro-icons样式
import 'taro-icons/scss/MaterialIcons.scss'

import './app.scss'

function App({ children }: PropsWithChildren<any>) {
  useLaunch(() => {
    console.log('App launched.')
  })

  // children 是将要会渲染的页面
  return children
}

export default App 