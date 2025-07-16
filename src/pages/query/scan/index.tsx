import React, { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'
import { View, Text } from '@tarojs/components'
import { 
  Button, 
  Input, 
  Loading, 
  Toast,
  Dialog
} from '@nutui/nutui-react-taro'
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import { QueryAPI } from '@/services/products'
import { mockProducts } from '@/constants/mockData'
import type { Product, ScanResult, ScanHistory } from '@/types/admin'
import './index.scss'

interface ScanPageState {
  isScanning: boolean
  isSearching: boolean
  manualCode: string
  scanResult: ScanResult | null
  scanHistory: ScanHistory[]
  showToast: boolean
  toastMsg: string
  showDialog: boolean
}

const ScanPage: React.FC = () => {
  const [state, setState] = useState<ScanPageState>({
    isScanning: false,
    isSearching: false,
    manualCode: '',
    scanResult: null,
    scanHistory: [],
    showToast: false,
    toastMsg: '',
    showDialog: false
  })

  // 显示Toast
  const showToast = (msg: string) => {
    setState(prev => ({ ...prev, toastMsg: msg, showToast: true }))
    setTimeout(() => {
      setState(prev => ({ ...prev, showToast: false }))
    }, 2000)
  }

  // 下拉刷新
  const handleRefresh = async () => {
    await loadScanHistory()
    Taro.showToast({ title: '刷新成功', icon: 'success' })
  }

  // 加载扫描历史
  useEffect(() => {
    loadScanHistory()
  }, [])

  // 加载扫描历史
  const loadScanHistory = async () => {
    try {
      // 从本地存储加载历史记录
      const history = await Taro.getStorage({ key: 'scan_history' })
      setState(prev => ({ ...prev, scanHistory: history.data || [] }))
    } catch (error) {
      // 首次使用，无历史记录
      setState(prev => ({ ...prev, scanHistory: [] }))
    }
  }

  // 保存扫描历史
  const saveScanHistory = async (scanItem: ScanHistory) => {
    try {
      const newHistory = [scanItem, ...state.scanHistory.slice(0, 19)] // 保留最近20条
      setState(prev => ({ ...prev, scanHistory: newHistory }))
      await Taro.setStorage({ key: 'scan_history', data: newHistory })
    } catch (error) {
      console.error('保存扫描历史失败:', error)
    }
  }

  // 扫码功能
  const handleScanCode = async () => {
    setState(prev => ({ ...prev, isScanning: true }))
    
    try {
      const result = await Taro.scanCode({
        scanType: ['barCode', 'qrCode']
      })
      
      await searchByCode(result.result)
    } catch (error: any) {
      if (error.errMsg && !error.errMsg.includes('cancel')) {
        Taro.showToast({ title: '扫码失败，请重试', icon: 'error' })
      }
    } finally {
      setState(prev => ({ ...prev, isScanning: false }))
    }
  }

  // 手动输入查询
  const handleManualSearch = async () => {
    if (!state.manualCode.trim()) {
      Taro.showToast({ title: '请输入条码或SKU', icon: 'error' })
      return
    }
    
    await searchByCode(state.manualCode.trim())
  }

  // 根据代码查询产品
  const searchByCode = async (code: string) => {
    setState(prev => ({ ...prev, isSearching: true }))
    
    try {
      // 模拟API调用 - 在真实项目中使用 QueryAPI.scanCode
      const product = mockProducts.find(p => 
        p.sku === code || 
        p.label === code ||
        p.name.includes(code)
      )
      
      const scanResult: ScanResult = {
        code,
        product,
        timestamp: new Date().toISOString()
      }
      
      const scanHistory: ScanHistory = {
        id: Date.now().toString(),
        code,
        result: scanResult,
        success: !!product,
        createdAt: new Date().toISOString()
      }
      
      setState(prev => ({ 
        ...prev, 
        scanResult,
        manualCode: ''
      }))
      
      await saveScanHistory(scanHistory)
      
      if (product) {
        Taro.showToast({ title: '查询成功', icon: 'success' })
      } else {
        Taro.showToast({ title: '未找到相关产品', icon: 'error' })
      }
      
    } catch (error) {
      console.error('查询失败:', error)
      Taro.showToast({ title: '查询失败，请重试', icon: 'error' })
    } finally {
      setState(prev => ({ ...prev, isSearching: false }))
    }
  }

  // 清除历史记录
  const handleClearHistory = () => {
    setState(prev => ({ ...prev, showDialog: true }))
  }

  // 确认清除历史
  const confirmClearHistory = async () => {
    try {
      await Taro.removeStorage({ key: 'scan_history' })
      setState(prev => ({ ...prev, scanHistory: [], showDialog: false }))
      Taro.showToast({ title: '历史记录已清除', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '清除失败', icon: 'error' })
    }
  }

  // 复制代码到剪贴板
  const handleCopyCode = async (code: string) => {
    try {
      await Taro.setClipboardData({ data: code })
      Taro.showToast({ title: '已复制到剪贴板', icon: 'success' })
    } catch (error) {
      Taro.showToast({ title: '复制失败', icon: 'error' })
    }
  }

  // 查看产品详情
  const handleViewDetail = (product: Product) => {
    // 可以导航到产品详情页面
    Taro.showToast({ title: '查看产品详情功能待开发', icon: 'none' })
  }

  // 点击历史记录重新查询
  const handleHistoryItemClick = async (code: string) => {
    await searchByCode(code)
  }

  return (
    <MobileLayout title="扫码查询">
      <View className="scan-page">
        {/* 扫码区域 */}
        <View className="scan-page__camera-area">
          <View className="scan-page__camera-area-icon">
            <MaterialIcons name="qr_code_scanner" size={80} color="#3b82f6" />
          </View>
          <View className="scan-page__camera-area-title">扫码查询</View>
          <View className="scan-page__camera-area-desc">
            对准商品条码或二维码进行扫描
            <br />快速查询产品信息
          </View>
          <Button
            className={`scan-page__scan-button ${state.isScanning ? 'scan-page__scan-button--loading' : ''}`}
            loading={state.isScanning}
            onClick={handleScanCode}
            disabled={state.isScanning}
          >
            {state.isScanning ? '扫描中...' : '开始扫码'}
          </Button>
        </View>

        {/* 手动输入区域 */}
        <View className="scan-page__manual-input">
          <View className="scan-page__manual-input-title">手动输入</View>
          <View className="scan-page__manual-input-field">
            <Input
              placeholder="输入条码或SKU编号"
              value={state.manualCode}
              onChange={(value) => setState(prev => ({ ...prev, manualCode: value }))}
              onConfirm={handleManualSearch}
            />
          </View>
          <Button
            className="scan-page__manual-input-button"
            loading={state.isSearching}
            onClick={handleManualSearch}
            disabled={state.isSearching || !state.manualCode.trim()}
          >
            {state.isSearching ? '查询中...' : '查询'}
          </Button>
        </View>

        {/* 查询结果 */}
        {state.scanResult && (
          <View className="scan-page__result">
            <View className="scan-page__result-header">
              <Text className="scan-page__result-header-title">查询结果</Text>
              <Text className="scan-page__result-header-time">
                {new Date(state.scanResult.timestamp).toLocaleTimeString()}
              </Text>
            </View>
            
            <View className="scan-page__result-content">
              <View className="scan-page__result-content-row">
                <Text className="scan-page__result-content-label">扫描代码:</Text>
                <Text className="scan-page__result-content-value scan-page__result-content-value--code">
                  {state.scanResult.code}
                </Text>
              </View>
              
              {state.scanResult.product ? (
                <>
                  <View className="scan-page__result-content-row">
                    <Text className="scan-page__result-content-label">产品名称:</Text>
                    <Text className="scan-page__result-content-value scan-page__result-content-value--primary">
                      {state.scanResult.product.name}
                    </Text>
                  </View>
                  <View className="scan-page__result-content-row">
                    <Text className="scan-page__result-content-label">SKU:</Text>
                    <Text className="scan-page__result-content-value">
                      {state.scanResult.product.sku}
                    </Text>
                  </View>
                  <View className="scan-page__result-content-row">
                    <Text className="scan-page__result-content-label">店铺:</Text>
                    <Text className="scan-page__result-content-value">
                      {state.scanResult.product.shop}
                    </Text>
                  </View>
                  <View className="scan-page__result-content-row">
                    <Text className="scan-page__result-content-label">分类:</Text>
                    <Text className="scan-page__result-content-value">
                      {state.scanResult.product.category}
                    </Text>
                  </View>
                  <View className="scan-page__result-content-row">
                    <Text className="scan-page__result-content-label">包装信息:</Text>
                    <Text className="scan-page__result-content-value">
                      {state.scanResult.product.packageInfo}
                    </Text>
                  </View>
                </>
              ) : (
                <View className="scan-page__result-content-row">
                  <Text className="scan-page__result-content-value" style={{ color: '#ef4444' }}>
                    未找到相关产品信息
                  </Text>
                </View>
              )}
            </View>

            <View className="scan-page__result-actions">
              <Button
                className="scan-page__result-actions-button scan-page__result-actions-button--secondary"
                onClick={() => handleCopyCode(state.scanResult!.code)}
              >
                复制代码
              </Button>
              {state.scanResult.product && (
                <Button
                  className="scan-page__result-actions-button scan-page__result-actions-button--primary"
                  onClick={() => handleViewDetail(state.scanResult!.product!)}
                >
                  查看详情
                </Button>
              )}
            </View>
          </View>
        )}

        {/* 扫描历史 */}
        {state.scanHistory.length > 0 && (
          <View className="scan-page__history">
            <View className="scan-page__history-header">
              <Text className="scan-page__history-header-title">扫描历史</Text>
              <Text 
                className="scan-page__history-header-clear"
                onClick={handleClearHistory}
              >
                清除
              </Text>
            </View>
            
            {state.scanHistory.map((item) => (
              <View 
                key={item.id}
                className="scan-page__history-item"
                onClick={() => handleHistoryItemClick(item.code)}
              >
                <View className="scan-page__history-item-code">{item.code}</View>
                <View className="scan-page__history-item-meta">
                  <Text className={item.success ? 'scan-page__history-item-success' : 'scan-page__history-item-error'}>
                    {item.success ? '查询成功' : '未找到'}
                  </Text>
                  <Text>{new Date(item.createdAt).toLocaleString()}</Text>
                </View>
              </View>
            ))}
          </View>
        )}

        {/* 空状态 */}
        {state.scanHistory.length === 0 && !state.scanResult && (
          <View className="scan-page__empty">
            <View className="scan-page__empty-icon">
              <MaterialIcons name="history" size={60} color="#d1d5db" />
            </View>
            <Text className="scan-page__empty-text">暂无扫描记录</Text>
          </View>
        )}
      </View>

      {/* 确认对话框 */}
      <Dialog
        visible={state.showDialog}
        title="确认清除"
        content="确定要清除所有扫描历史吗？"
        onCancel={() => setState(prev => ({ ...prev, showDialog: false }))}
        onConfirm={confirmClearHistory}
      />
    </MobileLayout>
  )
}

export default ScanPage 