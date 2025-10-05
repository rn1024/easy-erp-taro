import React, { useMemo } from 'react'
import { View, Text } from '@tarojs/components'
import './index.scss'

export interface ProgressBarProps {
  value: number
  max?: number
  showLabel?: boolean
  label?: string
  color?: string
  backgroundColor?: string
  height?: number
  className?: string
  trackClassName?: string
  fillClassName?: string
}

const clamp = (value: number) => {
  if (Number.isNaN(value)) {
    return 0
  }
  if (value < 0) {
    return 0
  }
  if (value > 100) {
    return 100
  }
  return value
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max = 100,
  showLabel = true,
  label,
  color = 'var(--color-primary)',
  backgroundColor = 'var(--bg-hover)',
  height = 16,
  className = '',
  trackClassName = '',
  fillClassName = ''
}) => {
  const percentage = useMemo(() => clamp((value / max) * 100), [value, max])

  const rootClass = ['progress-bar', className].filter(Boolean).join(' ')
  const trackClass = ['progress-bar__track', trackClassName].filter(Boolean).join(' ')
  const fillClass = ['progress-bar__fill', fillClassName].filter(Boolean).join(' ')

  return (
    <View className={rootClass}>
      <View
        className={trackClass}
        style={{ background: backgroundColor, height: `${height}rpx` }}
      >
        <View
          className={fillClass}
          style={{ width: `${percentage}%`, background: color }}
        />
      </View>
      {showLabel && (
        <Text className='progress-bar__label'>
          {label ?? `${Math.round(percentage)}%`}
        </Text>
      )}
    </View>
  )
}

export default ProgressBar
