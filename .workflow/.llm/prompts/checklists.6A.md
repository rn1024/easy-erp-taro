# checklists.6A.md — 6A 阶段检查清单（通用）

## Align
- [ ] 目标/非目标/范围/约束/DoD 完成
- [ ] 开放问题已列出（无臆测）

## Architect
- [ ] 架构草图（C4）与关键接口说明
- [ ] 必要 ADR 创建
 - [ ] 前置门禁：Simplicity / Anti-Abstraction / Integration-First 已评估并记录（未通过项写入 `risks` 与补救计划）
 - [ ] `docs/architecture.md` 已维护“契约目录”（接口/事件/数据模型及其位置/版本）

## Atomize
- [ ] 任务颗粒 1–3 小时
- [ ] 每卡含 Inputs/Outputs/DoD/Risks/Estimate/Owner

## Approve
- [ ] 等待 `APPROVED <TaskID>` 再进入 Automate

## Automate
- [ ] 代码 + 测试 + 文档 + Runbook 同步
- [ ] 提供最小复现实例/证据
 - [ ] 优先补齐契约/集成测试，验证按“契约目录”执行，产出可复现的报告与日志

## Assess
- [ ] DoD 核对 + 证据归档 `.llm/qa/acceptance.md`
- [ ] 结论与返工项闭环
 - [ ] 按契约/用例覆盖进行验收；必要时更新契约与架构文档并回填 TaskCard 的 `CoverageCheck`
