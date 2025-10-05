import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { Button, Loading } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import { Icon } from '@/components/common'

/**
 * Hooks
 */
import { useUserStore } from '@/stores/userStore'

/**
 * Types
 */
import type { LoginForm } from '@/types/admin'

import './index.scss'

const LoginPage: React.FC = () => {
  /**
   * Hooks
   */
  const { login, loading, error, isLoggedIn } = useUserStore()

  /**
   * States
   */
  const [formData, setFormData] = useState<LoginForm>({ username: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [formErrors, setFormErrors] = useState<{ username?: string; password?: string }>({})

  /**
   * Effects
   */
  useEffect(() => {
    if (isLoggedIn) {
      Taro.reLaunch({ url: '/pages/index/index' })
    }
  }, [isLoggedIn])

  /**
   * Event Handlers
   */
  const validateForm = () => {
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

  const handleInputChange = (field: keyof LoginForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }))
    }
  }

  const handleLogin = async () => {
    if (!validateForm()) return
    try {
      await login(formData)
    } catch (_error) {
      // 错误处理已在 store 中完成
    }
  }

  /**
   * Computed Values
   */
  const isFormValid = formData.username.trim() && formData.password.trim()

  return (
    <View className='login-page'>
      {/* 安全区域适配 */}
      <View className='login-page__safe-area' />
      
      {/* 主要内容 */}
      <View className='login-page__container'>
        {/* 页面标题 */}
        <View className='login-page__header'>
          <View className='login-page__logo'>
            <Icon name='business' size={24} color='#ffffff' />
          </View>
          <Text className='login-page__title'>Easy ERP</Text>
          <Text className='login-page__subtitle'>账号登录</Text>
        </View>

        {/* 登录表单 */}
        <View className='login-page__form'>
          {/* 用户名输入 */}
          <View className='login-page__input-group'>
            <Input
              className='login-page__input'
              value={formData.username}
              onInput={(e) => handleInputChange('username', e.detail.value)}
              placeholder='请输入用户名/手机号'
              disabled={loading}
            />
          </View>
          {formErrors.username && (
            <Text className='login-page__error'>{formErrors.username}</Text>
          )}

          {/* 密码输入 */}
          <View className='login-page__input-group'>
            <Input
              className='login-page__input'
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onInput={(e) => handleInputChange('password', e.detail.value)}
              placeholder='请输入密码'
              disabled={loading}
            />
            <View
              className='login-page__toggle'
              onClick={() => setShowPassword(!showPassword)}
            >
              <Icon name={showPassword ? 'visibility_off' : 'visibility'} size={20} color='#6b7280' />
            </View>
          </View>
          {formErrors.password && (
            <Text className='login-page__error'>{formErrors.password}</Text>
          )}

          {/* 通用错误 */}
          {error && (
            <Text className='login-page__error'>{error}</Text>
          )}

          {/* 登录按钮 */}
          <View className='login-page__submit-wrapper'>
            <Button
              className='login-page__submit'
              type='primary'
              size='large'
              disabled={!isFormValid || loading}
              onClick={handleLogin}
            >
              {loading ? (
                <View className='login-page__loading'>
                  <Loading type='spinner' size='16' />
                  <Text className='login-page__loading-text'>登录中...</Text>
                </View>
              ) : (
                <View className='login-page__submit-content'>
                  <Text>登录</Text>
                  <Icon name='arrow_forward' size={16} color='#ffffff' />
                </View>
              )}
            </Button>
          </View>

          {/* 辅助链接 */}
          <View className='login-page__links'>
            <Text className='login-page__link'>忘记密码？</Text>
            <Text className='login-page__link'>联系管理员</Text>
          </View>
        </View>
      </View>
    </View>
  )
}

export default LoginPage