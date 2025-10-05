import { ApiService } from './api'
import type { ResType, SecuritySettings, LoginDevice } from './types'

export class SecurityService {
  // 获取安全设置
  static async getSecuritySettings(): Promise<ResType<SecuritySettings>> {
    return ApiService.get<SecuritySettings>('/user/security/settings')
  }

  // 更新安全设置
  static async updateSecuritySettings(
    key: keyof SecuritySettings,
    value: boolean
  ): Promise<ResType<SecuritySettings>> {
    return ApiService.patch<SecuritySettings>('/user/security/settings', {
      [key]: value
    }, {
      showLoading: true,
      loadingText: '更新中...'
    })
  }

  // 修改密码
  static async changePassword(data: {
    currentPassword: string
    newPassword: string
  }): Promise<ResType<{ success: boolean }>> {
    return ApiService.post<{ success: boolean }>('/user/security/password', data, {
      showLoading: true,
      loadingText: '修改中...'
    })
  }

  // 验证当前密码
  static async verifyPassword(password: string): Promise<ResType<{ valid: boolean }>> {
    return ApiService.post<{ valid: boolean }>('/user/security/verify-password', {
      password
    })
  }

  // 获取登录设备列表
  static async getLoginDevices(): Promise<ResType<LoginDevice[]>> {
    return ApiService.get<LoginDevice[]>('/user/security/devices')
  }

  // 移除登录设备
  static async removeDevice(deviceId: string): Promise<ResType<{ success: boolean }>> {
    return ApiService.delete<{ success: boolean }>(`/user/security/devices/${deviceId}`, {
      showLoading: true,
      loadingText: '移除中...'
    })
  }

  // 设置双重验证
  static async setupTwoFactor(): Promise<ResType<{
    qrCode: string
    secret: string
    backupCodes: string[]
  }>> {
    return ApiService.post<{
      qrCode: string
      secret: string
      backupCodes: string[]
    }>('/user/security/2fa/setup')
  }

  // 验证双重验证码
  static async verifyTwoFactorCode(code: string): Promise<ResType<{ valid: boolean }>> {
    return ApiService.post<{ valid: boolean }>('/user/security/2fa/verify', {
      code
    })
  }

  // 禁用双重验证
  static async disableTwoFactor(password: string): Promise<ResType<{ success: boolean }>> {
    return ApiService.post<{ success: boolean }>('/user/security/2fa/disable', {
      password
    }, {
      showLoading: true,
      loadingText: '禁用中...'
    })
  }

  // 获取安全日志
  static async getSecurityLogs(params?: {
    page?: number
    pageSize?: number
    type?: string
  }): Promise<ResType<{
    list: Array<{
      id: string
      type: string
      description: string
      ip: string
      userAgent: string
      createdAt: string
    }>
    total: number
  }>> {
    return ApiService.get('/user/security/logs', params)
  }
}

export default SecurityService