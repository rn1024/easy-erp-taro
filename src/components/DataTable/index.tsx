import React from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Pagination, Loading } from '@nutui/nutui-react-taro'

import './index.scss'

export interface DataTableColumn<TRecord extends Record<string, unknown>> {
  key: string
  title: string
  dataIndex: keyof TRecord
  width?: number | string
  align?: 'left' | 'center' | 'right'
  render?: (value: TRecord[keyof TRecord], record: TRecord, index: number) => React.ReactNode
}

export interface DataTablePaginationConfig {
  current: number
  pageSize: number
  total: number
  showSizeChanger?: boolean
  pageSizeOptions?: number[]
}

export interface DataTableProps<TRecord extends Record<string, unknown>> {
  columns: Array<DataTableColumn<TRecord>>
  dataSource: TRecord[]
  rowKey?: keyof TRecord | ((record: TRecord, index: number) => string | number)
  loading?: boolean
  emptyText?: string
  pagination?: DataTablePaginationConfig | false
  className?: string
  onPageChange?: (page: number, pageSize: number) => void
}

function getRowKey<TRecord extends Record<string, unknown>>(
  record: TRecord,
  index: number,
  rowKey?: keyof TRecord | ((item: TRecord, position: number) => string | number)
): string | number {
  if (typeof rowKey === 'function') {
    return rowKey(record, index)
  }
  if (rowKey) {
    const keyValue = record[rowKey]
    if (typeof keyValue === 'string' || typeof keyValue === 'number') {
      return keyValue
    }
  }
  return index
}

function DataTable<TRecord extends Record<string, unknown>>({
  columns,
  dataSource,
  rowKey,
  loading = false,
  emptyText = '暂无数据',
  pagination = false,
  className = '',
  onPageChange
}: DataTableProps<TRecord>): React.ReactElement {
  if (loading) {
    return (
      <View className={`data-table ${className}`}>
        <View className='data-table__loading'>
          <Loading />
          <Text className='data-table__loading-text'>加载中...</Text>
        </View>
      </View>
    )
  }

  if (dataSource.length === 0) {
    return (
      <View className={`data-table ${className}`}>
        <View className='data-table__empty'>
          <Text className='data-table__empty-text'>{emptyText}</Text>
        </View>
      </View>
    )
  }

  return (
    <View className={`data-table ${className}`}>
      <ScrollView scrollX className='data-table__scroll'>
        <View className='data-table__wrapper'>
          <View className='data-table__header-row'>
            {columns.map(column => (
              <View
                key={column.key}
                className={`data-table__header-cell data-table__header-cell--${column.align ?? 'left'}`}
                style={{ width: column.width, minWidth: column.width }}
              >
                <Text>{column.title}</Text>
              </View>
            ))}
          </View>
          <View className='data-table__body'>
            {dataSource.map((record, index) => (
              <View key={getRowKey(record, index, rowKey)} className='data-table__row'>
                {columns.map(column => {
                  const rawValue = record[column.dataIndex]
                  const content = column.render
                    ? column.render(rawValue, record, index)
                    : rawValue ?? '-'

                  return (
                    <View
                      key={column.key}
                      className={`data-table__cell data-table__cell--${column.align ?? 'left'}`}
                      style={{ width: column.width, minWidth: column.width }}
                    >
                      {typeof content === 'string' || typeof content === 'number'
                        ? <Text className='data-table__cell-text'>{content}</Text>
                        : content}
                    </View>
                  )
                })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      {pagination && (
        <View className='data-table__pagination'>
          <Pagination
            current={pagination.current}
            total={pagination.total}
            pageSize={pagination.pageSize}
            showTotal
            onChange={({ current, pageSize }: { current: number; pageSize: number }) => {
              onPageChange?.(current, pageSize)
            }}
            pageSizeOptions={pagination.pageSizeOptions}
            showPageSizeChanger={pagination.showSizeChanger}
          />
        </View>
      )}
    </View>
  )
}

export type { DataTableProps }
export default DataTable
