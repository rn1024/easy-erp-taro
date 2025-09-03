# Easy ERP Taro 快速开始指南

本指南将帮助您快速搭建开发环境并启动 Easy ERP Taro 项目。

## 📋 环境要求

### 系统要求
- **操作系统**: macOS 10.15+, Windows 10+, Ubuntu 18.04+
- **Node.js**: 16.14.0+ (推荐使用 18.x LTS)
- **包管理器**: pnpm 7.0+ (推荐) 或 npm 8.0+

### 开发工具
- **代码编辑器**: VS Code (推荐) + Taro 插件
- **微信开发者工具**: 最新稳定版 (用于小程序调试)
- **Git**: 2.20+ (版本控制)

## 🚀 快速安装

### 1. 克隆项目
```bash
# 使用 HTTPS
git clone https://github.com/your-org/easy-erp-taro.git
cd easy-erp-taro

# 或使用 SSH
git clone git@github.com:your-org/easy-erp-taro.git
cd easy-erp-taro
```

### 2. 安装依赖
```bash
# 推荐使用 pnpm (更快的安装速度)
pnpm install

# 或使用 npm
npm install

# 或使用 yarn
yarn install
```

### 3. 环境配置
```bash
# 复制环境配置文件
cp .env.example .env.local

# 编辑环境变量 (可选)
# API_BASE_URL=https://your-api-server.com
# APP_ENV=development
```

## 🛠️ 开发环境启动

### 微信小程序开发
```bash
# 启动微信小程序开发模式
pnpm dev:weapp

# 或使用 npm
npm run dev:weapp
```

启动后：
1. 打开微信开发者工具
2. 导入项目，选择 `dist` 目录
3. 项目会自动编译并在开发者工具中显示

### H5 开发
```bash
# 启动 H5 开发模式
pnpm dev:h5

# 或使用 npm
npm run dev:h5
```

启动后访问: http://localhost:10086

### 其他平台
```bash
# 支付宝小程序
pnpm dev:alipay

# 字节跳动小程序
pnpm dev:tt

# QQ 小程序
pnpm dev:qq

# 京东小程序
pnpm dev:jd
```

## 📱 项目结构说明

```
easy-erp-taro/
├── src/                    # 源代码目录
│   ├── components/         # 组件库
│   │   ├── common/        # 通用组件
│   │   ├── AuthGuard/     # 权限守卫
│   │   ├── DataTable/     # 数据表格
│   │   ├── FormModal/     # 表单弹窗
│   │   ├── MobileLayout/  # 移动端布局
│   │   └── ...           # 其他业务组件
│   ├── pages/             # 页面组件
│   │   ├── index/         # 首页
│   │   ├── login/         # 登录页
│   │   ├── query/         # 查询功能
│   │   ├── inventory/     # 库存管理
│   │   ├── warehouse/     # 任务管理
│   │   ├── products/      # 产品管理
│   │   └── profile/       # 个人中心
│   ├── services/          # API 服务层
│   │   ├── api.ts         # 基础 API 服务
│   │   ├── auth.ts        # 认证服务
│   │   ├── inventory.ts   # 库存服务
│   │   └── ...           # 其他服务
│   ├── stores/            # 状态管理
│   │   └── userStore.ts   # 用户状态
│   ├── types/             # TypeScript 类型
│   │   ├── index.ts       # 基础类型
│   │   └── admin.ts       # 管理后台类型
│   ├── utils/             # 工具函数
│   ├── assets/            # 静态资源
│   ├── styles/            # 全局样式
│   ├── app.config.ts      # 应用配置
│   ├── app.scss          # 全局样式
│   └── app.tsx           # 应用入口
├── config/                # 构建配置
│   ├── index.js          # 主配置文件
│   ├── dev.js            # 开发环境配置
│   └── prod.js           # 生产环境配置
├── docs/                  # 项目文档
├── dist/                  # 构建输出目录
├── package.json          # 项目依赖配置
├── tsconfig.json         # TypeScript 配置
├── .eslintrc.js          # ESLint 配置
└── README.md             # 项目说明
```

## 🔧 开发工具配置

### VS Code 推荐插件
```json
{
  "recommendations": [
    "NutUI.nutui-vscode-extension",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "ms-vscode.vscode-json"
  ]
}
```

### VS Code 设置
```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative",
  "emmet.includeLanguages": {
    "javascript": "javascriptreact",
    "typescript": "typescriptreact"
  }
}
```

## 📋 常用命令

