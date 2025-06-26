import React from 'react'
import { Button as NutButton } from '@nutui/nutui-react-taro'
import { cn } from '../../../utils/cn'
import './index.scss'

export interface ButtonProps {
  /**
   * 按钮类型
   * @default 'default'
   */
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'ghost' | 'outline'

  /**
   * 按钮大小
   * @default 'medium'
   */
  size?: 'small' | 'medium' | 'large'

  /**
   * 是否占满宽度
   * @default false
   */
  fullWidth?: boolean

  /**
   * 是否禁用
   */
  disabled?: boolean

  /**
   * 是否加载中
   */
  loading?: boolean

  /**
   * 自定义类名
   */
  className?: string

  /**
   * 子元素
   */
  children?: React.ReactNode

  /**
   * 点击事件
   */
  onClick?: () => void
}

/**
 * 按钮组件
 * 基于NutUI Button的封装，提供更符合设计规范的样式
 */
export const Button: React.FC<ButtonProps> = ({
  variant = 'default',
  size = 'medium',
  fullWidth = false,
  disabled = false,
  loading = false,
  className,
  children,
  onClick
}) => {
  // 映射variant到NutUI的type和plain属性
  const getButtonType = () => {
    switch (variant) {
      case 'primary':
        return { type: 'primary' as const, plain: false }
      case 'success':
        return { type: 'success' as const, plain: false }
      case 'warning':
        return { type: 'warning' as const, plain: false }
      case 'danger':
        return { type: 'danger' as const, plain: false }
      case 'ghost':
        return { type: 'default' as const, plain: true }
      case 'outline':
        return { type: 'primary' as const, plain: true }
      default:
        return { type: 'default' as const, plain: false }
    }
  }

  // 映射size到NutUI的size属性
  const getNutSize = () => {
    switch (size) {
      case 'small':
        return 'small'
      case 'large':
        return 'large'
      default:
        return 'normal'
    }
  }

  const { type, plain } = getButtonType()

  return (
    <NutButton
      type={type}
      plain={plain}
      size={getNutSize()}
      block={fullWidth}
      disabled={disabled}
      loading={loading}
      className={cn(
        'ui-button',
        `ui-button--${variant}`,
        `ui-button--${size}`,
        {
          'ui-button--full': fullWidth
        },
        className
      )}
      onClick={onClick}
    >
      {children}
    </NutButton>
  )
}

/**
 * 图标按钮
 */
export interface IconButtonProps extends ButtonProps {
  /**
   * 图标
   */
  icon: React.ReactNode

  /**
   * 是否为圆形按钮
   * @default false
   */
  round?: boolean
}

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  round = false,
  size = 'medium',
  className,
  children,
  ...props
}) => {
  return (
    <Button
      size={size}
      className={cn(
        'ui-icon-button',
        {
          'ui-icon-button--round': round
        },
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </Button>
  )
}
