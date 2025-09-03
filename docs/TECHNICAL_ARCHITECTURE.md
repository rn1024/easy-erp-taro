# Easy ERP Taro 技术架构文档

**文档版本**: v1.0  
**创建时间**: 2025年1月3日  
**技术栈**: Taro 4.1.2 + React 18 + TypeScript + NutUI  

## 🏗️ 整体架构设计

### 架构原则
- **组件化**: 高度组件化的UI架构，提高代码复用性
- **模块化**: 清晰的模块划分，降低耦合度
- **类型安全**: 全面的TypeScript类型定义
- **响应式**: 移动优先的响应式设计
- **可扩展**: 易于扩展的架构设计

### 技术选型理由

#### 前端框架: Taro 4.1.2
- **跨平台支持**: 一套代码多端运行
- **React语法**: 熟悉的React开发体验
- **生态丰富**: 完善的插件和工具链
- **性能优化**: 编译时优化，运行时性能好

#### UI组件库: NutUI React Taro 3.0.16
- **移动端优化**: 专为移动端设计的组件
- **Taro适配**: 完美适配Taro框架
- **主题定制**: 支持主题定制和样式覆盖
- **组件丰富**: 覆盖常用业务场景

#### 状态管理: Zustand 4.5.7
- **轻量级**: 相比Redux更轻量
- **TypeScript友好**: 原生TypeScript支持
- **简单易用**: API简洁，学习成本低
- **持久化**: 内置持久化支持

## 📁 项目架构层次

```
┌─────────────────────────────────────┐
│              Presentation Layer      │  表现层
│  ┌─────────────┐  ┌─────────────┐   │
│  │   Pages     │  │ Components  │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│              Business Layer         │  业务层
│  ┌─────────────┐  ┌─────────────┐   │
│  │   Stores    │  │  Services   │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│              Data Layer             │  数据层
│  ┌─────────────┐  ┌─────────────┐   │
│  │     API     │  │   Storage   │   │
│  └─────────────┘  └─────────────┘   │
├─────────────────────────────────────┤
│              Infrastructure Layer   │  基础设施层
│  ┌─────────────┐  ┌─────────────┐   │
│  │    Utils    │  │   Config    │   │
│  └─────────────┘  └─────────────┘   │
└─────────────────────────────────────┘
```

## 🎯 核心模块设计

### 1. 表现层 (Presentation Layer)

#### Pages 页面组件
```typescript
// 页面组件结构
interface PageComponent {
  // 页面配置
  config: PageConfig
  // 页面样式
  styles: SCSS
  // 页面逻辑
  component: React.FC
}

// 页面目录结构
pages/
├── index/              # 首页
├── login/              # 登录页
├── query/              # 查询功能
│   ├── scan/          # 扫码查询
│   └── sku/           # SKU搜索
├── inventory/          # 库存管理
│   ├── finished/      # 成品库存
│   └── spare/         # 散件库存
├── warehouse/          # 任务管理
│   ├── package/       # 包装任务
│   └── shipment/      # 发货任务
├── products/           # 产品管理
└── profile/            # 个人中心
```

#### Components 组件库
```typescript
// 组件分类
components/
├── common/             # 通用组件
│   ├── Card/          # 卡片组件
│   ├── DataTable/     # 数据表格
│   ├── EmptyState/    # 空状态
│   ├── FormItem/      # 表单项
│   ├── SearchBar/     # 搜索栏
│   └── StatusTag/     # 状态标签
├── business/           # 业务组件
│   ├── AuthGuard/     # 权限守卫
│   ├── FormModal/     # 表单弹窗
│   ├── InventoryCard/ # 库存卡片
│   ├── MobileLayout/  # 移动端布局
│   ├── TaskCard/      # 任务卡片
│   └── TopNavigation/ # 顶部导航
└── layout/             # 布局组件
    ├── PageContainer/ # 页面容器
    ├── TabLayout/     # Tab布局
    └── ListLayout/    # 列表布局
```

### 2. 业务层 (Business Layer)

#### Stores 状态管理
```typescript
// 状态管理架构
stores/
├── userStore.ts        # 用户状态
├── inventoryStore.ts   # 库存状态
├── taskStore.ts        # 任务状态
├── productStore.ts     # 产品状态
└── appStore.ts         # 应用状态

// 状态管理模式
interface StorePattern<T> {
  // 状态数据
  state: T
  // 同步操作
  actions: SyncActions<T>
  // 异步操作
  asyncActions: AsyncActions<T>
  // 计算属性
  computed: ComputedValues<T>
}
```

#### Services 服务层
```typescript
// 服务层架构
services/
├── api.ts              # 基础API服务
├── auth.ts             # 认证服务
├── inventory.ts        # 库存服务
├── products.ts         # 产品服务
├── tasks.ts            # 任务服务
├── basic.ts            # 基础数据服务
└── index.ts            # 服务统一导出

// API服务模式
class APIService {
  // 请求拦截器
  requestInterceptor()
  // 响应拦截器
  responseInterceptor()
  // 错误处理
  errorHandler()
  // 请求方法
  request<T>(options: RequestOptions): Promise<ApiResponse<T>>
}
```

