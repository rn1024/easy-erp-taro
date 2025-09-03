import React from 'react';
import { View } from '@tarojs/components';
import { Empty, Button } from '@nutui/nutui-react-taro';
import './index.scss';

interface EmptyStateProps {
  image?: string;
  imageSize?: number;
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  className?: string;
  type?: 'empty' | 'error' | 'network' | 'search';
}

const EmptyState: React.FC<EmptyStateProps> = ({
  image,
  imageSize,
  title,
  description,
  actionText,
  onAction,
  className = '',
  type = 'empty'
}) => {
  const getDefaultContent = () => {
    switch (type) {
      case 'error':
        return {
          title: '加载失败',
          description: '请检查网络连接后重试',
          actionText: '重新加载'
        };
      case 'network':
        return {
          title: '网络异常',
          description: '请检查网络设置',
          actionText: '刷新'
        };
      case 'search':
        return {
          title: '无搜索结果',
          description: '换个关键词试试',
          actionText: ''
        };
      default:
        return {
          title: '暂无数据',
          description: '',
          actionText: ''
        };
    }
  };
  
  const defaultContent = getDefaultContent();
  const finalTitle = title || defaultContent.title;
  const finalDescription = description || defaultContent.description;
  const finalActionText = actionText || defaultContent.actionText;
  
  return (
    <View className={`nut-empty-state ${className}`}>
      <Empty
        image={image}
        imageSize={imageSize}
        description={
          <View className="nut-empty-state-content">
            {finalTitle && (
              <View className="nut-empty-state-title">{finalTitle}</View>
            )}
            {finalDescription && (
              <View className="nut-empty-state-description">{finalDescription}</View>
            )}
          </View>
        }
      />
      
      {finalActionText && onAction && (
        <View className="nut-empty-state-action">
          <Button 
            type="primary" 
            size="small"
            onClick={onAction}
          >
            {finalActionText}
          </Button>
        </View>
      )}
    </View>
  );
};

export default EmptyState;