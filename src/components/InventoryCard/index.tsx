import React from 'react'
import { View, Text } from '@tarojs/components'
import { MaterialIcons } from 'taro-icons'
import type { FinishedInventory, SpareInventory } from '@/types/admin'
import './index.scss'

// 通用库存类型
type InventoryItem = FinishedInventory | SpareInventory

interface InventoryCardProps {
  item: InventoryItem
  type: 'finished' | 'spare'
  onEdit?: (item: InventoryItem) => void
  onDelete?: (item: InventoryItem) => void
  onClick?: (item: InventoryItem) => void
}

const InventoryCard: React.FC<InventoryCardProps> = ({ 
  item, 
  type, 
  onEdit, 
  onDelete, 
  onClick 
}) => {
  // 库存状态判断
  const getStockStatus = (quantity: number) => {
    if (quantity <= 10) {
      return {
        text: '库存不足',
        color: '#ef4444',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        icon: <MaterialIcons name="warning" size={12} color="#ef4444" />
      }
    } else if (quantity <= 50) {
      return {
        text: '库存偏低',
        color: '#f59e0b',
        bgColor: 'rgba(245, 158, 11, 0.1)',
        icon: <MaterialIcons name="error_outline" size={12} color="#f59e0b" />
      }
    } else {
      return {
        text: '库存充足',
        color: '#10b981',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        icon: <MaterialIcons name="check_circle" size={12} color="#10b981" />
      }
    }
  }

  // 处理卡片点击
  const handleCardClick = () => {
    onClick?.(item)
  }

  // 处理编辑按钮点击
  const handleEditClick = (e: any) => {
    e.stopPropagation()
    onEdit?.(item)
  }

  // 处理删除按钮点击
  const handleDeleteClick = (e: any) => {
    e.stopPropagation()
    onDelete?.(item)
  }

  const stockStatus = getStockStatus(item.quantity)

  return (
    <View className="inventory-card" onClick={handleCardClick}>
      {/* 卡片头部 */}
      <View className="inventory-card__header">
        <View className="inventory-card__left">
          <Text className="inventory-card__title">{item.productName}</Text>
          <View className="inventory-card__meta">
            <View 
              className="inventory-card__status"
              style={{
                color: stockStatus.color,
                backgroundColor: stockStatus.bgColor
              }}
            >
              {stockStatus.icon}
              <Text className="inventory-card__status-text">{stockStatus.text}</Text>
            </View>
            <Text className="inventory-card__category">{item.category}</Text>
          </View>
        </View>
        <View className="inventory-card__right">
          <Text className="inventory-card__quantity">{item.quantity}</Text>
          <Text className="inventory-card__unit">
            {type === 'spare' && 'spareType' in item ? item.spareType : '件'}
          </Text>
        </View>
      </View>

      {/* 卡片内容 */}
      <View className="inventory-card__content">
        <View className="inventory-card__row">
          <View className="inventory-card__info">
            <MaterialIcons name="store" size={14} color="#6b7280" />
            <Text className="inventory-card__label">店铺:</Text>
            <Text className="inventory-card__value">{item.shop}</Text>
          </View>
          <View className="inventory-card__info">
            <MaterialIcons name="location_on" size={14} color="#6b7280" />
            <Text className="inventory-card__label">货位:</Text>
            <Text className="inventory-card__value">{item.location}</Text>
          </View>
        </View>

        {/* 成品库存特有信息 */}
        {type === 'finished' && 'outerSize' in item && (
          <View className="inventory-card__row">
            <View className="inventory-card__info">
              <MaterialIcons name="inbox" size={14} color="#6b7280" />
              <Text className="inventory-card__label">外箱:</Text>
              <Text className="inventory-card__value">{item.outerSize}</Text>
            </View>
            <View className="inventory-card__info">
              <MaterialIcons name="scale" size={14} color="#6b7280" />
              <Text className="inventory-card__label">重量:</Text>
              <Text className="inventory-card__value">{item.weight}kg</Text>
            </View>
          </View>
        )}
      </View>

      {/* 操作按钮 */}
      <View className="inventory-card__actions">
        <View 
          className="inventory-card__action-btn inventory-card__action-btn--edit"
          onClick={handleEditClick}
        >
          <MaterialIcons name="edit" size={16} color="#3b82f6" />
          <Text className="inventory-card__action-text">编辑</Text>
        </View>
        <View 
          className="inventory-card__action-btn inventory-card__action-btn--delete"
          onClick={handleDeleteClick}
        >
          <MaterialIcons name="delete" size={16} color="#ef4444" />
          <Text className="inventory-card__action-text">删除</Text>
        </View>
      </View>
    </View>
  )
}

export default InventoryCard 