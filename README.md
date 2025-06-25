# Easy ERP Taro - 微信小程序工作流管理系统

基于 Taro 4.0 + NutUI + TypeScript 的微信小程序工作流管理系统，从 React + Radix UI + Tailwind CSS 技术栈迁移而来。

## 🚀 项目状态

### ✅ Sprint 1 已完成 (2024年12月24日)
- **完成度**: 100%
- **功能**: 首页完整实现
- **组件**: 5个核心组件完成
- **代码质量**: 优秀

### 🎯 当前功能
- ✅ **首页**: 统计概览 + 快速操作 + 任务列表
- ✅ **移动端布局**: 响应式设计 + 深色主题
- ✅ **导航系统**: 顶部导航 + 底部 TabBar
- ✅ **数据管理**: 模拟数据 + 状态管理
- ✅ **用户体验**: 下拉刷新 + 加载状态 + Toast 反馈

## 🛠️ 技术栈

### 核心框架
- **Taro 4.0**: 跨平台小程序框架
- **React 18**: UI 组件库
- **TypeScript**: 类型安全开发
- **SCSS**: 样式预处理器

### UI 组件库
- **NutUI React Taro**: 移动端组件库
- **NutUI Icons**: 图标组件库

### 开发工具
- **pnpm**: 包管理器
- **ESLint**: 代码检查
- **Prettier**: 代码格式化

## 📁 项目结构

```
src/
├── components/           # 组件库
│   ├── common/          # 通用组件
│   │   ├── MobileLayout/    # 移动端布局
│   │   └── TopNavigation/   # 顶部导航
│   ├── business/        # 业务组件
│   │   ├── QuickActions/    # 快速操作
│   │   └── TaskCard/        # 任务卡片
│   └── ui/              # UI组件 (预留)
├── pages/               # 页面组件
│   ├── index/          # 首页 ✅
│   ├── tasks/          # 任务列表 ✅
│   ├── create/         # 创建流程 ✅
│   ├── messages/       # 消息中心 ✅
│   ├── profile/        # 个人资料 ✅
│   ├── account/        # 账户设置 (Sprint 3)
│   ├── security/       # 安全设置 (Sprint 3)
│   └── help/           # 帮助中心 (Sprint 3)
├── utils/               # 工具函数
│   └── px2rpx.ts       # 像素转换工具
├── types/               # TypeScript 类型
│   └── index.ts        # 完整类型定义
├── styles/              # 样式系统
│   └── variables.scss  # SCSS 变量
└── assets/              # 静态资源
```

## 🎨 设计系统

### 样式规范
- **单位**: rpx (小程序响应式单位)
- **转换**: px * 2 = rpx
- **主题**: 浅色/深色主题支持
- **响应式**: 移动端优先设计

### 组件规范
- **命名**: PascalCase 组件名
- **样式**: BEM 命名规范
- **类型**: 100% TypeScript 覆盖
- **测试**: 组件单元测试 (计划中)

## 🚦 开发指南

### 环境要求
- Node.js 16+
- pnpm 8+
- 微信开发者工具

### 快速开始
```bash
# 安装依赖
pnpm install

# 启动开发服务器
pnpm dev

# 构建生产版本
pnpm build

# 类型检查
pnpm type-check

# 代码格式化
pnpm format
```

### 开发规范
1. **组件开发**: 使用 NutUI 组件，避免自定义 UI
2. **样式开发**: 使用 SCSS + rpx，遵循响应式设计
3. **类型安全**: 所有组件和函数必须有 TypeScript 类型
4. **代码质量**: 遵循 ESLint 规则，使用 Prettier 格式化

## 📋 开发计划

### Sprint 2 (2024年12月25日-27日)
- 🎯 **任务列表页面**: 筛选 + 搜索 + 分页
- 🎯 **创建流程页面**: 表单 + 验证 + 提交
- 🎯 **消息中心页面**: 消息列表 + 已读状态
- 🎯 **个人资料页面**: 用户信息 + 设置

### Sprint 3-5 (2024年12月28日-2025年1月5日)
- 🎯 **账户设置页面**
- 🎯 **安全设置页面**
- 🎯 **帮助中心页面**
- 🎯 **测试和优化**

## 🔧 已实现组件

### MobileLayout - 移动端布局
```typescript
interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  showHeader?: boolean;
  showFooter?: boolean;
}
```

### TopNavigation - 顶部导航
```typescript
interface TopNavigationProps {
  title?: string;
  showSearch?: boolean;
  showNotification?: boolean;
  showAvatar?: boolean;
  onSearch?: () => void;
  onNotification?: () => void;
  onAvatarClick?: () => void;
}
```

### QuickActions - 快速操作
```typescript
interface QuickActionsProps {
  actions?: QuickAction[];
  columns?: number;
  onActionClick?: (action: QuickAction) => void;
}
```

### TaskCard - 任务卡片
```typescript
interface TaskCardProps {
  task: Task;
  onClick?: (task: Task) => void;
}
```

## 📊 数据类型

### 核心类型定义
```typescript
// 用户类型
interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// 任务类型
interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority?: TaskPriority;
  assignee?: User;
  progress?: number;
  dueDate?: string;
}

// 统计类型
interface Statistics {
  totalTasks: number;
  completedTasks: number;
  pendingTasks: number;
  inProgressTasks: number;
}
```

## 🎯 特性亮点

### 技术特性
- ✅ **类型安全**: 100% TypeScript 类型覆盖
- ✅ **组件化**: 高度模块化的组件架构
- ✅ **响应式**: 移动端优先的响应式设计
- ✅ **主题化**: 支持浅色/深色主题切换
- ✅ **性能优化**: 基于 Taro 的小程序优化

### 用户体验
- ✅ **流畅交互**: 原生小程序体验
- ✅ **即时反馈**: Toast 消息 + 加载状态
- ✅ **下拉刷新**: 数据实时更新
- ✅ **导航便捷**: 底部 TabBar + 顶部导航

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add some amazing feature'`)
4. 推送分支 (`git push origin feature/amazing-feature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系我们

- 项目地址: [GitHub Repository]
- 问题反馈: [Issues]
- 文档地址: [Documentation]

---

**最后更新**: 2024年12月25日  
**项目状态**: 🎉 Sprint 2 完成，准备 Sprint 3 开发  
**完成度**: 40% (2/5 Sprint 完成) 
