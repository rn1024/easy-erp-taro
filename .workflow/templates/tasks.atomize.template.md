# 任务清单模板（Spec-Driven + 6A）

> 用途：作为 `docs/tasks.atomize.md` 的起稿模板。任务需与规格/契约建立映射，具备 1–3 小时粒度与可验证的 DoD。

## TaskCard 示例 1（1–3 小时）
```yaml
TaskCard:
  TaskID: TASK-AUTH_SERVICE-001
  Project: Creatoria
  Goal: 登录接口契约定义与最小实现
  Scope: 定义 Auth.Login 契约并提供最小返回
  NonGoals: 不含刷新、第三方登录
  Constraints: 截止日期 T+2；仅本地环境
  Definition_of_Done:
    - 契约文档存在并在架构中可检索（Contract Catalog）
    - 提交最小可复现实例（命令/脚本）
    - 提交契约/集成测试并通过
  Inputs:
    - docs/architecture.md#contract-auth-login
  Risks:
    - 认证错误码定义不全（需在 Assess 阶段补齐）
  Estimate: 2h
  Owner: CURRENT_AGENT
  Handover_Targets: AgentRoster
  SpecRef: architecture.md#contract-auth-login
  VerifyPlan: "运行 tests/contracts/auth_login.spec.ts；curl 脚本: scripts/demo-login.sh"
  CoverageCheck: "覆盖 Auth.Login 正常/失败 2 个主路径；缺口：异常节流未覆盖"
```

## TaskCard 示例 2（1–3 小时）
```yaml
TaskCard:
  TaskID: TASK-AUTH_SERVICE-002
  Project: Creatoria
  Goal: 用户创建事件契约与模拟发布
  Scope: 定义 User.Created 事件并提供模拟发布器
  NonGoals: 不含消费端实现
  Constraints: 本地单节点；允许至少一次投递语义
  Definition_of_Done:
    - 事件契约定义；模拟发布脚本
    - 集成测试验证事件格式、必填字段
  Inputs:
    - docs/architecture.md#contract-user-created
  Risks:
    - 事件时序不稳定
  Estimate: 3h
  Owner: CURRENT_AGENT
  Handover_Targets: AgentRoster
  SpecRef: architecture.md#contract-user-created
  VerifyPlan: "运行 tests/contracts/user_created.spec.ts；脚本: scripts/publish-user-created.sh"
  CoverageCheck: "覆盖必填字段校验；缺口：重试/去重未覆盖"
```

> 注意：实际录入 `docs/tasks.atomize.md` 时，需按你们既定 TaskID 规范依序追加，并补齐 Inputs/Outputs/DoD/Risks/Estimate/Owner 字段。

