# PR 模板 — TASK-UI_STYLE-002

## 标题
`feat(style): align design tokens and nutui theme with ui/ design system`

## 变更类型
- [ ] 文档 / 流程
- [x] 样式（tokens / 主题变量）
- [ ] 局部样式兜底

## 本次提交对应阶段
- [x] M0 品牌色确认（已批准 TASK-UI_STYLE-001）
- [x] M1 截图基线（清单已准备）
- [x] M2 OKLCH 验证（已完成，结论：不支持）
- [x] M3 Tokens 对齐（已完成）
- [x] M4 NutUI 主题映射（已完成）
- [ ] M5 局部兜底（本次不涉及）
- [ ] M6 收敛（待后续）

---

## 变更摘要

### 核心目标
将 `ui/` 目录的设计系统（色彩、字体、间距、圆角、阴影等）同步到小程序端，保持现有布局与交互逻辑不变，仅更新样式。

### 主要变更

#### 1. tokens.scss 更新
- **品牌色**: 固定为蓝色 `#3b82f6` (from ui/ blue-500，已确认)
- **基准字号**: 从 14px 调整为 16px，对齐 ui/ 移动端标准
- **触控标准**: 按钮/输入框最小高度从 36px 调整为 44px
- **圆角系统**: 对齐 ui/ WeChat 风格
  - Card: 8px (--radius-md)
  - Button/Input: 12px (--radius-lg)
  - Modal: 16px (--radius-xl)
- **阴影系统**: 使用 ui/ 的轻量级阴影
- **字体栈**: 对齐 ui/ 系统字体优先策略
- **OKLCH**: 仅在注释中保留参考，运行时使用 sRGB 值

#### 2. nutui-theme.scss 更新
- 所有 NutUI 组件变量绑定到 tokens.scss
- 移除硬编码值，统一通过 CSS 变量驱动
- 主要组件覆盖：
  - Button: 高度、圆角、间距
  - Input: 高度、圆角、边框
  - Card: 圆角、阴影、间距
  - Navbar: 高度、阴影
  - Form: 间距、标签样式
  - Table: 表头、边框、悬停态

---

## 引用与依据
- **方案与规范**: `docs/ui-style-migration-6A.md`
- **架构与契约**: `docs/architecture.md`
- **任务卡**: `docs/tasks.atomize.md` (TASK-UI_STYLE-002)
- **品牌色确认**: `docs/approvals/brand-color-confirmation.md`

---

## 验证记录

### OKLCH 兼容性验证
- **结论**: 微信小程序不支持 `oklch()` CSS 语法
- **策略**: 运行时使用 sRGB 值，仅在 tokens 注释中保留 OKLCH 参考
- **详情**: `docs/compatibility/oklch-validation.md`

### 构建验证
- ✅ **Lint**: `npm run lint` - 通过
- ✅ **Build**: `npm run build:weapp` - 构建成功
- **日志**:
  - `docs/verification/lint.log`
  - `docs/verification/build.log`

---

## 截图清单

### 核心 5 页

参考 `docs/baseline/screenshot-checklist.md` 进行采集：

#### Before 截图（迁移前）
- [ ] 首页 (index) - 正常态
- [ ] 登录 (login) - 正常态
- [ ] 产品列表 (products) - 列表正常态
- [ ] 扫码查询 (query-scan) - 结果正常态
- [ ] 散件库存 (spare-inventory) - 列表正常态、表单弹层

#### After 截图（迁移后）
- [ ] 首页 (index) - 正常态
- [ ] 登录 (login) - 正常态
- [ ] 产品列表 (products) - 列表正常态
- [ ] 扫码查询 (query-scan) - 结果正常态
- [ ] 散件库存 (spare-inventory) - 列表正常态、表单弹层

### 截图存放路径
```
docs/baseline/weapp/before/
docs/baseline/weapp/after/
```

### 对比要点
- [x] 品牌色从蓝 #478EF2 更新为蓝 #3b82f6
- [x] 卡片圆角从 12px 调整为 8px
- [x] 按钮/输入框高度从 36px 调整为 44px
- [x] 字号基准从 14px 调整为 16px
- [x] 阴影效果更轻量
- [ ] 布局结构保持不变
- [ ] 无功能性变更

---

## 风险与回退

### 风险评估
1. **OKLCH 不支持** ✅
   - 已采用 sRGB 回退策略
   - 未来可通过 tokens 注释恢复

2. **字号变化影响布局** ⚠️
   - 从 14px 调整为 16px 可能影响文本换行
   - 需通过截图对比验证
   - 如有问题，可微调局部组件字号

3. **触控区域变化** ℹ️
   - 按钮/输入框高度增加，符合移动端标准
   - 可能影响紧凑布局页面
   - 需通过真机测试验证

### 回退方案
```bash
# 1. 回滚样式文件
git checkout HEAD~1 -- src/styles/tokens.scss
git checkout HEAD~1 -- src/styles/nutui-theme.scss

# 2. 重新构建
npm run build:weapp

# 3. 验证
npm run lint
```

或直接回滚整个 commit：
```bash
git revert <commit-hash>
```

---

## 禁令自检
- [x] ✅ 未修改 TS/TSX 文件
- [x] ✅ 未修改 DOM 结构
- [x] ✅ 未修改 icon 资源
- [x] ✅ 无硬编码色值/尺寸（全部使用 tokens）
- [x] ✅ 未引入新依赖
- [x] ✅ 未修改构建配置

---

## Checklist（提交前）

### 必做项
- [ ] before/after 截图已上传到 `docs/baseline/weapp/`
- [ ] 截图已在 PR 中引用（建议使用表格对比）
- [ ] lint 和 build 日志已附上
- [ ] 已填写视觉对比结果（可接受/需修正）

### 可选项
- [ ] QA 验收清单已勾选
- [ ] 产品/设计已确认视觉对比
- [ ] 已在开发环境真机测试核心流程

---

## 相关文档
- 截图采集指引: `docs/baseline/screenshot-checklist.md`
- 基线规范: `docs/baseline/README.md`
- UI 迁移方案: `docs/ui-style-migration-6A.md`
- OKLCH 验证: `docs/compatibility/oklch-validation.md`
- 任务拆分: `docs/tasks.atomize.md`

---

## 提交说明

### Commit Message
```
feat(style): align design tokens and nutui theme with ui/ design system

- Update tokens.scss: align colors, typography, spacing, radius, shadows to ui/
- Update nutui-theme.scss: bind all variables to tokens, no hardcoded values
- Brand color: fixed to blue #3b82f6 (from ui/, approved in TASK-UI_STYLE-001)
- Base font size: adjusted from 14px to 16px for mobile
- Touch target: increased button/input min-height to 44px
- Border radius: aligned to ui/ WeChat style (card: 8px, button: 12px, modal: 16px)
- OKLCH: disabled at runtime (not supported), use sRGB fallback

Refs: TASK-UI_STYLE-002
Docs: docs/ui-style-migration-6A.md

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude <noreply@anthropic.com>
```

---

## 下一步
1. 采集 before/after 截图（参考 `docs/baseline/screenshot-checklist.md`）
2. 上传截图到 `docs/baseline/weapp/`
3. 在 PR 中引用截图对比
4. 提交 PR 并申请 Review

