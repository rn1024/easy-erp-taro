import React, { useState } from 'react'
import { View, Input } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onSearch?: (value: string) => void
  onChange?: (value: string) => void
  disabled?: boolean
  className?: string
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '搜索任务、负责人...',
  value = '',
  onSearch,
  onChange,
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

  return (
    <View className={`search-bar ${className}`}>
      <View className="search-bar__wrapper">
        {/* 搜索输入框 */}
        <View className={`search-bar__input-wrapper ${isFocused ? 'focused' : ''}`}>
          <View className="search-bar__search-icon">
            <MaterialIcons name="search" size={16} color="#666" />
          </View>
          <Input
            className="search-bar__input"
            placeholder={placeholder}
            value={inputValue}
            onInput={handleInputChange}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            onConfirm={handleInputConfirm}
            disabled={disabled}
            confirmType="search"
            placeholderClass="search-bar__placeholder"
          />
          {inputValue && (
            <View className="search-bar__clear-icon" onClick={handleClear}>
              <MaterialIcons name="close" size={16} color="#666" />
            </View>
          )}
        </View>
      </View>
    </View>
  )
}

export default SearchBar 