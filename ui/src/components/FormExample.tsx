import React, { useState } from 'react';
import { ArrowLeft, Upload, Star } from 'lucide-react';

interface FormExampleProps {
  onBack: () => void
}

export default function FormExample({ onBack }: FormExampleProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    gender: '',
    hobbies: [] as string[],
    newsletter: false,
    rating: 0,
    salary: 30,
    birthday: '',
    city: '',
    description: ''
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = () => {
    const newErrors: Record<string, string> = {}
    
    if (!formData.name.trim()) {
      newErrors.name = '请输入姓名'
    }
    
    if (!formData.email.trim()) {
      newErrors.email = '请输入邮箱'
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = '请输入正确的邮箱格式'
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = '请输入手机号'
    } else if (!/^1\d{10}$/.test(formData.phone)) {
      newErrors.phone = '请输入正确的手机号'
    }
    
    if (!formData.gender) {
      newErrors.gender = '请选择性别'
    }
    
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      console.log('表单数据:', formData)
      alert('提交成功！')
    }
  }

  const handleReset = () => {
    setFormData({
      name: '',
      email: '',
      phone: '',
      gender: '',
      hobbies: [],
      newsletter: false,
      rating: 0,
      salary: 30,
      birthday: '',
      city: '',
      description: ''
    })
    setErrors({})
  }

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const handleHobbyChange = (hobby: string) => {
    const newHobbies = formData.hobbies.includes(hobby)
      ? formData.hobbies.filter(h => h !== hobby)
      : [...formData.hobbies, hobby]
    handleInputChange('hobbies', newHobbies)
  }

  const handleRatingClick = (rating: number) => {
    handleInputChange('rating', rating)
  }

  const hobbyOptions = [
    { label: '阅读', value: 'reading' },
    { label: '运动', value: 'sports' },
    { label: '音乐', value: 'music' },
    { label: '旅行', value: 'travel' }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <div className="bg-white border-b border-gray-100 px-4 py-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <h1 className="text-lg font-medium text-gray-900">表单组件示例</h1>
        </div>
      </div>

      <div className="p-4">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 基础输入 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">基础信息</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  姓名 <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  placeholder="请输入您的姓名"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  邮箱 <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  placeholder="请输入邮箱地址"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-500">{errors.email}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  手机号 <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  placeholder="请输入手机号码"
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  个人描述
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="请描述一下自己..."
                  rows={4}
                  maxLength={200}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                />
                <div className="text-right text-xs text-gray-500 mt-1">
                  {formData.description.length}/200
                </div>
              </div>
            </div>
          </div>

          {/* 选择类型 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">选择选项</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  性别 <span className="text-red-500">*</span>
                </label>
                <div className="flex gap-4">
                  {[
                    { label: '男', value: 'male' },
                    { label: '女', value: 'female' },
                    { label: '其他', value: 'other' }
                  ].map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gender"
                        value={option.value}
                        checked={formData.gender === option.value}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-500">{errors.gender}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  兴趣爱好
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {hobbyOptions.map(option => (
                    <label key={option.value} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={formData.hobbies.includes(option.value)}
                        onChange={() => handleHobbyChange(option.value)}
                        className="w-4 h-4 text-blue-500 focus:ring-blue-500 rounded"
                      />
                      <span className="text-sm text-gray-700">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) => handleInputChange('newsletter', e.target.checked)}
                    className="w-4 h-4 text-blue-500 focus:ring-blue-500 rounded"
                  />
                  <span className="text-sm text-gray-700">订阅邮件通知</span>
                </label>
              </div>
            </div>
          </div>

          {/* 数值输入 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">数值选择</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  满意度评分
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingClick(star)}
                      className={`p-1 ${
                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                      }`}
                    >
                      <Star className="h-6 w-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  期望薪资: {formData.salary}K
                </label>
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={formData.salary}
                  onChange={(e) => handleInputChange('salary', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0K</span>
                  <span>25K</span>
                  <span>50K+</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  生日
                </label>
                <input
                  type="date"
                  value={formData.birthday}
                  onChange={(e) => handleInputChange('birthday', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  所在城市
                </label>
                <select
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">请选择城市</option>
                  <option value="beijing">北京</option>
                  <option value="shanghai">上海</option>
                  <option value="guangzhou">广州</option>
                  <option value="shenzhen">深圳</option>
                </select>
              </div>
            </div>
          </div>

          {/* 文件上传 */}
          <div className="bg-white rounded-lg p-4 shadow-sm">
            <h2 className="text-base font-medium text-gray-900 mb-4">文件上传</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                头像上传
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">点击或拖拽文件到此处上传</p>
                <p className="text-xs text-gray-400 mt-1">支持 JPG、PNG 格式</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      console.log('选中文件:', file.name)
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* 提交按钮 */}
          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-600 transition-colors"
            >
              提交表单
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="flex-1 bg-gray-500 text-white py-3 px-4 rounded-lg font-medium hover:bg-gray-600 transition-colors"
            >
              重置
            </button>
          </div>
        </form>

        {/* 使用说明 */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="text-sm font-medium text-blue-900 mb-2">📋 表单组件说明</h3>
          <div className="text-xs text-blue-700 space-y-1">
            <p>• 使用原生HTML表单元素 + TailwindCSS样式</p>
            <p>• 支持表单验证和错误提示</p>
            <p>• 包含常用的表单控件类型</p>
            <p>• 适配移动端触摸操作</p>
            <p>• 响应式设计，支持不同屏幕尺寸</p>
          </div>
        </div>
      </div>
    </div>
  )
}