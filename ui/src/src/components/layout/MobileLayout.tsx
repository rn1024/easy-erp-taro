'use client'

import { classNames } from '@/utils'

interface MobileLayoutProps {
  children: React.ReactNode
  className?: string
  withSafeArea?: boolean
  withPadding?: boolean
}

export function MobileLayout({ 
  children, 
  className,
  withSafeArea = true,
  withPadding = true
}: MobileLayoutProps) {
  return (
    <div className={classNames(
      'wechat-container',
      'relative min-h-screen bg-wechat-bg',
      'touch-manipulation no-select',
      withSafeArea && 'wechat-safe-area',
      className
    )}>
      <div className={classNames(
        'min-h-full',
        withPadding && 'px-0'
      )}>
        {children}
      </div>
    </div>
  )
}

export default MobileLayout