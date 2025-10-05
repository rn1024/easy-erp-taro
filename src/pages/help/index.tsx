import React, { useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input } from '@tarojs/components'
import { Button } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { SectionCard, Icon } from '@/components/common'

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
  const [activeCategory, setActiveCategory] = useState('all')
  const [expandedFAQ, setExpandedFAQ] = useState<string | null>(null)

  const categories: HelpCategory[] = [
    {
      id: 'inventory',
      name: '库存管理',
      iconName: 'inventory_2',
      description: '成品散件库存查询管理',
      count: 15,
      color: '#3b82f6'
    },
    {
      id: 'product',
      name: '产品管理',
      iconName: 'category',
      description: '产品信息和分类管理',
      count: 12,
      color: '#10b981'
    },
    {
      id: 'warehouse',
      name: '仓库作业',
      iconName: 'warehouse',
      description: '包装发货任务管理',
      count: 10,
      color: '#f59e0b'
    },
    {
      id: 'account',
      name: '账户设置',
      iconName: 'person',
      description: '个人信息和安全设置',
      count: 6,
      color: '#f59e0b'
    },
    {
      id: 'notification',
      name: '通知消息',
      iconName: 'notifications_none',
      description: '消息提醒和通知设置',
      count: 4,
      color: '#8b5cf6'
    }
  ]

  const faqs: FAQ[] = [
    {
      id: '1',
      question: '如何查询库存数量？',
      answer: '进入库存管理页面，可以通过搜索框输入产品名称或SKU进行查询。支持按店铺、分类等条件筛选。',
      category: 'inventory',
      helpful: 48
    },
    {
      id: '2',
      question: '成品和散件库存有什么区别？',
      answer: '成品库存是已完成生产的产品，可直接销售；散件库存是生产原料或半成品，需要组装后才能销售。',
      category: 'inventory',
      helpful: 42
    },
    {
      id: '3',
      question: '如何添加新产品？',
      answer: '在产品管理页面点击"添加产品"，填写产品名称、分类、价格等基本信息，上传产品图片后保存。',
      category: 'product',
      helpful: 38
    },
    {
      id: '4',
      question: '如何修改产品信息？',
      answer: '在产品列表中点击要修改的产品，进入详情页面后点击"编辑"按钮，修改相关信息并保存。',
      category: 'product',
      helpful: 35
    },
    {
      id: '5',
      question: '仓库包装任务怎么处理？',
      answer: '在仓库管理页面查看待包装任务，点击任务卡片查看详情，按要求完成包装后更新任务状态。',
      category: 'warehouse',
      helpful: 32
    },
    {
      id: '6',
      question: '发货任务如何操作？',
      answer: '在发货任务列表中选择待发货订单，确认收货地址和物流信息，生成运单号后标记为已发货。',
      category: 'warehouse',
      helpful: 28
    },
    {
      id: '7',
      question: '如何修改个人信息？',
      answer: '进入"个人中心"页面，点击"编辑资料"，可修改头像、姓名、电话等个人信息。',
      category: 'account',
      helpful: 25
    },
    {
      id: '8',
      question: '忘记密码了怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册手机号，按提示重置密码。',
      category: 'account',
      helpful: 22
    },
    {
      id: '9',
      question: '如何设置消息通知？',
      answer: '在个人中心的"通知设置"中，可以分别开启或关闭任务提醒、系统通知等消息推送。',
      category: 'notification',
      helpful: 18
    },
    {
      id: '10',
      question: '扫码查询功能怎么使用？',
      answer: '在查询页面点击"扫码查询"，对准产品二维码或条形码扫描，即可快速查看产品信息和库存状态。',
      category: 'inventory',
      helpful: 15
    }
  ]

  const supportContacts = [
    {
      id: 'chat',
      title: '在线客服',
      description: '9:00-18:00 工作日',
      iconName: 'chat_bubble',
      color: '#10b981'
    },
    {
      id: 'phone',
      title: '电话支持',
      description: '400-123-4567',
      iconName: 'phone',
      color: '#3b82f6'
    },
    {
      id: 'email',
      title: '邮件支持',
      description: 'support@company.com',
      iconName: 'email',
      color: '#f59e0b'
    }
  ]

  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleFAQToggle = (faqId: string) => {
    setExpandedFAQ(expandedFAQ === faqId ? null : faqId)
  }

  const handleHelpful = (_faqId: string) => {
    Taro.showToast({ title: '感谢您的反馈', icon: 'success' })
  }

  const tabs = [
    { id: 'all', label: '全部' },
    { id: 'faq', label: '常见问题' },
    { id: 'inventory', label: '库存管理' },
    { id: 'product', label: '产品管理' },
    { id: 'warehouse', label: '仓库作业' },
    { id: 'account', label: '账户设置' },
    { id: 'notification', label: '通知消息' }
  ]

  const handleBackClick = () => {
    Taro.navigateBack()
  }

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId)
  }

  const handleContactClick = (contactId: string) => {
    switch (contactId) {
    case 'chat':
      Taro.showToast({ title: '正在连接客服...', icon: 'loading' })
      break
    case 'phone':
      Taro.makePhoneCall({ phoneNumber: '4001234567' })
      break
    case 'email':
      Taro.showToast({ title: '请发送邮件至support@company.com', icon: 'none' })
      break
    }
  }

  return (
    <MobileLayout className='help-page'>
      {/* 顶部导航 */}
      <View className='help-page__header'>
        <View className='help-page__header-content'>
          <View className='help-page__back-button' onClick={handleBackClick}>
            <Icon name='arrow_back' size={16} color='#374151' />
          </View>
          <Text className='help-page__title'>帮助中心</Text>
        </View>
      </View>

      <View className='help-page__content'>
        {/* 搜索框 */}
        <View className='help-page__search'>
          <View className='help-page__search-input'>
            <Icon name='search' size={16} color='#9ca3af' />
            <Input
              className='help-page__search-field'
              value={searchQuery}
              onInput={(e) => setSearchQuery(e.detail.value)}
              placeholder='搜索帮助内容...'
            />
          </View>
        </View>

        {/* 标签导航 */}
        <View className='help-page__tabs'>
          {tabs.map((tab) => (
            <Button
              key={tab.id}
              className={`help-page__tab ${
                activeCategory === tab.id ? 'help-page__tab--active' : ''
              }`}
              onClick={() => setActiveCategory(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </View>

        {/* 全部页面 */}
        {activeCategory === 'all' && (
          <View className='help-page__all-content'>
            {/* 帮助分类 */}
            <SectionCard title='帮助分类' className='help-page__categories-section'>
              <View className='help-page__categories'>
                {categories.map(category => (
                  <View 
                    key={category.id} 
                    className='help-page__category'
                    onClick={() => handleCategoryClick(category.id)}
                  >
                    <View className='help-page__category-icon' style={{ backgroundColor: category.color }}>
                      <Icon name={category.iconName} size={20} color='#ffffff' />
                    </View>
                    <View className='help-page__category-content'>
                      <Text className='help-page__category-title'>{category.name}</Text>
                      <Text className='help-page__category-desc'>{category.description}</Text>
                      <Text className='help-page__category-count'>{category.count}个问题</Text>
                    </View>
                  </View>
                ))}
              </View>
            </SectionCard>

            {/* 联系支持 */}
            <SectionCard title='联系支持' className='help-page__support-section'>
              <View className='help-page__support-list'>
                {supportContacts.map(contact => (
                  <View 
                    key={contact.id} 
                    className='help-page__support-item'
                    onClick={() => handleContactClick(contact.id)}
                  >
                    <View className='help-page__support-icon' style={{ backgroundColor: contact.color }}>
                      <Icon name={contact.iconName} size={16} color='#ffffff' />
                    </View>
                    <View className='help-page__support-content'>
                      <Text className='help-page__support-title'>{contact.title}</Text>
                      <Text className='help-page__support-desc'>{contact.description}</Text>
                    </View>
                    <Icon name='chevron_right' size={16} color='#9ca3af' />
                  </View>
                ))}
              </View>
            </SectionCard>
          </View>
        )}

        {/* FAQ页面和分类页面 */}
        {(activeCategory === 'faq' || categories.some(c => c.id === activeCategory)) && (
          <View className='help-page__faq-content'>
            <View className='help-page__faq-header'>
              <Text className='help-page__faq-title'>
                {activeCategory === 'faq' ? '常见问题' : categories.find(c => c.id === activeCategory)?.name}
              </Text>
              <Text className='help-page__faq-count'>
                {activeCategory === 'faq' 
                  ? `${filteredFAQs.length}个问题`
                  : `${faqs.filter(faq => faq.category === activeCategory).length}个问题`
                }
              </Text>
            </View>
            
            {filteredFAQs.length === 0 ? (
              <View className='help-page__empty'>
                <Icon name='help_outline' size={48} color='#d1d5db' />
                <Text className='help-page__empty-text'>没有找到相关问题</Text>
              </View>
            ) : (
              <View className='help-page__faq-list'>
                {(activeCategory === 'faq' ? filteredFAQs : faqs.filter(faq => faq.category === activeCategory)).map((faq) => (
                  <View key={faq.id} className='help-page__faq-item'>
                    <View 
                      className='help-page__faq-question-row'
                      onClick={() => handleFAQToggle(faq.id)}
                    >
                      <Text className='help-page__faq-question'>{faq.question}</Text>
                      <Icon 
                        name={expandedFAQ === faq.id ? 'expand_less' : 'expand_more'} 
                        size={16} 
                        color='#9ca3af' 
                      />
                    </View>
                    {expandedFAQ === faq.id && (
                      <View className='help-page__faq-answer-section'>
                        <Text className='help-page__faq-answer'>{faq.answer}</Text>
                        <View className='help-page__faq-meta'>
                          <View className='help-page__faq-meta-left'>
                            <Text className='help-page__faq-category'>
                              {categories.find(c => c.id === faq.category)?.name}
                            </Text>
                            <Text className='help-page__faq-helpful'>
                              {faq.helpful}人觉得有用
                            </Text>
                          </View>
                          <Button
                            className='help-page__helpful-button'
                            onClick={() => handleHelpful(faq.id)}
                          >
                            有用
                          </Button>
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