export default {
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/create/index',
    'pages/messages/index',
    'pages/profile/index',
    'pages/account/index',
    'pages/security/index',
    'pages/help/index',
    'pages/ui-demo/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'WeChat',
    navigationBarTextStyle: 'black'
  },
  // 启用自定义tabBar
  tabBar: {
    custom: true,
    color: '#666',
    selectedColor: '#07C160',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/home/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务',
        iconPath: 'assets/icons/task.png',
        selectedIconPath: 'assets/icons/task-active.png'
      },
      {
        pagePath: 'pages/create/index',
        text: '创建',
        iconPath: 'assets/icons/add.png',
        selectedIconPath: 'assets/icons/add-active.png'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息',
        iconPath: 'assets/icons/message.png',
        selectedIconPath: 'assets/icons/message-active.png'
      },
      {
        pagePath: 'pages/profile/index',
        text: '我的',
        iconPath: 'assets/icons/user.png',
        selectedIconPath: 'assets/icons/user-active.png'
      }
    ]
  }
}
