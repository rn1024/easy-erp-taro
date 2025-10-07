export default defineAppConfig({
  pages: [
    'pages/index/index',                    // 首页 - TabBar
    'pages/login/index',                    // 登录页
    'pages/tasks/index',                    // 任务管理 - 新增专业化任务页面
    'pages/messages/index',                 // 消息中心 - 新增专业化消息页面
    'pages/query/scan/index',               // 扫描功能 - TabBar
    'pages/query/sku/index',                // SKU搜索
    'pages/inventory/finished/index',       // 成品库存 - TabBar
    'pages/inventory/spare/index',          // 散件库存
    'pages/warehouse/index',                // 仓库管理 - TabBar
    'pages/warehouse/package/index',        // 包装任务
    'pages/warehouse/shipment/index',       // 发货任务
    'pages/products/index',                 // 产品管理
    'pages/profile/index',                  // 个人中心 - TabBar
    'pages/userinfo/index',                 // 账户设置
    'pages/security/index',                 // 安全设置
    'pages/help/index'                      // 帮助中心
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: 'Easy ERP 管理后台',
    navigationBarTextStyle: 'black',
    backgroundColor: '#f5f5f7'     // 微信小程序标准背景色
  },
  tabBar: {
    color: '#6b7280',              // 次要文字色
    selectedColor: '#3b82f6',      // 主色调
    backgroundColor: '#ffffff',    // 卡片背景色
    borderStyle: 'black',
    list: [
      {
        pagePath: 'pages/index/index',
        text: '首页',
        iconPath: 'assets/icons/home.png',
        selectedIconPath: 'assets/icons/home-active.png'
      },
      {
        pagePath: 'pages/query/scan/index',
        text: '扫描',
        iconPath: 'assets/icons/create.png',        // 临时使用现有图标
        selectedIconPath: 'assets/icons/create-active.png'
      },
      {
        pagePath: 'pages/messages/index',
        text: '消息',
        iconPath: 'assets/icons/task.png',          // 临时使用现有图标
        selectedIconPath: 'assets/icons/task-active.png'
      },
      {
        pagePath: 'pages/tasks/index',
        text: '任务',
        iconPath: 'assets/icons/message.png',       // 临时使用现有图标
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

interface AppConfig {
  pages: string[]
  window?: {
    backgroundTextStyle?: string
    navigationBarBackgroundColor?: string
    navigationBarTitleText?: string
    navigationBarTextStyle?: string
    backgroundColor?: string
  }
  tabBar?: {
    color?: string
    selectedColor?: string
    backgroundColor?: string
    borderStyle?: string
    list: Array<{
      pagePath: string
      text: string
      iconPath: string
      selectedIconPath: string
    }>
  }
  [key: string]: unknown
}

function defineAppConfig(config: AppConfig) {
  return config
}