'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

// 直接导入业务组件
import { MobileLayout } from '@/components/layout/MobileLayout'
import { TopNavigation } from '@/components/navigation/TopNavigation'
import { BottomNavigation } from '@/components/navigation/BottomNavigation'
import { TaskCard } from '@/components/tasks/TaskCard'
import { WorkflowStatus } from '@/components/workflow/WorkflowStatus'
import { QuickActions } from '@/components/dashboard/QuickActions'
import { WorkflowOverview } from '@/components/dashboard/WorkflowOverview'
import { ProfilePage } from '@/components/profile/ProfilePage'
import { MessageCenter } from '@/components/messages/MessageCenter'
import { CreateWorkflow } from '@/components/workflow/CreateWorkflow'
import { AccountSettings } from '@/components/settings/AccountSettings'
import { SecuritySettings } from '@/components/settings/SecuritySettings'
import { HelpCenter } from '@/components/help/HelpCenter'
import { FormExample } from '@/components/forms/FormExample'
import { Modal } from '@/components/common/Modal'

// 导入类型和常量
import type { Task, WorkflowStep, DashboardStats } from '@/types'
import { MOCK_TASKS, MOCK_WORKFLOW_STEPS, MOCK_STATS } from '@/constants/mockData'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('home')
  const [currentPage, setCurrentPage] = useState<string | null>(null)
  const [filteredTasks, setFilteredTasks] = useState(MOCK_TASKS)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [activeFilters, setActiveFilters] = useState(0)
  const [dialogVisible, setDialogVisible] = useState(false)

  const handleSearch = (query: string) => {
    if (!query.trim()) {
      setFilteredTasks(MOCK_TASKS)
      return
    }
    
    const filtered = MOCK_TASKS.filter(task => 
      task.title.toLowerCase().includes(query.toLowerCase()) ||
      task.description.toLowerCase().includes(query.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredTasks(filtered)
  }

  const handleFilter = (filters: any) => {
    let filtered = [...MOCK_TASKS]
    let filterCount = 0

    if (filters.status) {
      filtered = filtered.filter(task => task.status === filters.status)
      filterCount++
    }
    
    if (filters.priority) {
      filtered = filtered.filter(task => task.priority === filters.priority)
      filterCount++
    }
    
    if (filters.assignee) {
      const assigneeMap: { [key: string]: string } = {
        'zhang': '张三',
        'li': '李四',
        'wang': '王五',
        'zhao': '赵六'
      }
      filtered = filtered.filter(task => task.assignee.name === assigneeMap[filters.assignee])
      filterCount++
    }
    
    if (filters.dateRange) {
      const today = new Date()
      const todayStr = today.toISOString().split('T')[0]
      
      switch (filters.dateRange) {
        case 'today':
          filtered = filtered.filter(task => task.dueDate === todayStr)
          break
        case 'week':
          const weekFromNow = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate)
            return dueDate >= today && dueDate <= weekFromNow
          })
          break
        case 'overdue':
          filtered = filtered.filter(task => {
            const dueDate = new Date(task.dueDate)
            return dueDate < today && task.status !== 'completed'
          })
          break
      }
      filterCount++
    }

    setFilteredTasks(filtered)
    setActiveFilters(filterCount)
  }

  const handleTaskClick = (task: Task) => {
    setSelectedTask(task)
    setDialogVisible(true)
  }

  const handleQuickAction = (actionId: string) => {
    console.log('Quick action clicked:', actionId)
    switch (actionId) {
      case 'create_workflow':
        setActiveTab('create')
        break
      case 'my_tasks':
        setActiveTab('tasks')
        handleFilter({ assignee: 'zhang' })
        break
      case 'pending_approval':
        setActiveTab('tasks')
        handleFilter({ status: 'pending' })
        break
      case 'form_example':
        setCurrentPage('form')
        break
      default:
        break
    }
  }

  const handleNavigateToSettings = (settingType: string) => {
    setCurrentPage(settingType)
  }

  const handleBackToProfile = () => {
    setCurrentPage(null)
  }

  const handleBackToHome = () => {
    setCurrentPage(null)
    setActiveTab('home')
  }

  // 页面路由处理
  if (currentPage === 'account') {
    return (
      <MobileLayout>
        <AccountSettings onBack={handleBackToProfile} />
      </MobileLayout>
    )
  }

  if (currentPage === 'security') {
    return (
      <MobileLayout>
        <SecuritySettings onBack={handleBackToProfile} />
      </MobileLayout>
    )
  }

  if (currentPage === 'help') {
    return (
      <MobileLayout>
        <HelpCenter onBack={handleBackToProfile} />
      </MobileLayout>
    )
  }

  if (currentPage === 'form') {
    return <FormExample onBack={handleBackToHome} />
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="pb-20">
            <WorkflowOverview stats={MOCK_STATS} />
            <QuickActions onActionClick={handleQuickAction} />
            
            {/* 开发示例入口 */}
            <div className="px-4 mt-4">
              <div className="wechat-card p-4">
                <h3 className="font-medium text-gray-900 mb-3">开发示例</h3>
                <button
                  onClick={() => setCurrentPage('form')}
                  className="w-full p-3 text-left bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors touch-feedback"
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
        )
      
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
        )
      
      case 'create':
        return <CreateWorkflow onBack={() => setActiveTab('home')} />
      
      case 'messages':
        return <MessageCenter onBack={() => setActiveTab('home')} />
      
      case 'profile':
        return (
          <ProfilePage 
            onNavigateToSettings={handleNavigateToSettings}
          />
        )
      
      default:
        return null
    }
  }

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
              steps={MOCK_WORKFLOW_STEPS}
              title="工作流程"
            />
          </div>
        )}
      </Modal>
    </MobileLayout>
  )
}