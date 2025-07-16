# Taro + NutUI 管理后台小程序 - 项目规划

## 📋 项目概述

基于现有 Easy ERP Taro 项目架构，开发一个管理后台小程序，主要用于仓库管理、库存查询、产品管理等企业级功能。

### 技术栈
- **框架**: Taro 4.1.2 + React 18 + TypeScript 4.7+
- **UI组件**: @nutui/nutui-react-taro 3.0.16
- **图标**: taro-icons MaterialIcons
- **状态管理**: Zustand 4.5.0
- **样式**: SCSS + rpx 单位
- **包管理**: pnpm

## 🏗️ 项目架构设计

### 目录结构
```
src/
├── components/           # 共用组件
│   ├── ScannerCard/     # 扫描结果展示卡片
│   ├── ProductTable/    # 产品表格组件
│   ├── TaskProgress/    # 任务进度组件
│   ├── FilterDrawer/    # 筛选抽屉
│   └── FormModal/       # 表单弹窗
├── pages/               # 页面模块
│   ├── login/           # 登录页
│   ├── query/           # 信息查询
│   │   ├── scan/        # 扫描功能
│   │   └── sku/         # SKU搜索
│   ├── inventory/       # 库存管理
│   │   ├── finished/    # 成品库存
│   │   └── spare/       # 散件库存
│   ├── warehouse/       # 仓库任务
│   │   ├── package/     # 包装任务
│   │   └── shipment/    # 发货任务
│   └── products/        # 产品管理
├── stores/              # 状态管理
├── services/            # API 服务
├── types/               # 类型定义
└── utils/               # 工具函数
```

## 📱 功能模块规划

### 1. 登录模块
**页面**: `/pages/login/`
- **功能**: 用户名密码登录，token存储
- **组件**: 
  - NutUI: `Form`, `Input`, `Button`
  - 自定义: `LoginForm`
- **状态管理**: 用户信息、token持久化
- **路由守卫**: 登录状态检查

### 2. 信息查询模块
**页面**: `/pages/query/`

#### 2.1 扫描功能 (`/scan/`)
- **核心API**: `Taro.scanCode()`
- **组件**: 
  - NutUI: `Modal`, `Cell`
  - 自定义: `ScannerCard`, `ProductResult`
- **流程**: 扫码 → 解析 → API查询 → 结果展示

#### 2.2 SKU搜索 (`/sku/`)
- **组件**: 
  - NutUI: `SearchBar`, `List`, `Cell`
  - 自定义: `SkuSearch`, `ProductList`
- **功能**: 实时搜索、历史记录、结果缓存

### 3. 库存管理模块
**页面**: `/pages/inventory/`

#### 3.1 成品库存 (`/finished/`)
- **字段**: 店铺/产品分类/产品昵称/外箱尺寸/装箱数量/重量/货位/库存数量
- **组件**: 
  - NutUI: `Table`, `Pagination`, `Tag`, `Dialog`, `Form`
  - 自定义: `InventoryTable`, `InventoryForm`

#### 3.2 散件库存 (`/spare/`)
- **字段**: 店铺/产品分类/产品昵称/散件类型/货位/数量
- **组件**: 复用成品库存组件架构
- **操作**: 新增、编辑、删除

### 4. 仓库任务模块
**页面**: `/pages/warehouse/`

#### 4.1 包装任务 (`/package/`)
- **字段**: 店铺/分类/产品昵称/总数量/进度/状态
- **状态**: 待到货 → 等待包装 → 正在包装 → 已完成
- **组件**: 
  - NutUI: `Steps`, `Progress`, `SwipeAction`, `Select`
  - 自定义: `TaskCard`, `StatusSelector`

#### 4.2 发货任务 (`/shipment/`)
- **字段**: [详见功能说明书复杂字段集]
- **状态**: 仓库待发货 → ... → 已完成
- **组件**: 
  - NutUI: `Table`, `Sticky`, `Select`, `Dialog`
  - 自定义: `ShipmentTable`, `StatusFlow`

### 5. 产品管理模块
**页面**: `/pages/products/`
- **功能**: 产品列表查看、搜索、筛选
- **字段**: 店铺/产品分类/产品昵称/产品信息/产品包装/产品外箱/配件信息/备注
- **组件**: 
  - NutUI: `Table`, `SearchBar`, `Popup`
  - 自定义: `ProductTable`, `ProductDetail`

## 🔐 权限设计

### 角色权限矩阵
| 功能模块 | 操作员 | 管理员 |
|---------|--------|--------|
| 登录 | ✅ | ✅ |
| 信息查询 | ✅ | ✅ |
| 库存管理 | ✅ | ✅ |
| 仓库任务 | ✅ | ✅ |
| 产品管理 | ❌ | ✅ |

### 路由权限
```typescript
// 路由配置
const routes = [
  { path: '/login', public: true },
  { path: '/query', roles: ['operator', 'admin'] },
  { path: '/inventory', roles: ['operator', 'admin'] },
  { path: '/warehouse', roles: ['operator', 'admin'] },
  { path: '/products', roles: ['admin'] }
]
```

## 📊 数据模型设计

