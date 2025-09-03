# Easy ERP Taro 部署指南

**部署版本**: v1.0  
**更新时间**: 2025年1月3日  
**支持平台**: 微信小程序、H5、支付宝小程序  

## 🚀 部署概览

### 部署架构
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   开发环境       │    │   测试环境       │    │   生产环境       │
│   Development   │───▶│   Staging       │───▶│   Production    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   本地开发       │    │   内部测试       │    │   线上发布       │
│   localhost     │    │   test.domain   │    │   prod.domain   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 部署流程
1. **代码提交**: 开发完成后提交到Git仓库
2. **自动构建**: CI/CD自动触发构建流程
3. **质量检查**: 代码检查、单元测试、安全扫描
4. **构建打包**: 针对不同平台进行构建
5. **部署发布**: 自动部署到对应环境
6. **健康检查**: 部署后进行功能验证

## 🛠️ 环境准备

### 开发环境要求
```bash
# Node.js版本要求
node >= 18.0.0
npm >= 8.0.0

# 推荐使用pnpm
npm install -g pnpm

# Taro CLI
npm install -g @tarojs/cli@4.1.2
```

### 环境变量配置
```bash
# .env.development (开发环境)
NODE_ENV=development
TARO_APP_API_BASE_URL=http://localhost:3000/api/v1
TARO_APP_UPLOAD_URL=http://localhost:3000/upload
TARO_APP_WS_URL=ws://localhost:3001
TARO_APP_DEBUG=true

# .env.staging (测试环境)
NODE_ENV=staging
TARO_APP_API_BASE_URL=https://api-test.easy-erp.com/v1
TARO_APP_UPLOAD_URL=https://upload-test.easy-erp.com
TARO_APP_WS_URL=wss://ws-test.easy-erp.com
TARO_APP_DEBUG=false

# .env.production (生产环境)
NODE_ENV=production
TARO_APP_API_BASE_URL=https://api.easy-erp.com/v1
TARO_APP_UPLOAD_URL=https://upload.easy-erp.com
TARO_APP_WS_URL=wss://ws.easy-erp.com
TARO_APP_DEBUG=false
TARO_APP_SENTRY_DSN=https://xxx@sentry.io/xxx
```

## 📱 微信小程序部署

### 1. 开发者工具配置
```json
// project.config.json
{
  "miniprogramRoot": "dist/",
  "projectname": "easy-erp-miniapp",
  "description": "Easy ERP 管理后台小程序",
  "appid": "wx1234567890abcdef",
  "setting": {
    "urlCheck": false,
    "es6": false,
    "enhance": true,
    "postcss": false,
    "preloadBackgroundData": false,
    "minified": true,
    "newFeature": true,
    "coverView": true,
    "nodeModules": false,
    "autoAudits": false,
    "showShadowRootInWxmlPanel": true,
    "scopeDataCheck": false,
    "uglifyFileName": false,
    "checkInvalidKey": true,
    "checkSiteMap": true,
    "uploadWithSourceMap": true,
    "compileHotReLoad": false,
    "lazyloadPlaceholderEnable": false,
    "useMultiFrameRuntime": true,
    "useApiHook": true,
    "useApiHostProcess": true,
    "babelSetting": {
      "ignore": [],
      "disablePlugins": [],
      "outputPath": ""
    },
    "enableEngineNative": false,
    "useIsolateContext": false,
    "userConfirmedBundleSwitch": false,
    "packNpmManually": false,
    "packNpmRelationList": [],
    "minifyWXSS": true,
    "disableUseStrict": false,
    "minifyWXML": true,
    "showES6CompileOption": false,
    "useCompilerPlugins": false
  },
  "compileType": "miniprogram",
  "libVersion": "2.19.4",
  "srcMiniprogramRoot": "dist/",
  "packOptions": {
    "ignore": [],
    "include": []
  },
  "condition": {},
  "editorSetting": {
    "tabIndent": "insertSpaces",
    "tabSize": 2
  }
}
```

