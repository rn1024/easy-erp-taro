# Taro + React 项目代码规范

## 概述

本文档基于现有项目架构（Taro 4.1.2 + React 18 + TypeScript + NutUI）制定统一的代码规范，参考业界最佳实践，确保代码一致性、可维护性和可读性。

## 1. 文件与目录规范

### 1.1 文件命名
- **页面组件**: `index.tsx` (页面入口)
- **通用组件**: `PascalCase.tsx` (如 `DataTable.tsx`)
- **工具函数**: `camelCase.ts` (如 `formatDate.ts`)
- **类型定义**: `types.ts` 或 `index.ts`
- **样式文件**: `index.scss` 或对应组件名 `Component.scss`
- **测试文件**: `Component.test.tsx`

### 1.2 目录结构
```
src/
├── pages/           # 页面组件
│   └── products/
│       ├── index.tsx
│       ├── index.scss
│       └── components/  # 页面级组件
├── components/      # 通用组件
│   ├── common/      # 基础组件
│   └── business/    # 业务组件
├── hooks/           # 自定义 Hooks
├── services/        # API 服务
├── stores/          # 状态管理
├── types/           # 类型定义
├── utils/           # 工具函数
└── styles/          # 样式文件
```

## 2. 导入顺序规范

### 2.1 导入分组（按顺序）
```typescript
/**
 * 1. React 相关
 */
import React, { useState, useEffect, useCallback, useMemo } from 'react'

/**
 * 2. Taro 相关
 */
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'

/**
 * 3. 第三方 UI 库
 */
import { Button, Input, Modal } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'

/**
 * 4. 布局组件
 */
import MobileLayout from '@/components/MobileLayout'

/**
 * 5. 业务组件
 */
import DataTable from '@/components/DataTable'
import SearchBar from '@/components/SearchBar'

/**
 * 6. 通用组件
 */
import { PageHeader, SectionCard, StatsGrid } from '@/components/common'

/**
 * 7. 状态管理
 */
import { useUserStore } from '@/stores/userStore'

/**
 * 8. API 服务
 */
import { getProducts, createProduct } from '@/services/products'

/**
 * 9. 自定义 Hooks
 */
import useListQuery from '@/hooks/useListQuery'
import useFilters from '@/hooks/useFilters'

/**
 * 10. 类型定义
 */
import type { Product, ProductFilters } from '@/types'
import type { ListFetcherParams } from '@/hooks/useListQuery'

/**
 * 11. 样式文件（最后）
 */
import './index.scss'
```

### 2.2 导入规则
- 同组内按字母顺序排列
- 类型导入使用 `type` 关键字
- 避免 `import *` 除非必要
- 别名导入保持一致性

## 3. 组件内部结构规范

### 3.1 函数组件标准结构
```typescript
const ComponentName: React.FC<ComponentNameProps> = ({
  prop1,
  prop2 = defaultValue
}) => {
  /**
   * Hooks - 状态管理
   */
  const { userInfo } = useUserStore()
  const [loading, setLoading] = useState(false)
  const [searchValue, setSearchValue] = useState('')

  /**
   * Refs
   */
  const inputRef = useRef<HTMLInputElement>(null)

  /**
   * Custom Hooks
   */
  const list = useListQuery<DataType>({ /* config */ })
  const filters = useFilters<FilterKeys>({ /* config */ })

  /**
   * Computed Values
   */
  const filteredData = useMemo(() => {
    return data.filter(item => item.name.includes(searchValue))
  }, [data, searchValue])

  /**
   * Event Handlers
   */
  const handleSearch = useCallback((value: string) => {
    setSearchValue(value)
  }, [])

  const handleSubmit = useCallback(async () => {
    setLoading(true)
    try {
      await submitData()
    } finally {
      setLoading(false)
    }
  }, [])

  /**
   * Effects
   */
  useEffect(() => {
    // 初始化逻辑
  }, [])

  /**
   * Render
   */
  return (
    <MobileLayout>
      {/* JSX 内容 */}
    </MobileLayout>
  )
}
```