### 核心类型定义
```typescript
// 用户角色
type UserRole = 'operator' | 'admin'

// 任务状态
type PackageStatus = '待到货' | '等待包装' | '正在包装' | '已完成'
type ShipmentStatus = '仓库待发货' | '仓库已发货' | '在途' | '到港' | '交付' | '等待接收' | '正在接收' | '已完成'

// 产品模型
interface Product {
  id: string
  shop: string
  category: string
  name: string
  sku: string
  label: string
  packageInfo: string
  outerBoxInfo: string
  accessoriesInfo: string
  remark: string
}

// 库存模型
interface Inventory {
  id: string
  productId: string
  shop: string
  location: string
  quantity: number
  unit: '箱' | '套' | '个'
  // 成品专用字段
  outerSize?: string
  cartonQty?: number
  weight?: number
  // 散件专用字段
  spareType?: '套' | '个'
}

// 任务模型
interface Task {
  id: string
  type: 'package' | 'shipment'
  productId: string
  shop: string
  totalQty: number
  progress: number
  status: PackageStatus | ShipmentStatus
  createdAt: string
  updatedAt: string
  // 发货任务额外字段
  fbaCode?: string
  fbaWarehouse?: string
  country?: string
  channel?: string
  logistics?: string
  trackingCode?: string
  warehouseType?: string
  invoiceDeadline?: string
  receiveDeadline?: string
  clearance?: string
}
```

## 🛠️ 技术实现规划

### 1. 状态管理架构
```typescript
// 使用 Zustand 设计状态store
interface AppState {
  user: UserState
  products: ProductState
  inventory: InventoryState
  tasks: TaskState
}

// 示例：用户状态
interface UserState {
  userInfo: User | null
  token: string | null
  permissions: string[]
  login: (credentials: LoginForm) => Promise<void>
  logout: () => void
}
```

### 2. API 服务设计
```typescript
// API 服务封装
class ApiService {
  // 产品相关
  static getProductBySku(sku: string): Promise<Product>
  static getProductList(params: ProductQuery): Promise<PaginatedResponse<Product>>
  
  // 库存相关
  static getInventoryList(params: InventoryQuery): Promise<PaginatedResponse<Inventory>>
  static createInventory(data: CreateInventoryData): Promise<Inventory>
  static updateInventory(id: string, data: UpdateInventoryData): Promise<Inventory>
  static deleteInventory(id: string): Promise<void>
  
  // 任务相关
  static getTaskList(params: TaskQuery): Promise<PaginatedResponse<Task>>
  static updateTaskStatus(id: string, status: TaskStatus): Promise<Task>
}
```

### 3. 组件复用策略
- **表格组件**: 统一 `DataTable` 支持排序、筛选、分页
- **表单组件**: 统一 `FormModal` 支持新增、编辑模式
- **搜索组件**: 统一 `SearchFilter` 支持多条件筛选
- **状态组件**: 统一 `StatusIndicator` 支持多种状态展示

## 📋 开发计划

### Phase 1: 基础架构 (1周)
- [ ] 项目初始化和环境配置
- [ ] 路由系统和权限控制
- [ ] API 服务封装
- [ ] 基础组件开发

### Phase 2: 核心功能 (2周)
- [ ] 登录模块
- [ ] 信息查询模块
- [ ] 库存管理模块

### Phase 3: 高级功能 (2周)
- [ ] 仓库任务模块
- [ ] 产品管理模块
- [ ] 权限细化

### Phase 4: 优化完善 (1周)
- [ ] 性能优化
- [ ] 错误处理
- [ ] 用户体验优化
- [ ] 测试和文档

## 🎯 关键技术点

### 1. 扫码功能实现
```typescript
// 扫码服务
class ScanService {
  static async scanCode(): Promise<string> {
    try {
      const result = await Taro.scanCode({
        scanType: ['barCode', 'qrCode']
      })
      return result.result
    } catch (error) {
      throw new ScanError('扫码失败')
    }
  }
}
```

### 2. 表格横向滚动优化
```scss
// 移动端表格优化
.data-table {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  
  &__sticky-header {
    position: sticky;
    top: 0;
    background: #fff;
    z-index: 10;
  }
}
```

### 3. 状态更新优化
```typescript
// 乐观更新策略
const updateTaskStatus = async (taskId: string, newStatus: TaskStatus) => {
  // 乐观更新UI
  updateTaskStatusOptimistic(taskId, newStatus)
  
  try {
    await ApiService.updateTaskStatus(taskId, newStatus)
  } catch (error) {
    // 回滚状态
    revertTaskStatus(taskId)
    showError('状态更新失败')
  }
}
```

## 📏 开发规范

遵循项目现有规范：
- 使用 TypeScript 严格模式
- 组件扁平化存放在 `@/components/`
- 页面使用 `MobileLayout` 包装
- 图标只使用 `MaterialIcons`
- 样式使用 SCSS + BEM 命名
- 单位使用 rpx
- 最小触摸目标 48rpx

## 🚀 部署策略

- **开发环境**: `pnpm run dev:weapp`
- **生产构建**: `pnpm run build:weapp`
- **包大小**: 控制在2MB主包 + 20MB分包内
- **分包策略**: 按功能模块分包

---

**确认要点**:
1. 是否同意此技术架构和开发规划？
2. 开发优先级是否需要调整？
3. 是否有其他技术要求或约束？ 