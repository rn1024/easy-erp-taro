import React, { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Input, Image } from '@tarojs/components'
import { Button, Dialog, Loading } from '@nutui/nutui-react-taro'

/**
 * APIs
 */
import { searchProductsBySku } from '@/services/products'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import { Icon } from '@/components/common'

/**
 * Types
 */
import type { Product, ScanResult, ScanHistory } from '@/types/admin'

import './index.scss'

interface ScanPageState {
  isScanning: boolean
  isSearching: boolean
  manualCode: string
  scanResult: ScanResult | null
  scanHistory: ScanHistory[]
  showHistoryDialog: boolean
}

const ScanPage: React.FC = () => {
  const [state, setState] = useState<ScanPageState>({
    isScanning: false,
    isSearching: false,
    manualCode: '',
    scanResult: null,
    scanHistory: [],
    showHistoryDialog: false
  })

  useEffect(() => {
    void loadScanHistory()
  }, [])

  const historyItems = useMemo(() => state.scanHistory, [state.scanHistory])

  const loadScanHistory = async () => {
    try {
      const history = await Taro.getStorage({ key: 'scan_history' })
      setState(prev => ({ ...prev, scanHistory: history.data || [] }))
    } catch (_error) {
      setState(prev => ({ ...prev, scanHistory: [] }))
    }
  }

  const saveScanHistory = async (scanItem: ScanHistory) => {
    try {
      const newHistory = [scanItem, ...state.scanHistory.slice(0, 19)]
      setState(prev => ({ ...prev, scanHistory: newHistory }))
      await Taro.setStorage({ key: 'scan_history', data: newHistory })
    } catch (_error) {
      // 忽略存储失败
    }
  }

  const handleScanCode = async () => {
    setState(prev => ({ ...prev, isScanning: true }))
    try {
      const result = await Taro.scanCode({ scanType: ['barCode', 'qrCode'], onlyFromCamera: true })
      await searchByCode(result.result)
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'errMsg' in error &&
        typeof (error as { errMsg?: string }).errMsg === 'string' &&
        !(error as { errMsg?: string }).errMsg?.includes('cancel')) {
        Taro.showToast({ title: '扫码失败，请重试', icon: 'error' })
      }
    } finally {
      setState(prev => ({ ...prev, isScanning: false }))
    }
  }

  const handleManualSearch = async () => {
    if (!state.manualCode.trim()) {
      Taro.showToast({ title: '请输入条码或SKU', icon: 'error' })
      return
    }
    await searchByCode(state.manualCode.trim())
  }

  const searchByCode = async (code: string) => {
    setState(prev => ({ ...prev, isSearching: true }))
    try {
      const response = await searchProductsBySku(code)
      let product: Product | undefined

      if (response.code === 0 && response.data.length > 0) {
        const apiProduct = response.data[0]
        product = {
          id: apiProduct.id,
          shop: typeof apiProduct.shop === 'string' ? apiProduct.shop : ((apiProduct.shop as { nickname?: string })?.nickname ?? ''),
          category: typeof apiProduct.category === 'string' ? apiProduct.category : ((apiProduct.category as { name?: string })?.name ?? ''),
          name: apiProduct.name,
          sku: apiProduct.sku ?? '',
          label: (apiProduct as { code?: string }).code ?? apiProduct.sku ?? '',
          packageInfo: (apiProduct as { description?: string }).description ?? '',
          outerBoxInfo: '',
          accessoriesInfo: '',
          remark: ''
        }
      }

      const scanResult: ScanResult = {
        code,
        product,
        timestamp: new Date().toISOString()
      }

      const historyItem: ScanHistory = {
        id: Date.now().toString(),
        code,
        result: scanResult,
        success: Boolean(product),
        createdAt: new Date().toISOString()
      }

      setState(prev => ({
        ...prev,
        scanResult,
        manualCode: ''
      }))

      await saveScanHistory(historyItem)

      Taro.showToast({ title: product ? '查询成功' : '未找到相关产品', icon: product ? 'success' : 'error' })
    } catch (_error) {
      Taro.showToast({ title: '查询失败，请重试', icon: 'error' })
    } finally {
      setState(prev => ({ ...prev, isSearching: false }))
    }
  }

  const handleClearHistory = () => {
    setState(prev => ({ ...prev, showHistoryDialog: true }))
  }

  const confirmClearHistory = async () => {
    try {
      await Taro.removeStorage({ key: 'scan_history' })
      setState(prev => ({ ...prev, scanHistory: [], showHistoryDialog: false }))
      Taro.showToast({ title: '历史记录已清除', icon: 'success' })
    } catch (_error) {
      Taro.showToast({ title: '清除失败', icon: 'error' })
    }
  }

  const handleCopyCode = async (code: string) => {
    try {
      await Taro.setClipboardData({ data: code })
      Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
    } catch (_error) {
      Taro.showToast({ title: '复制失败', icon: 'error' })
    }
  }

  const handleViewDetail = (_product: Product) => {
    Taro.showToast({ title: '查看产品详情功能待开发', icon: 'none' })
  }

  const renderResult = () => {
    if (state.isSearching) {
      return (
        <View className='scan-page__loading-state'>
          <Loading />
          <Text className='scan-page__loading-text'>查询中...</Text>
        </View>
      )
    }

    if (!state.scanResult) {
      return (
        <View className='scan-page__empty-state'>
          <Icon name='qr_code_scanner' size={48} color='#d1d5db' />
          <Text className='scan-page__empty-title'>等待扫描或查询</Text>
          <Text className='scan-page__empty-text'>可以扫描条码或输入SKU手动查询</Text>
        </View>
      )
    }

    if (!state.scanResult.product) {
      return (
        <View className='scan-page__empty-state scan-page__empty-state--error'>
          <Icon name='inventory_2' size={48} color='#ef4444' />
          <Text className='scan-page__empty-title'>未找到相关产品</Text>
          <Text className='scan-page__empty-text'>请检查条码是否正确，或稍后重试</Text>
        </View>
      )
    }

    const product = state.scanResult.product

    return (
      <View className='scan-page__product-card'>
        <View className='scan-page__product-header'>
          <View className='scan-page__product-info'>
            <Text className='scan-page__product-name'>{product.name}</Text>
            <Text className='scan-page__product-sku'>SKU: {product.sku}</Text>
          </View>
          <Button 
            className='wechat-button' 
            size='mini' 
            plain
            onClick={() => handleViewDetail(product)}
          >
            详情
          </Button>
        </View>
        
        <View className='scan-page__product-details'>
          <View className='scan-page__detail-item'>
            <Text className='scan-page__detail-label'>店铺</Text>
            <Text className='scan-page__detail-value'>{product.shop || '-'}</Text>
          </View>
          <View className='scan-page__detail-item'>
            <Text className='scan-page__detail-label'>分类</Text>
            <Text className='scan-page__detail-value'>{product.category || '-'}</Text>
          </View>
          <View className='scan-page__detail-item'>
            <Text className='scan-page__detail-label'>标识代码</Text>
            <Text className='scan-page__detail-value'>{product.label || '-'}</Text>
          </View>
          {product.packageInfo && (
            <View className='scan-page__detail-item scan-page__detail-item--full'>
              <Text className='scan-page__detail-label'>包装信息</Text>
              <Text className='scan-page__detail-value'>{product.packageInfo}</Text>
            </View>
          )}
        </View>
      </View>
    )
  }

  return (
    <MobileLayout className='scan-page'>
      <View className='scan-page__content'>
        
        {/* 扫码区域 */}
        <View className='scan-page__scan-section'>
          <View className='scan-page__scan-header'>
            <Text className='scan-page__scan-title'>扫码查询</Text>
            <Text className='scan-page__scan-subtitle'>扫描条码或输入SKU查询产品信息</Text>
          </View>
          
          {/* 扫码按钮 */}
          <View className='scan-page__scan-button-container'>
            <Button
              className='scan-page__scan-button'
              type='primary'
              loading={state.isScanning}
              onClick={handleScanCode}
              size='large'
            >
              <View className='scan-page__scan-button-content'>
                <Icon name='qr_code_scanner' size={32} color='#ffffff' />
                <Text className='scan-page__scan-button-text'>
                  {state.isScanning ? '扫描中...' : '扫描条码'}
                </Text>
              </View>
            </Button>
          </View>
          
          {/* 手动输入 */}
          <View className='scan-page__manual-input'>
            <View className='scan-page__divider'>
              <View className='scan-page__divider-line' />
              <Text className='scan-page__divider-text'>或手动输入</Text>
              <View className='scan-page__divider-line' />
            </View>
            
            <View className='scan-page__input-group'>
              <Input
                className='scan-page__input'
                value={state.manualCode}
                onInput={(e) => setState(prev => ({ ...prev, manualCode: e.detail.value }))}
                placeholder='请输入条码或SKU'
                disabled={state.isSearching}
                confirmType='search'
                onConfirm={handleManualSearch}
              />
              <Button
                className='scan-page__search-button'
                type='primary'
                loading={state.isSearching}
                onClick={handleManualSearch}
                disabled={!state.manualCode.trim()}
              >
                查询
              </Button>
            </View>
          </View>
        </View>

        {/* 查询结果 */}
        <View className='scan-page__result-section'>
          <View className='scan-page__section-header'>
            <Text className='scan-page__section-title'>查询结果</Text>
          </View>
          {renderResult()}
          {state.scanResult && (
            <View className='scan-page__result-meta'>
              <Text className='scan-page__result-time'>
                查询时间：{state.scanResult.timestamp.slice(0, 19).replace('T', ' ')}
              </Text>
              <Button
                size='mini'
                plain
                onClick={() => handleCopyCode(state.scanResult?.code || '')}
              >
                复制条码
              </Button>
            </View>
          )}
        </View>

        {/* 历史记录 */}
        <View className='scan-page__history-section'>
          <View className='scan-page__section-header'>
            <Text className='scan-page__section-title'>历史记录</Text>
            {historyItems.length > 0 && (
              <Button
                size='mini'
                plain
                onClick={handleClearHistory}
              >
                清除历史
              </Button>
            )}
          </View>
          
          {historyItems.length === 0 ? (
            <View className='scan-page__empty-state'>
              <Icon name='history' size={64} color='#d1d5db' />
              <Text className='scan-page__empty-text'>暂无历史记录</Text>
            </View>
          ) : (
            <View className='scan-page__history-list'>
              {historyItems.map(item => (
                <View key={item.id} className='scan-page__history-item'>
                  <View className='scan-page__history-content'>
                    <Text className='scan-page__history-code'>{item.code}</Text>
                    <Text className='scan-page__history-time'>
                      {item.createdAt.slice(0, 19).replace('T', ' ')}
                    </Text>
                    <View className={`scan-page__history-status ${item.success ? 'success' : 'failed'}`}>
                      <Text className='scan-page__history-status-text'>
                        {item.success ? '查询成功' : '未找到'}
                      </Text>
                    </View>
                  </View>
                  <View className='scan-page__history-actions'>
                    <Button 
                      size='mini' 
                      plain 
                      onClick={() => handleCopyCode(item.code)}
                    >
                      复制
                    </Button>
                    <Button 
                      size='mini' 
                      onClick={() => searchByCode(item.code)}
                    >
                      重查
                    </Button>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </View>

      <Dialog
        visible={state.showHistoryDialog}
        title='清除历史记录'
        closeOnOverlayClick
        onClose={() => setState(prev => ({ ...prev, showHistoryDialog: false }))}
        footerButtons={[
          {
            text: '取消',
            plain: true,
            onClick: () => setState(prev => ({ ...prev, showHistoryDialog: false }))
          },
          {
            text: '清除',
            color: 'danger',
            onClick: () => void confirmClearHistory()
          }
        ]}
      >
        <Text>确认清除全部扫码历史记录？此操作不可恢复。</Text>
      </Dialog>
    </MobileLayout>
  )
}

export default ScanPage