### 2. 构建命令
```bash
# 开发环境构建
pnpm build:weapp:dev

# 生产环境构建
pnpm build:weapp

# 构建并预览
pnpm build:weapp && pnpm preview:weapp
```

### 3. 自动化部署脚本
```javascript
// scripts/deploy-weapp.js
const { execSync } = require('child_process')
const path = require('path')

class WeappDeployer {
  constructor(options) {
    this.appId = options.appId
    this.privateKey = options.privateKey
    this.version = options.version
    this.desc = options.desc
  }

  async deploy() {
    try {
      console.log('🚀 开始部署微信小程序...')
      
      // 1. 构建项目
      console.log('📦 构建项目...')
      execSync('pnpm build:weapp', { stdio: 'inherit' })
      
      // 2. 上传代码
      console.log('📤 上传代码...')
      await this.uploadCode()
      
      // 3. 提交审核
      console.log('📋 提交审核...')
      await this.submitAudit()
      
      console.log('✅ 部署完成!')
    } catch (error) {
      console.error('❌ 部署失败:', error.message)
      process.exit(1)
    }
  }

  async uploadCode() {
    const ci = require('miniprogram-ci')
    
    const project = new ci.Project({
      appid: this.appId,
      type: 'miniProgram',
      projectPath: path.resolve(__dirname, '../dist'),
      privateKeyPath: this.privateKey,
      ignores: ['node_modules/**/*']
    })

    await ci.upload({
      project,
      version: this.version,
      desc: this.desc,
      setting: {
        es6: false,
        minify: true,
        codeProtect: true,
        autoPrefixWXSS: true
      }
    })
  }

  async submitAudit() {
    // 自动提交审核逻辑
    // 可以根据需要实现
  }
}

// 使用示例
const deployer = new WeappDeployer({
  appId: process.env.WEAPP_APP_ID,
  privateKey: process.env.WEAPP_PRIVATE_KEY,
  version: process.env.VERSION || '1.0.0',
  desc: process.env.DESC || '版本更新'
})

deployer.deploy()
```

## 🌐 H5部署

### 1. 构建配置
```javascript
// config/prod.js
const config = {
  env: {
    NODE_ENV: '"production"'
  },
  defineConstants: {
    API_BASE_URL: '"https://api.easy-erp.com/v1"'
  },
  h5: {
    publicPath: '/easy-erp/',
    staticDirectory: 'static',
    output: {
      filename: 'js/[name].[hash:8].js',
      chunkFilename: 'js/[name].[chunkhash:8].js'
    },
    miniCssExtractPluginOption: {
      filename: 'css/[name].[hash:8].css',
      chunkFilename: 'css/[name].[chunkhash:8].css'
    },
    webpackChain(chain) {
      // 生产环境优化
      chain.optimization
        .splitChunks({
          chunks: 'all',
          cacheGroups: {
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              chunks: 'all'
            },
            common: {
              name: 'common',
              minChunks: 2,
              chunks: 'all',
              enforce: true
            }
          }
        })
    }
  }
}

module.exports = function (merge) {
  return merge({}, config, require('./prod.local.js'))
}
```

### 2. Nginx配置
```nginx
# /etc/nginx/sites-available/easy-erp-h5
server {
    listen 80;
    listen [::]:80;
    server_name h5.easy-erp.com;
    
    # 重定向到HTTPS
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name h5.easy-erp.com;

    # SSL证书配置
    ssl_certificate /etc/ssl/certs/easy-erp.com.crt;
    ssl_certificate_key /etc/ssl/private/easy-erp.com.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers ECDHE-RSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384;
    ssl_prefer_server_ciphers off;

    # 网站根目录
    root /var/www/easy-erp-h5/dist;
    index index.html;

    # Gzip压缩
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/xml+rss application/json;

    # 静态资源缓存
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
        add_header Vary Accept-Encoding;
    }

    # HTML文件不缓存
    location ~* \.html$ {
        expires -1;
        add_header Cache-Control "no-cache, no-store, must-revalidate";
        add_header Pragma "no-cache";
    }

    # SPA路由支持
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API代理
    location /api/ {
        proxy_pass https://api.easy-erp.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # 安全头
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header Referrer-Policy "strict-origin-when-cross-origin" always;
    add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https: wss:;" always;
}
```