### 3. 数据层 (Data Layer)

#### API 接口层
```typescript
// API接口设计
interface APILayer {
  // 基础配置
  baseURL: string
  timeout: number
  headers: Record<string, string>
  
  // 请求方法
  get<T>(url: string, params?: any): Promise<ApiResponse<T>>
  post<T>(url: string, data?: any): Promise<ApiResponse<T>>
  put<T>(url: string, data?: any): Promise<ApiResponse<T>>
  delete<T>(url: string): Promise<ApiResponse<T>>
  
  // 拦截器
  interceptors: {
    request: RequestInterceptor[]
    response: ResponseInterceptor[]
  }
}
```

#### Storage 存储层
```typescript
// 存储层设计
interface StorageLayer {
  // 同步存储
  setSync(key: string, value: any): void
  getSync(key: string): any
  removeSync(key: string): void
  
  // 异步存储
  set(key: string, value: any): Promise<void>
  get(key: string): Promise<any>
  remove(key: string): Promise<void>
  
  // 清理存储
  clear(): Promise<void>
}
```

### 4. 基础设施层 (Infrastructure Layer)

#### Utils 工具函数
```typescript
// 工具函数分类
utils/
├── format.ts           # 格式化工具
├── validate.ts         # 验证工具
├── storage.ts          # 存储工具
├── request.ts          # 请求工具
├── date.ts             # 日期工具
├── string.ts           # 字符串工具
└── index.ts            # 工具统一导出
```

#### Config 配置管理
```typescript
// 配置管理
config/
├── index.js            # 主配置
├── dev.js              # 开发环境
├── prod.js             # 生产环境
└── constants.ts        # 常量定义
```

## 🔄 数据流设计

### 单向数据流
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    View     │───▶│   Action    │───▶│    Store    │
│   (Pages)   │    │ (Services)  │    │  (Zustand)  │
└─────────────┘    └─────────────┘    └─────────────┘
       ▲                                      │
       │                                      │
       └──────────────────────────────────────┘
                    State Update
```

### 数据流程
1. **用户交互**: 用户在页面进行操作
2. **触发Action**: 页面调用Service层方法
3. **API请求**: Service层发起API请求
4. **更新Store**: 请求成功后更新Zustand状态
5. **UI更新**: 状态变化触发页面重新渲染

## 🎨 组件设计模式

### 1. 容器组件 vs 展示组件
```typescript
// 容器组件 - 负责数据和逻辑
const InventoryContainer: React.FC = () => {
  const { inventoryList, loading, fetchInventory } = useInventoryStore()
  
  useEffect(() => {
    fetchInventory()
  }, [])
  
  return (
    <InventoryList 
      data={inventoryList}
      loading={loading}
      onRefresh={fetchInventory}
    />
  )
}

// 展示组件 - 负责UI渲染
interface InventoryListProps {
  data: Inventory[]
  loading: boolean
  onRefresh: () => void
}

const InventoryList: React.FC<InventoryListProps> = ({
  data,
  loading,
  onRefresh
}) => {
  return (
    <div className="inventory-list">
      {/* UI渲染逻辑 */}
    </div>
  )
}
```

### 2. 高阶组件 (HOC)
```typescript
// 权限控制HOC
function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  requiredPermissions: Permission[]
) {
  return (props: P) => {
    const { hasPermission } = useUserStore()
    
    if (!requiredPermissions.every(permission => hasPermission(permission))) {
      return <UnauthorizedPage />
    }
    
    return <Component {...props} />
  }
}

// 使用示例
const ProtectedInventoryPage = withAuth(InventoryPage, [Permission.INVENTORY_READ])
```

### 3. 自定义Hooks
```typescript
// 数据获取Hook
function useAsyncData<T>(
  fetchFn: () => Promise<T>,
  deps: any[] = []
) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      const result = await fetchFn()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err.message : '请求失败')
    } finally {
      setLoading(false)
    }
  }, deps)
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  return { data, loading, error, refetch: fetchData }
}
```

## 🔐 安全架构

### 1. 认证授权
```typescript
// JWT Token管理
interface AuthManager {
  // 登录
  login(credentials: LoginForm): Promise<AuthResult>
  // 登出
  logout(): void
  // 刷新Token
  refreshToken(): Promise<string>
  // 检查Token有效性
  isTokenValid(): boolean
  // 获取用户信息
  getUserInfo(): AuthUser | null
}
```

### 2. 权限控制
```typescript
// 权限枚举
enum Permission {
  // 库存权限
  INVENTORY_READ = 'inventory:read',
  INVENTORY_WRITE = 'inventory:write',
  INVENTORY_DELETE = 'inventory:delete',
  
  // 任务权限
  TASK_READ = 'task:read',
  TASK_WRITE = 'task:write',
  TASK_MANAGE = 'task:manage',
  
  // 产品权限
  PRODUCT_READ = 'product:read',
  PRODUCT_WRITE = 'product:write',
  
