# 微信小程序工作流管理界面设计系统使用指南

## 概述

本文档是对 `WECHAT_MINIPROGRAM_DESIGN_SYSTEM.json` 的配套说明，提供了微信小程序工作流管理界面设计系统的详细使用指南。该设计系统遵循微信小程序官方设计规范，并结合项目实际需求进行了定制化设计。

生成时间：2025-01-02  
版本：1.0.0

## 快速开始

### 1. 设计资产引入

#### Figma 设计师
```
1. 导入 WECHAT_MINIPROGRAM_DESIGN_SYSTEM.json 到 Figma Tokens 插件
2. 创建 Color、Typography、Effects 等 Token 分组
3. 发布为团队库供设计师使用
```

#### 前端开发者
```bash
# 安装 Style Dictionary
npm install -g style-dictionary

# 构建设计令牌
style-dictionary build

# 输出文件
# - dist/wechat/theme.wxss (微信小程序)
# - dist/taro/_variables.scss (Taro 框架)
```

### 2. 在项目中使用

#### 微信小程序原生开发
```wxss
/* app.wxss */
@import "theme.wxss";

/* 页面样式 */
.primary-button {
  height: var(--btn-height-md, 88rpx);
  background-color: var(--color-brand-primary);
  border-radius: var(--radius-md);
}
```

#### Taro 框架开发
```scss
// app.scss
@import 'variables';

// 组件样式
.button {
  height: px2rpx($btn-height-md);
  background-color: $color-brand-primary;
  border-radius: $radius-md;
}
```

## 核心设计规范

### 1. 颜色系统

#### 品牌色
| 名称 | 变量名 | 色值 | 用途 |
|------|--------|------|------|
| 主色 | `--color-brand-primary` | #07C160 | 主要操作、强调元素 |
| 辅色 | `--color-brand-secondary` | #10AEFF | 链接、次要强调 |

#### 功能色
| 名称 | 变量名 | 色值 | 对比度 |
|------|--------|------|--------|
| 信息 | `--color-info` | #2F86F6 | ≥ 4.5:1 |
| 成功 | `--color-success` | #00B578 | ≥ 4.5:1 |
| 警告 | `--color-warning` | #FF9F0A | ≥ 4.5:1 |
| 错误 | `--color-error` | #FF3B30 | ≥ 4.5:1 |

#### 中性色（9档灰阶）
- `--gray-1`: #FFFFFF
- `--gray-2`: #F7F7F7
- `--gray-3`: #E5E5E5
- `--gray-4`: #D9D9D9
- `--gray-5`: #B2B2B2
- `--gray-6`: #808080
- `--gray-7`: #4B4B4B
- `--gray-8`: #2C2C2C
- `--gray-9`: #1A1A1A

### 2. 字体系统

#### 字体族
```
-apple-system, BlinkMacSystemFont, 'PingFang SC', 'Helvetica Neue', ...
```

#### 字号规范（750设计稿）
| 名称 | 变量名 | 大小 | 行高 | 用途 |
|------|--------|------|------|------|
| 大标题 | `--font-title-lg` | 48rpx | 1.5 | 页面标题 |
| 中标题 | `--font-title-md` | 40rpx | 1.5 | 区块标题 |
| 正文 | `--font-body` | 32rpx | 1.5 | 基准字号 |
| 说明 | `--font-caption` | 28rpx | 1.5 | 辅助文字 |
| 小号 | `--font-small` | 24rpx | 1.5 | 标签文字 |

### 3. 间距系统

基于 4rpx 基准单位：
- `4rpx` → 最小间距
- `8rpx` → 紧凑间距
- `12rpx` → 小间距
- `16rpx` → 标准间距
- `24rpx` → 中等间距
- `32rpx` → 大间距
- `48rpx` → 超大间距
- `64rpx` → 巨大间距

### 4. 圆角系统

| 名称 | 变量名 | 大小 | 使用场景 |
|------|--------|------|----------|
| 小圆角 | `--radius-sm` | 8rpx | 按钮、输入框 |
| 中圆角 | `--radius-md` | 12rpx | 卡片 |
| 大圆角 | `--radius-lg` | 24rpx | 模态框、Toast |
| 超大圆角 | `--radius-xl` | 32rpx | 大型容器 |
| 全圆角 | `--radius-full` | 9999rpx | 圆形元素 |

### 5. 阴影系统

| 名称 | 变量名 | 值 | 使用场景 |
|------|--------|-----|----------|
| 轻阴影 | `--shadow-1` | 0 2rpx 8rpx rgba(0,0,0,.04) | 卡片、浮层 |
| 中阴影 | `--shadow-2` | 0 4rpx 16rpx rgba(0,0,0,.06) | 悬浮状态 |
| 重阴影 | `--shadow-3` | 0 8rpx 32rpx rgba(0,0,0,.08) | 弹窗、抽屉 |

## 组件规范

### 1. 按钮（Button）

#### 尺寸
- **小号**：高度 64rpx，内边距 24rpx
- **中号**：高度 88rpx，内边距 32rpx（默认）
- **大号**：高度 96rpx，内边距 48rpx

#### 变体
- **主要按钮**：微信绿背景，白色文字
- **次要按钮**：灰色背景
- **轮廓按钮**：透明背景，边框
- **幽灵按钮**：透明背景，无边框
- **危险按钮**：红色背景

#### 状态
- **禁用态**：透明度 0.35

### 2. 输入框（Input）

- **高度**：88rpx（符合触摸目标）
- **字号**：32rpx（防止iOS缩放）
- **圆角**：--radius-sm
- **占位符**：--gray-5
- **聚焦边框**：--color-brand-primary

