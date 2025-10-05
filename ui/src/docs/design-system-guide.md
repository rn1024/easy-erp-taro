# 工作流管理系统 - 设计系统指南

## 概述

本设计系统基于微信小程序的设计语言，结合现代企业级应用的交互模式，为工作流管理系统提供一致、高效、美观的用户界面体验。

## 设计原则

### 1. 简洁性 (Simplicity)
- 采用简洁的视觉设计，避免不必要的装饰元素
- 界面层次清晰，信息结构合理
- 交互流程简单直接，减少用户操作步骤

### 2. 一致性 (Consistency)
- 统一的颜色系统、字体规范和组件样式
- 保持交互模式的一致性
- 跨平台的体验统一

### 3. 移动优先 (Mobile First)
- 优先考虑移动端体验
- 44px最小触摸目标尺寸
- 适配安全区域和虚拟键盘

### 4. 可访问性 (Accessibility)
- 满足WCAG 2.1 AA级标准
- 支持深色模式
- 良好的对比度和可读性

## 色彩系统

### 主色调 (Primary Colors)
```css
/* 微信绿 - 主要操作按钮、品牌色 */
--wechat-green: #07c160;

/* 微信蓝 - 链接、次要操作 */
--wechat-blue: #576b95;

/* 微信橙 - 提醒、警告 */
--wechat-orange: #fa9d3b;

/* 微信红 - 错误、删除 */
--wechat-red: #fa5151;
```

### 状态色彩 (Status Colors)
```css
/* 等待中 - 琥珀色 */
--status-pending: #f59e0b;

/* 进行中 - 蓝色 */
--status-progress: #3b82f6;

/* 已完成 - 绿色 */
--status-completed: #10b981;

/* 已拒绝 - 红色 */
--status-rejected: #ef4444;

/* 已过期 - 深红色 */
--status-overdue: #dc2626;
```

### 中性色彩 (Neutral Colors)
```css
/* 背景色 */
--background: #fafafa;
--card: #ffffff;
--wechat-bg: #f5f5f7;
--wechat-section-bg: #f8fafc;

/* 文字色 */
--foreground: #1f2937;
--muted-foreground: #6b7280;
--wechat-gray: #888888;

/* 边框色 */
--border: #e4e4e7;
```

### 深色模式适配
```css
.dark {
  --background: #0f172a;
  --card: #1e293b;
  --wechat-bg: #111827;
  --wechat-card: #1f2937;
  --foreground: #f1f5f9;
  --border: #334155;
}
```

## 字体系统

### 字体族
```css
font-family: -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Helvetica, 'Segoe UI', Arial, Roboto, 'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
```

### 字体大小层级
```css
/* 标题层级 */
h1: 18px, font-weight: 600, line-height: 1.4
h2: 16px, font-weight: 600, line-height: 1.4
h3: 15px, font-weight: 500, line-height: 1.4
h4: 14px, font-weight: 500, line-height: 1.4

/* 正文 */
p: 14px, font-weight: 400, line-height: 1.5

/* 标签和按钮 */
label: 14px, font-weight: 500, line-height: 1.4
button: 14px, font-weight: 500, line-height: 1.4

/* 输入框 */
input: 14px, font-weight: 400, line-height: 1.4
```

### 响应式字体
```css
/* 小屏设备 (≤375px) */
@media (max-width: 375px) {
  html { font-size: 13px; }
}

/* 中屏设备 (376px-414px) */
@media (min-width: 376px) and (max-width: 414px) {
  html { font-size: 15px; }
}
```

## 间距系统

### 基础间距单位
```css
/* 基于8px网格系统 */
--spacing-1: 4px;   /* 0.25rem */
--spacing-2: 8px;   /* 0.5rem */
--spacing-3: 12px;  /* 0.75rem */
--spacing-4: 16px;  /* 1rem */
--spacing-5: 20px;  /* 1.25rem */
--spacing-6: 24px;  /* 1.5rem */
--spacing-8: 32px;  /* 2rem */
--spacing-12: 48px; /* 3rem */
```

