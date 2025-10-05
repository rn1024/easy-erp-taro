# Easy ERP Taro 组件库文档

**组件库版本**: v2.0  
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

---

## 🆕 新增通用组件 (v2.0)

### SectionCard 卡片容器
**文件位置**: `src/components/common/SectionCard/index.tsx`

**功能描述**: 提供统一的卡片容器，支持标题、描述、操作按钮等，适用于各种内容展示场景。

**Props接口**:
```typescript
interface SectionCardProps {
  title?: string                    // 卡片标题
  description?: string              // 卡片描述
  titleIcon?: React.ReactNode       // 标题图标
  meta?: React.ReactNode           // 元信息（如时间、状态等）
  actions?: React.ReactNode | React.ReactNode[]  // 操作按钮
  footer?: React.ReactNode         // 底部内容
  children?: React.ReactNode       // 主要内容
  className?: string              // 自定义样式类
  contentClassName?: string       // 内容区域样式类
  compact?: boolean               // 紧凑模式（减小间距）
  flat?: boolean                  // 平铺模式（无边框阴影）
  clickable?: boolean             // 可点击（显示交互样式）
  onClick?: () => void           // 点击事件
}
```

**使用示例**:
```tsx
import { SectionCard, Icon } from '@/components/common'

// 基础使用
<SectionCard title="用户信息" description="管理个人资料和设置">
  <p>这里是卡片内容</p>
</SectionCard>

// 带图标和操作按钮
<SectionCard
  title="库存统计"
  titleIcon={<Icon name="inventory_2" size={16} />}
  meta={<Text>更新时间: 2025-01-03</Text>}
  actions={[
    <Button key="edit" size="small">编辑</Button>,
    <Button key="refresh" size="small" type="primary">刷新</Button>
  ]}
  clickable
  onClick={() => console.log('clicked')}
>
  <StatsGrid data={statsData} />
</SectionCard>

// 紧凑模式
<SectionCard title="快速操作" compact>
  <InfoList items={quickActions} />
</SectionCard>
```

### StatsGrid 统计网格
**文件位置**: `src/components/common/StatsGrid/index.tsx`

**功能描述**: 响应式统计数据展示网格，自动适配单列/双列布局，支持图标、颜色自定义。

**Props接口**:
```typescript
interface StatItem {
  label: string                   // 统计项标签
  value: string | number          // 统计值
  icon?: string                   // 图标名称
  color?: string                  // 主题色
  trend?: 'up' | 'down' | 'flat'  // 趋势（可选）
  trendValue?: string             // 趋势值（如 +5.2%）
  onClick?: () => void           // 点击事件
}

interface StatsGridProps {
  data: StatItem[]               // 统计数据
  columns?: 1 | 2 | 3 | 4       // 列数（默认响应式）
  gap?: 'small' | 'medium' | 'large'  // 间距大小
  showTrend?: boolean            // 显示趋势
  className?: string             // 自定义样式类
}
```

**使用示例**:
```tsx
import { StatsGrid } from '@/components/common'

const statsData = [
  {
    label: '总库存',
    value: '1,234',
    icon: 'inventory_2',
    color: '#3b82f6',
    trend: 'up',
    trendValue: '+12.5%',
    onClick: () => navigateTo('/inventory')
  },
  {
    label: '待发货',
    value: '56',
    icon: 'local_shipping',
    color: '#f59e0b',
    trend: 'down',
    trendValue: '-3.2%'
  },
  {
    label: '今日销售',
    value: '￥23,456',
    icon: 'trending_up',
    color: '#10b981'
  }
]

// 基础使用
<StatsGrid data={statsData} />

// 固定列数
<StatsGrid data={statsData} columns={3} showTrend />

// 大间距
<StatsGrid data={statsData} gap="large" />
```

### InfoList 信息列表
**文件位置**: `src/components/common/InfoList/index.tsx`

**功能描述**: 统一的信息展示列表，支持图标、标签、值的组合显示，常用于详情页面。

