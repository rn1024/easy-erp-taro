# 项目交付规则（6A 工作法）

## Align（对齐）
- 统一目标：Easy ERP Taro 以微信小程序 + H5 的库存与业务管理体验为核心，所有需求需对齐 `docs/PROJECT_OVERVIEW.md` 的业务范围，并在立项前更新需求卡片与成功判定标准。
- 权责透明：引用 `docs/CONTRIBUTING.md`、`docs/COMPONENT_LIBRARY.md` 的现有规范；需求澄清阶段必须同步设计、前端、测试，在 PR/需求单中记录确认结论，禁止主观揣测用户诉求。
- 信息仓库：共享设计稿、API 变更、交互说明到 `docs/` 对应文件，并在 Confluence/需求单附链接，确保所有人基于同一事实源。

## Architect（架构）
- 先设计后编码：新增模块需先提交技术方案，说明页面结构、状态流转、接口契约与异常兜底；方案通过后才允许进入开发排期。
- 目录约束：遵循 `src/components/common|business`、`src/pages`、`src/services`、`src/stores` 的分层；复用逻辑下沉到 `src/utils` 或 hooks，避免在页面内直接堆叠复杂逻辑。
- UI 一致性：NutUI 组件需对齐 `docs/COMPONENT_LIBRARY.md` 的设计 Token，自定义样式统一写入 `src/styles` 并复用 Sass 变量/混入，保持视觉一致与可维护性。

## Atomize（原子化）
- 拆分任务：参照用户旅程将需求拆成「接口联调」「状态管理」「组件实现」「适配测试」等可独立验收的子任务，每个子任务限定单一输出并更新看板状态。
- 代码规范：
  - TypeScript 必须使用显式类型、`Promise` 返回值与错误日志（见 `docs/CONTRIBUTING.md#typescript-规范`）。
  - React 组件保持函数式写法、`useCallback/useMemo` 管理依赖，业务事件透出到 props（见 `docs/CONTRIBUTING.md#react-组件规范`）。
  - 样式使用 BEM + Sass 变量与响应式混入 `respond-below`，避免硬编码颜色与尺寸。
- API 原子化：服务调用集中在 `src/services`，接口异常需抛出自定义错误并统一交给全局错误处理与埋点。

## Approve（审批）
- 自检清单：开发完成后执行 `pnpm pre-commit`，确保 ESLint、TypeScript、Prettier、测试用例与 commit lint 全通过；自测覆盖核心用户路径及适配结果。
- PR 审核：提交 PR 时附带需求背景、方案链接、测试截图/录屏及移动端适配说明；至少一名同事 Code Review，必要时邀请设计/测试联合评审。
- 提交规范：坚持 Conventional Commits，scope 与业务模块一致（如 `feat(inventory)`），确保变更历史可追溯。

## Automate（执行）
- 平台能力配置：
  - 维持 `config/index.js` 中 `designWidth: 750` 与 `deviceRatio` 设定，保证 rpx 换算一致。
  - `mini.postcss.pxtransform` 与 `h5.postcss.autoprefixer` 必须开启，避免私自禁用转换。
- 移动端适配最佳实践（参考 Taro 官方 `size.md` 与 NutUI layout 文档）：
  - 样式层统一使用 rpx/百分比，运行时动态场景用 `Taro.pxTransform()` 将 px 转成 rpx/rem。
  - 组件尺寸写在 Sass 变量中，并通过 `respond-below`、NutUI `Row/Col` 栅格或 Flex 容器实现单行/多列切换。
  - 监听窗口变化使用 `Taro.onWindowResize`，在页面 store 中存储尺寸信息，应对折叠屏与横屏。
  - NutUI 主题通过 CSS Variables 定制（如 `--nut-font-size-1`），所有品牌色、间距、圆角统一在主题映射，禁止直接覆盖组件内部样式。
  - 媒体与图片资源遵循 `url` loader 上限（1KB），超限资源放入 CDN/静态目录并提供高清与压缩版本。
- 自动化脚本：新增流程需补充 `package.json` script 或 `scripts/` 下工具，做到执行有据可查，避免人工步骤遗漏。

## Assess（评估）
- 测试矩阵：单元测试命中关键辅助函数与组件交互；集成测试覆盖状态流；必要时补充 E2E 小程序录制脚本，结果存档在 PR。
- 验收标准：对照 Align 阶段的成功指标进行 Demo 验收，包含移动端适配截图、性能指标（首屏、交互流畅度）与异常恢复能力。
- 回归机制：合并后在 release note 中记录变化及风险点，若评估未通过，需求返回 Atomize 阶段重新拆解与整改。

> 以上规则与 `docs/` 现有规范保持同步，如需调整，请先通过 Architect 阶段的方案评审再落地。

  ·去