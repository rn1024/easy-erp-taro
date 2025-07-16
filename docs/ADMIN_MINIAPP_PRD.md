# Taro + NutUI 管理后台小程序功能说明书(PRD)

## 📋 文档说明
完全根据提供的思维导图整理，仅保留原有功能，不额外扩展。可直接作为产品需求文档（PRD）或前端页面设计的依据。

## 🏗️ 总体结构

| 一级菜单 | 二级/页面 | 关键功能点 | 典型 NutUI 组件 / API |
|---------|-----------|-----------|---------------------|
| 登陆 | — | • 用户名 + 密码登录<br/>• 登录后保存 token 到 Taro storage | Form、Input、Button |
| 信息查询 | 扫描功能 | • 调用 Taro.scanCode 识别条码<br/>• 根据条码回传的 SKU / 商品标签查询产品<br/>• 查询成功后展示产品数据 | Scanner、自定义 Result 卡片、Modal |
| | SKU 搜索 | • 手动输入或扫码得到 SKU<br/>• 调用 /products/:sku 接口获取详情并展示 | SearchBar、List、Cell |
| 库存管理 | 成品库存 | **列表页**<br/>• 字段：店铺 / 产品分类 / 产品昵称 / 外箱尺寸 / 装箱数量 / 重量 / 货位 / 库存数量<br/>• 支持分页、搜索、筛选<br/>**操作页**<br/>• 新增、编辑、删除成品库存 | Table、Pagination、Tag、Dialog、Form |
| | 散件库存 | **列表页**<br/>• 字段：店铺 / 产品分类 / 产品昵称 / 散件类型(套/个) / 货位 / 数量<br/>**操作页**<br/>• 新增、编辑、删除散件库存 | 同上 |
| 仓库任务 | 包装任务 | **列表页**<br/>• 字段：店铺 / 分类 / 产品昵称 / 总数量 / 进度 / 状态 (待到货 · 等待包装 · 正在包装 · 已完成)<br/>**编辑状态**<br/>• 通过下拉或滑动按钮修改状态 | Steps、Progress、SwipeAction、Select |
| | 发货任务 | **列表页**<br/>• 字段：店铺 / 产品分类 / 产品昵称 / 总箱数 / FBA件码 / FBA仓编号 / 国家 / 渠道 / 货代公司 / 运单编码 / 仓库发货类型 / 截止发票 / 进仓收货期限 / 头程物流清关 / 日期 / 状态 (仓库待发货 · 仓库已发货 · 在途 · 到港 · 交付 · 等待接收 · 正在接收 · 已完成)<br/>**编辑状态**<br/>• 与包装任务相同 | Table、Sticky、Select、Dialog |
| 产品管理 | 产品列表 | • 字段：店铺(必填) / 产品分类 / 产品昵称 / 产品信息 / 产品包装 / 产品外箱 / 配件信息 / 备注<br/>• 可查看、搜索、筛选 | Table、SearchBar、Popup |

## 📱 页面级别详细描述

### 2.1 登陆页
- **路径**: `/pages/login/index`
- **流程**: 输入账号 → 校验 → 保存 token → 跳转首页
- **关键点**: 
  - 表单校验
  - 错误提示
  - 记住密码（可选）
- **技术要点**:
  - 使用 `Taro.setStorage` 保存 token
  - 表单验证使用 NutUI Form 组件
  - 支持快捷登录记忆

### 2.2 信息查询

#### 2.2.1 扫描功能
- **路径**: `/pages/query/scan/index`
- **入口**: 导航栏按钮或底部 Tab
- **流程**: 调用 Taro.scanCode → 获取字符串 → 判断是条码或 SKU → 查询接口 → 显示结果
- **UI组件**:
  - 扫描按钮：MaterialIcons `qr_code_scanner`
  - 结果展示：自定义 `ScanResult` 卡片
  - 历史记录：NutUI `List` 组件
- **错误处理**:
  - 扫码失败提示
  - 查询无结果提示
  - 网络异常处理

#### 2.2.2 SKU 搜索
- **路径**: `/pages/query/sku/index`
- **入口**: 顶部搜索框
- **流程**: 输入 SKU → 实时模糊匹配或回车查询 → 列表或详情弹窗展示
- **功能特性**:
  - 实时搜索建议
  - 搜索历史记录
  - 结果高亮显示
  - 支持扫码输入SKU

### 2.3 库存管理

