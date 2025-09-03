import React, { useState } from 'react';
import { View, ScrollView } from '@tarojs/components';
import { Empty, Tag } from '@nutui/nutui-react-taro';
import './index.scss';

export interface Column {
  key: string;
  title: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  render?: (value: any, record: any, index: number) => React.ReactNode;
  fixed?: 'left' | 'right';
}

export interface DataTableProps {
  columns: Column[];
  dataSource: any[];
  rowKey: string | ((record: any) => string);
  loading?: boolean;
  emptyText?: string;
  onRowClick?: (record: any, index: number) => void;
  className?: string;
  striped?: boolean;
  compact?: boolean;
  stickyHeader?: boolean;
  maxHeight?: string;
}

const DataTable: React.FC<DataTableProps> = ({
  columns,
  dataSource,
  rowKey,
  loading = false,
  emptyText = '暂无数据',
  onRowClick,
  className = '',
  striped = true,
  compact = false,
  stickyHeader = true,
  maxHeight
}) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  
  const getRowKey = (record: any, index: number): string => {
    if (typeof rowKey === 'function') {
      return rowKey(record);
    }
    return record[rowKey] || `row-${index}`;
  };
  
  const handleRowClick = (record: any, index: number) => {
    setSelectedRowIndex(index);
    onRowClick?.(record, index);
  };
  
  const renderCellContent = (column: Column, record: any, index: number) => {
    const value = record[column.key];
    
    if (column.render) {
      return column.render(value, record, index);
    }
    
    if (value === null || value === undefined) {
      return <span className="text-placeholder">-</span>;
    }
    
    return value;
  };
  
  if (loading) {
    return (
      <View className={`nut-data-table ${className}`}>
        <View className="nut-data-table-loading">
          <View className="nut-data-table-loading-text">加载中...</View>
        </View>
      </View>
    );
  }
  
  if (!dataSource || dataSource.length === 0) {
    return (
      <View className={`nut-data-table ${className}`}>
        <View className="nut-data-table-empty">
          <Empty description={emptyText} />
        </View>
      </View>
    );
  }
  
  return (
    <View className={`nut-data-table ${compact ? 'compact' : ''} ${className}`}>
      <ScrollView
        scrollX
        scrollY={!!maxHeight}
        style={{ maxHeight }}
        className="nut-data-table-scroll"
      >
        <View className="nut-data-table-wrapper">
          {/* 表头 */}
          <View className={`nut-data-table-header ${stickyHeader ? 'sticky' : ''}`}>
            {columns.map((column) => (
              <View
                key={column.key}
                className={`nut-data-table-cell align-${column.align || 'left'}`}
                style={{ width: column.width, minWidth: column.width }}
              >
                {column.title}
              </View>
            ))}
          </View>
          
          {/* 表体 */}
          <View className="nut-data-table-body">
            {dataSource.map((record, index) => (
              <View
                key={getRowKey(record, index)}
                className={`nut-data-table-row ${striped && index % 2 === 1 ? 'striped' : ''} 
                  ${selectedRowIndex === index ? 'selected' : ''} 
                  ${onRowClick ? 'clickable' : ''}`}
                onClick={() => handleRowClick(record, index)}
              >
                {columns.map((column) => (
                  <View
                    key={`${getRowKey(record, index)}-${column.key}`}
                    className={`nut-data-table-cell align-${column.align || 'left'}`}
                    style={{ width: column.width, minWidth: column.width }}
                  >
                    {renderCellContent(column, record, index)}
                  </View>
                ))}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

// 导出一些常用的渲染函数
export const TableRenderers = {
  tag: (type: 'primary' | 'success' | 'danger' | 'warning') => (value: string) => (
    <Tag type={type} size="small">{value}</Tag>
  ),
  
  status: (statusMap: Record<string, { text: string; type: 'primary' | 'success' | 'danger' | 'warning' }>) => 
    (value: string) => {
      const status = statusMap[value];
      if (!status) return value;
      return <Tag type={status.type} size="small">{status.text}</Tag>;
    },
  
  number: (precision: number = 0) => (value: number) => {
    if (value === null || value === undefined) return '-';
    return value.toFixed(precision);
  },
  
  percentage: (value: number) => {
    if (value === null || value === undefined) return '-';
    return `${(value * 100).toFixed(1)}%`;
  },
  
  date: (value: string | Date) => {
    if (!value) return '-';
    const date = new Date(value);
    return date.toLocaleDateString('zh-CN');
  },
  
  datetime: (value: string | Date) => {
    if (!value) return '-';
    const date = new Date(value);
    return `${date.toLocaleDateString('zh-CN')} ${date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })}`;
  }
};

export default DataTable;