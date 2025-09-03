# Easy ERP Taro 组件库文档

**组件库版本**: v1.0  
**基于**: NutUI React Taro 3.0.16  
**更新时间**: 2025年1月3日  

## 📦 组件概览

### 组件分类
- **布局组件**: 页面布局、容器组件
- **导航组件**: 顶部导航、底部导航、面包屑
- **数据展示**: 表格、卡片、列表、标签
- **数据录入**: 表单、输入框、选择器
- **反馈组件**: 弹窗、提示、加载状态
- **业务组件**: 库存卡片、任务卡片、搜索栏

## 🏗️ 布局组件

### MobileLayout 移动端布局
**文件位置**: `src/components/MobileLayout/index.tsx`

**功能描述**: 提供统一的移动端页面布局，包含顶部导航、内容区域和底部导航。

**Props接口**:
```typescript
interface MobileLayoutProps {
  title?: string                    // 页面标题
  showBack?: boolean               // 是否显示返回按钮
  showTabBar?: boolean             // 是否显示底部导航
  rightAction?: React.ReactNode    // 右侧操作按钮
  onBack?: () => void             // 返回按钮点击事件
  className?: string              // 自定义样式类
  children: React.ReactNode       // 页面内容
}
```

**使用示例**:
```tsx
import { MobileLayout } from '@/components/MobileLayout'

const InventoryPage: React.FC = () => {
  return (
    <MobileLayout 
      title="库存管理" 
      showBack 
      showTabBar
      rightAction={<Button size="small">新增</Button>}
    >
      <div className="page-content">
        {/* 页面内容 */}
      </div>
    </MobileLayout>
  )
}
```

**样式变量**:
```scss
$mobile-layout-header-height: 44px;
$mobile-layout-tabbar-height: 50px;
$mobile-layout-bg-color: #f5f5f5;
```

### PageContainer 页面容器
**文件位置**: `src/components/common/PageContainer/index.tsx`

**功能描述**: 提供标准的页面容器，处理加载状态、错误状态和空状态。

**Props接口**:
```typescript
interface PageContainerProps {
  loading?: boolean               // 加载状态
  error?: string                 // 错误信息
  empty?: boolean                // 是否为空
  emptyText?: string            // 空状态文案
  onRetry?: () => void          // 重试回调
  className?: string
  children: React.ReactNode
}
```

## 🧭 导航组件

### TopNavigation 顶部导航
**文件位置**: `src/components/TopNavigation/index.tsx`

**功能描述**: 统一的顶部导航栏，支持标题、返回按钮和右侧操作。

**Props接口**:
```typescript
interface TopNavigationProps {
  title: string                   // 导航标题
  showBack?: boolean             // 显示返回按钮
  backText?: string              // 返回按钮文案
  rightContent?: React.ReactNode // 右侧内容
  onBack?: () => void           // 返回事件
  className?: string
}
```

**使用示例**:
```tsx
<TopNavigation
  title="产品详情"
  showBack
  rightContent={
    <Button size="small" type="primary">
      编辑
    </Button>
  }
  onBack={() => Taro.navigateBack()}
/>
```

### TabNavigation 底部导航
**文件位置**: `src/components/common/TabNavigation/index.tsx`

**功能描述**: 底部Tab导航，支持图标和徽章。

**Props接口**:
```typescript
interface TabNavigationProps {
  activeKey: string              // 当前激活的Tab
  onChange: (key: string) => void // Tab切换回调
  items: TabItem[]               // Tab项配置
}

interface TabItem {
  key: string                    // Tab标识
  title: string                  // Tab标题
  icon?: string                  // 图标名称
  badge?: number                 // 徽章数量
  path: string                   // 路由路径
}
```

## 📊 数据展示组件

### DataTable 数据表格
**文件位置**: `src/components/DataTable/index.tsx`

**功能描述**: 移动端优化的数据表格组件，支持分页、排序、筛选。

**Props接口**:
```typescript
interface DataTableProps<T = any> {
  columns: TableColumn<T>[]      // 列配置
  dataSource: T[]               // 数据源
  loading?: boolean             // 加载状态
  pagination?: PaginationConfig // 分页配置
  onRow?: (record: T) => void   // 行点击事件
  rowKey?: string | ((record: T) => string) // 行唯一标识
  className?: string
}

interface TableColumn<T> {
  key: string                   // 列标识
  title: string                 // 列标题
  dataIndex: keyof T           // 数据字段
  width?: number               // 列宽度
  align?: 'left' | 'center' | 'right' // 对齐方式
  render?: (value: any, record: T, index: number) => React.ReactNode
  sorter?: boolean | ((a: T, b: T) => number) // 排序配置
}
```

