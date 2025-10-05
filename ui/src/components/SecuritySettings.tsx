import React, { useState } from 'react';
import { ArrowLeft, Shield, Lock, Smartphone, Eye, EyeOff, Key, AlertTriangle, X } from 'lucide-react';

interface SecuritySettingsProps {
  onBack: () => void;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  loginNotifications: boolean;
  deviceManagement: boolean;
  autoLock: boolean;
  biometricLogin: boolean;
}

interface LoginDevice {
  id: string;
  name: string;
  type: 'mobile' | 'desktop' | 'tablet';
  location: string;
  lastActive: string;
  isCurrent: boolean;
}

export default function SecuritySettings({ onBack }: SecuritySettingsProps) {
  const [settings, setSettings] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    loginNotifications: true,
    deviceManagement: true,
    autoLock: true,
    biometricLogin: false
  });

  const [showPasswordDialog, setShowPasswordDialog] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loginDevices] = useState<LoginDevice[]>([
    {
      id: '1',
      name: 'iPhone 12 Pro',
      type: 'mobile',
      location: '北京市',
      lastActive: '2025-06-22T10:30:00',
      isCurrent: true
    },
    {
      id: '2',
      name: 'MacBook Pro',
      type: 'desktop',
      location: '北京市',
      lastActive: '2025-06-21T16:45:00',
      isCurrent: false
    },
    {
      id: '3',
      name: 'iPad Air',
      type: 'tablet',
      location: '上海市',
      lastActive: '2025-06-20T09:15:00',
      isCurrent: false
    }
  ]);

  const handleSettingChange = (key: keyof SecuritySettings, value: boolean) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    console.log('安全设置已更新');
  };

  const handlePasswordChange = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      console.log('新密码与确认密码不匹配');
      return;
    }
    
    if (passwordData.newPassword.length < 8) {
      console.log('密码长度至少8位');
      return;
    }

    // 这里可以添加密码修改的API调用
    console.log('Changing password:', passwordData);
    console.log('密码修改成功');
    setShowPasswordDialog(false);
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    });
  };

  const handleDeviceRemove = (deviceId: string) => {
    console.log('Removing device:', deviceId);
    console.log('设备已移除');
  };

  const formatLastActive = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));

    if (diffInHours < 1) return '刚刚活跃';
    if (diffInHours < 24) return `${diffInHours}小时前`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}天前`;
  };

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <Smartphone className="h-4 w-4" />;
      case 'desktop':
        return <Shield className="h-4 w-4" />;
      case 'tablet':
        return <Shield className="h-4 w-4" />;
      default:
        return <Shield className="h-4 w-4" />;
    }
  };

  return (
    <div className="pb-20">
      {/* 顶部导航 */}
      <div className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="flex items-center gap-3 px-4 py-3">
          <button
            className="h-8 w-8 p-0 inline-flex items-center justify-center rounded-md hover:bg-gray-100 transition-colors"
            onClick={onBack}
          >
            <ArrowLeft className="h-4 w-4" />
          </button>
          <h1 className="font-semibold text-gray-900">安全设置</h1>
        </div>
      </div>

      <div className="px-4 py-4 space-y-4">
        {/* 密码管理 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Lock className="h-4 w-4" />
              密码管理
            </h3>
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">登录密码</p>
                <p className="text-sm text-gray-500">上次修改: 2025年5月15日</p>
              </div>
              <button
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-md hover:bg-gray-50 transition-colors"
                onClick={() => setShowPasswordDialog(true)}
              >
                修改密码
              </button>
            </div>
          </div>
        </div>

        {/* 安全验证 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Key className="h-4 w-4" />
              安全验证
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">双重验证</p>
                <p className="text-sm text-gray-500">通过手机验证码验证身份</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.twoFactorEnabled ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => handleSettingChange('twoFactorEnabled', !settings.twoFactorEnabled)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.twoFactorEnabled ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">生物识别登录</p>
                <p className="text-sm text-gray-500">使用指纹或面部识别</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.biometricLogin ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => handleSettingChange('biometricLogin', !settings.biometricLogin)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.biometricLogin ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* 安全通知 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              安全通知
            </h3>
          </div>
          <div className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">登录通知</p>
                <p className="text-sm text-gray-500">新设备登录时通知</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.loginNotifications ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => handleSettingChange('loginNotifications', !settings.loginNotifications)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.loginNotifications ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">设备管理通知</p>
                <p className="text-sm text-gray-500">设备变更时通知</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.deviceManagement ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => handleSettingChange('deviceManagement', !settings.deviceManagement)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.deviceManagement ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
            
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">自动锁定</p>
                <p className="text-sm text-gray-500">长时间无操作自动锁定</p>
              </div>
              <button
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.autoLock ? 'bg-blue-500' : 'bg-gray-200'
                }`}
                onClick={() => handleSettingChange('autoLock', !settings.autoLock)}
              >
                <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                  settings.autoLock ? 'translate-x-6' : 'translate-x-0.5'
                }`} />
              </button>
            </div>
          </div>
        </div>

        {/* 登录设备 */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-4 pb-3 border-b border-gray-100">
            <h3 className="text-base font-medium flex items-center gap-2">
              <Smartphone className="h-4 w-4" />
              登录设备
            </h3>
          </div>
          <div className="p-4 space-y-3">
            {loginDevices.map((device) => (
              <div key={device.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
                    {getDeviceIcon(device.type)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 text-sm">{device.name}</p>
                      {device.isCurrent && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                          当前设备
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">
                      {device.location} • {formatLastActive(device.lastActive)}
                    </p>
                  </div>
                </div>
                {!device.isCurrent && (
                  <button
                    className="text-sm text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                    onClick={() => handleDeviceRemove(device.id)}
                  >
                    移除
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 修改密码底部抽屉 */}
      {showPasswordDialog && (
        <div className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl shadow-2xl transform transition-transform"
             style={{ boxShadow: '0 -10px 25px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
            {/* 拖拽指示器 */}
            <div className="flex justify-center pt-3 pb-1">
              <div className="w-10 h-1 bg-gray-300 rounded-full" />
            </div>
            
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="font-semibold text-lg text-gray-900">修改密码</h3>
              <button
                onClick={() => setShowPasswordDialog(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2"
              >
                <X className="h-5 w-5 text-gray-500" />
              </button>
            </div>
            
            {/* 表单内容 */}
            <div className="px-4 py-2 max-h-96 overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">当前密码</label>
                  <div className="relative">
                    <input
                      type={showCurrentPassword ? "text" : "password"}
                      value={passwordData.currentPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
                      placeholder="请输入当前密码"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">新密码</label>
                  <div className="relative">
                    <input
                      type={showNewPassword ? "text" : "password"}
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                      placeholder="请输入新密码（至少8位）"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">确认新密码</label>
                  <div className="relative">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="请再次输入新密码"
                      className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-4 flex items-center hover:bg-gray-50 rounded-r-xl transition-colors"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* 操作按钮 */}
              <div className="flex gap-3 pt-6 pb-6">
                <button
                  className="flex-1 py-3.5 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors active:bg-gray-100"
                  onClick={() => setShowPasswordDialog(false)}
                >
                  取消
                </button>
                <button
                  className="flex-1 py-3.5 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors active:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  onClick={handlePasswordChange}
                  disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  确认修改
                </button>
              </div>
            </div>
        </div>
      )}
    </div>
  );
}