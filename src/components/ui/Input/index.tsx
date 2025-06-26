import React, { forwardRef } from 'react'
import { View, Text } from '@tarojs/components'
import { Input as NutInput } from '@nutui/nutui-react-taro'
import { cn } from '../../../utils/cn'
import './index.scss'

export interface InputProps {
  /**
   * 输入框类型
   */
  type?: 'text' | 'number' | 'idcard' | 'digit' | 'password' | 'tel'

  /**
   * 输入框值
   */
  value?: string

  /**
   * 默认值
   */
  defaultValue?: string

  /**
   * 占位符
   */
  placeholder?: string

  /**
   * 标签
   */
  label?: string

  /**
   * 错误信息
   */
  error?: string

  /**
   * 帮助文本
   */
  helperText?: string

  /**
   * 是否必填
   */
  required?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否只读
   */
  readonly?: boolean

  /**
   * 是否可清空
   */
  clearable?: boolean

  /**
   * 最大长度
   */
  maxLength?: number

  /**
   * 前缀图标
   */
  prefixIcon?: React.ReactNode

  /**
   * 后缀图标
   */
  suffixIcon?: React.ReactNode

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 容器类名
   */
  containerClassName?: string

  /**
   * 值改变回调
   */
  onChange?: (value: string) => void

  /**
   * 聚焦回调
   */
  onFocus?: () => void

  /**
   * 失焦回调
   */
  onBlur?: () => void

  /**
   * 清空回调
   */
  onClear?: () => void
}

/**
 * 输入框组件
 * 基于NutUI Input的封装，提供更丰富的功能
 */
export const Input = forwardRef<any, InputProps>(({
  label,
  error,
  helperText,
  required = false,
  prefixIcon,
  suffixIcon,
  className,
  containerClassName,
  disabled,
  ...props
}, ref) => {
  return (
    <View className={cn('ui-input', containerClassName)}>
      {label && (
        <View className="ui-input__label">
          {required && <Text className="ui-input__required">*</Text>}
          <Text>{label}</Text>
        </View>
      )}

      <View className={cn(
        'ui-input__wrapper',
        {
          'ui-input__wrapper--error': !!error,
          'ui-input__wrapper--disabled': disabled
        }
      )}>
        {prefixIcon && (
          <View className="ui-input__prefix">
            {prefixIcon}
          </View>
        )}

        <NutInput
          ref={ref}
          className={cn('ui-input__field', className)}
          disabled={disabled}
          {...props}
        />

        {suffixIcon && (
          <View className="ui-input__suffix">
            {suffixIcon}
          </View>
        )}
      </View>

      {(error || helperText) && (
        <View className={cn(
          'ui-input__message',
          {
            'ui-input__message--error': !!error
          }
        )}>
          <Text>{error || helperText}</Text>
        </View>
      )}
    </View>
  )
})

Input.displayName = 'Input'

/**
 * 搜索输入框
 */
export interface SearchInputProps extends Omit<InputProps, 'type'> {
  /**
   * 搜索回调
   */
  onSearch?: (value: string) => void
}

export const SearchInput: React.FC<SearchInputProps> = ({
  placeholder = '搜索...',
  onSearch,
  onChange,
  ...props
}) => {
  const handleChange = (value: string) => {
    onChange?.(value)
    // 可以添加防抖搜索逻辑
  }

  return (
    <Input
      type="text"
      placeholder={placeholder}
      onChange={handleChange}
      clearable
      {...props}
    />
  )
}
