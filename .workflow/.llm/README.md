# LLM 协作提示词包（Unified，无严格角色）

本模板用于驱动多个对等智能体（如 Trae、Claude Code 等）在同一个仓库内协作开发。核心目标是**强制执行 6A 工作法**和**简明步骤法**，并通过 `.llm/state.json` 保证单一真实来源（SSOT）。此外引入“规格驱动（Spec-Driven）”理念：**规格/计划是源，代码是表达**；任何实现须可从需求→决策→任务→代码→证据反向追溯。如未严格遵循以下约束，请及时回滚并补充材料。

## 仓库结构
- `prompts/`：常用提示词模板，供人工或自动化引用。
- `.llm/prompts/`：隐藏目录（可选），适合 CI/流水线或敏感配置。
- 预期产物：`docs/charter.align.yaml`、`docs/architecture.md`、`docs/tasks.atomize.md`、`.llm/qa/acceptance.md`、`.llm/session_log/`、`.llm/handoff/` 等。
 - `templates/`：文档模板与示例（architecture、tasks.atomize），可直接复制到 `docs/` 起草与落地。

## 强约束：6A + 简明步骤法
- **Align → Architect → Atomize → Approve → Automate → Assess** 依次推进，任何阶段未通过门禁不得越级执行。
- 每次对话输出必须包含 `Context / Plan / Execute / Verify / Record / Next` 六段，并引用真实证据。
- `.llm/state.json` 每轮完整覆盖写回，字段含义见 `prompts/state.schema.md`。
- 若信息不足或门禁未满足，必须停止实现并写明 `open_questions` 与 `blocks`。
- 任务拆解与推理全过程必须使用 sequential thinking（简明步骤法），禁止跳步、合并或以主观描述替代。
- TaskID 与子任务命名遵循统一规范，详见“模块/子任务命名规范”。

### 前置门禁（Architect 阶段需显式记录）
- 简单门（Simplicity）：以最小项目/组件数量达成目标，禁止“为未来预留”的抽象。
- 反抽象门（Anti-Abstraction）：优先直接使用框架/库，不做不必要封装。
- 集成优先门（Integration-First）：先定义契约（接口/事件/数据模型），以契约/集成测试做主要验证。

### 契约目录（Contract Catalog）
- 在 `docs/architecture.md` 维护接口/事件/数据模型的“契约目录”（含位置/版本/责任人），作为任务设计、测试与验收的依据。
- 任务需在 `SpecRef` 字段指向其对应契约或架构章节锚点。

## 文档模板与使用
- 架构模板：`templates/architecture.template.md`
  - 包含：决策与依据表、契约目录、Phase -1 Gates（Simplicity/Anti-Abstraction/Integration-First）小节与证据位。
  - 用法：复制为 `docs/architecture.md`，按模块补齐“契约目录”与门禁结论；在 `.llm/state.json.gates/contracts` 引用相应锚点。

- 任务清单模板：`templates/tasks.atomize.template.md`
  - 包含：符合 1–3 小时颗粒度的 TaskCard 示例，新增 `SpecRef/VerifyPlan/CoverageCheck` 字段演示。
  - 用法：复制/合并到 `docs/tasks.atomize.md`，为每个任务补齐与契约/架构的映射与验证计划；在审批前以 `prompts/checklists.6A.md` 自检。

## 6A 工作法心智要点
- **Align（对齐）**：需求澄清，绝不允许“我觉得你想要...”，所有不确定项写入 `open_questions` 并寻求确认。
- **Architect（架构）**：先设计后编码，告别“边写边想”，在 `docs/architecture.md` 与 ADR 中固化方案。
- **Atomize（原子化）**：大任务拆小，AI 再笨也能做对，借助 sequential thinking 列出可执行子任务。
- **Approve（审批）**：人工检查，AI 想偷懒？门都没有，必须等待 `APPROVED <TaskID>` 才能实施。
- **Automate（执行）**：按文档执行，有据可查，每一步保留命令、证据与更新的文档/测试。
- **Assess（评估）**：质量验收，不合格就重来，失败即返回 Atomize 修正并补充证据。

## 启动流程（参考 `prompts/start.onboarding.md`）
1. 人类填写 `[项目接入 - 启动]` 信息。
2. 若缺少 `.llm/state.json`，立即初始化：
   - 产出 `docs/charter.align.yaml`，列出目标/非目标/范围/约束/DoD/开放问题。
   - 拆解首批 1–3 小时颗粒的 TaskCard，写入 `docs/tasks.atomize.md`。
   - 选择待执行任务并等待 `APPROVED <TaskID>` 门禁。
3. 所有输出回传**完整** `.llm/state.json`、变更文件列表与下一步建议。

## 项目初始化与规划 SOP
- **Align**：以 `docs/charter.align.yaml` 统一业务目标、约束、DoD，并显式列出开放问题；任何假设都要记录在 `open_questions`。
- **Architect**：基于 charter 产出 `docs/architecture.md`，覆盖 C4 草图、接口、数据流；必要时创建 ADR（`.llm/decisions/ADR-*`）。
- **Atomize**：使用 `prompts/task.start.md` 将目标拆成 1–3 小时颗粒 TaskCard；每卡必须标注依赖、风险、输入产物，并保持 Backlog 状态有序（Draft/Ready/Approved/Doing/Assess）。
- **审批准备**：对每个 Ready 卡运行 `prompts/checklists.6A.md` 自检，确认输入资料、验收标准、责任人、轮换计划齐备后再申请审批。
- **状态同步**：初始化完成后，`.llm/state.json` 必须包含项目标识、当前阶段、待办 TaskID、下一步行动、计划交接时间等，以便任意智能体随时接管。

