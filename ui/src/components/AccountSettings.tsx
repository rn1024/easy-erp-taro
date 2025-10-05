import React, { useState } from 'react';
import { ArrowLeft, Camera, User, Mail, Phone, MapPin, Building, Calendar } from 'lucide-react';

interface AccountSettingsProps {
  onBack: () => void;
}

interface UserProfile {
  avatar: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  location: string;
  joinDate: string;
  employeeId: string;
  bio: string;
}

export default function AccountSettings({ onBack }: AccountSettingsProps) {
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [tempProfile, setTempProfile] = useState(profile);

  const handleSave = () => {
    setProfile(tempProfile);
    setIsEditing(false);
    // Mock toast notification
    console.log('个人信息已更新');
  };

  const handleCancel = () => {
    setTempProfile(profile);
    setIsEditing(false);
  };

  const handleAvatarChange = () => {
    // 这里可以添加头像上传逻辑
    console.log('头像上传功能开发中');
  };

  const updateProfile = (field: keyof UserProfile, value: string) => {
    setTempProfile(prev => ({ ...prev, [field]: value }));
  };

  const departments = ['产品部', '技术部', '设计部', '运营部', '市场部', '人事部', '财务部'];
  const positions = ['产品经理', '技术经理', '设计师', '开发工程师', '测试工程师', '运营专员', '市场专员'];

  return (
    <div className="pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <button
              className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
            <h1 className="font-semibold text-gray-900">账户设置</h1>
          </div>
          {!isEditing ? (
            <button
              className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors"
              onClick={() => setIsEditing(true)}
            >
              编辑
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                className="px-3 py-1.5 text-sm hover:bg-gray-100 rounded-md transition-colors"
                onClick={handleCancel}
              >
                取消
              </button>
              <button
                className="px-3 py-1.5 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleSave}
              >
                保存
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 头像信息 */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center gap-4">
            <div className="relative">
              <img
                src={profile.avatar}
                alt={profile.name}
                className="h-20 w-20 rounded-full object-cover"
              />
              {isEditing && (
                <button
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full p-0 bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                  onClick={handleAvatarChange}
                >
                  <Camera className="h-4 w-4" />
                </button>
              )}
            </div>
            <div className="flex-1">
              <h2 className="font-semibold text-gray-900 mb-1">{profile.name}</h2>
              <p className="text-sm text-gray-600 mb-1">{profile.position}</p>
              <p className="text-xs text-gray-500">{profile.department}</p>
            </div>
          </div>
        </div>

        {/* 基本信息 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              基本信息
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
              <input
                type="text"
                value={isEditing ? tempProfile.name : profile.name}
                onChange={(e) => updateProfile('name', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50 text-gray-500' : ''
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">员工编号</label>
              <input
                type="text"
                value={profile.employeeId}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">个人简介</label>
              <textarea
                value={isEditing ? tempProfile.bio : profile.bio}
                onChange={(e) => updateProfile('bio', e.target.value)}
                disabled={!isEditing}
                rows={3}
                className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none ${
                  !isEditing ? 'bg-gray-50 text-gray-500' : ''
                }`}
                placeholder="请输入个人简介"
              />
            </div>
          </div>
        </div>

        {/* 联系信息 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              联系信息
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">邮箱地址</label>
              <input
                type="email"
                value={isEditing ? tempProfile.email : profile.email}
                onChange={(e) => updateProfile('email', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50 text-gray-500' : ''
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">手机号码</label>
              <input
                type="tel"
                value={isEditing ? tempProfile.phone : profile.phone}
                onChange={(e) => updateProfile('phone', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50 text-gray-500' : ''
                }`}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">办公地点</label>
              <input
                type="text"
                value={isEditing ? tempProfile.location : profile.location}
                onChange={(e) => updateProfile('location', e.target.value)}
                disabled={!isEditing}
                className={`w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  !isEditing ? 'bg-gray-50 text-gray-500' : ''
                }`}
                placeholder="请输入办公地点"
              />
            </div>
          </div>
        </div>

        {/* 工作信息 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Building className="h-4 w-4" />
              工作信息
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">所属部门</label>
              {isEditing ? (
                <select
                  value={tempProfile.department}
                  onChange={(e) => updateProfile('department', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={profile.department}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">职位</label>
              {isEditing ? (
                <select
                  value={tempProfile.position}
                  onChange={(e) => updateProfile('position', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {positions.map(pos => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={profile.position}
                  disabled
                  className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
                />
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">入职日期</label>
              <input
                type="date"
                value={profile.joinDate}
                disabled
                className="w-full px-3 py-2 border border-gray-200 rounded-md bg-gray-50 text-gray-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}