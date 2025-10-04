Context
- 应用户要求减少审批次数，将多个细粒度 TaskCard 合并为单卡执行。
- 参考 `.workflow/README.md`，仍需保留历史 TaskCard 但可通过新卡统一审批。

Plan
- 在 tasks.atomize.md 中标记旧 TaskCard 为历史记录，新增合并卡 `TASK-UI_STYLE-002`。
- 更新 state.json：旧任务设为 Blocked，新任务 Ready，并将 active_task_ids 精简为单卡。
- 记录变更动机，确保后续仅需一次 APPROVED。

Execute
- 重写 docs/tasks.atomize.md：为 TaskCard 2–6 加 ⚠️ 提示，新建 TaskCard 7。
- 更新 .llm/state.json：
  - active_task_ids 改为 ["TASK-UI_STYLE-002"]
  - 旧任务 status=Blocked，next_actions 指向新卡
  - 新增 TASK-UI_STYLE-002（合并卡，stage=Approve, status=Ready）
- 新增会话日志（本文件）。

Verify
- docs/tasks.atomize.md 与 state.json 均能查到合并卡及历史任务保留记录。
- `.workflow` 约束未违反：仍使用 TaskCard，但审批数量减至 1。

Record
- 产物：docs/tasks.atomize.md、.llm/state.json、.llm/session_log/2025-10-05-task-consolidation.md。

Next
- 待用户发送：`APPROVED TASK-UI_STYLE-002`
- 获批后直接进入合并卡执行（基线 + OKLCH + 样式改动 + 单 PR）。