### 3.2 分区说明
1. **Hooks**: 状态管理、外部状态订阅
2. **Refs**: DOM 引用
3. **Custom Hooks**: 自定义逻辑封装
4. **Computed Values**: 派生状态、计算属性
5. **Event Handlers**: 事件处理函数
6. **Effects**: 副作用处理
7. **Render**: JSX 返回

## 4. 类型定义规范

### 4.1 类型命名
```typescript
// 组件 Props
interface ComponentNameProps {
  title: string
  onSubmit?: (data: FormData) => void
}

// 页面状态
interface PageState {
  loading: boolean
  data: DataItem[]
  filters: FilterState
}

// API 响应
interface ProductsResponse {
  list: Product[]
  total: number
  page: number
}

// 查询参数
interface ProductsQueryParams {
  search?: string
  category?: string
  page: number
  pageSize: number
}

// 枚举类型
enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed'
}
```

### 4.2 类型组织
- 组件内部类型定义在组件文件顶部
- 通用类型定义在 `src/types/` 目录
- API 相关类型与服务文件同目录
- 复杂类型使用 `interface`，简单类型使用 `type`

## 5. 状态管理规范

### 5.1 局部状态
```typescript
// 简单状态
const [loading, setLoading] = useState(false)
const [searchValue, setSearchValue] = useState('')

// 复杂状态（推荐使用 useReducer 或自定义 hook）
const [state, setState] = useState<PageState>({
  loading: false,
  data: [],
  filters: {}
})

// 更新复杂状态
const updateState = useCallback((updates: Partial<PageState>) => {
  setState(prev => ({ ...prev, ...updates }))
}, [])
```

### 5.2 全局状态 (Zustand)
```typescript
// stores/userStore.ts
interface UserState {
  userInfo: UserInfo | null
  setUserInfo: (userInfo: UserInfo | null) => void
  clearUser: () => void
}

export const useUserStore = create<UserState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo) => set({ userInfo }),
  clearUser: () => set({ userInfo: null })
}))
```

## 6. 事件处理规范

### 6.1 命名规范
```typescript
// 事件处理函数以 handle 开头
const handleClick = useCallback(() => {
  // 处理逻辑
}, [dependencies])

const handleInputChange = useCallback((value: string) => {
  setSearchValue(value)
}, [])

const handleSubmit = useCallback(async (data: FormData) => {
  setLoading(true)
  try {
    await submitData(data)
    Taro.showToast({ title: '提交成功', icon: 'success' })
  } catch (error) {
    Taro.showToast({ title: '提交失败', icon: 'error' })
  } finally {
    setLoading(false)
  }
}, [])
```

### 6.2 异步处理
- 使用 try-catch 包装异步操作
- 统一错误处理和用户反馈
- loading 状态管理

## 7. 样式规范

### 7.1 SCSS 组织
```scss
// 使用 BEM 命名规范
.products-page {
  // 页面容器样式
  
  &__header {
    // 页面头部
  }
  
  &__content {
    // 主内容区
  }
  
  &__filters {
    display: flex;
    gap: var(--spacing-2);
    
    // 嵌套元素
    &-item {
      flex: 1;
    }
  }
  
  // 修饰符
  &--loading {
    opacity: 0.6;
    pointer-events: none;
  }
}
```

### 7.2 样式规则
- 使用设计 tokens (`var(--spacing-2)`)
- 遵循 BEM 命名规范
- 避免深层嵌套 (最多 3 层)
- 使用 `rpx` 单位适配移动端

## 8. API 服务规范

### 8.1 服务文件结构
```typescript
// services/products.ts
import { request } from '@/utils/request'
import type { Product, ProductsResponse, ProductsQueryParams } from '@/types'

/**
 * 获取产品列表
 */
export const getProducts = (params: ProductsQueryParams): Promise<ApiResponse<ProductsResponse>> => {
  return request({
    url: '/api/products',
    method: 'GET',
    data: params
  })
}

/**
 * 创建产品
 */
export const createProduct = (data: Omit<Product, 'id'>): Promise<ApiResponse<Product>> => {
  return request({
    url: '/api/products',
    method: 'POST',
    data
  })
}
```

