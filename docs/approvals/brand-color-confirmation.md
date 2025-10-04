# 品牌色确认单（UI 样式迁移）

Meta
- TaskID: TASK-UI_STYLE-001
- Project: easy-erp-taro
- Owner: CURRENT_AGENT
- Date: 2025-10-05

决策背景
- 仅更新样式不改结构/icon；通过 tokens 与 NutUI 主题变量统一视觉。
- 引入品牌别名 `--color-brand`，用于统一主色切换（蓝 ↔ 绿）。

候选方案（二选一）
- 方案 A（蓝）：#478EF2（企业蓝，当前项目默认）
- 方案 B（绿）：#07C160（微信绿，示例，最终以设计确认为准）

生效范围
- 全局：按钮主态/选中高亮/链接色/Tab 激活/进度与强调色
- 组件：NutUI 主题 `$primary-*`、Tabs 激活线、Tag primary、Input focus 边框

对比度与可访问性（AA）
- 要求：正文≥4.5:1，次要≥3:1；按钮文字与背景≥4.5:1
- 检查项：
  - 品牌色 on 白底（文本/填充/边框）
  - 白色文本 on 品牌填充（按钮/Tag/Badge）
  - 品牌 Hover/Active（加深/透明度）与背景的对比
- 结论：待 QA 基线与对照实测补全

实现策略（不改结构）
- tokens：`--color-brand: <选定色值>`；`--text-link: var(--color-brand)`；`--color-primary-bg` 作为弱态背景
- theme（NutUI）：`$primary-color/$primary-text-color/$tabs-titles-active-color/... → var(--color-brand)`
- 局部样式：仅当主题变量无法覆盖时，使用语义变量兜底

风险与缓解
- 风险：切换后与状态色（success/warning/danger/info）混淆
  - 缓解：状态色保持现值且不与品牌色相近；必要时微调状态色饱和度
- 风险：个别组件对比度不足
  - 缓解：提高文本权重/加深背景/增加描边，以 tokens 可控方式实现

上线策略
- 一次性切换（推荐）：改 tokens 值并全量验收
- 灰度切换（可选）：按模块/页面批次放量；阶段性截图对比

签核
- 产品（签名/日期）：
- 设计（签名/日期）：
- 前端（签名/日期）：

最终决策
- 选定方案：A 蓝（#478EF2）
- 实施窗口：待定
- 备注：由用户在会话中选择“A”，正式签核仍需产品/设计签名；实施按确认单及迁移方案执行
