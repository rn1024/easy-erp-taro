// 管理后台用户角色类型
export type UserRole = 'operator' | 'admin'

// 包装任务状态枚举
export enum PackageStatus {
  PENDING_ARRIVAL = 'pending_arrival',    // 待到货
  WAITING_PACKAGE = 'waiting_package',    // 等待包装
  IN_PACKAGING = 'in_packaging',          // 正在包装
  COMPLETED = 'completed'                 // 已完成
}

// 发货任务状态枚举
export enum ShipmentStatus {
  WAREHOUSE_PENDING = 'warehouse_pending',       // 仓库待发货
  WAREHOUSE_SHIPPED = 'warehouse_shipped',       // 仓库已发货
  IN_TRANSIT = 'in_transit',                     // 在途
  ARRIVED_PORT = 'arrived_port',                 // 到港
  DELIVERED = 'delivered',                       // 交付
  WAITING_RECEIVE = 'waiting_receive',           // 等待接收
  IN_RECEIVING = 'in_receiving',                 // 正在接收
  COMPLETED = 'completed'                        // 已完成
}

// 状态显示名称映射
export const PackageStatusLabels: Record<PackageStatus, string> = {
  [PackageStatus.PENDING_ARRIVAL]: '待到货',
  [PackageStatus.WAITING_PACKAGE]: '等待包装', 
  [PackageStatus.IN_PACKAGING]: '正在包装',
  [PackageStatus.COMPLETED]: '已完成'
}

export const ShipmentStatusLabels: Record<ShipmentStatus, string> = {
  [ShipmentStatus.WAREHOUSE_PENDING]: '仓库待发货',
  [ShipmentStatus.WAREHOUSE_SHIPPED]: '仓库已发货',
  [ShipmentStatus.IN_TRANSIT]: '在途',
  [ShipmentStatus.ARRIVED_PORT]: '到港',
  [ShipmentStatus.DELIVERED]: '交付',
  [ShipmentStatus.WAITING_RECEIVE]: '等待接收',
  [ShipmentStatus.IN_RECEIVING]: '正在接收',
  [ShipmentStatus.COMPLETED]: '已完成'
}

// 产品模型 - 严格按照PRD定义
export interface Product {
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

// 成品库存模型 - 适配easy-erp-web API响应格式
export interface FinishedInventory {
  id: string
  shopId: string
  categoryId: string  
  productId: string
  boxSize?: string       // 外箱尺寸
  packQuantity?: number  // 装箱数量
  weight?: number        // 重量
  location?: string      // 货位
  stockQuantity: number  // 库存数量
  // 关联对象 - 由API返回
  shop: {
    id: string
    nickname: string
  }
  category: {
    id: string
    name: string
  }
  product: {
    id: string
    code: string
    specification: string
    sku: string
  }
  createdAt: string
  updatedAt: string
}

// 散件库存模型 - 适配easy-erp-web API响应格式
export interface SpareInventory {
  id: string
  shopId: string
  categoryId: string
  productId: string
  spareType: string     // 散件类型
  location?: string     // 货位
  quantity: number      // 数量
  // 关联对象 - 由API返回
  shop: {
    id: string
    nickname: string
  }
  category: {
    id: string
    name: string
  }
  product: {
    id: string
    code: string
    specification: string
    sku: string
  }
  createdAt: string
  updatedAt: string
}

// 仓库任务模型 - 适配easy-erp-web API响应格式
export interface WarehouseTask {
  id: string
  shopId: string
  categoryId?: string
  productId?: string
  operatorId?: string
  type: 'PACKAGE' | 'SHIPMENT'  // 任务类型
  status: string                // 任务状态
  totalQty?: number            // 总数量
  progress?: number            // 进度 (0-100)
  // 发货任务特有字段
  totalBoxes?: number          // 总箱数
  fbaCode?: string            // FBA件码
  fbaWarehouse?: string       // FBA仓编号
  country?: string            // 国家
  channel?: string            // 渠道
  logistics?: string          // 货代公司
  trackingCode?: string       // 运单编码
  warehouseType?: string      // 仓库发货类型
  invoiceDeadline?: string    // 截止发票
  receiveDeadline?: string    // 进仓收货期限
  clearance?: string          // 头程物流清关
  date?: string              // 日期
  // 关联对象 - 由API返回
  shop: {
    id: string
    nickname: string
  }
  operator?: {
    id: string
    name: string
  }
  createdAt: string
  updatedAt: string
}

// 向后兼容的包装任务类型
export interface PackageTask extends WarehouseTask {
  type: 'PACKAGE'
}

// 向后兼容的发货任务类型  
export interface ShipmentTask extends WarehouseTask {
  type: 'SHIPMENT'
}

// 查询相关类型
export interface ProductQuery {
  sku?: string
  shop?: string
  category?: string
  name?: string
  page?: number
  pageSize?: number
}

export interface InventoryQuery {
  shop?: string
  category?: string
  location?: string
  productName?: string
  page?: number
  pageSize?: number
}

export interface TaskQuery {
  shop?: string
  category?: string
  status?: PackageStatus | ShipmentStatus
  dateRange?: {
    start: string
    end: string
  }
  page?: number
  pageSize?: number
}

// 表单数据类型
export interface CreateInventoryData {
  productId: string
  shop: string
  category: string
  productName: string
  location: string
  quantity: number
  // 成品专用字段
  outerSize?: string
  cartonQty?: number
  weight?: number
  // 散件专用字段
  spareType?: '套' | '个'
}

export interface UpdateInventoryData extends Partial<CreateInventoryData> {
  id: string
}

// 登录相关类型
export interface LoginForm {
  username: string
  password: string
}

export interface AuthUser {
  id: string
  username: string
  name: string
  role: UserRole
  permissions: string[]
  token: string
}

// 权限枚举
export enum Permission {
  // 查询权限
  QUERY_READ = 'query:read',
  
  // 库存权限
  INVENTORY_READ = 'inventory:read',
  INVENTORY_CREATE = 'inventory:create',
  INVENTORY_UPDATE = 'inventory:update',
  INVENTORY_DELETE = 'inventory:delete',
  
  // 任务权限
  TASK_READ = 'task:read',
  TASK_UPDATE = 'task:update',
  
  // 产品权限
  PRODUCT_READ = 'product:read',
  
  // 管理员权限
  ADMIN_ALL = '*'
}

// 角色权限配置
export const RolePermissions: Record<UserRole, Permission[]> = {
  operator: [
    Permission.QUERY_READ,
    Permission.INVENTORY_READ,
    Permission.INVENTORY_CREATE,
    Permission.INVENTORY_UPDATE,
    Permission.INVENTORY_DELETE,
    Permission.TASK_READ,
    Permission.TASK_UPDATE
  ],
  admin: [Permission.ADMIN_ALL]
}

// 扫码结果类型
export interface ScanResult {
  code: string
  product?: Product
  timestamp: string
}

// 扫码历史类型
export interface ScanHistory {
  id: string
  code: string
  result: ScanResult
  success: boolean
  createdAt: string
} 