### 8.2 API 调用规范
```typescript
// 在组件中使用
const handleFetchProducts = useCallback(async () => {
  setLoading(true)
  try {
    const response = await getProducts(queryParams)
    if (response.code === 0) {
      setProducts(response.data.list)
    } else {
      Taro.showToast({ title: response.msg || '获取失败', icon: 'error' })
    }
  } catch (error) {
    Taro.showToast({ title: '网络错误', icon: 'error' })
  } finally {
    setLoading(false)
  }
}, [queryParams])
```

## 9. 自定义 Hooks 规范

### 9.1 Hook 命名和结构
```typescript
// hooks/useListQuery.ts
interface UseListQueryOptions<T> {
  fetcher: (params: any) => Promise<T>
  initialData?: T[]
  pageSize?: number
}

interface UseListQueryReturn<T> {
  data: T[]
  loading: boolean
  error: Error | null
  refresh: () => Promise<void>
  loadMore: () => Promise<void>
}

export const useListQuery = <T>(options: UseListQueryOptions<T>): UseListQueryReturn<T> => {
  // Hook 实现
}
```

### 9.2 Hook 使用规范
- Hook 名称以 `use` 开头
- 返回对象而非数组（便于解构）
- 提供完整的 TypeScript 类型支持
- 包含错误处理和 loading 状态

## 10. 注释规范

### 10.1 组件注释
```typescript
/**
 * 产品列表页面
 * 
 * 功能：
 * - 展示产品列表
 * - 支持搜索和筛选
 * - 支持分页加载
 * 
 * @author 开发者姓名
 * @since 2024-01-01
 */
const ProductsPage: React.FC = () => {
  // 实现
}
```

### 10.2 函数注释
```typescript
/**
 * 处理产品删除
 * @param productId 产品ID
 * @returns Promise<void>
 */
const handleDeleteProduct = useCallback(async (productId: string) => {
  // 实现
}, [])
```

### 10.3 复杂逻辑注释
```typescript
// 计算过滤后的产品列表
// 优先显示有库存的产品，然后按照创建时间倒序排列
const filteredProducts = useMemo(() => {
  return products
    .filter(product => {
      // 应用搜索过滤
      if (searchValue && !product.name.includes(searchValue)) {
        return false
      }
      // 应用分类过滤
      if (categoryFilter && product.category !== categoryFilter) {
        return false
      }
      return true
    })
    .sort((a, b) => {
      // 有库存的优先
      if (a.stock > 0 && b.stock === 0) return -1
      if (a.stock === 0 && b.stock > 0) return 1
      // 创建时间倒序
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    })
}, [products, searchValue, categoryFilter])
```

## 11. 错误处理规范

### 11.1 统一错误处理
```typescript
// utils/errorHandler.ts
export const handleApiError = (error: any, fallbackMessage = '操作失败') => {
  const message = error?.response?.data?.msg || error?.message || fallbackMessage
  Taro.showToast({
    title: message,
    icon: 'error',
    duration: 2000
  })
}

// 使用
try {
  await createProduct(productData)
  Taro.showToast({ title: '创建成功', icon: 'success' })
} catch (error) {
  handleApiError(error, '创建产品失败')
}
```

### 11.2 错误边界
```typescript
// components/ErrorBoundary.tsx
interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

class ErrorBoundary extends React.Component<
  React.PropsWithChildren<{}>,
  ErrorBoundaryState
> {
  constructor(props: React.PropsWithChildren<{}>) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <View className="error-boundary">
          <Text>出现了一些问题，请稍后重试</Text>
        </View>
      )
    }

    return this.props.children
  }
}
```

## 12. 性能优化规范

