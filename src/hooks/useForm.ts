import { useState, useCallback } from 'react'
import Taro from '@tarojs/taro'

interface FormField {
  value: any
  error?: string
  touched?: boolean
}

interface FormState {
  [key: string]: FormField
}

interface ValidationRule {
  required?: boolean
  minLength?: number
  maxLength?: number
  pattern?: RegExp
  custom?: (value: any, formState: FormState) => string | undefined
  message?: string
}

interface ValidationRules {
  [key: string]: ValidationRule | ValidationRule[]
}

interface UseFormOptions<T> {
  initialValues: T
  validationRules?: ValidationRules
  onSubmit?: (values: T) => void | Promise<void>
}

/**
 * 通用表单管理Hook
 * 提供表单状态管理、验证、提交等功能
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validationRules = {},
  onSubmit
}: UseFormOptions<T>) {
  // 初始化表单状态
  const initFormState = (): FormState => {
    const state: FormState = {}
    Object.keys(initialValues).forEach(key => {
      state[key] = {
        value: initialValues[key],
        error: undefined,
        touched: false
      }
    })
    return state
  }

  const [formState, setFormState] = useState<FormState>(initFormState())
  const [isSubmitting, setIsSubmitting] = useState(false)

  // 验证单个字段
  const validateField = useCallback((name: string, value: any): string | undefined => {
    const rules = validationRules[name]
    if (!rules) return undefined

    const rulesArray = Array.isArray(rules) ? rules : [rules]

    for (const rule of rulesArray) {
      if (rule.required && !value) {
        return rule.message || '此字段为必填项'
      }

      if (rule.minLength && value && value.length < rule.minLength) {
        return rule.message || `最少需要${rule.minLength}个字符`
      }

      if (rule.maxLength && value && value.length > rule.maxLength) {
        return rule.message || `最多允许${rule.maxLength}个字符`
      }

      if (rule.pattern && value && !rule.pattern.test(value)) {
        return rule.message || '格式不正确'
      }

      if (rule.custom) {
        const error = rule.custom(value, formState)
        if (error) return error
      }
    }

    return undefined
  }, [validationRules, formState])

  // 设置字段值
  const setValue = useCallback((name: string, value: any) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        value,
        error: validateField(name, value),
        touched: true
      }
    }))
  }, [validateField])

  // 设置多个字段值
  const setValues = useCallback((values: Partial<T>) => {
    setFormState(prev => {
      const newState = { ...prev }
      Object.entries(values).forEach(([key, value]) => {
        newState[key] = {
          ...newState[key],
          value,
          error: validateField(key, value),
          touched: true
        }
      })
      return newState
    })
  }, [validateField])

  // 设置字段错误
  const setError = useCallback((name: string, error: string) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        error
      }
    }))
  }, [])

  // 设置字段触摸状态
  const setTouched = useCallback((name: string, touched = true) => {
    setFormState(prev => ({
      ...prev,
      [name]: {
        ...prev[name],
        touched
      }
    }))
  }, [])

  // 验证所有字段
  const validateAll = useCallback((): boolean => {
    let isValid = true
    const newState = { ...formState }

    Object.keys(formState).forEach(key => {
      const error = validateField(key, formState[key].value)
      if (error) {
        isValid = false
        newState[key] = {
          ...newState[key],
          error,
          touched: true
        }
      }
    })

    setFormState(newState)
    return isValid
  }, [formState, validateField])

  // 重置表单
  const reset = useCallback(() => {
    setFormState(initFormState())
  }, [initialValues])

  // 获取表单值
  const getValues = useCallback((): T => {
    const values: any = {}
    Object.keys(formState).forEach(key => {
      values[key] = formState[key].value
    })
    return values as T
  }, [formState])

  // 提交表单
  const handleSubmit = useCallback(async () => {
    if (!validateAll()) {
      Taro.showToast({
        title: '请检查表单填写',
        icon: 'none'
      })
      return
    }

    if (!onSubmit) return

    setIsSubmitting(true)
    try {
      await onSubmit(getValues())
    } catch (error) {
      console.error('Form submission error:', error)
      Taro.showToast({
        title: '提交失败',
        icon: 'error'
      })
    } finally {
      setIsSubmitting(false)
    }
  }, [validateAll, onSubmit, getValues])

  // 检查表单是否有效
  const isValid = Object.values(formState).every(field => !field.error)

  // 检查表单是否被修改
  const isDirty = Object.entries(formState).some(
    ([key, field]) => field.value !== initialValues[key]
  )

  return {
    formState,
    setValue,
    setValues,
    setError,
    setTouched,
    validateField,
    validateAll,
    reset,
    getValues,
    handleSubmit,
    isSubmitting,
    isValid,
    isDirty
  }
}
