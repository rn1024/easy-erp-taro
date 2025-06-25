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
        const safeArea = systemInfo.safeArea || {
          top: systemInfo.statusBarHeight || 20,
          bottom: systemInfo.windowHeight || 667
        }

        setMobileInfo({
          isMobile: true,
          isWechat,
          isIOS,
          isAndroid,
          isMiniProgram: true,
          screenInfo: {
            windowWidth: systemInfo.windowWidth || 375,
            windowHeight: systemInfo.windowHeight || 667,
            statusBarHeight: systemInfo.statusBarHeight || 20,
            safeAreaTop: safeArea.top || 20,
            safeAreaBottom: (systemInfo.screenHeight || 667) - (safeArea.bottom || 667)
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

  // iPhone X系列特征：iOS系统 + 底部安全区域 > 0
  return deviceInfo.platform === 'ios' && screenInfo.safeAreaBottom > 0
}
