import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

interface TopNavigationProps {
  onSearch: (query: string) => void
  onFilter: (filters: any) => void
  activeFilters: number
}

export default function TopNavigation({ onSearch, onFilter, activeFilters }: TopNavigationProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    onSearch(value)
  }

  const handleFilterClick = () => {
    setShowFilters(!showFilters)
  }

  const applyFilter = (filterType: string, value: string) => {
    const filters = { [filterType]: value }
    onFilter(filters)
    setShowFilters(false)
  }

  const clearFilters = () => {
    onFilter({})
    setShowFilters(false)
  }

  const clearSearch = () => {
    setSearchQuery('')
    onSearch('')
  }

  return (
    <div className="bg-white px-4 py-3 border-b border-gray-100 sticky top-0 z-10">
      {/* 搜索栏 */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex-1 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            placeholder="搜索任务、负责人..."
            onChange={handleSearch}
            className="w-full pl-10 pr-10 py-2 border border-gray-200 rounded-lg bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          {searchQuery && (
            <button
              onClick={clearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
        <button
          onClick={handleFilterClick}
          className={`px-3 py-2 rounded-lg border text-sm font-medium transition-colors ${
            activeFilters > 0 
              ? 'bg-blue-500 text-white border-blue-500' 
              : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
          }`}
        >
          <div className="flex items-center gap-1">
            <Filter className="h-4 w-4" />
            <span>筛选</span>
            {activeFilters > 0 && (
              <span className="ml-1 bg-white text-blue-500 px-1.5 py-0.5 rounded text-xs">
                {activeFilters}
              </span>
            )}
          </div>
        </button>
      </div>

      {/* 筛选选项 */}
      {showFilters && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-700">状态筛选</span>
            {activeFilters > 0 && (
              <button
                onClick={clearFilters}
                className="text-xs text-red-500 hover:text-red-700 underline"
              >
                清除筛选
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { key: 'pending', label: '待处理' },
              { key: 'progress', label: '进行中' },
              { key: 'completed', label: '已完成' },
              { key: 'rejected', label: '已拒绝' }
            ].map(status => (
              <button
                key={status.key}
                onClick={() => applyFilter('status', status.key)}
                className="px-2 py-1 text-xs rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {status.label}
              </button>
            ))}
          </div>

          <div className="text-sm font-medium text-gray-700 mb-2">优先级筛选</div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { key: 'high', label: '高' },
              { key: 'medium', label: '中' },
              { key: 'low', label: '低' }
            ].map(priority => (
              <button
                key={priority.key}
                onClick={() => applyFilter('priority', priority.key)}
                className="px-2 py-1 text-xs rounded border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 transition-colors"
              >
                {priority.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}