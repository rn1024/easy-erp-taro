import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { Button, Dialog, Switch } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, Icon } from '@/components/common'

import './index.scss'

interface SecuritySettings {
  twoFactorEnabled: boolean
  loginNotifications: boolean
  deviceManagement: boolean
  autoLock: boolean
  biometricLogin: boolean
}

interface LoginDevice {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  location: string
  lastActive: string
  isCurrent: boolean
}

const Security: React.FC = () => {
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
    autoLock: true,
    biometricLogin: false
  })

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [loginDevices] = useState<LoginDevice[]>([
    {
      id: '1',
      name: 'iPhone 12 Pro',
      type: 'mobile',
      location: '北京市',
      lastActive: '2025-06-22T10:30:00',
      isCurrent: true
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      location: '北京市',
      lastActive: '2025-06-21T16:45:00',
      isCurrent: false
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      location: '上海市',
      lastActive: '2025-06-20T09:15:00',
      isCurrent: false
    }
  ])

  const handleSettingChange = async (key: keyof SecuritySettings, value: boolean) => {
    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 500))
      setSettings(prev => ({ ...prev, [key]: value }))
      Taro.showToast({ title: '安全设置已更新', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '设置更新失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordChange = async () => {
    // 表单验证
    if (!passwordData.currentPassword) {
      Taro.showToast({ title: '请输入当前密码', icon: 'error' })
      return
    }
    
    if (!passwordData.newPassword) {
      Taro.showToast({ title: '请输入新密码', icon: 'error' })
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Taro.showToast({ title: '新密码与确认密码不匹配', icon: 'error' })
      return
    }
    
    if (passwordData.newPassword.length < 8) {
      Taro.showToast({ title: '密码长度至少8位', icon: 'error' })
      return
    }

    // 密码强度验证
    const hasUpperCase = /[A-Z]/.test(passwordData.newPassword)
    const hasLowerCase = /[a-z]/.test(passwordData.newPassword)
    const hasNumber = /\d/.test(passwordData.newPassword)
    
    if (!hasUpperCase || !hasLowerCase || !hasNumber) {
      Taro.showToast({ title: '密码须包含大小写字母和数字', icon: 'error' })
      return
    }

    setLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      Taro.showToast({ title: '密码修改成功', icon: 'success' })
      setShowPasswordDialog(false)
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
    } catch (error) {
      Taro.showToast({ title: '密码修改失败', icon: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleDeviceRemove = (_deviceId: string) => {
    Taro.showModal({
      title: '确认移除设备',
      content: '移除后该设备将无法访问您的账户',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '设备已移除', icon: 'success' })
        }
      }
    })
  }

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))

    if (diffInHours < 1) return '刚刚活跃'
    if (diffInHours < 24) return `${diffInHours}小时前`
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}天前`
  }

  const getDeviceIcon = (type: string) => {
    switch (type) {
    case 'mobile':
      return 'smartphone'
    case 'desktop':
      return 'shield'
    case 'tablet':
      return 'shield'
    default:
      return 'shield'
    }
  }

  const handleBackClick = () => {
    Taro.navigateBack()
  }

  const handlePasswordUpdate = (field: string, value: string) => {
    setPasswordData(prev => ({ ...prev, [field]: value }))
  }


  return (
    <MobileLayout className='security-page'>
      {/* 顶部导航 */}
      <View className='security-page__header'>
        <View className='security-page__header-content'>
          <View className='security-page__back-button' onClick={handleBackClick}>
            <Icon name='arrow_back' size={16} color='#374151' />
          </View>
          <Text className='security-page__title'>安全设置</Text>
        </View>
      </View>

      <View className='security-page__content'>
        {/* 密码管理 */}
        <SectionCard className='security-page__password-section'>
          <View className='security-page__section-header'>
            <View className='security-page__section-title-row'>
              <Icon name='lock' size={16} color='#374151' />
              <Text className='security-page__section-title'>密码管理</Text>
            </View>
          </View>
          <View className='security-page__password-content'>
            <View className='security-page__password-info'>
              <Text className='security-page__password-title'>登录密码</Text>
              <Text className='security-page__password-desc'>上次修改: 2025年5月15日</Text>
            </View>
            <Button
              className='security-page__change-password-button'
              size='small'
              type='default'
              onClick={() => setShowPasswordDialog(true)}
            >
              修改密码
            </Button>
          </View>
        </SectionCard>

        {/* 安全验证 */}
        <SectionCard className='security-page__verification-section'>
          <View className='security-page__section-header'>
            <View className='security-page__section-title-row'>
              <Icon name='key' size={16} color='#374151' />
              <Text className='security-page__section-title'>安全验证</Text>
            </View>
          </View>
          <View className='security-page__verification-list'>
            <View className='security-page__verification-item'>
              <View className='security-page__verification-info'>
                <Text className='security-page__verification-title'>双重验证</Text>
                <Text className='security-page__verification-desc'>通过手机验证码验证身份</Text>
              </View>
              <Switch
                checked={settings.twoFactorEnabled}
                disabled={loading}
                onChange={(value) => handleSettingChange('twoFactorEnabled', value)}
              />
            </View>
            
            <View className='security-page__verification-item'>
              <View className='security-page__verification-info'>
                <Text className='security-page__verification-title'>生物识别登录</Text>
                <Text className='security-page__verification-desc'>使用指纹或面部识别</Text>
              </View>
              <Switch
                checked={settings.biometricLogin}
                disabled={loading}
                onChange={(value) => handleSettingChange('biometricLogin', value)}
              />
            </View>
          </View>
        </SectionCard>

        {/* 安全通知 */}
        <SectionCard className='security-page__notification-section'>
          <View className='security-page__section-header'>
            <View className='security-page__section-title-row'>
              <Icon name='warning' size={16} color='#374151' />
              <Text className='security-page__section-title'>安全通知</Text>
            </View>
          </View>
          <View className='security-page__notification-list'>
            <View className='security-page__notification-item'>
              <View className='security-page__notification-info'>
                <Text className='security-page__notification-title'>登录通知</Text>
                <Text className='security-page__notification-desc'>新设备登录时通知</Text>
              </View>
              <Switch
                checked={settings.loginNotifications}
                disabled={loading}
                onChange={(value) => handleSettingChange('loginNotifications', value)}
              />
            </View>
            
            <View className='security-page__notification-item'>
              <View className='security-page__notification-info'>
                <Text className='security-page__notification-title'>设备管理通知</Text>
                <Text className='security-page__notification-desc'>设备变更时通知</Text>
              </View>
              <Switch
                checked={settings.deviceManagement}
                disabled={loading}
                onChange={(value) => handleSettingChange('deviceManagement', value)}
              />
            </View>
            
            <View className='security-page__notification-item'>
              <View className='security-page__notification-info'>
                <Text className='security-page__notification-title'>自动锁定</Text>
                <Text className='security-page__notification-desc'>长时间无操作自动锁定</Text>
              </View>
              <Switch
                checked={settings.autoLock}
                disabled={loading}
                onChange={(value) => handleSettingChange('autoLock', value)}
              />
            </View>
          </View>
        </SectionCard>

        {/* 登录设备 */}
        <SectionCard className='security-page__devices-section'>
          <View className='security-page__section-header'>
            <View className='security-page__section-title-row'>
              <Icon name='smartphone' size={16} color='#374151' />
              <Text className='security-page__section-title'>登录设备</Text>
            </View>
          </View>
          <View className='security-page__devices-list'>
            {loginDevices.map((device) => (
              <View key={device.id} className='security-page__device-item'>
                <View className='security-page__device-info'>
                  <View className='security-page__device-icon'>
                    <Icon name={getDeviceIcon(device.type)} size={16} color='#6b7280' />
                  </View>
                  <View className='security-page__device-details'>
                    <View className='security-page__device-name-row'>
                      <Text className='security-page__device-name'>{device.name}</Text>
                      {device.isCurrent && (
                        <Text className='security-page__current-device'>当前设备</Text>
                      )}
                    </View>
                    <Text className='security-page__device-location'>
                      {device.location} • {formatLastActive(device.lastActive)}
                    </Text>
                  </View>
                </View>
                {!device.isCurrent && (
                  <Button
                    className='security-page__remove-device-button'
                    size='small'
                    type='default'
                    onClick={() => handleDeviceRemove(device.id)}
                  >
                    移除
                  </Button>
                )}
              </View>
            ))}
          </View>
        </SectionCard>
      </View>

      {/* 修改密码弹窗 */}
      <Dialog
        visible={showPasswordDialog}
        title='修改密码'
        onCancel={() => setShowPasswordDialog(false)}
        onConfirm={handlePasswordChange}
        className='security-page__password-dialog'
      >
        <View className='security-page__password-form'>
          <View className='security-page__form-item'>
            <Text className='security-page__form-label'>当前密码</Text>
            <View className='security-page__password-input'>
              <Input
                className='security-page__form-input'
                type={showCurrentPassword ? 'text' : 'password'}
                value={passwordData.currentPassword}
                onInput={(e) => handlePasswordUpdate('currentPassword', e.detail.value)}
                placeholder='请输入当前密码'
              />
              <View
                className='security-page__password-toggle'
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
              >
                <Icon name={showCurrentPassword ? 'eye_off' : 'eye'} size={16} color='#6b7280' />
              </View>
            </View>
          </View>
          
          <View className='security-page__form-item'>
            <Text className='security-page__form-label'>新密码</Text>
            <View className='security-page__password-input'>
              <Input
                className='security-page__form-input'
                type={showNewPassword ? 'text' : 'password'}
                value={passwordData.newPassword}
                onInput={(e) => handlePasswordUpdate('newPassword', e.detail.value)}
                placeholder='请输入新密码（至少8位）'
              />
              <View
                className='security-page__password-toggle'
                onClick={() => setShowNewPassword(!showNewPassword)}
              >
                <Icon name={showNewPassword ? 'eye_off' : 'eye'} size={16} color='#6b7280' />
              </View>
            </View>
          </View>
          
          <View className='security-page__form-item'>
            <Text className='security-page__form-label'>确认新密码</Text>
            <View className='security-page__password-input'>
              <Input
                className='security-page__form-input'
                type={showConfirmPassword ? 'text' : 'password'}
                value={passwordData.confirmPassword}
                onInput={(e) => handlePasswordUpdate('confirmPassword', e.detail.value)}
                placeholder='请再次输入新密码'
              />
              <View
                className='security-page__password-toggle'
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <Icon name={showConfirmPassword ? 'eye_off' : 'eye'} size={16} color='#6b7280' />
              </View>
            </View>
          </View>
        </View>
      </Dialog>
    </MobileLayout>
  )
}

export default Security