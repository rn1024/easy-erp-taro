import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Cell,
  CellGroup,
  Form,
  Input,
  Button,
  Avatar,
  Switch,
  ActionSheet,
  Popup,
  TextArea
} from '@nutui/nutui-react-taro'
import { MobileLayout, TopNavigation } from '../../components'
import './index.scss'

interface UserInfo {
  username: string
  email: string
  phone: string
  avatar: string
  realName: string
  department: string
  position: string
}

interface PasswordForm {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

const AccountPage: React.FC = () => {
  const [userInfo, setUserInfo] = useState<UserInfo>({
    username: 'zhangsan',
    email: 'zhangsan@company.com',
    phone: '138****8888',
    avatar: 'https://img12.360buyimg.com/imagetools/jfs/t1/143702/31/16654/116794/5fc6f541Edebf8a57/4138097748889987.png',
    realName: '张三',
    department: '产品部',
    position: '产品经理'
  })

  const [passwordForm, setPasswordForm] = useState<PasswordForm>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showAvatarActions, setShowAvatarActions] = useState(false)
  const [enableNotification, setEnableNotification] = useState(true)

  // 头像选择选项
  const avatarActions = [
    { name: '拍照', action: 'camera' },
    { name: '从相册选择', action: 'album' },
    { name: '取消', action: 'cancel' }
  ]

