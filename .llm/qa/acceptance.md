# QA 验收清单（UI 样式迁移）

## DoD 对照
- [ ] 视觉与 ui/ 规范一致（色/字/距/角/影/态）
- [ ] 对比度 AA：正文≥4.5:1，次要≥3:1
- [ ] 关键流程冒烟通过（Weapp）
- [ ] 样式仅来源于 tokens/主题变量，无硬编码

## 证据与产物
- 截图基线：`docs/baseline/`（before 与各阶段）
- 方案与映射：`docs/ui-style-migration-6A.md`
- 架构与契约：`docs/architecture.md`
- 任务卡与状态：`docs/tasks.atomize.md`、`.llm/state.json`

## 检查步骤
- 打开 Weapp（dev/build 两套）并逐页面对照基线
- 按组件态：正常/hover/active/disabled/加载/空态/错误态检查
- 校验品牌主色一致性与对比度阈值

## 结论
- 结果：Pass | Fail
- 备注：

