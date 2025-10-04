# 截图采集清单 - TASK-UI_STYLE-002

## 核心 5 页清单

根据 `docs/ui-style-migration-6A.md` 和 `docs/baseline/README.md`，需采集以下页面的 before/after 截图。

### 采集环境要求

- **设备 1**: iPhone 13, iOS 17+, 微信 8.x, 基础库 2.33.0+
- **设备 2**: Android 中高端机型, Android 13+, 微信 8.x, 基础库 2.33.0+
- **构建**: `npm run dev:weapp` (开发模式)

### 截图命名规范

```
docs/baseline/weapp/<stage>/<page>-<state>-<device>-<lib>.png
```

- `<stage>`: `before` 或 `after`
- `<page>`: 页面标识符（见下方）
- `<state>`: `normal`, `empty`, `loading`, `error` 等
- `<device>`: `iphone13` 或 `android13`
- `<lib>`: 基础库版本，如 `2.33.0`

---

## 第 1 页：首页 (index)

**路径**: `pages/index/index`
**页面标识**: `index`

### 截图点位

1. **正常态** (`index-normal-{device}-{lib}.png`)
   - 显示统计卡片、快捷入口
   - 用户已登录状态

2. **加载态** (`index-loading-{device}-{lib}.png`) (可选)
   - 数据加载中的骨架屏或 loading 状态

### 验收要点

- 品牌色是否为蓝色 `#3b82f6`
- 卡片圆角是否为 8px
- 字号是否统一为 16px 基准
- 按钮高度是否为 44px

---

## 第 2 页：登录 (login)

**路径**: `pages/login/index`
**页面标识**: `login`

### 截图点位

1. **正常态** (`login-normal-{device}-{lib}.png`)
   - 显示登录表单
   - 输入框为空状态

2. **输入态** (`login-input-{device}-{lib}.png`) (可选)
   - 输入框已填写内容
   - 显示密码可见/隐藏切换

### 验收要点

- 输入框高度是否为 44px
- 输入框圆角是否为 12px
- 按钮圆角是否为 12px
- 品牌色按钮背景色

---

## 第 3 页：产品列表 (products)

**路径**: `pages/products/index`
**页面标识**: `products`

### 截图点位

1. **列表正常态** (`products-list-normal-{device}-{lib}.png`)
   - 显示产品列表数据
   - 至少 3-5 条记录

2. **空态** (`products-list-empty-{device}-{lib}.png`) (可选)
   - 无数据时的空状态提示

### 验收要点

- 列表项间距是否统一
- 卡片阴影是否为 `0 2rpx 8rpx rgba(0, 0, 0, 0.05)`
- 文本层级（主文本、次要文本）颜色对比度
- 状态标签（Tag）样式

---

## 第 4 页：扫码查询 - 结果页 (query-scan)

**路径**: `pages/query/scan/index`
**页面标识**: `query-scan`

### 截图点位

1. **查询结果正常态** (`query-scan-result-normal-{device}-{lib}.png`)
   - 扫码后显示查询结果
   - 显示产品详情信息

2. **查询失败态** (`query-scan-result-error-{device}-{lib}.png`) (可选)
   - 扫码后未找到结果
   - 显示错误提示

### 验收要点

- 结果卡片样式
- 按钮组布局和样式
- 文本信息层级
- 状态提示样式（成功/失败）

**参考脚本**: `docs/baseline/scripts.weapp.query-scan.result.md`
**参考点位**: `docs/baseline/shots.weapp.query-scan.yaml`

---

## 第 5 页：散件库存 - 列表/表单 (spare-inventory)

**路径**: `pages/inventory/spare/index`
**页面标识**: `spare-inventory`

### 截图点位

1. **列表正常态** (`spare-inventory-list-normal-{device}-{lib}.png`)
   - 显示散件库存列表
   - 至少 3-5 条记录

2. **表单弹层** (`spare-inventory-form-modal-{device}-{lib}.png`)
   - 点击新增/编辑后弹出的表单
   - 显示输入框、选择器等组件

3. **空态** (`spare-inventory-list-empty-{device}-{lib}.png`) (可选)
   - 无数据时的空状态

### 验收要点

- 表格/列表布局
- 弹层（Modal）圆角是否为 16px
- 表单输入框样式和间距
- 按钮组样式（主要/次要按钮）

**参考脚本**: `docs/baseline/scripts.weapp.spare-inventory.form-modal.md`
**参考点位**: `docs/baseline/shots.weapp.spare-inventory.yaml`

---

## 采集流程

### Before 截图（迁移前）

⚠️ **注意**: 如果已经执行了样式迁移代码更新，需要先回退到迁移前的版本：

```bash
# 回退到迁移前的 commit（如果需要）
git stash
git checkout <迁移前的commit>
npm run dev:weapp
```

然后按照上述清单采集 **before** 截图。

### After 截图（迁移后）

```bash
# 切换回迁移后的代码
git checkout main  # 或当前分支
git stash pop      # 恢复更改（如果有）
npm run dev:weapp
```

按照上述清单采集 **after** 截图。

---

## 截图存放路径

```
docs/baseline/weapp/before/
docs/baseline/weapp/after/
```

确保目录结构如下：

```
docs/baseline/
├── README.md
├── screenshot-checklist.md (本文件)
├── weapp/
│   ├── before/
│   │   ├── index-normal-iphone13-2.33.0.png
│   │   ├── login-normal-iphone13-2.33.0.png
│   │   ├── products-list-normal-iphone13-2.33.0.png
│   │   ├── query-scan-result-normal-iphone13-2.33.0.png
│   │   └── spare-inventory-list-normal-iphone13-2.33.0.png
│   └── after/
│       ├── index-normal-iphone13-2.33.0.png
│       ├── login-normal-iphone13-2.33.0.png
│       ├── products-list-normal-iphone13-2.33.0.png
│       ├── query-scan-result-normal-iphone13-2.33.0.png
│       └── spare-inventory-list-normal-iphone13-2.33.0.png
```

---

## 对比与提交

1. **对比截图**: 使用图片对比工具或微信开发者工具内置对比功能
2. **记录差异**: 在 PR 中说明视觉差异是否符合预期
3. **附上清单**: 在 PR 中勾选已完成的截图项

---

## 快捷采集脚本（可选）

如果设备支持，可以使用自动化截图脚本：

```bash
# 安装微信开发者工具 CLI（如果未安装）
# 参考：https://developers.weixin.qq.com/miniprogram/dev/devtools/cli.html

# 示例：使用 CLI 自动打开指定页面并截图
cli auto --project /path/to/project --page pages/index/index
```

或手动在微信开发者工具中：
1. 切换到指定页面
2. 使用工具栏的截图功能
3. 按命名规范保存

---

## 参考文档

- 基线规范: `docs/baseline/README.md`
- UI 迁移方案: `docs/ui-style-migration-6A.md`
- OKLCH 验证: `docs/compatibility/oklch-validation.md`
