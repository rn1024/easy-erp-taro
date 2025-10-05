# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 📋 Essential Commands

### Development
```bash
# Install dependencies
pnpm install

# Development servers
pnpm dev:weapp     # WeChat Mini Program development
pnpm dev:h5        # H5 web development

# Build production
pnpm build:weapp   # WeChat Mini Program production build
pnpm build:h5      # H5 web production build

# Code quality
pnpm lint          # ESLint check
pnpm lint:fix      # ESLint auto-fix
```

### Testing & Verification
- **No test command configured** - Tests should be implemented based on project needs
- Verify builds with: `pnpm build:weapp` and check dist/ folder
- Check lint compliance: `pnpm lint` (must pass before commits)

## 🏗️ Architecture Overview

This is a **Taro 4.1.2 + React 18 + TypeScript** cross-platform application with the following stack:

### Core Technologies
- **Frontend Framework**: Taro 4.1.2 (React-based multi-platform framework)
- **UI Library**: NutUI React Taro 3.0.16 (mobile-optimized components)
- **State Management**: Zustand 4.5.7 (lightweight state management)
- **Language**: TypeScript with strict type checking
- **Styling**: SCSS with design tokens system
- **Platform Targets**: WeChat Mini Program (primary), H5, other mini-programs

### Project Architecture

```
src/
├── components/         # Reusable React components
│   ├── common/        # Generic UI components
│   │   ├── SectionCard/    # Container cards
│   │   ├── StatsGrid/      # Responsive statistics grid
│   │   ├── InfoList/       # Icon+Label+Value lists
│   │   ├── FilterChips/    # Filter UI components
│   │   ├── ProgressBar/    # Progress indicators
│   │   └── PageHeader/     # Page headers
│   └── business/      # Business-specific components
├── pages/             # Taro page components
│   ├── index/         # Dashboard/Home
│   ├── login/         # Authentication
│   ├── query/         # Search functionality
│   ├── inventory/     # Inventory management
│   ├── warehouse/     # Warehouse operations
│   └── products/      # Product management
├── services/          # API integration layer
├── stores/            # Zustand state stores
├── hooks/             # Custom React hooks
│   ├── useListQuery.ts    # List pagination/filtering
│   └── useFilters.ts      # Filter state management
├── styles/            # Design system
│   ├── tokens.scss        # Design tokens (colors, spacing, etc.)
│   ├── nutui-theme.scss   # NutUI theme customization
│   └── partials/          # SCSS utilities and mixins
└── types/             # TypeScript type definitions
```

### Key Patterns
- **Pages**: Each page follows Taro's file-based routing with `.config.ts`, `.scss`, and `.tsx` files
- **Components**: Functional React components with TypeScript, following mobile-first design
- **Services**: API layer with typed interfaces, centralized in `services/` directory
- **State**: Zustand stores for global state, local state with React hooks
- **Styling**: Design tokens + NutUI theme variables, no hardcoded values

## 🔄 Strict Task Execution Workflow (6A Methodology)

**CRITICAL**: This project enforces strict 6A workflow execution. ALL tasks must follow this methodology:

### 1. **Align** (对齐) - Requirements Clarification
- **Never assume** what the user wants - ask for clarification
- **All uncertainties** must be recorded in `open_questions`
- **Use sequential thinking** for requirement analysis
- Reference: `.llm/state.json` for current project status

### 2. **Architect** (架构) - Design Before Code
- **Design first, code second** - never "code while thinking"
- Update `docs/architecture.md` with decisions
- Follow **Phase -1 Gates**: Simplicity/Anti-Abstraction/Integration-First
- Reference existing contracts in `docs/architecture.md#contract-*`

### 3. **Atomize** (原子化) - Break Down Tasks
- **Use sequential thinking** to break large tasks into 1-3 hour chunks
- Update `docs/tasks.atomize.md` with detailed TaskCards
- Each task must include: Scope/NonGoals/Constraints/DoD/Inputs/Risks/Estimate/Owner
- **TaskID format**: `TASK-<MODULE>-<NUMBER>` (e.g., `TASK-UI_STYLE-001`)

### 4. **Approve** (审批) - Human Verification Required
- **Wait for explicit approval**: `APPROVED <TaskID>` before proceeding
- If `CHANGES_REQUESTED <TaskID>`, return to Atomize phase
- **No code execution** without approval

