import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import './index.scss'

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface HelpCategory {
  id: string
  name: string
  iconName: string
  description: string
  count: number
  color: string
}

const Help: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories: HelpCategory[] = [
    {
      id: 'workflow',
      name: '工作流程',
      iconName: 'build',
      description: '工作流创建、管理和使用',
      count: 12,
      color: '#1890ff'
    },
    {
      id: 'task',
      name: '任务管理',
      iconName: 'task',
      description: '任务分配、状态和协作',
      count: 8,
      color: '#52c41a'
    },
    {
      id: 'account',
      name: '账户设置',
      iconName: 'person',
      description: '个人信息和安全设置',
      count: 6,
      color: '#fa8c16'
    },
    {
      id: 'notification',
      name: '通知消息',
      iconName: 'notifications',
      description: '消息提醒和通知设置',
      count: 4,
      color: '#722ed1'
    }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: '如何创建新的工作流程？',
      answer: '您可以在首页点击"创建流程"按钮，选择合适的模板或自定义创建工作流程。填写必要信息后即可创建成功。',
      category: 'workflow',
      helpful: 45
    },
    {
      id: '2',
      question: '如何分配任务给团队成员？',
      answer: '在工作流程中，您可以为每个步骤指定负责人。也可以在任务详情页面重新分配责任人。',
      category: 'task',
      helpful: 38
    },
    {
      id: '3',
      question: '如何修改个人信息？',
      answer: '进入"我的"页面，点击"账户设置"，然后点击"编辑"按钮即可修改个人信息。',
      category: 'account',
      helpful: 32
    },
    {
      id: '4',
      question: '如何设置消息通知？',
      answer: '在"我的"页面中选择"通知设置"，您可以自定义各种通知的开启状态。',
      category: 'notification',
      helpful: 28
    },
    {
      id: '5',
      question: '工作流程可以设置几个审批环节？',
      answer: '工作流程最多可以设置10个审批环节，每个环节可以设置多个审批人并支持并行或串行审批。',
      category: 'workflow',
      helpful: 25
    },
    {
      id: '6',
      question: '如何查看任务的历史记录？',
      answer: '在任务详情页面向下滑动，可以查看完整的操作历史记录，包括状态变更、评论等。',
      category: 'task',
      helpful: 22
    },
    {
      id: '7',
      question: '忘记密码了怎么办？',
      answer: '您可以在登录页面点击"忘记密码"，通过注册邮箱或手机号重置密码。',
      category: 'account',
      helpful: 18
    },
    {
      id: '8',
      question: '如何关闭某些类型的推送通知？',
      answer: '在通知设置页面，您可以分别控制任务提醒、邮件通知、推送通知等的开启状态。',
      category: 'notification',
      helpful: 15
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeTab === 'all' || faq.category === activeTab
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleHelpful = (faqId: string) => {
    console.log('Marked as helpful:', faqId)
  }

  const supportContacts = [
    {
      id: 'chat',
      title: '在线客服',
      description: '9:00-18:00 工作日',
      iconName: 'chat_bubble',
      color: '#52c41a'
    },
    {
      id: 'phone',
      title: '电话支持',
      description: '400-123-4567',
      iconName: 'phone',
      color: '#1890ff'
    },
    {
      id: 'email',
      title: '邮件支持',
      description: 'support@company.com',
      iconName: 'email',
      color: '#fa8c16'
    }
  ]

  return (
    <MobileLayout className="help-page">
      <View className="help-page__content">
        {/* 搜索框 */}
        <View className="help-page__search">
          <SearchBar
            placeholder="搜索帮助内容..."
            value={searchQuery}
            onChange={setSearchQuery}
            onSearch={setSearchQuery}
          />
        </View>

        {/* 分类标签 */}
        <View className="help-page__tabs">
          <View className="help-page__tabs-container">
            <View
              className={`help-page__tab ${activeTab === 'all' ? 'help-page__tab--active' : ''}`}
              onClick={() => setActiveTab('all')}
            >
              <Text className="help-page__tab-text">全部</Text>
            </View>
            <View
              className={`help-page__tab ${activeTab === 'faq' ? 'help-page__tab--active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <Text className="help-page__tab-text">常见问题</Text>
            </View>
            <View
              className={`help-page__tab ${activeTab === 'workflow' ? 'help-page__tab--active' : ''}`}
              onClick={() => setActiveTab('workflow')}
            >
              <Text className="help-page__tab-text">工作流程</Text>
            </View>
            <View
              className={`help-page__tab ${activeTab === 'task' ? 'help-page__tab--active' : ''}`}
              onClick={() => setActiveTab('task')}
            >
              <Text className="help-page__tab-text">任务管理</Text>
            </View>
            <View
              className={`help-page__tab ${activeTab === 'account' ? 'help-page__tab--active' : ''}`}
              onClick={() => setActiveTab('account')}
            >
              <Text className="help-page__tab-text">账户设置</Text>
            </View>
          </View>
        </View>

        {/* 全部页面 */}
        {activeTab === 'all' && (
          <View className="help-page__all-content">
            {/* 帮助分类 */}
            <View className="help-page__section">
              <Text className="help-page__section-title">帮助分类</Text>
              <View className="help-page__categories-grid">
                {categories.map((category) => (
                  <View
                    key={category.id}
                    className="help-page__category-card"
                    onClick={() => setActiveTab(category.id)}
                  >
                    <View className="help-page__category-content">
                      <View 
                        className="help-page__category-icon"
                        style={{ backgroundColor: `${category.color}15` }}
                      >
                        <MaterialIcons 
                          name={category.iconName} 
                          size={24} 
                          color={category.color} 
                        />
                      </View>
                      <View className="help-page__category-info">
                        <Text className="help-page__category-name">{category.name}</Text>
                        <Text className="help-page__category-desc">{category.description}</Text>
                        <Text className="help-page__category-count">{category.count}个问题</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

                         {/* 联系支持 */}
             <View className="help-page__section">
               <Text className="help-page__section-title">联系支持</Text>
               <View className="help-page__support-list">
                 {supportContacts.map((contact) => (
                   <View key={contact.id} className="help-page__support-item">
                     <View 
                       className="help-page__support-icon"
                       style={{ backgroundColor: `${contact.color}15` }}
                     >
                       <MaterialIcons 
                         name={contact.iconName} 
                         size={20} 
                         color={contact.color} 
                       />
                     </View>
                     <View className="help-page__support-content">
                       <Text className="help-page__support-title">{contact.title}</Text>
                       <Text className="help-page__support-desc">{contact.description}</Text>
                     </View>
                     <MaterialIcons name="keyboard_arrow_right" size={20} color="#bbb" />
                   </View>
                 ))}
               </View>
             </View>
          </View>
        )}

                 {/* FAQ页面和分类页面 */}
         {(activeTab === 'faq' || categories.some(c => c.id === activeTab)) && (
           <View className="help-page__faq-content">
             <View className="help-page__faq-header">
               <Text className="help-page__section-title">
                 {activeTab === 'faq' 
                   ? '常见问题' 
                   : categories.find(c => c.id === activeTab)?.name
                 }
               </Text>
               <View className="help-page__faq-count">
                 <Text>
                   {activeTab === 'faq' 
                     ? `${filteredFAQs.length}个问题`
                     : `${filteredFAQs.length}个问题`
                   }
                 </Text>
               </View>
             </View>
             
             {filteredFAQs.length === 0 ? (
               <View className="help-page__empty">
                 <MaterialIcons name="help_outline" size={48} color="#d9d9d9" />
                 <Text className="help-page__empty-text">没有找到相关问题</Text>
               </View>
             ) : (
               <View className="help-page__faq-list">
                 {filteredFAQs.map((faq) => (
                  <View key={faq.id} className="help-page__faq-card">
                    <View 
                      className="help-page__faq-header-item"
                      onClick={() => handleFAQToggle(faq.id)}
                    >
                      <Text className="help-page__faq-question">{faq.question}</Text>
                      <MaterialIcons 
                        name={expandedFAQ === faq.id ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
                        size={20} 
                        color="#999" 
                      />
                    </View>
                    {expandedFAQ === faq.id && (
                      <View className="help-page__faq-answer">
                        <Text className="help-page__faq-answer-text">{faq.answer}</Text>
                        <View className="help-page__faq-footer">
                          <View className="help-page__faq-meta">
                            <View className="help-page__faq-tag">
                              <Text>{categories.find(c => c.id === faq.category)?.name}</Text>
                            </View>
                            <Text className="help-page__faq-helpful">{faq.helpful}人觉得有用</Text>
                          </View>
                          <View 
                            className="help-page__faq-helpful-btn"
                            onClick={() => handleHelpful(faq.id)}
                          >
                            <Text>有用</Text>
                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            )}
          </View>
        )}
      </View>
    </MobileLayout>
  )
}

export default Help 