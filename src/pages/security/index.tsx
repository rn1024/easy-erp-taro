import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { Switch } from '@nutui/nutui-react-taro'
// @ts-ignore
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import './index.scss'

interface SecuritySetting {
  title: string
  description?: string
  type: 'section' | 'switch' | 'text' | 'link'
  value?: boolean | string
  onClick?: () => void
}

const Security: React.FC = () => {
  const [twoFactor, setTwoFactor] = useState(false)
  const [loginNotify, setLoginNotify] = useState(true)
  const [autoLogout, setAutoLogout] = useState(true)

  const securitySettings: SecuritySetting[] = [
    { title: '密码管理', type: 'section' },
    {
      title: '修改密码',
      description: '定期修改密码以保护账户安全',
      type: 'link',
      onClick: () => Taro.showToast({ title: '功能开发中', icon: 'none' })
    },
    {
      title: '密码有效期',
      description: '当前密码将在90天后过期',
      type: 'text',
      value: '90天'
    },
    { title: '登录安全', type: 'section' },
    {
      title: '双重认证',
      description: '开启后直录需要验证手机短信',
      type: 'switch',
      value: twoFactor
    },
    {
      title: '登录通知',
      description: '新设备登录时发送通知',
      type: 'switch',
      value: loginNotify
    },
    {
      title: '会话超时',
      description: '无操作自动退出登录的时间',
      type: 'text',
      value: '30分钟'
    },
    {
      title: '允许远程登录',
      description: '允许在其他设备上登录',
      type: 'switch',
      value: autoLogout
    },
    { title: '最近登录记录', type: 'section' },
    {
      title: '上次登录时间',
      type: 'text',
      value: '2024-01-06 14:30:26'
    },
    {
      title: '登录位置',
      type: 'text',
      value: '北京市朝阳区'
    },
    {
      title: '登录IP',
      type: 'text',
      value: '192.168.1.100'
    },
    {
      title: '登录设备',
      type: 'text',
      value: 'Chrome 118.0.0.0 (Windows)'
    }
  ]

  const handleSwitchChange = (index: number, checked: boolean) => {
    if (index === 4) {
      setTwoFactor(checked)
    } else if (index === 5) {
      setLoginNotify(checked)
    } else if (index === 7) {
      setAutoLogout(checked)
    }
  }

  return (
    <MobileLayout
      className='security-page'
      showTabBar={false}
      title="安全设置"
      showBack
    >
      <View className='security-container'>
        {securitySettings.map((item, index) => {
          if (item.type === 'section') {
            return (
              <View key={index} className='section-header'>
                <Text className='section-title'>{item.title}</Text>
              </View>
            )
          }

          return (
            <View key={index} className='setting-item' onClick={item.onClick}>
              <View className='setting-content'>
                <View className='setting-info'>
                  <Text className='setting-title'>{item.title}</Text>
                  {item.description && (
                    <Text className='setting-desc'>{item.description}</Text>
                  )}
                </View>

                {item.type === 'switch' ? (
                  <Switch
                    checked={item.value as boolean}
                    onChange={(checked) => handleSwitchChange(index, checked)}
                  />
                ) : item.type === 'text' ? (
                  <Text className='setting-value'>{item.value}</Text>
                ) : (
                  <MaterialIcons name='chevron-right' size={20} color='#999' />
                )}
              </View>
            </View>
          )
        })}

        {/* 设备管理 */}
        <View className='device-section'>
          <Text className='section-title'>设备管理</Text>
          <View
            className='device-button'
            onClick={() => Taro.showToast({ title: '功能开发中', icon: 'none' })}
          >
            <Text className='button-text'>查看所有已登录设备</Text>
            <MaterialIcons name='chevron-right' size={20} color='#999' />
          </View>
        </View>
      </View>
    </MobileLayout>
  )
}

export default Security