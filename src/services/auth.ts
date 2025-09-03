import type { ApiResponse } from '@/types'
import { ApiService } from './api'

// 登录响应数据 - 根据easy-erp-web接口返回格式
interface LoginResponse {
  token: string
  refreshToken: string
  user: {
    id: string
    name: string
    status: string
    createdAt: string
    updatedAt: string
  }
  roles: Array<{
    id: string
    name: string
    status: string
  }>
  permissions: string[]
}

// 用户信息响应 - 根据easy-erp-web的me接口格式
interface UserInfoResponse {
  id: string
  username: string
  operator: string
  status: string
  roles: string[]
  permissions: string[]
  createdAt: string
  updatedAt: string
}

// 认证API服务
export class AuthAPI {
  // 用户登录 - 对接 POST /api/v1/auth/login-simple
  static async login(username: string, password: string): Promise<ApiResponse<LoginResponse>> {
    return ApiService.post('/auth/login-simple', {
      username,
      password
    }, {
      showLoading: true,
      loadingText: '登录中...'
    })
  }

  // 获取当前用户信息 - 对接 GET /api/v1/me
  static async getCurrentUser(): Promise<ApiResponse<UserInfoResponse>> {
    return ApiService.get('/me')
  }

  // 刷新Token - 如果后续easy-erp-web支持
  static async refreshToken(refreshToken: string): Promise<ApiResponse<{ token: string; refreshToken: string }>> {
    return ApiService.post('/auth/refresh', {
      refreshToken
    })
  }
}