# Taro + NutUI 管理后台小程序 - 项目开发指南

## 📋 文档导航

| 文档类型 | 文件名 | 描述 |
|---------|--------|------|
| 项目规划 | [ADMIN_MINIAPP_PROJECT_PLAN.md](./ADMIN_MINIAPP_PROJECT_PLAN.md) | 技术架构和开发规划 |
| 功能说明书 | [ADMIN_MINIAPP_PRD.md](./ADMIN_MINIAPP_PRD.md) | 完整的产品需求文档(PRD) |
| 开发任务 | [DEVELOPMENT_TASKS.md](./DEVELOPMENT_TASKS.md) | 详细的开发任务清单和时间规划 |
| 开发规范 | 本文档 | 开发规范和最佳实践总结 |

---

## 🏗️ 项目架构总览

### 技术栈
```
Taro 4.1.2 + React 18 + TypeScript + NutUI + SCSS + Zustand
```

### 目录结构规范
```
src/
├── components/           # 共用组件 (扁平化存放)
├── pages/               # 页面模块 (按功能分组)
├── stores/              # Zustand状态管理
├── services/            # API服务封装
├── types/               # TypeScript类型定义
├── utils/               # 工具函数
└── constants/           # 常量配置
```

### 核心约束
1. **图标系统**: 只能使用 `taro-icons` 的 `MaterialIcons`
2. **组件架构**: 扁平化，所有组件直接放在 `@/components/` 根目录
3. **页面原则**: 页面不嵌套复杂组件，保持职责分离
4. **构建目标**: 微信小程序为主，包大小限制2MB+20MB

---

## 🎨 设计规范

### 颜色系统
```scss
// 主要颜色
$primary-bg: #f5f5f7;        // 微信小程序标准背景色
$card-bg: #ffffff;           // 卡片背景色
$primary-text: #1a1a1a;      // 主要文字色
$secondary-text: #6b7280;    // 次要文字色
$border-color: #e5e7eb;      // 边框色

// 状态颜色
$success-color: #10b981;     // 成功状态
$warning-color: #f59e0b;     // 警告状态
$error-color: #ef4444;       // 错误状态
$info-color: #3b82f6;        // 信息状态
```

### 间距系统
```scss
// rpx单位 (微信小程序相对像素)
$spacing-xs: 8rpx;           // 极小间距
$spacing-sm: 16rpx;          // 小间距
$spacing-md: 24rpx;          // 中等间距
$spacing-lg: 32rpx;          // 大间距
$spacing-xl: 48rpx;          // 超大间距

// 触摸目标最小尺寸
$min-touch-target: 48rpx;    // 最小触摸目标
```

### 字体规范
```scss
// 字体大小
$font-size-xs: 20rpx;        // 极小字体
$font-size-sm: 24rpx;        // 小字体
$font-size-base: 28rpx;      // 基础字体
$font-size-lg: 32rpx;        // 大字体
$font-size-xl: 36rpx;        // 超大字体

// 字体权重
$font-weight-normal: 400;    // 正常
$font-weight-medium: 500;    // 中等
$font-weight-semibold: 600;  // 半粗体
```

---

## 💻 编码规范

### 组件开发规范

#### 1. 组件命名
```typescript
// 组件文件夹：PascalCase
components/
  DataTable/
  FormModal/
  ScannerCard/

// 组件文件名：固定使用 index.tsx 和 index.scss
DataTable/
  index.tsx      // 组件逻辑
  index.scss     // 组件样式
```

#### 2. 组件代码模板
```typescript
import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

interface ComponentProps {
  children?: React.ReactNode
  className?: string
  // 其他属性按需添加
}

const ComponentName: React.FC<ComponentProps> = ({ 
  children,
  className = '',
  ...otherProps 
}) => {
  return (
    <View className={`component-name ${className}`}>
      {children}
    </View>
  )
}

export default ComponentName
```

#### 3. Props 设计原则
- **必选参数**: 放在前面，使用解构
- **可选参数**: 提供默认值
- **事件处理**: 使用 on + 动词命名 (如: onClick, onRefresh)
- **样式相关**: className, style 放在最后

### 样式规范

