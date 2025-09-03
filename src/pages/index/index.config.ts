export default definePageConfig({
  navigationBarTitleText: '首页',
  navigationBarBackgroundColor: '#ffffff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f8f9fa'
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