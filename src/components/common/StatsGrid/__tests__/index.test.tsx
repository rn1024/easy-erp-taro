import { render, screen, fireEvent } from '@testing-library/react'
import StatsGrid, { StatsGridItem } from '../index'

const mockItems: StatsGridItem[] = [
  {
    key: 'total',
    label: '总数',
    value: 100,
    iconName: 'inventory',
    iconColor: '#3b82f6'
  },
  {
    key: 'active',
    label: '活跃',
    value: '85%',
    iconName: 'trending_up',
    iconColor: '#10b981',
    trendText: '+5%',
    trendDirection: 'up',
    trendColor: '#10b981'
  },
  {
    key: 'custom',
    label: '自定义',
    value: 42,
    icon: <span data-testid='custom-icon'>自定义图标</span>,
    description: '自定义描述',
    backgroundColor: '#f3f4f6',
    valueColor: '#ef4444'
  }
]

describe('StatsGrid', () => {
  describe('基础渲染', () => {
    it('应该渲染所有统计项', () => {
      render(<StatsGrid items={mockItems} />)

      expect(screen.getByText('总数')).toBeInTheDocument()
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('活跃')).toBeInTheDocument()
      expect(screen.getByText('85%')).toBeInTheDocument()
      expect(screen.getByText('自定义')).toBeInTheDocument()
      expect(screen.getByText('42')).toBeInTheDocument()
    })

    it('应该渲染自定义图标', () => {
      render(<StatsGrid items={mockItems} />)

      expect(screen.getByTestId('custom-icon')).toBeInTheDocument()
    })

    it('应该渲染描述信息', () => {
      render(<StatsGrid items={mockItems} />)

      expect(screen.getByText('自定义描述')).toBeInTheDocument()
    })

    it('应该渲染趋势信息', () => {
      render(<StatsGrid items={mockItems} />)

      expect(screen.getByText('+5%')).toBeInTheDocument()
    })
  })

  describe('样式和布局', () => {
    it('应该应用自定义根类名', () => {
      const { container } = render(
        <StatsGrid items={mockItems} className='custom-class' />
      )

      expect(container.firstChild).toHaveClass('stats-grid', 'custom-class')
    })

    it('应该在单列模式下应用正确的类', () => {
      const { container } = render(
        <StatsGrid items={mockItems} singleColumn />
      )

      expect(container.firstChild).toHaveClass('stats-grid--single')
    })

    it('应该应用项目类名', () => {
      render(<StatsGrid items={mockItems} itemClassName='custom-item-class' />)

      const items = document.querySelectorAll('.stats-grid__item')
      items.forEach(item => {
        expect(item).toHaveClass('custom-item-class')
      })
    })

    it('应该应用项目自定义样式', () => {
      const itemsWithStyles: StatsGridItem[] = [
        {
          key: 'styled',
          label: '有样式的项',
          value: 123,
          backgroundColor: '#f3f4f6',
          valueColor: '#ef4444',
          iconColor: '#3b82f6',
          iconBgColor: '#dbeafe'
        }
      ]

      render(<StatsGrid items={itemsWithStyles} />)

      const item = document.querySelector('.stats-grid__item')
      expect(item).toHaveStyle('background: #f3f4f6')

      const value = document.querySelector('.stats-grid__value')
      expect(value).toHaveStyle('color: #ef4444')
    })
  })

  describe('图标处理', () => {
    it('应该渲染图标名称对应的图标', () => {
      const items: StatsGridItem[] = [
        {
          key: 'with-icon',
          label: '带图标',
          value: 100,
          iconName: 'inventory'
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__icon')).toBeInTheDocument()
    })

    it('应该优先使用自定义图标', () => {
      const items: StatsGridItem[] = [
        {
          key: 'custom-priority',
          label: '优先级测试',
          value: 100,
          icon: <span data-testid='priority-icon'>优先图标</span>,
          iconName: 'inventory' // 这个应该被忽略
        }
      ]

      render(<StatsGrid items={items} />)

      expect(screen.getByTestId('priority-icon')).toBeInTheDocument()
      expect(document.querySelector('.stats-grid__icon')).not.toBeInTheDocument()
    })

    it('不应该在没有图标时渲染图标容器', () => {
      const items: StatsGridItem[] = [
        {
          key: 'no-icon',
          label: '无图标',
          value: 100
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__icon')).not.toBeInTheDocument()
    })
  })

  describe('趋势显示', () => {
    it('应该渲染上升趋势', () => {
      const items: StatsGridItem[] = [
        {
          key: 'trend-up',
          label: '上升趋势',
          value: 100,
          trendText: '+10%',
          trendDirection: 'up',
          trendColor: '#10b981'
        }
      ]

      render(<StatsGrid items={items} />)

      const trend = document.querySelector('.stats-grid__trend')
      expect(trend).toBeInTheDocument()
      expect(trend).toHaveStyle('color: #10b981')
      expect(screen.getByText('+10%')).toBeInTheDocument()
    })

    it('应该渲染下降趋势', () => {
      const items: StatsGridItem[] = [
        {
          key: 'trend-down',
          label: '下降趋势',
          value: 80,
          trendText: '-5%',
          trendDirection: 'down',
          trendColor: '#ef4444'
        }
      ]

      render(<StatsGrid items={items} />)

      expect(screen.getByText('-5%')).toBeInTheDocument()
    })

    it('应该渲染稳定趋势', () => {
      const items: StatsGridItem[] = [
        {
          key: 'trend-stable',
          label: '稳定趋势',
          value: 95,
          trendText: '持平',
          trendDirection: 'stable'
        }
      ]

      render(<StatsGrid items={items} />)

      expect(screen.getByText('持平')).toBeInTheDocument()
    })

    it('不应该在没有趋势文本时渲染趋势', () => {
      const items: StatsGridItem[] = [
        {
          key: 'no-trend',
          label: '无趋势',
          value: 100
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__trend')).not.toBeInTheDocument()
    })
  })

  describe('变体支持', () => {
    it('应该支持flat变体', () => {
      const items: StatsGridItem[] = [
        {
          key: 'flat',
          label: '扁平样式',
          value: 100,
          variant: 'flat'
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__item--flat')).toBeInTheDocument()
    })

    it('应该默认使用default变体', () => {
      const items: StatsGridItem[] = [
        {
          key: 'default',
          label: '默认样式',
          value: 100
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__item--flat')).not.toBeInTheDocument()
    })
  })

  describe('交互行为', () => {
    it('应该在可点击时调用onClick回调', () => {
      const onClick = jest.fn()
      const items: StatsGridItem[] = [
        {
          key: 'clickable',
          label: '可点击',
          value: 100,
          onClick
        }
      ]

      render(<StatsGrid items={items} />)

      const item = document.querySelector('.stats-grid__item')
      fireEvent.click(item!)

      expect(onClick).toHaveBeenCalledTimes(1)
    })

    it('应该在可点击时应用clickable类', () => {
      const items: StatsGridItem[] = [
        {
          key: 'clickable',
          label: '可点击',
          value: 100,
          onClick: jest.fn()
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__item--clickable')).toBeInTheDocument()
    })

    it('不应该在不可点击时应用clickable类', () => {
      const items: StatsGridItem[] = [
        {
          key: 'not-clickable',
          label: '不可点击',
          value: 100
        }
      ]

      render(<StatsGrid items={items} />)

      expect(document.querySelector('.stats-grid__item--clickable')).not.toBeInTheDocument()
    })
  })

  describe('复杂数据类型', () => {
    it('应该支持ReactNode类型的值', () => {
      const items: StatsGridItem[] = [
        {
          key: 'complex-value',
          label: '复杂值',
          value: <span data-testid='complex-value'>复杂值内容</span>
        }
      ]

      render(<StatsGrid items={items} />)

      expect(screen.getByTestId('complex-value')).toBeInTheDocument()
    })

    it('应该支持ReactNode类型的描述', () => {
      const items: StatsGridItem[] = [
        {
          key: 'complex-desc',
          label: '复杂描述',
          value: 100,
          description: <span data-testid='complex-desc'>复杂描述内容</span>
        }
      ]

      render(<StatsGrid items={items} />)

      expect(screen.getByTestId('complex-desc')).toBeInTheDocument()
    })
  })

  describe('空数据处理', () => {
    it('应该正确处理空数组', () => {
      const { container } = render(<StatsGrid items={[]} />)

      expect(container.firstChild).toHaveClass('stats-grid')
      expect(container.querySelector('.stats-grid__item')).not.toBeInTheDocument()
    })
  })
})