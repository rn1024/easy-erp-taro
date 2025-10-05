/**
 * APIs
 */
import { ApiService } from './api'

/**
 * Types
 */
import type { ResType } from './types'

export type CaptchaResult = {
  captcha: string
  key: string
}

export type LoginData = {
  captcha: string
  key: string
  password: string
  username: string
}

export type Role = {
  id: string
  name: string
  permissions: string[]
  status: number
}

export type User = {
  id: string
  name: string
  operator: string
  status: number
  created_at: string
  updated_at: string
}

export type LoginResult = {
  permissions: string[]
  roles: Role[]
  token: string
  refreshToken: string
  user: User
}

export const captcha = (): Promise<ResType<CaptchaResult>> => {
  return ApiService.get<CaptchaResult>('/auth/verifycode')
}

export const login = (data: LoginData): Promise<ResType<LoginResult>> => {
  return ApiService.post<LoginResult>('/auth/login', data)
}

export const logout = (): Promise<ResType<Omit<LoginResult, 'token' | 'user'> & User>> => {
  return ApiService.post<Omit<LoginResult, 'token' | 'user'> & User>('/auth/logout')
}

export const me = (): Promise<ResType<Omit<LoginResult, 'token' | 'user'> & User>> => {
  return ApiService.get<Omit<LoginResult, 'token' | 'user'> & User>('/me')
}
