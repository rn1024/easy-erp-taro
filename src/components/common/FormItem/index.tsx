import React from 'react';
import { View } from '@tarojs/components';
import './index.scss';

interface FormItemProps {
  label?: string;
  required?: boolean;
  error?: string;
  help?: string;
  children: React.ReactNode;
  layout?: 'horizontal' | 'vertical';
  labelWidth?: string;
  className?: string;
  colon?: boolean;
}

const FormItem: React.FC<FormItemProps> = ({
  label,
  required = false,
  error,
  help,
  children,
  layout = 'vertical',
  labelWidth = '200rpx',
  className = '',
  colon = true
}) => {
  return (
    <View className={`nut-form-item ${layout} ${error ? 'has-error' : ''} ${className}`}>
      {label && (
        <View 
          className="nut-form-item-label"
          style={layout === 'horizontal' ? { width: labelWidth } : {}}
        >
          {required && <span className="nut-form-item-required">*</span>}
          {label}
          {colon && layout === 'horizontal' && '：'}
        </View>
      )}
      
      <View className="nut-form-item-control">
        <View className="nut-form-item-control-input">
          {children}
        </View>
        
        {error && (
          <View className="nut-form-item-error">
            {error}
          </View>
        )}
        
        {help && !error && (
          <View className="nut-form-item-help">
            {help}
          </View>
        )}
      </View>
    </View>
  );
};

export default FormItem;