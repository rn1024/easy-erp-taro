import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { NavBar, SearchBar, Popup } from '@nutui/nutui-react-taro'
import { Search } from '@nutui/icons-react-taro'
import { SearchFilters } from '@/types'
import './index.scss'

interface TopNavigationProps {
  title?: string
  showSearch?: boolean
  showFilter?: boolean
  onSearch?: (keyword: string) => void
  onFilter?: (filters: SearchFilters) => void
  placeholder?: string
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  title = 'Easy ERP',
  showSearch = true,
  showFilter = false,
  onSearch,
  onFilter,
  placeholder = '搜索任务...'
}) => {
  const [searchVisible, setSearchVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')

  const handleSearchClick = () => {
    setSearchVisible(true)
  }

  const handleSearchCancel = () => {
    setSearchVisible(false)
    setSearchKeyword('')
  }

  const handleSearchSubmit = (value: string) => {
    onSearch?.(value)
    setSearchVisible(false)
  }

  const handleFilterClick = () => {
    setFilterVisible(true)
  }

  const handleFilterConfirm = () => {
    // 这里应该收集筛选条件并调用onFilter
    onFilter?.({
      status: [], // 实际应该从UI收集
      priority: [], // 实际应该从UI收集
      assignee: []
    })
    setFilterVisible(false)
  }

  const renderRightContent = () => {
    const actions: React.ReactNode[] = []
    
    if (showSearch) {
      actions.push(
        <Search 
          key="search"
          size="20"
          onClick={handleSearchClick}
          className="top-nav__action"
        />
      )
    }

    if (showFilter) {
      actions.push(
        <View 
          key="filter"
          className="top-nav__action"
          onClick={handleFilterClick}
        >
          筛选
        </View>
      )
    }

    return actions.length > 0 ? actions : undefined
  }

  return (
    <View className="top-navigation">
      <NavBar
        title={title}
        right={renderRightContent()}
        className="top-navigation__navbar"
      />

      {/* 搜索弹窗 */}
      <Popup
        visible={searchVisible}
        position="top"
        onClose={handleSearchCancel}
        closeable
        className="top-navigation__search-popup"
      >
        <View className="top-navigation__search-container">
          <SearchBar
            placeholder={placeholder}
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={handleSearchSubmit}
            autoFocus
          />
          <View 
            className="top-navigation__search-cancel"
            onClick={handleSearchCancel}
          >
            取消
          </View>
        </View>
      </Popup>

      {/* 筛选弹窗 */}
      <Popup
        visible={filterVisible}
        position="bottom"
        onClose={() => setFilterVisible(false)}
        closeable
        className="top-navigation__filter-popup"
      >
        <View className="top-navigation__filter-container">
          <View className="top-navigation__filter-title">筛选条件</View>
          {/* 这里可以添加更多筛选选项 */}
          <View className="top-navigation__filter-item">
            <View>状态筛选</View>
            {/* 添加状态选择器 */}
          </View>
          <View className="top-navigation__filter-item">
            <View>优先级筛选</View>
            {/* 添加优先级选择器 */}
          </View>
          <View className="top-navigation__filter-actions">
            <View 
              className="top-navigation__filter-reset"
              onClick={() => setFilterVisible(false)}
            >
              重置
            </View>
            <View 
              className="top-navigation__filter-confirm"
              onClick={handleFilterConfirm}
            >
              确认
            </View>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default TopNavigation 