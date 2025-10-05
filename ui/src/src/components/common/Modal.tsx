'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'
import { classNames } from '@/utils'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showCloseButton?: boolean
  closeOnOverlayClick?: boolean
  className?: string
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
  className
}: ModalProps) {
  // 处理 ESC 键关闭
  useEffect(() => {
    if (!isOpen) return

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleEscape)
    return () => document.removeEventListener('keydown', handleEscape)
  }, [isOpen, onClose])

  // 防止背景滚动
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl'
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnOverlayClick) {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 背景遮罩 */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm transition-opacity"
        onClick={handleOverlayClick}
        aria-hidden="true"
      />
      
      {/* 模态框内容 */}
      <div className={classNames(
        'relative bg-white rounded-lg shadow-xl w-full max-h-[90vh] overflow-hidden',
        'transform transition-all',
        'animate-scale-in',
        sizeClasses[size],
        className
      )}>
        {/* 头部 */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
          <h3 className="text-lg font-medium text-gray-900 line-clamp-1">
            {title}
          </h3>
          {showCloseButton && (
            <button
              onClick={onClose}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors touch-feedback"
              aria-label="关闭"
            >
              <X className="h-5 w-5 text-gray-500" />
            </button>
          )}
        </div>
        
        {/* 内容区域 */}
        <div className="p-4 overflow-y-auto max-h-[calc(90vh-80px)] mobile-scroll">
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal