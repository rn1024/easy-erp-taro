import React, { useState } from 'react';
import { Eye, EyeOff, Building2, ArrowRight } from 'lucide-react';

interface LoginPageProps {
  onLogin: (user: any) => void;
}

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.username.trim() || !formData.password.trim()) {
      return;
    }

    setLoading(true);

    // 模拟登录
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: '张三',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face',
        phone: '138****8888',
        department: '产品部',
        position: '产品经理'
      };
      onLogin(mockUser);
      setLoading(false);
    }, 1200);
  };

  const isFormValid = formData.username.trim() && formData.password.trim();

  return (
    <div className="wechat-container min-h-screen bg-wechat-bg">
      {/* 安全区域适配 */}
      <div className="wechat-safe-area-top" />
      
      {/* 主要内容 */}
      <div className="px-6 py-8 h-full">
        {/* 页面标题 */}
        <div className="mt-16 mb-12 text-center">
          <div className="w-12 h-12 bg-wechat-green rounded-lg flex items-center justify-center mb-4 mx-auto">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Easy ERP</h1>
          <p className="text-sm text-gray-500">账号登录</p>
        </div>

        {/* 登录表单 */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* 用户名输入 */}
          <div>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => handleInputChange('username', e.target.value)}
              className="mobile-input w-full px-4 py-4 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-wechat-green transition-all"
              placeholder="请输入用户名/手机号"
              disabled={loading}
              autoComplete="username"
            />
          </div>

          {/* 密码输入 */}
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              className="mobile-input w-full px-4 py-4 pr-12 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder-gray-500 focus:bg-white focus:ring-2 focus:ring-wechat-green transition-all"
              placeholder="请输入密码"
              disabled={loading}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
              disabled={loading}
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* 登录按钮 */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={!isFormValid || loading}
              className="w-full py-4 px-4 bg-wechat-green hover:bg-wechat-green/90 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-medium rounded-lg transition-all duration-200 wechat-button relative"
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  登录中...
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span>登录</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </div>
              )}
            </button>
          </div>

          {/* 辅助链接 */}
          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              className="text-sm text-wechat-blue hover:text-wechat-blue/80 transition-colors"
              disabled={loading}
            >
              忘记密码？
            </button>
            <button
              type="button"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
              disabled={loading}
            >
              联系管理员
            </button>
          </div>
        </form>


      </div>
    </div>
  );
}