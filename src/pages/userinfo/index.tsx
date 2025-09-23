import React, { useState } from 'react'
import { View, Text, Button as TaroButton } from '@tarojs/components'
import { Avatar } from '@nutui/nutui-react-taro'
// @ts-ignore
import { MaterialIcons } from 'taro-icons'
import Taro from '@tarojs/taro'
import MobileLayout from '@/components/MobileLayout'
import './index.scss'

interface UserProfile {
  avatar: string
  name: string
  employeeId: string
  joinDate: string
  department: string
  position: string
  email: string
  phone: string
  location: string
  bio: string
}

const UserInfo: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false)
  const [profile] = useState<UserProfile>({
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    name: '张三',
    employeeId: 'EMP001',
    joinDate: '2023年1月15日',
    department: '产品部',
    position: '产品经理',
    email: 'zhangsan@company.com',
    phone: '138****8888',
    location: '北京市朝阳区',
    bio: '专注于产品设计和用户体验，有5年互联网产品经验。'
  })

  const handleEdit = () => {
    if (isEditing) {
      Taro.showToast({ title: '保存成功', icon: 'success' })
      setIsEditing(false)
    } else {
      setIsEditing(true)
    }
  }

  const basicInfo = [
    { label: '姓名', value: profile.name, editable: true },
    { label: '员工编号', value: profile.employeeId, editable: false },
    { label: '个人简介', value: profile.bio, editable: true }
  ]

  const contactInfo = [
    { label: '邮箱地址', value: profile.email, editable: true },
    { label: '手机号码', value: profile.phone, editable: true },
    { label: '办公地点', value: profile.location, editable: true }
  ]

  const workInfo = [
    { label: '所属部门', value: profile.department, editable: false },
    { label: '职位', value: profile.position, editable: false },
    { label: '入职日期', value: profile.joinDate, editable: false }
  ]

  const InfoSection = ({ title, items }: { title: string; items: Array<{ label: string; value: string; editable: boolean }> }) => (
    <View className='info-section'>
      <Text className='section-title'>{title}</Text>
      <View className='info-list'>
        {items.map((item, index) => (
          <View key={index} className='info-item'>
            <Text className='info-label'>{item.label}</Text>
            <View className='info-value-container'>
              <Text className='info-value'>{item.value}</Text>
              {isEditing && item.editable && (
                <MaterialIcons name='chevron-right' size={20} color='#999' />
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  )

  return (
    <MobileLayout
      className='userinfo-page'
      showTabBar={false}
      title="账户设置"
      showBack
    >
      <View className='userinfo-container'>
        {/* 编辑按钮 */}
        <View className='edit-button-container'>
          <TaroButton
            className='edit-button'
            onClick={handleEdit}
          >
            {isEditing ? '保存' : '编辑'}
          </TaroButton>
        </View>

        {/* 头像和基本信息 */}
        <View className='profile-header'>
          <View className='avatar-container'>
            <Avatar
              size='80'
              src={profile.avatar}
              className='user-avatar'
            >
              {profile.name.charAt(0)}
            </Avatar>
          </View>

          <View className='user-summary'>
            <Text className='user-name'>{profile.name}</Text>
            <Text className='user-meta'>员工编号: {profile.employeeId}</Text>
            <Text className='user-meta'>入职时间: {profile.joinDate}</Text>
          </View>
        </View>

        {/* 基本信息 */}
        <InfoSection title='基本信息' items={basicInfo} />

        {/* 联系信息 */}
        <InfoSection title='联系信息' items={contactInfo} />

        {/* 工作信息 */}
        <InfoSection title='工作信息' items={workInfo} />
      </View>
    </MobileLayout>
  )
}

export default UserInfo