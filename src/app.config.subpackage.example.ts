// 这是一个微信小程序分包加载的配置示例
// 分包可以优化小程序的启动速度和下载体积

export default {
  // 主包页面
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/messages/index',
    'pages/profile/index'
  ],

  // 分包配置
  subPackages: [
    {
      // 系统管理分包
      root: 'pages/system',
      name: 'system',
      pages: [
        'account/index',
        'security/index',
        'help/index'
      ]
    },
    {
      // 工作流分包
      root: 'pages/workflow',
      name: 'workflow',
      pages: [
        'create/index',
        'builder/index',  // CustomWorkflowBuilder 可以放在这里
        'detail/index'
      ]
    },
    {
      // 演示分包
      root: 'pages/demo',
      name: 'demo',
      pages: [
        'ui-demo/index'
      ]
    }
  ],

  // 分包预下载规则
  preloadRule: {
    // 进入首页时，预下载系统管理分包
    'pages/home/index': {
      network: 'all',
      packages: ['system']
    },
    // 进入任务页面时，预下载工作流分包
    'pages/tasks/index': {
      network: 'wifi',
      packages: ['workflow']
    }
  },

  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '工作流管理',
    navigationBarTextStyle: 'black'
  },

  tabBar: {
    custom: true,
    color: '#666',
    selectedColor: '#07C160',
    backgroundColor: '#fff',
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
