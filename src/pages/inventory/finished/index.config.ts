export default definePageConfig({
  navigationBarTitleText: '成品库存',
  navigationBarBackgroundColor: '#fff',
  navigationBarTextStyle: 'black',
  backgroundColor: '#f5f5f7',
  enablePullDownRefresh: true,
  onReachBottomDistance: 50
})

function definePageConfig(config: any) {
  return config
} 