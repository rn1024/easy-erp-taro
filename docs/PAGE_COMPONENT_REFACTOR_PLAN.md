# 页面组件与样式重构方案

## Align · 需求基线
- 目标：梳理 `src/pages` 全量页面的组件/样式使用情况，输出抽离复用的重构方案，保持业务逻辑不变、路径改动最小。
- 范围：仅整理与复用相关的组件、样式与状态逻辑；不新增额外业务能力；以当前 ERP 小程序的 Weapp 目标为主。
- 约束：遵循现有代码规范（TSX 函数组件、BEM SCSS、`@/` 别名），避免无谓的目录移动。

## Architect · 现状盘点与架构设计

### 移动端适配评估
- **基础设施**：现有页面统一包裹在 `MobileLayout` 中，通过 `SafeArea` 适配刘海屏，并结合 `useResponsive` 获取 `windowWidth/windowHeight`、`pixelRatio` 等信息，具备移动端基础设施。
- **尺寸与单位**：大部分样式使用 `rpx`、`flex`、`touch-target`（在 `app.scss` 中定义最小触摸区域），符合微信小程序与移动端规范；少量硬编码 `px`/`%` 需在后续统一为 token/mixin。
- **交互与布局**：顶部导航、`PullToRefresh`、筛选 Chip、进度条、卡片等设计均面向竖屏手机；默认断点（紧凑宽度 414）覆盖主流机型。`MobileLayout` 会为 TabBar 页面增加底部留白，避免触控冲突。
- **改造约束**：新增组件/样式应继续遵循移动端体验：
  - 触摸区域 ≥ `88rpx`，内外边距使用 token；
  - 网格/统计组件默认双列，窄屏（≤360px）退化为单列；
  - 滚动列表保持惯性滑动体验，避免固定高度溢出；
  - 使用 `ResponsiveContext` 判断横屏或短屏，调整间距或折行。

### 页面与依赖清单
| 页面 (相对 `src/pages`) | 功能概要 | 主要依赖组件 / 模块 | 样式特征与重复点 |
| --- | --- | --- | --- |
| help/index.tsx | FAQ & 帮助中心 | `MobileLayout`、`SearchBar`、`MaterialIcons` | 卡片列表 + 状态标签；标签切换、操作 CTA 与其它页面类似 |
| index/index.tsx | 首页概览 | `MobileLayout`、`PullToRefresh`、`MaterialIcons` | 统计网格、指标卡片、快速操作卡片，样式体量大，与仓库/任务卡片重复 |
| inventory/finished/index.tsx | 成品库存 | `MobileLayout`、`SearchBar`、`MaterialIcons` | 手写 `inventory-card` 结构，可与 `components/InventoryCard` 对齐 |
| inventory/spare/index.tsx | 散件库存 | `MobileLayout`、`InventoryCard`、`FormModal`、`SearchBar` | 存在自研过滤、列表、FormModal；多处 Icon+label+value 的信息行 |
| login/index.tsx | 登录 | `Form`、`Input`、`Button`、`Card`、`FormItem`、`Icon` | 登录卡片、输入框图标、快速按钮与其它页面的卡片/按钮风格一致 |
| products/index.tsx | 产品列表 | `MobileLayout`、`PullToRefresh`、`DataTable`、`SearchBar`、`MaterialIcons` | 顶部统计、筛选 Chip、空状态、表格布局；Chip/空状态可复用 |
| profile/index.tsx | 个人中心 | `MobileLayout`、`Avatar`、`MaterialIcons`、`mockUsers` | 信息块、列表项重复出现，适合抽象个人信息卡 |
| query/scan/index.tsx | 扫码查询 | `MobileLayout`、`Dialog`、`Toast`、`Button`、`Input` | 结果卡片、历史列表、操作按钮与库存/帮助类似；有 Loading/空态 |
| query/sku/index.tsx | SKU 查询 | `MobileLayout`、`Button`、`Input`、`Loading` | 查询表单 + 结果展示，信息行重复 |
| security/index.tsx | 安全设置 | `MobileLayout`、`Switch`、`MaterialIcons` | 设置项列表、状态 Pill 与 Profile/Help 中重复 |
| userinfo/index.tsx | 用户信息 | `MobileLayout`、`Avatar`、`MaterialIcons` | 信息卡片、操作 CTA、标签内容 |
| warehouse/index.tsx | 仓库任务首页 | `MobileLayout`、`MaterialIcons` | `task-card` 风格与 `components/TaskCard` 高度相似；统计+进度条重复 |
| warehouse/package/index.tsx | 包装任务 | `MobileLayout`、`SearchBar`、`Dialog`、`Button` | 状态枚举、标签、列表卡片与成品/散件库存近似 |
| warehouse/shipment/index.tsx | 发货任务 | `MobileLayout`、`SearchBar`、`Dialog`、`Button` | 任务卡片、进度条、信息行复用需求明显 |

