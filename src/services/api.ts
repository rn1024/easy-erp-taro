import Taro from '@tarojs/taro'
import type { ApiResponse, PaginatedResponse } from '@/types'

// 请求配置接口
interface RequestOptions {
  url: string
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
  data?: unknown
  header?: Record<string, string>
  showLoading?: boolean
  loadingText?: string
}

// API错误类
export class ApiError extends Error {
  public code: number
  public data?: unknown

  constructor(message: string, code: number, data?: unknown) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.data = data
  }
}

// 获取token
function getToken(): string | null {
  try {
    return Taro.getStorageSync('token')
  } catch {
    return null
  }
}

// 显示错误提示
function showError(message: string) {
  Taro.showToast({
    title: message,
    icon: 'error',
    duration: 2000
  })
}

// 显示加载
function showLoading(title = '加载中...') {
  Taro.showLoading({
    title,
    mask: true
  })
}

// 隐藏加载
function hideLoading() {
  Taro.hideLoading()
}

// API服务类
export class ApiService {
  private static baseURL = process.env.API_BASE_URL || '/api/v1'

  // 基础请求方法
  static async request<T = unknown>(options: RequestOptions): Promise<ApiResponse<T>> {
    const {
      url,
      method = 'GET',
      data,
      header = {},
      showLoading: shouldShowLoading = false,
      loadingText = '加载中...'
    } = options

    // 显示加载状态
    if (shouldShowLoading) {
      showLoading(loadingText)
    }

    try {
      // 准备请求头
      const requestHeader = {
        'Content-Type': 'application/json',
        ...header
      }

      // 添加认证头
      const token = getToken()
      if (token) {
        requestHeader['Authorization'] = `Bearer ${token}`
      }

      // 发起请求
      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header: requestHeader,
        timeout: 10000 // 10秒超时
      })

      // 隐藏加载状态
      if (shouldShowLoading) {
        hideLoading()
      }

      return this.handleResponse(response) as ApiResponse<T>
    } catch (error) {
      // 隐藏加载状态
      if (shouldShowLoading) {
        hideLoading()
      }

      throw this.handleError(error)
    }
  }

  // 处理响应 - 适配easy-erp-web格式
  private static handleResponse(response: Taro.request.SuccessCallbackResult): ApiResponse<unknown> {
    const { statusCode, data } = response

    // HTTP状态码检查
    if (statusCode < 200 || statusCode >= 300) {
      throw new ApiError(
        `HTTP错误: ${statusCode}`,
        statusCode,
        data
      )
    }

    // 业务逻辑检查
    if (data && typeof data === 'object') {
      // 如果返回的是easy-erp-web标准API响应格式 {code, msg, data}
      if ('code' in data && 'msg' in data) {
        if (data.code !== 0) {
          throw new ApiError(
            data.msg || '请求失败',
            data.code || -1,
            data
          )
        }
        return data
      }
      
      // 如果返回的是直接数据，包装成标准格式
      return {
        code: 0,
        msg: '请求成功',
        data
      }
    }

    // 其他情况，包装成标准格式
    return {
      code: 0,
      msg: '请求成功',
      data
    }
  }

  // 处理错误
  private static handleError(error: unknown): ApiError {
    // API请求错误: error

    // 网络错误
    if (error && typeof error === 'object' && 'errMsg' in error) {
      if (typeof error.errMsg === 'string' && error.errMsg.includes('timeout')) {
        const apiError = new ApiError('请求超时，请检查网络连接', -1001)
        showError(apiError.message)
        return apiError
      }
      
      if (typeof error.errMsg === 'string' && error.errMsg.includes('fail')) {
        const apiError = new ApiError('网络连接失败，请检查网络', -1002)
        showError(apiError.message)
        return apiError
      }
    }

    // 已知的API错误
    if (error instanceof ApiError) {
      showError(error.message)
      return error
    }

    // 未知错误
    const apiError = new ApiError('请求失败，请稍后重试', -1000, error)
    showError(apiError.message)
    return apiError
  }

  // GET请求
  static get<T = unknown>(url: string, params?: Record<string, unknown>, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    let requestUrl = url
    if (params) {
      const queryString = Object.keys(params)
        .filter(key => params[key] !== undefined && params[key] !== null)
        .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(String(params[key]))}`)
        .join('&')
      
      requestUrl = `${url}${url.includes('?') ? '&' : '?'}${queryString}`
    }

    return this.request<T>({
      url: requestUrl,
      method: 'GET',
      ...options
    })
  }

  // POST请求
  static post<T = unknown>(url: string, data?: unknown, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'POST',
      data,
      ...options
    })
  }

  // PUT请求
  static put<T = unknown>(url: string, data?: unknown, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'PUT',
      data,
      ...options
    })
  }

  // DELETE请求
  static delete<T = unknown>(url: string, options?: Partial<RequestOptions>): Promise<ApiResponse<T>> {
    return this.request<T>({
      url,
      method: 'DELETE',
      ...options
    })
  }

  // 上传文件
  static async uploadFile(filePath: string, url: string, name = 'file', formData?: Record<string, unknown>): Promise<ApiResponse<unknown>> {
    const token = getToken()
    
    try {
      showLoading('上传中...')
      
      const response = await Taro.uploadFile({
        url: `${this.baseURL}${url}`,
        filePath,
        name,
        formData,
        header: token ? { 'Authorization': `Bearer ${token}` } : {}
      })

      hideLoading()

      const mockResponse: Taro.request.SuccessCallbackResult = {
        statusCode: response.statusCode,
        data: JSON.parse(response.data),
        header: {},
        errMsg: 'uploadFile:ok'
      }
      return this.handleResponse(mockResponse)
    } catch (error) {
      hideLoading()
      throw this.handleError(error)
    }
  }

  // 下载文件
  static async downloadFile(url: string, filePath?: string): Promise<string> {
    try {
      showLoading('下载中...')
      
      const response = await Taro.downloadFile({
        url: `${this.baseURL}${url}`,
        filePath,
        header: getToken() ? { 'Authorization': `Bearer ${getToken()}` } : {}
      })

      hideLoading()

      if (response.statusCode === 200) {
        return response.tempFilePath
      } else {
        throw new ApiError('下载失败', response.statusCode)
      }
    } catch (error) {
      hideLoading()
      throw this.handleError(error)
    }
  }
}

// 导出类型
export type { RequestOptions, ApiResponse, PaginatedResponse }