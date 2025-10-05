# start.onboarding.md — 一体化启动（双智能体对等）

```
[项目接入 - 启动]
项目：{{ProjectName}}
仓库：{{RepoURL}}
分支：{{branch}}
目标日期：{{YYYY-MM-DD}}

请严格执行 6A 与“简明步骤法”。接入的通用智能体无固定分工，按 `policy.rotation.md` 轮换接力。推荐按“规格→计划→任务→验证”的顺序推进；Align 阶段未决清零前不得进入 Architect。

若 `.llm/state.json` 不存在：
1) 初始化 `state.json`；产出 `docs/charter.align.yaml`（含开放问题）。
2) 生成首批 1–3 小时 TaskCard（关键路径优先），写入 `docs/tasks.atomize.md`。
3) 选择一张 TaskCard 等待 `APPROVED`；如需交接，按 `handoff.md` 生成交接包。

每次输出：
- 简明步骤法六段
- **完整** `.llm/state.json`
- 变更文件清单与下一步建议
```
