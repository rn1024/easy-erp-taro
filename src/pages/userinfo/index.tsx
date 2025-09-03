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
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import './index.scss'

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

const UserInfoPage: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    name: '张三',
    email: 'zhangsan@company.com',
    phone: '138****8888',
    department: '产品部',
    position: '产品经理',
    location: '北京市朝阳区',
    joinDate: '2023年1月15日',
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
    // 个人信息已更新
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

  const handleAvatarSelect = (option: { name: string; value: string }) => {
    if (option.value === 'camera' || option.value === 'album') {
      // 头像上传功能开发中
    }
    setShowAvatarSheet(false)
  }

  const getFieldTitle = (field: keyof UserProfile) => {
    const titles = {
      name: '姓名',
      email: '邮箱地址',
      phone: '手机号码',
      department: '所属部门',
      position: '职位',
      location: '办公地点',
      bio: '个人简介',
      employeeId: '员工编号',
      joinDate: '入职日期',
      avatar: '头像'
    }
    return titles[field] || field
  }

  return (
    <MobileLayout className='userinfo-page'>
      {/* 编辑按钮区域 */}
      <View className='userinfo-page__header-actions'>
        {isEditing ? (
          <View className='userinfo-page__edit-actions'>
            <Button 
              size='small' 
              fill='none' 
              className='userinfo-page__cancel-btn'
              onClick={handleCancel}
            >
              取消
            </Button>
            <Button 
              size='small' 
              type='primary'
              className='userinfo-page__save-btn'
              onClick={handleSave}
            >
              保存
            </Button>
          </View>
        ) : (
          <Button 
            size='small' 
            type='primary' 
            fill='outline'
            className='userinfo-page__edit-btn'
            onClick={() => setIsEditing(true)}
          >
            编辑
          </Button>
        )}
      </View>

      <View className='userinfo-page__content'>
        {/* 头像和基本信息区域 */}
        <View className='userinfo-page__avatar-section'>
          <View className='userinfo-page__avatar-container'>
            <Avatar
              size='160'
              src={profile.avatar}
              className='userinfo-page__avatar'
            />
            {isEditing && (
              <View 
                className='userinfo-page__avatar-edit'
                onClick={handleAvatarChange}
              >
                <MaterialIcons name='edit' size={32} color='#fff' />
              </View>
            )}
          </View>
          <View className='userinfo-page__user-info'>
            <View className='userinfo-page__user-name'>{profile.name}</View>
            <View className='userinfo-page__user-meta'>
              <View className='userinfo-page__user-id'>员工编号: {profile.employeeId}</View>
              <View className='userinfo-page__join-date'>入职时间: {profile.joinDate}</View>
            </View>
          </View>
        </View>

        {/* 基本信息 */}
        <CellGroup title='基本信息' className='userinfo-page__group'>
          <Cell
            title='姓名'
            description={profile.name}
            onClick={() => isEditing && handleEditField('name')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
          <Cell
            title='员工编号'
            description={profile.employeeId}
            className='userinfo-page__readonly-cell'
          />
          <Cell
            title='个人简介'
            description={profile.bio}
            onClick={() => isEditing && handleEditField('bio')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
        </CellGroup>

        {/* 联系信息 */}
        <CellGroup title='联系信息' className='userinfo-page__group'>
          <Cell
            title='邮箱地址'
            description={profile.email}
            onClick={() => isEditing && handleEditField('email')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
          <Cell
            title='手机号码'
            description={profile.phone}
            onClick={() => isEditing && handleEditField('phone')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
          <Cell
            title='办公地点'
            description={profile.location}
            onClick={() => isEditing && handleEditField('location')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
        </CellGroup>

        {/* 工作信息 */}
        <CellGroup title='工作信息' className='userinfo-page__group'>
          <Cell
            title='所属部门'
            description={profile.department}
            onClick={() => isEditing && handleEditField('department')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
          <Cell
            title='职位'
            description={profile.position}
            onClick={() => isEditing && handleEditField('position')}
            className={isEditing ? 'userinfo-page__editable-cell' : ''}
            extra={isEditing ? <MaterialIcons name='keyboard_arrow_right' size={32} color='#ccc' /> : undefined}
          />
          <Cell
            title='入职日期'
            description={profile.joinDate}
            className='userinfo-page__readonly-cell'
          />
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
        title={`编辑${getFieldTitle(editingField as keyof UserProfile)}`}
        onClose={() => setShowEditDialog(false)}
        footer={
          <View className='userinfo-page__dialog-footer'>
            <Button onClick={() => setShowEditDialog(false)}>取消</Button>
            <Button type='primary' onClick={handleSaveField}>确定</Button>
          </View>
        }
      >
        <View className='userinfo-page__edit-form'>
          <Input
            value={editValue}
            onChange={setEditValue}
            placeholder={`请输入${getFieldTitle(editingField as keyof UserProfile)}`}
          />
        </View>
      </Dialog>
    </MobileLayout>
  )
}

export default UserInfoPage