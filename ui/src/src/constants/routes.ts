// 路由常量
export const ROUTES = {
  HOME: '/',
  TASKS: '/tasks',
  WORKFLOW: '/workflow',
  MESSAGES: '/messages',
  PROFILE: '/profile',
  SETTINGS: '/settings',
  HELP: '/help'
} as const

// API路由
export const API_ROUTES = {
  TASKS: '/api/tasks',
  USERS: '/api/users',
  WORKFLOWS: '/api/workflows',
  MESSAGES: '/api/messages',
  UPLOAD: '/api/upload',
  AUTH: '/api/auth'
} as const