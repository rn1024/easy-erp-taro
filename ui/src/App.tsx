import React, { useState } from 'react';
import { X } from 'lucide-react';
import TopNavigation from './components/TopNavigation';
import TaskCard from './components/TaskCard';
import WorkflowStatus from './components/WorkflowStatus';
import BottomNavigation from './components/BottomNavigation';
import QuickActions from './components/QuickActions';
import WorkflowOverview from './components/WorkflowOverview';
import ProfilePage from './components/ProfilePage';
import MessageCenter from './components/MessageCenter';
import CreateWorkflow from './components/CreateWorkflow';
import AccountSettings from './components/AccountSettings';
import SecuritySettings from './components/SecuritySettings';
import HelpCenter from './components/HelpCenter';
import FormExample from './components/FormExample';
import ComponentsDemo from './components/ComponentsDemo';
import MobileLayout from './components/MobileLayout';
import LoginPage from './components/LoginPage';

// 模拟数据
const mockTasks = [
  {
    id: '1',
    title: '产品需求评审',
    description: '对新版本产品功能进行需求评审，确认技术实现方案',
    status: 'progress' as const,
    priority: 'high' as const,
    assignee: {
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-25',
    createdAt: '2025-06-20',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '技术评审'
    }
  },
  {
    id: '2',
    title: '用户界面设计',
    description: '完成新功能的UI/UX设计，包括原型图和交互说明',
    status: 'pending' as const,
    priority: 'medium' as const,
    assignee: {
      name: '李四',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-28',
    createdAt: '2025-06-21',
    workflow: {
      currentStep: 1,
      totalSteps: 3,
      stepName: '设计初稿'
    }
  },
  {
    id: '3',
    title: '数据库优化',
    description: '优化数据库查询性能，提升系统响应速度',
    status: 'completed' as const,
    priority: 'high' as const,
    assignee: {
      name: '王五',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-22',
    createdAt: '2025-06-18',
    workflow: {
      currentStep: 3,
      totalSteps: 3,
      stepName: '已完成'
    }
  },
  {
    id: '4',
    title: '移动端适配',
    description: '完成移动端响应式设计适配，确保各设备正常显示',
    status: 'rejected' as const,
    priority: 'low' as const,
    assignee: {
      name: '赵六',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    },
    dueDate: '2025-06-20',
    createdAt: '2025-06-15',
    workflow: {
      currentStep: 2,
      totalSteps: 4,
      stepName: '设计审查'
    }
  }
];

const mockWorkflowSteps = [
  {
    id: '1',
    name: '需求确认',
    status: 'completed' as const,
    assignee: {
      name: '产品经理',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face'
    },
    completedAt: '2025-06-20T10:30:00',
    comment: '需求已确认，可以进入下一步'
  },
  {
    id: '2',
    name: '技术评审',
    status: 'current' as const,
    assignee: {
      name: '技术负责人',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '3',
    name: '开发实现',
    status: 'pending' as const,
    assignee: {
      name: '开发工程师',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=32&h=32&fit=crop&crop=face'
    }
  },
  {
    id: '4',
    name: '测试验收',
    status: 'pending' as const,
    assignee: {
      name: '测试工程师',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=face'
    }
  }
];

const mockStats = {
  totalTasks: 24,
  completedTasks: 18,
  pendingTasks: 4,
  overdueTasks: 2,
  activeUsers: 12,
  completionRate: 75,
  avgCompletionTime: '2.5天',
  trend: 'up' as const
};

// 简单的模态框组件
const Modal = ({ isOpen, onClose, title, children }: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(80vh-80px)]">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  // 强制显示登录页面进行对比
  return <LoginPage onLogin={handleLogin} />;
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('home');
  const [currentPage, setCurrentPage] = useState<string | null>(null);
  const [filteredTasks, setFilteredTasks] = useState(mockTasks);
  const [selectedTask, setSelectedTask] = useState<any>(null);
  const [activeFilters, setActiveFilters] = useState(0);
  const [dialogVisible, setDialogVisible] = useState(false);

  const handleLogin = (user: any) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsLoggedIn(false);
    setActiveTab('home');
    setCurrentPage(null);
  };

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTasks(mockTasks);
      return;
    }
    
    const filtered = mockTasks.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredTasks(filtered);
  };

  const handleFilter = (filters: any) => {
    let filtered = [...mockTasks];
    let filterCount = 0;

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status);
      filterCount++;
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority);
      filterCount++;
    }
    
    if (filters.assignee) {
      const assigneeMap: { [key: string]: string } = {
        'zhang': '张三',
        'li': '李四',
        'wang': '王五',
        'zhao': '赵六'
      };
      filtered = filtered.filter(task => task.assignee.name === assigneeMap[filters.assignee]);
      filterCount++;
    }
    
    if (filters.dateRange) {
      const today = new Date();
      const todayStr = today.toISOString().split('T')[0];
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(task => task.dueDate === todayStr);
          break;
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate >= today && dueDate <= weekFromNow;
          });
          break;
        case 'overdue':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate);
            return dueDate < today && task.status !== 'completed';
          });
          break;
      }
      filterCount++;
    }

    setFilteredTasks(filtered);
    setActiveFilters(filterCount);
  };

  const handleTaskClick = (task: any) => {
    setSelectedTask(task);
    setDialogVisible(true);
  };

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action clicked:', actionId);
    switch (actionId) {
      case 'create_workflow':
        setActiveTab('create');
        break;
      case 'my_tasks':
        setActiveTab('tasks');
        handleFilter({ assignee: 'zhang' });
        break;
      case 'pending_approval':
        setActiveTab('tasks');
        handleFilter({ status: 'pending' });
        break;
      case 'form_example':
        setCurrentPage('form');
        break;
      default:
        break;
    }
  };

  const handleNavigateToSettings = (settingType: string) => {
    setCurrentPage(settingType);
  };

  const handleBackToProfile = () => {
    setCurrentPage(null);
  };

  const handleBackToHome = () => {
    setCurrentPage(null);
    setActiveTab('home');
  };

  // 如果未登录，显示登录页面
  // if (!isLoggedIn) {
  //   return <LoginPage onLogin={handleLogin} />;
  // }

  // 如果有当前页面状态，优先渲染对应页面
  if (currentPage === 'account') {
    return (
      <MobileLayout>
        <AccountSettings onBack={handleBackToProfile} />
      </MobileLayout>
    );
  }

  if (currentPage === 'security') {
    return (
      <MobileLayout>
        <SecuritySettings onBack={handleBackToProfile} />
      </MobileLayout>
    );
  }

  if (currentPage === 'help') {
    return (
      <MobileLayout>
        <HelpCenter onBack={handleBackToProfile} />
      </MobileLayout>
    );
  }

  if (currentPage === 'form') {
    return <FormExample onBack={handleBackToHome} />;
  }

  if (currentPage === 'components') {
    return <ComponentsDemo onBack={handleBackToHome} />;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            <WorkflowOverview stats={mockStats} />
            <QuickActions onActionClick={handleQuickAction} />
            
            {/* 开发示例入口 */}
            <div className="px-4 mt-4">
              <div className="bg-white rounded-lg p-4 shadow-sm">
                <h3 className="font-medium text-gray-900 mb-3">开发示例</h3>
                <div className="space-y-3">
                  <button
                    onClick={() => setCurrentPage('components')}
                    className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">组件展示</p>
                        <p className="text-sm text-gray-500">查看完整的UI组件库和设计规范</p>
                      </div>
                      <div className="text-2xl">🎨</div>
                    </div>
                  </button>
                  
                  <button
                    onClick={() => setCurrentPage('form')}
                    className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">表单组件示例</p>
                        <p className="text-sm text-gray-500">查看完整的表单控件库</p>
                      </div>
                      <div className="text-2xl">📝</div>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      
      case 'tasks':
        return (
          <MobileLayout>
            <TopNavigation 
              onSearch={handleSearch}
              onFilter={handleFilter}
              activeFilters={activeFilters}
            />
            <div className="px-4 py-3">
              <h2 className="font-medium text-gray-900 mb-3">
                任务列表 ({filteredTasks.length})
              </h2>
              <div className="space-y-3 pb-4">
                {filteredTasks.map(task => (
                  <div key={task.id}>
                    <TaskCard 
                      task={task} 
                      onTaskClick={handleTaskClick}
                    />
                  </div>
                ))}
                {filteredTasks.length === 0 && (
                  <div className="text-center py-12 text-gray-500">
                    <div className="text-4xl mb-4">📝</div>
                    <p>暂无符合条件的任务</p>
                  </div>
                )}
              </div>
            </div>
          </MobileLayout>
        );
      
      case 'create':
        return <CreateWorkflow onBack={() => setActiveTab('home')} />;
      
      case 'messages':
        return <MessageCenter onBack={() => setActiveTab('home')} />;
      
      case 'profile':
        return (
          <ProfilePage 
            onNavigateToSettings={handleNavigateToSettings}
            onLogout={handleLogout}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <MobileLayout>
      {renderTabContent()}

      <BottomNavigation 
        activeTab={activeTab}
        onTabChange={setActiveTab}
        messageCount={3}
      />

      {/* 任务详情弹窗 */}
      <Modal
        isOpen={dialogVisible}
        onClose={() => setDialogVisible(false)}
        title="任务详情"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-900 mb-2">{selectedTask.title}</h3>
              <p className="text-sm text-gray-500 mb-3">{selectedTask.description}</p>
            </div>
            
            <WorkflowStatus 
              steps={mockWorkflowSteps}
              title="工作流程"
            />
          </div>
        )}
      </Modal>
    </MobileLayout>
  );
}