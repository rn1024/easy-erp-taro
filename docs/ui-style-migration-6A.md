# UI 设计风格与设计语言迁移方案（6A）

本方案用于将 `ui/` 当前设计稿的设计风格与设计语言，同步替换到本项目，严格保持现有布局与交互逻辑不变，仅更新样式（包含主题与设计令牌）。不改动任何非样式代码和资源（包括 icon）。

适用范围：WeChat 小程序（Taro）当前仓库。仅针对 `src/` 下的样式体系与主题变量生效。

受影响文件（参考）：
- `src/app.scss`
- `src/styles/tokens.scss`
- `src/styles/nutui-theme.scss`
- `src/styles/partials/*`
- 页面与组件旁的局部样式：`src/pages/**/**.scss`、`src/components/**/**.scss`

不在范围：
- 不修改任何 TS/TSX 逻辑与 JSX/TSX 结构（保留现有布局、DOM 结构、数据流与交互）。
- 不替换、不新增、不删减任何 icon 或媒体资源。
- 不引入新的第三方库与构建配置改动。

——

## Align（对齐）- 需求澄清与边界

目标
- 将 `ui/` 的设计风格（色彩、字体、间距、圆角、阴影、组件态）统一映射为本仓库的设计令牌与主题变量，保证视觉一致性。
- 保持现有页面与组件布局结构不变，仅通过样式覆盖与主题变量映射达成视觉替换。

输入
- 设计源：`ui/` 中的设计系统与文档（如 `ui/src/docs/design-system*.json|md`、`ui/src/styles/globals.css`、`ui/src/index.css`）。
- 现有实现：`src/styles/tokens.scss`、`src/styles/nutui-theme.scss`、`src/app.scss` 与局部样式。

输出
- 完整 token 映射表与主题变量对齐方案（本文件“Architect/映射规范”）。
- 迁移执行步骤与回滚方案（“Automate/执行计划”与“附：回滚与灰度”）。
- 验收与质量门禁（“Assess/验收标准与清单”）。

刚性约束
- 仅改样式；不得改动组件结构、业务逻辑与 icon。
- 统一从设计令牌（tokens）出发进行覆盖，不允许散落硬编码颜色、尺寸。
- 保持 BEM 风格与现有命名习惯，不破坏 `@/` alias 与模块组织。

——

## 关键决策补充（必须先结论）

1) 色彩体系冲突解决方案（蓝/绿品牌冲突）
- 决策点：品牌主色统一为蓝（#478EF2）或绿（WeChat 绿系），只能二选一；不得混用。
- 决策路径：
  - A 方案（推荐，待产品/设计确认）：采用“品牌别名”机制，将 `--color-brand` 作为唯一品牌出口；在 tokens 中将其指向蓝或绿；`--color-primary`、`--text-link` 等语义变量仅引用 `--color-brand`。
  - B 方案（临时过渡）：保留现有 `--color-primary: 蓝`，新增 `--color-brand: 绿`，主题与局部样式只引用 `--color-brand`；对旧引用保留兼容别名一个版本周期，后统一收敛。
- 约束与验收：
  - 所有组件主题变量不得直接绑定具体色值，只能绑定 `--color-brand` 或语义色（success/warning/danger/info）。
  - 保证对比度（AA）：正文文本对背景的对比度 ≥ 4.5:1，次要文本 ≥ 3:1。
  - 若品牌切换为绿，仅更新 tokens 值，不改页面/组件结构。

2) OKLCH 色彩空间兼容性
- 目标：在不改变构建链的前提下，验证小程序（WXSS）是否接受 `oklch()` 表达式。
- 风险：WXSS 对 CSS4/Color 4 语法支持有限，`oklch()` 在低版本基础库可能不生效。
- 策略：
  - 基线策略（默认）：运行时只下发 sRGB 十六进制/rgba；OKLCH 仅作为设计稿与离线转换来源，不直接落入 WXSS。
  - 验证策略：在开发工具与真机分别创建“色彩兼容性页”，对比 `oklch()` 与等价 sRGB 值；若基础库版本≥最低要求且表现一致，可在 tokens 旁保留 `oklch()` 注释供后续自动化转换使用。
  - 回退策略：若任一目标环境不支持 `oklch()`，则彻底禁用运行时 `oklch()`，仅保留十六进制/rgba 常量。
