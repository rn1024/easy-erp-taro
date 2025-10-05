import React from 'react'

export const View: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties; onClick?: () => void }>> = ({ 
  children, 
  className, 
  style,
  onClick 
}) => (
  <div className={className} style={style} onClick={onClick}>
    {children}
  </div>
)

export const Text: React.FC<React.PropsWithChildren<{ className?: string; style?: React.CSSProperties; onClick?: () => void }>> = ({ 
  children, 
  className, 
  style,
  onClick 
}) => (
  <span className={className} style={style} onClick={onClick}>
    {children}
  </span>
)

export const Input: React.FC<{
  className?: string
  style?: React.CSSProperties
  value?: string
  type?: string
  placeholder?: string
  disabled?: boolean
  onInput?: (e: { detail: { value: string } }) => void
}> = ({ 
  className, 
  style, 
  value, 
  type = 'text', 
  placeholder, 
  disabled,
  onInput 
}) => (
  <input
    className={className}
    style={style}
    value={value}
    type={type}
    placeholder={placeholder}
    disabled={disabled}
    onChange={(e) => onInput?.({ detail: { value: e.target.value } })}
  />
)