**使用示例**:
```tsx
const columns: TableColumn<InventoryItem>[] = [
  {
    key: 'productName',
    title: '产品名称',
    dataIndex: 'productName',
    width: 120
  },
  {
    key: 'quantity',
    title: '库存数量',
    dataIndex: 'quantity',
    align: 'right',
    render: (value) => <span className="quantity">{value}</span>
  },
  {
    key: 'actions',
    title: '操作',
    dataIndex: 'id',
    render: (id) => (
      <Button size="small" onClick={() => handleEdit(id)}>
        编辑
      </Button>
    )
  }
]

<DataTable
  columns={columns}
  dataSource={inventoryList}
  loading={loading}
  pagination={{
    current: page,
    pageSize: 20,
    total: total,
    onChange: setPage
  }}
  onRow={(record) => handleRowClick(record)}
/>
```

### InventoryCard 库存卡片
**文件位置**: `src/components/InventoryCard/index.tsx`

**功能描述**: 专用于展示库存信息的卡片组件。

**Props接口**:
```typescript
interface InventoryCardProps {
  data: InventoryItem           // 库存数据
  type: 'finished' | 'spare'   // 库存类型
  onClick?: (item: InventoryItem) => void // 点击事件
  onEdit?: (item: InventoryItem) => void  // 编辑事件
  onDelete?: (item: InventoryItem) => void // 删除事件
  className?: string
}

interface InventoryItem {
  id: string
  productName: string
  shop: string
  category: string
  quantity: number
  location: string
  // ... 其他字段
}
```

**使用示例**:
```tsx
<InventoryCard
  data={inventoryItem}
  type="finished"
  onClick={handleCardClick}
  onEdit={handleEdit}
  onDelete={handleDelete}
/>
```

### TaskCard 任务卡片
**文件位置**: `src/components/TaskCard/index.tsx`

**功能描述**: 展示任务信息的卡片组件，支持不同任务状态。

**Props接口**:
```typescript
interface TaskCardProps {
  data: TaskItem                // 任务数据
  type: 'package' | 'shipment' // 任务类型
  onStatusChange?: (id: string, status: TaskStatus) => void
  onClick?: (item: TaskItem) => void
  className?: string
}

interface TaskItem {
  id: string
  title: string
  description: string
  status: TaskStatus
  assignee: string
  dueDate: string
  progress: number
}

type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled'
```

## 📝 数据录入组件

### SearchBar 搜索栏
**文件位置**: `src/components/SearchBar/index.tsx`

**功能描述**: 统一的搜索栏组件，支持关键词搜索和筛选。

**Props接口**:
```typescript
interface SearchBarProps {
  value?: string                // 搜索值
  placeholder?: string          // 占位符
  showFilter?: boolean         // 显示筛选按钮
  filterOptions?: FilterOption[] // 筛选选项
  onSearch?: (value: string) => void // 搜索回调
  onFilter?: (filters: Record<string, any>) => void // 筛选回调
  onClear?: () => void         // 清空回调
  className?: string
}

interface FilterOption {
  key: string                  // 筛选字段
  label: string               // 显示标签
  type: 'select' | 'date' | 'range' // 筛选类型
  options?: Array<{           // 选项列表（select类型）
    label: string
    value: any
  }>
}
```

**使用示例**:
```tsx
const filterOptions: FilterOption[] = [
  {
    key: 'shop',
    label: '店铺',
    type: 'select',
    options: [
      { label: '淘宝店铺', value: 'taobao' },
      { label: '京东店铺', value: 'jd' }
    ]
  },
  {
    key: 'dateRange',
    label: '日期范围',
    type: 'date'
  }
]

<SearchBar
  placeholder="搜索产品名称"
  showFilter
  filterOptions={filterOptions}
  onSearch={handleSearch}
  onFilter={handleFilter}
/>
```

### FormModal 表单弹窗
**文件位置**: `src/components/FormModal/index.tsx`

**功能描述**: 通用的表单弹窗组件，支持新增和编辑模式。

**Props接口**:
```typescript
interface FormModalProps<T = any> {
  visible: boolean              // 显示状态
  title: string                // 弹窗标题
  mode: 'create' | 'edit'      // 模式
  initialValues?: Partial<T>   // 初始值
  fields: FormField[]          // 表单字段配置
  onSubmit: (values: T) => Promise<void> // 提交回调
  onCancel: () => void         // 取消回调
  loading?: boolean            // 提交加载状态
}

interface FormField {
  name: string                 // 字段名
  label: string               // 字段标签
  type: 'input' | 'select' | 'textarea' | 'number' | 'date'
  required?: boolean          // 是否必填
  placeholder?: string        // 占位符
  options?: Array<{           // 选项（select类型）
    label: string
    value: any
  }>
  rules?: ValidationRule[]    // 验证规则
}
```

