# 微信小程序懒加载与性能优化指南

## 微信小程序的懒加载机制

微信小程序与 Web 应用的懒加载机制有显著差异。以下是微信小程序中实现懒加载和性能优化的主要方法：

### 1. 页面级懒加载（自动）

微信小程序天然支持页面级懒加载：
- 启动时只加载首页（或指定的入口页面）
- 其他页面在用户导航时才加载
- 这是小程序框架自动处理的，无需额外配置

### 2. 分包加载

分包加载是微信小程序优化启动速度的重要手段：

#### 配置示例
```typescript
// app.config.ts
export default {
  // 主包页面
  pages: [
    'pages/home/index',
    'pages/tasks/index',
    'pages/messages/index',
    'pages/profile/index'
  ],
  
  // 分包配置
  subPackages: [
    {
      root: 'pages/system',
      name: 'system',
      pages: [
        'account/index',
        'security/index',
        'help/index'
      ]
    },
    {
      root: 'pages/workflow',
      name: 'workflow',
      pages: [
        'create/index',
        'builder/index',
        'detail/index'
      ]
    }
  ],
  
  // 分包预下载规则
  preloadRule: {
    'pages/home/index': {
      network: 'all',      // all: 不限网络, wifi: 仅wifi下预下载
      packages: ['system'] // 进入首页时预下载系统管理分包
    }
  }
}
```

#### 分包加载的优势
- 减小主包体积，加快启动速度
- 按需加载，节省用户流量
- 支持预下载，优化用户体验

### 3. 组件懒加载

由于微信小程序不支持 React.lazy，我们需要使用其他方式：

#### 3.1 使用 IntersectionObserver 实现组件懒渲染
```typescript
// 在组件中使用
import Taro from '@tarojs/taro'
import { View } from '@tarojs/components'
import { useState, useEffect } from 'react'

const LazyComponent = () => {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    // 创建观察器实例时需要传入组件实例
    const observer = Taro.createIntersectionObserver(Taro.getCurrentInstance().page)
    
    observer
      .relativeToViewport({ bottom: 100 }) // 提前100px开始加载
      .observe('.lazy-component', (res) => {
        if (res.intersectionRatio > 0) {
          setIsVisible(true)
          observer.disconnect()
        }
      })
    
    return () => observer.disconnect()
  }, [])
  
  return (
    <View className="lazy-component">
      {isVisible ? (
        <ComplexComponent />
      ) : (
        <View>加载中...</View>
      )}
    </View>
  )
}
```

#### 3.2 图片懒加载
```typescript
// Taro 3 中 Image 组件已经支持懒加载
import { Image } from '@tarojs/components'

const LazyImage = () => {
  return (
    <Image
      src="https://example.com/image.jpg"
      lazyLoad // 开启懒加载
      placeholder="加载中..." // 占位内容
    />
  )
}
```

### 4. 数据懒加载

#### 4.1 分页加载
```typescript
const usePageData = () => {
  const [list, setList] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  
  const loadMore = async () => {
    if (!hasMore) return
    
    const data = await fetchData({ page, pageSize: 20 })
    
    if (data.length < 20) {
      setHasMore(false)
    }
    
    setList(prev => [...prev, ...data])
    setPage(prev => prev + 1)
  }
  
  return { list, loadMore, hasMore }
}
```

#### 4.2 虚拟列表（长列表优化）
```typescript
// 使用 Taro 的 VirtualList 组件
import { VirtualList } from '@tarojs/components/virtual-list'

const LongList = ({ data }) => {
  const Row = ({ index, style, data }) => {
    return (
      <View style={style}>
        {data[index].name}
      </View>
    )
  }
  
  return (
    <VirtualList
      height={800} // 列表高度
      width="100%" // 列表宽度
      itemData={data} // 数据
      itemCount={data.length} // 数据总数
      itemSize={100} // 每项高度
      overscan={5} // 预渲染的项数
    >
      {Row}
    </VirtualList>
  )
}
```

### 5. 性能优化建议

#### 5.1 减少 setData 调用
```typescript
// ❌ 不好的做法
list.forEach(item => {
  this.setState({ [`item_${item.id}`]: item })
})

// ✅ 好的做法
const updates = {}
list.forEach(item => {
  updates[`item_${item.id}`] = item
})
this.setState(updates)
```

#### 5.2 使用骨架屏
```typescript
// 使用之前创建的 Skeleton 组件
import { Skeleton } from '@/components'

const Page = () => {
  const [loading, setLoading] = useState(true)
  
  return loading ? (
    <Skeleton type="card" count={3} />
  ) : (
    <ActualContent />
  )
}
```

#### 5.3 预加载数据
```typescript
// 在页面 A 中预加载页面 B 需要的数据
const preloadPageBData = () => {
  // 使用全局状态管理
  const { preloadWorkflowData } = useWorkflowStore()
  
  // 提前加载数据
  preloadWorkflowData()
}

// 在导航前调用
const navigateToPageB = () => {
  preloadPageBData()
  Taro.navigateTo({ url: '/pages/workflow/index' })
}
```

### 6. 监控和调试

#### 6.1 性能监控
```typescript
// 使用 Taro 的性能监控 API
Taro.onMemoryWarning((res) => {
  console.log('内存不足警告', res.level)
})

// 获取性能数据
const performance = Taro.getPerformance()
const observer = performance.createObserver((list) => {
  console.log('性能数据', list.getEntries())
})
observer.observe({ entryTypes: ['render', 'navigation'] })
```

#### 6.2 使用开发者工具
- 使用微信开发者工具的 Performance 面板
- 查看页面渲染时间和内存占用
- 分析 setData 调用频率和数据量

### 7. 最佳实践总结

1. **合理使用分包**：将不常用的功能放入分包
2. **图片优化**：使用 WebP 格式，合理设置图片尺寸
3. **数据管理**：避免在页面中存储大量数据
4. **组件优化**：合理拆分组件，避免过度渲染
5. **缓存策略**：使用本地存储缓存常用数据

### 8. 与 Web 懒加载的对比

| 特性 | Web (React) | 微信小程序 |
|-----|------------|-----------|
| 代码分割 | React.lazy() | 分包加载 |
| 组件懒加载 | 动态 import | IntersectionObserver |
| 图片懒加载 | loading="lazy" | lazyLoad 属性 |
| 路由懒加载 | 自动 | 自动 |
| 预加载 | prefetch/preload | preloadRule |

## 结论

虽然微信小程序不支持 React.lazy 这样的动态导入，但通过合理使用分包加载、IntersectionObserver、虚拟列表等技术，同样可以实现良好的懒加载效果和性能优化。关键是要理解小程序的运行机制，选择适合的优化策略。 