### 3. Docker部署
```dockerfile
# Dockerfile
FROM node:18-alpine AS builder

WORKDIR /app

# 复制package文件
COPY package*.json pnpm-lock.yaml ./

# 安装依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build:h5

# 生产镜像
FROM nginx:alpine

# 复制构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制Nginx配置
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动Nginx
CMD ["nginx", "-g", "daemon off;"]
```

```yaml
# docker-compose.yml
version: '3.8'

services:
  easy-erp-h5:
    build: .
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./ssl:/etc/ssl
      - ./logs:/var/log/nginx
    environment:
      - NODE_ENV=production
    restart: unless-stopped
    networks:
      - easy-erp-network

networks:
  easy-erp-network:
    driver: bridge
```

## ☁️ 云平台部署

### 1. 阿里云部署
```yaml
# .github/workflows/deploy-aliyun.yml
name: Deploy to Aliyun

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Node.js
      uses: actions/setup-node@v2
      with:
        node-version: '18'
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Build application
      run: pnpm build:h5
      env:
        NODE_ENV: production
    
    - name: Deploy to Aliyun OSS
      uses: fangbinwei/aliyun-oss-website-action@v1
      with:
        accessKeyId: ${{ secrets.ALIYUN_ACCESS_KEY_ID }}
        accessKeySecret: ${{ secrets.ALIYUN_ACCESS_KEY_SECRET }}
        bucket: easy-erp-h5
        endpoint: oss-cn-hangzhou.aliyuncs.com
        folder: dist
        
    - name: Refresh CDN
      run: |
        aliyun cdn RefreshObjectCaches \
          --ObjectPath https://h5.easy-erp.com \
          --ObjectType Directory
```

### 2. 腾讯云部署
```javascript
// scripts/deploy-tencent.js
const COS = require('cos-nodejs-sdk-v5')
const path = require('path')
const fs = require('fs')

class TencentDeployer {
  constructor() {
    this.cos = new COS({
      SecretId: process.env.TENCENT_SECRET_ID,
      SecretKey: process.env.TENCENT_SECRET_KEY
    })
    
    this.bucket = 'easy-erp-h5-1234567890'
    this.region = 'ap-guangzhou'
  }

  async deploy() {
    try {
      console.log('🚀 开始部署到腾讯云...')
      
      // 1. 上传文件
      await this.uploadFiles()
      
      // 2. 刷新CDN
      await this.refreshCDN()
      
      console.log('✅ 部署完成!')
    } catch (error) {
      console.error('❌ 部署失败:', error)
      process.exit(1)
    }
  }

  async uploadFiles() {
    const distPath = path.resolve(__dirname, '../dist')
    const files = this.getAllFiles(distPath)
    
    for (const file of files) {
      const key = path.relative(distPath, file).replace(/\\/g, '/')
      
      await this.cos.putObject({
        Bucket: this.bucket,
        Region: this.region,
        Key: key,
        Body: fs.createReadStream(file),
        ContentType: this.getContentType(file)
      })
      
      console.log(`✅ 上传: ${key}`)
    }
  }

  getAllFiles(dir) {
    let files = []
    const items = fs.readdirSync(dir)
    
    for (const item of items) {
      const fullPath = path.join(dir, item)
      const stat = fs.statSync(fullPath)
      
      if (stat.isDirectory()) {
        files = files.concat(this.getAllFiles(fullPath))
      } else {
        files.push(fullPath)
      }
    }
    
    return files
  }

  getContentType(file) {
    const ext = path.extname(file).toLowerCase()
    const types = {
      '.html': 'text/html',
      '.css': 'text/css',
      '.js': 'application/javascript',
      '.json': 'application/json',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
      '.ico': 'image/x-icon',
      '.woff': 'font/woff',
      '.woff2': 'font/woff2',
      '.ttf': 'font/ttf',
      '.eot': 'application/vnd.ms-fontobject'
    }
    
    return types[ext] || 'application/octet-stream'
  }

  async refreshCDN() {
    // 刷新CDN缓存
    // 需要使用腾讯云CDN SDK
  }
}

new TencentDeployer().deploy()
```

