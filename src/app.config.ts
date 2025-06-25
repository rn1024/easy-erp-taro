export default {
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/create/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/account/index',
    'pages/security/index',
    'pages/help/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '工作流管理',
    navigationBarTextStyle: 'black'
  },
  // 启用自定义tabBar
  tabBar: {
    custom: true,
    color: '#666666',
    selectedColor: '#07c160',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务'
      },
      {
        pagePath: 'pages/create/index',
        text: '创建'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的'
      }
    ]
  }
}
