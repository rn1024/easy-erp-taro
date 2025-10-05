import React, { useCallback, useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { Button, Loading } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { SectionCard, FilterChips, InfoList, Icon } from '@/components/common'

/**
 * Constants
 */
import { mockProducts } from '@/constants/mockData'

/**
 * Types
 */
import type { Product } from '@/types/admin'

import './index.scss'

type SearchFilters = {
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

  const shopOptions = useMemo(() => Array.from(new Set(mockProducts.map(product => product.shop))), [])
  const categoryOptions = useMemo(() => Array.from(new Set(mockProducts.map(product => product.category))), [])

  useEffect(() => {
    void loadSearchHistory()
  }, [])

  const generateSuggestions = useCallback((keyword: string) => {
    const lowerKeyword = keyword.toLowerCase()
    const suggestions: string[] = []

    mockProducts.forEach(product => {
      if (product.sku.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(product.sku)
      }
      if (product.name.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(product.name)
      }
    })

    state.searchHistory.forEach(history => {
      if (history.toLowerCase().includes(lowerKeyword)) {
        suggestions.push(history)
      }
    })

    const uniqueSuggestions = Array.from(new Set(suggestions)).slice(0, 8)
    setState(prev => ({
      ...prev,
      suggestions: uniqueSuggestions,
      showSuggestions: uniqueSuggestions.length > 0
    }))
  }, [state.searchHistory])

  useEffect(() => {
    if (state.keyword.length >= 2) {
      generateSuggestions(state.keyword)
    } else {
      setState(prev => ({ ...prev, suggestions: [], showSuggestions: false }))
    }
  }, [generateSuggestions, state.keyword])

  const loadSearchHistory = async () => {
    try {
      const history = await Taro.getStorage({ key: 'sku_search_history' })
      setState(prev => ({ ...prev, searchHistory: history.data || [] }))
    } catch (_error) {
      setState(prev => ({ ...prev, searchHistory: [] }))
    }
  }

  const saveSearchHistory = async (keyword: string) => {
    try {
      const newHistory = [keyword, ...state.searchHistory.filter(item => item !== keyword)].slice(0, 10)
      setState(prev => ({ ...prev, searchHistory: newHistory }))
      await Taro.setStorage({ key: 'sku_search_history', data: newHistory })
    } catch (_error) {
      // ignore
    }
  }

  const performSearch = async (searchKeyword?: string) => {
    const keyword = searchKeyword ?? state.keyword
    if (!keyword.trim()) {
      Taro.showToast({ title: '请输入搜索关键词', icon: 'error' })
      return
    }

    setState(prev => ({ ...prev, isSearching: true, showSuggestions: false }))

    try {
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
        keyword
      }))

      await saveSearchHistory(keyword)

      if (results.length === 0) {
        Taro.showToast({ title: '未找到相关产品', icon: 'none' })
      } else {
        Taro.showToast({ title: `找到${results.length}个结果`, icon: 'success' })
      }
    } catch (_error) {
      Taro.showToast({ title: '搜索失败，请重试', icon: 'error' })
    } finally {
      setState(prev => ({ ...prev, isSearching: false }))
    }
  }

  const handleScanSearch = async () => {
    try {
      const result = await Taro.scanCode({ scanType: ['barCode', 'qrCode'] })
      setState(prev => ({ ...prev, keyword: result.result }))
      await performSearch(result.result)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errMsg' in error &&
        typeof (error as { errMsg?: string }).errMsg === 'string' &&
        !(error as { errMsg?: string }).errMsg?.includes('cancel')) {
        Taro.showToast({ title: '扫码失败', icon: 'error' })
      }
    }
  }

  const handleSelectSuggestion = (suggestion: string) => {
    setState(prev => ({ ...prev, keyword: suggestion, showSuggestions: false }))
    void performSearch(suggestion)
  }

  const handleSelectHistory = (keyword: string) => {
    setState(prev => ({ ...prev, keyword }))
    void performSearch(keyword)
  }

  const handleSelectHotSearch = (keyword: string) => {
    setState(prev => ({ ...prev, keyword }))
    void performSearch(keyword)
  }

  const handleClearHistory = async () => {
    try {
      await Taro.removeStorage({ key: 'sku_search_history' })
      setState(prev => ({ ...prev, searchHistory: [] }))
      Taro.showToast({ title: '历史记录已清除', icon: 'success' })
    } catch (_error) {
      Taro.showToast({ title: '清除失败', icon: 'error' })
    }
  }

  const handleFilterChange = (type: keyof SearchFilters, value: string) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        [type]: prev.filters[type] === value ? '' : value
      }
    }))
  }

  const renderResultCard = (product: Product) => (
    <View key={product.id} className='sku-page__result-card'>
      <View className='sku-page__result-header'>
        <View>
          <Text className='sku-page__result-title'>{product.name}</Text>
          <Text className='sku-page__result-subtitle'>SKU：{product.sku}</Text>
        </View>
        <Button size='mini' onClick={() => Taro.showToast({ title: '详情功能待开发', icon: 'none' })}>
          查看详情
        </Button>
      </View>
      <InfoList
        dense
        items={[
          { key: 'shop', label: '店铺', value: product.shop },
          { key: 'category', label: '分类', value: product.category },
          { key: 'label', label: '编码', value: product.label },
          { key: 'package', label: '包装信息', value: product.packageInfo || '-' }
        ]}
      />
    </View>
  )

  const renderSuggestions = () => {
    if (!state.showSuggestions || state.suggestions.length === 0) {
      return null
    }

    return (
      <View className='sku-page__suggestions'>
        {state.suggestions.map(suggestion => (
          <View
            key={suggestion}
            className='sku-page__suggestion-item'
            onClick={() => handleSelectSuggestion(suggestion)}
          >
            <Icon name='search' size={18} color='#6b7280' />
            <Text>{suggestion}</Text>
          </View>
        ))}
      </View>
    )
  }

  return (
    <MobileLayout className='sku-page'>
      <View className='sku-page__content'>
        <SectionCard
          title='SKU 智能查询'
          description='支持扫码或关键字检索，并按店铺/分类过滤'
          compact
          actions={[
            <Button key='scan' type='primary' size='mini' onClick={handleScanSearch}>
              扫描查询
            </Button>
          ]}
        >
          <SearchBar
            value={state.keyword}
            placeholder='输入SKU、产品名称或标签'
            onChange={(value) => setState(prev => ({ ...prev, keyword: value }))}
            onSearch={(value) => setState(prev => ({ ...prev, keyword: value }))}
          />
          {renderSuggestions()}

          <View className='sku-page__filters'>
            <FilterChips
              options={shopOptions.map(shop => ({ value: shop, label: shop }))}
              selectedValues={state.filters.shop ? [state.filters.shop] : []}
              onChange={(values) => handleFilterChange('shop', values[0] ?? '')}
              allowClear
              scrollable
            />
            <FilterChips
              options={categoryOptions.map(category => ({ value: category, label: category }))}
              selectedValues={state.filters.category ? [state.filters.category] : []}
              onChange={(values) => handleFilterChange('category', values[0] ?? '')}
              allowClear
              scrollable
            />
          </View>

          <Button
            type='primary'
            loading={state.isSearching}
            onClick={() => performSearch()}
            block
          >
            开始搜索
          </Button>
        </SectionCard>

        <SectionCard
          title='热门搜索'
          description='快速访问常用关键词'
          compact
        >
          <View className='sku-page__hot-search'>
            {state.hotSearches.map(item => (
              <View key={item} className='sku-page__hot-search-item' onClick={() => handleSelectHotSearch(item)}>
                {item}
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard
          title='历史记录'
          description='最多保留最近10条记录'
          compact
          actions={state.searchHistory.length > 0 ? [
            <Button key='clear' size='mini' plain onClick={handleClearHistory}>
              清除历史
            </Button>
          ] : undefined}
        >
          {state.searchHistory.length === 0 ? (
            <View className='sku-page__placeholder'>
              <Icon name='history' size={48} color='#d1d5db' />
              <Text className='sku-page__placeholder-text'>暂无历史记录</Text>
            </View>
          ) : (
            <View className='sku-page__history'>
              {state.searchHistory.map(item => (
                <View key={item} className='sku-page__history-item' onClick={() => handleSelectHistory(item)}>
                  <Icon name='schedule' size={18} color='#6b7280' />
                  <Text>{item}</Text>
                </View>
              ))}
            </View>
          )}
        </SectionCard>

        <SectionCard
          title='搜索结果'
          description={state.hasSearched ? `共 ${state.results.length} 个匹配项` : '输入关键词后开始搜索'}
          compact
        >
          {state.isSearching ? (
            <View className='sku-page__loading'>
              <Loading />
              <Text className='sku-page__loading-text'>搜索中...</Text>
            </View>
          ) : state.results.length === 0 && state.hasSearched ? (
            <View className='sku-page__placeholder'>
              <Icon name='inventory_2' size={64} color='#d1d5db' />
              <Text className='sku-page__placeholder-text'>没有匹配的结果</Text>
            </View>
          ) : (
            <View className='sku-page__results'>
              {state.results.map(renderResultCard)}
            </View>
          )}
        </SectionCard>
      </View>
    </MobileLayout>
  )
}

export default SKUSearchPage
