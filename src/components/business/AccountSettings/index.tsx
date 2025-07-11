import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { 
  Cell, 
  CellGroup, 
  Dialog, 
  Input, 
  Button, 
  Avatar, 
  ActionSheet
} from '@nutui/nutui-react-taro'
import { Edit } from '@nutui/icons-react-taro'
import './index.scss'

interface AccountSettingsProps {
  onBack?: () => void
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

const AccountSettings: React.FC<AccountSettingsProps> = () => {
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
  const [showAvatarSheet, setShowAvatarSheet] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [editingField, setEditingField] = useState<keyof UserProfile | ''>('')
  const [editValue, setEditValue] = useState('')

  const handleSave = () => {
    setProfile(tempProfile)
    setIsEditing(false)
    console.log('个人信息已更新')
  }

  const handleCancel = () => {
    setTempProfile(profile)
    setIsEditing(false)
  }

  const handleAvatarChange = () => {
    setShowAvatarSheet(true)
  }

  const handleEditField = (field: keyof UserProfile) => {
    setEditingField(field)
    setEditValue(tempProfile[field])
    setShowEditDialog(true)
  }

  const handleSaveField = () => {
    if (editingField) {
      setTempProfile(prev => ({ ...prev, [editingField]: editValue }))
    }
    setShowEditDialog(false)
    setEditingField('')
    setEditValue('')
  }

  const avatarOptions = [
    { name: '拍照', value: 'camera' },
    { name: '从相册选择', value: 'album' },
    { name: '取消', value: 'cancel' }
  ]

  const handleAvatarSelect = (option: any) => {
    if (option.value === 'camera' || option.value === 'album') {
      // 这里可以添加头像上传逻辑
      console.log('头像上传功能开发中')
    }
    setShowAvatarSheet(false)
  }

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const profileFields = [
    { key: 'name' as keyof UserProfile, title: '姓名', description: profile.name },
    { key: 'email' as keyof UserProfile, title: '邮箱', description: profile.email },
    { key: 'phone' as keyof UserProfile, title: '手机号', description: profile.phone },
    { key: 'department' as keyof UserProfile, title: '部门', description: profile.department },
    { key: 'position' as keyof UserProfile, title: '职位', description: profile.position },
    { key: 'location' as keyof UserProfile, title: '所在地', description: profile.location },
    { key: 'bio' as keyof UserProfile, title: '个人简介', description: profile.bio }
  ]

  return (
    <View className="account-settings">
      <View className="account-settings__header">
        <View className="account-settings__title">账户设置</View>
        <View className="account-settings__actions">
          {isEditing ? (
            <>
              <Button 
                size="small" 
                fill="none" 
                className="account-settings__cancel-btn"
                onClick={handleCancel}
              >
                取消
              </Button>
              <Button 
                size="small" 
                type="primary"
                className="account-settings__save-btn"
                onClick={handleSave}
              >
                保存
              </Button>
            </>
          ) : (
            <Button 
              size="small" 
              type="primary" 
              fill="outline"
              onClick={() => setIsEditing(true)}
            >
              编辑
            </Button>
          )}
        </View>
      </View>

      <View className="account-settings__content">
        {/* 头像区域 */}
        <View className="account-settings__avatar-section">
          <View className="account-settings__avatar-container">
            <Avatar
              size="80"
              src={profile.avatar}
              className="account-settings__avatar"
            />
            {isEditing && (
              <View 
                className="account-settings__avatar-edit"
                onClick={handleAvatarChange}
              >
                <Edit size="16" />
              </View>
            )}
          </View>
          <View className="account-settings__user-info">
            <View className="account-settings__user-name">{profile.name}</View>
            <View className="account-settings__user-id">员工编号: {profile.employeeId}</View>
            <View className="account-settings__join-date">
              入职时间: {formatJoinDate(profile.joinDate)}
            </View>
          </View>
        </View>

        {/* 基本信息 */}
        <CellGroup title="基本信息">
          {profileFields.map((field) => (
            <Cell
              key={field.key}
              title={field.title}
              description={field.description}
              onClick={() => isEditing && handleEditField(field.key)}
              className={isEditing ? 'account-settings__editable-cell' : ''}
            />
          ))}
        </CellGroup>
      </View>

      {/* 头像选择弹窗 */}
      <ActionSheet
        visible={showAvatarSheet}
        options={avatarOptions}
        onSelect={handleAvatarSelect}
        onCancel={() => setShowAvatarSheet(false)}
      />

      {/* 编辑字段对话框 */}
      <Dialog
        visible={showEditDialog}
        title={`编辑${profileFields.find(f => f.key === editingField)?.title}`}
        onClose={() => setShowEditDialog(false)}
        footer={
          <View className="account-settings__dialog-footer">
            <Button onClick={() => setShowEditDialog(false)}>取消</Button>
            <Button type="primary" onClick={handleSaveField}>确定</Button>
          </View>
        }
      >
        <View className="account-settings__edit-form">
          <Input
            value={editValue}
            onChange={setEditValue}
            placeholder="请输入内容"
          />
        </View>
      </Dialog>
    </View>
  )
}

export default AccountSettings 