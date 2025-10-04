# 任务清单（UI 样式迁移）

## TaskCard 1 — 品牌色确认（M0）
```yaml
TaskCard:
  TaskID: TASK-UI_STYLE-001
  Project: easy-erp-taro
  Goal: 确认品牌主色并固化色彩冲突方案
  Scope: 选择蓝(#478EF2)或绿(#07C160)，确定 --color-brand 别名策略
  NonGoals: 不涉及 tokens/theme 代码更改
  Constraints: 需产品/设计签字；遵循对比度 AA
  Definition_of_Done:
    - docs/ui-style-migration-6A.md 更新“品牌色确认与变更控制流程”结果
    - 《品牌色确认单》签字归档
  Inputs:
    - docs/charter.align.yaml
    - docs/ui-style-migration-6A.md
  Risks:
    - 品牌切换导致对比度风险
  Estimate: 1h
  Owner: CURRENT_AGENT
  SpecRef: architecture.md#contract-design-tokens
  VerifyPlan: "审阅确认单并在 PR 中附对比评估"
  CoverageCheck: "覆盖主色/链接色/按钮主态映射"
```

## TaskCard 2 — 截图基线建立（M1）
```yaml
TaskCard:
  TaskID: TASK-QA_BASELINE-001
  Project: easy-erp-taro
  Goal: 建立迁移前截图基线
  Scope: 关键页面/组件态在目标设备/基础库取样
  NonGoals: 不做样式更改
  Constraints: 设备与基础库按规范；输出 docs/baseline/
  Definition_of_Done:
    - 完成规范要求的截图并归档 docs/baseline/
    - 在 PR 中附对比清单
  Inputs:
    - docs/ui-style-migration-6A.md#截图基线规范（执行前建立）
  Risks:
    - 设备差异影响显示
  Estimate: 2h
  Owner: QA/FE
  SpecRef: architecture.md#contract-design-tokens
  VerifyPlan: "人工核验命名/范围；抽样复看"
  CoverageCheck: "覆盖列表/详情/表单/弹层/结果与组件态"
```
⚠️ 已由 TASK-UI_STYLE-002 合并执行，仅保留历史记录。

## TaskCard 3 — OKLCH 兼容性验证（M2）
```yaml
TaskCard:
  TaskID: TASK-OKLCH-001
  Project: easy-erp-taro
  Goal: 明确 WXSS 对 oklch 的支持与回退策略
  Scope: DevTools+真机对比 oklch 与 sRGB
  NonGoals: 不修改构建链
  Constraints: 记录结论与截图；运行时默认 sRGB
  Definition_of_Done:
    - 记录兼容矩阵与判定结论到 docs/ui-style-migration-6A.md
  Inputs:
    - docs/ui-style-migration-6A.md#oklch-兼容性验证与用例
  Risks:
    - 版本差异导致渲染不一致
  Estimate: 2h
  Owner: FE
  SpecRef: architecture.md#contract-design-tokens
  VerifyPlan: "提供对比截图与说明"
  CoverageCheck: "覆盖背景/文本/边框三类用法"
```
⚠️ 已由 TASK-UI_STYLE-002 合并执行，仅保留历史记录。

## TaskCard 4 — 令牌映射审查（M3 准备）
```yaml
TaskCard:
  TaskID: TASK-TOKENS-001
  Project: easy-erp-taro
  Goal: 从 ui/ 抽取并对齐 tokens 差异矩阵
  Scope: 列表出新增/缺失/冲突/等价项
  NonGoals: 立即改代码
  Constraints: 仅输出审查清单与变更建议
  Definition_of_Done:
    - 提交差异矩阵与建议到 docs/ui-style-migration-6A.md 附录
  Inputs:
    - ui/src/docs/design-system*.json|md
    - src/styles/tokens.scss
  Risks:
    - 命名冲突
  Estimate: 2h
  Owner: FE
  SpecRef: architecture.md#contract-design-tokens
  VerifyPlan: "双向核对每个 token 对应关系"
  CoverageCheck: "覆盖色/字/距/角/影/动效全类"
```
⚠️ 已由 TASK-UI_STYLE-002 合并执行，仅保留历史记录。

