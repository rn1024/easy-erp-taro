import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
// @ts-ignore
import { MaterialIcons } from 'taro-icons'
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import './index.scss'

interface ProductInventory {
  id: string
  name: string
  quantity: number
  shop: string
  location: string
  dimensions: string
  weight: number
  status: 'normal' | 'low'
}

const FinishedInventory: React.FC = () => {
  const [searchValue, setSearchValue] = useState('')

  const inventoryData: ProductInventory[] = [
    {
      id: '1',
      name: 'iPhone 15 Pro Max 钛金属保护壳',
      quantity: 120,
      shop: '天猫旗舰店',
      location: 'A1-01',
      dimensions: '15x10x5cm',
      weight: 2.5,
      status: 'normal'
    },
    {
      id: '2',
      name: '冬季羽绒服男款加厚保暖外套',
      quantity: 8,
      shop: '京东专卖店',
      location: 'B1-02',
      dimensions: '60x40x20cm',
      weight: 8,
      status: 'low'
    },
    {
      id: '3',
      name: '智能扫地机器人带拖地功能',
      quantity: 25,
      shop: '拼多多官店',
      location: 'A2-01',
      dimensions: '45x45x25cm',
      weight: 12.5,
      status: 'low'
    }
  ]

  const filteredData = inventoryData.filter(item =>
    item.name.toLowerCase().includes(searchValue.toLowerCase()) ||
    item.shop.toLowerCase().includes(searchValue.toLowerCase())
  )

  return (
    <MobileLayout
      className='finished-inventory'
    >
      {/* 搜索框 */}
      <View className='finished-inventory__search'>
        <SearchBar
          placeholder='搜索产品名称、店铺或分类'
          value={searchValue}
          onChange={setSearchValue}
          onSearch={setSearchValue}
        />
      </View>

      {/* 库存列表 */}
      <View className='inventory-list'>
        {filteredData.map(item => (
          <View key={item.id} className='inventory-card'>
            {/* 标题行 */}
            <View className='card-header'>
              <Text className='product-name'>{item.name}</Text>
              <View className={`status-badge status-${item.status}`}>
                <Text className='status-text'>
                  {item.status === 'low' ? '库存不足' : '库存充足'}
                </Text>
              </View>
            </View>

            {/* 数量显示 */}
            <View className='quantity-section'>
              <Text className='quantity-value'>{item.quantity}</Text>
              <Text className='quantity-unit'>件</Text>
            </View>

            {/* 详细信息 */}
            <View className='detail-section'>
              <View className='detail-item'>
                <MaterialIcons name='store' size={18} color='#666' />
                <Text className='detail-label'>店铺:</Text>
                <Text className='detail-value'>{item.shop}</Text>
              </View>

              <View className='detail-item'>
                <MaterialIcons name='location-on' size={18} color='#666' />
                <Text className='detail-label'>货位:</Text>
                <Text className='detail-value'>{item.location}</Text>
              </View>

              <View className='detail-item'>
                <MaterialIcons name='straighten' size={18} color='#666' />
                <Text className='detail-label'>外箱:</Text>
                <Text className='detail-value'>{item.dimensions}</Text>
              </View>

              <View className='detail-item'>
                <MaterialIcons name='fitness-center' size={18} color='#666' />
                <Text className='detail-label'>重量:</Text>
                <Text className='detail-value'>{item.weight}kg</Text>
              </View>
            </View>

            {/* 操作按钮 */}
            <View className='action-section'>
              <View className='action-button edit-button'>
                <MaterialIcons name='edit' size={18} color='#1890ff' />
                <Text className='action-text'>编辑</Text>
              </View>
              <View className='action-button delete-button'>
                <MaterialIcons name='delete-outline' size={18} color='#ff4d4f' />
                <Text className='action-text'>删除</Text>
              </View>
            </View>
          </View>
        ))}
      </View>
    </MobileLayout>
  )
}

export default FinishedInventory
