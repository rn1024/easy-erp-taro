import React, { useState, useEffect, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Button, Input, Loading } from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import { ProductsAPI } from '@/services/products'
import { mockProducts } from '@/constants/mockData'
import type { Product } from '@/types/admin'
import './index.scss'

interface SearchFilters {
  shop: string
  category: string
}

interface SearchState {
  keyword: string
  filters: SearchFilters
  results: Product[]
  suggestions: string[]
  searchHistory: string[]
  hotSearches: string[]
  isSearching: boolean
  showSuggestions: boolean
  hasSearched: boolean
}

const SKUSearchPage: React.FC = () => {
  const [state, setState] = useState<SearchState>({
    keyword: '',
    filters: { shop: '', category: '' },
    results: [],
    suggestions: [],
    searchHistory: [],
    hotSearches: ['SKU001', 'SKU002', 'iPhone充电线', '保温杯', '瑜伽垫'],
    isSearching: false,
    showSuggestions: false,
    hasSearched: false
  })

  // 加载搜索历史
  useEffect(() => {
    loadSearchHistory()
  }, [])

  // 实时搜索建议
  useEffect(() => {
    if (state.keyword.length >= 2) {
      generateSuggestions(state.keyword)
    } else {
      setState(prev => ({ ...prev, suggestions: [], showSuggestions: false }))
    }
  }, [state.keyword])

  // 加载搜索历史
  const loadSearchHistory = async () => {
    try {
      const history = await Taro.getStorage({ key: 'sku_search_history' })
      setState(prev => ({ ...prev, searchHistory: history.data || [] }))
    } catch (error) {
      setState(prev => ({ ...prev, searchHistory: [] }))
    }
  }

  // 保存搜索历史
  const saveSearchHistory = async (keyword: string) => {
    try {
      const newHistory = [keyword, ...state.searchHistory.filter(h => h !== keyword)].slice(0, 10)
      setState(prev => ({ ...prev, searchHistory: newHistory }))
      await Taro.setStorage({ key: 'sku_search_history', data: newHistory })
    } catch (error) {
      console.error('保存搜索历史失败:', error)
    }
  }

  // 生成搜索建议
  const generateSuggestions = (keyword: string) => {
    const lowerKeyword = keyword.toLowerCase()
    const suggestions: string[] = []

    // 从产品数据中匹配建议
    mockProducts.forEach(product => {
      if (product.sku.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(product.sku)
      }
      if (product.name.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(product.name)
      }
    })

    // 从搜索历史中匹配
    state.searchHistory.forEach(history => {
      if (history.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(history)
      }
    })

    // 去重并限制数量
    const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 8)
    setState(prev => ({ 
      ...prev, 
      suggestions: uniqueSuggestions,
      showSuggestions: uniqueSuggestions.length > 0
    }))
  }

  // 执行搜索
  const performSearch = async (searchKeyword?: string) => {
    const keyword = searchKeyword || state.keyword
    if (!keyword.trim()) {
      Taro.showToast({ title: '请输入搜索关键词', icon: 'error' })
      return
    }

    setState(prev => ({ ...prev, isSearching: true, showSuggestions: false }))

    try {
      // 模拟API调用 - 在真实项目中使用 ProductsAPI.query.searchSku
      const results = mockProducts.filter(product => {
        const matchKeyword = product.sku.toLowerCase().includes(keyword.toLowerCase()) ||
                             product.name.toLowerCase().includes(keyword.toLowerCase()) ||
                             product.label.toLowerCase().includes(keyword.toLowerCase())
        
        const matchShop = !state.filters.shop || product.shop === state.filters.shop
        const matchCategory = !state.filters.category || product.category === state.filters.category
        
        return matchKeyword && matchShop && matchCategory
      })

      setState(prev => ({ 
        ...prev, 
        results,
        hasSearched: true,
        keyword: keyword
      }))

      await saveSearchHistory(keyword)
      
      if (results.length === 0) {
        Taro.showToast({ title: '未找到相关产品', icon: 'none' })
      } else {
        Taro.showToast({ title: `找到${results.length}个结果`, icon: 'success' })
      }

    } catch (error) {
      console.error('搜索失败:', error)
      Taro.showToast({ title: '搜索失败，请重试', icon: 'error' })
    } finally {
      setState(prev => ({ ...prev, isSearching: false }))
    }
  }

  // 扫码搜索
  const handleScanSearch = async () => {
    try {
      const result = await Taro.scanCode({
        scanType: ['barCode', 'qrCode']
      })
      setState(prev => ({ ...prev, keyword: result.result }))
      await performSearch(result.result)
    } catch (error: any) {
      if (error.errMsg && !error.errMsg.includes('cancel')) {
        Taro.showToast({ title: '扫码失败', icon: 'error' })
      }
    }
  }

  // 选择建议
  const handleSelectSuggestion = (suggestion: string) => {
    setState(prev => ({ ...prev, keyword: suggestion, showSuggestions: false }))
    performSearch(suggestion)
  }

  // 选择历史搜索
  const handleSelectHistory = (keyword: string) => {
    setState(prev => ({ ...prev, keyword }))
    performSearch(keyword)
  }

  // 选择热门搜索
  const handleSelectHotSearch = (keyword: string) => {
    setState(prev => ({ ...prev, keyword }))
    performSearch(keyword)
  }

  // 清除搜索历史
  const handleClearHistory = async () => {
    try {
      await Taro.removeStorage({ key: 'sku_search_history' })
      setState(prev => ({ ...prev, searchHistory: [] }))
      Taro.showToast({ title: '历史记录已清除', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '清除失败', icon: 'error' })
    }
  }

  // 切换筛选条件
  const handleFilterToggle = (type: 'shop' | 'category', value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [type]: prev.filters[type] === value ? '' : value
      }
    }))
  }

  // 复制SKU
  const handleCopySku = async (sku: string) => {
    try {
      await Taro.setClipboardData({ data: sku })
      Taro.showToast({ title: '已复制SKU', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '复制失败', icon: 'error' })
    }
  }

  // 查看产品详情
  const handleViewDetail = (product: Product) => {
    Taro.showToast({ title: '查看产品详情功能待开发', icon: 'none' })
  }

  // 高亮显示关键词
  const highlightKeyword = (text: string, keyword: string) => {
    if (!keyword) return text
    const regex = new RegExp(`(${keyword})`, 'gi')
    return text.replace(regex, '<span class="highlight">$1</span>')
  }

  // 获取唯一的店铺和分类选项
  const shopOptions = useMemo(() => 
    Array.from(new Set(mockProducts.map(p => p.shop))), []
  )
  
  const categoryOptions = useMemo(() => 
    Array.from(new Set(mockProducts.map(p => p.category))), []
  )

  return (
    <MobileLayout title="SKU搜索">
      <View className="sku-search-page">
        {/* 搜索栏 */}
        <View className="sku-search-page__search-bar">
          <View className="sku-search-page__search-bar-field">
            <Input
              className="sku-search-page__search-bar-field-input"
              placeholder="输入SKU、产品名称或条码"
              value={state.keyword}
              onChange={(value) => setState(prev => ({ ...prev, keyword: value }))}
              onConfirm={() => performSearch()}
              onFocus={() => {
                if (state.suggestions.length > 0) {
                  setState(prev => ({ ...prev, showSuggestions: true }))
                }
              }}
              onBlur={() => {
                // 延迟隐藏建议，让点击事件可以触发
                setTimeout(() => {
                  setState(prev => ({ ...prev, showSuggestions: false }))
                }, 200)
              }}
            />
            <View 
              className="sku-search-page__search-bar-field-scan"
              onClick={handleScanSearch}
            >
              <MaterialIcons name="qr_code_scanner" size={16} />
              <Text>扫码</Text>
            </View>
          </View>

          {/* 筛选条件 */}
          <View className="sku-search-page__search-bar-filters">
            {shopOptions.map(shop => (
              <View
                key={shop}
                className={`sku-search-page__search-bar-filters-chip ${
                  state.filters.shop === shop ? 'sku-search-page__search-bar-filters-chip--active' : ''
                }`}
                onClick={() => handleFilterToggle('shop', shop)}
              >
                {shop}
              </View>
            ))}
          </View>
        </View>

        {/* 搜索建议 */}
        {state.showSuggestions && state.suggestions.length > 0 && (
          <View className="sku-search-page__suggestions">
            <View className="sku-search-page__suggestions-header">
              <Text className="sku-search-page__suggestions-header-title">搜索建议</Text>
            </View>
            {state.suggestions.map((suggestion, index) => (
              <View
                key={index}
                className="sku-search-page__suggestions-item"
                onClick={() => handleSelectSuggestion(suggestion)}
              >
                <MaterialIcons name="search" size={20} className="sku-search-page__suggestions-item-icon" />
                <Text className="sku-search-page__suggestions-item-text">
                  {suggestion}
                </Text>
                <Text className="sku-search-page__suggestions-item-type">
                  {suggestion.startsWith('SKU') ? 'SKU' : '产品'}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* 搜索结果 */}
        {state.hasSearched && (
          <View className="sku-search-page__results">
            <View className="sku-search-page__results-header">
              <Text className="sku-search-page__results-header-title">搜索结果</Text>
              <Text className="sku-search-page__results-header-count">
                共{state.results.length}个结果
              </Text>
            </View>
            
            <View className="sku-search-page__results-grid">
              {state.results.map(product => (
                <View key={product.id} className="sku-search-page__result-card">
                  <View className="sku-search-page__result-card-header">
                    <View className="sku-search-page__result-card-header-info">
                      <View 
                        className={`sku-search-page__result-card-header-sku ${
                          product.sku.toLowerCase().includes(state.keyword.toLowerCase()) ? 
                          'sku-search-page__result-card-header-sku--highlight' : ''
                        }`}
                      >
                        {product.sku}
                      </View>
                      <View className="sku-search-page__result-card-header-name">
                        {product.name}
                      </View>
                    </View>
                    <View className="sku-search-page__result-card-header-actions">
                      <MaterialIcons 
                        name="content_copy" 
                        size={20} 
                        color="#6b7280"
                        onClick={() => handleCopySku(product.sku)}
                      />
                    </View>
                  </View>

                  <View className="sku-search-page__result-card-content">
                    <View className="sku-search-page__result-card-content-row">
                      <Text className="sku-search-page__result-card-content-label">店铺:</Text>
                      <Text className="sku-search-page__result-card-content-value sku-search-page__result-card-content-value--shop">
                        {product.shop}
                      </Text>
                    </View>
                    <View className="sku-search-page__result-card-content-row">
                      <Text className="sku-search-page__result-card-content-label">分类:</Text>
                      <Text className="sku-search-page__result-card-content-value sku-search-page__result-card-content-value--category">
                        {product.category}
                      </Text>
                    </View>
                    <View className="sku-search-page__result-card-content-row">
                      <Text className="sku-search-page__result-card-content-label">条码:</Text>
                      <Text className="sku-search-page__result-card-content-value">
                        {product.label}
                      </Text>
                    </View>
                    <View className="sku-search-page__result-card-content-row">
                      <Text className="sku-search-page__result-card-content-label">包装:</Text>
                      <Text className="sku-search-page__result-card-content-value">
                        {product.packageInfo}
                      </Text>
                    </View>
                  </View>

                  <View className="sku-search-page__result-card-footer">
                    <Button 
                      className="sku-search-page__result-card-footer-button sku-search-page__result-card-footer-button--secondary"
                      onClick={() => handleCopySku(product.sku)}
                    >
                      复制SKU
                    </Button>
                    <Button 
                      className="sku-search-page__result-card-footer-button sku-search-page__result-card-footer-button--primary"
                      onClick={() => handleViewDetail(product)}
                    >
                      查看详情
                    </Button>
                  </View>
                </View>
              ))}
            </View>

            {/* 空结果状态 */}
            {state.results.length === 0 && (
              <View className="sku-search-page__empty">
                <View className="sku-search-page__empty-icon">
                  <MaterialIcons name="search_off" size={80} color="#d1d5db" />
                </View>
                <View className="sku-search-page__empty-title">未找到相关产品</View>
                <View className="sku-search-page__empty-desc">
                  请尝试使用其他关键词<br />或调整筛选条件
                </View>
              </View>
            )}
          </View>
        )}

        {/* 搜索历史 */}
        {!state.hasSearched && state.searchHistory.length > 0 && (
          <View className="sku-search-page__history">
            <View className="sku-search-page__history-header">
              <Text className="sku-search-page__history-header-title">搜索历史</Text>
              <Text 
                className="sku-search-page__history-header-clear"
                onClick={handleClearHistory}
              >
                清除
              </Text>
            </View>
            <View className="sku-search-page__history-tags">
              {state.searchHistory.map((keyword, index) => (
                <View
                  key={index}
                  className="sku-search-page__history-tags-item"
                  onClick={() => handleSelectHistory(keyword)}
                >
                  {keyword}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 热门搜索 */}
        {!state.hasSearched && (
          <View className="sku-search-page__hot-searches">
            <View className="sku-search-page__hot-searches-header">
              <MaterialIcons name="whatshot" size={24} className="sku-search-page__hot-searches-header-icon" />
              <Text>热门搜索</Text>
            </View>
            <View className="sku-search-page__hot-searches-grid">
              {state.hotSearches.map((keyword, index) => (
                <View
                  key={index}
                  className="sku-search-page__hot-searches-grid-item"
                  onClick={() => handleSelectHotSearch(keyword)}
                >
                  {keyword}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* 加载状态 */}
        {state.isSearching && (
          <View className="sku-search-page__loading">
            <Loading />
            <Text className="sku-search-page__loading-text">搜索中...</Text>
          </View>
        )}
      </View>
    </MobileLayout>
  )
}

export default SKUSearchPage 