- 验证步骤详见“OKLCH 兼容性验证与用例”。

3) NutUI 主题变量完整映射表
- 原则：NutUI 所有可定制 SCSS 变量统一绑定到 tokens 的语义层（CSS Variables），不出现硬编码常量。
- 收敛：优先绑定到语义色（如 `--color-brand`、`--text-primary`、`--bg-card`），其次绑定到基础色（如 `--color-gray-600`）。
- 缺口处理：若 NutUI 变量需要但 tokens 尚无等价语义，先以“临时别名 token”标注（需新增），再由产品/设计确认后补齐。

——

## 建议行动（立即执行）

- 先与产品/设计确认品牌色变更（蓝→绿）
- 验证小程序对 OKLCH 的支持
- 建立截图基线后再开始迁移
- 按优先级逐步推进，每个阶段验收后再继续

——

## Architect（架构）- 先设计后编码

总览
- 核心思想：以“设计令牌 → 语义变量 → 组件主题变量 → 局部样式”的单向映射为主干，最小化对页面/组件样式的触碰面。
- 统一落点：优先更新 `src/styles/tokens.scss` 与 `src/styles/nutui-theme.scss`，仅当语义不足时才在 `src/app.scss`/局部样式做最小覆盖。

目录与层次
1) Primitive 令牌（基础值，来自 ui/）：
   - 色彩（brand、neutral、state）
   - 字体（font-family、font-size、weight、line-height）
   - 间距（基于 8px 栅格，rpx 标尺）
   - 圆角、阴影、动效（easing、duration）

2) Semantic 令牌（语义化输出）：
   - 背景、文本、边框、卡片、状态态（hover/active/disabled）
   - 仅做“语义绑定”，不承载组件语义

3) 组件主题变量（NutUI/Taro 主题层）：
   - 将 Semantic 令牌映射到 NutUI 变量（如 `$primary-color` 等），由 `src/styles/nutui-theme.scss` 统一承接

4) 全局与局部样式：
   - `src/app.scss`：公共工具类、容器、通用卡片样式等仅引用语义令牌
   - 页面/组件局部样式：仅在语义不足时补充，禁止写死基础值

映射规范（示例片段）
- 来自 `ui/` 的 CSS 变量或 Tailwind 主题 → 统一折算到 `tokens.scss` 的 page 作用域 CSS 变量：
  - `--color-primary`、`--color-success|warning|error|info`
  - `--text-primary|secondary|placeholder|disabled`
  - `--bg-body|card|hover|active`、`--border-base|light`
  - `--font-size-*`（以 rpx 标尺对齐移动端）
  - `--radius-*`、`--shadow-*`、`--transition-*`、`--easing-*`
- NutUI 主题变量在 `nutui-theme.scss` 中仅以 `$var: var(--token)` 的形式绑定，避免重复定义。

禁令
- 不在局部样式直接写 16 进制颜色、像素值；必须来源于 tokens。
- 不调整 DOM 结构以达成样式效果；必要时加“仅样式类名”。
- 不增删替换任何 icon。

——

## Atomize（原子化）- 任务拆分

A. 盘点与比对（不改代码）
- 列出 `ui/` 侧基础 token 与语义 token 清单
- 列出 `src/styles/tokens.scss` 与 `src/styles/nutui-theme.scss` 现有 token
- 形成差异矩阵：缺失、新增、冲突、等价

B. 令牌对齐与主题绑定
- 在 `tokens.scss` 中补齐/替换基础与语义 token（保留命名法）
- 在 `nutui-theme.scss` 中用 `$var: var(--token)` 对齐 NutUI 变量
- 运行 `pnpm dev:weapp` 做预览与对照，仅观察视觉差异

C. 局部样式兜底
- `src/app.scss` 与公共 partials 用语义 token 兜底（例如卡片阴影、圆角）
- 对极少数页面需要的品牌色/态样式，用工具类化的语义变量覆盖

D. 清理与固化
- 去除重复或未引用 token；保留向后兼容别名一段时间
- 在 docs 中固化“使用规范”与“禁令”

——

## Approve（审批）- 人工检查点