**使用示例**:
```tsx
const formFields: FormField[] = [
  {
    name: 'productName',
    label: '产品名称',
    type: 'input',
    required: true,
    placeholder: '请输入产品名称'
  },
  {
    name: 'shop',
    label: '店铺',
    type: 'select',
    required: true,
    options: shopOptions
  },
  {
    name: 'quantity',
    label: '数量',
    type: 'number',
    required: true
  }
]

<FormModal
  visible={modalVisible}
  title={editMode ? '编辑库存' : '新增库存'}
  mode={editMode ? 'edit' : 'create'}
  initialValues={editData}
  fields={formFields}
  onSubmit={handleSubmit}
  onCancel={() => setModalVisible(false)}
  loading={submitting}
/>
```

## 💬 反馈组件

### LoadingState 加载状态
**文件位置**: `src/components/common/LoadingState/index.tsx`

**功能描述**: 统一的加载状态组件。

**Props接口**:
```typescript
interface LoadingStateProps {
  size?: 'small' | 'medium' | 'large' // 尺寸
  text?: string                       // 加载文案
  overlay?: boolean                   // 是否覆盖层
  className?: string
}
```

### EmptyState 空状态
**文件位置**: `src/components/common/EmptyState/index.tsx`

**功能描述**: 统一的空状态组件。

**Props接口**:
```typescript
interface EmptyStateProps {
  image?: string                      // 空状态图片
  title?: string                      // 标题
  description?: string                // 描述
  action?: React.ReactNode           // 操作按钮
  className?: string
}
```

### ErrorBoundary 错误边界
**文件位置**: `src/components/common/ErrorBoundary/index.tsx`

**功能描述**: React错误边界组件，捕获子组件错误。

**Props接口**:
```typescript
interface ErrorBoundaryProps {
  fallback?: React.ComponentType<ErrorFallbackProps> // 错误回退组件
  onError?: (error: Error, errorInfo: ErrorInfo) => void // 错误回调
  children: React.ReactNode
}

interface ErrorFallbackProps {
  error: Error
  resetError: () => void
}
```

## 🔐 权限组件

### AuthGuard 权限守卫
**文件位置**: `src/components/AuthGuard/index.tsx`

**功能描述**: 权限控制组件，根据用户权限显示或隐藏内容。

**Props接口**:
```typescript
interface AuthGuardProps {
  permissions?: string[]          // 需要的权限
  roles?: string[]               // 需要的角色
  requireAll?: boolean           // 是否需要全部权限
  fallback?: React.ReactNode     // 无权限时显示的内容
  children: React.ReactNode
}
```

**使用示例**:
```tsx
<AuthGuard permissions={['inventory:write']} fallback={<div>无权限</div>}>
  <Button onClick={handleAdd}>新增库存</Button>
</AuthGuard>

<AuthGuard roles={['admin', 'manager']} requireAll={false}>
  <AdminPanel />
</AuthGuard>
```

## 🎨 样式系统

### 设计令牌
```scss
// 颜色系统
$primary-color: #1890ff;
$success-color: #52c41a;
$warning-color: #faad14;
$error-color: #f5222d;
$info-color: #1890ff;

// 中性色
$text-color: #262626;
$text-color-secondary: #595959;
$text-color-disabled: #bfbfbf;
$border-color: #d9d9d9;
$background-color: #f5f5f5;

// 间距系统
$spacing-xs: 4px;
$spacing-sm: 8px;
$spacing-md: 16px;
$spacing-lg: 24px;
$spacing-xl: 32px;

// 字体系统
$font-size-sm: 12px;
$font-size-base: 14px;
$font-size-lg: 16px;
$font-size-xl: 18px;
$font-size-xxl: 20px;

// 圆角系统
$border-radius-sm: 2px;
$border-radius-base: 4px;
$border-radius-lg: 8px;

// 阴影系统
$box-shadow-sm: 0 1px 2px rgba(0, 0, 0, 0.03);
$box-shadow-base: 0 2px 8px rgba(0, 0, 0, 0.09);
$box-shadow-lg: 0 4px 12px rgba(0, 0, 0, 0.15);
```

### 主题定制
```scss
// 自定义主题变量
:root {
  --nutui-primary-color: #{$primary-color};
  --nutui-primary-color-end: #{lighten($primary-color, 10%)};
  --nutui-help-color: #{$text-color-secondary};
  --nutui-title-color: #{$text-color};
  --nutui-app-background-color: #{$background-color};
}

// 暗色主题
[data-theme='dark'] {
  --nutui-primary-color: #177ddc;
  --nutui-app-background-color: #141414;
  --nutui-title-color: rgba(255, 255, 255, 0.85);
  --nutui-help-color: rgba(255, 255, 255, 0.45);
}
```