### 5. **Automate** (执行) - Documented Implementation
- Follow the documented plan exactly
- Update `.llm/state.json` with progress
- **Always run lint and build** verification after changes
- Maintain evidence trail in `.llm/session_log/`

### 6. **Assess** (评估) - Quality Verification
- Run full verification: lint, build, functional testing
- If verification fails, return to Atomize phase
- Update task status in `.llm/state.json`

### Sequential Thinking Requirement
**MANDATORY**: Use `mcp__Sequential_Thinking__sequentialthinking` tool for:
- Task decomposition
- Problem analysis requiring multiple steps
- Any planning or design decisions
- Complex workflow analysis

### State Management
- **Single Source of Truth**: `.llm/state.json` contains all task states
- **Current active tasks**: Check `active_task_ids` before starting work
- **Task dependencies**: Respect `depends_on` relationships
- **Never skip waiting tasks** - follow dependency order strictly

## 🎨 Design System & Styling

### Design Tokens Architecture
- **Source**: `ui/` design system (external reference)
- **Implementation**: `src/styles/tokens.scss` (CSS variables)
- **Theme**: `src/styles/nutui-theme.scss` (NutUI component theming)
- **Brand Color**: Currently `#3b82f6` (blue) - controlled via `--color-brand`

### Styling Rules
- **No hardcoded values** in component styles
- **Use design tokens** from `tokens.scss` for all styling
- **NutUI components** should be themed via `nutui-theme.scss`
- **OKLCH colors**: Documented but use sRGB fallbacks for compatibility
- **Mobile-first**: Use `rpx` units, 44px minimum touch targets

### Style Architecture
```scss
// Design tokens (CSS variables)
src/styles/tokens.scss
  ├── Color system (brand, semantic, neutral)
  ├── Typography (font sizes, weights, line heights)
  ├── Spacing (margins, paddings)
  ├── Border radius
  └── Shadows & animations

// NutUI theme mapping
src/styles/nutui-theme.scss
  └── Maps all NutUI variables to design tokens

// Component styles
pages/*/index.scss & components/*/index.scss
  └── Component-specific styles using tokens only
```

## 🔧 Code Standards & Conventions

### TypeScript
- **Strict mode enabled** - no `any` types allowed (ESLint enforced)
- **Explicit types** for all function parameters and returns
- **Interface-first** approach for data structures

### React Patterns
- **Functional components only** with hooks
- **Props interfaces** must be defined for all components
- **Custom hooks** for reusable stateful logic
- **Error boundaries** for production stability

### File Naming & Structure
- **kebab-case** for directories
- **PascalCase** for React components
- **camelCase** for utilities and services
- **Page structure**: `index.config.ts`, `index.scss`, `index.tsx`

### Import Standards
```typescript
// External libraries first
import React from 'react'
import { View } from '@tarojs/components'

// Internal imports - absolute paths preferred
import { useUserStore } from '@/stores/userStore'
import { ApiService } from '@/services/api'

// Relative imports last
import './index.scss'
```

## 📱 Platform-Specific Considerations

### WeChat Mini Program (Primary Target)
- **API Limitations**: Use Taro APIs, not web APIs directly
- **Routing**: Taro's built-in navigation system
- **Storage**: Taro.setStorageSync/getStorageSync for persistence
- **Permissions**: Handle mini-program specific permissions

### Cross-Platform Compatibility
- **Conditional imports** for platform-specific code
- **Responsive design** for different screen sizes
- **API polyfills** where needed via Taro

## 🚀 Development Workflow Integration

### Pre-commit Requirements
1. **Lint check must pass**: `pnpm lint`
2. **Build must succeed**: `pnpm build:weapp`
3. **Type check**: TypeScript compilation without errors
4. **6A workflow compliance**: All changes must reference approved TaskIDs

### Documentation Updates
- **Architecture changes**: Update `docs/architecture.md`
- **Task progress**: Update `.llm/state.json` and `docs/tasks.atomize.md`
- **Session logs**: Maintain in `.llm/session_log/`

### Git Commit Format
```
<type>(<scope>): <description>

TaskID: TASK-<MODULE>-<NUMBER>
```

## ⚠️ Critical Constraints

### Forbidden Actions
- **Never bypass 6A workflow** - all work must be approved
- **Never skip sequential thinking** for complex analysis
- **Never hardcode styles** - use design tokens only
- **Never commit without lint/build verification**
- **Never modify business logic** during styling tasks
- **Never assume requirements** - always clarify with user

