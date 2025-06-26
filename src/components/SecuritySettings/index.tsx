import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
  Cell,
  CellGroup,
  Switch,
  Button,
  Dialog,
  Input,
  Toast,
  Badge
} from '@nutui/nutui-react-taro'
import {
  ArrowLeft,
  Phone as Smartphone,
  Eye,
  Warning
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { cn } from '../../utils/cn'
import './index.scss'

interface SecuritySettingsProps {
  onBack?: () => void
  className?: string
}

interface SecurityConfig {
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

/**
 * 安全设置组件
 * 管理账户安全相关设置
 */
const SecuritySettings: React.FC<SecuritySettingsProps> = ({
  onBack,
  className
}) => {
  const [settings, setSettings] = useState<SecurityConfig>({
    twoFactorEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
    autoLock: true,
    biometricLogin: false
  })

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [showPassword, setShowPassword] = useState({
    current: false,
    new: false,
    confirm: false
  })

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

  const handleSettingChange = (key: keyof SecurityConfig, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }))
    Toast.show('安全设置已更新')
  }

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Toast.show('新密码与确认密码不匹配')
      return
    }

    if (passwordData.newPassword.length < 8) {
      Toast.show('密码长度至少8位')
      return
    }

    // 这里可以添加密码修改的API调用
    Toast.show('密码修改成功')
    setShowPasswordDialog(false)
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleDeviceRemove = (deviceId: string) => {
    Taro.showModal({
      title: '确认移除',
      content: '确定要移除该设备吗？',
      success: (res) => {
        if (res.confirm) {
          Toast.show('设备已移除')
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

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className={cn('security-settings', className)}>
      {/* 顶部导航 */}
      <View className="nav-header">
        <View className="nav-content">
          <View className="nav-left" onClick={handleBack}>
            <ArrowLeft size="20" />
            <Text className="nav-title">安全设置</Text>
          </View>
        </View>
      </View>

      <View className="settings-content">
        {/* 密码管理 */}
        <CellGroup title="密码管理" className="settings-group">
          <Cell
            title="登录密码"
            description="上次修改: 2025年5月15日"
            extra={
              <Button
                type="primary"
                size="small"
                onClick={() => setShowPasswordDialog(true)}
              >
                修改密码
              </Button>
            }
            align="center"
          />
        </CellGroup>

        {/* 安全验证 */}
        <CellGroup title="安全验证" className="settings-group">
          <Cell
            title="双重验证"
            subTitle="通过手机验证码验证身份"
            extra={
              <Switch
                checked={settings.twoFactorEnabled}
                onChange={(checked) => handleSettingChange('twoFactorEnabled', checked)}
              />
            }
            align="center"
          />
          <Cell
            title="生物识别登录"
            subTitle="使用指纹或面部识别"
            extra={
              <Switch
                checked={settings.biometricLogin}
                onChange={(checked) => handleSettingChange('biometricLogin', checked)}
              />
            }
            align="center"
          />
        </CellGroup>

        {/* 安全通知 */}
        <CellGroup title="安全通知" className="settings-group">
          <Cell
            title="登录通知"
            subTitle="新设备登录时通知"
            extra={
              <Switch
                checked={settings.loginNotifications}
                onChange={(checked) => handleSettingChange('loginNotifications', checked)}
              />
            }
            align="center"
          />
          <Cell
            title="设备管理通知"
            subTitle="设备变更时通知"
            extra={
              <Switch
                checked={settings.deviceManagement}
                onChange={(checked) => handleSettingChange('deviceManagement', checked)}
              />
            }
            align="center"
          />
          <Cell
            title="自动锁定"
            subTitle="长时间无操作自动锁定"
            extra={
              <Switch
                checked={settings.autoLock}
                onChange={(checked) => handleSettingChange('autoLock', checked)}
              />
            }
            align="center"
          />
        </CellGroup>

        {/* 登录设备 */}
        <CellGroup title="登录设备" className="settings-group">
          {loginDevices.map((device) => (
            <View key={device.id} className="device-item">
              <View className="device-icon">
                <Smartphone size="20" />
              </View>
              <View className="device-info">
                <View className="device-header">
                  <Text className="device-name">{device.name}</Text>
                  {device.isCurrent && (
                    <Badge value="当前设备" />
                  )}
                </View>
                <Text className="device-meta">
                  {device.location} • {formatLastActive(device.lastActive)}
                </Text>
              </View>
              {!device.isCurrent && (
                <Button
                  type="danger"
                  size="small"
                  plain
                  onClick={() => handleDeviceRemove(device.id)}
                >
                  移除
                </Button>
              )}
            </View>
          ))}
        </CellGroup>
      </View>

      {/* 修改密码弹窗 */}
      <Dialog
        visible={showPasswordDialog}
        title="修改密码"
        onCancel={() => setShowPasswordDialog(false)}
        onOk={handlePasswordChange}
        okText="确认修改"
        cancelText="取消"
      >
        <View className="password-form">
          <View className="form-item">
            <Text className="form-label">当前密码</Text>
            <View className="input-wrapper">
              <Input
                type={showPassword.current ? "text" : "password"}
                value={passwordData.currentPassword}
                placeholder="请输入当前密码"
                onChange={(val) => setPasswordData(prev => ({
                  ...prev,
                  currentPassword: val
                }))}
              />
              <View
                className="eye-icon"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  current: !prev.current
                }))}
              >
                <Eye size="18" />
              </View>
            </View>
          </View>

          <View className="form-item">
            <Text className="form-label">新密码</Text>
            <View className="input-wrapper">
              <Input
                type={showPassword.new ? "text" : "password"}
                value={passwordData.newPassword}
                placeholder="请输入新密码（至少8位）"
                onChange={(val) => setPasswordData(prev => ({
                  ...prev,
                  newPassword: val
                }))}
              />
              <View
                className="eye-icon"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  new: !prev.new
                }))}
              >
                <Eye size="18" />
              </View>
            </View>
          </View>

          <View className="form-item">
            <Text className="form-label">确认新密码</Text>
            <View className="input-wrapper">
              <Input
                type={showPassword.confirm ? "text" : "password"}
                value={passwordData.confirmPassword}
                placeholder="请再次输入新密码"
                onChange={(val) => setPasswordData(prev => ({
                  ...prev,
                  confirmPassword: val
                }))}
              />
              <View
                className="eye-icon"
                onClick={() => setShowPassword(prev => ({
                  ...prev,
                  confirm: !prev.confirm
                }))}
              >
                <Eye size="18" />
              </View>
            </View>
          </View>
        </View>
      </Dialog>
    </View>
  )
}

export default SecuritySettings
