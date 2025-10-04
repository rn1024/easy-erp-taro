Context
- TaskID: TASK-QA_BASELINE-001（截图基线建立）
- SpecRef: docs/ui-style-migration-6A.md#截图基线规范（执行前建立）

Plan
- 按规范输出执行文档与模板，不改代码。
- 设定设备/基础库矩阵与命名规则，指导后续采集。

Execute
- 新增 docs/baseline/README.md（执行指引、命名与模板）。
- 更新 .llm/state.json：设为 Doing，并记录批准信息。
- 新增 PR 模板与清单：.github/PULL_REQUEST_TEMPLATE/migration-baseline.md、docs/checklists/baseline.checklist.md。
- 新增页面清单：docs/baseline/pages.weapp.before.yaml（按仓库页面生成的 before 基线项）。
- 新增精细点位：docs/baseline/shots.weapp.query-scan.yaml、docs/baseline/shots.weapp.spare-inventory.yaml。
- 新增拍摄脚本：docs/baseline/scripts.weapp.query-scan.result.md、docs/baseline/scripts.weapp.spare-inventory.form-modal.md。

Verify
- 文档包含范围、设备、命名、执行步骤、模板与提交要求。

Record
- 产物：docs/baseline/README.md, .llm/state.json。

Next
- 采集 before 基线截图并归档到 docs/baseline/weapp/before/。
- 在 PR 中附清单与差异摘要。
