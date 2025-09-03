module.exports = {
  defineConstants: {
    'process.env.API_BASE_URL': JSON.stringify('/api/v1')  // 开发环境使用本地代理
  },
  logger: {
    quiet: false,
    stats: true
  },
  mini: {},
  h5: {}
} 