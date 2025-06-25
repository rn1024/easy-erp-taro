import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import { SearchBar, Popup, Button, Badge } from '@nutui/nutui-react-taro'
import { ArrowLeft, Filter } from '@nutui/icons-react-taro'
import { cn } from '../../utils/cn'
import './index.scss'

interface TopNavigationProps {
  /** 页面标题 */
  title?: string
  /** 是否显示返回按钮 */
  showBack?: boolean
  /** 返回按钮点击回调 */
  onBack?: () => void
  /** 搜索回调函数 */
  onSearch?: (query: string) => void
  /** 筛选回调函数 */
  onFilter?: (filters: any) => void
  /** 当前激活的筛选条件数量 */
  activeFilters?: number
  /** 是否显示搜索框 */
  showSearch?: boolean
  /** 是否显示筛选按钮 */
  showFilter?: boolean
  /** 搜索框占位符 */
  searchPlaceholder?: string
  /** 自定义样式类名 */
  className?: string
}

/**
 * 顶部导航组件
 * 支持标题显示、搜索功能、筛选面板等功能
 */
const TopNavigation: React.FC<TopNavigationProps> = ({
  title,
  showBack = false,
  onBack,
  onSearch,
  onFilter,
  activeFilters = 0,
  showSearch = false,
  showFilter = false,
  searchPlaceholder = '搜索任务、责任人等',
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilterPanel, setShowFilterPanel] = useState(false)

  // 处理搜索输入
  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    onSearch?.(value)
  }

  // 处理返回按钮点击
  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  // 处理筛选按钮点击
  const handleFilterClick = () => {
    setShowFilterPanel(true)
  }

  // 处理筛选面板确认
  const handleFilterConfirm = (filters: any) => {
    onFilter?.(filters)
    setShowFilterPanel(false)
  }

  return (
    <View className={cn('top-navigation', className)}>
      {/* 导航栏主体 */}
      <View className="nav-header">

        {/* 左侧：返回按钮或标题 */}
        <View className="nav-left">
          {showBack && (
            <View className="back-button" onClick={handleBack}>
              <ArrowLeft size="18" color="#333" />
            </View>
          )}
          {title && !showSearch && (
            <Text className="nav-title">{title}</Text>
          )}
        </View>

        {/* 中间：搜索框 */}
        {showSearch && (
          <View className="nav-center">
            <SearchBar
              value={searchQuery}
              placeholder={searchPlaceholder}
              onChange={handleSearchChange}
              clearable
              hideActionButton
              shape="round"
            />
          </View>
        )}

        {/* 右侧：筛选按钮 */}
        {showFilter && (
          <View className="nav-right">
            <View className="filter-button" onClick={handleFilterClick}>
              <Filter size="18" color="#333" />
              {activeFilters > 0 && (
                <Badge
                  value={activeFilters > 99 ? '99+' : activeFilters.toString()}
                  className="filter-badge"
                />
              )}
            </View>
          </View>
        )}
      </View>

      {/* 筛选面板 */}
      <Popup
        visible={showFilterPanel}
        position="right"
        onClose={() => setShowFilterPanel(false)}
        className="filter-popup"
      >
        <View className="filter-panel">
          <View className="filter-header">
            <Text className="filter-title">筛选条件</Text>
            <Button
              size="small"
              type="primary"
              onClick={() => handleFilterConfirm({})}
            >
              确定
            </Button>
          </View>

          <View className="filter-content">
            {/* 这里可以添加具体的筛选选项 */}
            <Text className="filter-placeholder">筛选选项开发中...</Text>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default TopNavigation
