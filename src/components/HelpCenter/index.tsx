import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
  SearchBar,
  Tabs,
  Cell,
  CellGroup,
  Badge,
  Collapse,
  CollapseItem,
  Button,
  Grid,
  GridItem
} from '@nutui/nutui-react-taro'
import {
  ArrowLeft,
  Ask,
  Search,
  Service,
  Phone,
  Mail as MailIcon,
  ArrowRight
} from '@nutui/icons-react-taro'
import Taro from '@tarojs/taro'
import { cn } from '../../utils/cn'
import './index.scss'

interface HelpCenterProps {
  onBack?: () => void
  className?: string
}

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
  icon: string
  description: string
  count: number
}

/**
 * 帮助中心组件
 * 提供FAQ、使用指南、联系客服等功能
 */
const HelpCenter: React.FC<HelpCenterProps> = ({
  onBack,
  className
}) => {
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState('0')
  const [expandedFAQ, setExpandedFAQ] = useState<string[]>([])

  const categories: HelpCategory[] = [
    {
      id: 'workflow',
      name: '工作流程',
      icon: 'document',
      description: '工作流创建、管理和使用',
      count: 12
    },
    {
      id: 'task',
      name: '任务管理',
      icon: 'checklist',
      description: '任务分配、状态和协作',
      count: 8
    },
    {
      id: 'account',
      name: '账户设置',
      icon: 'user',
      description: '个人信息和安全设置',
      count: 6
    },
    {
      id: 'notification',
      name: '通知消息',
      icon: 'notice',
      description: '消息提醒和通知设置',
      count: 4
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
    const matchesSearch = !searchQuery ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())

    if (activeTab === '0') return matchesSearch // 全部
    if (activeTab === '1') return matchesSearch // 常见问题

    // 分类筛选
    const categoryIndex = parseInt(activeTab) - 2
    if (categoryIndex >= 0 && categoryIndex < categories.length) {
      return matchesSearch && faq.category === categories[categoryIndex].id
    }

    return matchesSearch
  })

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      Taro.navigateBack()
    }
  }

  const handleHelpful = (faqId: string) => {
    Taro.showToast({
      title: '感谢您的反馈',
      icon: 'success',
      duration: 1500
    })
  }

  const handleContactSupport = (type: 'online' | 'phone' | 'email') => {
    switch (type) {
      case 'online':
        Taro.showToast({
          title: '正在连接客服...',
          icon: 'loading',
          duration: 1500
        })
        break
      case 'phone':
        Taro.makePhoneCall({
          phoneNumber: '4001234567'
        })
        break
      case 'email':
        Taro.setClipboardData({
          data: 'support@company.com',
          success: () => {
            Taro.showToast({
              title: '邮箱已复制',
              icon: 'success'
            })
          }
        })
        break
    }
  }

  const tabList = [
    { title: '全部' },
    { title: '常见问题' },
    ...categories.map(cat => ({ title: cat.name }))
  ]

  return (
    <View className={cn('help-center', className)}>
      {/* 顶部导航 */}
      <View className="nav-header">
        <View className="nav-content">
          <View className="nav-left" onClick={handleBack}>
            <ArrowLeft size="20" />
            <Text className="nav-title">帮助中心</Text>
          </View>
        </View>
      </View>

      {/* 搜索框 */}
      <View className="search-section">
        <SearchBar
          placeholder="搜索帮助内容..."
          value={searchQuery}
          onChange={(value) => setSearchQuery(value)}
          shape="round"
        />
      </View>

      {/* 内容区域 */}
      <View className="help-content">
        <Tabs
          value={activeTab}
          onChange={(value) => setActiveTab(String(value))}
          className="help-tabs"
        >
          <Tabs.TabPane title="全部">
            {/* 帮助分类 */}
            <View className="category-section">
              <Text className="section-title">帮助分类</Text>
              <Grid columns={2} gap={12}>
                {categories.map((category) => (
                  <GridItem key={category.id}>
                    <View
                      className="category-card"
                      onClick={() => {
                        const index = categories.findIndex(c => c.id === category.id)
                        setActiveTab(String(index + 2))
                      }}
                    >
                      <View className="category-icon">
                        <Ask size="20" />
                      </View>
                      <View className="category-info">
                        <Text className="category-name">{category.name}</Text>
                        <Text className="category-desc">{category.description}</Text>
                        <Badge value={`${category.count}个问题`} />
                      </View>
                    </View>
                  </GridItem>
                ))}
              </Grid>
            </View>

            {/* 联系支持 */}
            <CellGroup title="联系支持" className="contact-section">
              <Cell
                title="在线客服"
                description="9:00-18:00 工作日"
                extra={<ArrowRight size="16" />}
                onClick={() => handleContactSupport('online')}
                className="contact-item"
              >
                <Service size="20" className="contact-icon online" />
              </Cell>
              <Cell
                title="电话支持"
                description="400-123-4567"
                extra={<ArrowRight size="16" />}
                onClick={() => handleContactSupport('phone')}
                className="contact-item"
              >
                <Phone size="20" className="contact-icon phone" />
              </Cell>
              <Cell
                title="邮件支持"
                description="support@company.com"
                extra={<ArrowRight size="16" />}
                onClick={() => handleContactSupport('email')}
                className="contact-item"
              >
                <MailIcon size="20" className="contact-icon email" />
              </Cell>
            </CellGroup>
          </Tabs.TabPane>

          <Tabs.TabPane title="常见问题">
            <View className="faq-section">
              <View className="faq-header">
                <Text className="section-title">常见问题</Text>
                <Badge value={`${filteredFAQs.length}个问题`} />
              </View>

              {filteredFAQs.length === 0 ? (
                <View className="empty-state">
                  <Ask size="48" color="#ccc" />
                  <Text className="empty-text">没有找到相关问题</Text>
                </View>
              ) : (
                <Collapse
                  activeName={expandedFAQ}
                  onChange={(value) => setExpandedFAQ(value as string[])}
                  accordion={false}
                >
                  {filteredFAQs.map((faq) => (
                    <CollapseItem
                      key={faq.id}
                      name={faq.id}
                      title={faq.question}
                    >
                      <View className="faq-content">
                        <Text className="faq-answer">{faq.answer}</Text>
                        <View className="faq-footer">
                          <View className="faq-meta">
                            <Badge value={categories.find(c => c.id === faq.category)?.name || ''} />
                            <Text className="helpful-count">{faq.helpful}人觉得有用</Text>
                          </View>
                          <Button
                            type="primary"
                            size="small"
                            plain
                            onClick={() => handleHelpful(faq.id)}
                          >
                            有用
                          </Button>
                        </View>
                      </View>
                    </CollapseItem>
                  ))}
                </Collapse>
              )}
            </View>
          </Tabs.TabPane>

          {/* 分类页面 */}
          {categories.map((category, index) => (
            <Tabs.TabPane key={category.id} title={category.name}>
              <View className="faq-section">
                <View className="faq-header">
                  <Text className="section-title">{category.name}</Text>
                  <Badge value={`${faqs.filter(f => f.category === category.id).length}个问题`} />
                </View>

                <Collapse
                  activeName={expandedFAQ}
                  onChange={(value) => setExpandedFAQ(value as string[])}
                  accordion={false}
                >
                  {faqs.filter(f => f.category === category.id).map((faq) => (
                    <CollapseItem
                      key={faq.id}
                      name={faq.id}
                      title={faq.question}
                    >
                      <View className="faq-content">
                        <Text className="faq-answer">{faq.answer}</Text>
                        <View className="faq-footer">
                          <Text className="helpful-count">{faq.helpful}人觉得有用</Text>
                          <Button
                            type="primary"
                            size="small"
                            plain
                            onClick={() => handleHelpful(faq.id)}
                          >
                            有用
                          </Button>
                        </View>
                      </View>
                    </CollapseItem>
                  ))}
                </Collapse>
              </View>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </View>
    </View>
  )
}

export default HelpCenter
