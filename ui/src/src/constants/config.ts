// 应用配置
export const APP_CONFIG = {
  NAME: 'WeChat Task Management',
  VERSION: '1.0.0',
  DESCRIPTION: 'WeChat style task management application',
  
  // 分页配置
  PAGINATION: {
    DEFAULT_SIZE: 20,
    MAX_SIZE: 100
  },
  
  // 文件上传配置
  UPLOAD: {
    MAX_SIZE: 10 * 1024 * 1024, // 10MB
    ALLOWED_TYPES: [
      'image/jpeg',
      'image/png', 
      'image/gif',
      'application/pdf',
      'text/plain'
    ]
  },
  
  // 性能配置
  DEBOUNCE_DELAY: 300,
  THROTTLE_DELAY: 1000,
  TOAST_DURATION: 3000,
  
  // 缓存配置
  CACHE_TTL: 5 * 60 * 1000 // 5分钟
} as const

// 环境配置
export const ENV_CONFIG = {
  isDevelopment: process.env.NODE_ENV === 'development',
  isProduction: process.env.NODE_ENV === 'production',
  isTest: process.env.NODE_ENV === 'test',
  
  API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3000/api',
  APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
} as const