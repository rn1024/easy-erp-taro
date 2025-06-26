import React, { useState } from 'react'
import { View, Text } from '@tarojs/components'
import {
  Button,
  IconButton,
  Input,
  SearchInput,
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
  Badge,
  StatusBadge
} from '../../components/ui'
import { useForm } from '../../hooks/useForm'
import { IconFont } from '@nutui/icons-react-taro'
import './index.scss'

/**
 * UI组件库演示页面
 */
export default function UIDemo() {
  const [searchValue, setSearchValue] = useState('')

  const form = useForm({
    initialValues: {
      username: '',
      email: '',
      password: ''
    },
    validationRules: {
      username: { required: true, minLength: 3 },
      email: { required: true, pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ },
      password: { required: true, minLength: 6 }
    },
    onSubmit: (values) => {
      console.log('Form submitted:', values)
    }
  })

  return (
    <View className="ui-demo">
      <View className="ui-demo__section">
        <Text className="ui-demo__title">按钮组件 Button</Text>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">按钮类型</Text>
          <View className="ui-demo__row">
            <Button variant="default">默认按钮</Button>
            <Button variant="primary">主要按钮</Button>
            <Button variant="success">成功按钮</Button>
          </View>
          <View className="ui-demo__row">
            <Button variant="warning">警告按钮</Button>
            <Button variant="danger">危险按钮</Button>
            <Button variant="ghost">幽灵按钮</Button>
          </View>
          <View className="ui-demo__row">
            <Button variant="outline">轮廓按钮</Button>
          </View>
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">按钮尺寸</Text>
          <View className="ui-demo__row">
            <Button size="small">小按钮</Button>
            <Button size="medium">中按钮</Button>
            <Button size="large">大按钮</Button>
          </View>
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">按钮状态</Text>
          <View className="ui-demo__row">
            <Button disabled>禁用按钮</Button>
            <Button loading>加载中</Button>
            <Button fullWidth>全宽按钮</Button>
          </View>
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">图标按钮</Text>
          <View className="ui-demo__row">
            <IconButton icon={<IconFont name="add" />} />
            <IconButton icon={<IconFont name="search" />} variant="primary" />
            <IconButton icon={<IconFont name="heart" />} variant="danger" round />
          </View>
        </View>
      </View>

      <View className="ui-demo__section">
        <Text className="ui-demo__title">输入框组件 Input</Text>

        <View className="ui-demo__group">
          <Input
            label="用户名"
            placeholder="请输入用户名"
            value={form.formState.username?.value || ''}
            onChange={(value) => form.setValue('username', value)}
            error={form.formState.username?.error}
            required
          />

          <Input
            label="邮箱"
            type="text"
            placeholder="请输入邮箱"
            value={form.formState.email?.value || ''}
            onChange={(value) => form.setValue('email', value)}
            error={form.formState.email?.error}
            required
          />

          <Input
            label="密码"
            type="password"
            placeholder="请输入密码"
            value={form.formState.password?.value || ''}
            onChange={(value) => form.setValue('password', value)}
            error={form.formState.password?.error}
            helperText="密码至少6位"
            required
          />

          <Input
            label="禁用输入"
            placeholder="这是禁用的输入框"
            disabled
          />
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">搜索输入框</Text>
          <SearchInput
            value={searchValue}
            onChange={setSearchValue}
            onSearch={(value) => console.log('搜索:', value)}
          />
        </View>
      </View>

      <View className="ui-demo__section">
        <Text className="ui-demo__title">卡片组件 Card</Text>

        <Card
          title="卡片标题"
          subtitle="这是卡片的副标题"
          extra={<Button size="small">操作</Button>}
        >
          <Text>这是卡片的内容区域，可以放置任何内容。</Text>
        </Card>

        <Card
          title="可点击卡片"
          clickable
          onClick={() => console.log('卡片被点击')}
        >
          <Text>点击整个卡片查看效果</Text>
        </Card>

        <Card bordered={false}>
          <CardHeader>
            <CardTitle>自定义卡片</CardTitle>
            <CardDescription>使用独立的卡片组件</CardDescription>
          </CardHeader>
          <CardContent>
            <Text>这是使用独立组件构建的卡片内容。</Text>
          </CardContent>
        </Card>
      </View>

      <View className="ui-demo__section">
        <Text className="ui-demo__title">徽标组件 Badge</Text>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">徽标类型</Text>
          <View className="ui-demo__row ui-demo__row--badge">
            <Badge value="99" variant="default">
              <View className="ui-demo__badge-box">默认</View>
            </Badge>
            <Badge value="新" variant="primary">
              <View className="ui-demo__badge-box">主要</View>
            </Badge>
            <Badge value="8" variant="success">
              <View className="ui-demo__badge-box">成功</View>
            </Badge>
            <Badge value="!" variant="warning">
              <View className="ui-demo__badge-box">警告</View>
            </Badge>
            <Badge value="5" variant="danger">
              <View className="ui-demo__badge-box">危险</View>
            </Badge>
          </View>
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">徽标样式</Text>
          <View className="ui-demo__row ui-demo__row--badge">
            <Badge dot variant="danger">
              <View className="ui-demo__badge-box">小红点</View>
            </Badge>
            <Badge value="99+" max={99}>
              <View className="ui-demo__badge-box">最大值</View>
            </Badge>
            <Badge value="热" variant="danger" outline>
              <View className="ui-demo__badge-box">轮廓</View>
            </Badge>
          </View>
        </View>

        <View className="ui-demo__group">
          <Text className="ui-demo__subtitle">状态徽标</Text>
          <View className="ui-demo__status-list">
            <StatusBadge status="default" />
            <StatusBadge status="success" />
            <StatusBadge status="processing" />
            <StatusBadge status="error" />
            <StatusBadge status="warning" />
          </View>
          <View className="ui-demo__status-list">
            <StatusBadge status="success" text="已完成" />
            <StatusBadge status="processing" text="进行中" />
            <StatusBadge status="error" text="已失败" />
          </View>
        </View>
      </View>
    </View>
  )
}