## 🔄 CI/CD流程

### GitHub Actions
```yaml
# .github/workflows/ci-cd.yml
name: CI/CD Pipeline

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '18'
  PNPM_VERSION: '8'

jobs:
  test:
    name: Test
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'pnpm'
    
    - name: Install pnpm
      run: npm install -g pnpm@${{ env.PNPM_VERSION }}
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Run linter
      run: pnpm lint
    
    - name: Run type check
      run: pnpm type-check
    
    - name: Run tests
      run: pnpm test --coverage
    
    - name: Upload coverage
      uses: codecov/codecov-action@v3
      with:
        file: ./coverage/lcov.info

  build:
    name: Build
    runs-on: ubuntu-latest
    needs: test
    
    strategy:
      matrix:
        platform: [weapp, h5, alipay]
    
    steps:
    - name: Checkout code
      uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'pnpm'
    
    - name: Install dependencies
      run: pnpm install --frozen-lockfile
    
    - name: Build ${{ matrix.platform }}
      run: pnpm build:${{ matrix.platform }}
    
    - name: Upload build artifacts
      uses: actions/upload-artifact@v3
      with:
        name: dist-${{ matrix.platform }}
        path: dist/

  deploy-staging:
    name: Deploy to Staging
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/develop'
    
    steps:
    - name: Download artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist-h5
        path: dist/
    
    - name: Deploy to staging
      run: |
        # 部署到测试环境
        echo "Deploying to staging environment..."

  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    needs: build
    if: github.ref == 'refs/heads/main'
    
    environment:
      name: production
      url: https://h5.easy-erp.com
    
    steps:
    - name: Download artifacts
      uses: actions/download-artifact@v3
      with:
        name: dist-h5
        path: dist/
    
    - name: Deploy to production
      run: |
        # 部署到生产环境
        echo "Deploying to production environment..."
    
    - name: Notify deployment
      uses: 8398a7/action-slack@v3
      with:
        status: ${{ job.status }}
        channel: '#deployments'
        webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Jenkins Pipeline
```groovy
// Jenkinsfile
pipeline {
    agent any
    
    environment {
        NODE_VERSION = '18'
        PNPM_VERSION = '8'
    }
    
    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }
        
        stage('Setup') {
            steps {
                sh 'nvm use ${NODE_VERSION}'
                sh 'npm install -g pnpm@${PNPM_VERSION}'
                sh 'pnpm install --frozen-lockfile'
            }
        }
        
        stage('Test') {
            parallel {
                stage('Lint') {
                    steps {
                        sh 'pnpm lint'
                    }
                }
                stage('Type Check') {
                    steps {
                        sh 'pnpm type-check'
                    }
                }
                stage('Unit Test') {
                    steps {
                        sh 'pnpm test --coverage'
                    }
                    post {
                        always {
                            publishHTML([
                                allowMissing: false,
                                alwaysLinkToLastBuild: true,
                                keepAll: true,
                                reportDir: 'coverage/lcov-report',
                                reportFiles: 'index.html',
                                reportName: 'Coverage Report'
                            ])
                        }
                    }
                }
            }
        }
        
        stage('Build') {
            parallel {
                stage('Build WeApp') {
                    steps {
                        sh 'pnpm build:weapp'
                        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    }
                }
                stage('Build H5') {
                    steps {
                        sh 'pnpm build:h5'
                        archiveArtifacts artifacts: 'dist/**/*', fingerprint: true
                    }
                }
            }
        }
        
        stage('Deploy') {
            when {
                branch 'main'
            }
            steps {
                script {
                    if (env.BRANCH_NAME == 'main') {
                        sh 'pnpm deploy:production'
                    } else if (env.BRANCH_NAME == 'develop') {
                        sh 'pnpm deploy:staging'
                    }
                }
            }
        }
    }
    
    post {
        always {
            cleanWs()
        }
        success {
            slackSend(
                channel: '#deployments',
                color: 'good',
                message: "✅ 部署成功: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
        failure {
            slackSend(
                channel: '#deployments',
                color: 'danger',
                message: "❌ 部署失败: ${env.JOB_NAME} - ${env.BUILD_NUMBER}"
            )
        }
    }
}
```

## 📊 监控和日志

### 1. 性能监控
```javascript
// src/utils/monitor.js
class PerformanceMonitor {
  constructor() {
    this.metrics = {}
  }

  // 页面加载时间
  measurePageLoad() {
    if (typeof performance !== 'undefined') {
      const navigation = performance.getEntriesByType('navigation')[0]
      
      this.metrics.pageLoad = {
        dns: navigation.domainLookupEnd - navigation.domainLookupStart,
        tcp: navigation.connectEnd - navigation.connectStart,
        request: navigation.responseStart - navigation.requestStart,
        response: navigation.responseEnd - navigation.responseStart,
        dom: navigation.domContentLoadedEventEnd - navigation.responseEnd,
        total: navigation.loadEventEnd - navigation.navigationStart
      }
    }
  }

  // API请求时间
  measureApiRequest(url, startTime, endTime) {
    const duration = endTime - startTime
    
    if (!this.metrics.apiRequests) {
      this.metrics.apiRequests = []
    }
    
    this.metrics.apiRequests.push({
      url,
      duration,
      timestamp: Date.now()
    })
  }

  // 上报监控数据
  report() {
    if (process.env.NODE_ENV === 'production') {
      // 上报到监控平台
      fetch('/api/monitor/performance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metrics: this.metrics,
          userAgent: navigator.userAgent,
          timestamp: Date.now()
        })
      })
    }
  }
}

