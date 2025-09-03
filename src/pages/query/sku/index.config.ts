export default definePageConfig({
  navigationBarTitleText: 'SKU搜索',
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