#### 1. BEM 命名规范
```scss
// Block__Element--Modifier 模式
.data-table {
  // Block 样式
  
  &__header {
    // Element 样式
    
    &--sticky {
      // Modifier 样式
    }
  }
  
  &__row {
    &--selected {
      background-color: rgba(59, 130, 246, 0.1);
    }
  }
}
```

#### 2. 移动端优化
```scss
// 必须导入 NutUI 变量
@use "@nutui/nutui-react-taro/dist/styles/variables.scss" as *;

.mobile-component {
  // 基础移动端适配
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
  -webkit-user-select: none;
  user-select: none;
  
  // 硬件加速
  transform: translateZ(0);
  will-change: transform;
  
  // 滚动优化
  -webkit-overflow-scrolling: touch;
  overscroll-behavior-y: none;
}
```

### TypeScript 规范

#### 1. 类型定义
```typescript
// 接口命名规范
interface User {                    // 业务实体：直接使用名词
  id: string
  name: string
}

interface ButtonProps {             // 组件Props：添加Props后缀
  children: React.ReactNode
  onClick?: () => void
}

interface ApiResponse<T> {          // API响应：添加相应后缀
  success: boolean
  data: T
}

// 联合类型
type TaskStatus = 'pending' | 'in_progress' | 'completed'
type UserRole = 'operator' | 'admin'
```

#### 2. 导入导出规范
```typescript
// 路径别名
import Component from '@/components/Component'
import { User, TaskStatus } from '@/types'

// 默认导出组件
export default ComponentName

// 命名导出类型和工具
export { type User, type TaskStatus }
export { formatDate, validateEmail }
```

---

## 🔧 开发最佳实践

### 1. 状态管理
```typescript
// 使用 Zustand 设计状态store
interface UserStore {
  userInfo: User | null
  token: string | null
  permissions: string[]
  
  // Actions
  login: (credentials: LoginForm) => Promise<void>
  logout: () => void
  updateUserInfo: (info: Partial<User>) => void
}

// 状态持久化
const useUserStore = create<UserStore>()(
  persist(
    (set, get) => ({
      // state and actions
    }),
    {
      name: 'user-storage',
      storage: createJSONStorage(() => ({
        getItem: Taro.getStorageSync,
        setItem: Taro.setStorageSync,
        removeItem: Taro.removeStorageSync,
      })),
    }
  )
)
```

### 2. API 服务封装
```typescript
// 统一请求服务
class ApiService {
  private static baseURL = process.env.API_BASE_URL || ''
  
  static async request<T>(options: RequestOptions): Promise<ApiResponse<T>> {
    try {
      const response = await Taro.request({
        url: `${this.baseURL}${options.url}`,
        method: options.method || 'GET',
        data: options.data,
        header: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${getToken()}`,
          ...options.header,
        },
      })
      
      return this.handleResponse(response)
    } catch (error) {
      throw this.handleError(error)
    }
  }
  
  // 具体业务接口
  static getProductBySku(sku: string) {
    return this.request<Product>({
      url: `/products/${sku}`,
      method: 'GET',
    })
  }
}
```

### 3. 错误处理
```typescript
// 错误边界组件
class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }
  
  static getDerivedStateFromError(error: Error): State {
    return { hasError: true }
  }
  
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    // 可以将错误日志发送到服务器
  }
  
  render() {
    if (this.state.hasError) {
      return <ErrorFallback onRetry={() => this.setState({ hasError: false })} />
    }
    
    return this.props.children
  }
}
```

### 4. 性能优化
```typescript
// 组件优化
const OptimizedComponent = React.memo(({ data, onUpdate }) => {
  // 使用 useCallback 优化事件处理
  const handleUpdate = useCallback((id: string) => {
    onUpdate(id)
  }, [onUpdate])
  
  // 使用 useMemo 优化计算
  const processedData = useMemo(() => {
    return data.map(item => ({
      ...item,
      formatted: formatData(item)
    }))
  }, [data])
  
  return (
    <View>
      {processedData.map(item => (
        <ItemComponent
          key={item.id}
          data={item}
          onUpdate={handleUpdate}
        />
      ))}
    </View>
  )
})
```

---

## 🎯 核心功能实现要点

### 1. 扫码功能
```typescript
// 扫码服务封装
class ScanService {
  static async scanCode(): Promise<string> {
    try {
      const result = await Taro.scanCode({
        scanType: ['barCode', 'qrCode'],
        autoZoom: true,
        sound: true,
        vibrate: true,
      })
      return result.result
    } catch (error) {
      if (error.errMsg.includes('cancel')) {
        throw new Error('用户取消扫码')
      }
      throw new Error('扫码失败，请重试')
    }
  }
}

