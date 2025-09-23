import React, { useState, useEffect } from 'react'
import { View, Text } from '@tarojs/components'
import { Form, Input, Button, Toast } from '@nutui/nutui-react-taro'
import Taro from '@tarojs/taro'
import { useUserStore } from '@/stores/userStore'
import { FormItem, Card, Icon } from '@/components/common'
import type { LoginForm } from '@/types/admin'
import useResponsive from '@/hooks/useResponsive'
import './index.scss'

const LoginPage: React.FC = () => {
  const { login, loading, error, isLoggedIn } = useUserStore()
  const responsive = useResponsive()
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
      // 登录失败: err
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

  const pageClass = [
    'login-page',
    responsive.isCompact ? 'login-page--compact' : '',
    responsive.isMedium ? 'login-page--medium' : '',
    responsive.isShort ? 'login-page--short' : '',
    responsive.isLandscape ? 'login-page--landscape' : ''
  ].filter(Boolean).join(' ')

  return (
    <View className={pageClass}>
      <View className='login-container'>
        {/* Logo区域 */}
        <View className='login-header'>
          <View className='login-logo'>
            <View className='login-logo-icon'>ERP</View>
          </View>
          <Text className='login-title'>Easy ERP</Text>
          <Text className='login-subtitle'>企业资源管理系统</Text>
        </View>

        {/* 登录表单卡片 */}
        <Card className='login-card' shadow='md' noPadding>
          <View className='login-form'>
            <Form>
              <FormItem 
                error={formErrors.username}
                layout='vertical'
              >
                <View className='login-input-wrapper'>
                  <Icon name='person' size={20} className='login-input-icon' />
                  <Input
                    className='login-input'
                    placeholder='请输入用户名'
                    value={formData.username}
                    onChange={(value) => handleInputChange('username', value)}
                    maxLength={20}
                    clearable
                  />
                </View>
              </FormItem>

              <FormItem 
                error={formErrors.password}
                layout='vertical'
              >
                <View className='login-input-wrapper'>
                  <Icon name='lock' size={20} className='login-input-icon' />
                  <Input
                    className='login-input'
                    type={showPassword ? 'text' : 'password'}
                    placeholder='请输入密码'
                    value={formData.password}
                    onChange={(value) => handleInputChange('password', value)}
                    maxLength={20}
                  />
                  <View 
                    className='login-password-toggle touch-target'
                    onClick={togglePasswordVisibility}
                  >
                    <Icon name={showPassword ? 'eye-hide' : 'eye'} size={20} />
                  </View>
                </View>
              </FormItem>
            </Form>

            {/* 登录按钮 */}
            <Button
              className='login-btn'
              type='primary'
              size='large'
              loading={loading}
              onClick={handleLogin}
              disabled={loading}
              block
            >
              {loading ? '登录中...' : '登录'}
            </Button>

            {/* 快速登录 */}
            <View className='login-quick'>
              <Text className='login-quick-label'>快速体验</Text>
              <View className='login-quick-buttons'>
                <Button
                  className='login-quick-btn'
                  fill='outline'
                  size='small'
                  onClick={() => quickLogin('admin')}
                  disabled={loading}
                >
                  管理员
                </Button>
                <Button
                  className='login-quick-btn'
                  fill='outline'
                  size='small'
                  onClick={() => quickLogin('operator')}
                  disabled={loading}
                >
                  操作员
                </Button>
              </View>
            </View>
          </View>
        </Card>

        {/* 页脚信息 */}
        <View className='login-footer'>
          <Text className='login-footer-text'>
            © 2024 Easy ERP 仓库管理系统
          </Text>
          <Text className='login-footer-version'>v1.0.0</Text>
        </View>
      </View>

      {/* 错误提示Toast */}
      {error && (
        <Toast
          visible={!!error}
          msg={error}
          type='fail'
          onClose={() => useUserStore.getState().clearError()}
        />
      )}
    </View>
  )
}

export default LoginPage
