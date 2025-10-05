# Easy ERP 完整设计系统文档

## 项目概述

Easy ERP 是一个基于微信小程序风格的企业级工作流管理系统，采用现代化的移动端优先设计理念，提供任务管理、工作流创建、消息中心等核心功能。

### 技术栈
- **前端框架**: React 18 + TypeScript
- **样式方案**: Tailwind CSS v4
- **组件库**: ShadCN UI
- **构建工具**: Next.js
- **图标库**: Lucide React

## 设计理念

### 核心原则
1. **移动端优先**: 专为移动设备优化的界面设计
2. **微信风格**: 遵循微信小程序的设计规范和用户习惯
3. **简洁高效**: 减少视觉噪音，突出核心功能
4. **一致性**: 保持整个应用的视觉和交互一致性
5. **可访问性**: 支持深色模式和无障碍访问

### 设计目标
- 提供流畅的移动端用户体验
- 保持与微信生态的视觉一致性
- 支持高效的工作流操作
- 适配各种屏幕尺寸和设备

## 颜色系统

### 主题色彩
```css
/* 微信风格主色调 */
--wechat-green: #07c160    /* 主色 - 微信绿 */
--wechat-blue: #576b95     /* 辅助色 - 微信蓝 */
--wechat-orange: #fa9d3b   /* 警告色 - 橙色 */
--wechat-red: #fa5151      /* 错误色 - 红色 */
--wechat-gray: #888888     /* 中性色 - 灰色 */
```

### 背景色彩
```css
--wechat-bg: #f5f5f7           /* 主背景色 */
--wechat-card: #ffffff         /* 卡片背景色 */
--wechat-section-bg: #f8fafc   /* 区块背景色 */
```

### 状态色彩
```css
--status-pending: #f59e0b      /* 待处理 - 琥珀色 */
--status-progress: #3b82f6     /* 进行中 - 蓝色 */
--status-completed: #10b981    /* 已完成 - 绿色 */
--status-rejected: #ef4444     /* 已拒绝 - 红色 */
--status-overdue: #dc2626      /* 已逾期 - 深红色 */
```

### 深色模式适配
- 自动适配系统深色模式
- 保持微信风格的深色配色
- 确保可读性和对比度

## 字体系统

### 字体层级
```css
/* 标题层级 */
h1: 18px, font-weight: 600, line-height: 1.4
h2: 16px, font-weight: 600, line-height: 1.4
h3: 15px, font-weight: 500, line-height: 1.4
h4: 14px, font-weight: 500, line-height: 1.4

/* 正文和标签 */
p: 14px, font-weight: 400, line-height: 1.5
label: 14px, font-weight: 500, line-height: 1.4
button: 14px, font-weight: 500, line-height: 1.4
input: 14px, font-weight: 400, line-height: 1.4
```

### 字体栈
```css
font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', 
             Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', 
             'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
```

### 响应式字体
- 375px以下：基础字体13px
- 375px-414px：基础字体14px
- 414px以上：基础字体15px

## 组件规范

### 基础组件

#### 按钮 (Button)
- **尺寸**: sm(32px), default(40px), lg(48px)
- **变体**: default, secondary, outline, destructive, ghost, link
- **交互**: 点击缩放效果(scale: 0.98)
- **最小触摸目标**: 44px x 44px

#### 输入框 (Input)
- **背景色**: var(--color-input-background)
- **边框**: 1px solid var(--color-border)
- **圆角**: var(--radius-sm)
- **焦点状态**: 蓝色边框 + 阴影效果
- **字体大小**: 16px (防止iOS缩放)

#### 卡片 (Card)
- **背景**: var(--color-wechat-card)
- **圆角**: var(--radius-md)
- **阴影**: 多层级阴影系统
- **边框**: 1px solid var(--color-border)

### 业务组件

#### 任务卡片 (TaskCard)
- 显示任务标题、描述、状态、负责人、截止时间
- 支持优先级指示器
- 集成工作流进度显示
- 点击交互反馈

#### 工作流状态 (WorkflowStatus)
- 步骤式进度指示器
- 支持已完成、当前、待处理状态
- 显示负责人头像和完成时间
- 支持评论信息

#### 底部导航 (BottomNavigation)
- 5个主要标签页
- 消息数量指示器
- 安全区域适配
- 活跃状态指示

#### 顶部导航 (TopNavigation)
- 搜索功能
- 筛选功能
- 筛选计数指示器
- 响应式设计

## 布局规范

