# approve.md — 审批/门禁（人类指令通用）

- 通过（单个）：`APPROVED {{TASK-ID}}`
- 通过（多个）：`APPROVED {{TASK-ID1}},{{TASK-ID2}},{{TASK-ID3}}`
- 退回（单个）：`CHANGES_REQUESTED {{TASK-ID}}: <变更要求>`
- 退回（多个）：对各 TaskID 分别下达 `CHANGES_REQUESTED` 指令，或分行书写

并行任务说明：
- `.llm/state.json` 支持并行 `tasks[]`，审批应逐卡落地到 `tasks[].approved_by/approved_at/status`，并将 `active_task_ids` 与 `tasks[].stage` 同步到位。

**收到后必须**：
- `APPROVED` → 进入 **Automate**（任务级）；
- `CHANGES_REQUESTED` → 回到 **Atomize** 拆解/修订（任务级）；
- 同步 `.llm/state.json`（任务级与项目级）与 `docs/tasks.atomize.md` 状态。
