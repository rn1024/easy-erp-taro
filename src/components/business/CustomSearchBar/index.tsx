import React, { useState } from 'react'
import { View, Input, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

interface CustomSearchBarProps {
  placeholder?: string
  value?: string
  onSearch?: (value: string) => void
  onChange?: (value: string) => void
  onFilterClick?: () => void
  activeFilters?: number
  disabled?: boolean
  className?: string
}

const CustomSearchBar: React.FC<CustomSearchBarProps> = ({
  placeholder = '搜索任务、负责人...',
  value = '',
  onSearch,
  onChange,
  onFilterClick,
  activeFilters = 0,
  disabled = false,
  className = ''
}) => {
  const [inputValue, setInputValue] = useState(value)
  const [isFocused, setIsFocused] = useState(false)

  const handleInputChange = (e: any) => {
    const val = e.detail.value
    setInputValue(val)
    onChange?.(val)
  }

  const handleInputFocus = () => {
    setIsFocused(true)
  }

  const handleInputBlur = () => {
    setIsFocused(false)
  }

  const handleInputConfirm = (e: any) => {
    const val = e.detail.value
    onSearch?.(val)
  }

  const handleClear = () => {
    setInputValue('')
    onChange?.('')
    onSearch?.('')
  }

  const handleFilterClick = () => {
    onFilterClick?.()
  }

  return (
    <View className={`custom-search-bar ${className}`}>
      <View className="custom-search-bar__wrapper">
        {/* 搜索输入框 */}
        <View className={`custom-search-bar__input-wrapper ${isFocused ? 'focused' : ''}`}>
          <View className="custom-search-bar__search-icon">
            <MaterialIcons name="search" size={16} color="#666" />
          </View>
          <Input
            className="custom-search-bar__input"
            placeholder={placeholder}
            value={inputValue}
            onInput={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onConfirm={handleInputConfirm}
            disabled={disabled}
            confirmType="search"
            placeholderClass="custom-search-bar__placeholder"
          />
          {inputValue && (
            <View className="custom-search-bar__clear-icon" onClick={handleClear}>
              <MaterialIcons name="close" size={16} color="#666" />
            </View>
          )}
        </View>

        {/* 筛选按钮 */}
        <View 
          className={`custom-search-bar__filter-btn ${activeFilters > 0 ? 'active' : ''}`}
          onClick={handleFilterClick}
        >
          <MaterialIcons name="filter_list" size={16} color="#666" />
          <Text className="custom-search-bar__filter-text">筛选</Text>
          {activeFilters > 0 && (
            <View className="custom-search-bar__filter-badge">
              {activeFilters}
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default CustomSearchBar 