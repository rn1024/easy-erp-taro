// 验证规则类型
export interface ValidationRule {
  required?: boolean
  pattern?: RegExp
  min?: number
  max?: number
  minLength?: number
  maxLength?: number
  custom?: (value: any) => boolean | string
  message?: string
}

// 验证结果
export interface ValidationResult {
  valid: boolean
  error?: string
}

// 常用正则表达式
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^1[3-9]\d{9}$/,
  url: /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/,
  idCard: /^[1-9]\d{5}(18|19|20)\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{3}[\dXx]$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/,
  number: /^\d+$/,
  decimal: /^\d+(\.\d+)?$/,
  chinese: /^[\u4e00-\u9fa5]+$/,
  alphanumeric: /^[a-zA-Z0-9]+$/
}

// 验证器类
export class Validator {
  private rules: Map<string, ValidationRule[]> = new Map()

  // 添加验证规则
  addRule(field: string, rule: ValidationRule): this {
    const existingRules = this.rules.get(field) || []
    this.rules.set(field, [...existingRules, rule])
    return this
  }

  // 批量添加规则
  addRules(rules: Record<string, ValidationRule[]>): this {
    Object.entries(rules).forEach(([field, fieldRules]) => {
      this.rules.set(field, fieldRules)
    })
    return this
  }

  // 验证单个字段
  validateField(field: string, value: any): ValidationResult {
    const rules = this.rules.get(field) || []

    for (const rule of rules) {
      const result = this.validateRule(value, rule)
      if (!result.valid) {
        return result
      }
    }

    return { valid: true }
  }

  // 验证所有字段
  validate(data: Record<string, any>): Record<string, string> {
    const errors: Record<string, string> = {}

    this.rules.forEach((rules, field) => {
      const value = data[field]
      const result = this.validateField(field, value)

      if (!result.valid && result.error) {
        errors[field] = result.error
      }
    })

    return errors
  }

  // 验证单个规则
  private validateRule(value: any, rule: ValidationRule): ValidationResult {
    // 必填验证
    if (rule.required && !value) {
      return {
        valid: false,
        error: rule.message || '此字段为必填项'
      }
    }

    // 如果值为空且非必填，跳过其他验证
    if (!value && !rule.required) {
      return { valid: true }
    }

    // 正则验证
    if (rule.pattern && !rule.pattern.test(String(value))) {
      return {
        valid: false,
        error: rule.message || '格式不正确'
      }
    }

    // 最小值验证
    if (rule.min !== undefined && Number(value) < rule.min) {
      return {
        valid: false,
        error: rule.message || `值不能小于${rule.min}`
      }
    }

    // 最大值验证
    if (rule.max !== undefined && Number(value) > rule.max) {
      return {
        valid: false,
        error: rule.message || `值不能大于${rule.max}`
      }
    }

    // 最小长度验证
    if (rule.minLength !== undefined && String(value).length < rule.minLength) {
      return {
        valid: false,
        error: rule.message || `长度不能少于${rule.minLength}个字符`
      }
    }

    // 最大长度验证
    if (rule.maxLength !== undefined && String(value).length > rule.maxLength) {
      return {
        valid: false,
        error: rule.message || `长度不能超过${rule.maxLength}个字符`
      }
    }

    // 自定义验证
    if (rule.custom) {
      const result = rule.custom(value)
      if (typeof result === 'string') {
        return { valid: false, error: result }
      }
      if (!result) {
        return { valid: false, error: rule.message || '验证失败' }
      }
    }

    return { valid: true }
  }

  // 清除规则
  clearRules(): void {
    this.rules.clear()
  }

  // 移除字段规则
  removeFieldRules(field: string): void {
    this.rules.delete(field)
  }
}

// 预设验证器
export const validators = {
  // 邮箱验证器
  email: (message?: string): ValidationRule => ({
    pattern: patterns.email,
    message: message || '请输入有效的邮箱地址'
  }),

  // 手机号验证器
  phone: (message?: string): ValidationRule => ({
    pattern: patterns.phone,
    message: message || '请输入有效的手机号码'
  }),

  // URL验证器
  url: (message?: string): ValidationRule => ({
    pattern: patterns.url,
    message: message || '请输入有效的URL地址'
  }),

  // 必填验证器
  required: (message?: string): ValidationRule => ({
    required: true,
    message: message || '此字段为必填项'
  }),

  // 长度范围验证器
  length: (min: number, max: number, message?: string): ValidationRule => ({
    minLength: min,
    maxLength: max,
    message: message || `长度应在${min}-${max}个字符之间`
  }),

  // 数值范围验证器
  range: (min: number, max: number, message?: string): ValidationRule => ({
    min,
    max,
    message: message || `值应在${min}-${max}之间`
  }),

  // 密码强度验证器
  password: (message?: string): ValidationRule => ({
    pattern: patterns.password,
    message: message || '密码至少8位，包含大小写字母和数字'
  }),

  // 确认密码验证器
  confirmPassword: (password: string, message?: string): ValidationRule => ({
    custom: (value) => value === password,
    message: message || '两次输入的密码不一致'
  })
}

// 创建验证器实例的工厂函数
export const createValidator = (rules?: Record<string, ValidationRule[]>): Validator => {
  const validator = new Validator()
  if (rules) {
    validator.addRules(rules)
  }
  return validator
}
