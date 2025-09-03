# Easy ERP Taro 故障排查指南

本指南帮助开发者快速定位和解决常见问题。

## 📋 目录

- [开发环境问题](#开发环境问题)
- [构建问题](#构建问题)
- [运行时问题](#运行时问题)
- [微信小程序问题](#微信小程序问题)
- [H5问题](#h5问题)
- [API问题](#api问题)
- [性能问题](#性能问题)
- [部署问题](#部署问题)

## 🛠️ 开发环境问题

### Node.js版本不兼容

**问题描述**: 项目启动失败，提示Node.js版本不支持

**错误信息**:
```bash
error: The engine "node" is incompatible with this module
```

**解决方案**:
```bash
# 1. 检查当前Node.js版本
node --version

# 2. 安装推荐版本 (18.x)
# 使用nvm管理Node.js版本
nvm install 18
nvm use 18

# 3. 重新安装依赖
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

### pnpm安装失败

**问题描述**: pnpm install 执行失败

**错误信息**:
```bash
ERR_PNPM_PEER_DEP_ISSUES
```

**解决方案**:
```bash
# 1. 清理缓存
pnpm store prune

# 2. 删除node_modules和锁文件
rm -rf node_modules pnpm-lock.yaml

# 3. 重新安装
pnpm install --shamefully-hoist

# 4. 如果仍然失败，使用npm
npm install
```

### Taro CLI问题

**问题描述**: Taro命令不存在或版本不匹配

**错误信息**:
```bash
command not found: taro
```

**解决方案**:
```bash
# 1. 全局安装Taro CLI
npm install -g @tarojs/cli@4.1.2

# 2. 检查版本
taro --version

# 3. 如果版本不匹配，重新安装
npm uninstall -g @tarojs/cli
npm install -g @tarojs/cli@4.1.2
```

## 🔨 构建问题

### TypeScript编译错误

**问题描述**: TypeScript类型检查失败

**错误信息**:
```bash
TS2322: Type 'string' is not assignable to type 'number'
```

**解决方案**:
```bash
# 1. 检查类型定义
# 确保导入的类型正确
import type { UserInfo } from '@/types'

# 2. 更新类型定义
interface UserInfo {
  id: string  // 确保类型正确
  name: string
  age: number
}

# 3. 运行类型检查
pnpm type-check

# 4. 如果是第三方库类型问题
npm install @types/library-name
```

### ESLint错误

**问题描述**: 代码规范检查失败

**错误信息**:
```bash
error: 'React' must be in scope when using JSX
```

**解决方案**:
```bash
# 1. 修复自动修复的问题
pnpm lint --fix

# 2. 手动修复React导入
import React from 'react'

# 3. 更新ESLint配置（如果需要）
# .eslintrc.js
module.exports = {
  extends: ['taro/react'],
  rules: {
    'react/react-in-jsx-scope': 'off' // React 17+不需要导入React
  }
}
```

### 样式编译问题

**问题描述**: SCSS编译失败

**错误信息**:
```bash
SassError: Undefined variable: $primary-color
```

**解决方案**:
```scss
// 1. 确保变量文件被正确导入
@import '@/styles/variables.scss';

// 2. 检查变量定义
// variables.scss
$primary-color: #1890ff;

// 3. 使用CSS变量作为备选方案
.component {
  color: var(--primary-color, #1890ff);
}
```

### 构建产物过大

**问题描述**: 构建后文件体积过大

**解决方案**:
```javascript
// 1. 分析构建产物
pnpm build:analyze

// 2. 优化webpack配置
// config/index.js
const config = {
  mini: {
    webpackChain(chain) {
      // 代码分割
      chain.optimization.splitChunks({
        chunks: 'all',
        cacheGroups: {
          vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all'
          }
        }
      })
    }
  }
}

// 3. 按需导入
import { Button } from '@nutui/nutui-react-taro'
// 而不是
import * as NutUI from '@nutui/nutui-react-taro'
```

## 🏃‍♂️ 运行时问题

### 页面白屏

**问题描述**: 应用启动后显示白屏

**排查步骤**:
```bash
# 1. 检查控制台错误
# 打开浏览器开发者工具查看Console

# 2. 检查网络请求
# 查看Network面板是否有请求失败

# 3. 检查路由配置
# src/app.config.ts
export default defineAppConfig({
  pages: [
    'pages/index/index', // 确保首页路径正确
    // ...
  ]
})

# 4. 检查入口文件
# src/app.tsx
import React from 'react'

const App: React.FC = ({ children }) => {
  return children
}

export default App
```

### 状态管理问题

**问题描述**: Zustand状态更新不生效

**错误示例**:
```typescript
// ❌ 错误：直接修改状态
const useStore = create((set) => ({
  user: null,
  setUser: (user) => {
    // 直接修改会导致组件不更新
    state.user = user
  }
}))
```

**正确解决方案**:
```typescript
// ✅ 正确：使用set函数更新状态
const useStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  updateUser: (updates) => set((state) => ({
    user: { ...state.user, ...updates }
  }))
}))
```

### 内存泄漏

**问题描述**: 应用运行一段时间后变慢

**排查和解决**:
```typescript
// 1. 检查事件监听器清理
useEffect(() => {
  const handleResize = () => {
    // 处理逻辑
  }
  
  window.addEventListener('resize', handleResize)
  
  // ✅ 清理事件监听器
  return () => {
    window.removeEventListener('resize', handleResize)
  }
}, [])

// 2. 检查定时器清理
useEffect(() => {
  const timer = setInterval(() => {
    // 定时任务
  }, 1000)
  
  // ✅ 清理定时器
  return () => {
    clearInterval(timer)
  }
}, [])

// 3. 检查异步请求取消
useEffect(() => {
  const abortController = new AbortController()
  
  fetch('/api/data', {
    signal: abortController.signal
  }).then(response => {
    // 处理响应
  }).catch(error => {
    if (error.name !== 'AbortError') {
      console.error('请求失败:', error)
    }
  })
  
  // ✅ 取消未完成的请求
  return () => {
    abortController.abort()
  }
}, [])
```

## 📱 微信小程序问题

### 开发者工具问题

**问题描述**: 微信开发者工具无法预览

**解决方案**:
```bash
# 1. 检查project.config.json配置
{
  "miniprogramRoot": "dist/",
  "projectname": "easy-erp-miniapp",
  "appid": "your-app-id"
}

# 2. 重新构建
pnpm build:weapp

# 3. 在开发者工具中重新导入项目
# 选择dist目录作为项目根目录

# 4. 检查AppID配置
# 确保AppID正确且有权限
```

### 网络请求失败

**问题描述**: 小程序中API请求失败

**错误信息**:
```
request:fail url not in domain list
```

**解决方案**:
```javascript
// 1. 配置服务器域名
// 在微信公众平台 -> 开发 -> 开发设置 -> 服务器域名
// 添加你的API域名

// 2. 开发阶段临时解决
// 开发者工具 -> 详情 -> 本地设置 -> 不校验合法域名

// 3. 检查请求配置
const request = (options) => {
  return Taro.request({
    ...options,
    header: {
      'content-type': 'application/json',
      ...options.header
    }
  })
}
```

### 组件样式问题

**问题描述**: 某些CSS样式在小程序中不生效

**解决方案**:
```scss
// 1. 避免使用不支持的CSS属性
.component {
  // ❌ 小程序不支持
  // position: sticky;
  // backdrop-filter: blur(10px);
  
  // ✅ 使用支持的属性
  position: fixed;
  background-color: rgba(255, 255, 255, 0.8);
}

// 2. 使用Taro提供的样式解决方案
import { View } from '@tarojs/components'

// 3. 检查选择器兼容性
// 避免使用复杂的CSS选择器
```

### 生命周期问题

**问题描述**: 页面生命周期函数不执行

**解决方案**:
```typescript
// 1. 使用Taro的生命周期钩子
import { useDidShow, useDidHide } from '@tarojs/taro'

const PageComponent: React.FC = () => {
  useDidShow(() => {
    console.log('页面显示')
    // 页面显示时的逻辑
  })
  
  useDidHide(() => {
    console.log('页面隐藏')
    // 页面隐藏时的逻辑
  })
  
  return <View>页面内容</View>
}

// 2. 页面配置
// 确保页面在app.config.ts中正确配置
export default defineAppConfig({
  pages: [
    'pages/index/index'
  ]
})
```

## 🌐 H5问题

### 路由问题

**问题描述**: H5页面刷新后404

**解决方案**:
```javascript
// 1. 配置history模式路由
// config/index.js
const config = {
  h5: {
    router: {
      mode: 'history', // 或 'hash'
      basename: '/easy-erp/'
    }
  }
}

// 2. 服务器配置（Nginx）
location / {
  try_files $uri $uri/ /index.html;
}

// 3. 使用hash模式避免服务器配置
const config = {
  h5: {
    router: {
      mode: 'hash'
    }
  }
}
```

### 移动端适配问题

**问题描述**: 在不同设备上显示异常

**解决方案**:
```scss
// 1. 使用viewport单位
.container {
  width: 100vw;
  height: 100vh;
  font-size: 4vw; // 响应式字体
}

// 2. 媒体查询适配
@media (max-width: 768px) {
  .component {
    padding: 10px;
  }
}

// 3. 使用rem单位
html {
  font-size: calc(100vw / 375 * 16); // 基于375px设计稿
}

.component {
  font-size: 1rem; // 16px on 375px screen
}
```

### 兼容性问题

**问题描述**: 某些浏览器功能异常

**解决方案**:
```javascript
// 1. 检查浏览器支持
if ('serviceWorker' in navigator) {
  // 支持Service Worker
}

// 2. 使用polyfill
import 'core-js/stable'
import 'regenerator-runtime/runtime'

// 3. 特性检测
const supportsWebP = () => {
  const canvas = document.createElement('canvas')
  return canvas.toDataURL('image/webp').indexOf('webp') > -1
}
```

## 🔌 API问题

### 请求超时

**问题描述**: API请求经常超时

**解决方案**:
```typescript
// 1. 增加超时时间
const apiClient = new ApiClient({
  timeout: 30000, // 30秒
  retries: 3      // 重试3次
})

// 2. 实现请求重试
const requestWithRetry = async (url: string, options: any, retries = 3) => {
  try {
    return await fetch(url, options)
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000))
      return requestWithRetry(url, options, retries - 1)
    }
    throw error
  }
}

// 3. 使用请求队列
class RequestQueue {
  private queue: Array<() => Promise<any>> = []
  private running = 0
  private maxConcurrent = 3

  async add<T>(request: () => Promise<T>): Promise<T> {
    return new Promise((resolve, reject) => {
      this.queue.push(async () => {
        try {
          const result = await request()
          resolve(result)
        } catch (error) {
          reject(error)
        }
      })
      this.process()
    })
  }

  private async process() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return
    }

    this.running++
    const request = this.queue.shift()!
    
    try {
      await request()
    } finally {
      this.running--
      this.process()
    }
  }
}
```

### 跨域问题

**问题描述**: 开发环境跨域请求失败

**解决方案**:
```javascript
// 1. 配置开发代理
// config/dev.js
const config = {
  h5: {
    devServer: {
      proxy: {
        '/api': {
          target: 'http://localhost:3000',
          changeOrigin: true,
          pathRewrite: {
            '^/api': '/api'
          }
        }
      }
    }
  }
}

