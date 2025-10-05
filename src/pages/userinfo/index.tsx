import React, { useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Avatar, Button } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, InfoList } from '@/components/common'

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

  const basicInfo = useMemo(() => ([
    { key: 'name', label: '姓名', value: profile.name },
    { key: 'id', label: '员工编号', value: profile.employeeId },
    { key: 'bio', label: '个人简介', value: profile.bio }
  ]), [profile])

  const contactInfo = useMemo(() => ([
    { key: 'email', label: '邮箱地址', value: profile.email },
    { key: 'phone', label: '手机号码', value: profile.phone },
    { key: 'location', label: '办公地点', value: profile.location }
  ]), [profile])

  const workInfo = useMemo(() => ([
    { key: 'department', label: '所属部门', value: profile.department },
    { key: 'position', label: '职位', value: profile.position },
    { key: 'joinDate', label: '入职日期', value: profile.joinDate }
  ]), [profile])

  const handleEdit = () => {
    if (isEditing) {
      Taro.showToast({ title: '保存成功', icon: 'success' })
    }
    setIsEditing(prev => !prev)
  }

  return (
    <MobileLayout className='userinfo-page' title='账户设置' showBack>
      <View className='userinfo-page__content'>
        <SectionCard
          title='个人资料'
          description='更新个人头像、简介和联系方式'
          compact
          actions={[
            <Button key='edit' size='mini' type={isEditing ? 'primary' : 'default'} onClick={handleEdit}>
              {isEditing ? '保存' : '编辑'}
            </Button>
          ]}
        >
          <View className='userinfo-page__header'>
            <View className='userinfo-page__avatar'>
              <Avatar size='80' src={profile.avatar}>
                {profile.name.charAt(0)}
              </Avatar>
              <View className='userinfo-page__avatar-action' onClick={() => Taro.showToast({ title: '更换头像', icon: 'none' })}>
                <MaterialIcons name='photo_camera' size={18} color='#6b7280' />
              </View>
            </View>
            <View className='userinfo-page__summary'>
              <Text className='userinfo-page__name'>{profile.name}</Text>
              <Text className='userinfo-page__meta'>员工编号：{profile.employeeId}</Text>
              <Text className='userinfo-page__meta'>入职时间：{profile.joinDate}</Text>
            </View>
          </View>
        </SectionCard>

        <SectionCard title='基本信息' compact>
          <InfoList dense items={basicInfo} />
        </SectionCard>

        <SectionCard title='联系信息' compact>
          <InfoList dense items={contactInfo} />
        </SectionCard>

        <SectionCard title='工作信息' compact>
          <InfoList dense items={workInfo} />
        </SectionCard>
      </View>
    </MobileLayout>
  )
}

export default UserInfo