### Required Approvals
- **UI/UX Changes**: Screenshot comparisons required
- **Architecture Changes**: ADR documentation required
- **New Dependencies**: Justification and approval needed
- **Breaking Changes**: Impact analysis and migration plan

### Error Handling
- **Production errors**: Must be gracefully handled
- **API failures**: Implement proper fallbacks
- **Offline scenarios**: Consider network limitations
- **User feedback**: Clear error messages and loading states

## 📚 Key Documentation References

- **Project Overview**: `docs/PROJECT_OVERVIEW.md`
- **Technical Architecture**: `docs/TECHNICAL_ARCHITECTURE.md`
- **6A Workflow Guide**: `.workflow/README.md`
- **Current Task Status**: `.llm/state.json`
- **Task Definitions**: `docs/tasks.atomize.md`
- **UI Style Migration**: `docs/ui-style-migration-6A.md`

Remember: This project prioritizes **strict process adherence**, **type safety**, and **mobile-first design**. Always use sequential thinking for complex decisions and maintain the 6A workflow discipline.

---

## 📋 Claude 执行约束 (v2.0 - 2025-01-05)

### 强制约束更新

#### 6A 工作法强制格式
每次对话必须包含以下结构，**违反将触发流程回滚**：

```markdown
## Context（上下文）
- 引用 .llm/state.json 当前状态
- 确认无开放阻塞项
- 相关文档引用

## Plan（计划）
- 3-7步可验证行动
- 风险识别与缓解

## Execute（执行）
- 按计划逐步实施
- 保留命令和证据

## Verify（验证）
- 运行验证：lint + build
- 记录测试结果

## Record（记录）
- 更新 .llm/state.json
- 同步任务文档

## Next（下一步）
- 明确后续行动
- 等待审批或进入下一阶段
```

#### 禁止行为（新增）
- ❌ **跳过6A输出格式** - 必须包含完整六段
- ❌ **不使用简明步骤法** - 复杂推理必须用 Sequential Thinking
- ❌ **直接执行未审批任务** - 必须等待 `APPROVED <TaskID>`
- ❌ **状态不同步** - 每次必须完整更新 `.llm/state.json`
- ❌ **违反样式partials原则** - 必须使用共享mixins，禁止重复代码

#### 新增样式partials系统
```scss
// 强制使用 partials，禁止重复代码
@use "../../styles/partials/layouts" as layouts;
@use "../../styles/partials/interactions" as interactions;

.page {
  @include layouts.page-wrapper;    // 标准页面容器
  
  &__content {
    @include layouts.page-content;  // 页面内容布局
  }
  
  &__action {
    @include interactions.action-item; // 交互元素
  }
}
```

#### TaskID 严格规范
- **页面重构模块**：`TASK-PAGE_REFACTOR-<XXX>`
- **UI样式模块**：`TASK-UI_STYLE-<XXX>`
- **组件开发**：`TASK-COMPONENT-<XXX>`
- **API集成**：`TASK-API-<XXX>`

#### 质量门禁更新
```bash
# 每次代码变更必须通过
npm run lint          # ESLint 检查，0错误
npm run build:weapp    # 微信小程序构建成功
```

#### .llm/state.json 状态管理
```json
{
  "stage": "当前6A阶段",
  "active_task_ids": ["活跃任务列表"],
  "tasks": [
    {
      "task_id": "TASK-MODULE-XXX",
      "stage": "任务阶段",
      "status": "Ready|Approved|Doing|Done",
      "approved_by": "审批人",
      "evidence_pack": ["证据文件"]
    }
  ]
}
```

### 验收标准
每个任务完成必须满足：
- ✅ **功能验证**：核心功能正常，无回归
- ✅ **代码质量**：通过 lint + build，符合编码规范
- ✅ **文档同步**：architecture.md、tasks.atomize.md 更新
- ✅ **设计一致性**：遵循 ui/ 设计系统
- ✅ **性能基线**：无显著性能下降
- ✅ **证据完整**：变更文件、测试结果、构建日志

### 回滚触发条件
- 构建失败或 lint 错误
- 功能回归或设计不一致  
- 违反6A工作法流程
- 状态同步不完整
- 缺少必要证据包

---

**版本历史**：
- v1.0 (2025-01-03): 初始版本，基础规范
- v2.0 (2025-01-05): 新增6A强制约束、样式partials系统、严格状态管理