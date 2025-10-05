import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'

export interface FilterChipsOption {
  value: string
  label: React.ReactNode
  icon?: React.ReactNode
  iconName?: string
  iconColor?: string
  color?: string
  backgroundColor?: string
  activeColor?: string
  activeBackgroundColor?: string
  disabled?: boolean
}

export interface FilterChipsProps {
  options: FilterChipsOption[]
  selectedValues: string[]
  multiple?: boolean
  allowClear?: boolean
  clearLabel?: string
  className?: string
  chipClassName?: string
  scrollable?: boolean
  onChange: (values: string[]) => void
}

const FilterChips: React.FC<FilterChipsProps> = ({
  options,
  selectedValues,
  multiple = false,
  allowClear = false,
  clearLabel = '清除',
  className = '',
  chipClassName = '',
  scrollable = false,
  onChange
}) => {
  const handleSelect = (option: FilterChipsOption) => {
    if (option.disabled) {
      return
    }

    const isSelected = selectedValues.includes(option.value)

    if (multiple) {
      const nextValues = isSelected
        ? selectedValues.filter(value => value !== option.value)
        : [...selectedValues, option.value]
      onChange(nextValues)
    } else {
      const nextValues = isSelected ? [] : [option.value]
      onChange(nextValues)
    }
  }

  const handleClear = () => {
    onChange([])
  }

  const rootClass = [
    'filter-chips',
    className,
    scrollable ? 'filter-chips--scrollable' : ''
  ].filter(Boolean).join(' ')

  const renderOption = (option: FilterChipsOption) => {
    const isActive = selectedValues.includes(option.value)
    const iconNode = option.icon || (option.iconName ? (
      <MaterialIcons
        name={option.iconName}
        size={16}
        color={option.iconColor || option.color || 'var(--text-secondary)'}
      />
    ) : null)

    const baseStyle: Record<string, string | number> = {}
    if (option.backgroundColor) {
      baseStyle.background = option.backgroundColor
    }
    if (option.color) {
      baseStyle.color = option.color
    }

    if (isActive) {
      if (option.activeBackgroundColor) {
        baseStyle.background = option.activeBackgroundColor
      }
      if (option.activeColor) {
        baseStyle.color = option.activeColor
      }
    }

    const chipClass = [
      'filter-chip',
      isActive ? 'filter-chip--active' : '',
      option.disabled ? 'filter-chip--disabled' : '',
      chipClassName
    ].filter(Boolean).join(' ')

    return (
      <View
        key={option.value}
        className={chipClass}
        style={baseStyle}
        onClick={() => handleSelect(option)}
      >
        {iconNode}
        {typeof option.label === 'string' || typeof option.label === 'number' ? (
          <Text>{option.label}</Text>
        ) : (
          <View>{option.label}</View>
        )}
      </View>
    )
  }

  return (
    <View className={rootClass}>
      {options.map(renderOption)}
      {allowClear && selectedValues.length > 0 && (
        <View
          className='filter-chip filter-chip--danger'
          onClick={handleClear}
        >
          <MaterialIcons name='close' size={16} color='#ffffff' />
          <Text>{clearLabel}</Text>
        </View>
      )}
    </View>
  )
}

export default FilterChips
