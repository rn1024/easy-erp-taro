export default definePageConfig({
  navigationBarTitleText: '个人中心',
  enablePullDownRefresh: false,
  navigationStyle: 'default'
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