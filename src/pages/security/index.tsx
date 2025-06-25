import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Cell,
  CellGroup,
  Switch,
  Button,
  Badge,
  Popup,
  Dialog
} from '@nutui/nutui-react-taro'
import { MobileLayout, TopNavigation } from '../../components'
import './index.scss'

interface SecuritySettings {
  twoFactorAuth: boolean
  loginNotification: boolean
  sensitiveOperationConfirm: boolean
  autoLogout: boolean
  deviceBinding: boolean
  ipWhitelist: boolean
}

interface LoginDevice {
  id: string
  deviceName: string
  deviceType: string
  location: string
  lastLogin: string
  isCurrentDevice: boolean
  status: 'online' | 'offline'
}

const SecurityPage: React.FC = () => {
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    twoFactorAuth: false,
    loginNotification: true,
    sensitiveOperationConfirm: true,
    autoLogout: true,
    deviceBinding: false,
    ipWhitelist: false
  })

  const [loginDevices] = useState<LoginDevice[]>([
    {
      id: '1',
      deviceName: 'iPhone 15 Pro',
      deviceType: 'iOS',
      location: '北京市朝阳区',
      lastLogin: '2024-12-24 10:30',
      isCurrentDevice: true,
      status: 'online'
    },
    {
      id: '2',
      deviceName: 'MacBook Pro',
      deviceType: 'macOS',
      location: '北京市朝阳区',
      lastLogin: '2024-12-23 18:45',
      isCurrentDevice: false,
      status: 'offline'
    },
    {
      id: '3',
      deviceName: 'Chrome Browser',
      deviceType: 'Windows',
      location: '上海市浦东新区',
      lastLogin: '2024-12-22 14:20',
      isCurrentDevice: false,
      status: 'offline'
    }
  ])

  const [showDeviceList, setShowDeviceList] = useState(false)
  const [showLogoutDialog, setShowLogoutDialog] = useState(false)
  const [selectedDevice, setSelectedDevice] = useState<string>('')

  // 处理安全设置变更
  const handleSecuritySettingChange = (key: keyof SecuritySettings, value: boolean) => {
    setSecuritySettings(prev => ({
      ...prev,
      [key]: value
    }))

    // 显示相应的提示
    const settingNames = {
      twoFactorAuth: '双重验证',
      loginNotification: '登录通知',
      sensitiveOperationConfirm: '敏感操作确认',
      autoLogout: '自动登出',
      deviceBinding: '设备绑定',
      ipWhitelist: 'IP白名单'
    }

    const status = value ? '已开启' : '已关闭'
    Taro.showToast({
      title: `${settingNames[key]}${status}`,
      icon: 'success'
    })
  }

  // 处理设备登出
  const handleDeviceLogout = (deviceId: string) => {
    setSelectedDevice(deviceId)
    setShowLogoutDialog(true)
  }

  // 确认登出设备
  const confirmDeviceLogout = () => {
    const device = loginDevices.find(d => d.id === selectedDevice)
    if (device) {
      Taro.showToast({
        title: `已登出${device.deviceName}`,
        icon: 'success'
      })
    }
    setShowLogoutDialog(false)
    setSelectedDevice('')
  }

  // 开启双重验证
  const handleEnable2FA = () => {
    if (securitySettings.twoFactorAuth) {
      Taro.showModal({
        title: '关闭双重验证',
        content: '关闭后您的账户安全性将降低，确定要关闭吗？',
        success: (res) => {
          if (res.confirm) {
            handleSecuritySettingChange('twoFactorAuth', false)
          }
        }
      })
    } else {
      Taro.showModal({
        title: '开启双重验证',
        content: '开启后登录时需要额外的验证步骤，是否继续？',
        success: (res) => {
          if (res.confirm) {
            handleSecuritySettingChange('twoFactorAuth', true)
          }
        }
      })
    }
  }

  // 清除所有登录状态
  const handleLogoutAllDevices = () => {
    Taro.showModal({
      title: '登出所有设备',
      content: '这将强制登出所有设备（除当前设备），确定继续吗？',
      success: (res) => {
        if (res.confirm) {
          Taro.showToast({ title: '已登出所有其他设备', icon: 'success' })
        }
      }
    })
  }

  return (
    <MobileLayout enableSafeArea>
      <TopNavigation
        title="安全设置"
        showBack
        onBack={() => Taro.navigateBack()}
        onSearch={() => {}}
        onFilter={() => {}}
        activeFilters={0}
      />

      <View className="security-page">
        {/* 安全等级展示 */}
        <View className="security-level">
          <View className="level-header">
            <Text className="level-title">当前安全等级</Text>
            <Badge value="中等" className="level-badge" />
          </View>
          <View className="level-progress">
            <View className="progress-bar">
              <View className="progress-fill" style={{ width: '60%' }} />
            </View>
            <Text className="progress-text">60%</Text>
          </View>
          <Text className="level-tip">建议开启双重验证提升安全等级</Text>
        </View>

        {/* 登录安全 */}
        <CellGroup title="登录安全" className="login-security">
          <Cell
            title="双重验证"
            description="登录时需要额外验证"
            extra={
              <Switch
                checked={securitySettings.twoFactorAuth}
                onChange={() => handleEnable2FA()}
              />
            }
          />
          <Cell
            title="登录通知"
            description="新设备登录时发送通知"
            extra={
              <Switch
                checked={securitySettings.loginNotification}
                onChange={(checked) => handleSecuritySettingChange('loginNotification', checked)}
              />
            }
          />
          <Cell
            title="敏感操作确认"
            description="执行重要操作前再次确认身份"
            extra={
              <Switch
                checked={securitySettings.sensitiveOperationConfirm}
                onChange={(checked) => handleSecuritySettingChange('sensitiveOperationConfirm', checked)}
              />
            }
          />
          <Cell
            title="自动登出"
            description="长时间无操作自动登出"
            extra={
              <Switch
                checked={securitySettings.autoLogout}
                onChange={(checked) => handleSecuritySettingChange('autoLogout', checked)}
              />
            }
          />
        </CellGroup>

        {/* 设备管理 */}
        <CellGroup title="设备管理" className="device-management">
          <Cell
            title="登录设备管理"
            description={`已登录${loginDevices.length}台设备`}
            isLink
            onClick={() => setShowDeviceList(true)}
          />
          <Cell
            title="设备绑定"
            description="仅允许绑定设备登录"
            extra={
              <Switch
                checked={securitySettings.deviceBinding}
                onChange={(checked) => handleSecuritySettingChange('deviceBinding', checked)}
              />
            }
          />
          <Cell
            title="登出所有设备"
            description="强制登出所有其他设备"
            isLink
            onClick={handleLogoutAllDevices}
            className="danger-cell"
          />
        </CellGroup>

        {/* 高级安全 */}
        <CellGroup title="高级安全" className="advanced-security">
          <Cell
            title="IP白名单"
            description="仅允许指定IP地址访问"
            extra={
              <Switch
                checked={securitySettings.ipWhitelist}
                onChange={(checked) => handleSecuritySettingChange('ipWhitelist', checked)}
              />
            }
          />
          <Cell
            title="登录日志"
            description="查看详细的登录记录"
            isLink
            onClick={() => {
              Taro.showToast({ title: '功能开发中', icon: 'none' })
            }}
          />
          <Cell
            title="安全报告"
            description="定期接收账户安全报告"
            isLink
            onClick={() => {
              Taro.showToast({ title: '功能开发中', icon: 'none' })
            }}
          />
        </CellGroup>

        {/* 紧急操作 */}
        <View className="emergency-section">
          <Button
            type="danger"
            size="large"
            className="emergency-button"
            onClick={() => {
              Taro.showModal({
                title: '冻结账户',
                content: '紧急情况下可临时冻结账户，需要联系管理员解冻',
                success: (res) => {
                  if (res.confirm) {
                    Taro.showToast({ title: '账户已申请冻结', icon: 'success' })
                  }
                }
              })
            }}
          >
            紧急冻结账户
          </Button>
        </View>
      </View>

      {/* 设备列表弹窗 */}
      <Popup
        visible={showDeviceList}
        position="bottom"
        closeable
        round
        onClose={() => setShowDeviceList(false)}
        className="device-popup"
      >
        <View className="device-list">
          <View className="popup-title">登录设备管理</View>

          {loginDevices.map((device) => (
            <View key={device.id} className="device-item">
              <View className="device-info">
                <View className="device-header">
                  <Text className="device-name">{device.deviceName}</Text>
                  {device.isCurrentDevice && (
                    <Badge value="当前设备" className="current-badge" />
                  )}
                  <Badge
                    value={device.status === 'online' ? '在线' : '离线'}
                    className={`status-badge ${device.status}`}
                  />
                </View>
                <Text className="device-type">{device.deviceType}</Text>
                <Text className="device-location">{device.location}</Text>
                <Text className="device-time">最后登录：{device.lastLogin}</Text>
              </View>

              {!device.isCurrentDevice && (
                <Button
                  type="danger"
                  size="small"
                  className="logout-button"
                  onClick={() => handleDeviceLogout(device.id)}
                >
                  登出
                </Button>
              )}
            </View>
          ))}
        </View>
      </Popup>

      {/* 确认登出对话框 */}
      <Dialog
        visible={showLogoutDialog}
        title="确认登出"
        content="确定要登出该设备吗？"
        onConfirm={confirmDeviceLogout}
        onCancel={() => setShowLogoutDialog(false)}
      />
    </MobileLayout>
  )
}

export default SecurityPage