## 模块/子任务命名规范
- **模块代号**：对齐架构文档中的模块，采用大写蛇形命名（例如 `AUTH_SERVICE`、`PAYMENT_UI`），在 charter 与 architecture 中定义并复用。
- **TaskID**：遵循 `TASK-<模块代号>-<三位序号>`（如 `TASK-AUTH_SERVICE-001`），序号按模块递增，保证同模块下的任务有序可追踪。
- **子任务/步骤**：当使用 sequential thinking 分解任务时，生成 `STEP-<TaskID>-<两位序号>`（如 `STEP-TASK-AUTH_SERVICE-001-01`），并在 `docs/tasks.atomize.md` 的对应 TaskCard 下列出。
- **文档与提交引用**：在 session log、handoff、commit message 中引用 TaskID/STEPID，确保上下文检索一致；禁止使用模糊描述（如“登录相关任务”）。
- **命名治理**：若发现命名冲突或模块拆分调整，先更新 charter/architecture，再按上述规则批量重命名，禁止在多个命名体系之间混用。

## 任务生命周期（参考 `prompts/task.start.md`）
- TaskCard 必须包含 Scope/NonGoals/Constraints/DoD/Inputs/Risks/Estimate/Owner/HandoverTargets。
- TaskCard 更新后追加到 `docs/tasks.atomize.md`，保持自动编号。
- 未获得 `APPROVED <TaskID>` 前禁止进入 Automate；若得到 `CHANGES_REQUESTED`，回到 Atomize 修订。
- Automate 阶段交付：代码 + 测试（单测/E2E）+ 文档 + Runbook。缺一项即视为未完成。

## 并行子任务支持（state.json）
- `.llm/state.json` 支持并行：使用 `tasks[]` + `active_task_ids` 管理多 TaskID 并发执行。
- 项目级与任务级并存：保持项目级 `stage/gates/contracts/coverage/evidence_pack` 与任务级 `tasks[].stage/status/...` 一致性。
- 审批按任务级：见 `prompts/approve.md`；交接与证据建议同样按任务级记录（`tasks[].handoff/evidence_pack`）。

## 单任务执行 SOP
1. **Context**：引用当前 `state.json`、TaskCard、相关 ADR/设计文档，确认上下文完整且无开放阻塞。
2. **Plan**：列出 3–7 步可验证行动，覆盖实现、测试、文档与风险缓解；必要时刷新 `risks`。
3. **Execute**：按计划实施，并在完成后同步代码、测试用例、文档、脚本或 Runbook；保留关键命令与输入输出。
4. **Verify**：运行最小自验证（单元/集成/E2E），记录命令与结果；如需人工验收，写明步骤与预期。
5. **Record**：完整更新 `.llm/state.json`、`docs/tasks.atomize.md` 状态与 `.llm/session_log/…`；若触发交接，生成 `.llm/handoff/` 包并在 state 标记。
6. **Next**：明确下一步（如等待审批、请求评审、准备 Assess），并在 TaskCard 中同步状态与责任人。

## 轮换与交接（参考 `prompts/policy.rotation.md` + `prompts/handoff.md`）
- 触发条件：TTL ≤ 30 分钟、上下文 ≥ 80%、等待审批、任务 > 90 分钟无 DoD、异常回滚。
- 交接动作：
  1. 生成 `.llm/handoff/TASK-*.md`，写明入口、改动、验证、回滚、开放问题。
  2. 更新 `state.json.handoff`（`required`、`reason`、`to`、`package`）。
  3. 在 `.llm/session_log/{date}-{agent}.md` 记录摘要与文件清单。
- 接收方需用简明步骤法确认接力并继续维护 state。

## 审批与验收（参考 `prompts/approve.md` + `prompts/assess.md`）
- 审批指令：`APPROVED <TaskID>` 或 `CHANGES_REQUESTED <TaskID>: <说明>`。
- Assess 阶段输出：
  - DoD 核对清单、测试与构建证据、回归评估、发布说明。
  - 同步 `.llm/qa/acceptance.md` 与 `.llm/state.json`，结论未通过需回到 Atomize。

## 智能体职责（参考 `prompts/system.base.md` + `prompts/role.agent.md`）
- 所有接入的通用智能体皆为 Generalist Agent（如 Trae、Claude Code 等），可在任意阶段执行；不得假定固定分工。
- 任一输出需同步 state 与 session log；若资料不全立即停止并回填阻塞项。
- 阶段门禁、交接协议、证据同步是 Hard Requirement，违反视为流程失败。

> 提示：在自动化或多轮对话环境中，可将对应模板粘贴到提示窗口，确保模型严格执行流程。如出现偏差，请回到上一阶段补齐产物，再继续推进。
