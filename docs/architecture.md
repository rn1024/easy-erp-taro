# 架构（UI 样式迁移）

## 1. 背景与范围
- 背景：将 ui/ 的设计风格与语言同步到 Weapp 客户端，仅改样式，不改结构/逻辑/icon。
- 范围（In-Scope）：设计令牌、NutUI 主题变量、全局工具类及必要的局部样式兜底。
- 非目标（Out-of-Scope）：业务逻辑与接口、图标资源变更、构建链变更。

## 2. C4 草图（概览）
- System Context：Weapp 客户端（Taro + NutUI）对接 ERP 后端；本次仅影响样式层。
- Containers：
  - Design Tokens（SCSS + CSS Variables）
  - NutUI Theme（SCSS 变量映射）
  - Global Utilities（app.scss 工具类）
- Components：页面局部样式（按需兜底，不引入硬编码）。

## 3. 原则引用
- 简单优先 / 反抽象 / 集成优先 / SSOT / 禁止臆测

## 4. 决策与依据（摘要）
| 决策 | 动机 | 备选 | 取舍 | SpecRef | ADR-ID |
|---|---|---|---|---|---|
| 品牌别名 --color-brand | 统一蓝/绿切换 | 直接写死色值 | 选别名，避免重构 | ui-style-migration-6A.md#色彩体系冲突解决方案 | ADR-STYLE-001 |
| OKLCH 仅离线记录 | 运行时兼容性不稳 | 强制使用 oklch | 运行时 sRGB，保留注释 | ui-style-migration-6A.md#oklch-兼容性验证与用例 | ADR-STYLE-002 |

## 5. 契约目录（Contract Catalog）
| 名称 | 类型 | 路径/锚点 | 版本 | 责任人 | 消费方 | 核验入口 |
|---|---|---|---|---|---|---|
| DesignTokens | Spec | architecture.md#contract-design-tokens | v1 | FE | FE/QA | docs/ui-style-migration-6A.md |
| NutUIThemeMap | Spec | architecture.md#contract-nutui-theme-map | v1 | FE | FE/QA | docs/ui-style-migration-6A.md |

### 5.1 合同细则
#### contract-design-tokens
- 以 `src/styles/tokens.scss` 为源，所有颜色/字号/间距/圆角/阴影/动效经由 CSS Variables 暴露。
- 不允许在局部样式写死色值/尺寸；仅引用语义变量。

#### contract-nutui-theme-map
- 以 `src/styles/nutui-theme.scss` 为源，所有 NutUI 主题变量须绑定到 tokens 的语义层。
- 不允许直接绑定常量色值。

## 6. Phase -1 Gates（Architect 前置门禁）

#### simplicity-gate
- 判定：最小集合达到目标。
- 结论：pass
- 证据：仅 tokens + theme + utilities + 极少局部兜底。

#### anti-abstraction-gate
- 判定：直接使用 NutUI 主题能力，避免额外封装。
- 结论：pass
- 证据：不引入自定义主题系统，仅映射变量。

#### integration-first-gate
- 判定：已有契约并以对比截图/组件态回归验证。
- 结论：pass
- 证据：docs/ui-style-migration-6A.md + 截图基线规范。

## 7. 风险与缓解
- 兼容性风险（OKLCH）：运行时使用 sRGB；真机验证后再决定是否保留注释。
- 主题覆盖不全：先完成映射表审查 + 组件态点验。

## 8. 验证计划（摘要）
- 契约/集成测试：以截图基线对比 + 组件态回归（正常/hover/active/disabled/加载）。
- 最小可复现场景：`pnpm dev:weapp` 预览，按“截图基线规范”取样。

