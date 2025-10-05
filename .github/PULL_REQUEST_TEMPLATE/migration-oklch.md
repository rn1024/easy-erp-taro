标题：M2 OKLCH 兼容性验证记录 PR

任务与依据
- TaskID：TASK-OKLCH-001
- 指南：`docs/compatibility/oklch-validation.md`
- 方案：`docs/ui-style-migration-6A.md#oklch-兼容性验证与用例（详细）`

提交内容
- [ ] 开发者工具 + iOS + Android 各至少 1 套截图
- [ ] 覆盖三类用例：背景/文本/边框（A/B/C 对比）
- [ ] 记录模板已填写（设备/基础库、判定、结论）

自检清单
- [ ] 未修改构建链；运行时默认 sRGB
- [ ] 若任一目标环境不等价：结论为“禁用运行时 oklch()”
- [ ] 若全部等价：运行时仍以 sRGB 下发，仅保留 oklch 注释

证据
- 截图/记录路径：
- 结论（允许/禁用/仅离线）：