### 响应式断点
```scss
// 断点定义
$breakpoints: (
  xs: 0,
  sm: 576px,
  md: 768px,
  lg: 992px,
  xl: 1200px,
  xxl: 1600px
);

// 响应式混入
@mixin respond-above($breakpoint) {
  @media (min-width: map-get($breakpoints, $breakpoint)) {
    @content;
  }
}

@mixin respond-below($breakpoint) {
  @media (max-width: map-get($breakpoints, $breakpoint) - 1px) {
    @content;
  }
}

@mixin respond-between($lower, $upper) {
  @media (min-width: map-get($breakpoints, $lower)) and (max-width: map-get($breakpoints, $upper) - 1px) {
    @content;
  }
}
```

## 🧪 组件测试

### 测试工具配置
```javascript
// jest.config.js
module.exports = {
  preset: '@tarojs/test-utils/jest',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
  moduleNameMapping: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    '!src/components/**/index.ts',
    '!src/components/**/*.d.ts'
  ]
}
```

### 组件测试示例
```typescript
// SearchBar.test.tsx
import React from 'react'
import { render, fireEvent, screen } from '@testing-library/react'
import { SearchBar } from '../index'

describe('SearchBar', () => {
  test('should render correctly', () => {
    render(<SearchBar placeholder="搜索" />)
    
    const input = screen.getByPlaceholderText('搜索')
    expect(input).toBeInTheDocument()
  })

  test('should call onSearch when search button clicked', () => {
    const mockOnSearch = jest.fn()
    render(<SearchBar onSearch={mockOnSearch} />)
    
    const input = screen.getByRole('textbox')
    const searchButton = screen.getByRole('button')
    
    fireEvent.change(input, { target: { value: 'test' } })
    fireEvent.click(searchButton)
    
    expect(mockOnSearch).toHaveBeenCalledWith('test')
  })

  test('should show filter options when showFilter is true', () => {
    const filterOptions = [
      {
        key: 'category',
        label: '分类',
        type: 'select' as const,
        options: [
          { label: '电子产品', value: 'electronics' }
        ]
      }
    ]

    render(
      <SearchBar 
        showFilter 
        filterOptions={filterOptions}
      />
    )
    
    const filterButton = screen.getByText('筛选')
    expect(filterButton).toBeInTheDocument()
  })
})
```

## 📚 使用指南

### 组件引入方式
```typescript
// 按需引入
import { MobileLayout } from '@/components/MobileLayout'
import { DataTable } from '@/components/DataTable'
import { SearchBar } from '@/components/SearchBar'

// 统一引入
import { 
  MobileLayout, 
  DataTable, 
  SearchBar 
} from '@/components'
```

### 样式覆盖
```scss
// 全局样式覆盖
.custom-data-table {
  .nut-table-header {
    background-color: #f0f0f0;
  }
  
  .nut-table-row {
    &:hover {
      background-color: #fafafa;
    }
  }
}

// 组件级样式覆盖
.inventory-card {
  @include respond-below(md) {
    .card-content {
      padding: $spacing-sm;
    }
  }
}
```

### 最佳实践
1. **组件复用**: 优先使用现有组件，避免重复开发
2. **属性传递**: 合理设计Props接口，保持API简洁
3. **样式隔离**: 使用CSS Modules或styled-components避免样式冲突
4. **性能优化**: 使用React.memo、useMemo等优化渲染性能
5. **无障碍访问**: 添加适当的ARIA属性和语义化标签
6. **错误处理**: 组件内部处理异常情况，提供友好的错误提示

## 🔄 组件更新日志

### v1.0.0 (2025-01-03)
- ✨ 新增 MobileLayout 移动端布局组件
- ✨ 新增 DataTable 数据表格组件
- ✨ 新增 SearchBar 搜索栏组件
- ✨ 新增 FormModal 表单弹窗组件
- ✨ 新增 InventoryCard 库存卡片组件
- ✨ 新增 TaskCard 任务卡片组件
- ✨ 新增 AuthGuard 权限守卫组件
- 🎨 建立完整的设计系统和主题体系

### 计划更新
- 📊 新增图表组件 (ChartCard)
- 📱 新增手势操作组件 (SwipeAction)
- 🔍 新增高级搜索组件 (AdvancedSearch)
- 📋 新增虚拟列表组件 (VirtualList)

---

**组件库维护**: 前端开发团队  
**技术支持**: frontend@easy-erp.com  
**最后更新**: 2025年1月3日