## TaskCard 5 — NutUI 变量映射审查（M4 准备）
```yaml
TaskCard:
  TaskID: TASK-THEME_NUTUI-001
  Project: easy-erp-taro
  Goal: 完成 NutUI 主题变量 → tokens 语义的映射审查
  Scope: 覆盖现有 src/styles/nutui-theme.scss 中所有变量
  NonGoals: 立即改代码
  Constraints: 缺口以“需新增 token”标注
  Definition_of_Done:
    - docs/ui-style-migration-6A.md 映射表“无缺漏或已标注”
  Inputs:
    - src/styles/nutui-theme.scss
    - docs/ui-style-migration-6A.md#nutui-主题变量完整映射表
  Risks:
    - 个别变量无语义等价项
  Estimate: 2h
  Owner: FE
  SpecRef: architecture.md#contract-nutui-theme-map
  VerifyPlan: "抽查按钮/表单/导航/卡片/Badge 样例"
  CoverageCheck: "核心组件≥90%"
```
⚠️ 已由 TASK-UI_STYLE-002 合并执行，仅保留历史记录。

## TaskCard 6 — 审批与门禁（M0–M2 汇总）
```yaml
TaskCard:
  TaskID: TASK-APPROVE-001
  Project: easy-erp-taro
  Goal: 汇总并申请审批进入 Automate
  Scope: 收口 M0-M2 文档与基线产物
  NonGoals: 代码改动
  Constraints: 等待 APPROVED 指令
  Definition_of_Done:
    - 获得 APPROVED TASK-APPROVE-001
  Inputs:
    - 上述 TaskCard 的产物
  Risks:
    - 评审延期
  Estimate: 1h
  Owner: FE Lead
  SpecRef: docs/charter.align.yaml
  VerifyPlan: "走查清单 prompts/checklists.6A.md"
  CoverageCheck: "门禁项全覆盖"
```
⚠️ 已由 TASK-UI_STYLE-002 合并执行，仅保留历史记录。

## TaskCard 7 — 核心样式迁移执行（合并卡）
```yaml
TaskCard:
  TaskID: TASK-UI_STYLE-002
  Project: easy-erp-taro
  Goal: 一次性完成核心样式迁移（基线采集、OKLCH 验证、tokens 与 NutUI 主题对齐、必要兜底）
  Scope:
    - 采集核心 5 页 before 基线（首页、登录、产品列表、扫码查询-结果、散件库存-列表/表单）
    - 核查 OKLCH → sRGB 回退策略（运行时以 sRGB 为准）
    - 更新 src/styles/tokens.scss、src/styles/nutui-theme.scss、必要局部样式
    - 提交单个 PR，附基线对比、验证记录与回滚方案
  NonGoals:
    - 调整布局/交互/业务逻辑
    - 引入新依赖或修改构建链
  Constraints:
    - 品牌色固定为蓝 #478EF2
    - 若 OKLCH 不兼容，运行时全部使用 sRGB
    - 仅允许修改样式相关文件与文档
  Definition_of_Done:
    - 核心 5 页 before/after 基线截图归档，命名符合规范
    - OKLCH 验证记录（DevTools + iOS + Android）完成并结论明确
    - tokens 与 NutUI 主题映射覆盖主要组件，lint/build 通过
    - 单个 PR（引用模板）+ 回滚说明 + 验收清单
  Inputs:
    - docs/ui-style-migration-6A.md
    - docs/baseline/README.md / pages.weapp.before.yaml / shots & scripts
    - docs/compatibility/oklch-validation.md
  Risks:
    - 截图/验证设备不可用 → 需提前沟通或说明豁免
    - 主题变量遗漏导致局部视觉不一致 → 采用映射表逐项对照
  Estimate: 4h
  Owner: CURRENT_AGENT
  SpecRef:
    - architecture.md#contract-design-tokens
    - architecture.md#contract-nutui-theme-map
    - docs/ui-style-migration-6A.md
  VerifyPlan: "提交单 PR，附核心页面前后对比、OKLCH 记录、lint/build 结果"
  CoverageCheck: "tokens 与 NutUI 主题覆盖 ≥90%，核心 5 页视觉一致"
```