  // 管理员权限
  ADMIN_ALL = 'admin:all'
}

// 权限检查
interface PermissionChecker {
  hasPermission(permission: Permission): boolean
  hasAnyPermission(permissions: Permission[]): boolean
  hasAllPermissions(permissions: Permission[]): boolean
  checkRole(role: UserRole): boolean
}
```

### 3. 数据安全
```typescript
// 敏感数据处理
interface DataSecurity {
  // 数据加密
  encrypt(data: string): string
  // 数据解密
  decrypt(encryptedData: string): string
  // 数据脱敏
  maskSensitiveData(data: any): any
  // 输入验证
  validateInput(input: any, rules: ValidationRules): ValidationResult
}
```

## 📱 移动端适配策略

### 1. 响应式设计
```scss
// 断点定义
$breakpoints: (
  'mobile-small': 320px,
  'mobile': 375px,
  'mobile-large': 414px,
  'tablet': 768px,
  'desktop': 1024px
);

// 响应式混入
@mixin respond-to($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}
```

### 2. 触摸优化
```scss
// 触摸目标优化
.touch-target {
  min-height: 44px;
  min-width: 44px;
  
  // 触摸反馈
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
  
  // 触摸高亮
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0.1);
}
```

### 3. 性能优化
```typescript
// 长列表虚拟滚动
const VirtualList: React.FC<VirtualListProps> = ({
  items,
  itemHeight,
  containerHeight
}) => {
  const [startIndex, setStartIndex] = useState(0)
  const [endIndex, setEndIndex] = useState(0)
  
  // 计算可见区域
  const visibleItems = useMemo(() => {
    return items.slice(startIndex, endIndex + 1)
  }, [items, startIndex, endIndex])
  
  return (
    <div className="virtual-list">
      {visibleItems.map((item, index) => (
        <div key={startIndex + index} style={{ height: itemHeight }}>
          {renderItem(item)}
        </div>
      ))}
    </div>
  )
}
```

## 🚀 性能优化策略

### 1. 代码分割
```typescript
// 路由级别代码分割
const InventoryPage = lazy(() => import('@/pages/inventory'))
const ProductsPage = lazy(() => import('@/pages/products'))
const TasksPage = lazy(() => import('@/pages/warehouse'))

// 组件级别代码分割
const HeavyComponent = lazy(() => import('@/components/HeavyComponent'))
```

### 2. 缓存策略
```typescript
// API响应缓存
interface CacheManager {
  // 设置缓存
  set(key: string, data: any, ttl?: number): void
  // 获取缓存
  get(key: string): any | null
  // 删除缓存
  delete(key: string): void
  // 清空缓存
  clear(): void
}
```

### 3. 图片优化
```typescript
// 图片懒加载
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    
    if (imgRef.current) {
      observer.observe(imgRef.current)
    }
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      alt={alt}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
```

## 🔧 构建优化

### 1. Webpack配置优化
```javascript
// webpack优化配置
module.exports = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          enforce: true
        }
      }
    }
  }
}
```

### 2. 资源优化
```javascript
// 资源压缩配置
const config = {
  mini: {
    imageUrlLoaderOption: {
      limit: 8192,
      name: 'static/images/[name].[hash:8].[ext]'
    },
    miniCssExtractPluginOption: {
      filename: 'static/css/[name].[hash:8].css',
      chunkFilename: 'static/css/[name].[hash:8].css'
    }
  }
}
```

## 📊 监控和调试

### 1. 错误监控
```typescript
// 全局错误处理
class ErrorMonitor {
  // 捕获JavaScript错误
  captureException(error: Error, context?: any): void
  
  // 捕获Promise拒绝
  captureUnhandledRejection(reason: any): void
  
  // 捕获网络错误
  captureNetworkError(error: NetworkError): void
  
  // 性能监控
  capturePerformance(metrics: PerformanceMetrics): void
}
```

### 2. 调试工具
```typescript
// 开发环境调试
if (process.env.NODE_ENV === 'development') {
  // React DevTools
  // Redux DevTools
  // 性能监控
  // 网络请求日志
}
```

## 🔄 版本管理和部署

### 1. Git工作流
```
main (生产环境)
├── develop (开发环境)
│   ├── feature/user-auth
│   ├── feature/inventory-management
│   └── feature/task-management
├── release/v1.0.0 (发布分支)
└── hotfix/critical-bug (热修复)
```

### 2. CI/CD流程
```yaml
# GitHub Actions 示例
name: Build and Deploy
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Install dependencies
        run: pnpm install
      - name: Run tests
        run: pnpm test
      - name: Run lint
        run: pnpm lint
  
  build:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build application
        run: pnpm build:weapp
      - name: Deploy to staging
        if: github.ref == 'refs/heads/develop'
        run: echo "Deploy to staging"
      - name: Deploy to production
        if: github.ref == 'refs/heads/main'
        run: echo "Deploy to production"
```

---

**文档维护**: 本文档随技术架构演进持续更新  
**最后更新**: 2025年1月3日  
**维护团队**: 技术架构组