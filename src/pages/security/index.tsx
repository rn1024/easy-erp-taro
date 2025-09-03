import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { 
  Cell, 
  CellGroup, 
  Dialog, 
  Input, 
  Switch
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import './index.scss'

interface SecurityConfig {
  twoFactorEnabled: boolean
  loginNotification: boolean
  sessionTimeout: number
  allowRemoteLogin: boolean
  passwordExpiry: number
}

interface LoginDevice {
  id: string
  name: string
  type: 'mobile' | 'desktop' | 'tablet'
  location: string
  lastActive: string
  isCurrent: boolean
}

const SecurityPage: React.FC = () => {
  const [securityConfig, setSecurityConfig] = useState<SecurityConfig>({
    twoFactorEnabled: false,
    loginNotification: true,
    sessionTimeout: 30,
    allowRemoteLogin: true,
    passwordExpiry: 90
  })

  const [showPasswordDialog, setShowPasswordDialog] = useState(false)
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  })

  const [lastLoginInfo] = useState({
    lastLoginTime: '2024-01-06 14:30:26',
    lastLoginIP: '192.168.1.100',
    lastLoginLocation: '北京市朝阳区',
    loginDevice: 'Chrome 118.0.0.0 (Windows)'
  })

  const [loginDevices] = useState<LoginDevice[]>([
    {
      id: '1',
      name: 'iPhone 12 Pro',
      type: 'mobile',
      location: '北京市',
      lastActive: '2025-01-06T10:30:00',
      isCurrent: true
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      location: '北京市',
      lastActive: '2025-01-05T16:45:00',
      isCurrent: false
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      location: '上海市',
      lastActive: '2025-01-04T09:15:00',
      isCurrent: false
    }
  ])

  const handleSecurityChange = (key: keyof SecurityConfig, value: boolean | number) => {
    setSecurityConfig(prev => ({ ...prev, [key]: value }))
    // 设置已更新
  }

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword) {
      // 请输入当前密码
      return
    }
    if (!passwordForm.newPassword) {
      // 请输入新密码
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      // 两次输入的密码不一致
      return
    }
    if (passwordForm.newPassword.length < 6) {
      // 密码长度不能少于6位
      return
    }

    // 模拟密码修改
    // 密码修改成功
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswordDialog(false)
  }

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }))
  }

  const resetPasswordForm = () => {
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    setShowPasswords({ current: false, new: false, confirm: false })
    setShowPasswordDialog(false)
  }

  const handleDeviceRemove = (deviceId: string) => {
    // 移除设备: deviceId
    // 设备已移除
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
      return 'computer'
    case 'tablet':
      return 'tablet'
    default:
      return 'device_unknown'
    }
  }

  return (
    <MobileLayout className='security-page'>
      <View className='security-page__content'>
        {/* 密码管理 */}
        <CellGroup title='密码管理' className='security-page__group'>
          <Cell
            title='修改密码'
            description='定期修改密码以保护账户安全'
            onClick={() => setShowPasswordDialog(true)}
            className='security-page__cell'
            extra={<MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' />}
          />
          <Cell
            title='密码有效期'
            description={`当前密码将在${securityConfig.passwordExpiry}天后过期`}
            className='security-page__cell'
            extra={<View className='security-page__info'>
              {securityConfig.passwordExpiry}天
            </View>}
          />
        </CellGroup>

        {/* 登录安全 */}
        <CellGroup title='登录安全' className='security-page__group'>
          <Cell
            title='双重认证'
            description='开启后登录需要验证手机短信'
            className='security-page__cell'
            extra={
              <Switch
                checked={securityConfig.twoFactorEnabled}
                onChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
              />
            }
          />
          <Cell
            title='登录通知'
            description='新设备登录时发送通知'
            className='security-page__cell'
            extra={
              <Switch
                checked={securityConfig.loginNotification}
                onChange={(checked) => handleSecurityChange('loginNotification', checked)}
              />
            }
          />
          <Cell
            title='会话超时'
            description='无操作自动退出登录的时间'
            className='security-page__cell'
            extra={<View className='security-page__info'>
              {securityConfig.sessionTimeout}分钟
            </View>}
          />
          <Cell
            title='允许远程登录'
            description='允许在其他设备上登录'
            className='security-page__cell'
            extra={
              <Switch
                checked={securityConfig.allowRemoteLogin}
                onChange={(checked) => handleSecurityChange('allowRemoteLogin', checked)}
              />
            }
          />
        </CellGroup>

        {/* 最近登录记录 */}
        <CellGroup title='最近登录记录' className='security-page__group'>
          <Cell
            title='上次登录时间'
            description={lastLoginInfo.lastLoginTime}
            className='security-page__cell'
            extra={<View className='security-page__status'>
              <MaterialIcons name='check_circle' size={32} color='#52c41a' />
            </View>}
          />
          <Cell
            title='登录位置'
            description={lastLoginInfo.lastLoginLocation}
            className='security-page__cell'
            extra={<View className='security-page__info'>
              {lastLoginInfo.lastLoginIP}
            </View>}
          />
          <Cell
            title='登录设备'
            description={lastLoginInfo.loginDevice}
            className='security-page__cell'
          />
        </CellGroup>

        {/* 设备管理 */}
        <CellGroup title='设备管理' className='security-page__group'>
          {loginDevices.map((device) => (
            <View key={device.id} className='security-page__device-item'>
              <View className='security-page__device-info'>
                <View className='security-page__device-header'>
                  <View className='security-page__device-icon'>
                    <MaterialIcons name={getDeviceIcon(device.type)} size={40} color='#666' />
                  </View>
                  <View className='security-page__device-details'>
                    <View className='security-page__device-name'>
                      {device.name}
                      {device.isCurrent && (
                        <View className='security-page__current-badge'>当前设备</View>
                      )}
                    </View>
                    <View className='security-page__device-meta'>
                      <View className='security-page__device-location'>{device.location}</View>
                      <View className='security-page__device-time'>
                        {formatLastActive(device.lastActive)}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {!device.isCurrent && (
                <View 
                  className='security-page__device-remove'
                  onClick={() => handleDeviceRemove(device.id)}
                >
                  <MaterialIcons name='close' size={32} color='#ff4d4f' />
                </View>
              )}
            </View>
          ))}
        </CellGroup>
      </View>

      {/* 修改密码对话框 */}
      <Dialog
        visible={showPasswordDialog}
        title='修改密码'
        onConfirm={handlePasswordChange}
        onCancel={resetPasswordForm}
        confirmText='确认修改'
        cancelText='取消'
      >
        <View className='security-page__password-dialog'>
          <View className='security-page__password-field'>
            <View className='security-page__field-label'>当前密码</View>
            <View className='security-page__password-input-container'>
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                placeholder='请输入当前密码'
                className='security-page__password-input'
              />
              <View 
                className='security-page__password-toggle'
                onClick={() => togglePasswordVisibility('current')}
              >
                <MaterialIcons 
                  name={showPasswords.current ? 'visibility_off' : 'visibility'} 
                  size={32} 
                  color='#666' 
                />
              </View>
            </View>
          </View>

          <View className='security-page__password-field'>
            <View className='security-page__field-label'>新密码</View>
            <View className='security-page__password-input-container'>
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                placeholder='请输入新密码'
                className='security-page__password-input'
              />
              <View 
                className='security-page__password-toggle'
                onClick={() => togglePasswordVisibility('new')}
              >
                <MaterialIcons 
                  name={showPasswords.new ? 'visibility_off' : 'visibility'} 
                  size={32} 
                  color='#666' 
                />
              </View>
            </View>
            <View className='security-page__password-hint'>
              密码长度至少6位，建议包含字母、数字和特殊字符
            </View>
          </View>

          <View className='security-page__password-field'>
            <View className='security-page__field-label'>确认新密码</View>
            <View className='security-page__password-input-container'>
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                placeholder='请再次输入新密码'
                className='security-page__password-input'
              />
              <View 
                className='security-page__password-toggle'
                onClick={() => togglePasswordVisibility('confirm')}
              >
                <MaterialIcons 
                  name={showPasswords.confirm ? 'visibility_off' : 'visibility'} 
                  size={32} 
                  color='#666' 
                />
              </View>
            </View>
          </View>
        </View>
      </Dialog>
    </MobileLayout>
  )
}

export default SecurityPage 