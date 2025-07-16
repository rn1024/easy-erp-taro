import React, { useState, useEffect } from 'react'
import { View, Text, Image } from '@tarojs/components'
import { Form, FormItem, Input, Button, Toast } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/stores/userStore'
import MobileLayout from '@/components/MobileLayout'
import type { LoginForm } from '@/types/admin'
import './index.scss'

const LoginPage: React.FC = () => {
  const { login, loading, error, isLoggedIn } = useUserStore()
  const [formData, setFormData] = useState<LoginForm>({
    username: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{
    username?: string
    password?: string
  }>({})

  // 如果已登录，跳转到首页
  useEffect(() => {
    if (isLoggedIn) {
      Taro.reLaunch({
        url: '/pages/index/index'
      })
    }
  }, [isLoggedIn])

  // 表单验证
  const validateForm = (): boolean => {
    const errors: typeof formErrors = {}
    
    if (!formData.username.trim()) {
      errors.username = '请输入用户名'
    }
    
    if (!formData.password) {
      errors.password = '请输入密码'
    } else if (formData.password.length < 6) {
      errors.password = '密码至少6位'
    }
    
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // 处理表单输入
  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // 清除对应字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  // 处理登录
  const handleLogin = async () => {
    if (!validateForm()) {
      return
    }

    try {
      await login(formData)
      // 登录成功会触发useEffect跳转
    } catch (err) {
      // 错误已经在userStore中处理
      console.error('登录失败:', err)
    }
  }

  // 切换密码显示
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  // 快速登录（演示用）
  const quickLogin = (type: 'admin' | 'operator') => {
    const credentials = {
      admin: { username: 'admin', password: '123456' },
      operator: { username: 'operator', password: '123456' }
    }
    
    setFormData(credentials[type])
  }

  return (
    <MobileLayout 
      title="用户登录"
      showBack={false}
      showLoading={loading}
      loadingText="登录中..."
    >
      <View className="login-page">
        {/* Logo区域 */}
        <View className="login-page__header">
          <View className="login-page__logo">
            <MaterialIcons name="inventory" size={64} color="#3b82f6" />
          </View>
          <Text className="login-page__title">Easy ERP</Text>
          <Text className="login-page__subtitle">仓库管理系统</Text>
        </View>

        {/* 登录表单 */}
        <View className="login-page__form">
          <Form>
            <FormItem 
              label=""
              className={`login-page__form-item ${formErrors.username ? 'login-page__form-item--error' : ''}`}
            >
              <View className="login-page__input-wrapper">
                <MaterialIcons name="person" size={20} color="#9ca3af" />
                <Input
                  className="login-page__input"
                  placeholder="请输入用户名"
                  value={formData.username}
                  onChange={(value) => handleInputChange('username', value)}
                  maxLength={20}
                  clearable
                />
              </View>
              {formErrors.username && (
                <Text className="login-page__error-text">{formErrors.username}</Text>
              )}
            </FormItem>

            <FormItem 
              label=""
              className={`login-page__form-item ${formErrors.password ? 'login-page__form-item--error' : ''}`}
            >
              <View className="login-page__input-wrapper">
                <MaterialIcons name="lock" size={20} color="#9ca3af" />
                <Input
                  className="login-page__input"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="请输入密码"
                  value={formData.password}
                  onChange={(value) => handleInputChange('password', value)}
                  maxLength={20}
                />
                <View 
                  className="login-page__password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  <MaterialIcons 
                    name={showPassword ? 'visibility_off' : 'visibility'} 
                    size={20} 
                    color="#9ca3af" 
                  />
                </View>
              </View>
              {formErrors.password && (
                <Text className="login-page__error-text">{formErrors.password}</Text>
              )}
            </FormItem>
          </Form>

          {/* 错误提示 */}
          {error && (
            <View className="login-page__error-banner">
              <MaterialIcons name="error" size={16} color="#ef4444" />
              <Text className="login-page__error-banner-text">{error}</Text>
            </View>
          )}

          {/* 登录按钮 */}
          <Button
            className="login-page__login-btn"
            type="primary"
            size="large"
            loading={loading}
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? '登录中...' : '登录'}
          </Button>

          {/* 快速登录 */}
          <View className="login-page__quick-login">
            <Text className="login-page__quick-login-label">演示账号:</Text>
            <View className="login-page__quick-login-buttons">
              <Button
                className="login-page__quick-btn"
                size="small"
                onClick={() => quickLogin('admin')}
                disabled={loading}
              >
                管理员登录
              </Button>
              <Button
                className="login-page__quick-btn"
                size="small"
                onClick={() => quickLogin('operator')}
                disabled={loading}
              >
                操作员登录
              </Button>
            </View>
          </View>
        </View>

        {/* 页脚信息 */}
        <View className="login-page__footer">
          <Text className="login-page__footer-text">
            Easy ERP © 2024 仓库管理系统
          </Text>
          <Text className="login-page__footer-version">
            版本 v1.0.0
          </Text>
        </View>
      </View>
    </MobileLayout>
  )
}

export default LoginPage 