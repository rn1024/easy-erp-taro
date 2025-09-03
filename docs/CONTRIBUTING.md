# Easy ERP Taro 贡献指南

感谢您对 Easy ERP Taro 项目的关注！本指南将帮助您了解如何参与项目开发。

## 📋 目录

- [开发环境搭建](#开发环境搭建)
- [项目结构](#项目结构)
- [开发流程](#开发流程)
- [代码规范](#代码规范)
- [提交规范](#提交规范)
- [测试指南](#测试指南)
- [文档编写](#文档编写)
- [问题反馈](#问题反馈)

## 🛠️ 开发环境搭建

### 系统要求
- Node.js >= 18.0.0
- pnpm >= 8.0.0
- Git >= 2.20.0

### 环境安装
```bash
# 1. 克隆项目
git clone https://github.com/your-org/easy-erp-taro.git
cd easy-erp-taro

# 2. 安装依赖
pnpm install

# 3. 启动开发服务器
pnpm dev:h5

# 4. 微信小程序开发
pnpm dev:weapp
```

### 开发工具推荐
- **IDE**: VS Code
- **插件**: 
  - Taro
  - TypeScript
  - ESLint
  - Prettier
  - GitLens
  - Auto Rename Tag

### VS Code 配置
```json
// .vscode/settings.json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "files.associations": {
    "*.config.js": "javascript"
  },
  "emmet.includeLanguages": {
    "typescript": "html",
    "typescriptreact": "html"
  }
}
```

## 🏗️ 项目结构

```
easy-erp-taro/
├── src/                    # 源代码目录
│   ├── components/         # 公共组件
│   │   ├── common/        # 通用组件
│   │   └── business/      # 业务组件
│   ├── pages/             # 页面组件
│   ├── services/          # API服务
│   ├── stores/            # 状态管理
│   ├── types/             # 类型定义
│   ├── utils/             # 工具函数
│   ├── styles/            # 全局样式
│   ├── constants/         # 常量定义
│   └── assets/            # 静态资源
├── config/                # 构建配置
├── docs/                  # 项目文档
├── scripts/               # 构建脚本
└── tests/                 # 测试文件
```

### 文件命名规范
- **组件文件**: PascalCase (如: `UserProfile.tsx`)
- **页面文件**: kebab-case (如: `user-profile/index.tsx`)
- **工具文件**: camelCase (如: `formatDate.ts`)
- **常量文件**: UPPER_SNAKE_CASE (如: `API_ENDPOINTS.ts`)
- **样式文件**: kebab-case (如: `user-profile.scss`)

## 🔄 开发流程

### 1. 分支管理
我们使用 Git Flow 工作流：

```
main                    # 生产环境分支
├── develop            # 开发环境分支
│   ├── feature/xxx    # 功能开发分支
│   ├── bugfix/xxx     # 问题修复分支
│   └── hotfix/xxx     # 热修复分支
└── release/vx.x.x     # 发布分支
```

### 2. 功能开发流程
```bash
# 1. 从develop分支创建功能分支
git checkout develop
git pull origin develop
git checkout -b feature/inventory-management

# 2. 开发功能
# ... 编写代码 ...

# 3. 提交代码
git add .
git commit -m "feat: 新增库存管理功能"

# 4. 推送分支
git push origin feature/inventory-management

# 5. 创建Pull Request
# 在GitHub/GitLab上创建PR，请求合并到develop分支
```

### 3. 代码审查
所有代码变更都需要经过代码审查：

- **自审**: 提交前自己检查代码
- **同行审查**: 至少一位同事审查
- **测试验证**: 确保功能正常工作
- **文档更新**: 更新相关文档

## 📝 代码规范

### TypeScript 规范
```typescript
// ✅ 好的示例
interface UserInfo {
  id: string
  name: string
  email: string
  createdAt: Date
}

const fetchUserInfo = async (userId: string): Promise<UserInfo> => {
  try {
    const response = await UserAPI.getUser(userId)
    return response.data
  } catch (error) {
    logger.error('获取用户信息失败', { userId, error })
    throw error
  }
}

// ❌ 不好的示例
const fetchUser = async (id: any) => {
  const res = await fetch(`/api/users/${id}`)
  return res.json()
}
```

### React 组件规范
```typescript
// ✅ 好的示例
interface UserCardProps {
  user: UserInfo
  onEdit?: (user: UserInfo) => void
  className?: string
}

const UserCard: React.FC<UserCardProps> = ({ 
  user, 
  onEdit, 
  className 
}) => {
  const handleEdit = useCallback(() => {
    onEdit?.(user)
  }, [user, onEdit])

  return (
    <div className={`user-card ${className || ''}`}>
      <h3>{user.name}</h3>
      <p>{user.email}</p>
      {onEdit && (
        <Button onClick={handleEdit}>编辑</Button>
      )}
    </div>
  )
}

export default UserCard
```

### 样式规范
```scss
// ✅ 好的示例
.user-card {
  padding: $spacing-md;
  border: 1px solid $border-color;
  border-radius: $border-radius-base;
  background-color: $background-color-white;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: $spacing-sm;
  }

  &__title {
    font-size: $font-size-lg;
    font-weight: 600;
    color: $text-color-primary;
  }

  &--active {
    border-color: $primary-color;
  }

  @include respond-below(md) {
    padding: $spacing-sm;
  }
}
```

### API 服务规范
```typescript
// ✅ 好的示例
class UserService {
  private static instance: UserService
  private apiClient: ApiClient

  constructor() {
    this.apiClient = new ApiClient('/api/users')
  }

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService()
    }
    return UserService.instance
  }

  async getUsers(params: GetUsersParams): Promise<ApiResponse<User[]>> {
    try {
      const response = await this.apiClient.get<User[]>('/', { params })
      return response
    } catch (error) {
      logger.error('获取用户列表失败', { params, error })
      throw new ApiError('获取用户列表失败', error)
    }
  }

  async createUser(userData: CreateUserData): Promise<ApiResponse<User>> {
    try {
      const response = await this.apiClient.post<User>('/', userData)
      return response
    } catch (error) {
      logger.error('创建用户失败', { userData, error })
      throw new ApiError('创建用户失败', error)
    }
  }
}

export const userService = UserService.getInstance()
```

## 📤 提交规范

### Commit Message 格式
我们使用 [Conventional Commits](https://www.conventionalcommits.org/) 规范：

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### 提交类型
- `feat`: 新功能
- `fix`: 问题修复
- `docs`: 文档更新
- `style`: 代码格式调整
- `refactor`: 代码重构
- `perf`: 性能优化
- `test`: 测试相关
- `chore`: 构建/工具相关
- `ci`: CI/CD相关

### 提交示例
```bash
# 新功能
git commit -m "feat(inventory): 新增库存管理页面"

# 问题修复
git commit -m "fix(auth): 修复登录状态丢失问题"

# 文档更新
git commit -m "docs: 更新API文档"

# 重构
git commit -m "refactor(components): 重构DataTable组件"

# 性能优化
git commit -m "perf(list): 优化长列表渲染性能"
```

### 提交前检查
```bash
# 运行检查脚本
pnpm pre-commit

# 包含以下检查：
# - ESLint 代码检查
# - TypeScript 类型检查
# - Prettier 格式检查
# - 单元测试
# - 提交信息格式检查
```

## 🧪 测试指南

### 测试分类
- **单元测试**: 测试单个函数/组件
- **集成测试**: 测试组件间交互
- **端到端测试**: 测试完整用户流程

### 单元测试示例
```typescript
// UserCard.test.tsx
import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { UserCard } from '../UserCard'

const mockUser = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com',
  createdAt: new Date()
}

describe('UserCard', () => {
  test('应该正确渲染用户信息', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.getByText('张三')).toBeInTheDocument()
    expect(screen.getByText('zhangsan@example.com')).toBeInTheDocument()
  })

  test('点击编辑按钮应该调用onEdit回调', () => {
    const mockOnEdit = jest.fn()
    render(<UserCard user={mockUser} onEdit={mockOnEdit} />)
    
    const editButton = screen.getByText('编辑')
    fireEvent.click(editButton)
    
    expect(mockOnEdit).toHaveBeenCalledWith(mockUser)
  })

  test('没有onEdit回调时不应该显示编辑按钮', () => {
    render(<UserCard user={mockUser} />)
    
    expect(screen.queryByText('编辑')).not.toBeInTheDocument()
  })
})
```

### 测试工具函数
```typescript
// utils/test-utils.tsx
import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'

// 自定义渲染函数
const AllTheProviders: React.FC<{ children: React.ReactNode }> = ({ 
  children 
}) => {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  )
}

const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => render(ui, { wrapper: AllTheProviders, ...options })

export * from '@testing-library/react'
export { customRender as render }
```

### 运行测试
```bash
# 运行所有测试
pnpm test

# 运行特定测试文件
pnpm test UserCard.test.tsx

# 运行测试并生成覆盖率报告
pnpm test:coverage

# 监听模式运行测试
pnpm test:watch
```

## 📚 文档编写

### 文档类型
- **API文档**: 接口说明文档
- **组件文档**: 组件使用说明
- **开发文档**: 开发指南和最佳实践
- **部署文档**: 部署和运维指南

### 文档格式
使用 Markdown 格式编写文档，遵循以下结构：

```markdown
# 标题

## 概述
简要描述功能或组件的作用

## 使用方法
### 基础用法
### 高级用法

## API参考
### Props/参数
### 方法
### 事件

## 示例
### 基础示例
### 完整示例

## 注意事项
### 兼容性
### 性能考虑
### 最佳实践
```

### 组件文档示例
```markdown
# UserCard 用户卡片组件

## 概述
用于展示用户基本信息的卡片组件，支持编辑操作。

## 使用方法

### 基础用法
```tsx
import { UserCard } from '@/components/UserCard'

const user = {
  id: '1',
  name: '张三',
  email: 'zhangsan@example.com'
}

<UserCard user={user} />
```

### 带编辑功能
```tsx
<UserCard 
  user={user} 
  onEdit={(user) => console.log('编辑用户:', user)}
/>
```

## API参考

### Props
| 参数 | 类型 | 默认值 | 说明 |
|------|------|--------|------|
| user | UserInfo | - | 用户信息对象 |
| onEdit | (user: UserInfo) => void | - | 编辑回调函数 |
| className | string | - | 自定义样式类名 |

### UserInfo 类型
```typescript
interface UserInfo {
  id: string
  name: string
  email: string
  createdAt?: Date
}
```
```

## 🐛 问题反馈

### 问题报告
发现问题时，请按以下格式提交Issue：

```markdown
## 问题描述
简要描述遇到的问题

## 复现步骤
1. 打开页面
2. 点击按钮
3. 查看结果

## 期望结果
描述期望的正确行为

## 实际结果
描述实际发生的错误行为

## 环境信息
- 操作系统: macOS 12.0
- 浏览器: Chrome 96.0
- Node.js: 18.0.0
- 项目版本: 1.0.0

## 附加信息
- 错误截图
- 控制台错误信息
- 相关日志
```

### 功能建议
提交功能建议时，请说明：

- **需求背景**: 为什么需要这个功能
- **功能描述**: 详细描述功能需求
- **使用场景**: 在什么情况下使用
- **实现建议**: 如果有实现想法可以提供

## 🎯 最佳实践

### 1. 代码质量
- 保持函数简洁，单一职责
- 使用有意义的变量和函数名
- 添加必要的注释和文档
- 处理边界情况和错误

### 2. 性能优化
- 避免不必要的重新渲染
- 使用 React.memo、useMemo、useCallback
- 合理使用代码分割
- 优化图片和资源加载

### 3. 用户体验
- 提供加载状态提示
- 处理错误状态
- 支持键盘导航
- 考虑无障碍访问

### 4. 安全考虑
- 验证用户输入
- 防止XSS攻击
- 保护敏感信息
- 使用HTTPS

## 📞 联系方式

- **技术讨论**: 加入开发者群组
- **问题反馈**: 提交GitHub Issue
- **邮件联系**: dev@easy-erp.com
- **文档问题**: docs@easy-erp.com

---

感谢您的贡献！让我们一起打造更好的 Easy ERP 系统。

**维护团队**: 开发团队  
**最后更新**: 2025年1月3日