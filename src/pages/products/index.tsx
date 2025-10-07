import React, { useState, useMemo } from 'react'
import Taro from '@tarojs/taro'
import { View, Text, Image } from '@tarojs/components'
import { PullToRefresh } from '@nutui/nutui-react-taro'

/**
 * Components
 */
import MobileLayout from '@/components/MobileLayout'
import SearchBar from '@/components/SearchBar'
import { Icon } from '@/components/common'

import './index.scss'

interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  price: number
  status: 'active' | 'outOfStock'
  image?: string
}

const statusConfig = {
  active: { label: '在售', color: '#10b981' },
  outOfStock: { label: '缺货', color: '#ef4444' }
}

const ProductsPage: React.FC = () => {
  const [searchText, setSearchText] = useState('')
  const [products] = useState<Product[]>([
    {
      id: '1',
      name: 'iPhone 15 Pro Max',
      sku: 'IP15PM512BL',
      category: '手机数码',
      stock: 156,
      price: 9999,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=200&h=200&fit=crop'
    },
    {
      id: '2',
      name: 'MacBook Pro 14英寸',
      sku: 'MBP14M3512',
      category: '电脑设备',
      stock: 23,
      price: 14999,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200&h=200&fit=crop'
    },
    {
      id: '3',
      name: 'AirPods Pro 第3代',
      sku: 'APPRO3WHT',
      category: '音频设备',
      stock: 0,
      price: 1999,
      status: 'outOfStock',
      image: 'https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=200&fit=crop'
    },
    {
      id: '4',
      name: 'iPad Air 第5代',
      sku: 'IPAIR5256',
      category: '平板电脑',
      stock: 67,
      price: 4399,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200&h=200&fit=crop'
    },
    {
      id: '5',
      name: 'Apple Watch Series 9',
      sku: 'AWS945MN',
      category: '智能手表',
      stock: 89,
      price: 3199,
      status: 'active',
      image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=200&h=200&fit=crop'
    },
    {
      id: '6',
      name: 'Magic Keyboard',
      sku: 'MGKEY001',
      category: '配件',
      stock: 45,
      price: 799,
      status: 'active'
    }
  ])

  const handleRefresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 1000))
  }

  const handleProductClick = (product: Product) => {
    Taro.showModal({
      title: product.name,
      content: `SKU: ${product.sku}\n分类: ${product.category}\n库存: ${product.stock}件\n价格: ¥${product.price.toLocaleString()}`,
      showCancel: false,
      confirmText: '确定'
    })
  }

  const filteredProducts = useMemo(() => {
    if (!searchText.trim()) return products
    
    const searchLower = searchText.toLowerCase()
    return products.filter(product => 
      product.name.toLowerCase().includes(searchLower) ||
      product.sku.toLowerCase().includes(searchLower) ||
      product.category.toLowerCase().includes(searchLower)
    )
  }, [products, searchText])

  return (
    <MobileLayout className='products-page'>
      <View className='products-page__wrapper'>
        {/* 搜索区域 */}
        <View className='products-page__search-section'>
          <SearchBar
            placeholder='搜索产品名称或SKU'
            value={searchText}
            onChange={setSearchText}
            onSearch={setSearchText}
            className='products-page__search-bar'
          />
        </View>

        {/* 产品列表 */}
        <PullToRefresh onRefresh={handleRefresh}>
          <View className='products-page__content'>
            <View className='products-page__product-list'>
              {filteredProducts.map((product) => (
                <View
                  key={product.id}
                  className='product-card'
                  onClick={() => handleProductClick(product)}
                >
                  {/* 产品头部 */}
                  <View className='product-card__header'>
                    {product.image ? (
                      <Image
                        className='product-card__image'
                        src={product.image}
                        mode='aspectFill'
                      />
                    ) : (
                      <View className='product-card__image product-card__image--placeholder'>
                        <Icon name='image' size={24} color='var(--text-tertiary)' />
                      </View>
                    )}
                    
                    <View className='product-card__info'>
                      <Text className='product-card__name'>{product.name}</Text>
                      <Text className='product-card__sku'>SKU: {product.sku}</Text>
                      <Text className='product-card__category'>{product.category}</Text>
                    </View>
                    
                    <View 
                      className={`product-card__status product-card__status--${product.status}`}
                    >
                      <Text className='product-card__status-text'>
                        {statusConfig[product.status].label}
                      </Text>
                    </View>
                  </View>

                  {/* 产品底部 */}
                  <View className='product-card__footer'>
                    <View className='product-card__price-section'>
                      <Text className='product-card__price'>
                        ¥{product.price.toLocaleString()}
                      </Text>
                    </View>
                    <View className='product-card__stock-section'>
                      <Text className='product-card__stock'>
                        库存 {product.stock === 0 ? '缺货' : `${product.stock}件`}
                      </Text>
                    </View>
                  </View>
                </View>
              ))}
            </View>
            
            {filteredProducts.length === 0 && (
              <View className='products-page__empty'>
                <Icon name='inventory' size={48} color='var(--text-tertiary)' />
                <Text className='products-page__empty-text'>暂无符合条件的产品</Text>
                <Text className='products-page__empty-hint'>尝试调整搜索条件</Text>
              </View>
            )}
          </View>
        </PullToRefresh>
      </View>
    </MobileLayout>
  )
}

export default ProductsPage
