# Easy ERP Taro API 接口文档

**API版本**: v1.0  
**文档版本**: v1.0  
**更新时间**: 2025年1月3日  
**基础URL**: `https://api.easy-erp.com/v1`  

## 📋 接口概览

### 接口分类
- **认证接口**: 用户登录、登出、权限验证
- **库存接口**: 成品库存、散件库存管理
- **产品接口**: 产品查询、SKU搜索
- **任务接口**: 包装任务、发货任务管理
- **基础数据接口**: 店铺、分类等基础数据

### 通用规范

#### 请求格式
```http
POST /api/v1/endpoint
Content-Type: application/json
Authorization: Bearer <token>

{
  "param1": "value1",
  "param2": "value2"
}
```

#### 响应格式
```json
{
  "code": 0,
  "msg": "success",
  "data": {
    // 响应数据
  }
}
```

#### 状态码说明
- `0`: 成功
- `1`: 通用错误
- `401`: 未授权
- `403`: 权限不足
- `404`: 资源不存在
- `500`: 服务器错误

## 🔐 认证接口

### 用户登录
**接口地址**: `POST /auth/login`

**请求参数**:
```typescript
interface LoginRequest {
  username: string    // 用户名
  password: string    // 密码
}
```

**响应数据**:
```typescript
interface LoginResponse {
  token: string           // 访问令牌
  refreshToken: string    // 刷新令牌
  user: {
    id: string
    name: string
    username: string
  }
  roles: Array<{
    id: string
    name: string
  }>
  permissions: string[]   // 权限列表
}
```

**请求示例**:
```javascript
const response = await AuthAPI.login('admin', 'password123')
```

**响应示例**:
```json
{
  "code": 0,
  "msg": "登录成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "refresh_token_here",
    "user": {
      "id": "1",
      "name": "管理员",
      "username": "admin"
    },
    "roles": [
      {
        "id": "1",
        "name": "管理员"
      }
    ],
    "permissions": [
      "inventory:read",
      "inventory:write",
      "task:manage"
    ]
  }
}
```

### 刷新令牌
**接口地址**: `POST /auth/refresh`

**请求参数**:
```typescript
interface RefreshTokenRequest {
  refreshToken: string
}
```

### 用户登出
**接口地址**: `POST /auth/logout`

**请求头**: `Authorization: Bearer <token>`

## 📦 库存管理接口

### 获取成品库存列表
**接口地址**: `GET /inventory/finished`

**请求参数**:
```typescript
interface FinishedInventoryQuery {
  page?: number           // 页码，默认1
  pageSize?: number       // 每页大小，默认20
  shop?: string          // 店铺筛选
  category?: string      // 分类筛选
  location?: string      // 货位筛选
  keyword?: string       // 关键词搜索
}
```

**响应数据**:
```typescript
interface FinishedInventoryResponse {
  list: FinishedInventory[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

interface FinishedInventory {
  id: string
  productName: string     // 产品名称
  shop: string           // 店铺
  category: string       // 分类
  outerBoxSize: string   // 外箱尺寸
  packingQuantity: number // 装箱数量
  weight: number         // 重量
  location: string       // 货位
  quantity: number       // 库存数量
  createdAt: string      // 创建时间
  updatedAt: string      // 更新时间
}
```

**请求示例**:
```javascript
const response = await InventoryAPI.getFinishedInventory({
  page: 1,
  pageSize: 20,
  shop: '淘宝店铺',
  category: '电子产品'
})
```

### 新增成品库存
**接口地址**: `POST /inventory/finished`

**请求参数**:
```typescript
interface CreateFinishedInventoryRequest {
  productName: string
  shop: string
  category: string
  outerBoxSize: string
  packingQuantity: number
  weight: number
  location: string
  quantity: number
  remark?: string
}
```

### 更新成品库存
**接口地址**: `PUT /inventory/finished/:id`

### 删除成品库存
**接口地址**: `DELETE /inventory/finished/:id`

### 获取散件库存列表
**接口地址**: `GET /inventory/spare`

**请求参数**:
```typescript
interface SpareInventoryQuery {
  page?: number
  pageSize?: number
  shop?: string
  category?: string
  spareType?: '套' | '个'
  keyword?: string
}
```

