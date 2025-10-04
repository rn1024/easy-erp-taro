Context
- 项目：easy-erp-taro；目标：UI 样式迁移，仅改样式不改结构/icon。
- 依据：.workflow/README.md 强约束（6A + 简明步骤法）。

Plan
- 生成 charter.align.yaml、architecture.md、tasks.atomize.md、.llm/state.json。
- 不改代码，仅初始化需求变更与任务拆分。

Execute
- 创建 docs/charter.align.yaml，明确范围/DoD/开放问题。
- 创建 docs/architecture.md，定义契约与前置门禁结论。
- 创建 docs/tasks.atomize.md，录入 M0–M2 任务卡与后续准备卡。
- 初始化 .llm/state.json，登记任务与阶段状态。

Verify
- 对照 .workflow/templates 与 prompts/state.schema.md 字段检查通过。

Record
- 产物：
  - docs/charter.align.yaml
  - docs/architecture.md
  - docs/tasks.atomize.md
  - .llm/state.json
  - docs/ui-style-migration-6A.md（先前已存在并补充）

Next
- 等待 M0《品牌色确认单》签字（TASK-UI_STYLE-001）
- 执行截图基线采集（TASK-QA_BASELINE-001）
- 进行 OKLCH 兼容性验证并记录（TASK-OKLCH-001）