### 容器内边距
```css
/* 页面级容器 */
.page-container { padding: 16px; }

/* 卡片内边距 */
.card-padding { padding: 16px; }

/* 列表项内边距 */
.list-item-padding { padding: 12px 16px; }
```

## 圆角系统

```css
--radius: 0.5rem;        /* 8px - 默认圆角 */
--radius-sm: 0.25rem;    /* 4px - 小圆角 */
--radius-md: 0.5rem;     /* 8px - 中等圆角 */
--radius-lg: 0.75rem;    /* 12px - 大圆角 */
--radius-xl: 1rem;       /* 16px - 超大圆角 */
```

## 阴影系统

```css
/* 卡片阴影层级 */
.card-shadow-sm {
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.03);
}

.card-shadow-md {
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05), 0 1px 2px rgba(0, 0, 0, 0.03);
}

.card-shadow-lg {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.08), 0 2px 4px rgba(0, 0, 0, 0.05);
}
```

## 组件规范

### 按钮组件
```css
.wechat-button {
  border-radius: var(--radius-sm);
  transition: all 0.2s ease;
  min-height: var(--mobile-touch-target-min); /* 44px */
  min-width: var(--mobile-touch-target-min);
  touch-action: manipulation;
}

.wechat-button:active {
  transform: scale(0.98);
  opacity: 0.8;
}
```

#### 按钮类型
- **主要按钮**: 微信绿背景，白色文字
- **次要按钮**: 灰色背景，深色文字
- **链接按钮**: 微信蓝文字，无背景
- **危险按钮**: 微信红背景，白色文字

### 卡片组件
```css
.wechat-card {
  background: var(--color-wechat-card);
  border-radius: var(--radius-md);
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03), 0 1px 2px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-border);
}
```

### 输入框组件
```css
.mobile-input {
  font-size: 16px !important; /* 防止iOS Safari缩放 */
  min-height: var(--mobile-touch-target-min);
  background-color: var(--color-input-background);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
}

.mobile-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}
```

### 状态指示器
```css
.status-pending {
  color: var(--color-status-pending);
  background-color: rgba(245, 158, 11, 0.1);
}

.status-progress {
  color: var(--color-status-progress);
  background-color: rgba(59, 130, 246, 0.1);
}

.status-completed {
  color: var(--color-status-completed);
  background-color: rgba(16, 185, 129, 0.1);
}

.status-rejected {
  color: var(--color-status-rejected);
  background-color: rgba(239, 68, 68, 0.1);
}
```

## 移动端优化

### 安全区域适配
```css
--mobile-safe-area-top: env(safe-area-inset-top);
--mobile-safe-area-bottom: env(safe-area-inset-bottom);

.wechat-safe-area {
  padding-bottom: var(--mobile-safe-area-bottom);
}

.wechat-safe-area-top {
  padding-top: var(--mobile-safe-area-top);
}
```

### 容器规范
```css
.wechat-container {
  max-width: 375px;
  margin: 0 auto;
  min-height: 100vh;
  min-height: 100dvh; /* 动态视口高度 */
  background-color: var(--color-wechat-bg);
  position: relative;
  overflow-x: hidden;
}
```

### 触摸优化
```css
/* 最小触摸目标 */
--mobile-touch-target-min: 44px;

/* 触摸反馈 */
.touch-feedback {
  -webkit-tap-highlight-color: rgba(59, 130, 246, 0.1);
  tap-highlight-color: rgba(59, 130, 246, 0.1);
}

.touch-feedback:active {
  background-color: rgba(59, 130, 246, 0.05);
}
```

### 滚动优化
```css
.mobile-scroll {
  -webkit-overflow-scrolling: touch;
  overflow-scrolling: touch;
  will-change: scroll-position;
  transform: translateZ(0);
}
```