### 开发命令
```bash
# 启动开发服务器
pnpm dev:weapp          # 微信小程序
pnpm dev:h5             # H5 版本
pnpm dev:alipay         # 支付宝小程序

# 构建生产版本
pnpm build:weapp        # 微信小程序
pnpm build:h5           # H5 版本
pnpm build:alipay       # 支付宝小程序

# 代码检查和格式化
pnpm lint               # ESLint 检查
pnpm lint:fix           # 自动修复 ESLint 问题
pnpm type-check         # TypeScript 类型检查
```

### 项目管理
```bash
# 安装新依赖
pnpm add <package-name>              # 生产依赖
pnpm add -D <package-name>           # 开发依赖

# 更新依赖
pnpm update                          # 更新所有依赖
pnpm update <package-name>           # 更新指定依赖

# 清理缓存
pnpm store prune                     # 清理 pnpm 缓存
rm -rf node_modules dist             # 清理项目缓存
pnpm install                         # 重新安装
```

## 🐛 常见问题解决

### 1. 依赖安装失败
```bash
# 清理缓存后重新安装
rm -rf node_modules package-lock.json
pnpm install

# 或使用 npm
rm -rf node_modules package-lock.json
npm install
```

### 2. 微信开发者工具无法预览
- 确保微信开发者工具已安装最新版本
- 检查项目路径是否正确 (应选择 `dist` 目录)
- 确认 AppID 配置正确

### 3. TypeScript 类型错误
```bash
# 重新生成类型声明
pnpm type-check

# 重启 VS Code TypeScript 服务
# Ctrl/Cmd + Shift + P -> "TypeScript: Restart TS Server"
```

### 4. 样式不生效
- 检查 SCSS 语法是否正确
- 确认样式文件已正确导入
- 检查 CSS 类名是否正确

### 5. API 请求失败
- 检查网络连接
- 确认 API 服务器地址配置
- 查看浏览器控制台错误信息

## 🔍 调试技巧

### 微信小程序调试
1. **控制台调试**: 在微信开发者工具中查看 Console 面板
2. **网络请求**: 在 Network 面板查看 API 请求
3. **存储查看**: 在 Storage 面板查看本地存储
4. **性能分析**: 使用 Performance 面板分析性能

### H5 调试
1. **浏览器开发者工具**: F12 打开开发者工具
2. **移动端调试**: 使用浏览器的设备模拟功能
3. **网络调试**: 在 Network 面板查看请求
4. **Vue DevTools**: 安装 React DevTools 扩展

### 代码调试
```typescript
// 使用 console.log 调试
console.log('Debug info:', data)

// 使用 debugger 断点
debugger

// 使用 Taro 提供的调试方法
import Taro from '@tarojs/taro'
Taro.showToast({
  title: 'Debug: ' + JSON.stringify(data),
  icon: 'none'
})
```

## 📚 学习资源

### 官方文档
- [Taro 官方文档](https://taro-docs.jd.com/docs/)
- [NutUI React 文档](https://nutui.jd.com/react/2x/#/zh-CN/guide/intro)
- [React 官方文档](https://react.dev/)
- [TypeScript 官方文档](https://www.typescriptlang.org/docs/)

### 社区资源
- [Taro GitHub](https://github.com/NervJS/taro)
- [NutUI GitHub](https://github.com/jdf2e/nutui-react)
- [微信小程序开发文档](https://developers.weixin.qq.com/miniprogram/dev/framework/)

## 🤝 贡献指南

### 开发流程
1. Fork 项目到个人仓库
2. 创建功能分支: `git checkout -b feature/new-feature`
3. 提交代码: `git commit -m 'Add new feature'`
4. 推送分支: `git push origin feature/new-feature`
5. 创建 Pull Request

### 代码规范
- 遵循 ESLint 配置的代码规范
- 使用 TypeScript 进行类型检查
- 组件和函数需要添加注释
- 提交信息遵循 Conventional Commits 规范

## 📞 获取帮助

### 技术支持
- **项目文档**: 查看 `docs/` 目录下的详细文档
- **Issue 反馈**: 在 GitHub 仓库提交 Issue
- **技术讨论**: 加入项目技术交流群

### 联系方式
- **邮箱**: dev-team@company.com
- **微信群**: 扫描二维码加入技术交流群
- **钉钉群**: 项目开发协作群

---

🎉 **恭喜！** 您已经成功搭建了 Easy ERP Taro 开发环境。现在可以开始愉快的开发之旅了！

如果遇到任何问题，请查看 [常见问题文档](./FAQ.md) 或联系开发团队。