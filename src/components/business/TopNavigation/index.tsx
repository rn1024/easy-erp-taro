import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { NavBar, SearchBar, Popup, Button, Radio, Form, FormItem, Cell } from '@nutui/nutui-react-taro'
import { Search, Filter } from '@nutui/icons-react-taro'
import './index.scss'

interface FilterOptions {
  status?: string
  priority?: string
  assignee?: string
  dateRange?: string
}

interface TopNavigationProps {
  title?: string
  showSearch?: boolean
  showFilter?: boolean
  onSearch?: (keyword: string) => void
  onFilter?: (filters: FilterOptions) => void
  activeFilters?: number
  placeholder?: string
}

const TopNavigation: React.FC<TopNavigationProps> = ({
  title = 'Easy ERP',
  showSearch = true,
  showFilter = false,
  onSearch,
  onFilter,
  activeFilters = 0,
  placeholder = '搜索任务...'
}) => {
  const [searchVisible, setSearchVisible] = useState(false)
  const [filterVisible, setFilterVisible] = useState(false)
  const [searchKeyword, setSearchKeyword] = useState('')
  const [filterForm, setFilterForm] = useState<FilterOptions>({
    status: '',
    priority: '',
    assignee: '',
    dateRange: ''
  })

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
    onFilter?.(filterForm)
    setFilterVisible(false)
  }

  const handleFilterReset = () => {
    const resetForm = {
      status: '',
      priority: '',
      assignee: '',
      dateRange: ''
    }
    setFilterForm(resetForm)
    onFilter?.(resetForm)
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
          className="top-nav__filter-btn"
          onClick={handleFilterClick}
        >
          <Filter size="20" />
          {activeFilters > 0 && (
            <View className="top-nav__filter-badge">{activeFilters}</View>
          )}
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
          <View className="top-navigation__filter-header">
            <Text className="top-navigation__filter-title">筛选条件</Text>
          </View>
          
          <Form className="top-navigation__filter-form">
            <FormItem label="状态">
              <Radio.Group
                value={filterForm.status}
                onChange={(value) => setFilterForm({...filterForm, status: String(value)})}
              >
                <Cell>
                  <Radio value="">全部</Radio>
                </Cell>
                <Cell>
                  <Radio value="pending">待处理</Radio>
                </Cell>
                <Cell>
                  <Radio value="progress">进行中</Radio>
                </Cell>
                <Cell>
                  <Radio value="completed">已完成</Radio>
                </Cell>
                <Cell>
                  <Radio value="rejected">已拒绝</Radio>
                </Cell>
              </Radio.Group>
            </FormItem>
            
            <FormItem label="优先级">
              <Radio.Group
                value={filterForm.priority}
                onChange={(value) => setFilterForm({...filterForm, priority: String(value)})}
              >
                <Cell>
                  <Radio value="">全部</Radio>
                </Cell>
                <Cell>
                  <Radio value="high">高</Radio>
                </Cell>
                <Cell>
                  <Radio value="medium">中</Radio>
                </Cell>
                <Cell>
                  <Radio value="low">低</Radio>
                </Cell>
              </Radio.Group>
            </FormItem>

            <FormItem label="负责人">
              <Radio.Group
                value={filterForm.assignee}
                onChange={(value) => setFilterForm({...filterForm, assignee: String(value)})}
              >
                <Cell>
                  <Radio value="">全部</Radio>
                </Cell>
                <Cell>
                  <Radio value="zhang">张三</Radio>
                </Cell>
                <Cell>
                  <Radio value="li">李四</Radio>
                </Cell>
                <Cell>
                  <Radio value="wang">王五</Radio>
                </Cell>
                <Cell>
                  <Radio value="zhao">赵六</Radio>
                </Cell>
              </Radio.Group>
            </FormItem>

            <FormItem label="时间范围">
              <Radio.Group
                value={filterForm.dateRange}
                onChange={(value) => setFilterForm({...filterForm, dateRange: String(value)})}
              >
                <Cell>
                  <Radio value="">全部</Radio>
                </Cell>
                <Cell>
                  <Radio value="today">今天</Radio>
                </Cell>
                <Cell>
                  <Radio value="week">本周</Radio>
                </Cell>
                <Cell>
                  <Radio value="overdue">已逾期</Radio>
                </Cell>
              </Radio.Group>
            </FormItem>
          </Form>
          
          <View className="top-navigation__filter-actions">
            <Button 
              className="top-navigation__filter-reset"
              onClick={handleFilterReset}
            >
              重置
            </Button>
            <Button 
              type="primary"
              className="top-navigation__filter-confirm"
              onClick={handleFilterConfirm}
            >
              确认筛选
            </Button>
          </View>
        </View>
      </Popup>
    </View>
  )
}

export default TopNavigation 