import { useEffect, useMemo, useState } from 'react'
import Taro from '@tarojs/taro'

export interface ResponsiveState {
  width: number
  height: number
  pixelRatio: number
  isCompact: boolean
  isMedium: boolean
  isLarge: boolean
  isLandscape: boolean
  isShort: boolean
}

export interface ResponsiveBreakpoints {
  compact: number
  medium: number
  large: number
  shortHeight: number
}

const DEFAULT_BREAKPOINTS: ResponsiveBreakpoints = {
  compact: 414,
  medium: 768,
  large: 1024,
  shortHeight: 500
}

const getResponsiveState = (
  size: { windowWidth: number; windowHeight: number; pixelRatio?: number },
  breakpoints: ResponsiveBreakpoints
): ResponsiveState => {
  const { windowWidth, windowHeight, pixelRatio = 1 } = size

  return {
    width: windowWidth,
    height: windowHeight,
    pixelRatio,
    isCompact: windowWidth <= breakpoints.compact,
    isMedium: windowWidth <= breakpoints.medium,
    isLarge: windowWidth >= breakpoints.large,
    isLandscape: windowWidth > windowHeight,
    isShort: windowHeight <= breakpoints.shortHeight
  }
}

export const useResponsive = (
  customBreakpoints?: Partial<ResponsiveBreakpoints>
): ResponsiveState => {
  const breakpoints = useMemo(
    () => ({
      ...DEFAULT_BREAKPOINTS,
      ...customBreakpoints
    }),
    [customBreakpoints]
  )

  const [state, setState] = useState<ResponsiveState>(() => {
    try {
      const info = Taro.getSystemInfoSync()
      return getResponsiveState(info, breakpoints)
    } catch (_error) {
      return getResponsiveState(
        { windowWidth: 375, windowHeight: 667, pixelRatio: 2 },
        breakpoints
      )
    }
  })

  useEffect(() => {
    const handleResize = (res: Taro.onWindowResize.Result): void => {
      setState(
        getResponsiveState(
          {
            windowWidth: res.size.windowWidth,
            windowHeight: res.size.windowHeight,
            pixelRatio: res.devicePixelRatio
          },
          breakpoints
        )
      )
    }

    Taro.onWindowResize(handleResize)
    return () => {
      Taro.offWindowResize(handleResize)
    }
  }, [breakpoints])

  return state
}

export default useResponsive
