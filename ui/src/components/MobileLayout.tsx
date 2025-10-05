import React, { ReactNode } from 'react';

interface MobileLayoutProps {
  children: ReactNode
  header?: ReactNode
  footer?: ReactNode
  className?: string
}

export default function MobileLayout({ 
  children, 
  header,
  footer,
  className = ''
}: MobileLayoutProps) {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {/* Header */}
      {header && (
        <div className="relative z-10">
          {header}
        </div>
      )}
      
      {/* Main Content */}
      <main className="relative z-0">
        {children}
      </main>
      
      {/* Footer */}
      {footer && (
        <div className="relative z-10">
          {footer}
        </div>
      )}
    </div>
  )
}