**Props接口**:
```typescript
interface InfoItem {
  label: string                  // 标签文本
  value: React.ReactNode        // 值内容
  icon?: string                 // 图标名称
  color?: string                // 图标颜色
  onClick?: () => void         // 点击事件
  extra?: React.ReactNode      // 额外内容（如箭头、开关等）
}

interface InfoListProps {
  items: InfoItem[]            // 信息项列表
  layout?: 'vertical' | 'horizontal'  // 布局方向
  divider?: boolean            // 显示分割线
  clickable?: boolean          // 可点击样式
  className?: string           // 自定义样式类
}
```

**使用示例**:
```tsx
import { InfoList, Icon } from '@/components/common'

const userInfo = [
  {
    label: '姓名',
    value: '张三',
    icon: 'person',
    color: '#3b82f6'
  },
  {
    label: '电话',
    value: '138****8888',
    icon: 'phone',
    color: '#10b981',
    onClick: () => Taro.makePhoneCall({ phoneNumber: '13800138888' })
  },
  {
    label: '邮箱',
    value: 'zhangsan@example.com',
    icon: 'email',
    color: '#f59e0b'
  },
  {
    label: '设置',
    value: '账户安全',
    icon: 'security',
    extra: <Icon name="chevron_right" size={16} />,
    onClick: () => navigateTo('/security')
  }
]

// 垂直布局（默认）
<InfoList items={userInfo} divider clickable />

// 水平布局
<InfoList items={userInfo} layout="horizontal" />
```

### FilterChips 筛选器
**文件位置**: `src/components/common/FilterChips/index.tsx`

**功能描述**: 统一的筛选标签组件，支持单选/多选模式，横向滚动适配。

**Props接口**:
```typescript
interface FilterOption {
  label: string                 // 选项标签
  value: string                // 选项值
  count?: number               // 选项数量（可选）
  disabled?: boolean           // 是否禁用
}

interface FilterChipsProps {
  options: FilterOption[]      // 筛选选项
  value?: string | string[]    // 当前值
  multiple?: boolean           // 多选模式
  clearable?: boolean          // 显示清除按钮
  onChange?: (value: string | string[]) => void  // 值变化回调
  onClear?: () => void        // 清除回调
  className?: string          // 自定义样式类
  size?: 'small' | 'medium' | 'large'  // 尺寸
}
```

**使用示例**:
```tsx
import { FilterChips } from '@/components/common'

const categoryOptions = [
  { label: '全部', value: 'all', count: 123 },
  { label: '电子产品', value: 'electronics', count: 45 },
  { label: '服装鞋帽', value: 'clothing', count: 32 },
  { label: '食品饮料', value: 'food', count: 18 },
  { label: '图书音像', value: 'books', count: 28, disabled: true }
]

const [selectedCategory, setSelectedCategory] = useState('all')
const [selectedTags, setSelectedTags] = useState<string[]>([])

// 单选模式
<FilterChips
  options={categoryOptions}
  value={selectedCategory}
  clearable
  onChange={(value) => setSelectedCategory(value as string)}
  onClear={() => setSelectedCategory('all')}
/>

// 多选模式
<FilterChips
  options={categoryOptions}
  value={selectedTags}
  multiple
  clearable
  size="small"
  onChange={(value) => setSelectedTags(value as string[])}
/>
```

### ProgressBar 进度条
**文件位置**: `src/components/common/ProgressBar/index.tsx`

**功能描述**: 统一的进度条组件，支持多种样式和动画效果。

**Props接口**:
```typescript
interface ProgressBarProps {
  percentage: number           // 进度百分比 (0-100)
  showText?: boolean          // 显示百分比文本
  color?: string              // 进度条颜色
  backgroundColor?: string    // 背景色
  height?: number             // 高度 (px)
  animated?: boolean          // 动画效果
  striped?: boolean           // 条纹样式
  className?: string          // 自定义样式类
  textInside?: boolean        // 文本在进度条内部
  format?: (percentage: number) => string  // 自定义文本格式
}
```

