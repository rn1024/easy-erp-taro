# 架构文档模板（Spec-Driven + 6A）

> 用途：作为 `docs/architecture.md` 的起稿模板，支持“规格为源、代码为表达”的研发方式，要求与 `.llm/state.json` 的 `gates/contracts/coverage` 形成双向引用。

## 1. 背景与范围
- 背景一句话：{{Why / 业务动机}}
- 范围（In-Scope）：{{子系统/模块}}
- 非目标（Out-of-Scope）：{{明确不做}}

## 2. C4 草图（概览）
- System Context：{{系统边界/外部系统}}
- Containers：{{主要容器/服务}}
- Components：{{关键组件/依赖}}

## 3. 原则引用（可选）
- 引用《原则宪章》版本：`docs/principles.constitution.md@{{YYYY-MM-DD}}`
- 关键原则摘录：简单优先 / 反抽象 / 集成优先 / SSOT / 禁止臆测

## 4. 决策与依据（Decision Record 摘要）
| 决策 | 动机 | 备选 | 取舍 | 关联需求/规格（SpecRef） | ADR-ID |
|---|---|---|---|---|---|
| 例如：采用内置队列 | 降低依赖复杂度 | Kafka/RabbitMQ | 吞吐与可运维性权衡 | charter#usecases-A1 | ADR-ARCH-001 |

> 注：完整的权衡过程写入 ADR；此处保留摘要与索引。

## 5. 契约目录（Contract Catalog）
| 名称 | 类型(API/Event/DB) | 路径/锚点 | 版本 | 责任人 | 消费方 | 核验入口 |
|---|---|---|---|---|---|---|
| Auth.Login | API | architecture.md#contract-auth-login | v1 | {{Owner}} | Web/App | tests/contracts/auth_login.spec.ts |
| User.Created | Event | architecture.md#contract-user-created | v1 | {{Owner}} | Billing | tests/contracts/user_created.spec.ts |

### 5.1 合同细则示例
#### contract-auth-login
- 请求：POST /api/login {email,password}
- 响应：200 {token,expiresIn} | 401 {code}
- 错误码：AUTH_INVALID_CREDENTIALS

#### contract-user-created
- 事件：topic=user.created {userId,email,createdAt}
- 语义：创建后30秒内投递，至少一次

## 6. Phase -1 Gates（Architect 前置门禁）

#### simplicity-gate
- 判定：项目/组件数量是否为达成价值的最少集合？
- 结论：pass|fail
- 证据：{{链接到论证/对比}}

#### anti-abstraction-gate
- 判定：是否直接使用框架/库能力，避免额外封装？
- 结论：pass|fail
- 证据：{{链接到PoC/示例}}

#### integration-first-gate
- 判定：是否已定义契约，并约定以契约/集成测试作为主要验证？
- 结论：pass|fail
- 证据：{{契约目录与测试计划链接}}

> 未通过项需登记到 `.llm/state.json.risks`，并在 `next_actions` 安排补救任务。

## 7. 风险与缓解
- 风险：{{...}}；缓解：{{...}}；跟踪：{{TASK-XXX}}

## 8. 验证计划（摘要）
- 契约/集成测试：{{入口、数据、环境}}
- 最小可复现场景：{{命令/脚本}}