检查清单（必须全通过）
- 不改动 TS/TSX、路由与交互逻辑；不更动 icon
- 页面布局、栅格、间距结构一致，仅视觉风格变化
- 所有颜色/尺寸来自 tokens 或主题变量，无硬编码
- NutUI 组件在“正常/hover/active/disabled/加载中”态的一致性通过
- 常见列表、详情、表单、弹层、结果页等关键模板通过验收

走查顺序
1) 令牌映射表与 `nutui-theme.scss` 变量绑定 PR
2) 全局与公共样式覆盖 PR
3) 局部样式兜底 PR（若有）

里程碑与建议行动（逐阶段验收）
- M0 对齐：品牌色确认（蓝→绿与否）与冲突方案固化（需产品/设计）
- M1 基线：建立“截图基线与视觉对比集”（关键流程页：列表/详情/表单/弹层/结果）
- M2 验证：完成 OKLCH 兼容性验证与结论归档（允许/禁用/仅离线）
- M3 执行一：更新 tokens 并提交截图对比（允许小范围视觉偏差，需备注）
- M4 执行二：绑定 NutUI 主题变量并回归主要组件态
- M5 执行三：必要的局部样式兜底与截图复测
- M6 收敛：清理临时别名、固化规范与回滚点

——

## Automate（执行）- 步骤化落地

前置
- `pnpm install`
- 保证 `config/` 未改动目标产物（不触碰打包与平台配置）

步骤
1) 令牌对齐：更新 `src/styles/tokens.scss`
   - 将 `ui/` 的 brand/neutral/state/typography/spacing/radius/shadow/transition 映射到 CSS 变量
   - 仅改变量值，不改变量名与层次结构

2) 主题绑定：更新 `src/styles/nutui-theme.scss`
   - 将 `$primary-color`、按钮、表单、对话框、Navbar/Tabbar 等组件变量绑定到对应语义 token
   - 保持 NutUI 原有结构与注释，方便后续检索

3) 全局样式：检查 `src/app.scss`
   - 工具类与通用卡片/排版仅引用语义 token
   - 禁止引入新硬编码色值与 px 值（统一 rpx 或 token）

4) 局部兜底：仅当需要
   - 页/组件 `.scss` 使用语义变量完成细节对齐
   - 若与主题变量重复，以主题变量为准，局部减少覆盖范围

校验
- `pnpm dev:weapp` 本地预览，重点对齐 UI 设计稿视觉
- `pnpm lint` 保证样式文件与导入组织符合规范
 - 基线对比：每阶段出图与“截图基线”对照，差异需在 PR 说明中标注原因与是否接受

附：回滚与灰度
- 回滚：逐 PR 回滚，先局部兜底、再全局样式、最后主题与令牌
- 灰度：支持按页面/模块分批落地，先低风险页面（静态列表/详情）再高风险（表单/多态组件）

——

## 截图基线规范（执行前建立）

范围
- 关键页面：列表、详情、表单、弹层、结果、仪表盘/统计（如有）
- 关键组件态：正常、hover、active、disabled、加载中、空态/错误态

环境
- 设备建议（至少两台）：
  - iOS：iPhone 13，iOS 17，微信 8.x（基础库：最新/最低支持各一次）
  - Android：中高端机型一台，Android 13，微信 8.x（基础库：最新/最低支持各一次）
- 构建：`pnpm dev:weapp`（开发）与 `pnpm build:weapp`（产物）各一轮

命名与存放
- 目录：`docs/baseline/`
- 命名：`weapp/<stage>/<page>-<state>-<device>-<lib>.png`
  - 示例：`weapp/before/inventory-list-normal-iphone13-2.33.0.png`
  - `stage` 取值：`before`（迁移前基线）、`after`（迁移完成）、或具体阶段如 `m3`、`m4`

对比与提交
- PR 中附上前后对比图（或对比链接），标注差异是否可接受与原因
- 对比维度：色彩、文字对比度、间距、圆角、阴影、交互态一致性

质量要求
- 文本对比度达 AA（正文≥4.5:1，次要≥3:1）
- 栅格/布局不变（仅视觉差异）

执行说明与模板
- 详见：`docs/baseline/README.md`

——

## 品牌色确认与变更控制流程

RACI
- Responsible（执行）：前端/样式负责人
- Accountable（决策）：产品负责人
- Consulted（咨询）：设计负责人
- Informed（知会）：QA、相关模块负责人

产出
- 《品牌色确认单》：作为 M0 里程碑通过条件

