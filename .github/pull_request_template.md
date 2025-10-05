标题：样式迁移阶段提交（请按需改成具体任务名）

变更类型
- [ ] 文档 / 流程
- [ ] 样式（仅 tokens / 主题变量 / 工具类）
- [ ] 局部样式兜底（说明原因）

本次提交对应阶段
- [ ] M0 品牌色确认
- [ ] M1 截图基线
- [ ] M2 OKLCH 验证
- [ ] M3 Tokens 对齐
- [ ] M4 NutUI 主题映射
- [ ] M5 局部兜底
- [ ] M6 收敛

引用与依据（必填）
- 方案与规范：`docs/ui-style-migration-6A.md`
- 架构与契约：`docs/architecture.md`
- 任务卡：`docs/tasks.atomize.md`（填入 TaskID）

清单（按阶段勾选）
- M1 基线：已按 `docs/baseline/README.md` 采集并归档；命名合规
- M2 OKLCH：已按 `docs/compatibility/oklch-validation.md` 完成记录并给出结论
- 禁令自检：未改 TS/TSX/DOM；未改 icon；无硬编码色值/尺寸
- 构建校验：`pnpm lint` / `pnpm build:weapp`（仅代码改动 PR 需要）

截图/证据链接
- 基线/对比图：
- 验证记录：

风险与回退（如有）
- 风险：
- 回退：