### 键盘适配
```css
@supports (-webkit-touch-callout: none) {
  .keyboard-adjust {
    padding-bottom: max(var(--mobile-safe-area-bottom), 20px);
    transition: padding-bottom 0.3s ease;
  }
}
```

## 导航系统

### 底部导航
- 高度: 60px + 安全区域
- 图标尺寸: 24px
- 文字大小: 10px
- 激活状态: 微信绿色

### 顶部导航
- 高度: 44px + 安全区域
- 返回按钮: 左侧，24px图标
- 标题: 居中，16px，font-weight: 600

## 状态反馈

### 加载状态
```css
.loading-shimmer {
  background: linear-gradient(90deg, 
    var(--color-muted) 25%, 
    var(--color-secondary) 50%, 
    var(--color-muted) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 2s infinite;
}
```

### 空状态
- 图标: 64px，浅灰色
- 标题: 16px，font-weight: 500
- 描述: 14px，浅灰色

### 错误状态
- 颜色: 微信红
- 图标: 警告图标
- 操作: 重试按钮

## 动效系统

### 基础过渡
```css
transition: all 0.2s ease;
```

### 按钮交互
```css
.wechat-button:active {
  transform: scale(0.98);
  opacity: 0.8;
}
```

### 页面切换
- 推入动画: transform: translateX(100%) → translateX(0)
- 淡入动画: opacity: 0 → opacity: 1
- 时长: 300ms ease-out

### 减少动效模式
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

## 响应式适配

### 断点系统
```css
/* 小屏 */
@media (max-width: 375px)

/* 中屏 */
@media (min-width: 376px) and (max-width: 414px)

/* 横屏 */
@media (orientation: landscape) and (max-height: 500px)
```

### 高分辨率屏幕
```css
@media (-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi) {
  .high-dpi-border {
    border-width: 0.5px;
  }
}
```

## 性能优化

### GPU加速
```css
.gpu-accelerated {
  transform: translateZ(0);
  will-change: transform;
}
```

### 内容可见性
```css
.virtual-scroll {
  contain: layout style paint;
  content-visibility: auto;
}
```

### 滚动优化
```css
.optimize-scroll {
  -webkit-overflow-scrolling: touch;
  contain: layout;
}
```

## 可访问性

### 语义化标签
- 使用正确的HTML语义标签
- 提供aria-label和aria-describedby
- 支持键盘导航

### 对比度
- 文字与背景对比度 ≥ 4.5:1
- 重要元素对比度 ≥ 7:1

### 焦点管理
```css
:focus-visible {
  outline: 2px solid var(--color-ring);
  outline-offset: 2px;
}
```

## 工具类

### 文字截断
```css
.text-ellipsis {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### 防止选择
```css
.no-select {
  -webkit-user-select: none;
  user-select: none;
}
```

### 安全选择
```css
input, textarea, [contenteditable] {
  -webkit-user-select: text;
  user-select: text;
}
```

## 最佳实践

### 1. 组件开发
- 优先使用现有的设计token
- 遵循移动端最小触摸目标尺寸
- 考虑深色模式适配
- 提供加载和错误状态

### 2. 性能考虑
- 使用CSS自定义属性实现主题切换
- 避免不必要的重排和重绘
- 合理使用GPU加速

### 3. 用户体验
- 提供清晰的状态反馈
- 保持操作的一致性
- 考虑网络状况不佳的场景

### 4. 维护性
- 使用语义化的变量名
- 保持样式的模块化
- 定期更新设计系统文档

## 浏览器兼容性

### 支持范围
- iOS Safari 14+
- Android Chrome 88+
- WeChat WebView 7.0+

### 特殊处理
- iOS Safari的视口高度问题: 使用100dvh
- Android键盘遮挡: 监听viewport变化
- 微信浏览器的特殊限制: 避免使用不支持的CSS特性

## 更新日志

### v1.0.0 (2025-01-XX)
- 初始版本发布
- 完整的色彩和字体系统
- 移动端优化策略
- 基础组件规范