**使用示例**:
```tsx
import { ProgressBar } from '@/components/common'

// 基础使用
<ProgressBar percentage={75} showText />

// 自定义样式
<ProgressBar
  percentage={60}
  color="#10b981"
  backgroundColor="#f3f4f6"
  height={8}
  animated
  striped
/>

// 自定义文本格式
<ProgressBar
  percentage={85}
  showText
  textInside
  format={(percent) => `已完成 ${percent}%`}
/>

// 任务进度示例
<div className="task-progress">
  <Text>包装进度</Text>
  <ProgressBar
    percentage={taskProgress}
    showText
    color={taskProgress === 100 ? '#10b981' : '#3b82f6'}
    animated
  />
</div>
```

### PageHeader 页面标题
**文件位置**: `src/components/common/PageHeader/index.tsx`

**功能描述**: 统一的页面标题组件，支持副标题、操作按钮和统计信息。

**Props接口**:
```typescript
interface PageHeaderProps {
  title: string                // 主标题
  subtitle?: string           // 副标题
  description?: string        // 描述文本
  avatar?: React.ReactNode    // 头像或图标
  extra?: React.ReactNode     // 额外内容（操作按钮等）
  tags?: React.ReactNode      // 标签区域
  breadcrumb?: React.ReactNode // 面包屑导航
  onBack?: () => void         // 返回按钮回调
  className?: string          // 自定义样式类
}
```

**使用示例**:
```tsx
import { PageHeader, Icon } from '@/components/common'

// 基础使用
<PageHeader
  title="库存管理"
  subtitle="成品库存总览"
  description="查看和管理所有库存商品"
/>

// 带操作按钮
<PageHeader
  title="产品详情"
  subtitle="iPhone 14 Pro Max"
  avatar={<Icon name="smartphone" size={24} />}
  extra={[
    <Button key="edit" size="small">编辑</Button>,
    <Button key="delete" size="small" type="danger">删除</Button>
  ]}
  onBack={() => Taro.navigateBack()}
/>

// 带统计信息
<PageHeader
  title="今日概览"
  extra={
    <StatsGrid
      data={[
        { label: '销售额', value: '￥12,345' },
        { label: '订单数', value: '123' }
      ]}
      columns={2}
    />
  }
/>
```

---

## 🎣 新增 Hooks

### useListQuery 列表查询
**文件位置**: `src/hooks/useListQuery.ts`

**功能描述**: 提供列表数据查询、分页、刷新等功能的通用 Hook，支持过滤条件和状态管理。

**接口定义**:
```typescript
interface UseListQueryOptions<TItem, TResponse, TFilters> {
  fetcher: (params: ListFetcherParams<TFilters>) => Promise<TResponse>
  transform: (response: TResponse, previousItems: TItem[], params: ListFetcherParams<TFilters>) => UseListQueryTransformResult<TItem>
  initialItems?: TItem[]
  initialFilters?: TFilters
  pageSize?: number
  autoFetch?: boolean
  toastError?: boolean
}

interface UseListQueryReturn<TItem, TFilters> {
  items: TItem[]                // 列表数据
  loading: boolean              // 加载状态
  refreshing: boolean           // 刷新状态
  loadingMore: boolean          // 加载更多状态
  error: Error | null           // 错误信息
  hasMore: boolean              // 是否有更多数据
  filters: TFilters             // 当前过滤条件
  totalCount: number            // 总数量
  currentPage: number           // 当前页码
  refresh: () => Promise<void>  // 刷新方法
  loadMore: () => Promise<void> // 加载更多方法
  setFilters: (filters: Partial<TFilters>) => void  // 设置过滤条件
  retry: () => Promise<void>    // 重试方法
}
```

