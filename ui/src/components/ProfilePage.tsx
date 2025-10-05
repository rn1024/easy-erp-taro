import React, { useState } from 'react';
import { 
  User, 
  Settings, 
  Bell, 
  Shield, 
  HelpCircle, 
  LogOut, 
  ChevronRight,
  Edit3,
  Award,
  TrendingUp,
  Clock,
  CheckCircle,
  Camera,
  Phone,
  Mail,
  MapPin,
  X
} from 'lucide-react';
import AccountSettings from './AccountSettings';
import SecuritySettings from './SecuritySettings';
import HelpCenter from './HelpCenter';

interface UserProfile {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  joinDate: string;
}

interface UserStats {
  createdWorkflows: number;
  completedTasks: number;
  pendingTasks: number;
  totalWorkingDays: number;
  completionRate: number;
  averageResponseTime: string;
}

interface NotificationSettings {
  taskReminders: boolean;
  emailNotifications: boolean;
  pushNotifications: boolean;
  weeklyReports: boolean;
}

interface ProfilePageProps {
  onNavigateToSettings?: (settingType: string) => void;
  onLogout?: () => void;
}

export default function ProfilePage({ onNavigateToSettings, onLogout }: ProfilePageProps) {
  const [userProfile, setUserProfile] = useState<UserProfile>({
    id: '1',
    name: '张三',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
    email: 'zhangsan@company.com',
    phone: '138****8888',
    department: '产品部',
    position: '产品经理',
    joinDate: '2023-01-15'
  });

  const [userStats] = useState<UserStats>({
    createdWorkflows: 15,
    completedTasks: 48,
    pendingTasks: 6,
    totalWorkingDays: 365,
    completionRate: 89,
    averageResponseTime: '2.3小时'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    taskReminders: true,
    emailNotifications: true,
    pushNotifications: false,
    weeklyReports: true
  });

  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);
  const [currentView, setCurrentView] = useState<'main' | 'account' | 'security' | 'help'>('main');

  const handleProfileUpdate = (field: keyof UserProfile, value: string) => {
    setUserProfile(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (setting: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [setting]: value }));
  };

  const formatJoinDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const calculateWorkingDays = () => {
    const joinDate = new Date(userProfile.joinDate);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const statsCards = [
    {
      title: '创建流程',
      value: userStats.createdWorkflows,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: '完成任务',
      value: userStats.completedTasks,
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: '待办任务',
      value: userStats.pendingTasks,
      icon: Clock,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      title: '完成率',
      value: `${userStats.completionRate}%`,
      icon: Award,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  const menuItems = [
    {
      id: 'account',
      title: '账户设置',
      icon: User,
      description: '编辑个人信息',
      action: () => {
        if (onNavigateToSettings) {
          onNavigateToSettings('account');
        } else {
          setCurrentView('account');
        }
      }
    },
    {
      id: 'notifications',
      title: '通知设置',
      icon: Bell,
      description: '管理推送通知',
      action: () => setShowNotificationSettings(true)
    },
    {
      id: 'security',
      title: '安全设置',
      icon: Shield,
      description: '密码和安全选项',
      action: () => {
        if (onNavigateToSettings) {
          onNavigateToSettings('security');
        } else {
          setCurrentView('security');
        }
      }
    },
    {
      id: 'help',
      title: '帮助中心',
      icon: HelpCircle,
      description: '常见问题和支持',
      action: () => {
        if (onNavigateToSettings) {
          onNavigateToSettings('help');
        } else {
          setCurrentView('help');
        }
      }
    }
  ];

  // 如果当前视图不是主页面，渲染对应的设置页面
  if (currentView === 'account') {
    return <AccountSettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'security') {
    return <SecuritySettings onBack={() => setCurrentView('main')} />;
  }

  if (currentView === 'help') {
    return <HelpCenter onBack={() => setCurrentView('main')} />;
  }

  return (
    <div className="pb-20">
      {/* 用户信息卡片 */}
      <div className="mx-4 mt-4 bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative">
            <img
              src={userProfile.avatar}
              alt={userProfile.name}
              className="h-16 w-16 rounded-full object-cover"
            />
            <button
              className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full p-0 bg-white border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
              onClick={() => console.log('Change avatar')}
            >
              <Camera className="h-3 w-3" />
            </button>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h2 className="font-semibold text-gray-900">{userProfile.name}</h2>
              <button
                className="h-6 w-6 p-0 flex items-center justify-center hover:bg-gray-100 rounded-md transition-colors"
                onClick={() => setShowEditProfile(true)}
              >
                <Edit3 className="h-3 w-3" />
              </button>
            </div>
            <p className="text-sm text-gray-600 mb-1">{userProfile.position}</p>
            <p className="text-xs text-gray-500">{userProfile.department}</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Mail className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{userProfile.email}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">{userProfile.phone}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">入职: {formatJoinDate(userProfile.joinDate)}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">工作 {calculateWorkingDays()} 天</span>
          </div>
        </div>
      </div>

      {/* 统计数据 */}
      <div className="px-4 py-3">
        <h3 className="font-medium text-gray-900 mb-3">我的统计</h3>
        <div className="grid grid-cols-2 gap-3">
          {statsCards.map((card, index) => {
            const Icon = card.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className={`w-8 h-8 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                    <Icon className={`h-4 w-4 ${card.color}`} />
                  </div>
                </div>
                <div className="text-xl font-semibold text-gray-900 mb-1">{card.value}</div>
                <div className="text-xs text-gray-600">{card.title}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 工作表现 */}
      <div className="mx-4 mb-4 bg-white rounded-lg shadow-sm">
        <div className="p-4 pb-3">
          <h3 className="text-base font-medium text-gray-900">工作表现</h3>
        </div>
        <div className="px-4 pb-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">任务完成率</span>
              <div className="flex items-center gap-2">
                <div className="w-20 bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full"
                    style={{ width: `${userStats.completionRate}%` }}
                  />
                </div>
                <span className="text-sm font-medium text-gray-900">{userStats.completionRate}%</span>
              </div>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">平均响应时间</span>
              <span className="text-xs border border-gray-200 text-gray-600 px-2 py-1 rounded">
                {userStats.averageResponseTime}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 设置菜单 */}
      <div className="px-4">
        <h3 className="font-medium text-gray-900 mb-3">设置</h3>
        <div className="bg-white rounded-lg shadow-sm">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div key={item.id}>
                <button
                  className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors"
                  onClick={item.action}
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    <Icon className="h-5 w-5 text-gray-600" />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{item.title}</p>
                    <p className="text-sm text-gray-500">{item.description}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </button>
                {index < menuItems.length - 1 && (
                  <div className="ml-14 h-px bg-gray-100" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 退出按钮 */}
      <div className="px-4 mt-6">
        <button 
          className="w-full py-3 px-4 border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors font-medium"
          onClick={() => {
            if (onLogout) {
              onLogout();
            } else {
              console.log('Logout');
            }
          }}
        >
          <LogOut className="h-4 w-4 mr-2 inline" />
          退出登录
        </button>
      </div>

      {/* 编辑个人信息底部抽屉 */}
      {showEditProfile && (
        <div className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl shadow-2xl transform transition-transform"
             style={{ boxShadow: '0 -10px 25px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          {/* 拖拽指示器 */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-lg text-gray-900">编辑个人信息</h3>
            <button
              onClick={() => setShowEditProfile(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* 表单内容 */}
          <div className="px-4 py-2 max-h-96 overflow-y-auto">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">姓名</label>
                <input
                  type="text"
                  value={userProfile.name}
                  onChange={(e) => handleProfileUpdate('name', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入姓名"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">邮箱</label>
                <input
                  type="email"
                  value={userProfile.email}
                  onChange={(e) => handleProfileUpdate('email', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入邮箱地址"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">手机号</label>
                <input
                  type="tel"
                  value={userProfile.phone}
                  onChange={(e) => handleProfileUpdate('phone', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入手机号"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">职位</label>
                <input
                  type="text"
                  value={userProfile.position}
                  onChange={(e) => handleProfileUpdate('position', e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入职位"
                />
              </div>
            </div>
            
            {/* 操作按钮 */}
            <div className="flex gap-3 pt-6 pb-6">
              <button
                className="flex-1 py-3.5 px-4 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-50 transition-colors active:bg-gray-100"
                onClick={() => setShowEditProfile(false)}
              >
                取消
              </button>
              <button
                className="flex-1 py-3.5 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors active:bg-blue-700"
                onClick={() => {
                  setShowEditProfile(false);
                  console.log('Profile updated');
                }}
              >
                保存
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 通知设置底部抽屉 */}
      {showNotificationSettings && (
        <div className="fixed inset-x-0 bottom-0 z-[60] bg-white rounded-t-2xl shadow-2xl transform transition-transform"
             style={{ boxShadow: '0 -10px 25px -3px rgba(0, 0, 0, 0.1), 0 -4px 6px -2px rgba(0, 0, 0, 0.05)' }}>
          {/* 拖拽指示器 */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-gray-300 rounded-full" />
          </div>
          
          {/* 标题栏 */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
            <h3 className="font-semibold text-lg text-gray-900">通知设置</h3>
            <button
              onClick={() => setShowNotificationSettings(false)}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors -mr-2"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          </div>
          
          {/* 设置选项 */}
          <div className="px-4 py-2 max-h-96 overflow-y-auto">
            <div className="space-y-1">
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">任务提醒</p>
                  <p className="text-sm text-gray-500 mt-0.5">新任务和截止日期提醒</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.taskReminders ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => handleNotificationChange('taskReminders', !notificationSettings.taskReminders)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    notificationSettings.taskReminders ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="h-px bg-gray-100 mx-0" />
              
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">邮件通知</p>
                  <p className="text-sm text-gray-500 mt-0.5">重要通知邮件提醒</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.emailNotifications ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => handleNotificationChange('emailNotifications', !notificationSettings.emailNotifications)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    notificationSettings.emailNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="h-px bg-gray-100 mx-0" />
              
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">推送通知</p>
                  <p className="text-sm text-gray-500 mt-0.5">手机推送消息</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.pushNotifications ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => handleNotificationChange('pushNotifications', !notificationSettings.pushNotifications)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    notificationSettings.pushNotifications ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
              
              <div className="h-px bg-gray-100 mx-0" />
              
              <div className="flex items-center justify-between py-4">
                <div className="flex-1">
                  <p className="font-medium text-gray-900">周报</p>
                  <p className="text-sm text-gray-500 mt-0.5">每周工作总结</p>
                </div>
                <button
                  className={`w-12 h-6 rounded-full transition-colors ${
                    notificationSettings.weeklyReports ? 'bg-blue-500' : 'bg-gray-200'
                  }`}
                  onClick={() => handleNotificationChange('weeklyReports', !notificationSettings.weeklyReports)}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-md transition-transform ${
                    notificationSettings.weeklyReports ? 'translate-x-6' : 'translate-x-0.5'
                  }`} />
                </button>
              </div>
            </div>
            
            {/* 保存按钮 */}
            <div className="pt-4 pb-6">
              <button
                className="w-full py-3.5 px-4 bg-blue-500 text-white rounded-xl font-medium hover:bg-blue-600 transition-colors active:bg-blue-700"
                onClick={() => {
                  setShowNotificationSettings(false);
                  console.log('Notification settings saved');
                }}
              >
                保存设置
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}