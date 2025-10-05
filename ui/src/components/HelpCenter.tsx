import React, { useState } from 'react';
import { ArrowLeft, HelpCircle, Search, ChevronDown, ChevronRight, MessageCircle, Phone, Mail } from 'lucide-react';

interface HelpCenterProps {
  onBack: () => void;
}

interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
  helpful: number;
}

interface HelpCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  description: string;
  count: number;
}

export default function HelpCenter({ onBack }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null);

  const categories: HelpCategory[] = [
    {
      id: 'workflow',
      name: '工作流程',
      icon: HelpCircle,
      description: '工作流创建、管理和使用',
      count: 12
    },
    {
      id: 'task',
      name: '任务管理',
      icon: HelpCircle,
      description: '任务分配、状态和协作',
      count: 8
    },
    {
      id: 'account',
      name: '账户设置',
      icon: HelpCircle,
      description: '个人信息和安全设置',
      count: 6
    },
    {
      id: 'notification',
      name: '通知消息',
      icon: HelpCircle,
      description: '消息提醒和通知设置',
      count: 4
    }
  ];

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
  ];

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId);
  };

  const handleHelpful = (faqId: string) => {
    console.log('Marked as helpful:', faqId);
  };

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'faq', label: '常见问题' },
    { id: 'workflow', label: '工作流程' },
    { id: 'task', label: '任务管理' },
    { id: 'account', label: '账户设置' },
    { id: 'notification', label: '通知消息' }
  ];

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
          <h1 className="font-semibold text-gray-900">帮助中心</h1>
        </div>
      </div>

      {/* 搜索框 */}
      <div className="px-4 py-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="搜索帮助内容..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="px-4">
        {/* 标签导航 */}
        <div className="flex overflow-x-auto gap-2 mb-4 pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                activeCategory === tab.id 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* 全部页面 */}
        {activeCategory === 'all' && (
          <div>
            {/* 帮助分类 */}
            <div className="space-y-3 mb-6">
              <h2 className="font-medium text-gray-900">帮助分类</h2>
              <div className="grid grid-cols-2 gap-3">
                {categories.map((category) => {
                  const Icon = category.icon;
                  return (
                    <div 
                      key={category.id}
                      className="bg-white rounded-lg shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Icon className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium text-gray-900 mb-1">{category.name}</h3>
                          <p className="text-xs text-gray-600 line-clamp-2 mb-2">
                            {category.description}
                          </p>
                          <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                            {category.count}个问题
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 联系支持 */}
            <div className="bg-white rounded-lg shadow-sm mb-6">
              <div className="p-4 pb-3 border-b border-gray-100">
                <h3 className="text-base font-medium">联系支持</h3>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <MessageCircle className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">在线客服</p>
                    <p className="text-xs text-gray-500">9:00-18:00 工作日</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Phone className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">电话支持</p>
                    <p className="text-xs text-gray-500">400-123-4567</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm">邮件支持</p>
                    <p className="text-xs text-gray-500">support@company.com</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* FAQ页面和分类页面 */}
        {(activeCategory === 'faq' || categories.some(c => c.id === activeCategory)) && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="font-medium text-gray-900">
                {activeCategory === 'faq' ? '常见问题' : categories.find(c => c.id === activeCategory)?.name}
              </h2>
              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                {activeCategory === 'faq' 
                  ? `${filteredFAQs.length}个问题`
                  : `${faqs.filter(faq => faq.category === activeCategory).length}个问题`
                }
              </span>
            </div>
            
            {filteredFAQs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <HelpCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>没有找到相关问题</p>
              </div>
            ) : (
              <div className="space-y-2">
                {(activeCategory === 'faq' ? filteredFAQs : faqs.filter(faq => faq.category === activeCategory)).map((faq) => (
                  <div key={faq.id} className="bg-white rounded-lg shadow-sm">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
                      onClick={() => handleFAQToggle(faq.id)}
                    >
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-gray-900 text-sm pr-2">
                          {faq.question}
                        </h3>
                        <ChevronDown 
                          className={`h-4 w-4 text-gray-400 transition-transform flex-shrink-0 ${
                            expandedFAQ === faq.id ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </div>
                    {expandedFAQ === faq.id && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        <p className="text-sm text-gray-600 mb-3">
                          {faq.answer}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xs border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                              {categories.find(c => c.id === faq.category)?.name}
                            </span>
                            <span className="text-xs text-gray-500">
                              {faq.helpful}人觉得有用
                            </span>
                          </div>
                          <button
                            className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 hover:bg-blue-50 rounded transition-colors"
                            onClick={() => handleHelpful(faq.id)}
                          >
                            有用
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}