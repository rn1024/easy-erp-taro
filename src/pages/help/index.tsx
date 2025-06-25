import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import Taro from '@tarojs/taro'
import {
  Cell,
  CellGroup,
  Collapse,
  CollapseItem,
  SearchBar,
  Empty,
  Badge,
  Button
} from '@nutui/nutui-react-taro'
import { MobileLayout, TopNavigation } from '../../components'
import './index.scss'

interface FAQItem {
  id: string
  question: string
  answer: string
  category: string
  isHot?: boolean
}

interface GuideItem {
  id: string
  title: string
  description: string
  category: string
  readTime: string
  isNew?: boolean
}

const HelpPage: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')
  const [activeCollapse, setActiveCollapse] = useState<string[]>([])

  // 常见问题数据
  const faqData: FAQItem[] = [
    {
      id: '1',
      question: '如何创建新的工作流？',
      answer: '点击底部导航的"创建流程"按钮，选择合适的模板或自定义流程，填写基本信息后即可创建。',
      category: '基础操作',
      isHot: true
    },
    {
      id: '2',
      question: '忘记密码怎么办？',
      answer: '在登录页面点击"忘记密码"，输入注册邮箱或手机号，系统会发送重置密码的链接或验证码。',
      category: '账户安全',
      isHot: true
    },
    {
      id: '3',
      question: '如何邀请团队成员？',
      answer: '进入团队管理页面，点击"邀请成员"按钮，输入成员邮箱地址并选择合适的角色权限。',
      category: '团队协作'
    },
    {
      id: '4',
      question: '任务状态有哪些？',
      answer: '任务状态包括：待处理、进行中、已完成、已拒绝。不同状态对应不同的颜色标识。',
      category: '基础操作'
    },
    {
      id: '5',
      question: '如何设置消息通知？',
      answer: '进入个人设置-通知设置，可以选择接收哪些类型的通知，以及通知方式（站内信、邮件等）。',
      category: '系统设置'
    },
    {
      id: '6',
      question: '数据能否导出？',
      answer: '支持导出任务数据、工作流数据等，进入相应页面点击导出按钮，选择导出格式即可。',
      category: '数据管理'
    }
  ]

  // 使用指南数据
  const guideData: GuideItem[] = [
    {
      id: '1',
      title: '快速入门指南',
      description: '5分钟了解平台基本功能和操作流程',
      category: '新手指南',
      readTime: '5分钟',
      isNew: true
    },
    {
      id: '2',
      title: '工作流设计最佳实践',
      description: '如何设计高效的工作流程，提升团队协作效率',
      category: '进阶教程',
      readTime: '15分钟'
    },
    {
      id: '3',
      title: '权限管理详解',
      description: '完整的权限体系说明和配置方法',
      category: '系统管理',
      readTime: '10分钟'
    },
    {
      id: '4',
      title: '移动端使用技巧',
      description: '充分利用移动端功能，随时随地处理工作',
      category: '使用技巧',
      readTime: '8分钟',
      isNew: true
    }
  ]

  // 过滤FAQ数据
  const filteredFAQ = faqData.filter(item =>
    item.question.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.answer.toLowerCase().includes(searchValue.toLowerCase())
  )

  // 过滤指南数据
  const filteredGuides = guideData.filter(item =>
    item.title.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.description.toLowerCase().includes(searchValue.toLowerCase())
  )

  // 处理搜索
  const handleSearch = (value: string) => {
    setSearchValue(value)
  }

  // 清空搜索
  const clearSearch = () => {
    setSearchValue('')
  }

  // 处理折叠面板变化
  const handleCollapseChange = (value: string[]) => {
    setActiveCollapse(value)
  }

  // 联系客服
  const handleContactSupport = () => {
    Taro.showModal({
      title: '联系客服',
      content: '客服微信：service001\n工作时间：9:00-18:00\n或拨打客服电话：400-123-4567',
      showCancel: false,
      confirmText: '我知道了'
    })
  }

  // 反馈问题
  const handleFeedback = () => {
    Taro.showModal({
      title: '问题反馈',
      content: '请详细描述您遇到的问题，我们会尽快处理',
      editable: true,
      placeholderText: '请输入问题描述...',
      success: (res) => {
        if (res.confirm && res.content) {
          Taro.showToast({ title: '反馈已提交', icon: 'success' })
        }
      }
    })
  }

  return (
    <MobileLayout enableSafeArea>
      <TopNavigation
        title="帮助中心"
        showBack
        onBack={() => Taro.navigateBack()}
        onSearch={() => {}}
        onFilter={() => {}}
        activeFilters={0}
      />

      <View className="help-page">
        {/* 搜索栏 */}
        <View className="search-section">
          <SearchBar
            value={searchValue}
            placeholder="搜索帮助内容..."
            onSearch={handleSearch}
            onChange={setSearchValue}
            onClear={clearSearch}
            className="help-search"
          />
        </View>

        {/* 快速入口 */}
        {!searchValue && (
          <View className="quick-actions">
            <View className="action-grid">
              <View className="action-item" onClick={() => handleContactSupport()}>
                <View className="action-icon contact-icon">💬</View>
                <Text className="action-text">联系客服</Text>
              </View>
              <View className="action-item" onClick={() => handleFeedback()}>
                <View className="action-icon feedback-icon">📝</View>
                <Text className="action-text">问题反馈</Text>
              </View>
              <View className="action-item" onClick={() => {
                Taro.showToast({ title: '功能开发中', icon: 'none' })
              }}>
                <View className="action-icon video-icon">🎥</View>
                <Text className="action-text">视频教程</Text>
              </View>
              <View className="action-item" onClick={() => {
                Taro.showToast({ title: '功能开发中', icon: 'none' })
              }}>
                <View className="action-icon update-icon">🔄</View>
                <Text className="action-text">更新日志</Text>
              </View>
            </View>
          </View>
        )}

        {/* 搜索结果为空 */}
        {searchValue && filteredFAQ.length === 0 && filteredGuides.length === 0 && (
          <View className="empty-section">
            <Empty description="未找到相关帮助内容" />
            <Button
              type="primary"
              size="small"
              onClick={clearSearch}
              className="clear-search-btn"
            >
              清空搜索
            </Button>
          </View>
        )}

        {/* 使用指南 */}
        {(!searchValue || filteredGuides.length > 0) && (
          <CellGroup title="使用指南" className="guide-group">
            {(searchValue ? filteredGuides : guideData).map((guide) => (
              <Cell
                key={guide.id}
                title={
                  <View className="guide-title">
                    <Text className="title-text">{guide.title}</Text>
                    {guide.isNew && <Badge value="新" className="new-badge" />}
                  </View>
                }
                description={guide.description}
                extra={
                  <View className="guide-meta">
                    <Text className="read-time">{guide.readTime}</Text>
                    <Text className="category">{guide.category}</Text>
                  </View>
                }
                isLink
                onClick={() => {
                  Taro.showToast({ title: '正在打开...', icon: 'loading' })
                  setTimeout(() => {
                    Taro.showToast({ title: '功能开发中', icon: 'none' })
                  }, 1000)
                }}
                className="guide-cell"
              />
            ))}
          </CellGroup>
        )}

        {/* 常见问题 */}
        {(!searchValue || filteredFAQ.length > 0) && (
          <View className="faq-section">
            <View className="section-title">
              <Text>常见问题</Text>
              <Badge value={`${filteredFAQ.length}个`} className="count-badge" />
            </View>

            <Collapse
              value={activeCollapse}
              onChange={handleCollapseChange}
              className="faq-collapse"
            >
              {(searchValue ? filteredFAQ : faqData).map((faq) => (
                <CollapseItem
                  key={faq.id}
                  name={faq.id}
                  title={
                    <View className="faq-question">
                      <Text className="question-text">{faq.question}</Text>
                      {faq.isHot && <Badge value="热门" className="hot-badge" />}
                    </View>
                  }
                  className="faq-item"
                >
                  <View className="faq-answer">
                    <Text className="answer-text">{faq.answer}</Text>
                    <View className="answer-meta">
                      <Text className="category-tag">{faq.category}</Text>
                    </View>
                  </View>
                </CollapseItem>
              ))}
            </Collapse>
          </View>
        )}

        {/* 联系支持 */}
        {!searchValue && (
          <View className="support-section">
            <View className="support-card">
              <View className="support-header">
                <Text className="support-title">还有问题？</Text>
                <Text className="support-subtitle">我们随时为您提供帮助</Text>
              </View>

              <View className="support-actions">
                <Button
                  type="primary"
                  className="contact-btn"
                  onClick={handleContactSupport}
                >
                  联系客服
                </Button>
                <Button
                  className="feedback-btn"
                  onClick={handleFeedback}
                >
                  意见反馈
                </Button>
              </View>

              <View className="support-info">
                <Text className="info-text">客服时间：周一至周五 9:00-18:00</Text>
                <Text className="info-text">紧急问题请拨打：400-123-4567</Text>
              </View>
            </View>
          </View>
        )}
      </View>
    </MobileLayout>
  )
}

export default HelpPage