### 容器规范
```css
.wechat-container {
  max-width: 375px;        /* 最大宽度 */
  margin: 0 auto;          /* 居中对齐 */
  min-height: 100dvh;      /* 动态视口高度 */
  background-color: var(--color-wechat-bg);
}
```

### 间距系统
- **页面边距**: 16px
- **组件间距**: 8px, 12px, 16px, 24px
- **内容边距**: 12px, 16px, 20px
- **安全区域**: 自动适配iOS/Android

### 网格系统
- 基于Flexbox和CSS Grid
- 响应式断点：375px, 414px, 768px
- 12列网格系统

## 交互规范

### 触摸交互
- **最小触摸目标**: 44px x 44px
- **触摸反馈**: 视觉反馈 + 轻微缩放
- **长按**: 300ms延迟触发
- **滑动**: 支持左右滑动操作

### 动画效果
- **过渡时间**: 0.2s ease
- **缩放效果**: transform: scale(0.98)
- **透明度**: opacity: 0.8
- **支持减动画偏好**: prefers-reduced-motion

### 加载状态
- **骨架屏**: 渐变动画效果
- **加载指示器**: 旋转动画
- **进度条**: 平滑过渡效果

## 移动端优化

### 性能优化
```css
/* 硬件加速 */
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}

/* 滚动优化 */
.optimize-scroll {
  -webkit-overflow-scrolling: touch;
  contain: layout;
}
```

### 适配策略
- **安全区域**: 支持刘海屏和虚拟按键
- **横屏适配**: 隐藏不必要元素
- **键盘适配**: 动态调整布局
- **高分辨率**: 优化1px边框和阴影

### 兼容性
- **iOS**: Safari 14+
- **Android**: Chrome 90+
- **微信内置浏览器**: 完整支持
- **深色模式**: 自动适配

## 可访问性

### 语义化标记
- 正确使用HTML5语义标签
- ARIA标签支持
- 键盘导航支持
- 屏幕阅读器兼容

### 对比度
- 文字对比度 ≥ 4.5:1
- 大文字对比度 ≥ 3:1
- 状态色彩符合可访问性标准

## 开发规范

### 文件组织
```
components/
├── ui/           # ShadCN基础组件
├── business/     # 业务组件
├── layout/       # 布局组件
└── common/       # 通用组件
```

### 命名规范
- **组件**: PascalCase (TaskCard)
- **文件**: kebab-case (task-card.tsx)
- **类名**: kebab-case (wechat-container)
- **变量**: camelCase (activeTab)

### 代码规范
- TypeScript严格模式
- ESLint + Prettier代码格式化
- 组件Props类型定义
- 错误边界处理

## 设计令牌

### 颜色令牌
```json
{
  "colors": {
    "primary": {
      "50": "#f0fdf4",
      "500": "#07c160",
      "900": "#14532d"
    },
    "status": {
      "pending": "#f59e0b",
      "progress": "#3b82f6",
      "completed": "#10b981",
      "rejected": "#ef4444"
    }
  }
}
```

### 间距令牌
```json
{
  "spacing": {
    "xs": "4px",
    "sm": "8px",
    "md": "16px",
    "lg": "24px",
    "xl": "32px"
  }
}
```

### 圆角令牌
```json
{
  "radius": {
    "sm": "4px",
    "md": "8px",
    "lg": "12px",
    "xl": "16px"
  }
}
```

## 组件库清单

### ShadCN UI组件 (43个)
- Accordion, Alert, Badge, Button, Card
- Calendar, Carousel, Chart, Checkbox
- Command, Dialog, Dropdown, Form, Input
- Label, Navigation, Popover, Progress
- Radio, Select, Sheet, Skeleton, Slider
- Switch, Table, Tabs, Textarea, Tooltip
- 等等...

### 业务组件 (12个)
- TaskCard, WorkflowStatus, QuickActions
- TopNavigation, BottomNavigation
- WorkflowOverview, MessageCenter
- CreateWorkflow, ProfilePage
- AccountSettings, SecuritySettings
- HelpCenter

### 布局组件
- MobileLayout
- Modal
- ComponentsDemo

## 设计资源

### 设计工具
- **Figma**: 主要设计工具
- **原型工具**: Figma原型功能
- **图标库**: Lucide React
- **图片资源**: Unsplash API

### 设计文件
- 设计系统文件
- 组件库文件
- 原型文件
- 切图资源

## 质量保证

### 设计审查
- 设计一致性检查
- 交互流程验证
- 可访问性评估
- 性能影响分析

### 开发验收
- 组件功能测试
- 响应式测试
- 兼容性测试
- 性能基准测试

---

*本文档会随着项目发展持续更新，请关注版本变更记录。*