模板
```
品牌色确认单
- 当前品牌色：蓝 / 绿（单选）
- 生效范围：全部 / 指定模块（列出模块）
- 上线策略：一次性 / 灰度（说明灰度范围与时段）
- 截止日期：YYYY-MM-DD
- 风险评估：是否影响对比度与可访问性（结论+要点）
- 审批：产品（签字）、设计（签字）
```

确认结果登记
- 确认单位置：`docs/approvals/brand-color-confirmation.md`
- 选定方案：A 蓝（#478EF2）
- 生效策略：一次性 / 灰度（与确认单一致）
- 实施参考：令牌 `--color-brand` 生效后，NutUI `$primary-*` 映射等同随之切换，无需改动结构

——

## 阶段推进与验收门禁

阶段与门禁
- M0 对齐：品牌色确定 + 冲突方案固化（《品牌色确认单》）
- M1 基线：完成《截图基线规范》要求并归档到 `docs/baseline/`
- M2 验证：OKLCH 兼容性测试完成并归档；出具允许/禁用/仅离线结论
- M3 执行一：tokens 对齐 PR + 截图对比；通过门禁方可进入 M4
- M4 执行二：NutUI 主题变量绑定 PR + 组件态回归
- M5 执行三：必要的局部样式兜底 + 截图复测
- M6 收敛：移除临时别名、补档文档、回滚点确认

每阶段必须满足
- 不改动 TS/TSX/DOM 结构与 icon
- 样式仅来源于 tokens/主题变量，禁止硬编码
- 通过对应里程碑的截图/记录与人审通过

## Assess（评估）- 验收与质量标准

必过项
- 与 `ui/` 视觉规范一致：色板、字号、行高、间距、圆角、阴影
- 常见场景截图对比（列表/详情/表单/弹层/结果）主观一致
- NutUI 组件在主要态下视觉统一，无断层
- Weapp 端关键流程冒烟测试通过（如“库存/采购/销售”三大主流程）

可量化项
- 样式硬编码比率：0（均来自 token/主题变量）
- 令牌覆盖率：≥ 95% 页面样式只使用语义层变量
- 主题变量绑定完整度：核心组件覆盖 ≥ 90%

交付物
- 本方案与映射清单（docs 下）
- tokens 与主题变量的改动 PR 链路
- 视觉对比截图集合（建议在 PR/附件中存档）

——

## 迁移规范（必须遵守）

命名与组织
- 组件使用 `PascalCase`，hooks/stores `camelCase`，页面 `kebab-case`
- SCSS 采用 BEM-like：`.index-page__stat-item` 等
- 绝对导入使用 `@/`，样式引用集中通过 `app.scss` 入口

样式与令牌
- 仅通过 `src/styles/tokens.scss` 与 `src/styles/nutui-theme.scss` 变更，全局与局部样式引用语义层变量
- 不允许直接写颜色/阴影/圆角/字号的硬编码值
- rpx 为主标尺，间距与字号按 8px 栅格等比折算

覆盖策略
- 优先主题变量（组件级）→ 其次语义工具类（全局）→ 最后局部样式最小覆盖
- 任何新增样式必须可被 tokens 驱动，避免二次改造成本

禁止事项
- 修改 icon 文件、替换图标集、调整 icon 命名
- 修改 TS/TSX 结构、增删 DOM 节点以匹配样式
- 引入新依赖、新 PostCSS/构建插件

提交与 PR
- 遵循 Conventional Commits（如 `feat(style): align tokens with ui`）
- 每个 PR 附：影响页面清单、截图对比、勾选本方案“检查清单”
- 合并前需通过：`pnpm lint` 与 `pnpm build:weapp`

——

## 附：示例映射片段（参考实现）

1) tokens（节选，不要重复定义已有 token 名）
```scss
// src/styles/tokens.scss
page {
  /* brand */
  --color-primary: #478EF2;        /* from ui */
  --color-primary-dark: #1A73E8;   /* from ui */
  --color-primary-bg: rgba(71, 142, 242, 0.1);

  /* semantic */
  --bg-body: var(--color-gray-100);
  --text-primary: var(--color-gray-900);
  --border-base: var(--color-gray-300);

  /* radius & shadow */
  --radius-md: 16rpx;
  --shadow-md: 0 4rpx 16rpx rgba(0, 0, 0, 0.05);
}
```

