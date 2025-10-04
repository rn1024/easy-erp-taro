# 截图基线规范与执行指引（Weapp）

目标
- 建立迁移前“视觉基线”，用于后续阶段对比验收（仅样式迁移）。

范围
- 关键页面：列表、详情、表单、弹层、结果、仪表盘/统计（如有）
- 关键组件态：正常、hover、active、disabled、加载中、空态/错误态

环境与设备
- 构建：`pnpm dev:weapp`（开发）与 `pnpm build:weapp`（产物）各一轮
- 设备（至少两台）：
  - iOS：iPhone 13，iOS 17，微信 8.x（基础库：最新/最低各一次）
  - Android：中高端机型一台，Android 13，微信 8.x（基础库：最新/最低各一次）

命名与目录
- 存放目录：`docs/baseline/`
- 文件命名：`weapp/<stage>/<page>-<state>-<device>-<lib>.png`
  - 示例：`weapp/before/inventory-list-normal-iphone13-2.33.0.png`
  - `<stage>`：`before`（迁移前基线）、`m3`/`m4`（阶段中间对比）、`after`（迁移完成）

执行步骤
1) 确认页面清单与状态（见“页面与状态模板”）
2) 启动小程序预览，进入指定页面与组件态
3) 按命名规范截图并存放至 `docs/baseline/` 对应目录
4) 在 PR 中附本轮截图清单与差异说明（可接受/需修正）

精细点位清单（推荐对齐）
- 扫码查询：`docs/baseline/shots.weapp.query-scan.yaml`
- 散件库存：`docs/baseline/shots.weapp.spare-inventory.yaml`

可复制拍摄脚本（按步骤执行）
- 扫码查询 Result：`docs/baseline/scripts.weapp.query-scan.result.md`
- 散件库存 FormModal：`docs/baseline/scripts.weapp.spare-inventory.form-modal.md`

## After 捕获与对比

1. 在样式迁移完成后，复用上述清单再次截取同一视图（命名改为 `weapp/after/...`）。
2. 使用对比工具（或小程序开发者工具内置对比）确认差异是否符合预期：仅视觉风格变化、不影响布局交互。
3. 在 PR 中附：
   - before/after 图对照表
   - 视觉差异说明（可接受/需修正）
   - 若存在未覆盖页面，标注原因与后续计划。
4. 记录对比结论到 QA 验收清单，确保核心流程（首页、登录、产品、扫码查询、散件库存）均已验证。

质量要求
- 对比度 AA：正文≥4.5:1，次要≥3:1
- 布局/栅格不变，仅视觉差异

页面与状态模板（复制为清单）
```
- 页面：库存-列表（inventory-list）
  - 状态：normal / empty / error / loading
- 页面：库存-详情（inventory-detail）
  - 状态：normal / error
- 页面：采购-表单（purchase-form）
  - 状态：normal / disabled / validation-error
- 组件：弹层（modal）
  - 状态：normal / loading
- 组件：结果页（result）
  - 状态：success / warning / error
```

提交要求
- 本轮设备/基础库版本说明
- 截图文件列表与对比摘要（变化项、是否接受）
