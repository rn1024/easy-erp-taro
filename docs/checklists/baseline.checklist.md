# 截图基线执行检查清单（M1）

基本信息
- 设备与基础库：
- 构建： dev / build（均需）

范围覆盖
- [ ] 列表页：normal / empty / error / loading
- [ ] 详情页：normal / error
- [ ] 表单页：normal / disabled / validation-error
- [ ] 弹层：normal / loading
- [ ] 结果页：success / warning / error
- [ ] 组件态：hover / active / disabled / loading

命名与存放
- [ ] 目录：`docs/baseline/weapp/before/`
- [ ] 命名：`<page>-<state>-<device>-<lib>.png`

质量门槛
- [ ] 对比度 AA：正文≥4.5:1，次要≥3:1
- [ ] 布局/栅格不变（仅视觉差异）

提交
- [ ] before/after 图片均推送到 `docs/baseline/weapp/(before|after)/`
- [ ] 在 PR 附截图清单与差异说明（可接受/需修正）
