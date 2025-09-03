import React from 'react';
import { View } from '@tarojs/components';
import { Tag } from '@nutui/nutui-react-taro';
import './index.scss';

export type StatusType = 'default' | 'primary' | 'success' | 'warning' | 'danger' | 'info';

interface StatusTagProps {
  status: string | number;
  statusMap?: Record<string | number, {
    text: string;
    type: StatusType;
    icon?: React.ReactNode;
  }>;
  className?: string;
  size?: 'small' | 'normal' | 'large';
}

// 默认状态映射
const defaultStatusMap = {
  pending: { text: '待处理', type: 'warning' as StatusType },
  processing: { text: '处理中', type: 'primary' as StatusType },
  completed: { text: '已完成', type: 'success' as StatusType },
  failed: { text: '失败', type: 'danger' as StatusType },
  cancelled: { text: '已取消', type: 'default' as StatusType }
};

const StatusTag: React.FC<StatusTagProps> = ({
  status,
  statusMap = defaultStatusMap,
  className = '',
  size = 'small'
}) => {
  const statusConfig = statusMap[status];
  
  if (!statusConfig) {
    return (
      <Tag size={size} className={className}>
        {String(status)}
      </Tag>
    );
  }
  
  return (
    <Tag 
      type={statusConfig.type}
      size={size}
      className={`nut-status-tag ${className}`}
    >
      {statusConfig.icon && (
        <span className="nut-status-tag-icon">{statusConfig.icon}</span>
      )}
      {statusConfig.text}
    </Tag>
  );
};

// 导出一些预设的状态映射
export const StatusMaps = {
  // 订单状态
  order: {
    0: { text: '待付款', type: 'warning' as StatusType },
    1: { text: '待发货', type: 'primary' as StatusType },
    2: { text: '已发货', type: 'info' as StatusType },
    3: { text: '已收货', type: 'success' as StatusType },
    4: { text: '已取消', type: 'default' as StatusType },
    5: { text: '已退款', type: 'danger' as StatusType }
  },
  
  // 任务状态
  task: {
    'pending': { text: '待开始', type: 'default' as StatusType },
    'in_progress': { text: '进行中', type: 'primary' as StatusType },
    'completed': { text: '已完成', type: 'success' as StatusType },
    'failed': { text: '失败', type: 'danger' as StatusType },
    'cancelled': { text: '已取消', type: 'warning' as StatusType }
  },
  
  // 库存状态
  inventory: {
    'sufficient': { text: '充足', type: 'success' as StatusType },
    'low': { text: '偏低', type: 'warning' as StatusType },
    'out_of_stock': { text: '缺货', type: 'danger' as StatusType }
  },
  
  // 包装任务状态
  packageTask: {
    '待到货': { text: '待到货', type: 'default' as StatusType },
    '等待包装': { text: '等待包装', type: 'warning' as StatusType },
    '正在包装': { text: '正在包装', type: 'primary' as StatusType },
    '已完成': { text: '已完成', type: 'success' as StatusType }
  },
  
  // 发货任务状态
  shipmentTask: {
    '仓库待发货': { text: '仓库待发货', type: 'warning' as StatusType },
    '仓库已发货': { text: '仓库已发货', type: 'primary' as StatusType },
    '在途': { text: '在途', type: 'info' as StatusType },
    '到港': { text: '到港', type: 'info' as StatusType },
    '交付': { text: '交付', type: 'info' as StatusType },
    '等待接收': { text: '等待接收', type: 'warning' as StatusType },
    '正在接收': { text: '正在接收', type: 'primary' as StatusType },
    '已完成': { text: '已完成', type: 'success' as StatusType }
  }
};

export default StatusTag;