### 3. 导航栏（Navbar）

- **iOS高度**：88rpx + 状态栏
- **Android高度**：96rpx + 状态栏
- **标题字号**：--font-title-md
- **左右间距**：32rpx
- **暗黑模式**：支持 `data-weui-theme="dark"`

### 4. 标签栏（TabBar）

- **最多项目**：5个
- **图标大小**：48rpx
- **文字字号**：--font-caption
- **激活颜色**：--color-brand-primary
- **徽标背景**：--color-error

### 5. Toast 提示

- **最小宽度**：240rpx
- **最大宽度**：560rpx
- **圆角**：--radius-lg
- **内边距**：24rpx 32rpx
- **显示时长**：
  - 短：1500ms
  - 中：2500ms
  - 长：3500ms

## 布局规范

### 1. 栅格系统

- **设计宽度**：750rpx
- **栅格列数**：12列
- **列宽**：56rpx
- **间隙**：24rpx

### 2. 安全区域

- **状态栏**：
  - iOS: 44px
  - Android: 48px
- **底部安全区**：env(safe-area-inset-bottom)
- **触摸目标**：最小 44×44px

### 3. 页面边距

- **标准边距**：16rpx
- **卡片内边距**：32rpx
- **区块间距**：8rpx

## 动画规范

### 1. 时长定义

- **瞬时**：100ms（状态切换）
- **快速**：150ms（简单交互）
- **正常**：200ms（大部分动画）
- **慢速**：300ms（复杂动画）
- **页面切换**：250ms

### 2. 缓动函数

- **默认**：ease
- **进入**：ease-in
- **退出**：ease-out
- **进出**：ease-in-out
- **弹性**：cubic-bezier(.25,.8,.25,1)

### 3. 典型场景

| 场景 | 时长 | 缓动 | 效果 |
|------|------|------|------|
| 页面切换 | 250ms | ease-out | 滑入/滑出 16rpx |
| 按钮点击 | 100ms | ease-in | 透明度 0.8→1 |
| 弹窗显示 | 200ms | spring | scale 0.95→1 |
| 骨架屏 | 延迟500ms | - | 防止闪烁 |

## 可访问性（A11y）

### 1. 颜色对比度
- 最小对比度：4.5:1
- 遵循标准：WCAG 2.1 AA
- 支持暗黑模式

### 2. 触摸目标
- 最小尺寸：44×44px
- 间距：8rpx

### 3. 文本适配
- 支持缩放至 120%
- 不截断文本

### 4. 动画控制
- 支持 prefers-reduced-motion
- 最长动画时间：5秒

### 5. ARIA 标签
- aria-label：必需
- aria-role：必需
- aria-description：推荐

## 代码示例

### WXSS 变量使用
```wxss
/* 主题色按钮 */
.btn-primary {
  height: 88rpx;
  border-radius: var(--radius-md);
  background: var(--color-brand-primary);
  font-size: var(--font-body);
  color: #fff;
}

/* 卡片样式 */
.card {
  background: var(--color-card);
  border-radius: var(--radius-md);
  padding: 32rpx;
  box-shadow: var(--shadow-1);
}

/* 状态样式 */
.status-completed {
  color: var(--color-status-completed);
  background-color: rgba(16, 185, 129, 0.1);
}
```

### Taro SCSS 使用
```scss
@import 'variables';

.button {
  height: px2rpx(44);
  border-radius: $radius-md;
  background: $color-brand-primary;
  font-size: $font-body;
  
  &--disabled {
    opacity: 0.35;
  }
}
```

## 最佳实践

### 1. 设计师
- 使用 Figma Tokens 管理设计变量
- 保持设计与代码的一致性
- 定期同步设计系统更新

### 2. 开发者
- 优先使用设计系统变量
- 避免硬编码颜色和尺寸
- 使用 Style Dictionary 自动化流程

### 3. 测试
- 检查触摸目标大小（≥44×44px）
- 验证颜色对比度（≥4.5:1）
- 测试响应式布局和动画性能

### 4. 性能优化
- 使用硬件加速：`transform: translateZ(0)`
- 长列表使用虚拟滚动
- 合理使用动画，避免过度设计

## 工具链集成

### Style Dictionary 配置
```json
{
  "source": ["design-tokens/**/*.json"],
  "platforms": {
    "wxss": {
      "transformGroup": "wxss",
      "buildPath": "build/wxss/",
      "files": [{
        "destination": "theme.wxss",
        "format": "css/variables"
      }]
    }
  }
}
```

### CI/CD 集成
```yaml
# .github/workflows/design-system.yml
steps:
  - name: Build Design Tokens
    run: npx style-dictionary build
  
  - name: Visual Regression Test
    run: npx playwright test
  
  - name: A11y Check
    run: npx lighthouse --score=90
```

## 版本管理

- 遵循语义化版本（SemVer）
- 任何破坏性改动必须发布 major 版本
- 提供详细的迁移文档
- 保持向后兼容性

## 相关资源

- [微信小程序设计指南](https://developers.weixin.qq.com/miniprogram/design/)
- [WeUI 组件库](https://github.com/Tencent/weui-wxss)
- [TDesign Mini](https://tdesign.tencent.com/miniprogram/overview)
- [Style Dictionary](https://amzn.github.io/style-dictionary/)

## 更新日志

### v1.0.0 (2025-01-02)
- 初始版本发布
- 基于微信小程序官方设计规范
- 包含完整的颜色、字体、间距、组件规范
- 支持 WXSS 和 SCSS 双格式输出 