**使用示例**:
```tsx
import { useListQuery } from '@/hooks/useListQuery'
import { getProducts } from '@/services/products'

interface Product {
  id: string
  name: string
  price: number
  category: string
}

interface ProductFilters {
  keyword?: string
  category?: string
  shop?: string
}

const ProductList: React.FC = () => {
  const {
    items: products,
    loading,
    refreshing,
    loadingMore,
    hasMore,
    filters,
    refresh,
    loadMore,
    setFilters
  } = useListQuery<Product, any, ProductFilters>({
    fetcher: getProducts,
    transform: (response, previousItems, params) => ({
      items: params.refresh ? response.data : [...previousItems, ...response.data],
      total: response.total,
      page: params.page,
      hasMore: response.data.length === params.pageSize
    }),
    initialFilters: { keyword: '', category: 'all' },
    pageSize: 20,
    autoFetch: true,
    toastError: true
  })

  return (
    <View>
      {/* 搜索和筛选 */}
      <SearchBar
        value={filters.keyword}
        onSearch={(keyword) => setFilters({ keyword })}
      />
      
      <FilterChips
        options={categoryOptions}
        value={filters.category}
        onChange={(category) => setFilters({ category })}
      />

      {/* 列表内容 */}
      <PullToRefresh refreshing={refreshing} onRefresh={refresh}>
        {products.map(product => (
          <ProductCard key={product.id} data={product} />
        ))}
        
        {loadingMore && <Loading />}
        {hasMore && (
          <Button onClick={loadMore} loading={loadingMore}>
            加载更多
          </Button>
        )}
      </PullToRefresh>
    </View>
  )
}
```

### useFilters 筛选管理
**文件位置**: `src/hooks/useFilters.ts`

**功能描述**: 提供筛选状态管理和操作的通用 Hook，支持多种筛选类型。

**接口定义**:
```typescript
interface UseFiltersOptions<T extends Record<string, any>> {
  initialFilters?: T            // 初始筛选值
  onChange?: (filters: T) => void  // 筛选变化回调
}

interface UseFiltersReturn<T> {
  filters: T                    // 当前筛选值
  setFilter: (key: keyof T, value: T[keyof T]) => void  // 设置单个筛选
  setFilters: (filters: Partial<T>) => void  // 设置多个筛选
  resetFilters: () => void      // 重置筛选
  clearFilter: (key: keyof T) => void  // 清除单个筛选
  hasActiveFilters: boolean     // 是否有活跃筛选
  getChipProps: () => FilterChipsProps  // 获取筛选器组件属性
}
```

**使用示例**:
```tsx
import { useFilters } from '@/hooks/useFilters'

interface InventoryFilters {
  category: string
  shop: string
  status: string
  priceRange: [number, number]
}

const InventoryPage: React.FC = () => {
  const {
    filters,
    setFilter,
    setFilters,
    resetFilters,
    hasActiveFilters,
    getChipProps
  } = useFilters<InventoryFilters>({
    initialFilters: {
      category: 'all',
      shop: 'all',
      status: 'all',
      priceRange: [0, 10000]
    },
    onChange: (newFilters) => {
      // 筛选变化时重新查询数据
      refetchProducts(newFilters)
    }
  })

  return (
    <View>
      {/* 快速筛选 */}
      <FilterChips
        {...getChipProps()}
        options={categoryOptions}
        value={filters.category}
        onChange={(value) => setFilter('category', value)}
      />

      {/* 高级筛选 */}
      <View className="advanced-filters">
        <Picker
          value={filters.shop}
          options={shopOptions}
          onChange={(value) => setFilter('shop', value)}
        />
        
        <Range
          value={filters.priceRange}
          min={0}
          max={10000}
          onChange={(value) => setFilter('priceRange', value)}
        />
      </View>

      {/* 重置按钮 */}
      {hasActiveFilters && (
        <Button onClick={resetFilters}>重置筛选</Button>
      )}
    </View>
  )
}
```

---

## 🎨 样式系统 (v2.0)

### Partials 结构
```
src/styles/partials/
├── _cards.scss         # 卡片样式
├── _stats.scss         # 统计组件样式  
├── _filters.scss       # 筛选器样式
├── _layouts.scss       # 布局样式
├── _interactions.scss  # 交互元素样式
├── _mixins.scss        # 通用混入
└── _utilities.scss     # 工具类
```