**响应数据**:
```typescript
interface SpareInventory {
  id: string
  productName: string
  shop: string
  category: string
  spareType: '套' | '个'    // 散件类型
  quantity: number
  location: string
  createdAt: string
  updatedAt: string
}
```

## 🔍 产品查询接口

### 获取产品列表
**接口地址**: `GET /products`

**请求参数**:
```typescript
interface ProductQuery {
  page?: number
  pageSize?: number
  shop?: string
  category?: string
  keyword?: string
}
```

**响应数据**:
```typescript
interface Product {
  id: string
  name: string           // 产品名称
  shop: string          // 店铺
  category: string      // 分类
  info?: string         // 产品信息
  packaging?: string    // 包装信息
  outerBox?: string     // 外箱信息
  accessories?: string  // 配件信息
  remark?: string       // 备注
  sku?: string          // SKU编码
  createdAt: string
  updatedAt: string
}
```

### 根据ID获取产品详情
**接口地址**: `GET /products/:id`

### 根据SKU搜索产品
**接口地址**: `GET /products/search/sku`

**请求参数**:
```typescript
interface SkuSearchQuery {
  sku: string           // SKU编码
  limit?: number        // 返回数量限制，默认10
}
```

**请求示例**:
```javascript
const response = await searchProductsBySku('ABC123')
```

## 📋 任务管理接口

### 获取包装任务列表
**接口地址**: `GET /tasks/package`

**请求参数**:
```typescript
interface PackageTaskQuery {
  page?: number
  pageSize?: number
  status?: PackageStatus
  assignee?: string
  dateRange?: {
    start: string
    end: string
  }
}

type PackageStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
```

**响应数据**:
```typescript
interface PackageTask {
  id: string
  title: string
  description: string
  status: PackageStatus
  assignee: {
    id: string
    name: string
  }
  products: Array<{
    id: string
    name: string
    quantity: number
  }>
  dueDate: string
  createdAt: string
  updatedAt: string
  progress: number      // 进度百分比
}
```

### 更新包装任务状态
**接口地址**: `PUT /tasks/package/:id/status`

**请求参数**:
```typescript
interface UpdateTaskStatusRequest {
  status: PackageStatus
  remark?: string
}
```

### 获取发货任务列表
**接口地址**: `GET /tasks/shipment`

**请求参数**:
```typescript
interface ShipmentTaskQuery {
  page?: number
  pageSize?: number
  status?: ShipmentStatus
  trackingNumber?: string
  dateRange?: {
    start: string
    end: string
  }
}

type ShipmentStatus = 'pending' | 'picked' | 'packed' | 'shipped' | 'delivered'
```

**响应数据**:
```typescript
interface ShipmentTask {
  id: string
  orderNumber: string
  trackingNumber?: string
  status: ShipmentStatus
  recipient: {
    name: string
    address: string
    phone: string
  }
  products: Array<{
    id: string
    name: string
    quantity: number
    sku: string
  }>
  shippingMethod: string
  estimatedDelivery?: string
  createdAt: string
  updatedAt: string
}
```

### 批量更新任务状态
**接口地址**: `PUT /tasks/batch-update`

**请求参数**:
```typescript
interface BatchUpdateTasksRequest {
  taskIds: string[]
  status: PackageStatus | ShipmentStatus
  remark?: string
}
```

## 🏪 基础数据接口

### 获取店铺列表
**接口地址**: `GET /basic/shops`

**响应数据**:
```typescript
interface Shop {
  id: string
  name: string
  platform: string     // 平台：淘宝、京东等
  status: 'active' | 'inactive'
}
```

### 获取产品分类列表
**接口地址**: `GET /basic/categories`

**响应数据**:
```typescript
interface ProductCategory {
  id: string
  name: string
  parentId?: string
  level: number
  children?: ProductCategory[]
}
```

### 获取货位列表
**接口地址**: `GET /basic/locations`

**响应数据**:
```typescript
interface Location {
  id: string
  code: string          // 货位编码
  name: string          // 货位名称
  warehouse: string     // 所属仓库
  zone: string          // 区域
  capacity: number      // 容量
  occupied: number      // 已占用
}
```

## 🔧 API服务层实现

