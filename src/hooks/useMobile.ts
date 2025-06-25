import { useState, useEffect } from 'react'
import Taro from '@tarojs/taro'

interface MobileInfo {
  /** 是否为移动端 */
  isMobile: boolean
  /** 是否为微信环境 */
  isWechat: boolean
  /** 是否为iOS系统 */
  isIOS: boolean
  /** 是否为Android系统 */
  isAndroid: boolean
  /** 是否为小程序环境 */
  isMiniProgram: boolean
  /** 屏幕信息 */
  screenInfo: {
    windowWidth: number
    windowHeight: number
    statusBarHeight: number
    safeAreaTop: number
    safeAreaBottom: number
  }
  /** 设备信息 */
  deviceInfo: {
    brand: string
    model: string
    platform: string
    system: string
  }
}

/**
 * 移动端环境检测Hook
 * 专为Taro小程序环境设计
 *
 * @returns MobileInfo 移动端环境信息
 */
export function useMobile(): MobileInfo {
  const [mobileInfo, setMobileInfo] = useState<MobileInfo>({
    isMobile: true, // 小程序环境默认为移动端
    isWechat: false,
    isIOS: false,
    isAndroid: false,
    isMiniProgram: true,
    screenInfo: {
      windowWidth: 375,
      windowHeight: 667,
      statusBarHeight: 20,
      safeAreaTop: 20,
      safeAreaBottom: 0
    },
    deviceInfo: {
      brand: '',
      model: '',
      platform: '',
      system: ''
    }
  })

  useEffect(() => {
    const getSystemInfo = async () => {
      try {
        const systemInfo = await Taro.getSystemInfo()

        // 判断平台
        const isIOS = systemInfo.platform === 'ios'
        const isAndroid = systemInfo.platform === 'android'
        const isWechat = Taro.getEnv() === Taro.ENV_TYPE.WEAPP

        // 安全区域信息
        const safeArea = systemInfo.safeArea
        const screenHeight = systemInfo.screenHeight || 667
        const windowHeight = systemInfo.windowHeight || 667

                // 使用微信小程序原生API获取安全区域信息
        let safeAreaBottom = 0

        // 方法1：直接使用微信API的safeArea信息
        if (systemInfo.safeArea) {
          safeAreaBottom = (systemInfo.screenHeight || 0) - (systemInfo.safeArea.bottom || 0)
        }

        // 方法2：使用safeAreaInsets（如果可用）
        if (safeAreaBottom === 0 && systemInfo.safeAreaInsets) {
          safeAreaBottom = systemInfo.safeAreaInsets.bottom || 0
        }

        // 方法3：对于iPhone，如果以上都没有，使用screenHeight和windowHeight差值
        if (safeAreaBottom === 0 && isIOS) {
          const totalHeight = systemInfo.screenHeight || 0
          const usableHeight = systemInfo.windowHeight || 0
          const statusHeight = systemInfo.statusBarHeight || 0

          if (totalHeight > usableHeight + statusHeight) {
            safeAreaBottom = totalHeight - usableHeight - statusHeight
          }
        }

        // 调试日志
        console.log('useMobile 安全区域计算:', {
          platform: systemInfo.platform,
          model: systemInfo.model,
          screenHeight: systemInfo.screenHeight,
          windowHeight: systemInfo.windowHeight,
          statusBarHeight: systemInfo.statusBarHeight,
          safeArea: systemInfo.safeArea,
          calculatedSafeAreaBottom: safeAreaBottom,
          isIOS
        })

        setMobileInfo({
          isMobile: true,
          isWechat,
          isIOS,
          isAndroid,
          isMiniProgram: true,
          screenInfo: {
            windowWidth: systemInfo.windowWidth || 375,
            windowHeight: windowHeight,
            statusBarHeight: systemInfo.statusBarHeight || 20,
            safeAreaTop: safeArea?.top || systemInfo.statusBarHeight || 20,
            safeAreaBottom
          },
          deviceInfo: {
            brand: systemInfo.brand || '',
            model: systemInfo.model || '',
            platform: systemInfo.platform || '',
            system: systemInfo.system || ''
          }
        })
      } catch (error) {
        console.warn('获取系统信息失败:', error)
        // 使用默认值
      }
    }

    getSystemInfo()
  }, [])

  return mobileInfo
}

/**
 * 获取安全区域样式
 * @returns 安全区域相关的样式对象
 */
export function useSafeAreaStyles() {
  const { screenInfo } = useMobile()

  return {
    paddingTop: `${screenInfo.statusBarHeight}px`,
    paddingBottom: `${screenInfo.safeAreaBottom}px`,
    statusBarHeight: `${screenInfo.statusBarHeight}px`,
    safeAreaTop: `${screenInfo.safeAreaTop}px`,
    safeAreaBottom: `${screenInfo.safeAreaBottom}px`
  }
}

/**
 * 判断是否为iPhone X系列（需要底部安全区域）
 */
export function useIsIphoneX() {
  const { deviceInfo, screenInfo } = useMobile()

  // 简化检测逻辑：主要基于iOS平台和屏幕高度
  const isIOS = deviceInfo.platform === 'ios'

  // iPhone X系列特征：屏幕高度较高 (通常 >= 812pt)
  // 在模拟器中，这个值可能不同，所以降低阈值
  const hasXSeriesScreen = screenInfo.windowHeight >= 750

  // 检查设备型号（备用）
  const model = deviceInfo.model?.toLowerCase() || ''
  const isXSeriesByModel = model.includes('iphone') && (
    model.includes('x') ||
    model.includes('11') ||
    model.includes('12') ||
    model.includes('13') ||
    model.includes('14') ||
    model.includes('15') ||
    model.includes('pro')
  )

  // 最终判断：iOS + (高屏幕 或 X系列型号)
  const isIphoneX = isIOS && (hasXSeriesScreen || isXSeriesByModel)

  // 调试日志
  console.log('useIsIphoneX 简化检测结果:', {
    platform: deviceInfo.platform,
    model: deviceInfo.model,
    windowHeight: screenInfo.windowHeight,
    safeAreaBottom: screenInfo.safeAreaBottom,
    isIOS,
    hasXSeriesScreen,
    isXSeriesByModel,
    finalResult: isIphoneX
  })

  return isIphoneX
}
