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
import './index.scss'

interface SecuritySettingsProps {
  onBack?: () => void
}

interface SecurityConfig {
  twoFactorEnabled: boolean
  loginNotification: boolean
  sessionTimeout: number
  allowRemoteLogin: boolean
  passwordExpiry: number
}

const SecuritySettings: React.FC<SecuritySettingsProps> = () => {
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

  const handleSecurityChange = (key: keyof SecurityConfig, value: boolean | number) => {
    setSecurityConfig(prev => ({ ...prev, [key]: value }))
    console.log('设置已更新')
  }

  const handlePasswordChange = () => {
    if (!passwordForm.currentPassword) {
      console.log('请输入当前密码')
      return
    }
    if (!passwordForm.newPassword) {
      console.log('请输入新密码')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      console.log('两次输入的密码不一致')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      console.log('密码长度不能少于6位')
      return
    }

    // 模拟密码修改
    console.log('密码修改成功')
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

  return (
    <View className="security-settings">
      <View className="security-settings__header">
        <View className="security-settings__title">安全设置</View>
      </View>

      <View className="security-settings__content">
        {/* 密码管理 */}
        <CellGroup title="密码管理">
          <Cell
            title="修改密码"
            description="定期修改密码以保护账户安全"
            onClick={() => setShowPasswordDialog(true)}
          />
          <Cell
            title="密码有效期"
            description={`当前密码将在${securityConfig.passwordExpiry}天后过期`}
            extra={<View className="security-settings__info">
              {securityConfig.passwordExpiry}天
            </View>}
          />
        </CellGroup>

        {/* 登录安全 */}
        <CellGroup title="登录安全">
          <Cell
            title="双重认证"
            description="开启后登录需要验证手机短信"
            extra={
              <Switch
                checked={securityConfig.twoFactorEnabled}
                onChange={(checked) => handleSecurityChange('twoFactorEnabled', checked)}
              />
            }
          />
          <Cell
            title="登录通知"
            description="新设备登录时发送通知"
            extra={
              <Switch
                checked={securityConfig.loginNotification}
                onChange={(checked) => handleSecurityChange('loginNotification', checked)}
              />
            }
          />
          <Cell
            title="会话超时"
            description="无操作自动退出登录的时间"
            extra={<View className="security-settings__info">
              {securityConfig.sessionTimeout}分钟
            </View>}
          />
          <Cell
            title="允许远程登录"
            description="允许在其他设备上登录"
            extra={
              <Switch
                checked={securityConfig.allowRemoteLogin}
                onChange={(checked) => handleSecurityChange('allowRemoteLogin', checked)}
              />
            }
          />
        </CellGroup>

        {/* 最近登录记录 */}
        <CellGroup title="最近登录记录">
          <View className="security-settings__login-info">
            <View className="security-settings__login-item">
              <View className="security-settings__login-label">最后登录时间</View>
              <View className="security-settings__login-value">{lastLoginInfo.lastLoginTime}</View>
            </View>
            <View className="security-settings__login-item">
              <View className="security-settings__login-label">登录IP</View>
              <View className="security-settings__login-value">{lastLoginInfo.lastLoginIP}</View>
            </View>
            <View className="security-settings__login-item">
              <View className="security-settings__login-label">登录地点</View>
              <View className="security-settings__login-value">{lastLoginInfo.lastLoginLocation}</View>
            </View>
            <View className="security-settings__login-item">
              <View className="security-settings__login-label">登录设备</View>
              <View className="security-settings__login-value">{lastLoginInfo.loginDevice}</View>
            </View>
          </View>
        </CellGroup>

        {/* 安全建议 */}
        <View className="security-settings__suggestions">
          <View className="security-settings__suggestions-title">
            🛡️ 安全建议
          </View>
          <View className="security-settings__suggestions-list">
            <View className="security-settings__suggestion-item">
              • 定期修改密码，建议每3个月更换一次
            </View>
            <View className="security-settings__suggestion-item">
              • 使用包含大小写字母、数字和特殊字符的强密码
            </View>
            <View className="security-settings__suggestion-item">
              • 开启双重认证以提高账户安全性
            </View>
            <View className="security-settings__suggestion-item">
              • 不要在公共网络下进行敏感操作
            </View>
          </View>
        </View>
      </View>

      {/* 修改密码弹窗 */}
      <Dialog
        visible={showPasswordDialog}
        title="修改密码"
        onConfirm={handlePasswordChange}
        onCancel={resetPasswordForm}
        confirmText="确认修改"
        cancelText="取消"
      >
        <View className="security-settings__password-dialog">
          <View className="security-settings__password-field">
            <View className="security-settings__field-label">当前密码</View>
            <View className="security-settings__password-input-container">
              <Input
                type={showPasswords.current ? 'text' : 'password'}
                value={passwordForm.currentPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, currentPassword: value }))}
                placeholder="请输入当前密码"
                className="security-settings__password-input"
              />
              <View 
                className="security-settings__password-toggle"
                onClick={() => togglePasswordVisibility('current')}
              >
                {showPasswords.current ? '🙈' : <MaterialIcons name="visibility" size={16} color="#666" />}
              </View>
            </View>
          </View>

          <View className="security-settings__password-field">
            <View className="security-settings__field-label">新密码</View>
            <View className="security-settings__password-input-container">
              <Input
                type={showPasswords.new ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, newPassword: value }))}
                placeholder="请输入新密码"
                className="security-settings__password-input"
              />
              <View 
                className="security-settings__password-toggle"
                onClick={() => togglePasswordVisibility('new')}
              >
                {showPasswords.new ? '🙈' : <MaterialIcons name="visibility" size={16} color="#666" />}
              </View>
            </View>
            <View className="security-settings__password-hint">
              密码长度至少6位，建议包含字母、数字和特殊字符
            </View>
          </View>

          <View className="security-settings__password-field">
            <View className="security-settings__field-label">确认新密码</View>
            <View className="security-settings__password-input-container">
              <Input
                type={showPasswords.confirm ? 'text' : 'password'}
                value={passwordForm.confirmPassword}
                onChange={(value) => setPasswordForm(prev => ({ ...prev, confirmPassword: value }))}
                placeholder="请再次输入新密码"
                className="security-settings__password-input"
              />
              <View 
                className="security-settings__password-toggle"
                onClick={() => togglePasswordVisibility('confirm')}
              >
                {showPasswords.confirm ? '🙈' : <MaterialIcons name="visibility" size={16} color="#666" />}
              </View>
            </View>
          </View>
        </View>
      </Dialog>
    </View>
  )
}

export default SecuritySettings 