2) NutUI 主题绑定（节选）
```scss
// src/styles/nutui-theme.scss
$primary-color: var(--color-primary);
$success-color: var(--color-success);
$warning-color: var(--color-warning);
$danger-color: var(--color-error);

$button-default-background-color: var(--bg-card);
$button-default-border-color: var(--border-base);
$button-default-color: var(--text-primary);

$card-background: var(--bg-card);
$card-border-radius: var(--radius-lg);
$card-box-shadow: var(--shadow-md);
```

3) 全局工具类只用语义变量（节选）
```scss
// src/app.scss
.text-primary { color: var(--text-primary); }
.bg-primary { background-color: var(--bg-primary); }
.rounded-md { border-radius: var(--radius-md); }
.shadow-md { box-shadow: var(--shadow-md); }
```

——

## 变更与记录
- 本文档为迁移单一事实来源，后续对齐 `ui/` 更新时持续维护
- 若上游设计规范变动，先更新 tokens → 再更新主题绑定；保持页面/组件零变更

——

## OKLCH 兼容性验证与用例（详细）

目标
- 明确 WeChat 小程序（开发者工具与至少两台不同基础库版本真机）对 `oklch()` 的解析与渲染行为。

环境
- 不改动构建链；使用现有 `pnpm dev:weapp` 输出 WXSS。

方法
- 新建“兼容性验证页”（临时，不合入主干，仅本地）：
  - 区块 A：背景色设置为 `oklch(0.65 0.15 234)`；相邻区块 B：使用等价 sRGB 近似值（如 `#478EF2`）。
  - 在不同基础库版本真机上截图比对，记录是否一致、是否降级为透明/黑色。
  - 文本/边框/渐变分别验证 3 类用法。

判定
- 任一目标环境不等价：禁止在运行时样式中使用 `oklch()`，仅保留十六进制/rgba 值。
- 所有目标环境等价：允许在 tokens 注释中记录 `oklch()` 原始值，但运行时仍以 sRGB 值下发（默认策略）。

风险与回退
- 风险：基础库升级/降级导致表现不一致；回退：统一改为 sRGB 常量，移除 `oklch()` 引用。

验证记录与模板
- 详见：`docs/compatibility/oklch-validation.md`
- 当前结论（2025-10-05）：运行时禁用 `oklch()`，仅保留 sRGB 值（见验证指引中的记录表格）。

——

## 色彩体系冲突解决方案（细化）

场景
- 现状为蓝主色；`ui/` 可能引入绿主色（WeChat 风格）。

方案
- 引入品牌别名 `--color-brand`：
  - 若选择蓝：`--color-brand: #478EF2`；若选择绿：`--color-brand: #07C160`（示例值，最终以设计确认为准）。
  - `--text-link: var(--color-brand)`；按钮/高亮/选中等组件主题统一引用品牌别名。
  - 新老并行（一个版本）：保留 `--color-primary` 指向旧值，提供兼容；页面与组件迁移完成后收敛。

校验
- 常用状态色（success/warning/danger/info）不随品牌变动；与品牌色区分清晰。
- 文本与背景对比度达标（AA）。

——

## NutUI 主题变量完整映射表（本仓库现有变量 → 语义 tokens）

说明
- 右侧为建议绑定的 CSS 变量（tokens.scss 中定义），如无完全等价项，用“需新增”标注。

通用与色彩
- `$primary-color` → `var(--color-brand)`（默认等同 `--color-primary`；品牌切换时变更）
- `$primary-color-start` → `var(--color-primary-light)`
- `$primary-color-end` → `var(--color-primary-dark)`
- `$primary-text-color` → `var(--color-brand)`
- `$help-color` → `var(--color-gray-600)`
- `$success-color` → `var(--color-success)`
- `$danger-color` → `var(--color-error)`
- `$warning-color` → `var(--color-warning)`
- `$info-color` → `var(--color-info)`
- `$white` → `var(--color-white)`
- `$black` → `var(--color-black)`
- `$title-color` → `var(--text-primary)`
- `$title-color-2` → `var(--text-regular)`
- `$text-color` → `var(--text-regular)`
- `$text-color-2` → `var(--text-secondary)`
- `$text-color-3` → `var(--text-placeholder)`
- `$disable-color` → `var(--text-disabled)`
- `$background-color` → `var(--bg-body)`
- `$background-color-2` → `var(--bg-card)`
- `$border-color` → `var(--border-base)`

