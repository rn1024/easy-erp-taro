import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
  Cell,
  CellGroup,
  Avatar,
  Input,
  Button,
  Picker,
  Toast
} from '@nutui/nutui-react-taro'
import {
  ArrowLeft,
  Photograph
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { cn } from '../../utils/cn'
import './index.scss'

interface AccountSettingsProps {
  onBack?: () => void
  className?: string
}

interface UserProfile {
  avatar: string
  name: string
  email: string
  phone: string
  department: string
  position: string
  location: string
  joinDate: string
  employeeId: string
  bio: string
}

/**
 * 账户设置组件
 * 用于管理用户个人信息和账户相关设置
 */
const AccountSettings: React.FC<AccountSettingsProps> = ({
  onBack,
  className
}) => {
  const [profile, setProfile] = useState<UserProfile>({
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    name: '张三',
    email: 'zhangsan@company.com',
    phone: '138****8888',
    department: '产品部',
    position: '产品经理',
    location: '北京市朝阳区',
    joinDate: '2023-01-15',
    employeeId: 'EMP001',
    bio: '专注于产品设计和用户体验，有5年互联网产品经验。'
  })

  const [isEditing, setIsEditing] = useState(false)
  const [tempProfile, setTempProfile] = useState(profile)
  const [showDeptPicker, setShowDeptPicker] = useState(false)
  const [showPosPicker, setShowPosPicker] = useState(false)

  const departments = [
    { value: '产品部', text: '产品部' },
    { value: '技术部', text: '技术部' },
    { value: '设计部', text: '设计部' },
    { value: '运营部', text: '运营部' },
    { value: '市场部', text: '市场部' },
    { value: '人事部', text: '人事部' },
    { value: '财务部', text: '财务部' }
  ]

  const positions = [
    { value: '产品经理', text: '产品经理' },
    { value: '技术经理', text: '技术经理' },
    { value: '设计师', text: '设计师' },
    { value: '开发工程师', text: '开发工程师' },
    { value: '测试工程师', text: '测试工程师' },
    { value: '运营专员', text: '运营专员' },
    { value: '市场专员', text: '市场专员' }
  ]

  const handleSave = () => {
    setProfile(tempProfile)
    setIsEditing(false)
    Toast.show('个人信息已更新')
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }

  const handleAvatarChange = () => {
    if (!isEditing) return

    Taro.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: (res) => {
        const tempFilePath = res.tempFilePaths[0]
        updateProfile('avatar', tempFilePath)
        Toast.show('头像已更新')
      }
    })
  }

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }))
  }

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  return (
    <View className={cn('account-settings', className)}>
      {/* 顶部导航 */}
      <View className="nav-header">
        <View className="nav-content">
          <View className="nav-left" onClick={handleBack}>
            <ArrowLeft size="20" />
            <Text className="nav-title">账户设置</Text>
          </View>
          <View className="nav-right">
            {!isEditing ? (
              <Text className="nav-action" onClick={() => setIsEditing(true)}>
                编辑
              </Text>
            ) : (
              <View className="nav-actions">
                <Text className="nav-action cancel" onClick={handleCancel}>
                  取消
                </Text>
                <Text className="nav-action save" onClick={handleSave}>
                  保存
                </Text>
              </View>
            )}
          </View>
        </View>
      </View>

      <View className="settings-content">
        {/* 头像信息 */}
        <View className="profile-header">
          <View className="avatar-section" onClick={handleAvatarChange}>
            <Avatar
              size="80"
              src={tempProfile.avatar}
              className="user-avatar"
            >
              {tempProfile.name.charAt(0)}
            </Avatar>
            {isEditing && (
              <View className="camera-badge">
                <Photograph size="16" color="#fff" />
              </View>
            )}
          </View>
          <View className="profile-info">
            <Text className="user-name">{profile.name}</Text>
            <Text className="user-position">{profile.position}</Text>
            <Text className="user-department">{profile.department}</Text>
          </View>
        </View>

        {/* 基本信息 */}
        <CellGroup title="基本信息" className="info-group">
          <Cell
            title="姓名"
            align="center"
          >
            <Input
              value={tempProfile.name}
              placeholder="请输入姓名"
              disabled={!isEditing}
              onChange={(val) => updateProfile('name', val)}
              className={cn('cell-input', !isEditing && 'disabled')}
            />
          </Cell>
          <Cell
            title="员工编号"
            align="center"
          >
            <Input
              value={profile.employeeId}
              disabled
              className="cell-input disabled"
            />
          </Cell>
          <Cell
            title="个人简介"
            align="center"
          >
            <Input
              value={tempProfile.bio}
              placeholder="请输入个人简介"
              disabled={!isEditing}
              onChange={(val) => updateProfile('bio', val)}
              className={cn('cell-input', !isEditing && 'disabled')}
            />
          </Cell>
        </CellGroup>

        {/* 联系信息 */}
        <CellGroup title="联系信息" className="info-group">
          <Cell
            title="邮箱地址"
            align="center"
          >
            <Input
              value={tempProfile.email}
              placeholder="请输入邮箱"
              disabled={!isEditing}
              onChange={(val) => updateProfile('email', val)}
              className={cn('cell-input', !isEditing && 'disabled')}
            />
          </Cell>
          <Cell
            title="手机号码"
            align="center"
          >
            <Input
              value={tempProfile.phone}
              placeholder="请输入手机号"
              disabled={!isEditing}
              onChange={(val) => updateProfile('phone', val)}
              className={cn('cell-input', !isEditing && 'disabled')}
            />
          </Cell>
          <Cell
            title="办公地点"
            align="center"
          >
            <Input
              value={tempProfile.location}
              placeholder="请输入办公地点"
              disabled={!isEditing}
              onChange={(val) => updateProfile('location', val)}
              className={cn('cell-input', !isEditing && 'disabled')}
            />
          </Cell>
        </CellGroup>

        {/* 工作信息 */}
        <CellGroup title="工作信息" className="info-group">
          <Cell
            title="所属部门"
            extra={tempProfile.department}
            onClick={() => isEditing && setShowDeptPicker(true)}
            align="center"
            className={cn('picker-cell', isEditing && 'clickable')}
          />
          <Cell
            title="职位"
            extra={tempProfile.position}
            onClick={() => isEditing && setShowPosPicker(true)}
            align="center"
            className={cn('picker-cell', isEditing && 'clickable')}
          />
          <Cell
            title="入职日期"
            extra={profile.joinDate}
            align="center"
          />
        </CellGroup>
      </View>

      {/* 部门选择器 */}
      <Picker
        visible={showDeptPicker}
        options={[departments]}
        onConfirm={(options, values) => {
          updateProfile('department', values[0] as string)
          setShowDeptPicker(false)
        }}
        onClose={() => setShowDeptPicker(false)}
      />

      {/* 职位选择器 */}
      <Picker
        visible={showPosPicker}
        options={[positions]}
        onConfirm={(options, values) => {
          updateProfile('position', values[0] as string)
          setShowPosPicker(false)
        }}
        onClose={() => setShowPosPicker(false)}
      />
    </View>
  )
}

export default AccountSettings