### 重复与痛点
- **卡片/统计布局重复**：`index`、`warehouse`、`inventory`、`help` 等页面都实现了自定义卡片、网格、进度条，应统一组件与样式变量。
- **状态标签风格不统一**：已有 `components/common/StatusTag`、`InventoryCard` 内的状态 Pill，以及各页面手写的彩色标签，建议统一。
- **搜索/筛选控件分叉**：存在 `components/SearchBar` 与临时实现的筛选 Chip，需整合为单一入口并提供组合式过滤器。
- **信息行 (Icon + Label + Value) 多次手写**：库存、帮助、查询、用户信息等页面复写结构，可抽成 `InfoRow` 或 `DescriptionList`。
- **表格/列表分页逻辑散落**：`products`、`inventory/spare` 内手写分页、刷新逻辑，可抽出 `useListQuery` Hook 封装。
- **样式 token 未完全复用**：大量硬编码颜色/间距与 `styles/tokens.scss` 重叠，欠缺 mixin/placeholder 提升复用。

### 目标设计
1. **组件层**
   - 复用已有 `InventoryCard`/`TaskCard`，移除页面内的重复实现。
   - 新增通用 primitives：
     - `@/components/common/SectionCard`：容器卡片，封装标题、描述、操作区域，支持紧凑/宽松模式。
   - `@/components/common/StatsGrid`：接受指标数组渲染网格，根据 `ResponsiveContext` 自动在单列/双列切换，覆盖首页与仓库统计。
   - `@/components/common/InfoList`：渲染 Icon+Label+Value 列表，支持列布局，用于库存、帮助、个人信息等。
   - `@/components/common/FilterChips`：统一 Chip 选择器，支持多/单选、清除按钮，默认提供横向滚动与换行，适配窄屏。
   - `@/components/common/ProgressBar`：定义简单、可复用的进度条，默认 100% 宽度并兼容 SafeArea 内边距，供仓库/任务场景使用。
   - `@/components/common/PageHeader`：统一页面标题、副标题、操作按钮与统计位 (适配 `index`、`products`)，在小屏下自动纵向堆叠。
   - 调整 `components/SearchBar`：
     - 暴露 `defaultValue`、`allowClear`、`size` 属性，使其满足帮助/库存/仓库场景；
     - 在 `components/common/index.ts` re-export，替换各页面零散引用，同时保留 `flex` 布局与 `rpx` 单位确保移动端体验。
   - 整理 `DataTable` 复用，增补空态、loading 与分页统一处理。

2. **Hook/数据层**
   - 新增 `@/hooks/useListQuery`：封装列表分页、刷新、错误提示逻辑，供 `products`、`inventory/spare`、`query` 类页面使用（内部整合 `Taro.showToast`）。
   - 新增 `@/hooks/useFilters`：通用筛选状态管理，输出选中项、重置函数以及 Chip props。
   - 评估 `@/stores` 中用户信息、权限在页面的使用情况，统一注入 `AuthGuard`，减少页面独立鉴权逻辑。

3. **样式层**
   - 在 `src/styles` 下新增 `partials`：`_cards.scss`、`_stats.scss`、`_filters.scss`、`_utilities.scss`；通过 `@use` 部分引入，统一移动端卡片和网格间距。
   - 使用 CSS 自定义属性与 `tokens.scss` 变量替换魔法值（颜色、间距、阴影），同时确保关键尺寸使用 `rpx` 或基于 `rem` 的响应单位。
   - 为卡片/按钮的触摸反馈抽象混入 (`@mixin touch-active`) 并复用，保持点击反馈一致性。
   - 清理重复的 BEM 元素名称，统一命名（例如 `__header`, `__meta`, `__actions`）。