#### 2.3.1 成品库存
- **路径**: `/pages/inventory/finished/index`
- **布局**: 一级 Tab 切换「成品库存」「散件库存」
- **列表页功能**:
  - 统一表格组件 + 顶部筛选（店铺、分类、货位等）
  - 字段显示：店铺/产品分类/产品昵称/外箱尺寸/装箱数量/重量/货位/库存数量
  - 支持：分页、搜索、筛选
- **操作页功能**:
  - 复用表单组件，新建/编辑时带校验
  - 删除前弹确认框
  - 表单字段验证规则

#### 2.3.2 散件库存
- **路径**: `/pages/inventory/spare/index`
- **字段差异**: 散件类型(套/个) 替代 外箱尺寸/装箱数量/重量
- **功能**: 与成品库存基本一致，共用组件架构
- **特殊字段**:
  - 散件类型：下拉选择 '套' | '个'
  - 数量单位：与散件类型联动

### 2.4 仓库任务

#### 2.4.1 包装任务
- **路径**: `/pages/warehouse/package/index`
- **状态流程**: 待到货 → 等待包装 → 正在包装 → 已完成
- **进度/状态显示**:
  - 装载 Steps 组件直观展示流程
  - Progress 显示完成百分比
  - 状态修改入口可做成 SwipeAction 或右侧「编辑」按钮
- **字段**: 店铺/分类/产品昵称/总数量/进度/状态
- **交互**: 
  - 支持批量状态更新
  - 进度可手动调整
  - 状态变更有确认提示

#### 2.4.2 发货任务
- **路径**: `/pages/warehouse/shipment/index`
- **复杂字段**: 店铺/产品分类/产品昵称/总箱数/FBA件码/FBA仓编号/国家/渠道/货代公司/运单编码/仓库发货类型/截止发票/进仓收货期限/头程物流清关/日期/状态
- **状态流程**: 仓库待发货 → 仓库已发货 → 在途 → 到港 → 交付 → 等待接收 → 正在接收 → 已完成
- **技术处理**:
  - 字段多、横向滚动：NutUI Sticky + Table 组合以保证可读性
  - 关键字段置前显示
  - 详细信息支持展开/收起

### 2.5 产品管理
- **路径**: `/pages/products/index`
- **字段**: 店铺(必填)/产品分类/产品昵称/产品信息/产品包装/产品外箱/配件信息/备注
- **功能限制**: 依据思维导图原意，仅保留列表功能
- **UI设计**:
  - 产品列表：字段较多，优先展示关键列（店铺/分类/昵称）
  - 其余信息点开查看详情
  - 搜索 & 筛选：顶部 SearchBar + Drawer 弹出高级筛选
- **操作**: 暂仅查询，无新增/删改按钮

## 📊 数据模型定义

### 产品模型
```typescript
interface Product {
  id: string
  shop: string          // 店铺(必填)
  category: string      // 产品分类
  name: string          // 产品昵称
  sku: string           // SKU编码
  label: string         // 条码标签
  packageInfo: string   // 产品包装
  outerBoxInfo: string  // 产品外箱
  accessoriesInfo: string // 配件信息
  remark: string        // 备注
}
```

### 库存模型
```typescript
// 成品库存
interface FinishedInventory {
  id: string
  productId: string
  shop: string          // 店铺
  category: string      // 产品分类
  productName: string   // 产品昵称
  outerSize: string     // 外箱尺寸
  cartonQty: number     // 装箱数量
  weight: number        // 重量
  location: string      // 货位
  quantity: number      // 库存数量
}

// 散件库存
interface SpareInventory {
  id: string
  productId: string
  shop: string          // 店铺
  category: string      // 产品分类
  productName: string   // 产品昵称
  spareType: '套' | '个' // 散件类型
  location: string      // 货位
  quantity: number      // 数量
}
```

### 任务模型
```typescript
// 包装任务
interface PackageTask {
  id: string
  shop: string              // 店铺
  category: string          // 分类
  productName: string       // 产品昵称
  totalQty: number         // 总数量
  progress: number         // 进度 (0-100)
  status: '待到货' | '等待包装' | '正在包装' | '已完成'
  createdAt: string
  updatedAt: string
}

// 发货任务
interface ShipmentTask {
  id: string
  shop: string              // 店铺
  category: string          // 产品分类
  productName: string       // 产品昵称
  totalBoxes: number        // 总箱数
  fbaCode: string           // FBA件码
  fbaWarehouse: string      // FBA仓编号
  country: string           // 国家
  channel: string           // 渠道
  logistics: string         // 货代公司
  trackingCode: string      // 运单编码
  warehouseType: string     // 仓库发货类型
  invoiceDeadline: string   // 截止发票
  receiveDeadline: string   // 进仓收货期限
  clearance: string         // 头程物流清关
  date: string             // 日期
  status: '仓库待发货' | '仓库已发货' | '在途' | '到港' | '交付' | '等待接收' | '正在接收' | '已完成'
  createdAt: string
  updatedAt: string
}
```

