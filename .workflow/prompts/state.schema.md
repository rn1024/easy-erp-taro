# state.schema.md — state.json 字段说明（通用）

- `project/repo/branch`：工程标识
- `stage`：项目的当前 6A 阶段（项目级），并行任务可拥有各自的阶段见 `tasks[].stage`
- `active_task_ids`：数组，当前并行进行中的 TaskID 列表（用于快速检索）
- `tasks[]`：并行子任务列表（替代/扩展原 `task_id` 单值）
  - `task_id`：TaskID（如 `TASK-AUTH_SERVICE-001`）
  - `title`：可选，一句话标题
  - `stage`：该任务所处 6A 阶段（Align/Architect/Atomize/Approve/Automate/Assess）
  - `status`：Backlog 状态（Draft/Ready/Approved/Doing/Assess/Done/Blocked）
  - `owner`：当前责任智能体/人
  - `depends_on`：依赖的 TaskID 列表
  - `spec_refs`：与需求/契约/架构的锚点映射（数组）
  - `artifacts`：本任务的产物清单（相对路径+类型+变更）
  - `coverage`：覆盖自评摘要/缺口（可映射到 TaskCard 的 `CoverageCheck`）
  - `next_actions`：任务级下一步行动（可指向其他 Owner）
  - `evidence_pack`：证据包路径集合（日志/报告/脚本）
  - `handoff`：任务级交接信息
  - `approved_by/approved_at`：审批信息（如适用）
- `agent`：当前执行智能体信息（对等、可互换）
  - `session_ttl_minutes`：会话自我约束 TTL（建议 270 分钟），避免撞平台上限
  - `handoff_planned_at`：计划交接时间戳
- `context_digest`：一行摘要，便于快速恢复
- `open_questions/blocks`：阻塞项与待决问题（项目级，必要时也可在 `tasks[]` 细化）
- `artifacts`：项目级变更产物清单（与任务级并存）
- `next_actions`：项目级下一步（与任务级并存）
- `gates/contracts/coverage/evidence_pack`：项目级门禁、契约目录、覆盖自评与证据包（详见 system.base.md）
- `handoff`：项目级交接元数据（是否必需/原因/目标/包路径）
- `timestamp`：当前时间戳（ISO8601）

兼容性：
- 允许保留历史字段 `task_id`（单值）作为“当前聚焦任务”的快捷引用，但推荐改用 `active_task_ids` + `tasks[]`。