  // 处理头像更换
  const handleAvatarChange = (action: string) => {
    setShowAvatarActions(false)

    if (action === 'camera') {
      Taro.chooseImage({
        count: 1,
        sourceType: ['camera'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          setUserInfo(prev => ({ ...prev, avatar: tempFilePath }))
          Taro.showToast({ title: '头像已更新', icon: 'success' })
        }
      })
    } else if (action === 'album') {
      Taro.chooseImage({
        count: 1,
        sourceType: ['album'],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0]
          setUserInfo(prev => ({ ...prev, avatar: tempFilePath }))
          Taro.showToast({ title: '头像已更新', icon: 'success' })
        }
      })
    }
  }

  // 保存个人信息
  const handleSaveProfile = () => {
    Taro.showToast({ title: '信息已保存', icon: 'success' })
  }

  // 修改密码
  const handleChangePassword = () => {
    if (!passwordForm.currentPassword) {
      Taro.showToast({ title: '请输入当前密码', icon: 'error' })
      return
    }
    if (passwordForm.newPassword.length < 6) {
      Taro.showToast({ title: '新密码至少6位', icon: 'error' })
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      Taro.showToast({ title: '两次密码不一致', icon: 'error' })
      return
    }

    // 模拟密码修改
    Taro.showToast({ title: '密码修改成功', icon: 'success' })
    setShowPasswordModal(false)
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  return (
    <MobileLayout enableSafeArea>
      <TopNavigation
        title="账户设置"
        showBack
        onBack={() => Taro.navigateBack()}
        onSearch={() => {}}
        onFilter={() => {}}
        activeFilters={0}
      />

      <View className="account-page">
        {/* 用户头像区域 */}
        <View className="avatar-section">
          <Avatar
            size="large"
            src={userInfo.avatar}
            className="user-avatar"
            onClick={() => setShowAvatarActions(true)}
          />
          <Text className="avatar-tip">点击更换头像</Text>
        </View>

        {/* 基本信息 */}
        <CellGroup title="基本信息" className="info-group">
          <Cell
            title="用户名"
            extra={userInfo.username}
            isLink
            onClick={() => {
              Taro.showModal({
                title: '修改用户名',
                editable: true,
                placeholderText: userInfo.username,
                success: (res) => {
                  if (res.confirm && res.content) {
                    setUserInfo(prev => ({ ...prev, username: res.content! }))
                    Taro.showToast({ title: '用户名已更新', icon: 'success' })
                  }
                }
              })
            }}
          />
          <Cell
            title="真实姓名"
            extra={userInfo.realName}
            isLink
            onClick={() => {
              Taro.showModal({
                title: '修改真实姓名',
                editable: true,
                placeholderText: userInfo.realName,
                success: (res) => {
                  if (res.confirm && res.content) {
                    setUserInfo(prev => ({ ...prev, realName: res.content! }))
                    Taro.showToast({ title: '真实姓名已更新', icon: 'success' })
                  }
                }
              })
            }}
          />
          <Cell
            title="邮箱"
            extra={userInfo.email}
            isLink
            onClick={() => {
              Taro.showModal({
                title: '修改邮箱',
                editable: true,
                placeholderText: userInfo.email,
                success: (res) => {
                  if (res.confirm && res.content) {
                    setUserInfo(prev => ({ ...prev, email: res.content! }))
                    Taro.showToast({ title: '邮箱已更新', icon: 'success' })
                  }
                }
              })
            }}
          />
          <Cell
            title="手机号"
            extra={userInfo.phone}
            isLink
            onClick={() => {
              Taro.showToast({ title: '请联系管理员修改', icon: 'none' })
            }}
          />
        </CellGroup>

        {/* 工作信息 */}
        <CellGroup title="工作信息" className="work-group">
          <Cell title="部门" extra={userInfo.department} />
          <Cell title="职位" extra={userInfo.position} />
        </CellGroup>

        {/* 账户安全 */}
        <CellGroup title="账户安全" className="security-group">
          <Cell
            title="修改密码"
            isLink
            onClick={() => setShowPasswordModal(true)}
          />
          <Cell
            title="消息通知"
            extra={
              <Switch
                checked={enableNotification}
                onChange={(checked) => setEnableNotification(checked)}
              />
            }
          />
        </CellGroup>

        {/* 绑定账号 */}
        <CellGroup title="账号绑定" className="bind-group">
          <Cell
            title="微信绑定"
            extra="已绑定"
            extraTextStyle={{ color: '#07c160' }}
          />
          <Cell
            title="手机绑定"
            extra="已绑定"
            extraTextStyle={{ color: '#07c160' }}
          />
        </CellGroup>

        {/* 保存按钮 */}
        <View className="save-section">
          <Button
            type="primary"
            size="large"
            onClick={handleSaveProfile}
            className="save-button"
          >
            保存设置
          </Button>
        </View>
      </View>

      {/* 头像选择弹窗 */}
      <ActionSheet
        visible={showAvatarActions}
        menuItems={avatarActions}
        onClose={() => setShowAvatarActions(false)}
        onChoose={(item) => handleAvatarChange(item.action)}
      />

      {/* 修改密码弹窗 */}
      <Popup
        visible={showPasswordModal}
        position="bottom"
        closeable
        round
        onClose={() => setShowPasswordModal(false)}
        className="password-popup"
      >
        <View className="password-form">
          <View className="popup-title">修改密码</View>

          <View className="form-item">
            <Text className="form-label">当前密码</Text>
            <Input
              type="password"
              placeholder="请输入当前密码"
              value={passwordForm.currentPassword}
              onChange={(value) =>
                setPasswordForm(prev => ({ ...prev, currentPassword: value }))
              }
            />
          </View>

          <View className="form-item">
            <Text className="form-label">新密码</Text>
            <Input
              type="password"
              placeholder="请输入新密码（至少6位）"
              value={passwordForm.newPassword}
              onChange={(value) =>
                setPasswordForm(prev => ({ ...prev, newPassword: value }))
              }
            />
          </View>

          <View className="form-item">
            <Text className="form-label">确认新密码</Text>
            <Input
              type="password"
              placeholder="请再次输入新密码"
              value={passwordForm.confirmPassword}
              onChange={(value) =>
                setPasswordForm(prev => ({ ...prev, confirmPassword: value }))
              }
            />
          </View>

          <View className="form-buttons">
            <Button
              size="large"
              onClick={() => setShowPasswordModal(false)}
              className="cancel-button"
            >
              取消
            </Button>
            <Button
              type="primary"
              size="large"
              onClick={handleChangePassword}
              className="confirm-button"
            >
              确认修改
            </Button>
          </View>
        </View>
      </Popup>
    </MobileLayout>
  )
}

export default AccountPage