## 🔐 权限 & 路由设计

### 角色权限
```typescript
interface UserRole {
  operator: {
    permissions: ['query:read', 'inventory:all', 'warehouse:all']
    routes: ['/query', '/inventory', '/warehouse']
  }
  admin: {
    permissions: ['*']
    routes: ['*']
  }
}
```

### 路由配置
```typescript
const routes = [
  { path: '/login', public: true },
  { 
    path: '/query', 
    roles: ['operator', 'admin'],
    children: [
      { path: '/scan', component: 'ScanPage' },
      { path: '/sku', component: 'SkuSearchPage' }
    ]
  },
  { 
    path: '/inventory', 
    roles: ['operator', 'admin'],
    children: [
      { path: '/finished', component: 'FinishedInventoryPage' },
      { path: '/spare', component: 'SpareInventoryPage' }
    ]
  },
  { 
    path: '/warehouse', 
    roles: ['operator', 'admin'],
    children: [
      { path: '/package', component: 'PackageTaskPage' },
      { path: '/shipment', component: 'ShipmentTaskPage' }
    ]
  },
  { 
    path: '/products', 
    roles: ['admin'],
    component: 'ProductListPage'
  }
]
```

## 🎯 技术栈约定

### 前端技术栈
- **前端框架**: Taro v4 (React)
- **UI 组件库**: NutUI 4.x（含 Table、Form、Dialog 等）
- **状态管理**: Zustand（已选定）
- **请求库**: Taro.request 封装 + Axios 风格 Promise

### 关键技术实现

#### 扫码功能
```typescript
// 扫码API封装
const scanCode = async (): Promise<string> => {
  const result = await Taro.scanCode({
    scanType: ['barCode', 'qrCode'],
    autoZoom: true
  })
  return result.result
}
```

#### 表单验证
```typescript
// 统一表单验证规则
const validationRules = {
  shop: { required: true, message: '请选择店铺' },
  category: { required: true, message: '请选择产品分类' },
  quantity: { 
    required: true, 
    type: 'number', 
    min: 0, 
    message: '请输入有效数量' 
  }
}
```

#### 状态管理
```typescript
// 使用 Zustand 的状态结构
interface AppStore {
  user: UserState
  inventory: InventoryState
  tasks: TaskState
  products: ProductState
}
```

## 📋 开发清单

### 页面开发清单
- [ ] 登录页 (`/login`)
- [ ] 扫描功能页 (`/query/scan`) 
- [ ] SKU搜索页 (`/query/sku`)
- [ ] 成品库存页 (`/inventory/finished`)
- [ ] 散件库存页 (`/inventory/spare`)
- [ ] 包装任务页 (`/warehouse/package`)
- [ ] 发货任务页 (`/warehouse/shipment`)
- [ ] 产品列表页 (`/products`)

### 组件开发清单
- [ ] ScannerCard - 扫描结果卡片
- [ ] ProductTable - 产品表格
- [ ] InventoryForm - 库存表单
- [ ] TaskProgress - 任务进度
- [ ] StatusSelector - 状态选择器
- [ ] FilterDrawer - 筛选抽屉
- [ ] DataTable - 通用数据表格

### API接口清单
- [ ] POST `/auth/login` - 用户登录
- [ ] GET `/products/:sku` - 根据SKU查询产品
- [ ] GET `/products` - 产品列表查询
- [ ] GET `/inventory/finished` - 成品库存列表
- [ ] POST `/inventory/finished` - 新增成品库存
- [ ] PUT `/inventory/finished/:id` - 更新成品库存
- [ ] DELETE `/inventory/finished/:id` - 删除成品库存
- [ ] GET `/inventory/spare` - 散件库存列表
- [ ] 散件库存的 CRUD 接口
- [ ] GET `/tasks/package` - 包装任务列表
- [ ] PUT `/tasks/package/:id/status` - 更新包装任务状态
- [ ] GET `/tasks/shipment` - 发货任务列表
- [ ] PUT `/tasks/shipment/:id/status` - 更新发货任务状态

---

**确认要点**:
1. 功能范围是否符合预期？
2. 数据模型设计是否完整？
3. 页面交互流程是否清晰？
4. 技术实现方案是否可行？ 