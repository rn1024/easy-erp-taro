export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/tasks/index',
    'pages/create/index',
    'pages/messages/index',
    'pages/profile/index'
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Easy ERP',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f8f9fa'
  },
  tabBar: {
    color: '#666666',
    selectedColor: '#1890ff',
    backgroundColor: '#ffffff',
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
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
        iconPath: 'assets/icons/create.png',
        selectedIconPath: 'assets/icons/create-active.png'
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
})

function defineAppConfig(config: any) {
  return config
} 