// 在组件中使用
const handleScan = async () => {
  try {
    setLoading(true)
    const code = await ScanService.scanCode()
    const product = await ApiService.getProductBySku(code)
    setResult(product)
  } catch (error) {
    showToast(error.message)
  } finally {
    setLoading(false)
  }
}
```

### 2. 表格横向滚动
```scss
.data-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &__container {
    min-width: 100%;
    width: max-content;
  }
  
  &__header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
    box-shadow: 0 2rpx 8rpx rgba(0, 0, 0, 0.1);
  }
  
  &__cell {
    min-width: 120rpx;
    white-space: nowrap;
    
    &--key {
      // 重要列设置固定宽度
      min-width: 200rpx;
      position: sticky;
      left: 0;
      background: #fff;
      z-index: 5;
    }
  }
}
```

### 3. 权限控制
```typescript
// 权限HOC
function withPermission<T extends object>(
  WrappedComponent: React.ComponentType<T>,
  requiredPermissions: string[]
) {
  return function PermissionWrapper(props: T) {
    const { permissions } = useUserStore()
    
    const hasPermission = requiredPermissions.every(permission =>
      permissions.includes(permission) || permissions.includes('*')
    )
    
    if (!hasPermission) {
      return <NoPermissionComponent />
    }
    
    return <WrappedComponent {...props} />
  }
}

// 使用示例
export default withPermission(ProductManagePage, ['products:read'])
```

---

## 📱 移动端适配要点

### 1. 安全区域处理
```typescript
// 使用 NutUI SafeArea 组件
import { SafeArea } from '@nutui/nutui-react-taro'

const MobileLayout = ({ children }) => (
  <View className="mobile-layout">
    <SafeArea position="top" />
    <View className="content">
      {children}
    </View>
    <SafeArea position="bottom" />
  </View>
)
```

### 2. 触摸反馈
```scss
.touch-item {
  transition: all 0.2s ease;
  
  &:active {
    transform: scale(0.98);
    background-color: rgba(0, 0, 0, 0.05);
  }
  
  // 防止iOS Safari缩放
  &.input-field {
    font-size: 16px !important;
  }
}
```

### 3. 长列表优化
```typescript
// 虚拟滚动实现
const VirtualList = ({ data, itemHeight, renderItem }) => {
  const [scrollTop, setScrollTop] = useState(0)
  const [containerHeight, setContainerHeight] = useState(0)
  
  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    data.length
  )
  
  const visibleItems = data.slice(visibleStart, visibleEnd)
  
  return (
    <ScrollView
      scrollY
      style={{ height: containerHeight }}
      scrollTop={scrollTop}
      onScroll={(e) => setScrollTop(e.detail.scrollTop)}
    >
      <View style={{ height: visibleStart * itemHeight }} />
      {visibleItems.map(renderItem)}
      <View style={{ height: (data.length - visibleEnd) * itemHeight }} />
    </ScrollView>
  )
}
```

---

## 🚀 部署和构建

### 构建配置
```bash
# 开发环境
pnpm run dev:weapp

# 生产构建
pnpm run build:weapp

# 构建分析
pnpm run build:weapp --analyze
```

### 包大小控制
- 主包限制：2MB
- 分包限制：20MB
- 图片压缩：使用CDN或本地压缩
- 代码分割：按页面分包

### 性能指标
- 构建时间：< 5s
- 首屏加载：< 3s
- 页面切换：< 500ms
- 内存使用：< 100MB

---

**开发规范确认清单**:
- [ ] 已理解技术架构和目录结构
- [ ] 已掌握组件开发规范和命名规则
- [ ] 已了解样式规范和移动端适配要求
- [ ] 已熟悉状态管理和API服务封装方式
- [ ] 已明确权限控制和错误处理机制
- [ ] 已理解性能优化和部署要求 