# 自定义 TabBar 实现文档

## 实现状态

✅ **已完成** - 自定义 tabBar 已成功实现并集成到项目中

## 实现方案

### 1. 文件结构
```
src/custom-tab-bar/
├── index.js     # 原生微信小程序组件逻辑
├── index.wxml   # 模板文件
├── index.wxss   # 样式文件
├── index.json   # 组件配置
└── index.config.ts  # Taro 配置文件
```

### 2. 关键配置

#### app.config.ts
```typescript
tabBar: {
  custom: true,  // 启用自定义 tabBar
  // ... 其他配置
}
```

#### config/index.ts
```typescript
copy: {
  patterns: [
    // 复制原生文件到 dist 目录
    { from: 'src/custom-tab-bar/index.js', to: 'dist/custom-tab-bar/index.js' },
    { from: 'src/custom-tab-bar/index.wxml', to: 'dist/custom-tab-bar/index.wxml' },
    { from: 'src/custom-tab-bar/index.wxss', to: 'dist/custom-tab-bar/index.wxss' },
    { from: 'src/custom-tab-bar/index.json', to: 'dist/custom-tab-bar/index.json' }
  ]
}
```

### 3. 页面集成

每个 tabBar 页面都需要在 `useDidShow` 中更新选中状态：

```typescript
import { useDidShow } from '@tarojs/taro'

useDidShow(() => {
  if (typeof Taro.getTabBar === 'function') {
    const tabBar = Taro.getTabBar(Taro.getCurrentInstance().page) as any
    if (tabBar && tabBar.setData) {
      tabBar.setData({
        selected: 0  // 当前页面对应的索引
      })
    }
  }
})
```

### 4. 样式特点

- 使用渐变背景和阴影效果
- 中间创建按钮突出显示
- 响应式布局，适配不同屏幕
- 遵循微信小程序设计规范

### 5. 构建验证

构建后的文件结构：
```
dist/
├── custom-tab-bar/
│   ├── index.js
│   ├── index.wxml
│   ├── index.wxss
│   └── index.json
├── app.json (custom: true)
└── pages/...
```

## 注意事项

1. **必须使用原生语法**：Taro 4.x 不会自动编译 custom-tab-bar 中的 React 组件
2. **路径配置**：确保 copy 配置正确，否则文件不会被复制到 dist 目录
3. **状态同步**：每个页面都需要手动更新 tabBar 的选中状态
4. **样式单位**：使用 px 而非 rpx，避免单位转换问题

## 问题排查

如果 tabBar 不显示，请检查：
1. `dist/custom-tab-bar/` 目录是否存在所有必需文件
2. `app.json` 中 `custom: true` 是否设置
3. 页面路径是否与 tabBar 配置匹配
4. 微信开发者工具是否需要重新编译

## 更新时间

2024年12月26日 
