import React, { useState } from 'react';
import { View } from '@tarojs/components';
import { SearchBar as NutSearchBar, Button } from '@nutui/nutui-react-taro';
import Taro from '@tarojs/taro';
import Icon from '../Icon';
import './index.scss';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (value: string) => void;
  onClear?: () => void;
  onScan?: () => void;
  onFilter?: () => void;
  showScan?: boolean;
  showFilter?: boolean;
  className?: string;
  maxLength?: number;
  autoFocus?: boolean;
  disabled?: boolean;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = '请输入搜索内容',
  value = '',
  onChange,
  onSearch,
  onClear,
  onScan,
  onFilter,
  showScan = false,
  showFilter = false,
  className = '',
  maxLength,
  autoFocus = false,
  disabled = false
}) => {
  const [searchValue, setSearchValue] = useState(value);
  
  const handleChange = (val: string) => {
    setSearchValue(val);
    onChange?.(val);
  };
  
  const handleSearch = () => {
    onSearch?.(searchValue);
  };
  
  const handleClear = () => {
    setSearchValue('');
    onChange?.('');
    onClear?.();
  };
  
  const handleScan = async () => {
    if (onScan) {
      onScan();
      return;
    }
    
    // 默认扫码功能
    try {
      const res = await Taro.scanCode({
        scanType: ['barCode', 'qrCode'],
      });
      if (res.result) {
        handleChange(res.result);
        handleSearch();
      }
    } catch (error) {
      console.error('扫码失败:', error);
    }
  };
  
  return (
    <View className={`nut-search-bar-wrapper ${className}`}>
      <View className="nut-search-bar-container">
        <NutSearchBar
          value={searchValue}
          placeholder={placeholder}
          onChange={handleChange}
          onSearch={handleSearch}
          onClear={handleClear}
          maxLength={maxLength}
          autoFocus={autoFocus}
          disabled={disabled}
          className='nut-search-bar-input'
        />
        
        {(showScan || showFilter) && (
          <View className='nut-search-bar-actions'>
            {showScan && (
              <Button
                className='nut-search-bar-action-btn'
                fill='none'
                onClick={handleScan}
              >
                <Icon name='camera' size={20} />
              </Button>
            )}
            
            {showFilter && (
              <Button
                className='nut-search-bar-action-btn'
                fill='none'
                onClick={onFilter}
              >
                <Icon name='settings' size={20} />
              </Button>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SearchBar;