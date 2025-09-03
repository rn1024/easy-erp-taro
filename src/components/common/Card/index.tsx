import React from 'react';
import { View, Text } from '@tarojs/components';
import './index.scss';

interface CardProps {
  title?: string;
  subtitle?: string;
  extra?: React.ReactNode;
  footer?: React.ReactNode;
  children: React.ReactNode;
  showArrow?: boolean;
  onClick?: () => void;
  className?: string;
  bodyClassName?: string;
  noPadding?: boolean;
  shadow?: 'none' | 'sm' | 'base' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  title,
  subtitle,
  extra,
  footer,
  children,
  showArrow = false,
  onClick,
  className = '',
  bodyClassName = '',
  noPadding = false,
  shadow = 'base'
}) => {
  const shadowClass = shadow === 'none' ? '' : `shadow-${shadow}`;
  
  return (
    <View 
      className={`nut-card ${shadowClass} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
    >
      {(title || subtitle || extra) && (
        <View className="nut-card-header">
          <View className="nut-card-header-content">
            {title && <View className="nut-card-header-title">{title}</View>}
            {subtitle && <View className="nut-card-header-subtitle">{subtitle}</View>}
          </View>
          {extra && <View className="nut-card-header-extra">{extra}</View>}
          {showArrow && <Text className="nut-card-header-arrow">›</Text>}
        </View>
      )}
      
      <View className={`nut-card-body ${noPadding ? 'no-padding' : ''} ${bodyClassName}`}>
        {children}
      </View>
      
      {footer && (
        <View className="nut-card-footer">
          {footer}
        </View>
      )}
    </View>
  );
};

export default Card;