### 布局 Mixins (_layouts.scss)
```scss
// 页面布局
@mixin page-wrapper {
  background: var(--bg-body);
  min-height: 100vh;
}

@mixin page-content {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-4);
  padding: var(--spacing-4);
  padding-bottom: calc(var(--spacing-6) + 40rpx);
}

@mixin page-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--spacing-4);
  background: var(--bg-white);
  border-bottom: 2rpx solid var(--border-light);
}

// 安全区域适配
@mixin safe-area-top {
  padding-top: constant(safe-area-inset-top);
  padding-top: env(safe-area-inset-top);
}

@mixin safe-area-bottom {
  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);
}
```

### 交互 Mixins (_interactions.scss)
```scss
// 触摸反馈
@mixin touch-active {
  &:active {
    transform: scale(0.98);
    opacity: 0.8;
  }
}

@mixin touch-active-scale($scale: 0.95) {
  transition: transform 0.15s ease;
  
  &:active {
    transform: scale($scale);
  }
}

// 操作项样式
@mixin action-item {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  padding: var(--spacing-3) var(--spacing-4);
  background: var(--bg-white);
  border-radius: var(--radius-lg);
  @include touch-active;
}

// 头像 + 操作布局
@mixin avatar-with-action {
  display: flex;
  align-items: center;
  gap: var(--spacing-3);
  
  .avatar {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    flex-shrink: 0;
  }
  
  .content {
    flex: 1;
    min-width: 0;
  }
  
  .action {
    flex-shrink: 0;
  }
}
```

### 工具类 (_utilities.scss)
```scss
// 间距工具类
.safe-bottom {
  @include safe-area-bottom;
}

// 滚动优化
.scroll-x {
  overflow-x: auto;
  overflow-y: hidden;
  -webkit-overflow-scrolling: touch;
  
  &::-webkit-scrollbar {
    display: none;
  }
}

// 文本截断
.line-clamp-1 {
  @include line-clamp(1);
}

.line-clamp-2 {
  @include line-clamp(2);
}

.line-clamp-3 {
  @include line-clamp(3);
}

// 触摸优化
.touch-active {
  @include touch-active;
}
```

### 使用示例
```scss
// 在页面 SCSS 中使用
@use '@/styles/partials/layouts';
@use '@/styles/partials/interactions';

.inventory-page {
  @include layouts.page-wrapper;

  &__content {
    @include layouts.page-content;
  }

  &__action-button {
    @include interactions.action-item;
    @include interactions.touch-active-scale(0.96);
  }
}
```

---

## 📋 最佳实践

### 组件使用原则

1. **组件组合**: 优先使用组件组合而非创建新组件
2. **响应式设计**: 所有组件都应支持移动端适配
3. **无障碍访问**: 提供合适的 aria 标签和语义化结构
4. **性能优化**: 避免不必要的重渲染，合理使用 memo

### 代码示例

```tsx
// ✅ 推荐：组件组合
<SectionCard title="用户统计" compact>
  <StatsGrid data={userStats} columns={2} />
</SectionCard>

// ❌ 不推荐：创建专门的 UserStatsCard 组件

// ✅ 推荐：响应式使用
<StatsGrid 
  data={stats} 
  columns={windowWidth > 414 ? 3 : 2} 
/>

// ✅ 推荐：无障碍优化
<InfoList
  items={[
    {
      label: '电话',
      value: phoneNumber,
      onClick: () => Taro.makePhoneCall({ phoneNumber }),
      extra: <Icon name="phone" aria-label="拨打电话" />
    }
  ]}
/>
```

### 性能优化建议

1. **列表渲染**: 使用 `useListQuery` 实现虚拟滚动和分页
2. **图片优化**: 使用合适的图片尺寸和格式
3. **状态管理**: 避免过度使用全局状态
4. **代码分割**: 按页面和功能模块分割代码

---

*更新时间: 2025-10-05*  
*版本: v2.0*

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

## 🎨 样式partials系统

### 样式分层架构
在完成页面重构后，我们建立了系统化的样式partials架构：

```
src/styles/partials/
├── _layouts.scss      # 页面布局mixins
├── _interactions.scss # 交互元素mixins
├── _mixins.scss      # 通用工具mixins
├── _utilities.scss   # 工具类
├── _cards.scss       # 卡片样式
├── _stats.scss       # 统计组件样式
└── _filters.scss     # 筛选组件样式
```