export const performanceMonitor = new PerformanceMonitor()
```

### 2. 错误监控
```javascript
// src/utils/errorMonitor.js
import * as Sentry from '@sentry/react'

// Sentry配置
if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: process.env.TARO_APP_SENTRY_DSN,
    environment: process.env.NODE_ENV,
    integrations: [
      new Sentry.BrowserTracing()
    ],
    tracesSampleRate: 0.1,
    beforeSend(event) {
      // 过滤敏感信息
      if (event.request?.url?.includes('/auth/')) {
        delete event.request.data
      }
      return event
    }
  })
}

// 全局错误处理
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(event.error)
  }
})

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason)
  
  if (process.env.NODE_ENV === 'production') {
    Sentry.captureException(event.reason)
  }
})
```

### 3. 日志收集
```javascript
// src/utils/logger.js
class Logger {
  constructor() {
    this.logs = []
    this.maxLogs = 1000
  }

  log(level, message, extra = {}) {
    const logEntry = {
      level,
      message,
      extra,
      timestamp: new Date().toISOString(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    this.logs.push(logEntry)
    
    // 保持日志数量限制
    if (this.logs.length > this.maxLogs) {
      this.logs.shift()
    }

    // 控制台输出
    console[level](message, extra)

    // 生产环境上报
    if (process.env.NODE_ENV === 'production' && level === 'error') {
      this.reportError(logEntry)
    }
  }

  info(message, extra) {
    this.log('info', message, extra)
  }

  warn(message, extra) {
    this.log('warn', message, extra)
  }

  error(message, extra) {
    this.log('error', message, extra)
  }

  debug(message, extra) {
    if (process.env.NODE_ENV === 'development') {
      this.log('debug', message, extra)
    }
  }

  reportError(logEntry) {
    fetch('/api/logs/error', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(logEntry)
    }).catch(() => {
      // 忽略上报失败
    })
  }

  exportLogs() {
    return this.logs
  }
}

export const logger = new Logger()
```

## 🔒 安全配置

### 1. 内容安全策略 (CSP)
```html
<!-- index.html -->
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://res.wx.qq.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https: blob:;
  font-src 'self' data:;
  connect-src 'self' https: wss:;
  media-src 'self';
  object-src 'none';
  child-src 'none';
  worker-src 'self';
  frame-ancestors 'none';
  form-action 'self';
  base-uri 'self';
  manifest-src 'self';
">
```

### 2. 环境变量安全
```bash
# 敏感信息使用环境变量
export TARO_APP_API_KEY="your-api-key"
export TARO_APP_SECRET="your-secret"
export SENTRY_DSN="your-sentry-dsn"

# 使用.env.local文件（不提交到版本控制）
echo ".env.local" >> .gitignore
```

### 3. 构建时安全检查
```javascript
// scripts/security-check.js
const { execSync } = require('child_process')

function securityCheck() {
  console.log('🔒 执行安全检查...')
  
  try {
    // 依赖安全检查
    execSync('pnpm audit --audit-level moderate', { stdio: 'inherit' })
    
    // 代码安全扫描
    execSync('pnpm run security:scan', { stdio: 'inherit' })
    
    console.log('✅ 安全检查通过')
  } catch (error) {
    console.error('❌ 安全检查失败')
    process.exit(1)
  }
}

securityCheck()
```

## 📈 性能优化

### 1. 构建优化
```javascript
// config/optimization.js
const config = {
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
          priority: 10
        },
        nutui: {
          test: /[\\/]node_modules[\\/]@nutui[\\/]/,
          name: 'nutui',
          chunks: 'all',
          priority: 20
        },
        common: {
          name: 'common',
          minChunks: 2,
          chunks: 'all',
          priority: 5,
          reuseExistingChunk: true
        }
      }
    },
    runtimeChunk: {
      name: 'runtime'
    }
  },
  
  // 压缩配置
  minimizer: [
    new TerserPlugin({
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true
        }
      }
    }),
    new CssMinimizerPlugin()
  ]
}
```

### 2. 资源优化
```javascript
// 图片压缩
const ImageminPlugin = require('imagemin-webpack-plugin').default