// 2. 后端配置CORS
// Express.js示例
app.use(cors({
  origin: ['http://localhost:10086', 'https://your-domain.com'],
  credentials: true
}))

// 3. 使用JSONP（仅GET请求）
const jsonp = (url: string, callback: string) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `${url}?callback=${callback}`
    document.head.appendChild(script)
    
    window[callback] = (data) => {
      resolve(data)
      document.head.removeChild(script)
      delete window[callback]
    }
  })
}
```

### 认证问题

**问题描述**: Token过期或认证失败

**解决方案**:
```typescript
// 1. 实现Token自动刷新
class AuthService {
  private refreshPromise: Promise<string> | null = null

  async getValidToken(): Promise<string> {
    const token = this.getStoredToken()
    
    if (this.isTokenExpired(token)) {
      if (!this.refreshPromise) {
        this.refreshPromise = this.refreshToken()
      }
      return this.refreshPromise
    }
    
    return token
  }

  private async refreshToken(): Promise<string> {
    try {
      const refreshToken = this.getStoredRefreshToken()
      const response = await fetch('/api/auth/refresh', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${refreshToken}`
        }
      })
      
      const { token } = await response.json()
      this.storeToken(token)
      return token
    } catch (error) {
      this.logout()
      throw error
    } finally {
      this.refreshPromise = null
    }
  }
}

// 2. 请求拦截器
apiClient.interceptors.request.use(async (config) => {
  const token = await authService.getValidToken()
  config.headers.Authorization = `Bearer ${token}`
  return config
})

// 3. 响应拦截器
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await authService.logout()
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)
```

## ⚡ 性能问题

### 页面加载慢

**问题描述**: 首屏加载时间过长

**解决方案**:
```typescript
// 1. 代码分割
const LazyComponent = React.lazy(() => import('./LazyComponent'))

const App = () => (
  <Suspense fallback={<Loading />}>
    <LazyComponent />
  </Suspense>
)

// 2. 预加载关键资源
const preloadComponent = () => {
  import('./ImportantComponent')
}

// 3. 图片懒加载
const LazyImage: React.FC<{ src: string }> = ({ src, ...props }) => {
  const [loaded, setLoaded] = useState(false)
  const [inView, setInView] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <img
      ref={imgRef}
      src={inView ? src : undefined}
      onLoad={() => setLoaded(true)}
      {...props}
    />
  )
}
```

### 列表渲染卡顿

**问题描述**: 长列表滚动卡顿

**解决方案**:
```typescript
// 1. 虚拟滚动
import { FixedSizeList as List } from 'react-window'

const VirtualList: React.FC<{ items: any[] }> = ({ items }) => {
  const Row = ({ index, style }) => (
    <div style={style}>
      <ItemComponent data={items[index]} />
    </div>
  )

  return (
    <List
      height={600}
      itemCount={items.length}
      itemSize={80}
      width="100%"
    >
      {Row}
    </List>
  )
}

// 2. 分页加载
const useInfiniteScroll = (fetchMore: () => void) => {
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop 
          !== document.documentElement.offsetHeight || isFetching) {
        return
      }
      setIsFetching(true)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [isFetching])

  useEffect(() => {
    if (!isFetching) return
    fetchMore()
    setIsFetching(false)
  }, [isFetching, fetchMore])

  return [isFetching, setIsFetching]
}

// 3. 防抖搜索
const useDebounce = (value: string, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}
```

## 🚀 部署问题

### 构建失败

**问题描述**: 生产环境构建失败

**解决方案**:
```bash
# 1. 清理缓存和依赖
rm -rf node_modules dist .taro_cache
pnpm install

# 2. 检查环境变量
echo $NODE_ENV
echo $TARO_APP_API_BASE_URL

# 3. 分步构建调试
pnpm build:weapp --verbose

# 4. 检查内存限制
node --max-old-space-size=4096 ./node_modules/.bin/taro build --type weapp
```

### 静态资源404

**问题描述**: 部署后静态资源加载失败

**解决方案**:
```javascript
// 1. 检查publicPath配置
// config/prod.js
const config = {
  h5: {
    publicPath: '/easy-erp/', // 确保路径正确
    staticDirectory: 'static'
  }
}

// 2. CDN配置
const config = {
  h5: {
    publicPath: 'https://cdn.example.com/easy-erp/',
    staticDirectory: 'static'
  }
}

// 3. 相对路径配置
const config = {
  h5: {
    publicPath: './', // 使用相对路径
  }
}
```

### 服务器配置问题

**问题描述**: Nginx配置错误导致访问异常

**解决方案**:
```nginx
# 完整的Nginx配置示例
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/easy-erp/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # HTML不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass http://backend-server/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

## 🔍 调试技巧

### 1. 开发者工具使用
```javascript
// 性能分析
console.time('operation')
// 执行操作
console.timeEnd('operation')

// 内存使用
console.log(performance.memory)

// 网络请求监控
const originalFetch = window.fetch
window.fetch = function(...args) {
  console.log('Fetch:', args[0])
  return originalFetch.apply(this, args)
}
```

### 2. 日志系统
```typescript
// 结构化日志
const logger = {
  info: (message: string, context?: any) => {
    console.log(`[INFO] ${new Date().toISOString()} ${message}`, context)
  },
  error: (message: string, error?: Error, context?: any) => {
    console.error(`[ERROR] ${new Date().toISOString()} ${message}`, {
      error: error?.message,
      stack: error?.stack,
      context
    })
  }
}
```

### 3. 远程调试
```javascript
// 移动端调试
// 1. 使用vconsole
import VConsole from 'vconsole'

if (process.env.NODE_ENV === 'development') {
  new VConsole()
}

// 2. 使用eruda
import eruda from 'eruda'

if (process.env.NODE_ENV === 'development') {
  eruda.init()
}
```

## 📞 获取帮助

如果以上解决方案都无法解决您的问题，请：

1. **查看官方文档**: [Taro官方文档](https://taro-docs.jd.com/)
2. **搜索已知问题**: 在GitHub Issues中搜索相似问题
3. **提交问题报告**: 按照模板提交详细的问题报告
4. **联系技术支持**: support@easy-erp.com

---

**维护团队**: 技术支持组  
**最后更新**: 2025年1月3日