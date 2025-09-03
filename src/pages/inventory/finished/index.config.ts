export default definePageConfig({
  navigationBarTitleText: '成品库存',
  navigationBarBackgroundColor: '#fff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f5f5f7',
  enablePullDownRefresh: true,
  onReachBottomDistance: 50
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