import React, { useState, useEffect, useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import { Table, Pagination, Empty, Button, Input } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

// 列配置接口
export interface DataTableColumn {
  key: string
  title: string
  dataIndex: string
  width?: number | string
  align?: 'left' | 'center' | 'right'
  fixed?: 'left' | 'right'
  sortable?: boolean
  filterable?: boolean
  render?: (value: any, record: any, index: number) => React.ReactNode
}

// 排序配置
export interface SortConfig {
  field: string
  order: 'asc' | 'desc'
}

// 筛选配置
export interface FilterConfig {
  [key: string]: any
}

// 分页配置
export interface PaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}

// DataTable属性
interface DataTableProps {
  columns: DataTableColumn[]
  dataSource: any[]
  loading?: boolean
  pagination?: false | PaginationConfig
  showHeader?: boolean
  showSearch?: boolean
  searchPlaceholder?: string
  emptyText?: string
  className?: string
  onSort?: (sortConfig: SortConfig | null) => void
  onFilter?: (filterConfig: FilterConfig) => void
  onSearch?: (keyword: string) => void
  onPageChange?: (page: number, pageSize: number) => void
  onRow?: (record: any, index: number) => {
    onClick?: () => void
    [key: string]: any
  }
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  dataSource,
  loading = false,
  pagination = false,
  showHeader = true,
  showSearch = false,
  searchPlaceholder = '请输入搜索关键词',
  emptyText = '暂无数据',
  className = '',
  onSort,
  onFilter,
  onSearch,
  onPageChange,
  onRow
}) => {
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null)
  const [filterConfig, setFilterConfig] = useState<FilterConfig>({})
  const [searchKeyword, setSearchKeyword] = useState('')

  // 处理排序
  const handleSort = (column: DataTableColumn) => {
    if (!column.sortable) return

    let newSortConfig: SortConfig | null = null
    
    if (!sortConfig || sortConfig.field !== column.dataIndex) {
      // 新字段排序，默认升序
      newSortConfig = { field: column.dataIndex, order: 'asc' }
    } else if (sortConfig.order === 'asc') {
      // 当前是升序，切换到降序
      newSortConfig = { field: column.dataIndex, order: 'desc' }
    } else {
      // 当前是降序，取消排序
      newSortConfig = null
    }

    setSortConfig(newSortConfig)
    onSort?.(newSortConfig)
  }

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchKeyword(value)
    onSearch?.(value)
  }

  // 渲染排序图标
  const renderSortIcon = (column: DataTableColumn) => {
    if (!column.sortable) return null

    const isActive = sortConfig?.field === column.dataIndex
    const order = isActive ? sortConfig.order : null

    return (
      <View className="data-table__sort-icon">
        <MaterialIcons 
          name="keyboard_arrow_up" 
          size={16} 
          color={order === 'asc' ? '#3b82f6' : '#9ca3af'} 
        />
        <MaterialIcons 
          name="keyboard_arrow_down" 
          size={16} 
          color={order === 'desc' ? '#3b82f6' : '#9ca3af'} 
        />
      </View>
    )
  }

  // 渲染表头
  const renderHeader = () => {
    if (!showHeader) return null

    return (
      <View className="data-table__header">
        {columns.map((column) => (
          <View
            key={column.key}
            className={`data-table__header-cell ${column.fixed ? `data-table__header-cell--${column.fixed}` : ''}`}
            style={{
              width: column.width,
              minWidth: column.width || '120rpx',
              textAlign: column.align || 'left'
            }}
            onClick={() => handleSort(column)}
          >
            <View className="data-table__header-content">
              <Text className="data-table__header-title">{column.title}</Text>
              {renderSortIcon(column)}
            </View>
          </View>
        ))}
      </View>
    )
  }

  // 渲染数据行
  const renderRow = (record: any, index: number) => {
    const rowProps = onRow?.(record, index) || {}
    
    return (
      <View
        key={record.id || index}
        className="data-table__row"
        {...rowProps}
      >
        {columns.map((column) => {
          let cellValue = record[column.dataIndex]
          
          // 自定义渲染
          if (column.render) {
            cellValue = column.render(cellValue, record, index)
          }

          return (
            <View
              key={column.key}
              className={`data-table__cell ${column.fixed ? `data-table__cell--${column.fixed}` : ''}`}
              style={{
                width: column.width,
                minWidth: column.width || '120rpx',
                textAlign: column.align || 'left'
              }}
            >
              {typeof cellValue === 'string' || typeof cellValue === 'number' ? (
                <Text className="data-table__cell-text">{cellValue}</Text>
              ) : (
                cellValue
              )}
            </View>
          )
        })}
      </View>
    )
  }

  // 渲染分页
  const renderPagination = () => {
    if (!pagination) return null

    return (
      <View className="data-table__pagination">
        <Pagination
          total={pagination.total}
          value={pagination.current}
          pageSize={pagination.pageSize}
          onChange={(page: number) => {
            onPageChange?.(page, pagination.pageSize)
          }}
        />
      </View>
    )
  }

  return (
    <View className={`data-table ${className}`}>
      {/* 搜索框 */}
      {showSearch && (
        <View className="data-table__search">
          <Input
            placeholder={searchPlaceholder}
            value={searchKeyword}
            onChange={handleSearch}
            clearable
          />
        </View>
      )}

      {/* 表格容器 */}
      <View className="data-table__container">
        {loading ? (
          <View className="data-table__loading">
            <Text>加载中...</Text>
          </View>
        ) : dataSource.length === 0 ? (
          <View className="data-table__empty">
            <Empty description={emptyText} />
          </View>
        ) : (
          <View className="data-table__scroll">
            {renderHeader()}
            <View className="data-table__body">
              {dataSource.map((record, index) => renderRow(record, index))}
            </View>
          </View>
        )}
      </View>

      {/* 分页 */}
      {renderPagination()}
    </View>
  )
}

export default DataTable 