config.plugins.push(
  new ImageminPlugin({
    test: /\.(jpe?g|png|gif|svg)$/i,
    pngquant: {
      quality: '65-90'
    },
    mozjpeg: {
      quality: 85
    },
    svgo: {
      plugins: [
        { removeViewBox: false }
      ]
    }
  })
)
```

## 🚨 故障排查

### 常见问题及解决方案

#### 1. 构建失败
```bash
# 清理缓存
pnpm clean
rm -rf node_modules
pnpm install

# 检查Node版本
node --version
npm --version
```

#### 2. 微信小程序上传失败
```bash
# 检查project.config.json配置
# 确认appid正确
# 检查代码包大小是否超限
```

#### 3. H5部署后白屏
```bash
# 检查publicPath配置
# 检查路由配置
# 查看浏览器控制台错误
```

#### 4. API请求失败
```bash
# 检查环境变量配置
# 确认API地址正确
# 检查跨域配置
```

### 日志查看
```bash
# Nginx访问日志
tail -f /var/log/nginx/access.log

# Nginx错误日志
tail -f /var/log/nginx/error.log

# 应用日志
tail -f /var/log/easy-erp/app.log
```

---

**部署支持**: DevOps团队  
**技术支持**: devops@easy-erp.com  
**最后更新**: 2025年1月3日