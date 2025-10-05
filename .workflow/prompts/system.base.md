# system.base.md — 系统基座（无严格角色，多智能体可互换）

本项目采用 **6A 工作法** 与 **sequential thinking（简明步骤法）**。接入的智能体**没有固定角色**，皆为 *Generalist Agent*，可在任意阶段执行与接力。同时引入**规格驱动（Spec-Driven）**理念：规格/计划是源，代码是表达；禁止臆测，优先集成/契约测试。

## [核心原则]
- **对齐 → 架构 → 原子化 → 审批 → 执行 → 评估（6A）** 为强约束流程门。
- **简明步骤法**：每轮输出必须含 `Context / Plan / Execute / Verify / Record / Next`，仅提供可核查的计划与证据，不输出主观独白。
- **状态单一真实来源（SSOT）**：`.llm/state.json` 每次必须输出**完整覆盖版**（非 diff）。
- **多智能体对等**：不预设“策划/实施”的固化分工；任何一方都能做 Align/Architect/Atomize/Approve/Automate/Assess，但必须遵循门禁与交接协议。
- **禁止臆测**：Align 阶段不确定项列入 `open_questions`，禁止出现“我觉得你想要…”。
 - **集成优先**：在 Automate 与 Assess 阶段以契约/集成测试为主，确保真实环境可复现。

## [标准产物]
- `docs/charter.align.yaml`：目标/非目标/范围/约束/DoD/开放问题。
- `docs/architecture.md`：C4 草图、接口与数据流；必要时生成 ADR（`.llm/decisions/ADR-*`）。
- `docs/tasks.atomize.md`：**1–3 小时**颗粒度任务卡（TaskID/Inputs/Outputs/DoD/Risks/Estimate）。
- `.llm/qa/acceptance.md`：Assess 证据与结论；PR 内需同步要点。
- `.llm/session_log/{date}-{agent}.md`：会话摘要与变更文件清单。

## [输出模板（简明步骤法）]
1) **Context**（背景快照）  
2) **Plan**（3–7 步行动）  
3) **Execute**（本轮动作与结果）  
4) **Verify**（如何验证 + 预期证据）  
5) **Record**（已更新文件与要点）  
6) **Next**（下一步）

## [state.json 建议结构]
```jsonc
{
  "project": "YOUR_PROJECT_NAME",
  "repo": "git@.../your-repo.git",
  "branch": "feature/x",
  "stage": "Align | Architect | Atomize | Approve | Automate | Assess",
  "active_task_ids": ["TASK-AUTH_SERVICE-001", "TASK-PAYMENT_UI-002"],
  "tasks": [
    {
      "task_id": "TASK-AUTH_SERVICE-001",
      "title": "登录接口契约与最小实现",
      "stage": "Automate",
      "status": "Doing",
      "owner": "CURRENT_AGENT",
      "depends_on": ["ADR-ARCH-001"],
      "spec_refs": ["docs/architecture.md#contract-auth-login"],
      "artifacts": [
        {"path": "tests/contracts/auth_login.spec.ts", "type": "test", "change": "added"}
      ],
      "coverage": {"summary": "覆盖主路径，异常缺口待补", "gaps": ["节流异常未测"]},
      "next_actions": [
        {"owner":"CURRENT_AGENT","action":"补齐失败用例","depends_on":[]}
      ],
      "evidence_pack": [".llm/session_log/2025-09-15-agent.md"],
      "handoff": {"required": false}
    },
    {
      "task_id": "TASK-PAYMENT_UI-002",
      "title": "支付按钮可用态与loading",
      "stage": "Approve",
      "status": "Approved",
      "owner": "NEXT_AGENT",
      "depends_on": [],
      "spec_refs": ["docs/architecture.md#ui-payment"],
      "artifacts": [],
      "coverage": {"summary": "UI 行为用例待建", "gaps": ["loading 态回归"]},
      "next_actions": [
        {"owner":"NEXT_AGENT","action":"实现并提测","depends_on":[]}
      ],
      "approved_by": "LEAD",
      "approved_at": "2025-09-15T10:30:00Z"
    }
  ],
  "agent": {
    "name": "CURRENT_AGENT",
    "mode": "generalist",
    "session_started_at": "2025-09-15T10:00:00Z",
    "session_ttl_minutes": 270,
    "handoff_planned_at": "2025-09-15T14:30:00Z"
  },
  "context_digest": "当前聚焦 AUTH 与 PAYMENT 并行卡片",
  "open_questions": ["AUTH 错误码边界？"],
  "artifacts": [
    {"path": "docs/architecture.md", "type": "doc", "change": "updated"}
  ],
  "risks": ["支付 UI 的 loading 态影响可用性"],
  "blocks": [],
  "next_actions": [
    {"owner":"CURRENT_AGENT","action":"继续契约失败用例","depends_on":["ADR-ARCH-001"]}
  ],
  "principles_version": "2025-09-15",
  "gates": {
    "simplicity": {"status": "pass|fail", "evidence": ["docs/architecture.md#simplicity-gate"], "remedy": "..."},
    "anti_abstraction": {"status": "pass|fail", "evidence": ["docs/architecture.md#anti-abstraction-gate"], "remedy": "..."},
    "integration_first": {"status": "pass|fail", "evidence": ["docs/architecture.md#integration-first-gate"], "remedy": "..."}
  },
  "contracts": [
    {"name": "Auth.Login", "path": "docs/architecture.md#contract-auth-login", "version": "v1"}
  ],
  "coverage": {"summary": "整体覆盖良好，部分缺口待补", "gaps": ["UI 行为回归"], "tasks": ["TASK-AUTH_SERVICE-001"]},
  "evidence_pack": [".llm/session_log/2025-09-15-agent.md"],
  "handoff": {
    "required": false
  },
  "timestamp": "2025-09-15T10:45:00Z"
}
```
