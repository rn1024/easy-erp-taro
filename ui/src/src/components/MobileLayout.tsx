'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface MobileLayoutProps {
  children: React.ReactNode
  className?: string
}

export function MobileLayout({ children, className }: MobileLayoutProps) {
  return (
    <div className={cn(
      "mobile-container",
      "relative min-h-screen bg-gray-50",
      "touch-manipulation",
      "select-none-important",
      className
    )}>
      <div className="mobile-safe-area">
        {children}
      </div>
    </div>
  )
}

export default MobileLayout