### 12.1 组件优化
```typescript
// 使用 React.memo 优化纯组件
const ProductCard = React.memo<ProductCardProps>(({ product, onEdit }) => {
  return (
    <View className="product-card">
      {/* 组件内容 */}
    </View>
  )
})

// 使用 useCallback 优化回调函数
const handleEdit = useCallback((productId: string) => {
  navigation.navigate('EditProduct', { productId })
}, [navigation])

// 使用 useMemo 优化计算值
const expensiveValue = useMemo(() => {
  return heavyComputation(data)
}, [data])
```

### 12.2 列表优化
```typescript
// 虚拟滚动（大数据量）
import { VirtualList } from '@tarojs/components'

const ProductList: React.FC = () => {
  return (
    <VirtualList
      height={600}
      itemData={products}
      itemCount={products.length}
      itemSize={80}
    >
      {({ index, data }) => (
        <ProductCard key={data[index].id} product={data[index]} />
      )}
    </VirtualList>
  )
}
```

## 13. 测试规范

### 13.1 单元测试
```typescript
// __tests__/ProductCard.test.tsx
import { render, fireEvent } from '@testing-library/react'
import ProductCard from '../ProductCard'

describe('ProductCard', () => {
  const mockProduct = {
    id: '1',
    name: 'Test Product',
    price: 100
  }

  test('renders product information', () => {
    const { getByText } = render(
      <ProductCard product={mockProduct} onEdit={jest.fn()} />
    )
    
    expect(getByText('Test Product')).toBeInTheDocument()
    expect(getByText('¥100')).toBeInTheDocument()
  })

  test('calls onEdit when edit button is clicked', () => {
    const mockOnEdit = jest.fn()
    const { getByText } = render(
      <ProductCard product={mockProduct} onEdit={mockOnEdit} />
    )
    
    fireEvent.click(getByText('编辑'))
    expect(mockOnEdit).toHaveBeenCalledWith('1')
  })
})
```

## 14. 代码检查配置

### 14.1 ESLint 规则
```json
// .eslintrc.js 扩展规则
{
  "rules": {
    "@typescript-eslint/no-unused-vars": ["error", { "argsIgnorePattern": "^_" }],
    "react-hooks/exhaustive-deps": "warn",
    "react/jsx-key": "error",
    "react/jsx-no-useless-fragment": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### 14.2 Prettier 配置
```json
// .prettierrc
{
  "semi": false,
  "singleQuote": true,
  "trailingComma": "none",
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false
}
```

## 15. Git 提交规范

### 15.1 提交信息格式
```
<type>(<scope>): <subject>

<body>

<footer>
```

### 15.2 Type 类型
- `feat`: 新功能
- `fix`: 修复 bug
- `docs`: 文档变更
- `style`: 代码格式调整
- `refactor`: 重构代码
- `perf`: 性能优化
- `test`: 添加测试
- `chore`: 构建过程或辅助工具的变动

### 15.3 示例
```
feat(products): add product search functionality

- Add search input component
- Implement debounced search
- Update product list filtering logic

Closes #123
```

## 16. 最佳实践总结

### 16.1 代码组织
1. 保持文件小而专注（单一职责）
2. 使用 TypeScript 严格模式
3. 统一的导入顺序和分组
4. 清晰的组件内部结构

### 16.2 性能考虑
1. 合理使用 `useCallback` 和 `useMemo`
2. 避免在 render 中创建新对象
3. 使用 `React.memo` 优化纯组件
4. 实现虚拟滚动处理大列表

### 16.3 可维护性
1. 充分的类型定义和注释
2. 统一的错误处理机制
3. 模块化的代码组织
4. 完善的测试覆盖

### 16.4 团队协作
1. 统一的代码格式和风格
2. 清晰的 Git 提交历史
3. 详细的 PR 描述和 review
4. 及时的文档更新

---

本规范将持续更新和完善，确保与项目发展保持同步。所有团队成员应严格遵循此规范，在代码 review 时重点关注规范执行情况。