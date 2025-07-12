import React, { useState } from 'react'
import { View } from '@tarojs/components'
import { 
  SearchBar,
  Cell,
  CellGroup,
  Tag,
  Button
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import './index.scss'

interface HelpCenterProps {
  onBack?: () => void
}

interface FAQ {
  id: string
  question: string
  answer: string
  category: string
  helpful: number
}

interface ContactInfo {
  type: 'phone' | 'wechat' | 'email'
  label: string
  value: string
  hours?: string
}

const HelpCenter: React.FC<HelpCenterProps> = ({ onBack }) => {
  const [searchKeyword, setSearchKeyword] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [expandedItems, setExpandedItems] = useState<string[]>([])

  const categories = [
    { id: 'all', name: '全部' },
    { id: 'workflow', name: '工作流' },
    { id: 'task', name: '任务' },
    { id: 'account', name: '账户' },
    { id: 'notification', name: '通知' }
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
      question: '如何关闭邮件通知？',
      answer: '进入"我的" > "通知设置"，关闭"邮件通知"开关即可。',
      category: 'notification',
      helpful: 15
    }
  ]

  const contactInfo: ContactInfo[] = [
    {
      type: 'phone',
      label: '客服热线',
      value: '400-123-4567',
      hours: '工作日 9:00-18:00'
    },
    {
      type: 'wechat',
      label: '微信客服',
      value: 'EasyERP_Support',
      hours: '7×24小时在线'
    },
    {
      type: 'email',
      label: '邮箱支持',
      value: 'support@easyerp.com',
      hours: '24小时内回复'
    }
  ]

  const quickActions = [
    { id: 'user_guide', title: '用户指南', description: '快速上手指南' },
    { id: 'video_tutorial', title: '视频教程', description: '观看操作演示' },
    { id: 'api_docs', title: 'API文档', description: '开发者文档' },
    { id: 'feedback', title: '意见反馈', description: '提交建议和问题' }
  ]

  // 过滤FAQ
  const filteredFAQs = faqs.filter(faq => {
    const matchCategory = selectedCategory === 'all' || faq.category === selectedCategory
    const matchKeyword = !searchKeyword || 
      faq.question.toLowerCase().includes(searchKeyword.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchKeyword.toLowerCase())
    return matchCategory && matchKeyword
  })

  const handleSearch = (keyword: string) => {
    setSearchKeyword(keyword)
  }

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId)
  }

  const handleHelpful = () => {
    console.log('感谢您的反馈！')
  }

  const handleContactClick = (contact: ContactInfo) => {
    switch (contact.type) {
      case 'phone':
        console.log(`拨打电话：${contact.value}`)
        break
      case 'wechat':
        console.log(`微信号：${contact.value}`)
        break
      case 'email':
        console.log(`邮箱：${contact.value}`)
        break
    }
  }

  const handleQuickAction = (actionId: string) => {
    console.log(`${actionId} 功能开发中`)
  }

  const toggleFAQ = (faqId: string) => {
    setExpandedItems(prev => 
      prev.includes(faqId)
        ? prev.filter(id => id !== faqId)
        : [...prev, faqId]
    )
  }

  return (
    <View className="help-center">
      {/* 自定义头部导航 */}
      <View className="help-center__header">
        <View className="help-center__nav">
          <View className="help-center__back-btn" onClick={onBack}>
            <MaterialIcons name="arrow_back" size={20} color="#333" />
          </View>
          <View className="help-center__title">帮助中心</View>
          <View className="help-center__placeholder" />
        </View>
      </View>

      <View className="help-center__content">
        {/* 搜索框 */}
        <View className="help-center__search">
          <SearchBar
            placeholder="搜索问题或关键词"
            value={searchKeyword}
            onChange={setSearchKeyword}
            onSearch={handleSearch}
            left={<MaterialIcons name="search" size={16} color="#666" />}
          />
        </View>

        {/* 快捷操作 */}
        <View className="help-center__quick-actions">
          <View className="help-center__section-title">快捷操作</View>
          <View className="help-center__actions-grid">
            {quickActions.map((action) => (
              <View
                key={action.id}
                className="help-center__action-item"
                onClick={() => handleQuickAction(action.id)}
              >
                <View className="help-center__action-title">{action.title}</View>
                <View className="help-center__action-desc">{action.description}</View>
              </View>
            ))}
          </View>
        </View>

        {/* 分类标签 */}
        <View className="help-center__categories">
          <View className="help-center__category-list">
            {categories.map((category) => (
              <Tag
                key={category.id}
                className={`help-center__category-tag ${
                  selectedCategory === category.id ? 'help-center__category-tag--active' : ''
                }`}
                onClick={() => handleCategoryChange(category.id)}
                background={selectedCategory === category.id ? '#1890ff' : '#f0f0f0'}
                color={selectedCategory === category.id ? '#fff' : '#666'}
              >
                {category.name}
              </Tag>
            ))}
          </View>
        </View>

        {/* 常见问题 */}
        <View className="help-center__faqs">
          <View className="help-center__section-title">
            常见问题 ({filteredFAQs.length})
          </View>
          
          {filteredFAQs.length > 0 ? (
            <View className="help-center__faq-list">
              {filteredFAQs.map((faq) => (
                <View key={faq.id} className="help-center__faq-item">
                  <View 
                    className="help-center__faq-question"
                    onClick={() => toggleFAQ(faq.id)}
                  >
                    <View className="help-center__faq-title">{faq.question}</View>
                    <View className={`help-center__faq-arrow ${
                      expandedItems.includes(faq.id) ? 'help-center__faq-arrow--expanded' : ''
                    }`}>
                      ＞
                    </View>
                  </View>
                  
                  {expandedItems.includes(faq.id) && (
                    <View className="help-center__faq-content">
                      <View className="help-center__faq-answer">{faq.answer}</View>
                      <View className="help-center__faq-actions">
                        <Button
                          size="small"
                          fill="none"
                          onClick={handleHelpful}
                          className="help-center__helpful-btn"
                        >
                          <MaterialIcons name="star" size={12} color="#666" />
                          有帮助 ({faq.helpful})
                        </Button>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          ) : (
            <View className="help-center__no-results">
              <View className="help-center__no-results-text">
                未找到相关问题
              </View>
              <View className="help-center__no-results-hint">
                请尝试其他关键词或联系客服
              </View>
            </View>
          )}
        </View>

        {/* 联系我们 */}
        <View className="help-center__contact">
          <View className="help-center__section-title">联系我们</View>
          <CellGroup>
            {contactInfo.map((contact, index) => (
              <Cell
                key={index}
                title={contact.label}
                description={contact.hours}
                extra={contact.value}
                onClick={() => handleContactClick(contact)}
                className="help-center__contact-item"
              />
            ))}
          </CellGroup>
        </View>
      </View>
    </View>
  )
}

export default HelpCenter 