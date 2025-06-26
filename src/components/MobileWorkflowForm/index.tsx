import React, { useState, useEffect } from 'react'
import { View, Text, ScrollView } from '@tarojs/components'
import { Form, Switch, Radio, CheckBox, Rate, DatePicker, Picker, TextArea } from '@nutui/nutui-react-taro'
import { IconFont } from '@nutui/icons-react-taro'
import { Button, Input, Card } from '../ui'
import { cn } from '../../utils/cn'
import './index.scss'

// 表单字段类型
export type FormFieldType =
  | 'text'
  | 'number'
  | 'email'
  | 'tel'
  | 'textarea'
  | 'select'
  | 'multiselect'
  | 'date'
  | 'datetime'
  | 'switch'
  | 'radio'
  | 'checkbox'
  | 'rate'
  | 'file'

// 表单字段配置
export interface FormField {
  id: string
  type: FormFieldType
  label: string
  name: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  defaultValue?: any
  options?: Array<{ label: string; value: any }>
  validation?: {
    pattern?: RegExp
    message?: string
    min?: number
    max?: number
  }
  dependsOn?: {
    field: string
    value: any
  }
}

// 表单配置
export interface FormConfig {
  id: string
  title: string
  description?: string
  fields: FormField[]
  submitText?: string
  cancelText?: string
}

export interface MobileWorkflowFormProps {
  /**
   * 表单配置
   */
  config: FormConfig

  /**
   * 初始值
   */
  initialValues?: Record<string, any>

  /**
   * 提交回调
   */
  onSubmit?: (values: Record<string, any>) => void | Promise<void>

  /**
   * 取消回调
   */
  onCancel?: () => void

  /**
   * 字段变更回调
   */
  onChange?: (name: string, value: any) => void

  /**
   * 自定义类名
   */
  className?: string
}

/**
 * 移动端工作流表单
 * 支持动态表单生成
 */