### 基础API服务类
```typescript
class ApiService {
  private baseURL: string
  private timeout: number
  private headers: Record<string, string>

  constructor(config: ApiConfig) {
    this.baseURL = config.baseURL
    this.timeout = config.timeout || 10000
    this.headers = config.headers || {}
  }

  // 通用请求方法
  async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    const { url, method = 'GET', data, params, headers } = options
    
    try {
      const response = await Taro.request({
        url: `${this.baseURL}${url}`,
        method,
        data,
        header: {
          ...this.headers,
          ...headers,
          'Authorization': this.getAuthToken()
        },
        timeout: this.timeout
      })

      return this.handleResponse<T>(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }

  // 响应处理
  private handleResponse<T>(response: any): ApiResponse<T> {
    const { statusCode, data } = response
    
    if (statusCode >= 200 && statusCode < 300) {
      // 适配easy-erp-web响应格式
      if (data && typeof data === 'object' && 'code' in data) {
        return data as ApiResponse<T>
      }
      
      // 标准化响应格式
      return {
        code: 0,
        msg: 'success',
        data: data as T
      }
    }
    
    throw new ApiError(statusCode, data?.msg || '请求失败', data)
  }

  // 错误处理
  private handleError(error: any): ApiError {
    if (error instanceof ApiError) {
      return error
    }
    
    return new ApiError(
      error.statusCode || 500,
      error.errMsg || '网络请求失败',
      error
    )
  }

  // 获取认证令牌
  private getAuthToken(): string {
    const token = Taro.getStorageSync('token')
    return token ? `Bearer ${token}` : ''
  }

  // 便捷方法
  get<T>(url: string, params?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'GET', params })
  }

  post<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'POST', data })
  }

  put<T>(url: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'PUT', data })
  }

  delete<T>(url: string): Promise<ApiResponse<T>> {
    return this.request<T>({ url, method: 'DELETE' })
  }
}
```

### 错误类定义
```typescript
class ApiError extends Error {
  public code: number
  public response?: any

  constructor(code: number, message: string, response?: any) {
    super(message)
    this.name = 'ApiError'
    this.code = code
    this.response = response
  }

  // 判断是否为网络错误
  isNetworkError(): boolean {
    return this.code >= 500 || this.code === 0
  }

  // 判断是否为认证错误
  isAuthError(): boolean {
    return this.code === 401 || this.code === 403
  }

  // 判断是否为客户端错误
  isClientError(): boolean {
    return this.code >= 400 && this.code < 500
  }
}
```

## 🧪 接口测试

### 测试用例示例
```typescript
describe('AuthAPI', () => {
  test('should login successfully', async () => {
    const mockResponse = {
      code: 0,
      msg: '登录成功',
      data: {
        token: 'mock_token',
        user: { id: '1', name: '测试用户' }
      }
    }

    // Mock API响应
    jest.spyOn(AuthAPI, 'login').mockResolvedValue(mockResponse)

    const result = await AuthAPI.login('testuser', 'password')
    
    expect(result.code).toBe(0)
    expect(result.data.token).toBe('mock_token')
  })

  test('should handle login error', async () => {
    const mockError = new ApiError(401, '用户名或密码错误')
    
    jest.spyOn(AuthAPI, 'login').mockRejectedValue(mockError)

    await expect(AuthAPI.login('wrong', 'password')).rejects.toThrow('用户名或密码错误')
  })
})
```

### Postman集合
```json
{
  "info": {
    "name": "Easy ERP API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Authentication",
      "item": [
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"username\": \"admin\",\n  \"password\": \"password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["auth", "login"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "https://api.easy-erp.com/v1"
    }
  ]
}
```

## 📊 接口监控

### 性能指标
- **响应时间**: < 500ms (95%分位)
- **可用性**: > 99.9%
- **错误率**: < 0.1%
- **并发支持**: 1000 QPS

### 监控告警
- 响应时间超过1秒
- 错误率超过1%
- 可用性低于99%
- 服务器资源使用率超过80%

## 🔄 版本管理

### API版本策略
- **URL版本控制**: `/v1/`, `/v2/`
- **向后兼容**: 保持旧版本API可用
- **废弃通知**: 提前3个月通知API废弃
- **文档同步**: 版本文档同步更新

### 变更日志
- **v1.0.0** (2025-01-03): 初始版本发布
- **v1.0.1** (计划): 新增批量操作接口
- **v1.1.0** (计划): 新增统计分析接口

---

**文档维护**: 本文档随API版本更新持续维护  
**技术支持**: api-support@easy-erp.com  
**最后更新**: 2025年1月3日