字体与字号
- `$font-family` → `var(--font-family-base)`
- `$font-size-0` → `var(--font-size-xs)`（近似，10px→12px；如需严格 10px，标注“需新增”）
- `$font-size-1` → `var(--font-size-sm)`
- `$font-size-2` → `var(--font-size-base)`
- `$font-size-3` → `var(--font-size-lg)`
- `$font-size-4` → `var(--font-size-xl)`
- `$font-size-5` → `var(--font-size-2xl)`
- `$font-size-large` → `var(--font-size-xl)`
- `$font-size-base` → `var(--font-size-base)`
- `$font-size-small` → `var(--font-size-sm)`

按钮 Button
- `$button-primary-background-color` → `var(--color-brand)`
- `$button-primary-border-color` → `var(--color-brand)`
- `$button-default-height` → `var(--btn-height-lg)`
- `$button-default-border-radius` → `var(--btn-radius)`
- `$button-default-font-size` → `var(--btn-font-size)`
- `$button-small-height` → `var(--btn-height-sm)`
- `$button-large-height` → 需新增 `--btn-height-xl: 96rpx`（或以 `calc()` 派生）
- `$button-loading-color` → `rgba(var(--color-white), 0.5)`（或固定 `rgba(255,255,255,0.5)`）
- `$button-disabled-opacity` → `0.5`（保留常量）

单元格 Cell
- `$cell-background` → `var(--bg-card)`
- `$cell-border-radius` → `var(--radius-md)`
- `$cell-padding-v` → `var(--spacing-3)`
- `$cell-padding-h` → `var(--spacing-4)`
- `$cell-font-size` → `var(--font-size-base)`
- `$cell-title-color` → `var(--text-primary)`
- `$cell-title-font-size` → `var(--font-size-base)`
- `$cell-sub-title-color` → `var(--text-secondary)`
- `$cell-sub-title-font-size` → `var(--font-size-sm)`
- `$cell-value-color` → `var(--text-regular)`

输入框 Input
- `$input-height` → `var(--input-height-lg)`
- `$input-border-radius` → `var(--input-radius)`
- `$input-border` → `2rpx solid var(--input-border-color)`
- `$input-background` → `var(--color-white)`
- `$input-padding` → `0 var(--input-padding-x)`
- `$input-font-size` → `var(--font-size-base)`
- `$input-placeholder-color` → `var(--text-placeholder)`
- `$input-disabled-color` → `var(--text-disabled)`
- `$input-focus-border-color` → `var(--color-brand)`
- `$input-focus-box-shadow` → `0 0 0 4rpx var(--color-primary-bg)`

表单 Form
- `$form-item-margin-bottom` → `var(--spacing-4)`
- `$form-label-font-size` → `var(--font-size-base)`
- `$form-label-width` → `200rpx`（如需 token 化，标注“需新增”）
- `$form-label-margin-right` → `var(--spacing-3)`
- `$form-label-text-align` → `right`（保持常量）
- `$form-label-required-color` → `var(--danger-color)` 或 `var(--color-error)`

表格 Table
- `$table-border-color` → `var(--table-border-color)`
- `$table-background` → `var(--bg-card)`
- `$table-header-background` → `var(--table-header-bg)`
- `$table-header-font-weight` → `600`（保持常量）
- `$table-header-color` → `var(--table-header-text)`
- `$table-header-font-size` → `var(--font-size-base)`
- `$table-body-font-size` → `var(--font-size-base)`
- `$table-cell-padding` → `var(--table-cell-padding)`
- `$table-striped-background` → `#FAFBFC`（可替换为 `var(--color-gray-50)`）
- `$table-hover-background` → `var(--table-row-hover-bg)`

对话框 Dialog
- `$dialog-width` → `600rpx`（或新增 token）
- `$dialog-header-height` → `96rpx`（或新增 token）
- `$dialog-header-font-size` → `var(--font-size-lg)`
- `$dialog-border-radius` → `var(--radius-xl)`
- `$dialog-background` → `var(--color-white)`
- `$dialog-backdrop-background` → `rgba(0,0,0,0.5)`（保持常量）