export const MobileWorkflowForm: React.FC<MobileWorkflowFormProps> = ({
  config,
  initialValues = {},
  onSubmit,
  onCancel,
  onChange,
  className
}) => {
  const [formData, setFormData] = useState<Record<string, any>>(initialValues)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [visibleFields, setVisibleFields] = useState<Set<string>>(new Set())

  // 初始化可见字段
  useEffect(() => {
    const visible = new Set<string>()
    config.fields.forEach(field => {
      if (!field.dependsOn || checkDependency(field.dependsOn)) {
        visible.add(field.id)
      }
    })
    setVisibleFields(visible)
  }, [config.fields, formData])

  // 检查依赖条件
  const checkDependency = (dependency: { field: string; value: any }) => {
    return formData[dependency.field] === dependency.value
  }

  // 处理字段变更
  const handleFieldChange = (name: string, value: any) => {
    setFormData(prev => ({ ...prev, [name]: value }))
    setErrors(prev => ({ ...prev, [name]: '' }))
    onChange?.(name, value)
  }

  // 验证字段
  const validateField = (field: FormField, value: any): string | null => {
    if (field.required && !value) {
      return `${field.label}不能为空`
    }

    if (field.validation) {
      const { pattern, message, min, max } = field.validation

      if (pattern && !pattern.test(String(value))) {
        return message || `${field.label}格式不正确`
      }

      if (min !== undefined && Number(value) < min) {
        return `${field.label}不能小于${min}`
      }

      if (max !== undefined && Number(value) > max) {
        return `${field.label}不能大于${max}`
      }
    }

    return null
  }

  // 验证表单
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}
    let isValid = true

    config.fields.forEach(field => {
      if (visibleFields.has(field.id)) {
        const error = validateField(field, formData[field.name])
        if (error) {
          newErrors[field.name] = error
          isValid = false
        }
      }
    })

    setErrors(newErrors)
    return isValid
  }

  // 处理提交
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    try {
      await onSubmit?.(formData)
    } finally {
      setLoading(false)
    }
  }

  // 渲染表单字段
  const renderField = (field: FormField) => {
    if (!visibleFields.has(field.id)) {
      return null
    }

    const value = formData[field.name] ?? field.defaultValue ?? ''
    const error = errors[field.name]

    switch (field.type) {
      case 'text':
      case 'number':
      case 'email':
      case 'tel':
        return (
          <Input
            key={field.id}
            type={field.type}
            label={field.label}
            value={value}
            placeholder={field.placeholder}
            disabled={field.disabled}
            error={error}
            required={field.required}
            onChange={(val) => handleFieldChange(field.name, val)}
          />
        )

      case 'textarea':
        return (
          <View key={field.id} className="form-field">
            <View className="form-field__label">
              {field.required && <Text className="form-field__required">*</Text>}
              {field.label}
            </View>
            <TextArea
              value={value}
              placeholder={field.placeholder}
              disabled={field.disabled}
              onChange={(val) => handleFieldChange(field.name, val)}
              className={cn('form-field__textarea', { 'form-field__textarea--error': error })}
            />
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'select':
        return (
          <View key={field.id} className="form-field">
            <Picker
              options={field.options?.map(opt => ({ text: opt.label, value: opt.value })) || []}
              value={value}
              onConfirm={(options, values) => handleFieldChange(field.name, values[0])}
            >
              <Cell
                title={field.label}
                description={field.options?.find(opt => opt.value === value)?.label || field.placeholder}
                extra={<IconFont name="arrow-right" />}
                className={cn({ 'form-field--error': error })}
              />
            </Picker>
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'multiselect':
        return (
          <View key={field.id} className="form-field">
            <View className="form-field__label">
              {field.required && <Text className="form-field__required">*</Text>}
              {field.label}
            </View>
            <CheckBox.Group
              value={value || []}
              onChange={(val) => handleFieldChange(field.name, val)}
              disabled={field.disabled}
            >
              {field.options?.map(option => (
                <CheckBox key={option.value} value={option.value}>
                  {option.label}
                </CheckBox>
              ))}
            </CheckBox.Group>
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'date':
      case 'datetime':
        return (
          <View key={field.id} className="form-field">
            <DatePicker
              type={field.type}
              defaultValue={value}
              onConfirm={(options, values) => handleFieldChange(field.name, values.join('-'))}
            >
              <Cell
                title={field.label}
                description={value || field.placeholder}
                extra={<IconFont name="arrow-right" />}
                className={cn({ 'form-field--error': error })}
              />
            </DatePicker>
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'switch':
        return (
          <View key={field.id} className="form-field">
            <Cell
              title={field.label}
              extra={
                <Switch
                  checked={value}
                  onChange={(val) => handleFieldChange(field.name, val)}
                  disabled={field.disabled}
                />
              }
            />
          </View>
        )

      case 'radio':
        return (
          <View key={field.id} className="form-field">
            <View className="form-field__label">
              {field.required && <Text className="form-field__required">*</Text>}
              {field.label}
            </View>
            <Radio.Group
              value={value}
              onChange={(val) => handleFieldChange(field.name, val)}
              disabled={field.disabled}
            >
              {field.options?.map(option => (
                <Radio key={option.value} value={option.value}>
                  {option.label}
                </Radio>
              ))}
            </Radio.Group>
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'rate':
        return (
          <View key={field.id} className="form-field">
            <View className="form-field__label">
              {field.required && <Text className="form-field__required">*</Text>}
              {field.label}
            </View>
            <Rate
              value={value || 0}
              onChange={(val) => handleFieldChange(field.name, val)}
              disabled={field.disabled}
            />
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      case 'file':
        return (
          <View key={field.id} className="form-field">
            <Cell
              title={field.label}
              description={value ? '已上传' : field.placeholder}
              extra={<IconFont name="upload" />}
              onClick={() => {
                // TODO: 实现文件上传
                console.log('文件上传')
              }}
              className={cn({ 'form-field--error': error })}
            />
            {error && <Text className="form-field__error">{error}</Text>}
          </View>
        )

      default:
        return null
    }
  }

  // 导入必要的Cell组件
  const Cell = ({ title, description, extra, className: cellClassName, onClick }: any) => (
    <View className={cn('form-cell', cellClassName)} onClick={onClick}>
      <View className="form-cell__content">
        <Text className="form-cell__title">{title}</Text>
        {description && <Text className="form-cell__description">{description}</Text>}
      </View>
      {extra && <View className="form-cell__extra">{extra}</View>}
    </View>
  )

  return (
    <View className={cn('mobile-workflow-form', className)}>
      {/* 表单头部 */}
      <Card className="mobile-workflow-form__header">
        <Text className="mobile-workflow-form__title">{config.title}</Text>
        {config.description && (
          <Text className="mobile-workflow-form__description">{config.description}</Text>
        )}
      </Card>

      {/* 表单内容 */}
      <ScrollView scrollY className="mobile-workflow-form__content">
        <View className="mobile-workflow-form__fields">
          {config.fields.map(renderField)}
        </View>
      </ScrollView>

      {/* 表单操作 */}
      <View className="mobile-workflow-form__actions">
        <Button
          variant="ghost"
          onClick={onCancel}
          disabled={loading}
        >
          {config.cancelText || '取消'}
        </Button>
        <Button
          variant="primary"
          onClick={handleSubmit}
          loading={loading}
        >
          {config.submitText || '提交'}
        </Button>
      </View>
    </View>
  )
}