4. **页面级改造策略**
   - **Index/Home**：使用 `PageHeader` + `StatsGrid` + `SectionCard` 构建概览/指标/快速操作；抽离 actions 配置到常量文件。
   - **Inventory**：`finished` 改用 `InventoryCard` 并与 `InfoList` 组合；`spare` 接入 `useListQuery`、`FilterChips`，将表单字段配置独立成常量。
   - **Products**：顶部统计改为 `PageHeader`；筛选 Chip 改为 `FilterChips`；表格使用统一分页逻辑，空态与 loading 使用 `DataTable` props，并针对横向滚动保持手势友好（必要时使用 `scroll-view` 或提示）。
   - **Warehouse**：主页替换手写 `task-card` 为 `TaskCard` 或新的 `SectionCard` + `ProgressBar`；子页列表卡片复用 `SectionCard` + `StatusTag` + `InfoList`。
   - **Query**：扫码与 SKU 页面共享 `SearchBar`、`InfoList`、空态组件；历史列表使用 `SectionCard`；Dialog 文案配置抽离。
   - **Profile/Security/Userinfo**：统一信息块使用 `SectionCard` + `InfoList`；状态开关使用 `StatusTag` 或 `Switch` + 描述行，保持单列布局与 ≥16px 触控间距。
   - **Login**：复用 `SectionCard` 封装表单容器，输入框图标封装为 `InputAddon` 子组件。
   - **Help**：分类 Tab、FAQ 卡片、联系方式使用 `SectionCard` + `InfoList`；可引入 `FilterChips`。

### 依赖与兼容性考虑
- 保持 `MobileLayout` 作为所有页面的外层容器，新增组件仅在其内部渲染。
- 避免大规模路径调整；新增组件放入 `components/common` 或已有二级目录中；样式 partial 通过 `app.scss` 与页面 SCSS 中 `@use`。
- 遵循现有 TypeScript 类型，新增组件导出类型定义，复用已有 `types/` 中的接口。

## Atomize · 任务拆解
1. **基础设施**：创建 `styles/partials`、新增 mixin 以及通用变量；完善 `components/common/index.ts` 出口。
2. **通用组件实现**：按优先级落地 `SectionCard` → `StatsGrid` → `InfoList` → `FilterChips` → `ProgressBar` → `PageHeader`。
3. **Hook 抽离**：实现 `useListQuery`、`useFilters`，并在 `products` / `inventory/spare` 中验证。
4. **页面逐步迁移**（每页单独 PR/commit）：
   - 先改造 `index` 与 `warehouse/index` 以验证统计/任务卡片方案；
   - 其次处理 `inventory` 系列，确保 `InventoryCard` 覆盖；
   - 再迁移 `products`、`query`，统一列表与筛选逻辑；
   - 最后整理 `help`、`profile`、`security`、`userinfo`、`login` 等信息页。
5. **样式清理**：迁移后删除冗余的局部 SCSS 片段，改为引入共享 partial。
6. **文档与注释**：在 `docs/COMPONENT_LIBRARY.md` 更新新组件说明；记录 Hook 用法。

## Approve · 评审要点
- 新增组件 API 是否覆盖现有页面需求，命名是否统一。
- Hook 参数约定与错误处理（Toast/Loading）是否符合产品预期。
- 样式变量替换后是否保持与设计稿一致（颜色、间距、圆角）。
- 页面迁移是否存在行为变更（搜索、分页、权限、Toast 时机）。
- 关注 Tree-shaking 与包体积：新增组件避免引入额外第三方依赖。

## Automate · 执行与验证
- 开发阶段常规命令：
  - `pnpm lint`
  - `pnpm build:weapp`
  - 必要时 `pnpm dev:weapp` 进行页面手测。
- 针对 Hook/组件可补充 unit 测试（若引入）或在 MR 描述中记录手测结论。

## Assess · 验收与后续
- Manual QA：
  - 首页指标刷新、快速操作点击。
  - 成品/散件库存过滤、编辑弹窗。
  - 产品列表分页、筛选、空态。
  - 仓库任务进度展示与跳转。
  - 扫码 / SKU 查询流程与历史记录。
  - 登录、用户信息、设置页样式一致性。
- 验证多平台兼容（至少 Weapp）；如有 H5/Alipay 目标需抽样验证。
- 评估后续工作：
  - 在 `COMPONENT_LIBRARY.md` 补充新组件示例。
  - 若 Hook 引入测试，需要在 `tests` 目录或 `*.spec.tsx` 中补单测。
  - 收集实际业务接口返回结构，更新 `services/` mock 与类型。

---

> 提示：该方案遵循 6A 流程，后续编码阶段请按照 "基础设施 → 组件 → Hook → 页面迁移 → 样式清理 → 文档" 的顺序推进，并在每个阶段完结后进行人工评审与命令验证。