弹出层 Popup
- `$popup-border-radius` → `24rpx 24rpx 0 0`（或新增 token）
- `$popup-background` → `var(--color-white)`
- `$popup-close-icon-size` → `36rpx`（或新增 token）
- `$popup-close-icon-color` → `var(--text-secondary)`

标签 Tag
- `$tag-height` → `var(--tag-height)`
- `$tag-padding` → `var(--tag-padding)`
- `$tag-font-size` → `var(--tag-font-size)`
- `$tag-border-radius` → `var(--tag-radius)`
- `$tag-background-color` → `var(--background-color)` 或 `var(--bg-body)`
- `$tag-color` → `var(--text-regular)`
- `$tag-primary-background-color` → `var(--color-primary-bg)`
- `$tag-primary-color` → `var(--color-brand)`
- `$tag-success-background-color` → `rgba(0,181,120,0.1)`（可 token 化）
- `$tag-success-color` → `var(--color-success)`
- `$tag-danger-background-color` → `rgba(245,63,63,0.1)`（可 token 化）
- `$tag-danger-color` → `var(--color-error)`
- `$tag-warning-background-color` → `rgba(255,159,0,0.1)`（可 token 化）
- `$tag-warning-color` → `var(--color-warning)`

标签页 Tabs
- `$tabs-background` → `var(--color-white)`
- `$tabs-titles-height` → `88rpx`（或新增 token）
- `$tabs-titles-font-size` → `var(--font-size-base)`
- `$tabs-titles-color` → `var(--text-secondary)`
- `$tabs-titles-active-color` → `var(--color-brand)`
- `$tabs-tab-line-color` → `var(--color-brand)`
- `$tabs-tab-line-height` → `4rpx`（或新增 token）

搜索栏 SearchBar
- `$searchbar-height` → `72rpx`（或新增 token）
- `$searchbar-background` → `var(--background-color)` 或 `var(--bg-body)`
- `$searchbar-border-radius` → `36rpx`（或新增 token）
- `$searchbar-font-size` → `var(--font-size-base)`
- `$searchbar-placeholder-color` → `var(--text-placeholder)`
- `$searchbar-padding` → `0 var(--spacing-3)`

导航 Navbar
- `$navbar-height` → `var(--nav-height)`
- `$navbar-background` → `var(--nav-bg)`
- `$navbar-box-shadow` → `var(--nav-shadow)`
- `$navbar-title-font-size` → `var(--font-size-lg)`
- `$navbar-title-font-weight` → `600`（保持常量）
- `$navbar-title-color` → `var(--text-primary)`

底部栏 Tabbar
- `$tabbar-height` → `100rpx`（或 `var(--nav-height)` 的变体）
- `$tabbar-background` → `var(--color-white)`
- `$tabbar-border-top` → `2rpx solid var(--border-base)`
- `$tabbar-item-font-size` → `var(--font-size-sm)`
- `$tabbar-item-color` → `var(--text-secondary)`
- `$tabbar-item-active-color` → `var(--color-brand)`
- `$tabbar-item-icon-size` → `44rpx`（或新增 token）

列表 List
- `$list-background` → `var(--color-white)`
- `$list-item-padding` → `var(--spacing-3) var(--spacing-4)`
- `$list-item-border-bottom` → `2rpx solid var(--border-base)`
- `$list-item-font-size` → `var(--font-size-base)`

卡片 Card
- `$card-background` → `var(--card-bg)`
- `$card-border-radius` → `var(--card-radius)`
- `$card-box-shadow` → `var(--card-shadow)`
- `$card-padding` → `var(--card-padding)`
- `$card-header-font-size` → `var(--font-size-lg)`
- `$card-header-font-weight` → `600`（保持常量）
- `$card-body-font-size` → `var(--font-size-base)`

徽标 Badge
- `$badge-background` → `var(--color-error)`
- `$badge-color` → `var(--color-white)`
- `$badge-font-size` → `var(--font-size-xs)`
- `$badge-padding` → `0 8rpx`（或新增 token）
- `$badge-min-width` → `32rpx`（或新增 token）
- `$badge-height` → `var(--badge-size)`
- `$badge-border-radius` → `var(--badge-radius)`

进度条 Progress
- `$progress-height` → `12rpx`（或新增 token）
- `$progress-border-radius` → `6rpx`（或新增 token）
