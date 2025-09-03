export default definePageConfig({
  navigationBarTitleText: '用户登录',
  navigationBarBackgroundColor: '#667eea',
  navigationBarTextStyle: 'white',
  backgroundColor: '#667eea',
  navigationStyle: 'default',
  backgroundColorTop: '#667eea',
  backgroundColorBottom: '#764ba2'
})

interface PageConfig {
  navigationBarTitleText?: string
  enablePullDownRefresh?: boolean
  navigationStyle?: string
  [key: string]: unknown
}

function definePageConfig(config: PageConfig) {
  return config
}