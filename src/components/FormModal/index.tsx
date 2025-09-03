import React, { useState, useEffect, useImperativeHandle, forwardRef } from 'react'
import { View, Text } from '@tarojs/components'
import { 
  Popup, 
  Form, 
  FormItem, 
  Input, 
  Button, 
  TextArea,
  Picker,
  NumberKeyboard,
  DatePicker
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

// 表单字段类型
export type FormFieldType = 
  | 'input' 
  | 'textarea' 
  | 'select' 
  | 'number' 
  | 'date' 
  | 'custom'

// 表单字段配置
export interface FormField {
  name: string
  label: string
  type: FormFieldType
  required?: boolean
  placeholder?: string
  disabled?: boolean
  options?: Array<{ label: string; value: string | number }>
  maxLength?: number
  precision?: number  // 数字精度
  rules?: Array<{ validator?: (value: unknown, formData: Record<string, unknown>) => boolean | string; message?: string }>
  render?: (value: unknown, onChange: (value: unknown) => void, field: FormField) => React.ReactNode
}

// 表单模态框属性
interface FormModalProps {
  visible: boolean
  title?: string
  mode?: 'create' | 'edit'
  fields: FormField[]
  initialValues?: Record<string, unknown>
  loading?: boolean
  confirmText?: string
  cancelText?: string
  onSubmit?: (values: Record<string, unknown>) => void | Promise<void>
  onCancel?: () => void
  onValuesChange?: (changedValues: Record<string, unknown>, allValues: Record<string, unknown>) => void
}

// 表单方法
export interface FormModalMethods {
  submit: () => void
  reset: () => void
  setFieldsValue: (values: Record<string, unknown>) => void
  getFieldsValue: () => Record<string, unknown>
}

const FormModal = forwardRef<FormModalMethods, FormModalProps>(({
  visible,
  title,
  mode = 'create',
  fields,
  initialValues = {},
  loading = false,
  confirmText = '确定',
  cancelText = '取消',
  onSubmit,
  onCancel,
  onValuesChange
}, ref) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({})
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showNumberKeyboard, setShowNumberKeyboard] = useState(false)
  const [currentNumberField, setCurrentNumberField] = useState('')
  const [showDatePicker, setShowDatePicker] = useState(false)
  const [currentDateField, setCurrentDateField] = useState('')

  // 初始化表单数据
  useEffect(() => {
    if (visible) {
      setFormData({ ...initialValues })
      setErrors({})
    }
  }, [visible, initialValues])

  // 暴露方法给父组件
  useImperativeHandle(ref, () => ({
    submit: handleSubmit,
    reset: handleReset,
    setFieldsValue: (values: Record<string, unknown>) => {
      setFormData(prev => ({ ...prev, ...values }))
    },
    getFieldsValue: () => formData
  }))

  // 字段值变化处理
  const handleFieldChange = (fieldName: string, value: unknown): void => {
    const newFormData = { ...formData, [fieldName]: value }
    setFormData(newFormData)
    
    // 清除该字段的错误
    if (errors[fieldName]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    }

    // 通知父组件值变化
    onValuesChange?.({ [fieldName]: value }, newFormData)
  }

  // 表单验证
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    fields.forEach(field => {
      const value = formData[field.name]
      
      // 必填验证
      if (field.required && (!value || value === '')) {
        newErrors[field.name] = `请输入${field.label}`
        return
      }

      // 数字验证
      if (field.type === 'number' && value && Number.isNaN(Number(value))) {
        newErrors[field.name] = `${field.label}必须为数字`
        return
      }

      // 最大长度验证
      if (field.maxLength && value && String(value).length > field.maxLength) {
        newErrors[field.name] = `${field.label}不能超过${field.maxLength}个字符`
        return
      }

      // 自定义规则验证
      if (field.rules) {
        for (const rule of field.rules) {
          if (rule.validator) {
            const result = rule.validator(value, formData)
            if (result !== true) {
              newErrors[field.name] = result || rule.message || `${field.label}格式错误`
              break
            }
          }
        }
      }
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // 提交处理
  const handleSubmit = async () => {
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit?.(formData)
    } catch (_error) {
      // console.error('表单提交错误:', _error)
    }
  }

  // 重置表单
  const handleReset = () => {
    setFormData({ ...initialValues })
    setErrors({})
  }

  // 取消处理
  const handleCancel = () => {
    handleReset()
    onCancel?.()
  }

  // 数字键盘处理
  const handleNumberInput = (event: React.FormEvent<HTMLDivElement>) => {
    const target = event.target as HTMLInputElement
    const value = target.value || ''
    if (currentNumberField) {
      handleFieldChange(currentNumberField, value)
    }
  }

  // 日期选择处理


  // 渲染字段
  const renderField = (field: FormField): React.ReactNode => {
    const value = String(formData[field.name] || '')

    // 自定义渲染
    if (field.render) {
      return field.render(value, (newValue) => handleFieldChange(field.name, newValue), field)
    }

    const fieldProps = {
      placeholder: field.placeholder || `请输入${field.label}`,
      disabled: field.disabled || false,
      clearable: true
    }

    const commonProps = {
      value,
      onInput: (e: { detail: { value: string } }) => handleFieldChange(field.name, e.detail.value),
      ...fieldProps
    }

    switch (field.type) {
    case 'input':
      return (
        <Input
          {...commonProps}
          maxLength={field.maxLength}
        />
      )

    case 'textarea':
      return (
        <TextArea
          {...commonProps}
          maxLength={field.maxLength}
          rows={3}
        />
      )

    case 'number':
      return (
        <View className='form-modal__number-input'>
          <Input
            value={value}
            placeholder={fieldProps.placeholder}
            disabled={fieldProps.disabled}
            clearable={fieldProps.clearable}
            readOnly
            onFocus={() => {
              setCurrentNumberField(field.name)
              setShowNumberKeyboard(true)
            }}
          />
        </View>
      )

    case 'select':
      return (
        <Picker
          options={[field.options || []]}
          value={[value]}
          onConfirm={(selectedOptions) => {
            const selectedValue = selectedOptions[0]?.[0]?.value
            handleFieldChange(field.name, selectedValue)
          }}
        >
          <Input
            {...fieldProps}
            value={field.options?.find(opt => opt.value === value)?.label || ''}
            readOnly
            placeholder={field.placeholder || `请选择${field.label}`}
          />
        </Picker>
      )

    case 'date':
      return (
        <View
          onClick={() => {
            setCurrentDateField(field.name)
            setShowDatePicker(true)
          }}
        >
          <Input
            value={value}
            placeholder={field.placeholder || `请选择${field.label}`}
            disabled={fieldProps.disabled}
            clearable={fieldProps.clearable}
            readOnly
          />
        </View>
      )

    default:
      return (
        <Input {...commonProps} />
      )
    }
  }

  return (
    <>
      <Popup
        visible={visible}
        position='bottom'
        round
        onClose={handleCancel}
        closeable
        closeIcon='close'
        style={{ height: '80vh' }}
      >
        <View className='form-modal'>
          {/* 标题栏 */}
          <View className='form-modal__header'>
            <View className='form-modal__title'>
              <Text>{title || (mode === 'create' ? '新增' : '编辑')}</Text>
            </View>
            <View className='form-modal__close' onClick={handleCancel}>
              <MaterialIcons name='close' size={24} color='#6b7280' />
            </View>
          </View>

          {/* 表单内容 */}
          <View className='form-modal__content'>
            <Form>
              {fields.map((field) => (
                <FormItem
                  key={field.name}
                  label={field.label}
                  required={field.required}
                >
                  {renderField(field)}
                </FormItem>
              ))}
            </Form>
          </View>

          {/* 操作按钮 */}
          <View className='form-modal__footer'>
            <Button
              className='form-modal__cancel-btn'
              onClick={handleCancel}
              disabled={loading}
            >
              {cancelText}
            </Button>
            <Button
              type='primary'
              className='form-modal__confirm-btn'
              onClick={handleSubmit}
              loading={loading}
            >
              {confirmText}
            </Button>
          </View>
        </View>
      </Popup>

      {/* 数字键盘 */}
      <NumberKeyboard
        visible={showNumberKeyboard}
        type='rightColumn'
        onInput={handleNumberInput}
        onClose={() => {
          setShowNumberKeyboard(false)
          setCurrentNumberField('')
        }}
      />

      {/* 日期选择器 */}
      <DatePicker
        visible={showDatePicker}
        title='选择日期'
        onConfirm={(_selectedOptions, selectedValue) => {
          if (selectedValue && selectedValue.length > 0) {
            const dateStr = selectedValue.join('-')
            if (currentDateField) {
              handleFieldChange(currentDateField, dateStr)
              setShowDatePicker(false)
              setCurrentDateField('')
            }
          }
        }}
        onClose={() => {
          setShowDatePicker(false)
          setCurrentDateField('')
        }}
      />
    </>
  )
})

FormModal.displayName = 'FormModal'

export default FormModal