### 布局Mixins (_layouts.scss)
```scss
@use '../../styles/partials/layouts' as layouts;

// 标准页面包装器
.page {
  @include layouts.page-wrapper;
}

// 页面内容容器
.page-content {
  @include layouts.page-content;
}

// 操作网格布局
.actions-grid {
  @include layouts.action-grid;
}

// 页面标题头部
.page-header {
  @include layouts.page-header;
  
  &__content {
    @include layouts.page-header-content;
  }
  
  &__back-button {
    @include layouts.header-back-button;
  }
  
  &__title {
    @include layouts.page-title;
  }
}
```

### 交互Mixins (_interactions.scss)
```scss
@use '../../styles/partials/interactions' as interactions;

// 可点击操作项
.action-item {
  @include interactions.action-item;
  
  &__icon {
    @include interactions.action-icon;
  }
}

// 头像加操作按钮
.avatar-section {
  @include interactions.avatar-with-action(128rpx);
}

// 信息行布局
.info-row {
  @include interactions.info-row;
}

// 可点击行
.clickable-row {
  @include interactions.clickable-row;
}

// Tab导航
.tab-nav {
  @include interactions.tab-navigation;
}

// 搜索输入框
.search-input {
  @include interactions.search-input;
}
```

### 通用工具Mixins (_mixins.scss)
```scss
@use '../../styles/partials/mixins' as mixins;

// 触摸反馈
.touch-active {
  @include mixins.touch-active;
}

// 可缩放触摸反馈
.touch-scale {
  @include mixins.touch-active-scale(0.98);
}

// 文本截断
.text-ellipsis {
  @include mixins.text-ellipsis;
}

// 多行截断
.line-clamp-2 {
  @include mixins.line-clamp(2);
}

// 安全区域适配
.safe-bottom {
  @include mixins.safe-area-bottom;
}

// 水平滚动
.scroll-x {
  @include mixins.scroll-x;
}
```

### 使用指南

#### 1. 在页面组件中使用
```scss
// src/pages/example/index.scss
@use "../../styles/partials/layouts" as layouts;
@use "../../styles/partials/interactions" as interactions;

.example-page {
  @include layouts.page-wrapper;
  
  &__content {
    @include layouts.page-content;
  }
  
  &__action-grid {
    @include layouts.action-grid;
  }
  
  &__action-item {
    @include interactions.action-item;
  }
}
```

#### 2. 样式迁移最佳实践

**迁移前** (重复代码):
```scss
.page-a {
  background: var(--bg-body);
  
  &__content {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    padding-bottom: calc(var(--spacing-6) + 40rpx);
  }
}

.page-b {
  background: var(--bg-body);
  
  &__wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-4);
    padding: var(--spacing-4);
    padding-bottom: calc(var(--spacing-6) + 40rpx);
  }
}
```

**迁移后** (复用partials):
```scss
@use "../../styles/partials/layouts" as layouts;

.page-a {
  @include layouts.page-wrapper;
  
  &__content {
    @include layouts.page-content;
  }
}

.page-b {
  @include layouts.page-wrapper;
  
  &__wrapper {
    @include layouts.page-content;
  }
}
```

#### 3. 已迁移的页面
以下页面已完成样式partials迁移：
- ✅ `src/pages/index/index.scss` - 使用 layouts + interactions
- ✅ `src/pages/help/index.scss` - 使用 layouts 完整套装  
- ✅ `src/pages/profile/index.scss` - 使用 layouts + mixins
- 🚧 其他页面逐步迁移中...

### 计划更新
- 📊 新增图表组件 (ChartCard)
- 📱 新增手势操作组件 (SwipeAction)
- 🔍 新增高级搜索组件 (AdvancedSearch)
- 📋 新增虚拟列表组件 (VirtualList)
- 🎨 完成所有页面样式partials迁移

---

**组件库维护**: 前端开发团队  
**技术支持**: frontend@easy-erp.com  
**最后更新**: 2025年1月5日 (新增样式partials系统)